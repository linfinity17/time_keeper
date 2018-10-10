from django.urls import path
from . import views

urlpatterns = [
    path('',views.redir,name='redir'),
    path(r'timer',views.index,name='index'),
    path(r'logged_in',views.success,name='success'),
    path(r'base_layout',views.base_layout,name='base_layout'),
    path(r'login',views.login_page,name='login_page'),
    path(r'getdata',views.getdata,name='getdata'),
    path(r'postdata',views.postdata,name='postdata')
]