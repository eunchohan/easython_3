# 2025 Easython 3팀 — 단국대 분실물 지도 서비스:   일'단' 찾아줘

이 프로젝트는 단국대학교 캠퍼스 내 분실물을 등록하고 확인할 수 있는 웹 서비스입니다.

백엔드는 Node.js + Express + SQLite
프론트엔드는 HTML/CSS/JS 정적 페이지 기반으로 구성되어 있습니다.

## <실행 방법>
로컬 환경에서 프로젝트를 실행하려면 아래 명령을 순서대로 입력하세요.
1. 프론트엔드 서버 실행
프론트는 Python의 간단한 HTTP 서버로 띄웁니다.


cd frontend  
python3 -m http.server 5500  


실행 후 접속 주소:
http://localhost:5500/index.html


2. 백엔드 서버 실행
Node.js 20 버전을 사용해야 합니다.


cd backend  
nvm use 20  
npm run dev  


백엔드 API 주소:
http://localhost:3000  
## <주요 기능>
-분실물 등록 (이미지 포함)  
-건물별 분실물 목록 조회   
-SQLite DB 기반 데이터 저장  

## <디렉토리 구조>
easython_3/  
├── backend/  
│   ├── server.js  
│   ├── lostfound.db  
│   ├── package.json  
│   └── ...  
└── frontend/  
    ├── index.html  
    ├── register.html  
    ├── list.html  
    ├── script.js  
    └── ...  
## <팀 구성>
김서연, 김영은, 이서연, 한은초
