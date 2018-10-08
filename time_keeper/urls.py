from django.urls import path
from . import views

urlpatterns = [
    path('',views.index,name='index'),
    path(r'base_layout',views.base_layout,name='base_layout'),
    path(r'getdata',views.getdata,name='getdata'),
    path(r'postdata',views.postdata,name='postdata')
]