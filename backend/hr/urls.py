from django.urls import path
from rest_framework import generics
from . import views
from .models import Attendance
from user.models import Employee
from .serializers import AttendanceSerializer , GetAttendanceSerializer , EmployeeProfileSerializer




urlpatterns = [

    path('mark-attendance/', views.AttendanceView.as_view(), name='GetUserProfile'),
    path('list-attendance/', generics.ListAPIView.as_view(queryset=Attendance.objects.all() , serializer_class=GetAttendanceSerializer), name='GetUserProfile'),
    path('employee/<int:emp_id>/totalsales', views.TotalSales.as_view() , name="total sales"),
    path('employee/<int:pk>/profile', generics.RetrieveAPIView.as_view(queryset=Employee.objects.all() , serializer_class=EmployeeProfileSerializer), name="Get Employee profile"),
    path('employee/<int:emp_id>/payslip/generate/', views.GeneratePayslipView.as_view() , name="genrate payslip"),
]