# bbs-front

React 게시판 클라이언트입니다. Nginx의 `/bbs-front/`에서 정적 파일로 서비스하고, `/api/v1/` 요청과 OAuth 경로는 기존 Spring Boot 서버로 전달합니다.

## 빌드 및 배포

```sh
npm ci
npm run lint
npm run build
```

`dist` 폴더의 **내용물**을 Nginx의 `/usr/share/nginx/html/bbs-front/`에 복사합니다. 배포 후 `http://<EC2 주소>/bbs-front/`로 접속합니다. 게시글 화면의 직접 진입과 새로고침은 Nginx의 SPA fallback이 처리합니다.

Nginx 설정은 이전 빌드의 `/assets/...`, `/favicon.svg` 절대 경로도 새 배포 중 동작하도록 `bbs-front`의 파일로 연결합니다. 새 빌드를 배포할 때는 반드시 `dist/index.html`을 포함한 **최신 dist 내용물**을 대상 경로에 복사해야 합니다. HTML은 캐시하지 않도록 설정되어 있습니다.

Nginx 설정은 Spring Boot 주소를 지정하는 `/etc/nginx/conf.d/service-url.inc`를 포함합니다. 해당 파일에서 `$service_url`이 활성 Spring Boot 포트(예: `http://127.0.0.1:8081`)를 가리키는지 확인하고, 설정 검사 후 Nginx를 reload 해야 합니다.

## 백엔드 API 요구사항

클라이언트가 사용하는 경로:

- `GET /api/v1/user`
- `GET /api/v1/posts`
- `POST /api/v1/posts`
- `PUT`, `DELETE /api/v1/posts/{id}`
- `GET /api/v1/posts/{id}`

현재 연결된 Spring Boot 저장소에는 `GET /api/v1/posts` 목록 API가 없습니다. 이 API는 게시글 배열을 JSON으로 반환해야 하며, 현재 Spring Security 설정에서 `/api/v1/**`가 인증을 요구하므로 목록을 비로그인 상태에서도 공개하려면 해당 권한 설정도 백엔드에서 조정해야 합니다. 그렇지 않으면 로그인한 사용자만 목록을 받을 수 있습니다.

Spring Boot OAuth2 로그인 공급자의 callback URL은 `/login/oauth2/code/{registrationId}`이며, EC2 공개 도메인과 일치하도록 각 공급자 콘솔의 redirect URI 및 백엔드 OAuth 설정을 등록해야 합니다.
