from django.urls import path
from . import views


app_name = 'restAPI'

urlpatterns = [

    path('', views.HelloView.as_view(), name='hello'),


]
