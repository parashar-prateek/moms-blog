import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getAllPosts() {
  const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));

  const posts = fileNames.map((fileName) => {
    const slug = fileName.replace(/\.md$/, '');
    const fullPath = path.join(postsDirectory, fileName);
    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data } = matter(fileContents);

    return {
      slug,
      title: data.title || slug,
      date: data.date || '2026-01-01',
      tags: data.tags || [],
      emoji: data.emoji || '✍️',
      excerpt: data.excerpt || '',
    };
  });

  return posts.sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
}

export function getAllSlugs() {
  const fileNames = fs.readdirSync(postsDirectory).filter(f => f.endsWith('.md'));
  return fileNames.map((fileName) => fileName.replace(/\.md$/, ''));
}

export async function getPostBySlug(slug) {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    slug,
    title: data.title || slug,
    date: data.date || '2026-01-01',
    tags: data.tags || [],
    emoji: data.emoji || '✍️',
    excerpt: data.excerpt || '',
    contentHtml,
  };
}
