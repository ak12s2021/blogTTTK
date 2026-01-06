// 设备数据配置文件

export interface Device {
	name: string;
	image: string;
	specs: string;
	description: string;
	link: string;
}

// 设备类别类型，支持品牌和自定义类别
export type DeviceCategory = {
	[categoryName: string]: Device[];
} & {
	自定义?: Device[];
};

export const devicesData: DeviceCategory = {
	IQOO10: [
		{
			name: "IQOO 10",
			image: "https://wwwstatic.vivo.com.cn/vivoportal/files/image/detail/20220725/274c839032f05fc9a86be8e7a20b62f6.png",
			specs: "Black / 12G + 256G",
			description:
				"第一代骁龙 8+ 120w soc",
			link: "https://www.vivo.com.cn/vivo/iqoo10/",
		},
	],
	MacBookAir_M1: [
		{
			name: "MacBook Air (M1, 2020)",
			image: "https://cdsassets.apple.com/live/SZLF0YNV/images/sp/111883_macbookair.png",
			specs: "Silver / 16G + 256G",
			description:
				"",
			link: "https://support.apple.com/en-us/111883",
		},
	],
	天选4: [
		{
			name: "天选4 锐龙版",
			image: "https://dlcdnwebimgs.asus.com.cn/gain/735ac56d-5d65-4a36-a7f3-aa208ba2d075/w800/fwebp",
			specs: "40G + 4T",
			description:
				"",
			link: "https://www.asus.com.cn/laptops/for-gaming/tuf-gaming/asus-tuf-gaming-a15-2023/",
		},
	],
};
