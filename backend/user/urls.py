from django.urls import path ,include
from . import views
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework import routers
from .viewsets import EmployeeViewSet
from rest_framework import generics
from .models import EmployeeType , Employee , Contact , CustomerGroup , Customer
from .serializers import (EmployeeTypeSerializer  , CreateEmployeeSerializer , CreateContactSerializer , 
EmployeeSerializer , CustomerGroupSerializer , EmployeeMinimialSerializer , CustomerProfileSerializer)
app_name = 'user'


router = routers.DefaultRouter()
router.register('employee',EmployeeViewSet,basename="employees")



urlpatterns = [
    path('', include(router.urls)),
    path('create-address/', views.AddressView.as_view(), name='Create Address'),
    path('get-auth-token/', views.CustomAuthentication.as_view(), name='Get Auth Token'),
    path('is-username-available/', views.UserAvailablity.as_view(), name='User Availability'),
    path('create-user/', views.CreateUserAccount.as_view(), name='Create User Account'),
    path('add-employee/', views.AddEmployee.as_view(), name='Add Employee'),
    path('create-contact/', views.CreateContact.as_view(), name='Create Contact'),
    path('get-customer/', views.GetCustomer.as_view(), name='Get Customer Contact'),
    path('get-customer/sales-profile', views.GetCustomerSalesProfile.as_view(), name='Get Customer Contact'),
    path('get-all-customers/', views.GetAllCustomers.as_view(), name='Get All Customers Contact'),
    path('get-all-customers/<str:entity>/', views.GetAllCustomers.as_view(), name='Get All Customers '),
    path('get-user-profile/', views.GetUserProfile.as_view(), name='Get user profile'),
    path('get-all-current-staffs/', views.GetAllCurrentStaffs.as_view(), name='Get All Current Staffs'),
    path('add-customer/', views.AddCustomer.as_view(), name='Add Customer'),
    path('employee-type/' , generics.ListAPIView.as_view(queryset = EmployeeType.objects.all(), serializer_class=EmployeeTypeSerializer), name='employee-type-list'),
    path('create-employee/' , generics.CreateAPIView.as_view(queryset = Employee.objects.all(), serializer_class=CreateEmployeeSerializer), name='employee'),
    path('create-contact/v1' , generics.CreateAPIView.as_view(queryset = Contact.objects.all(), serializer_class=CreateContactSerializer), name='contact'),
    path('get-all-employees/' , generics.ListAPIView.as_view(queryset = Employee.objects.all(), serializer_class=EmployeeSerializer), name='employee-list'),
    path('get-all-employees/' , generics.ListAPIView.as_view(queryset = Employee.objects.all(), serializer_class=EmployeeSerializer), name='employee-list'),
    path('customer-groups/', generics.ListCreateAPIView.as_view(queryset = CustomerGroup.objects.all() , serializer_class = CustomerGroupSerializer ), name= "Customer Group"),
    path('customer-groups/<int:pk>', generics.UpdateAPIView.as_view(queryset = CustomerGroup.objects.all() , serializer_class = CustomerGroupSerializer), name="Custmoer Group"),
    # path('employee/<int:pk>' , generics.RetrieveUpdateDestroyAPIView.as_view(queryset=Employee.objects.all() , serializer_class = EmployeeMinimialSerializer) ,name="Update Delete epmployee"),
    path('salespersons/' , generics.ListAPIView.as_view(queryset = Employee.objects.filter(EmployeeType=Employee.SALES_PERSON), serializer_class=EmployeeMinimialSerializer), name='employee-list'),
    path('drivers/' , generics.ListAPIView.as_view(queryset = Employee.objects.filter(EmployeeType=Employee.DRIVER), serializer_class=EmployeeMinimialSerializer), name='employee-list'),
    path('customers/' , views.CustomerListView.as_view()),
    path('customers/<int:pk>' , generics.RetrieveUpdateDestroyAPIView.as_view(queryset=Customer.objects.all() , serializer_class=CustomerProfileSerializer))


]
