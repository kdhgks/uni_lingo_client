@echo off
REM 🚀 언어교환 프로그램 배포 스크립트 (Windows)

echo 🚀 언어교환 프로그램 배포를 시작합니다...

echo 📦 1. 백엔드 의존성 설치...
cd my-django
pip install -r requirements_production.txt
if errorlevel 1 (
    echo ❌ 백엔드 패키지 설치 실패
    pause
    exit /b 1
)

echo 🗄️ 2. 데이터베이스 마이그레이션...
python manage.py makemigrations
python manage.py migrate
if errorlevel 1 (
    echo ❌ 데이터베이스 마이그레이션 실패
    pause
    exit /b 1
)

echo 📁 3. 정적 파일 수집...
python manage.py collectstatic --noinput
if errorlevel 1 (
    echo ❌ 정적 파일 수집 실패
    pause
    exit /b 1
)

echo 📦 4. 프론트엔드 의존성 설치...
cd ..\my-react-app
npm install
if errorlevel 1 (
    echo ❌ 프론트엔드 패키지 설치 실패
    pause
    exit /b 1
)

echo 🏗️ 5. 프론트엔드 빌드...
npm run build
if errorlevel 1 (
    echo ❌ 프론트엔드 빌드 실패
    pause
    exit /b 1
)

echo 📋 6. 빌드 파일 복사...
if not exist ..\my-django\static mkdir ..\my-django\static
xcopy /E /I /Y build\* ..\my-django\static\
if errorlevel 1 (
    echo ❌ 빌드 파일 복사 실패
    pause
    exit /b 1
)

echo 📝 7. 환경 변수 파일 생성...
cd ..\my-django
echo SECRET_KEY=your-secret-key-change-this-in-production > .env
echo DEBUG=False >> .env
echo ALLOWED_HOSTS=localhost,127.0.0.1 >> .env

echo ✅ 배포 준비가 완료되었습니다!
echo.
echo 🚀 서버 실행 방법:
echo 1. 개발 환경 (테스트):
echo    python manage.py runserver 0.0.0.0:8001
echo.
echo 2. 프로덕션 환경 (HTTP + WebSocket):
echo    uvicorn language_exchange.asgi_production:application --host 0.0.0.0 --port 8001
echo.
echo 3. 프로덕션 환경 (HTTP만):
echo    gunicorn language_exchange.wsgi_production:application --bind 0.0.0.0:8001
echo.
echo 🌐 브라우저에서 http://localhost:8001 접속하세요!
pause


