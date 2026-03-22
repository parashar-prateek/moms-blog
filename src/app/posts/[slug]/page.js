import Link from 'next/link';
import { getPostBySlug, getAllSlugs } from '@/lib/posts';

function getTagClass(tag) {
  const t = tag.toLowerCase();
  const map = {
    food: 'tag-food', philosophy: 'tag-philosophy', culture: 'tag-culture',
    personal: 'tag-personal', welcome: 'tag-welcome', family: 'tag-family',
    life: 'tag-life', travel: 'tag-travel', spirituality: 'tag-spirituality',
  };
  return map[t] || 'tag-default';
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export async function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  return {
    title: post.title,
    description: post.excerpt || `Read "${post.title}" on Rita's Blog`,
    openGraph: {
      title: post.title,
      description: post.excerpt || `Read "${post.title}" on Rita's Blog`,
      url: `https://ritatude.in/posts/${slug}`,
      type: 'article',
      publishedTime: post.date,
    },
  };
}

export default async function PostPage({ params }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const shareUrl = `https://ritatude.in/posts/${slug}`;
  const shareText = `Read "${post.title}" on Rita's Blog`;
  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;

  return (
    <div>
      <Link href="/" className="back-link">
        ← Back to all posts
      </Link>

      <article className="post-article">
        <div className="post-article-emoji">{post.emoji}</div>

        <div className="tags" style={{ marginBottom: '12px' }}>
          {post.tags.map((tag) => (
            <span key={tag} className={`tag ${getTagClass(tag)}`}>{tag}</span>
          ))}
        </div>

        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">{formatDate(post.date)} · by Rita</div>

        <div className="rangoli-divider">✦ ❋ ✦ ❋ ✦</div>

        <div
          className="post-content"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />

        <div className="rangoli-divider">✦ ❋ ✦ ❋ ✦</div>

        <div className="share-buttons">
          <a href={waUrl} target="_blank" rel="noopener noreferrer" className="share-btn share-btn-whatsapp">
            💬 Share on WhatsApp
          </a>
        </div>
      </article>
    </div>
  );
}
