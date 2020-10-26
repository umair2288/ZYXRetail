from django.core.management.base import BaseCommand
from django.utils import timezone
from django.contrib.auth.models import User
from user.models import Address , Contact , Employee , Entity
from warehouse.models import Warehouse , StockVehicle , WarehouseType , VehicleType , Route
from django.db import transaction

class Command(BaseCommand):
    help = 'Displays current time'

    def add_arguments(self, parser):
        parser.add_argument('--password', type=str, help='specify password for all user accounts')
      
    @transaction.atomic
    def handle(self, *args, **kwargs):
        password = kwargs['password']
        self.stdout.write("creating admin account with username = admin , password={}".format(password))
        try:
            admin_user = User.objects.create_superuser(username="admin",password=password,email="")
        except Exception as ex:
              self.stdout.write("Admin user already exsits please clear the db and try again...")
        else:
            address = Address(No="00" , Street="XYZ Street" , Town="Z Town" , District="Jaffna")
            address.save()
           
            sega = Entity(title="Sega" )
            rm = Entity(title="Royal Marketing" )
            cf = Entity(title="Chit Fund" )
            
            sega.save()
            rm.save()
            cf.save()


            #manager
            contact = Contact(FirstName="Manager" , LastName = "Test" , ContactNo="0777123456" , Address=address )
            contact.save()     
            manager = Employee(NIC="9012345678V",Contact=contact,DOB="1990-01-01" , EmployeeType=Employee.MANAGER,Entity=Employee.ROYALMARKETING , User=admin_user)
            manager.save()

            #office_staff
            office_user = User.objects.create_superuser(username="office",password=password,email="")
            contact = Contact(FirstName="Office Staff" , LastName = "Test" , ContactNo="0777123456" , Address=address )
            contact.save()     
            office_staff = Employee(NIC="9112345678V",Contact=contact,DOB="1990-01-01" , EmployeeType=Employee.OFFICE_STAFF,Entity=Employee.ROYALMARKETING , User=office_user)
            office_staff.save()

            #sales_staff
            sales_user = User.objects.create_superuser(username="sales",password=password,email="")
            sales_user.save()
            contact = Contact(FirstName="Sales Staff" , LastName = "Test" , ContactNo="0777123456" , Address=address )
            contact.save()     
            sales_person = Employee(NIC="9212345678V",Contact=contact,DOB="1990-01-01" , EmployeeType=Employee.SALES_PERSON,Entity=Employee.ROYALMARKETING , User=sales_user)
            sales_person.save()

            #driver
            driver_user = User.objects.create_superuser(username="driver",password=password,email="")
            driver_user.save()
            contact = Contact(FirstName="Driver" , LastName = "Test" , ContactNo="0777123456" , Address=address )
            contact.save()     
            driver = Employee(NIC="9312345678V",Contact=contact,DOB="1990-01-01" , EmployeeType=Employee.DRIVER,Entity=Employee.ROYALMARKETING , User=driver_user)
            driver.save()

            ## aditional data
            routes = ["A" ,"B" , "C" ,"D" , "E","F","G","H","I" ]
            for route in routes:
                r = Route(title=route)
                r.save()

            v = StockVehicle(vehicle_no="XXX" , entity=StockVehicle.ROYALMARKETING, name="Test Vehicle" )
            v.save()

            w = Warehouse(title="Test Warehouse" , entity=Warehouse.ROYALMARKETING)
            w.save()


            #create manager --admin user

            #create sales_person - sales person user
            #create offic_estaff - office staff user
            #create driver - driver user
            