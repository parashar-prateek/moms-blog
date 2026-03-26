'use client';

import { useState } from 'react';
import Link from 'next/link';

const POSTS_PER_PAGE = 10;

function getTagClass(tag) {
  const t = tag.toLowerCase();
  const map = {
    food: 'tag-food', philosophy: 'tag-philosophy', culture: 'tag-culture',
    personal: 'tag-personal', welcome: 'tag-welcome', family: 'tag-family',
    life: 'tag-life', travel: 'tag-travel', spirituality: 'tag-spirituality',
    history: 'tag-history', technology: 'tag-technology', ai: 'tag-ai',
    society: 'tag-society', india: 'tag-india',
  };
  return map[t] || 'tag-default';
}

function formatDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function PostsGrid({ posts }) {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const start = (page - 1) * POSTS_PER_PAGE;
  const visiblePosts = posts.slice(start, start + POSTS_PER_PAGE);

  return (
    <>
      <div className="posts-grid">
        {visiblePosts.map((post) => (
          <Link href={`/posts/${post.slug}`} key={post.slug} className="post-card">
            <div className="post-card-emoji">{post.emoji}</div>
            <div className="post-card-date">{formatDate(post.date)}</div>
            <h2 className="post-card-title">{post.title}</h2>
            {post.excerpt && <p className="post-card-excerpt">{post.excerpt}</p>}
            <div className="tags">
              {post.tags.map((tag) => (
                <span key={tag} className={`tag ${getTagClass(tag)}`}>{tag}</span>
              ))}
            </div>
          </Link>
        ))}

        {posts.length === 0 && (
          <p style={{ textAlign: 'center', padding: '48px 24px', color: '#999', fontSize: '16px' }}>
            No posts yet. Check back soon!
          </p>
        )}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage(p => p - 1)}
            disabled={page === 1}
          >
            Newer
          </button>
          <span className="pagination-info">
            Page {page} of {totalPages}
          </span>
          <button
            className="pagination-btn"
            onClick={() => setPage(p => p + 1)}
            disabled={page === totalPages}
          >
            Older
          </button>
        </div>
      )}
    </>
  );
}
