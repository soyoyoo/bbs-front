export async function apiRequest(path, options) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
  });
  const text = await response.text();

  if (!response.ok) {
    throw new Error(`서버 요청에 실패했습니다. (HTTP ${response.status})`);
  }

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error('서버가 JSON이 아닌 응답을 반환했습니다. 로그인 상태와 API 경로를 확인해 주세요.');
    }
    throw error;
  }
}
