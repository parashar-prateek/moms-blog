'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

const BAD_WORDS = [
  // English
  'fuck', 'fuk', 'fck', 'fuq',
  'shit', 'sht',
  'bitch', 'biatch',
  'asshole', 'arsehole',
  'bastard', 'piss', 'prick',
  'dick', 'dik',
  'cock', 'cok',
  'pussy', 'cunt',
  'whore', 'slut',
  'nigger', 'nigga',
  'faggot', 'retard',
  'wanker', 'twat', 'tosser',
  'bullshit', 'horseshit', 'motherfucker',
  // Hindi / Hinglish
  'chutiya', 'chutia', 'choot', 'chut',
  'madarchod', 'maderchod',
  'behenchod', 'bhenchod',
  'bhosdike', 'bhosdiwale',
  'gaandu', 'gandu', 'gaand', 'gand',
  'harami', 'haramzada', 'haramzadi',
  'randi', 'raand',
  'lauda', 'lavda', 'lund', 'lodu',
  'bsdk', 'mfkr',
  'kamina', 'kamine',
];

// Long, unambiguous roots that are blocked even inside other words
// (fucking, bullshitter). Everything else in BAD_WORDS must match a whole
// word, so innocent text like "amazing and", "all understand", "Gandhi"
// or "laudable" is never flagged.
const BAD_ROOTS = [
  'fuck', 'shit', 'bitch', 'asshole', 'arsehole', 'motherfucker',
  'nigger', 'nigga', 'faggot', 'madarchod', 'maderchod',
  'behenchod', 'bhenchod', 'bhosdi', 'chutiya', 'chutia', 'haramzad',
];
const BAD_WORD_SET = new Set(BAD_WORDS);

// Split text into words, normalizing common bypass tricks:
// - leetspeak: sh1t, fu(k, @ss
// - repeated chars: fuuuck, shhit (both raw and collapsed forms are checked)
// - separators: f.u.c.k, f-u-c-k, f u c k (runs of single letters are rejoined)
function tokenize(text) {
  const t = text.toLowerCase()
    .replace(/0/g, 'o').replace(/1/g, 'i').replace(/3/g, 'e')
    .replace(/4/g, 'a').replace(/5/g, 's').replace(/7/g, 't')
    .replace(/@/g, 'a').replace(/\$/g, 's').replace(/!/g, 'i')
    .replace(/\(/g, 'c').replace(/\+/g, 't');
  const words = t.split(/[^a-zऀ-ॿ]+/).filter(Boolean);

  const tokens = [];
  let run = '';
  for (const w of words) {
    if (w.length === 1) { run += w; continue; }
    if (run) { tokens.push(run); run = ''; }
    tokens.push(w);
  }
  if (run) tokens.push(run);

  return tokens.flatMap((w) => [w, w.replace(/(.)\1+/g, '$1')]);
}

function containsProfanity(text) {
  return tokenize(text).some((tok) =>
    BAD_WORD_SET.has(tok) ||
    BAD_WORD_SET.has(tok.replace(/e?s$/, '')) ||
    BAD_ROOTS.some((root) => tok.includes(root))
  );
}

function formatCommentDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'long', day: 'numeric',
  });
}

export default function CommentsSection({ postSlug }) {
  const [comments, setComments] = useState([]);
  const [name, setName] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchComments() {
      const { data } = await supabase
        .from('comments')
        .select('id, name, body, created_at')
        .eq('post_slug', postSlug)
        .order('created_at', { ascending: true });
      if (data) setComments(data);
    }
    fetchComments();
  }, [postSlug]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');

    const trimmedName = name.trim();
    const trimmedBody = body.trim();

    if (!trimmedName) return setError('Please enter your name.');
    if (!trimmedBody) return setError('Please write a comment.');
    if (containsProfanity(trimmedName) || containsProfanity(trimmedBody)) {
      return setError('Please keep the conversation respectful — abusive language is not allowed.');
    }

    setLoading(true);
    const { data, error: dbError } = await supabase
      .from('comments')
      .insert({ post_slug: postSlug, name: trimmedName, body: trimmedBody })
      .select()
      .single();

    setLoading(false);

    if (dbError) {
      setError('Something went wrong. Please try again.');
    } else {
      setComments((prev) => [...prev, data]);
      setName('');
      setBody('');
      setSuccess(true);
      setTimeout(() => setSuccess(false), 4000);
    }
  }

  return (
    <div className="comments-section">
      <h2 className="comments-heading">Comments</h2>

      {comments.length === 0 ? (
        <p className="comments-empty">Be the first to leave a comment!</p>
      ) : (
        <div className="comments-list">
          {comments.map((c) => (
            <div key={c.id} className="comment-card">
              <div className="comment-meta">
                <span className="comment-name">{c.name}</span>
                <span className="comment-date">{formatCommentDate(c.created_at)}</span>
              </div>
              <p className="comment-body">{c.body}</p>
            </div>
          ))}
        </div>
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        <h3 className="comment-form-heading">Leave a comment</h3>
        <input
          className="comment-input"
          type="text"
          placeholder="Your name *"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={80}
        />
        <textarea
          className="comment-textarea"
          placeholder="Write your comment here... *"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          maxLength={3000}
        />
        {error && <p className="comment-error">{error}</p>}
        {success && <p className="comment-success">Thank you for your comment! 🙏</p>}
        <button className="comment-submit" type="submit" disabled={loading}>
          {loading ? 'Posting...' : 'Post Comment'}
        </button>
      </form>
    </div>
  );
}
