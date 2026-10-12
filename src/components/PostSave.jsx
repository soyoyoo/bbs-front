import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../api';

export default function PostSave() {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await apiRequest('/api/v1/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, author, content }),
      });
      navigate('/');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="form-page">
      <p className="eyebrow">NEW POST</p>
      <h1>게시글 등록</h1>
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      <form className="post-form" onSubmit={handleSubmit}>
        <label htmlFor="title">제목</label>
        <input
          id="title"
          name="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength="500"
          required
        />

        <label htmlFor="author">작성자</label>
        <input
          id="author"
          name="author"
          value={author}
          onChange={(event) => setAuthor(event.target.value)}
          maxLength="100"
          required
        />

        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          name="content"
          value={content}
          onChange={(event) => setContent(event.target.value)}
          rows="12"
          required
        />

        <div className="form-actions">
          <Link className="button button-secondary" to="/">취소</Link>
          <button className="button button-primary" type="submit" disabled={isSaving}>
            {isSaving ? '등록 중...' : '등록'}
          </button>
        </div>
      </form>
    </section>
  );
}
