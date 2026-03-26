import { getAllPosts } from '@/lib/posts';
import PostsGrid from '@/components/PostsGrid';

export default function HomePage() {
  const posts = getAllPosts();

  return <PostsGrid posts={posts} />;
}
