import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { apiRequest } from '../api';

export default function PostUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;

    apiRequest(`/api/v1/posts/${encodeURIComponent(id)}`)
      .then((post) => {
        if (!post || typeof post !== 'object') {
          throw new Error('게시글 응답 형식이 올바르지 않습니다.');
        }
        if (isActive) {
          setTitle(post.title ?? '');
          setAuthor(post.author ?? '');
          setContent(post.content ?? '');
        }
      })
      .catch((requestError) => {
        if (isActive) setError(requestError.message);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, [id]);

  async function handleUpdate(event) {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      await apiRequest(`/api/v1/posts/${encodeURIComponent(id)}`, {
        method: 'PUT',
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

  async function handleDelete() {
    if (!window.confirm('게시글을 삭제하시겠습니까?')) return;

    setError('');
    setIsSaving(true);
    try {
      await apiRequest(`/api/v1/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
      navigate('/');
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <section className="form-page">
      <p className="eyebrow">EDIT POST</p>
      <h1>게시글 수정</h1>
      {error && <p className="notice notice-error" role="alert">{error}</p>}
      {isLoading ? (
        <p className="notice" role="status">게시글을 불러오는 중입니다.</p>
      ) : !error && (
        <form className="post-form" onSubmit={handleUpdate}>
          <label htmlFor="post-id">글 번호</label>
          <input id="post-id" value={id} readOnly />

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
          <input id="author" name="author" value={author} readOnly />

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
            <button className="button button-danger" type="button" onClick={handleDelete} disabled={isSaving}>
              삭제
            </button>
            <button className="button button-primary" type="submit" disabled={isSaving}>
              {isSaving ? '저장 중...' : '수정 완료'}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
