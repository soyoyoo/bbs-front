import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiRequest } from '../api';

export default function PostList() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [postsError, setPostsError] = useState('');
  const [userError, setUserError] = useState('');

  useEffect(() => {
    let isActive = true;

    apiRequest('/api/v1/user')
      .then((data) => {
        if (isActive) setUser(data);
      })
      .catch((error) => {
        if (isActive) setUserError(error.message);
      });

    apiRequest('/api/v1/posts')
      .then((data) => {
        if (!Array.isArray(data)) {
          throw new Error('게시글 API 응답 형식이 올바르지 않습니다.');
        }
        if (isActive) setPosts(data);
      })
      .catch((error) => {
        if (isActive) setPostsError(error.message);
      })
      .finally(() => {
        if (isActive) setIsLoading(false);
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <section>
      <header className="page-header">
        <div>
          <p className="eyebrow">SOYOYOO BOARD</p>
          <h1>게시글</h1>
        </div>
        <div className="auth-actions">
          {user ? (
            <>
              <span className="user-label">{user.name}님</span>
              <a className="button button-secondary" href="/logout">로그아웃</a>
              <Link className="button button-primary" to="/posts/save">글 등록</Link>
            </>
          ) : (
            <>
              {userError && <p className="inline-error">{userError}</p>}
              <a className="button button-secondary" href="/oauth2/authorization/google">Google 로그인</a>
              <a className="button button-primary" href="/oauth2/authorization/naver">Naver 로그인</a>
            </>
          )}
        </div>
      </header>

      {postsError && <p className="notice notice-error" role="alert">{postsError}</p>}
      {isLoading ? (
        <p className="notice" role="status">게시글을 불러오는 중입니다.</p>
      ) : postsError ? null : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th scope="col">번호</th>
                <th scope="col">제목</th>
                <th scope="col">작성자</th>
                <th scope="col">최종 수정</th>
              </tr>
            </thead>
            <tbody>
              {posts.length === 0 ? (
                <tr>
                  <td className="empty-state" colSpan="4">등록된 게시글이 없습니다.</td>
                </tr>
              ) : posts.map((post) => (
                <tr key={post.id}>
                  <td>{post.id}</td>
                  <td><Link to={`/posts/update/${post.id}`}>{post.title}</Link></td>
                  <td>{post.author}</td>
                  <td>{post.modifiedDate ? new Date(post.modifiedDate).toLocaleString('ko-KR') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
