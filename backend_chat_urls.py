# Django 백엔드 채팅 URL 설정 - 파일 업로드 지원
from django.urls import path
from . import views

urlpatterns = [
    # 채팅방 관련
    path('chat/rooms/', views.ChatRoomListView.as_view(), name='chat_rooms'),
    path('chat/rooms/<int:room_id>/partner/', views.ChatRoomPartnerView.as_view(), name='chat_room_partner'),
    
    # 메시지 관련
    path('chat/rooms/<int:room_id>/messages/', views.ChatMessageListView.as_view(), name='chat_messages'),
    path('chat/rooms/<int:room_id>/messages/send/', views.ChatMessageSendView.as_view(), name='chat_message_send'),
    path('chat/rooms/<int:room_id>/messages/read/', views.ChatMessageReadView.as_view(), name='chat_messages_read'),
    
    # 파일 관련
    path('chat/files/<int:file_id>/download/', views.FileDownloadView.as_view(), name='file_download'),
]
