from django.db import models
from django.contrib.auth.models import User
from datetime import datetime
from django.utils.timezone import now

# Create your models here.


class Person(models.Model):
    MALE = 'M'
    FEMALE = 'F'
    OTHER = 'O'

    GENDER_CHOICES = [
        (MALE, "Male"),
        (FEMALE, "Female"),
        (OTHER, "Other"),
    ]
    NIC = models.CharField(max_length=12, unique=True)
    DOB = models.DateField(null=True)
    Gender = models.CharField(max_length=10, choices=GENDER_CHOICES,null=True,blank=True)
    LastModified = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class Address(models.Model):
    No = models.CharField(max_length=10)
    Street = models.CharField(max_length=100)
    Town = models.CharField(max_length=100, blank=True)
    District = models.CharField(max_length=100)
    GSDivision = models.CharField(max_length=100, null=True,blank = True)
    DSDivision = models.CharField(max_length=100, null=True,blank = True)
    Longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True,blank = True)
    Latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True,blank = True)
    LastModified = models.DateTimeField(default=now)

    # class Meta:
    #     unique_together = ('No', 'Street', 'Town')

    def __str__(self):
        address = self.No + ',' + self.Street + ',' + self.Town 
        return address


class EmployeeType(models.Model):

    DRIVER = "DRIVER"
    SALES_PERSON = "SALES PERSON"
    MANAGER = "MANAGER"
    OFFICE_STAFF = "OFFICE STAFF"

    EMPLOYEE_TYPE_CHOICES = [
        (DRIVER , "Driver"),
        (SALES_PERSON , "Sales Person"),
        (MANAGER, "Manager"),
        (OFFICE_STAFF , "Office Staff")
    ]

    employee_type = models.CharField(max_length=20 , choices=EMPLOYEE_TYPE_CHOICES)
    LastModified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.employee_type


class Contact(models.Model):
    FirstName = models.CharField(max_length=50)
    LastName = models.CharField(max_length=50)
    PreferedName = models.CharField(max_length=50,null=True,blank=True)
    ContactNo = models.CharField(max_length=20)
    MobileNo = models.CharField(max_length=20,null=True,blank=True)
    Email = models.EmailField(null=True,blank = True)
    Address = models.ForeignKey(Address, on_delete=models.PROTECT)
    LastModified = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ['FirstName', 'LastName', 'Address']

    def __str__(self):
        return self.FirstName + " - " + self.ContactNo


class Employee(Person):

    SEGA = "SEGA"
    ROYALMARKETING = "ROYALMARKETING"
    OTHER = "OTHER"

    DRIVER = "DRIVER"
    SALES_PERSON = "SALES PERSON"
    MANAGER = "MANAGER"
    OFFICE_STAFF = "OFFICE STAFF"

    ENTITY_CHOICES = [
        (SEGA , "Sega"),
        (ROYALMARKETING , "Royal Marketing"),
        (OTHER , "Other")  
    ]

    EMPLOYEE_TYPE_CHOICES = [
        (DRIVER , "Driver"),
        (SALES_PERSON , "Sales Person"),
        (MANAGER, "Manager"),
        (OFFICE_STAFF , "Office Staff")
    ]


    
    User = models.OneToOneField(to=User, on_delete=models.CASCADE, related_name="employee")
    Contact = models.ForeignKey(Contact, on_delete=models.CASCADE,)
    EmployeeType = models.CharField(max_length=50, choices=EMPLOYEE_TYPE_CHOICES)
    Entity = models.CharField(max_length=50, choices=ENTITY_CHOICES)
    Supervisor = models.ForeignKey("Employee", on_delete=models.PROTECT, null=True,blank=True)
    IsCurrent = models.BooleanField(default=True)
    JoinedDate = models.DateField(default = '1900-01-01')
    LastModified = models.DateTimeField(auto_now=True)


    def __str__(self):
        return str(self.id) + '.' + self.Contact.FirstName + " " + self.Contact.LastName + ": " + self.EmployeeType


class Referee(Person):
    Contact = models.ForeignKey(Contact, on_delete=models.PROTECT)
    LastModified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.Contact.FirstName + " " + self.Contact.LastName


class Entity(models.Model):
    title = models.CharField(max_length=50)
    last_updated = models.DateTimeField(auto_now=True)


    def __str__(self):
        return str(self.id) + " -"+self.title

class Customer(Person):

    SEGA = "SEGA"
    ROYALMARKETING = "ROYALMARKETING"
    OTHER = "OTHER"

    ENTITY_CHOICES = [
        (SEGA , "Sega"),
        (ROYALMARKETING , "Royal Marketing"),
        (OTHER , "Other")  
    ]

    User = models.OneToOneField(to=User, on_delete=models.CASCADE , null= True)
    RegisteredByEmployee = models.ForeignKey(Employee, null=True, on_delete=models.SET_NULL)
    RegisteredDate = models.DateField(default = '1990-01-01')
    AlternativeContact = models.ForeignKey(Contact, null=True, on_delete=models.SET_NULL , related_name="AlternativeContact")
    contact = models.ForeignKey(Contact, on_delete=models.PROTECT)
    Referee = models.ForeignKey(Referee, on_delete=models.SET_NULL, null=True)
    BillingAddress = models.ForeignKey(Address, on_delete=models.CASCADE, null=True)
    entity = models.CharField(default=ROYALMARKETING , choices=ENTITY_CHOICES , max_length=50)
    isBlacklisted = models.BooleanField(default = False)
    LastModified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return str(self.id) + '.' + self.contact.FirstName + " " + self.contact.LastName


from warehouse.models import Product
class CustomerGroup(models.Model):
    name = models.CharField(max_length=100 , null=True, blank=True)
    customers = models.ManyToManyField(Customer , related_name="customer_groups")
    lead = models.ForeignKey(Customer , related_name="leading_group" , null=True , blank=True , on_delete=models.DO_NOTHING)
    product = models.ForeignKey(Product, on_delete=models.DO_NOTHING , null=True , blank=True)
    is_locked = models.BooleanField(default=False)
    last_modified = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name




