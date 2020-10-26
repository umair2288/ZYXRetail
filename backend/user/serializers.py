from rest_framework import serializers , validators
from datetime import datetime
from warehouse.serializers import ProductSerializer

from .models import (Address,Employee, EmployeeType,Contact, Customer , CustomerGroup)
from sales.models import Order
from django.contrib.auth.models import User
from django.db import transaction




class CustomerGroupSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = CustomerGroup   
        fields =  "__all__"
   
    
## Address Serializers
class AddressSerializer(serializers.ModelSerializer):

    class Meta:
        model = Address
        fields = ['No' , 'Street' , 'Town' , 'District', 'GSDivision' , 'DSDivision' , 'Longitude' , 'Latitude']
        unique_together = ('No', 'Street', 'Town')

    def create(self, validated_data):
        return Address.objects.create(**validated_data)

## End Address Serializers


##user serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = '__all__'

    def create(self, validated_data):
        return User.objects.create(**validated_data)


## End user serializer

## Employee Serializer


##
## Contact Serializer


class ContactSerializer(serializers.ModelSerializer):
    Address = AddressSerializer()

    class Meta:
        model = Contact
        fields = ['FirstName', 'LastName', 'PreferedName', 'ContactNo', 'MobileNo', 'Email', 'Address']

    def create(self, validated_data):
        return Contact.objects.create(**validated_data)


class CustomerSerializer(serializers.ModelSerializer):
    contact = ContactSerializer()

    class Meta:
        model = Customer
        fields = "__all__"


  
    @transaction.atomic
    def create(self, validated_data):
        contact_data = validated_data.pop('contact')
        address_data = contact_data.pop('Address')
        address = Address.objects.create(**address_data)
        contact = Contact.objects.create(**contact_data, Address=address)
        #entity = validated_data.pop('entity')
        customer = Customer.objects.create(**validated_data, contact=contact)
        print(customer)
       # customer.entity.add(entity[0])
        customer.save()     
        return CustomerSerializer(instance=customer, many=False).data


class EmployeeTypeSerializer(serializers.ModelSerializer):

    class Meta:
        model = EmployeeType
        fields = '__all__'

    def create(self, validated_data):
        return EmployeeType.objects.create(**validated_data)


class EmployeeSerializer(serializers.ModelSerializer):
    User = UserSerializer()
    Contact = ContactSerializer()
  
    class Meta:
        model = Employee
        fields = '__all__'

    def create(self, validated_data):
        user_data = validated_data.pop('User')
        contact_data = validated_data.pop('Contact')
        address_data = contact_data.pop('Address') 
        user = User.objects.create(**user_data)
        address = Address.objects.create(**address_data)
        contact = Contact.objects.create(**contact_data, Address=address) 
        employee = Employee.objects.create(**validated_data , User = user , Contact = contact )
        return EmployeeSerializer(instance=employee ).data


class CreateEmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model=Employee
        fields = '__all__'

class CreateContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = '__all__'



class CustomerNICSerializer(serializers.ModelSerializer):

    class Meta:
        model = Customer
        fields = ["id","NIC"]


class EmployeeMinimialSerializer(serializers.ModelSerializer):
    full_name = serializers.SerializerMethodField()
    class Meta:
        model = Employee
        fields = ("id" , "NIC" , "full_name",)

    def get_full_name(self,object):
        return object.Contact.FirstName + " " + object.Contact.LastName

    def delete(self,obj):
        print("testing")

from sales.serializers import OrderSerializer , OrderInvoiceSerializer

class CustomerProfileSerializer(serializers.ModelSerializer):
    
    orders = serializers.SerializerMethodField()
    class Meta:
        model  = Customer
        fields = "__all__"
        depth = 2
    
    def get_orders(self , obj):
        return OrderSerializer(instance=Order.objects.filter(customer=obj) , many=True).data


class CustomerSearchSerializer(serializers.ModelSerializer):

    full_name = serializers.SerializerMethodField("get_full_name")
    invoices = serializers.SerializerMethodField("get_invoices")
    
    class Meta:
        model = Customer
        fields = ("id" , "NIC" , "full_name", "invoices")

    def get_full_name(self,object):
        return object.contact.FirstName + " " + object.contact.LastName

    def get_invoices(self,object):
        return OrderInvoiceSerializer(instance=Order.objects.filter(customer=object) , many=True).data