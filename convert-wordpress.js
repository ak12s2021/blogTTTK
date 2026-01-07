const fs = require('fs');

const xml = fs.readFileSync('/Users/liutingkai/Downloads/WordPress.2026-01-07.xml', 'utf8');

// 提取所有 item 标签
const itemRegex = /<item>([\s\S]*?)<\/item>/g;
const items = [];
let match;

while ((match = itemRegex.exec(xml)) !== null) {
  const itemContent = match[1];
  
  // 提取 title
  const titleMatch = itemContent.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/);
  const title = titleMatch ? titleMatch[1].trim() : '';
  
  // 提取 content
  const contentMatch = itemContent.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/);
  let content = contentMatch ? contentMatch[1].trim() : '';
  
  // 如果没有内容，跳过
  if (!content || content.length === 0) continue;
  
  // 去除 HTML 标签，但保留换行
  content = content
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<hr\s*\/?>/gi, '\n---\n')
    .replace(/<blockquote>/gi, '')
    .replace(/<\/blockquote>/gi, '')
    .replace(/<h[1-6][^>]*>/gi, '\n')
    .replace(/<\/h[1-6]>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&#038;/g, '&')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .replace(/^\s+|\s+$/g, '')
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .trim();
  
  // 提取日期
  const dateMatch = itemContent.match(/<wp:post_date><!\[CDATA\[(.*?)\]\]><\/wp:post_date>/);
  if (!dateMatch) continue;
  
  const dateStr = dateMatch[1];
  // 转换日期格式：2024-09-11 10:59:20 -> 2024-09-11T10:59:20Z
  const [datePart, timePart] = dateStr.split(' ');
  const isoDate = datePart + 'T' + timePart + 'Z';
  
  items.push({
    title,
    content,
    date: isoDate
  });
}

// 按日期排序（从新到旧）
items.sort((a, b) => new Date(b.date) - new Date(a.date));

// 生成 diary 数组代码
let diaryCode = '';
items.forEach((item, index) => {
  const id = index + 4; // 从4开始
  // 转义特殊字符
  const contentEscaped = item.content
    .replace(/\\/g, '\\\\')
    .replace(/`/g, '\\`')
    .replace(/\${/g, '\\${')
    .replace(/\n/g, '\\n');
  
  diaryCode += `\t{\n\t\tid: ${id},\n\t\tcontent: \`${contentEscaped}\`,\n\t\tdate: "${item.date}",\n\t},\n`;
});

console.log(`// 从 WordPress 导入的 ${items.length} 条日记\n${diaryCode}`);

