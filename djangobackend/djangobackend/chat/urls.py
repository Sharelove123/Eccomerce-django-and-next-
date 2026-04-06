from django.urls import path

from . import views


urlpatterns = [
    path('threads/', views.ChatThreadListCreateView.as_view(), name='chat-thread-list-create'),
    path('threads/<int:pk>/', views.ChatThreadDetailView.as_view(), name='chat-thread-detail'),
    path('threads/<int:pk>/messages/', views.ChatMessageCreateView.as_view(), name='chat-message-create'),
    path('threads/<int:pk>/socket-auth/', views.ChatSocketAuthView.as_view(), name='chat-socket-auth'),
]
