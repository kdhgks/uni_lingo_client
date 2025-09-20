#!/bin/bash

# 🚀 언어교환 프로그램 배포 스크립트

echo "🚀 언어교환 프로그램 배포를 시작합니다..."

# 색상 정의
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 에러 체크 함수
check_error() {
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ 오류가 발생했습니다: $1${NC}"
        exit 1
    fi
}

echo -e "${YELLOW}📦 1. 백엔드 의존성 설치...${NC}"
cd my-django
pip install -r requirements_production.txt
check_error "백엔드 패키지 설치"

echo -e "${YELLOW}🗄️ 2. 데이터베이스 마이그레이션...${NC}"
python manage.py makemigrations
python manage.py migrate
check_error "데이터베이스 마이그레이션"

echo -e "${YELLOW}📁 3. 정적 파일 수집...${NC}"
python manage.py collectstatic --noinput
check_error "정적 파일 수집"

echo -e "${YELLOW}📦 4. 프론트엔드 의존성 설치...${NC}"
cd ../my-react-app
npm install
check_error "프론트엔드 패키지 설치"

echo -e "${YELLOW}🏗️ 5. 프론트엔드 빌드...${NC}"
npm run build
check_error "프론트엔드 빌드"

echo -e "${YELLOW}📋 6. 빌드 파일 복사...${NC}"
mkdir -p ../my-django/static
cp -r build/* ../my-django/static/
check_error "빌드 파일 복사"

echo -e "${YELLOW}📝 7. 환경 변수 파일 생성...${NC}"
cd ../my-django
cat > .env << EOF
SECRET_KEY=your-secret-key-change-this-in-production
DEBUG=False
ALLOWED_HOSTS=localhost,127.0.0.1
EOF

echo -e "${GREEN}✅ 배포 준비가 완료되었습니다!${NC}"
echo ""
echo -e "${YELLOW}🚀 서버 실행 방법:${NC}"
echo "1. 개발 환경 (테스트):"
echo "   python manage.py runserver 0.0.0.0:8001"
echo ""
echo "2. 프로덕션 환경 (HTTP + WebSocket):"
echo "   uvicorn language_exchange.asgi_production:application --host 0.0.0.0 --port 8001"
echo ""
echo "3. 프로덕션 환경 (HTTP만):"
echo "   gunicorn language_exchange.wsgi_production:application --bind 0.0.0.0:8001"
echo ""
echo -e "${GREEN}🌐 브라우저에서 http://localhost:8001 접속하세요!${NC}"


