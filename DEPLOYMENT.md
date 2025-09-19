# 배포 가이드

## 환경변수 설정

### 프론트엔드 (React)

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# API 서버 URL (배포 환경에 맞게 변경)
REACT_APP_API_URL=https://your-api-server.com

# 환경 설정
REACT_APP_ENVIRONMENT=production
```

### 백엔드 (Django)

`my-django` 폴더에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```env
# Django 보안 키 (새로운 키로 변경하세요)
SECRET_KEY=your-new-secret-key-here

# 디버그 모드 (프로덕션에서는 False)
DEBUG=False

# 허용된 호스트 (배포 도메인으로 변경)
ALLOWED_HOSTS=your-domain.com,www.your-domain.com

# 데이터베이스 URL (필요시)
DATABASE_URL=sqlite:///db.sqlite3
```

## 배포 전 체크리스트

### ✅ 완료된 사항

- [x] 하드코딩된 API URL을 환경변수로 변경
- [x] Django 보안 설정 환경변수화
- [x] 접근성 속성 추가 (alt 텍스트, ARIA 라벨)
- [x] API 엔드포인트 중앙화

### 🔧 배포 시 수정 필요

1. **SECRET_KEY 변경**: Django의 SECRET_KEY를 새로운 값으로 변경
2. **DEBUG 모드 비활성화**: DEBUG=False로 설정
3. **ALLOWED_HOSTS 설정**: 실제 도메인으로 변경
4. **API_URL 설정**: 배포된 백엔드 서버 URL로 변경
5. **HTTPS 설정**: 프로덕션에서는 HTTPS 사용
6. **데이터베이스 설정**: SQLite 대신 PostgreSQL 또는 MySQL 사용 권장

## 빌드 명령어

### 프론트엔드

```bash
npm run build
```

### 백엔드

```bash
cd my-django
python manage.py collectstatic
python manage.py migrate
```

## 보안 권장사항

1. **환경변수 파일 보안**: `.env` 파일을 `.gitignore`에 추가
2. **HTTPS 사용**: 프로덕션에서는 반드시 HTTPS 사용
3. **CORS 설정**: Django에서 프론트엔드 도메인만 허용
4. **파일 업로드 제한**: 파일 크기 및 타입 제한 설정
5. **API 레이트 리미팅**: API 호출 빈도 제한 설정

## 성능 최적화

1. **정적 파일 서빙**: CDN 사용 권장
2. **이미지 최적화**: WebP 포맷 사용
3. **번들 크기 최적화**: 코드 스플리팅 적용
4. **캐싱 설정**: 브라우저 캐싱 및 서버 캐싱 설정




