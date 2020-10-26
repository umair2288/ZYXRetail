from django.shortcuts import render
from datetime import datetime,date
from . import serializers
from .models import (Customer, Employee,EmployeeType , Entity)
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from warehouse.models import SalesPersonVehicle,StockVehicle
from rest_framework.views import APIView
from rest_framework import filters
from rest_framework.generics import ListAPIView
from rest_framework.response import Response
from rest_framework.status import HTTP_200_OK , HTTP_400_BAD_REQUEST
from rest_framework.permissions import IsAuthenticated
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authtoken.models import Token
from django.core.exceptions import ObjectDoesNotExist


# Create your views here.


class AddressView(APIView):

    def post(self, request):
        address = request.data
        serializer = serializers.AddressSerializer(data=address)
        
        if serializer.is_valid(raise_exception=False):
            try:
                contact_saved = serializer.save()

            except Exception as ex:
                response = {
                    "is_success":  False,
                    "Error": ex
                }

            else:
                response = {
                    "id": contact_saved.id,
                    "is_success":  True,
                    "message": "Address '{}' created successfully".format(contact_saved)
                }
        else: 
            response = { 
                "is_success":  False,
                "Error": "Bad request",
                "Error_message" : serializer.errors
                }

        return Response(response)




class UserAvailablity(APIView):
    
    def post(self, request):
        user = request.data.get('username')
        check_query = User.objects.filter(username = user)
        if check_query.exists():
            response = {
                "is_success" : False,
                "Message" : "username already exists"
            }

        else:
            response = {
                "is_success": True,
                "Message": "username available"
            }

        return Response(response)


class CreateUserAccount(APIView):
    
    def post(self, request):
        user = request.data
        try:
            user['password'] = make_password(user['password']) # need to hash the password before saving to the backend
        except KeyError: # if resquest doest hold password
            return Response(
                {
                    "is_success":  False,
                    "Error": "please provide a password"
                }
            )
        except Exception:
            return Response(
                {
                    "is_success":  False,
                    "Error": "Error occored while hashing the password"
                }
            )

        serializer = serializers.UserSerializer(data=user)
        if serializer.is_valid(raise_exception=False):
            try:
                saved = serializer.save()

            except:
                response = {
                    "is_success":  False,
                    "Error": "Entry Already Exists"
                }

            else:
                response = {
                    "id": saved.id,
                    "is_success":  True,
                    "message": "User Acccount created successfully",
                }
        else: 
            response = { 
                "is_success":  False,
                "Error": "Bad request",
                "Error_message" : serializer.errors
                }

        return Response(response)


class AddEmployee(APIView):

    def post(self, request):
        employee = request.data
        serializer = serializers.EmployeeSerializer(data=employee)
       
        if serializer.is_valid(raise_exception=True):
            try:             
                saved = serializer.save()
                print("Hi")
            except TypeError as ex:
                response = {
                    "is_success": False,
                    "Error": ex
                }

            else:
                response = {
                    "data": saved,
                    "is_success": True,
                    "message": "User Acccount created successfully"
                  
                }
        else:
            response = {
                "is_success": False,
                "Error": "Bad request",
                "Error_message": serializer.errors
            }

        return Response(response)


class CreateContact(APIView):

    def post(self, request):
        contact = request.data
        serializer = serializers.ContactSerializer(data=contact)

        if serializer.is_valid(raise_exception=False):
            try:
                saved = serializer.save()
            except Exception as ex:
                response = {
                    "is_success": False,
                    "Error": ex
                }

            else:
                response = {
                    "id": saved.id,
                    "is_success": True,
                    "message": "Contact created successfully"
                }
        else:
            response = {
                "is_success": False,
                "Error": "Bad request",
                "Error_message": serializer.errors
            }

        return Response(response)


class GetCustomer(APIView):

     permission_classes = [IsAuthenticated,]
     def post(self, request):
         nic = request.data.get("NIC")
         check_query = Customer.objects.filter(NIC= nic)
         print(nic)
         if(check_query.exists()):
             customer = check_query.get()
             print(customer.id)
             response={
                 "is_success": True,
                 "message": "This NIC already registered",
                 "data": serializers.CustomerSerializer(instance=customer).data,
             }
         else:
             response = {
                 "is_success": False,
                 "message": "This NIC provided not registered before"
             }

         return Response(response)


class GetAllCustomers(APIView):

    permission_classes = [IsAuthenticated]
    
    def post(self,request , entity="all"):
        if entity == 'all':
            queryset = Customer.objects.all()
        elif entity == 'sega':
            queryset = Customer.objects.filter(entity__title='Sega')
        elif entity == 'chitfund':
            queryset = Customer.objects.filter(entity__title='Chit Fund')
        
        if not queryset.exists():
            response = {
                "success": False,
                "data": []
            }
        else:
            customers = [customer for customer in queryset]
         #   print(customers)
            response={
                "success" : True,
                "message" : "Data retrived successfully",
                "data": serializers.CustomerSerializer(instance=customers, many=True).data
            }

        return Response(response)


class GetUserProfile(APIView):

    permission_classes = [IsAuthenticated, ]

    def post(self, request):

        user = request.user
        quary = Employee.objects.filter(User=user)

        if quary.exists():
            employee = quary.get()
            response = {
                "success": True,
                "message": "Employee Profile fetched successfully",
                "data": serializers.EmployeeSerializer(instance=employee).data,
            }
        else:
            response = {
                "success": False,
                "message": "Employee Profile doesn't exists",
            }

        return Response(response)



class AddCustomer (APIView):

  #  permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data)
        # try:
        #     q = Customer.objects.get(NIC=request.data['NIC'])
        #     entity = Entity.objects.get(pk=request.data['entity'][0])
        #     q.entity.add(entity)
        #     q.save()
        #     return Response({"success": True , "message" : "Customer Added" ,'data':serializers.CustomerSerializer(instance=q).data})
        # except Exception:
        serializer = serializers.CustomerSerializer(data=request.data) 
        if serializer.is_valid():
            data=serializer.save()
            response = {"success": True , "message" : "Customer Added" ,'data':data}
        else:
            response = {"success": False,"message" : serializer.errors}      
        return Response(response)



class CustomAuthentication(ObtainAuthToken):

    def post(self, request, *args, **kwargs):
        serializer= self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid()
        print(serializer.errors)
        user = serializer.validated_data['user']
        
        token , created = Token.objects.get_or_create(user=user)
        try:
            emp_type = request.data['emp_type']
            
        except KeyError:
            return Response(
                {
                    "succeses": False,
                    "message" : "allowed employee types ['DRIVER','SALES PERSON','MANAGER,'OFFICE STAFF']"
                },HTTP_400_BAD_REQUEST)

        #if (user.employee.EmployeeType = )
        if emp_type not in ['DRIVER','SALES PERSON','MANAGER',"OFFICE STAFF" ] :
             return Response(
                {
                    "succeses": False,
                    "message" : "allowed employee types ['DRIVER','SALES PERSON','MANAGER,'OFFICE STAFF']"
                },HTTP_400_BAD_REQUEST)
        if(user.employee.EmployeeType == emp_type):
            isVehicleAssigned = False
            entity = user.employee.Entity
            if user.employee.EmployeeType == Employee.SALES_PERSON :
                try:
                    salesPersonVehicle = SalesPersonVehicle.objects.get(sales_person = user.employee,date = date.today())
                    isVehicleAssigned = True
                    entity = salesPersonVehicle.vehicle.entity
                except:
                    isVehicleAssigned = False

            return Response(
                {
                    "success" : True,
                    "message" : "Login successful",
                    'token': token.key,
                    'user_id': user.pk,
                    "name" : user.employee.Contact.FirstName,
                    'is_superuser':user.is_superuser,
                    'entity' : entity,
                    'email': user.email,
                    'isVehicleAssigned' : isVehicleAssigned,
                    "entities" : [
                        StockVehicle.ROYALMARKETING,
                        StockVehicle.SEGA
                    ]
                },HTTP_200_OK)
        else:
            return Response(
                {
                    "success": False,
                    "message" : "you are not a {}".format(emp_type)
                })




class GetAllCurrentStaffs(APIView):

    def post(self,requset):

        
        query = Employee.objects.filter(IsCurrent=True)
        
        if query.exists():
           staffs = [staff for staff in query ]
           response = {
               "success" : True,
               "message" : "Data retrieved successfuly",
               "data" : serializers.EmployeeSerializer(instance=staffs , many=True).data
           }
        else:
            response ={
                "success" : False,
                "message" : "No active sales staff exists"
            }


        return Response(response)



class GetCustomerSalesProfile(APIView):
    
    def get(self,request):
        try:
            print(request.query_params)
            customer  = Customer.objects.filter(NIC = request.query_params.get("NIC")).get()
        except KeyError:
           return Response ({"success":False , "message":"NIC does not provided body"})
        except ObjectDoesNotExist:
           return Response ({"success":False , "message": "NIC Does not Exists"})
        serializer = serializers.CustomerProfileSerializer(instance=customer)
        return Response({"success":True , "data":serializer.data})



class CustomerListView(ListAPIView):

    queryset = Customer.objects.all()
    serializer_class = serializers.CustomerSearchSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['NIC']
