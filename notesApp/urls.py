from django.urls import path
from . import views

urlpatterns = [
    path('', views.notes, name='notes'),
    path('register', views.register, name='register'),
    path('login', views.login, name='login'),
    path('signout', views.signout, name='signout'),
    path('addFile', views.addFile, name='addFile'),
    path('deleteFile', views.deleteFile, name='deleteFile'),
    path('getFiles', views.getfiles, name='getfiles'),
]