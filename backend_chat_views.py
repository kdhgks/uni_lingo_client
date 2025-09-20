# Django 백엔드 채팅 뷰 - 파일 업로드 기능 포함
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth.decorators import login_required
from django.utils.decorators import method_decorator
from django.views import View
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from django.conf import settings
import json
import os
import uuid
from datetime import datetime
from .models import ChatRoom, ChatMessage, MessageFile
from .serializers import ChatMessageSerializer, MessageFileSerializer

@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class ChatMessageSendView(View):
    """채팅 메시지 전송 (텍스트 + 파일 업로드 지원)"""
    
    def post(self, request, room_id):
        try:
            # 채팅방 확인
            try:
                chat_room = ChatRoom.objects.get(id=room_id)
                # 사용자가 해당 채팅방의 참여자인지 확인
                if request.user not in [chat_room.user1, chat_room.user2]:
                    return JsonResponse(
                        {'error': '권한이 없습니다.'}, 
                        status=403
                    )
            except ChatRoom.DoesNotExist:
                return JsonResponse(
                    {'error': '채팅방을 찾을 수 없습니다.'}, 
                    status=404
                )
            
            # 폼 데이터에서 텍스트 메시지와 파일들 추출
            content = request.POST.get('content', '').strip()
            files = request.FILES.getlist('files')
            
            # 메시지가 비어있고 파일도 없는 경우
            if not content and not files:
                return JsonResponse(
                    {'error': '메시지 내용이나 파일을 입력해주세요.'}, 
                    status=400
                )
            
            # 파일 유효성 검사
            if files:
                for file in files:
                    # 파일 크기 제한 (10MB)
                    if file.size > 10 * 1024 * 1024:
                        return JsonResponse(
                            {'error': f'파일 {file.name}의 크기가 너무 큽니다. (최대 10MB)'}, 
                            status=400
                        )
                    
                    # 파일 타입 제한
                    allowed_types = [
                        'image/jpeg', 'image/png', 'image/gif', 'image/webp',
                        'video/mp4', 'video/avi', 'video/mov', 'video/quicktime',
                        'application/pdf', 'text/plain'
                    ]
                    if file.content_type not in allowed_types:
                        return JsonResponse(
                            {'error': f'지원하지 않는 파일 형식입니다: {file.name}'}, 
                            status=400
                        )
            
            # 메시지 생성
            message = ChatMessage.objects.create(
                room=chat_room,
                sender=request.user,
                content=content or '',
                message_type='text' if not files else 'file'
            )
            
            # 파일 저장 및 MessageFile 객체 생성
            uploaded_files = []
            if files:
                for file in files:
                    # 고유한 파일명 생성
                    file_extension = os.path.splitext(file.name)[1]
                    unique_filename = f"{uuid.uuid4()}{file_extension}"
                    
                    # 파일 저장
                    file_path = default_storage.save(
                        f"chat_files/{unique_filename}", 
                        ContentFile(file.read())
                    )
                    
                    # MessageFile 객체 생성
                    message_file = MessageFile.objects.create(
                        message=message,
                        file_name=file.name,
                        file_path=file_path,
                        file_size=file.size,
                        file_type=file.content_type
                    )
                    
                    # 파일 URL 생성
                    file_url = request.build_absolute_uri(
                        default_storage.url(file_path)
                    )
                    
                    uploaded_files.append({
                        'id': message_file.id,
                        'name': file.name,
                        'type': file.content_type,
                        'size': file.size,
                        'url': file_url
                    })
            
            # 응답 데이터 구성
            response_data = {
                'message': {
                    'id': message.id,
                    'content': message.content,
                    'sender': message.sender.id,
                    'sender_name': message.sender.nickname,
                    'timestamp': message.created_at.isoformat(),
                    'message_type': message.message_type,
                    'files': uploaded_files
                }
            }
            
            return JsonResponse(response_data, status=201)
            
        except Exception as e:
            return JsonResponse(
                {'error': f'서버 오류: {str(e)}'}, 
                status=500
            )


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class ChatMessageListView(View):
    """채팅 메시지 목록 조회 (파일 정보 포함)"""
    
    def get(self, request, room_id):
        try:
            # 채팅방 확인
            try:
                chat_room = ChatRoom.objects.get(id=room_id)
                if request.user not in [chat_room.user1, chat_room.user2]:
                    return JsonResponse(
                        {'error': '권한이 없습니다.'}, 
                        status=403
                    )
            except ChatRoom.DoesNotExist:
                return JsonResponse(
                    {'error': '채팅방을 찾을 수 없습니다.'}, 
                    status=404
                )
            
            # 메시지 목록 조회
            messages = ChatMessage.objects.filter(room=chat_room).order_by('created_at')
            
            # 메시지 데이터 구성 (파일 정보 포함)
            messages_data = []
            for message in messages:
                # 파일 정보 조회
                files_data = []
                if message.message_type == 'file':
                    message_files = MessageFile.objects.filter(message=message)
                    for file_obj in message_files:
                        file_url = request.build_absolute_uri(
                            default_storage.url(file_obj.file_path)
                        )
                        files_data.append({
                            'id': file_obj.id,
                            'name': file_obj.file_name,
                            'type': file_obj.file_type,
                            'size': file_obj.file_size,
                            'url': file_url
                        })
                
                messages_data.append({
                    'id': message.id,
                    'content': message.content,
                    'sender': message.sender.id,
                    'sender_name': message.sender.nickname,
                    'timestamp': message.created_at.isoformat(),
                    'message_type': message.message_type,
                    'files': files_data
                })
            
            return JsonResponse({
                'messages': messages_data,
                'room_id': room_id
            })
            
        except Exception as e:
            return JsonResponse(
                {'error': f'서버 오류: {str(e)}'}, 
                status=500
            )


@method_decorator(csrf_exempt, name='dispatch')
@method_decorator(login_required, name='dispatch')
class FileDownloadView(View):
    """파일 다운로드"""
    
    def get(self, request, file_id):
        try:
            # 파일 객체 조회
            try:
                message_file = MessageFile.objects.get(id=file_id)
                message = message_file.message
                
                # 사용자 권한 확인 (채팅방 참여자인지)
                if request.user not in [message.room.user1, message.room.user2]:
                    return JsonResponse(
                        {'error': '권한이 없습니다.'}, 
                        status=403
                    )
                
            except MessageFile.DoesNotExist:
                return JsonResponse(
                    {'error': '파일을 찾을 수 없습니다.'}, 
                    status=404
                )
            
            # 파일 다운로드 응답
            if default_storage.exists(message_file.file_path):
                file = default_storage.open(message_file.file_path)
                response = HttpResponse(
                    file.read(), 
                    content_type=message_file.file_type
                )
                response['Content-Disposition'] = f'attachment; filename="{message_file.file_name}"'
                return response
            else:
                return JsonResponse(
                    {'error': '파일이 서버에 존재하지 않습니다.'}, 
                    status=404
                )
                
        except Exception as e:
            return JsonResponse(
                {'error': f'서버 오류: {str(e)}'}, 
                status=500
            )
