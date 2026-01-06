import argparse
from pathlib import Path
from typing import Optional

from PIL import Image


def process_image(
    src: Path,
    dst: Path,
    width: Optional[int] = None,
    height: Optional[int] = None,
    quality: int = 85,
    keep_ratio: bool = True,
    crop_center: bool = False,
) -> None:
    """
    处理单张图片：根据参数进行缩放 / 压缩（可选居中裁剪），并保存到目标路径。

    :param src: 源图片路径
    :param dst: 输出图片路径
    :param width: 目标宽度（像素），可选
    :param height: 目标高度（像素），可选
    :param quality: 压缩质量（1-100，仅对 JPEG/WebP 有效）
    :param keep_ratio: 缩放时是否保持宽高比
    :param crop_center: 是否进行居中裁剪到指定宽高
    """
    dst.parent.mkdir(parents=True, exist_ok=True)

    with Image.open(src) as im:
        im = im.convert("RGBA") if im.mode in ("P", "RGBA") else im.convert("RGB")

        orig_w, orig_h = im.size

        # 如果没有指定宽高，只做有损压缩（比如 JPEG/WebP 的质量）
        if width is None and height is None:
            pass
        else:
            # 先按比例缩放
            if keep_ratio:
                # 只给宽或只给高，则按给定一边等比缩放
                if width is None:
                    scale = height / orig_h
                    width = int(orig_w * scale)
                elif height is None:
                    scale = width / orig_w
                    height = int(orig_h * scale)

                # 这里 width 和 height 一定都有值
                assert width is not None and height is not None

                if crop_center:
                    # 为了后面裁剪，先等比缩放到“至少覆盖”目标尺寸
                    scale = max(width / orig_w, height / orig_h)
                    new_w = int(orig_w * scale)
                    new_h = int(orig_h * scale)
                    im = im.resize((new_w, new_h), Image.LANCZOS)

                    # 居中裁剪
                    left = (new_w - width) // 2
                    top = (new_h - height) // 2
                    right = left + width
                    bottom = top + height
                    im = im.crop((left, top, right, bottom))
                else:
                    # 普通等比缩放到“完全包含”在目标尺寸内
                    scale = min(width / orig_w, height / orig_h)
                    new_w = int(orig_w * scale)
                    new_h = int(orig_h * scale)
                    im = im.resize((new_w, new_h), Image.LANCZOS)
            else:
                # 不保持比例，直接拉伸到指定宽高
                if width is None or height is None:
                    raise ValueError("在 keep_ratio=False 时必须同时指定 width 和 height")
                im = im.resize((width, height), Image.LANCZOS)

        ext = dst.suffix.lower()
        save_kwargs: dict = {}

        if ext in {".jpg", ".jpeg", ".webp"}:
            save_kwargs["quality"] = quality
            save_kwargs["optimize"] = True
        if ext == ".webp":
            save_kwargs.setdefault("method", 6)

        # 对 PNG，可以开启压缩等级
        if ext == ".png":
            save_kwargs["optimize"] = True

        im.save(dst, **save_kwargs)


def main() -> None:
    parser = argparse.ArgumentParser(
        description="批量将图片裁剪/压缩到指定大小，并输出到 assets 目录下指定子文件夹。",
    )

    parser.add_argument(
        "src",
        type=str,
        help="源图片路径，可以是单张图片或目录。",
    )
    parser.add_argument(
        "dst_subdir",
        type=str,
        nargs="?",
        default="output",
        help=(
            "输出到项目中的子目录（相对 `src/assets/images`），"
            "例如：`anime` 或 `desktop-banner`。默认值为 `output`。"
        ),
    )
    parser.add_argument(
        "--width",
        type=int,
        default=None,
        help="目标宽度（像素，可选）。",
    )
    parser.add_argument(
        "--height",
        type=int,
        default=None,
        help="目标高度（像素，可选）。",
    )
    parser.add_argument(
        "--quality",
        type=int,
        default=85,
        help="压缩质量（1-100，仅对 JPEG/WebP 有效，默认 85）。",
    )
    parser.add_argument(
        "--no-keep-ratio",
        action="store_true",
        help="不保持宽高比，直接拉伸到指定宽高（需要同时指定 width 和 height）。",
    )
    parser.add_argument(
        "--crop-center",
        action="store_true",
        help="先按比例缩放再居中裁剪到指定尺寸（适合做统一封面）。",
    )
    parser.add_argument(
        "--to-src",
        action="store_true",
        help="默认输出到 `public/assets/<dst_subdir>`；"
        "如果加上本参数，则输出到 `src/assets/<dst_subdir>`。",
    )
    parser.add_argument(
        "--ext",
        type=str,
        default=None,
        help="输出文件扩展名（例如：webp、jpg、png）。默认保持原始格式。",
    )

    args = parser.parse_args()

    src_path = Path(args.src).expanduser().resolve()

    project_root = Path(__file__).resolve().parents[1]
    base_assets = project_root / ("src/assets" if args.to_src else "src/assets/images")
    dst_dir = (base_assets / args.dst_subdir).resolve()

    if args.ext:
        out_ext = "." + args.ext.lstrip(".").lower()
    else:
        out_ext = None

    if src_path.is_file():
        images = [src_path]
    elif src_path.is_dir():
        images = [
            p
            for p in src_path.rglob("*")
            if p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp", ".gif"}
        ]
    else:
        raise FileNotFoundError(f"源路径不存在: {src_path}")

    if not images:
        print("未找到任何图片文件。")
        return

    print(f"找到 {len(images)} 张图片，将输出到: {dst_dir}")

    for img in images:
        rel_name = img.stem + (out_ext or img.suffix.lower())
        dst = dst_dir / rel_name
        print(f"- 处理: {img} -> {dst}")
        process_image(
            src=img,
            dst=dst,
            width=args.width,
            height=args.height,
            quality=args.quality,
            keep_ratio=not args.no_keep_ratio,
            crop_center=args.crop_center,
        )

    print("全部处理完成。")


if __name__ == "__main__":
    main()



#python docs/image.py ./docs/image/1.webp anime --width 800 --quality 80
# python docs/image.py ./docs/image/main.jpeg --width 1000 --height 1000 --quality 80 --crop-center  --ext webp
    # -width：目标宽度（像素）
    # -height：目标高度（像素）
    # -quality：压缩质量 1–100（默认 85，用于 jpg/webp）
    # -crop-center：先等比缩放，再居中裁剪到指定宽高（做统一封面很好用）
    # -no-keep-ratio：不保持宽高比，强行拉伸到指定宽高（需要同时指定 -width 和 -height）
    # -to-src：输出到 src/assets/<子目录> 而不是 public/assets/<子目录>
    # -ext：指定输出格式，比如 webp / jpg / png，默认保持原来的后缀

# python image.py ../Users/liutingkai/Pictures/博客暂存/pixiv_works_137439499_p0.jpeg output.webp --crop --resize 1000 1000