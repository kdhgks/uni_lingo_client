# 🚀 언어교환 프로그램 배포 가이드

## 📋 배포 준비사항

### 1. 시스템 요구사항

- Python 3.8+
- Node.js 16+
- Redis 서버
- PostgreSQL (선택사항, SQLite도 가능)
- Nginx (선택사항)

### 2. 환경 변수 설정

```bash
# Django 설정
export DJANGO_SETTINGS_MODULE=language_exchange.settings_production
export SECRET_KEY=your-secret-key-here

# 데이터베이스 (PostgreSQL 사용시)
export DB_NAME=language_exchange
export DB_USER=postgres
export DB_PASSWORD=your-password
export DB_HOST=localhost
export DB_PORT=5432

# Redis 설정
export REDIS_HOST=localhost
export REDIS_PORT=6379
```

## 🔧 배포 단계

### 1. 백엔드 배포 (Django)

#### 1.1 패키지 설치

```bash
cd my-django
pip install -r requirements_production.txt
```

#### 1.2 데이터베이스 마이그레이션

```bash
python manage.py makemigrations
python manage.py migrate
```

#### 1.3 정적 파일 수집

```bash
python manage.py collectstatic --noinput
```

#### 1.4 관리자 계정 생성

```bash
python manage.py createsuperuser
```

### 2. 프론트엔드 빌드 (React)

#### 2.1 의존성 설치

```bash
cd my-react-app
npm install
```

#### 2.2 프로덕션 빌드

```bash
npm run build
```

#### 2.3 빌드 파일을 Django로 복사

```bash
# build 폴더를 Django의 static 폴더로 복사
cp -r build/* ../my-django/static/
```

### 3. 서버 실행

#### 3.1 개발 환경 (테스트용)

```bash
# Django 서버 (HTTP + WebSocket)
cd my-django
python manage.py runserver 0.0.0.0:8001

# 또는 ASGI 서버로 WebSocket 지원
uvicorn language_exchange.asgi_production:application --host 0.0.0.0 --port 8001
```

#### 3.2 프로덕션 환경

##### Gunicorn 사용 (HTTP만)

```bash
cd my-django
gunicorn language_exchange.wsgi_production:application --bind 0.0.0.0:8001 --workers 4
```

##### Uvicorn 사용 (HTTP + WebSocket)

```bash
cd my-django
uvicorn language_exchange.asgi_production:application --host 0.0.0.0 --port 8001 --workers 4
```

### 4. Nginx 설정 (선택사항)

#### 4.1 Nginx 설정 파일

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    # 정적 파일
    location /static/ {
        alias /path/to/my-django/staticfiles/;
    }

    # React 앱
    location / {
        try_files $uri $uri/ @django;
    }

    # Django API
    location /api/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # WebSocket
    location /ws/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Django로 폴백
    location @django {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔒 보안 설정

### 1. 환경 변수 파일

```bash
# .env 파일 생성
cat > my-django/.env << EOF
SECRET_KEY=your-very-secret-key-here
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com
DB_NAME=language_exchange
DB_USER=postgres
DB_PASSWORD=your-secure-password
DB_HOST=localhost
DB_PORT=5432
REDIS_HOST=localhost
REDIS_PORT=6379
EOF
```

### 2. 방화벽 설정

```bash
# 필요한 포트만 열기
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
sudo ufw enable
```

## 📊 모니터링

### 1. 로그 확인

```bash
# Django 로그
tail -f my-django/logs/django.log

# Nginx 로그
tail -f /var/log/nginx/access.log
tail -f /var/log/nginx/error.log
```

### 2. 프로세스 확인

```bash
# Django 프로세스
ps aux | grep gunicorn
ps aux | grep uvicorn

# Redis 프로세스
ps aux | grep redis
```

## 🚀 클라우드 배포 옵션

### 1. AWS EC2

- EC2 인스턴스 생성
- Security Group에서 포트 80, 443, 22 열기
- Elastic IP 할당
- RDS PostgreSQL 사용 (선택사항)
- ElastiCache Redis 사용 (선택사항)

### 2. DigitalOcean Droplet

- Ubuntu 20.04+ Droplet 생성
- Firewall에서 포트 80, 443, 22 열기
- Managed Database 사용 (선택사항)

### 3. Heroku

- Heroku CLI 설치
- PostgreSQL, Redis 애드온 추가
- 환경 변수 설정
- 배포

## 🔧 문제 해결

### 1. 일반적인 문제들

#### 포트 충돌

```bash
# 포트 사용 확인
netstat -tulpn | grep :8001
lsof -i :8001
```

#### 권한 문제

```bash
# 파일 권한 설정
chmod 755 my-django/
chown -R www-data:www-data my-django/staticfiles/
```

#### 데이터베이스 연결 오류

```bash
# PostgreSQL 연결 테스트
psql -h localhost -U postgres -d language_exchange
```

### 2. 로그 확인

```bash
# Django 오류 로그
tail -f my-django/logs/django.log

# 시스템 로그
journalctl -u nginx -f
journalctl -u gunicorn -f
```

## 📞 지원

문제가 발생하면 다음을 확인하세요:

1. 로그 파일
2. 환경 변수 설정
3. 포트 및 방화벽 설정
4. 데이터베이스 연결
5. Redis 연결

---

**배포 완료 후 테스트 항목:**

- [ ] 웹사이트 접속 확인
- [ ] 회원가입/로그인 기능
- [ ] 매칭 기능
- [ ] 채팅 기능 (WebSocket)
- [ ] 파일 업로드
- [ ] 하트 반응
- [ ] 신고 기능
- [ ] 채팅방 나가기


