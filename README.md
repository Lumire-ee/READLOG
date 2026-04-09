## 📚BookLog

"글을 잘 써야 한다는 부담과 압박을 내려두고, 가볍게 기록을 시작해보세요."
BookLog는 기존 서비스들의 번거로운 입력 절차와 플랫폼 제약을 해결해,
독서 기록을 더 쉽고 가볍게 남길 수 있도록 만든 웹 서비스입니다.

## 📖 프로젝트 소개

### 💡 기획 배경
기존 독서 기록 서비스들은 다음과 같은 불편함이 있었습니다.
- 플랫폼 파편화: PC와 모바일 환경을 동시에 만족하는 서비스 부족
- 번거로운 입력: 직접 도서 정보를 입력하거나, 특정 모바일 앱에서만 검색이 가능한 불편함

### ✨ 서비스 목표
- 통합 검색: 여러 도서 API를 활용하여 정확한 도서 정보 제공
- 멀티 플랫폼: 웹 기반의 반응형 UI/UX

## 🛠 기술 스택

### Frontend
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![React Query](https://img.shields.io/badge/React_Query-FF4154?style=for-the-badge&logo=reactquery&logoColor=white)
![Zustand](https://img.shields.io/badge/Zustand-000000?style=for-the-badge&logo=zustand&logoColor=white)
### Backend
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB)
### UI/UX
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn/ui-black?style=for-the-badge&logo=radixui&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-8884d8?style=for-the-badge)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=for-the-badge&logo=framer&logoColor=white)
### BaaS 
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
### Code Quality 
![ESLint](https://img.shields.io/badge/ESLint-4B32C3?style=for-the-badge&logo=eslint&logoColor=white)
![Prettier](https://img.shields.io/badge/Prettier-F7B93E?style=for-the-badge&logo=prettier&logoColor=black)

## ✨ 주요 기능

### 🔐 인증
- 이메일/비밀번호 회원가입 및 로그인
- Kakao, Google OAuth 로그인 (Supabase Auth)
### 🔍 책 검색
- 네이버 + 구글 API 통합 검색
- 중복 제거 및 품질 기반 데이터 정제
### 📁 책 관리
- 폴더 단위 책 정리
- 상태 기반 관리 (`to_read`, `reading`, `completed`, `quit`)
### 📝 독서 기록
- 현재 페이지, 기록, 별점, 날짜 및 암호화된 메모 작성
### 📊 통계
- 월별 완독 추이, 평점 분포 등 통계 제공


## 🚀 실행 전 준비

- Node.js 20 이상 권장
- npm 10 이상 권장
- Supabase 프로젝트(테이블/RPC/Storage 버킷) 준비
- Naver Open API, Google Books API 키 준비

## 💻 설치

## 환경 변수

### 1) 프론트엔드 (`.env.local` 또는 `.env`)

```env
VITE_SUPABASE_URL=<your_url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your_key>
VITE_GOOGLE_API_KEY=<your_google_key>
VITE_API_BASE_URL=http://localhost:5000
```

### 2) 백엔드 (`backend/.env`)

```env
SUPABASE_URL=<your_url>
SUPABASE_SERVICE_ROLE_KEY=<your_role_key>
NAVER_CLIENT_ID=<your_id>
NAVER_CLIENT_SECRET=<your_secret>
THUMB_BUCKET=thumbnails
NOTES_ENCRYPTION_KEY=<your_base64_32byte_key>
```

`NOTES_ENCRYPTION_KEY` 생성 예시:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

## 로컬 실행

터미널 2개를 사용해 프론트/백엔드를 함께 실행합니다.

```bash
# 의존성 설치
npm install

# 프론트엔드 실행 (Terminal 1)
npm run dev

# 백엔드 실행 (Terminal 2)
npm run start
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`


## 🏗️ Supabase 요구사항

앱 동작을 위해 아래 리소스가 필요합니다.

- 주요 테이블: `books`, `user_books`, `profiles`, `library_folders`
- Storage bucket: `thumbnails` (또는 `THUMB_BUCKET`으로 지정한 이름)
- RPC 함수:
  - `add_book_to_user`
  - `create_library_folder`
  - `move_library_books`
  - `delete_library_books`
  - `delete_library_folder`

## 📂 프로젝트 구조(요약)

```text
BookLog/
├─ src/
│  ├─ features/        # 도메인별 기능(auth, books, home, profile, stats, landing)
│  ├─ pages/           # 라우트 페이지
│  ├─ layouts/         # 페이지 레이아웃
│  ├─ components/ui/   # 공통 UI 컴포넌트
│  ├─ lib/             # Supabase 클라이언트, 공통 유틸
│  └─ shared/          # 공용 타입/상수/유틸
├─ backend/            # Express API 서버
└─ README.md
```

## 💡 트러블 슈팅
### ❗통합 검색 데이터 품질 문제

🔍 네이버와 구글 API 병합 사용에 따른 문제
- 동일한 책이 중복 노출됨
- 일부 데이터는 필수 정보가 누락된 경우 존재
- 개정판/번역판 등 판본에 따라 같은 책이 별개의 데이터로 존재
> 검색 결과의 부재를 최소화하기 위한 결정이었으나 사용자 경험이 저하되는 문제가 발생

✅ 해결 전략
1. 중복 제거
   - ISBN (책 고유 식별번호) 기준 비교
   - ISBN이 없는 경우 '제목 + 저자 + 출판사' 조합
2. 품질 점수 기반 데이터 선택
   - 각 데이터에 가중치를 부여하여 신뢰도 높은 데이터를 선택
   - ISBN(+5점), Image(+2점), Publisher(+1점), Author(+1점)
3. Low Quality 데이터 필터링
   - 제목, 저자, 출판사, 이미지가 없는 데이터 제거
4. 데이터 정제
   - 에디션 키워드(개정판, 한정판 등) 포함 데이터 제거
   - 기본판이 존재할 경우 에디션 데이터 제외
   - 한글 검색 시 불필요한 원어판 제거(영문판, English Edition 등)

### ❗이미지 렌더링 및 로딩 문제

🔍 네이버 도서 API에서 제공하는 일부 썸네일 이미지가 https 환경에서 정상적으로 표시되지 않는 문제
- 브라우저 보안 정책(Mixed Content)에 의해 http 이미지 요청 차단
- 일부 도서 썸네일이 깨진 이미지로 표시됨
> 검색 결과의 신뢰도와 UI 완성도가 저하되는 문제 발생

✅ 해결 전략
1. 이미지 프록시 서버
   - Express 기반 백엔드에 이미지 프록시를 구축하여 서버를 통해 중계
2. 이미지 캐싱
   - 자주 조회되는 이미지를 Supabase Storage에 저장
   - 이후 요청은 Storage에서 직접 제공


## 🔗 배포 주소

- https://daily-booklog.vercel.app
