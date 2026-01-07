import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// 在 ESModule 中模拟 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// WordPress 导出文件路径（请根据需要修改）
const XML_PATH =
	'/Users/liutingkai/Downloads/WordPress.2026-01-07 (1).xml';

// 输出目录：Astro 内容目录
const OUTPUT_DIR = path.join(__dirname, 'src', 'content', 'posts');

// 读取 XML
const xml = fs.readFileSync(XML_PATH, 'utf8');

// 提取所有 <item>（每篇文章）
const itemRegex = /<item>([\s\S]*?)<\/item>/g;
let match;
let count = 0;

// 简单的 HTML 实体解码
const decodeEntities = (str) =>
	str
		.replace(/&nbsp;/g, ' ')
		.replace(/&amp;/g, '&')
		.replace(/&lt;/g, '<')
		.replace(/&gt;/g, '>')
		.replace(/&#038;/g, '&')
		.replace(/&#8217;/g, "'")
		.replace(/&#8220;/g, '"')
		.replace(/&#8221;/g, '"');

// 生成不会重复的文件名：20240107.md, 20240107-1.md, ...
const getUniqueFileName = (baseName) => {
	let fileName = `${baseName}.md`;
	let i = 1;
	while (fs.existsSync(path.join(OUTPUT_DIR, fileName))) {
		fileName = `${baseName}-${i}.md`;
		i += 1;
	}
	return fileName;
};

while ((match = itemRegex.exec(xml)) !== null) {
	const itemContent = match[1];

	// 只处理文章 post
	const typeMatch = itemContent.match(
		/<wp:post_type><!\[CDATA\[(.*?)\]\]><\/wp:post_type>/,
	);
	const postType = typeMatch ? typeMatch[1].trim() : '';
	if (postType !== 'post') continue;

	// 只处理已发布的文章
	const statusMatch = itemContent.match(
		/<wp:status><!\[CDATA\[(.*?)\]\]><\/wp:status>/,
	);
	const status = statusMatch ? statusMatch[1].trim() : '';
	if (status !== 'publish') continue;

	// 标题
	const titleMatch = itemContent.match(
		/<title><!\[CDATA\[(.*?)\]\]><\/title>/,
	);
	const rawTitle = titleMatch ? titleMatch[1].trim() : '未命名文章';
	const title = decodeEntities(rawTitle);

	// 正文（保留 HTML，让 Markdown 直接渲染）
	const contentMatch = itemContent.match(
		/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/,
	);
	if (!contentMatch) continue;
	let content = contentMatch[1].trim();
	if (!content) continue;
	content = decodeEntities(content)
		.replace(/\r\n/g, '\n')
		.replace(/\r/g, '\n')
		.trim();

	// 时间：<wp:post_date><![CDATA[2024-09-11 10:59:20]]></wp:post_date>
	const dateMatch = itemContent.match(
		/<wp:post_date><!\[CDATA\[(.*?)\]\]><\/wp:post_date>/,
	);
	if (!dateMatch) continue;
	const dateStr = dateMatch[1].trim();
	if (!dateStr || dateStr.startsWith('0000-00-00')) continue;

	const [datePart] = dateStr.split(' '); // 2024-09-11
	const published = datePart;
	const baseName = datePart.replace(/-/g, ''); // 20240911

	// 分类（WordPress 的 category domain="category"）
	const categoryRegex =
		/<category[^>]*domain="category"[^>]*><!\[CDATA\[(.*?)\]\]><\/category>/g;
	let catMatch;
	const categories = [];
	while ((catMatch = categoryRegex.exec(itemContent)) !== null) {
		categories.push(catMatch[1].trim());
	}
	const category = categories[0] || '日记';

	// 标签（WordPress 的 category domain="post_tag"）
	const tagRegex =
		/<category[^>]*domain="post_tag"[^>]*><!\[CDATA\[(.*?)\]\]><\/category>/g;
	let tagMatch;
	const tags = [];
	while ((tagMatch = tagRegex.exec(itemContent)) !== null) {
		tags.push(tagMatch[1].trim());
	}

	const tagsLine =
		tags.length > 0
			? `tags: [${tags.map((t) => JSON.stringify(t)).join(', ')}]`
			: 'tags: []';

	// 生成 Frontmatter（参考 suyuri.md）
	const frontmatterLines = [
		'---',
		`title: ${JSON.stringify(title)}`,
		`published: ${published}`,
		tagsLine,
		`category: ${JSON.stringify(category)}`,
		'draft: false',
		'---',
		'',
	];

	const fileContent = frontmatterLines.join('\n') + content + '\n';

	// 确保目录存在
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	const fileName = getUniqueFileName(baseName);
	const outPath = path.join(OUTPUT_DIR, fileName);

	fs.writeFileSync(outPath, fileContent, 'utf8');
	count += 1;
	console.log(`生成文章: ${outPath}`);
}

console.log(`共生成 ${count} 篇文章。`);


