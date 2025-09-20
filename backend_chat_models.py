# Django 백엔드 채팅 모델 - 파일 업로드 지원
from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

class ChatRoom(models.Model):
    """채팅방 모델"""
    user1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_rooms_as_user1')
    user2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_rooms_as_user2')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        unique_together = ['user1', 'user2']
        ordering = ['-updated_at']
    
    def __str__(self):
        return f"Chat between {self.user1.username} and {self.user2.username}"

class ChatMessage(models.Model):
    """채팅 메시지 모델"""
    MESSAGE_TYPES = [
        ('text', '텍스트'),
        ('file', '파일'),
        ('image', '이미지'),
        ('video', '비디오'),
    ]
    
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    content = models.TextField(blank=True, null=True)  # 텍스트 메시지 (파일 전송 시 비어있을 수 있음)
    message_type = models.CharField(max_length=10, choices=MESSAGE_TYPES, default='text')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_read = models.BooleanField(default=False)
    
    class Meta:
        ordering = ['created_at']
    
    def __str__(self):
        return f"Message from {self.sender.username} in room {self.room.id}"

class MessageFile(models.Model):
    """메시지 첨부 파일 모델"""
    message = models.ForeignKey(ChatMessage, on_delete=models.CASCADE, related_name='files')
    file_name = models.CharField(max_length=255)  # 원본 파일명
    file_path = models.CharField(max_length=500)  # 서버 저장 경로
    file_size = models.BigIntegerField()  # 파일 크기 (bytes)
    file_type = models.CharField(max_length=100)  # MIME 타입
    uploaded_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['uploaded_at']
    
    def __str__(self):
        return f"File {self.file_name} for message {self.message.id}"
    
    @property
    def is_image(self):
        """이미지 파일인지 확인"""
        return self.file_type.startswith('image/')
    
    @property
    def is_video(self):
        """비디오 파일인지 확인"""
        return self.file_type.startswith('video/')
    
    @property
    def file_extension(self):
        """파일 확장자 반환"""
        import os
        return os.path.splitext(self.file_name)[1].lower()
