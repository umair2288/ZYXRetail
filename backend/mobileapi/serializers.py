from rest_framework import serializers
from user.models import Employee, Customer
from sales.models import Order, Receipt
from installment.serializers import InstalmentTermSerializer
from installment.models import InstallmentPlan,InstallmentTerm
from datetime import date , datetime
from user.models import Employee
from datetime import date
from warehouse.models import (
    ProductPiece,
    StockVehicle,
    MovedToVehicle,
    Product,
    ProductBatch,
    Warehouse,
    Route,
    SalesPersonVehicle
)
from django.db.models import Count
from datetime import date,datetime,time
from sales.models import Order,OrderLine,ReturnOrder,Receipt
from django.core.exceptions import ObjectDoesNotExist

# "Method" : "GET",
# "query_params" : {
# 	"nic" : "951733636V"
# },
# "Response" : {
# 	"name" : "Nusky Ahamed",
# 	"dateOfJoined"  : "18th june 2017",
# 	"nic" : "951733636V",
# 	"phone" : "94772191987",
# 	"status" : "active" || "blacklisted",
# 	"isEligibleForCreateNewSale" : true || false
# 	"address" : "325/A bulugohatenna Akurana",
# 	"ongoing_plan" : {
# 		"total_payable_due_amount" : "Rs.500",
# 		"item_s/n" : "RC-1200",
# 		"item_name" : "Rice Cooker",
# 		"installment_type" : "Weekly",
# 		"no_of_terms" : 12,
# 		"payable_dues" : [
# 			{
# 				"due_id" : 25
# 				"amount_arrier" : "Rs.250",
# 				"due_amount" : "Rs.500",
# 				"due_date" : "12th August 2019"
# 				"is_overdue" : true || false
# 			}
# 		]
# 	}
# }

class InstallmentPlanSerializer (serializers.ModelSerializer):

    no_of_terms = serializers.SerializerMethodField()

    class Meta : 

        model = InstallmentPlan
        fields = '__all__'

    
    def get_no_of_terms(self, obj):   
        return obj.terms.count()


class ReturnOrderSerializer (serializers.ModelSerializer):

    invoice_no = serializers.SerializerMethodField()
    item_code = serializers.SerializerMethodField()
    sales_person = serializers.SerializerMethodField()

    class Meta : 

        model = ReturnOrder
        fields = ('id','order','product_piece','return_order_type','return_order_desc','sales_person_vehicle','invoice_no','item_code','date','sales_person')
        read_only_fields = ['invoice_no','item_code','date','sales_person']

    def get_invoice_no(self,obj):

        return obj.order.invoice_no

    def get_item_code (self, obj):

        return obj.product_piece.item_code

    def get_sales_person (self, obj):
        contact = obj.sales_person_vehicle.sales_person.Contact
        return contact.FirstName + " "+contact.LastName

class OrderLineSerializer (serializers.ModelSerializer) :

    item_code = serializers.SerializerMethodField()
    item_name = serializers.SerializerMethodField()
    return_order = serializers.SerializerMethodField()

    class Meta :

        model = OrderLine
        fields = '__all__'

    def get_return_order (self,orderLine) :

        try :
            returnOrder = ReturnOrder.objects.get(product_piece=orderLine.product,order = orderLine.order)
            return ReturnOrderSerializer(instance=returnOrder,many = False).data
        except:
            return None

    def get_item_code (self,orderLine):

        return orderLine.product.item_code

    def get_item_name (self,orderLine):

        return orderLine.product.batch.product.title

class GurarantorSerializer (serializers.ModelSerializer):

    name = serializers.SerializerMethodField()

    class Meta :

        model = Customer
        fields = '__all__'


    def get_name (self,customer):

        return customer.contact.__str__()

class OngoingPlanSerilaizer(serializers.ModelSerializer):

    total_payable_due_amount = serializers.SerializerMethodField()
    instalment_type = serializers.SerializerMethodField()
    no_of_terms = serializers.SerializerMethodField()
    payable_dues = serializers.SerializerMethodField()
    orderLines = OrderLineSerializer(many = True)
    balanceAmountToPay = serializers.SerializerMethodField()
    guarantor = GurarantorSerializer(many = False)

    class Meta:
        model= Order
        fields = ['id','invoice_no' , 'total_payable_due_amount' , 'instalment_type' , 'no_of_terms' , 'payable_dues','orderLines','balanceAmountToPay','guarantor']
    
    def get_balanceAmountToPay(self,obj):

        terms = InstallmentTerm.objects.filter(
            plan__invoice = obj,
            is_canceled = False
        )

        total_due = 0
        total_paid = 0

        for term in terms:

            total_due += term.due_amount
            total_paid += term.amount_paid

        return total_due - total_paid

    def get_total_payable_due_amount(self, obj):
        intalment_plan = obj.instalment_plan
        over_due_terms = intalment_plan.terms.exclude(due_date__gte=datetime.today()).filter(is_paid=False)
        partial_receipts = Receipt.objects.filter(id__in=[ x.id for x in over_due_terms])
        paid_amount = sum( [ x.payment for x in partial_receipts])
        total_over_due = sum([ x.due_amount for x in over_due_terms])
        return total_over_due - paid_amount
    
    def get_instalment_type (self, obj):
        return obj.instalment_plan.installment_type

    def get_no_of_terms(self, obj):   
        return obj.instalment_plan.terms.count()
    
    def get_payable_dues(self, obj):
        over_due_terms = obj.instalment_plan.terms.exclude(due_date__gte=datetime.today()).filter(is_paid=False)
        return InstalmentTermSerializer(instance=over_due_terms , many=True).data


class GetCustomerDetailsSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    contact = serializers.SerializerMethodField()
    address = serializers.SerializerMethodField()
    isEligibleForCreateNewSale = serializers.SerializerMethodField()
    ongoing_plan = serializers.SerializerMethodField()
    cordinates = serializers.SerializerMethodField()

    class Meta:
        model = Customer

        fields = ['id','name' , "NIC" , 'contact' , 'isBlacklisted' , 'address' , 'ongoing_plan','RegisteredDate', 'isEligibleForCreateNewSale','cordinates']


    def get_cordinates (self,obj):

        address = obj.contact.Address

        return {
            "lat" : address.Latitude,
            "lon" : address.Longitude
        }

    def get_name(self,obj):
        return  obj.contact.FirstName + " " + obj.contact.LastName
    def get_contact(self,obj):
        return  obj.contact.ContactNo
    def get_address(self,obj):
        return obj.contact.Address.No + ', ' + obj.contact.Address.Street + ', ' + obj.contact.Address.Town + '. ' + obj.contact.Address.District
  
    def get_ongoing_plan(self, obj):
        
        orders = obj.orders.filter(entity=Order.ROYALMARKETING,order_type = Order.INSTALMENT)
        query =  orders.filter(instalment_plan__terms__is_paid = False).annotate(Count('id')).order_by('-date')
        if not query.exists():
            return []
        orders = [ order for order in query]
        return OngoingPlanSerilaizer(instance=orders , many=True).data

    def get_isEligibleForCreateNewSale(self, obj):
        query =  obj.orders.filter(entity=Order.ROYALMARKETING,order_type = Order.INSTALMENT)
        if not query.exists():
            return True
        no_of_unpaid_dues = sum([ order.instalment_plan.terms.filter(is_paid=False).count() for order in query]) 
        return no_of_unpaid_dues == 0 | False





class GetUserProfileSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    role = serializers.SerializerMethodField()
    total_collection = serializers.SerializerMethodField()
    total_sales = serializers.SerializerMethodField()
    vehicle = serializers.SerializerMethodField()
    total_cash_in_hand = serializers.SerializerMethodField()
    driver = serializers.SerializerMethodField()
    route = serializers.SerializerMethodField()
    total_initial_payments = serializers.SerializerMethodField()

    class Meta:  
        model = Employee
        fields = ['id' , 'name' , 'role' , 'total_sales' , 'total_collection' , 'vehicle','total_cash_in_hand','driver','route','total_initial_payments']

    def get_driver(self,obj):

        try:
            salesPersonVehicle = SalesPersonVehicle.objects.get(sales_person = obj,date = date.today())

        except Exception as ex :
            
            return ""

        return self.get_name(salesPersonVehicle.driver)

    def get_route(self, obj):

        try:
            salesPersonVehicle = SalesPersonVehicle.objects.get(sales_person = obj,date = date.today())

        except Exception as ex :
            
            return ""


        return salesPersonVehicle.route.title

       
    def get_total_cash_in_hand (self,obj):

        return self.get_total_collection(obj) + self.get_total_initial_payments(obj)

    def get_name(self,obj):
        return obj.Contact.FirstName + ' ' + obj.Contact.LastName

    def get_total_initial_payments (self,obj):

        try:
            salesPersonVehicle = SalesPersonVehicle.objects.get(sales_person = obj,date = date.today())

        except Exception as ex :
            
            return 0

        today_min = datetime.combine(date.today(), time.min) 
        today_max = datetime.combine(date.today(), time.max)
        receipts = Receipt.objects.filter(date__gte = today_min,date__lte = today_max,sales_person_vehicle = salesPersonVehicle,payment_type = Receipt.INITIAL_PAYMENT)
        collection = [ receipt.payment for receipt in receipts ]
        return sum(collection)


    def get_role(self, obj):
        return obj.EmployeeType

    def get_total_collection(self, obj) :

        try:
            salesPersonVehicle = SalesPersonVehicle.objects.get(sales_person = obj,date = date.today())

        except Exception as ex :
            
            return 0

        today_min = datetime.combine(date.today(), time.min) 
        today_max = datetime.combine(date.today(), time.max)
        receipts = Receipt.objects.filter(date__gte = today_min,date__lte = today_max,sales_person_vehicle = salesPersonVehicle,payment_type = Receipt.INSTALMENT)
        collection = [ receipt.payment for receipt in receipts ]
        return sum(collection)

    def get_total_sales(self, obj) :

        try:
            salesPersonVehicle = SalesPersonVehicle.objects.get(sales_person = obj,date = date.today())

        except Exception as ex :
            
            return 0
        print(salesPersonVehicle)
        today_min = datetime.combine(date.today(), time.min) 
        today_max = datetime.combine(date.today(), time.max)

        total = 0
        for order in Order.objects.filter(date__gte = today_min,date__lte = today_max,sales_person_vehicle = salesPersonVehicle):

            total += order.net_payment

        return total

    def get_vehicle(self, obj):
        vehicle =[ veh.vehicle.vehicle_no for veh in obj.vehicles.filter(date=date.today())]#
        if(len(vehicle) == 0):
            return  "Not Assigned"
        return vehicle.pop()


class ProductPieceSerializer (serializers.ModelSerializer) : 

    title = serializers.SerializerMethodField()
    isAvailableAtVehicle = serializers.SerializerMethodField()
    available_at = serializers.SerializerMethodField()

    class Meta:
        model = ProductPiece
        fields = ['id','item_code','sell_price','title','isAvailableAtVehicle','initial_payment','available_at']

    def get_title (self,pp) :
        return pp.batch.product.product_code+" - "+pp.batch.product.title

    def get_available_at (self,pp) :
        move_to_vehicle = MovedToVehicle.objects.filter(product_piece = pp,return_date_time__isnull=True).order_by('-id')
        if move_to_vehicle.exists() :
            return move_to_vehicle.first().to_vehicle.vehicle_no
        return pp.warehouse.title


    def get_isAvailableAtVehicle (self,pp) : 
        user = self.context['request'].user
        sales_person = user.employee
        spv = sales_person.vehicles.filter(date=date.today()).order_by("-id") # returns all the assignments for the day 
        if spv.exists():
            mtv = MovedToVehicle.objects.filter(return_date_time__isnull=True, to_vehicle=spv.first().vehicle , product_piece=pp)
            return mtv.exists() or False
        else:
            raise Exception("Sales person not assigned to a vehicle today")
      

class SaleSerializer (serializers.ModelSerializer) :

    products = serializers.SerializerMethodField()
    customer = GetCustomerDetailsSerializer(many=False)
    sales_person = serializers.SerializerMethodField()
    totalPrice = serializers.SerializerMethodField()
    instalment_plan = InstallmentPlanSerializer(many = False)

    class Meta :

        model = Order
        fields = '__all__'

    def get_products (self,order) :

        orderLines = OrderLine.objects.filter(order = order)
        products = []

        for orderLine in orderLines :

            products.append(orderLine.product)

        return ProductPieceSerializer(instance = products,many = True,context = self.context).data

    def get_instalment_plan (self,order) :

        try:
            installmentPlan = InstallmentPlan.objects.get(order = order)

            return InstallmentPlanSerializer(instance = installmentPlan,many = False).data

        except :
            return None

    def get_sales_person (self,order) :

        return order.sales_person_vehicle.sales_person.__str__()

    def get_totalPrice (self,order) : 

        orderLines = OrderLine.objects.filter(order = order)
        totalPrice = 0

        for orderLine in orderLines:
            totalPrice += orderLine.unit_price

        return totalPrice

class ReceiptSerializer (serializers.ModelSerializer):

    instalment_term = InstalmentTermSerializer(many=False)
    customer = serializers.SerializerMethodField()
    invoice_no = serializers.SerializerMethodField()
    sales_person = serializers.SerializerMethodField()

    class Meta :

        model = Receipt
        fields = '__all__'
        read_only_fields = ['instalment_term','customer','invoice_no']

    def get_customer (self,receipt) :

        return GetCustomerDetailsSerializer(instance = receipt.order.customer,many = False).data

    def get_invoice_no (self,receipt) :

        return receipt.order.invoice_no

    def get_sales_person (self, receipt):

        return receipt.sales_person_vehicle.sales_person.__str__()

class CreateReceiptSerializer (serializers.ModelSerializer) :

    class Meta :

        model = Receipt
        fields = '__all__'

class PieceSerializer (serializers.ModelSerializer):

    entity = serializers.SerializerMethodField()

    class Meta :

        model = ProductPiece
        fields = ('item_code','sell_price','entity','initial_payment')

    def get_entity (self,pp):

        return pp.warehouse.entity

class ProductBatchSerializer (serializers.ModelSerializer) :

    pieces = PieceSerializer(many = True)
    title = serializers.SerializerMethodField()
    product_code = serializers.SerializerMethodField()

    class Meta : 

        model = ProductBatch
        fields = ('pieces','date_in','title','product_code',)

    def get_title (self,pb) :

        return pb.product.title

    def get_product_code (self,pb):

        return pb.product.product_code

class ProductSerializer (serializers.ModelSerializer) :

    batches = serializers.SerializerMethodField()

    class Meta:

        model = Product
        fields = ('title','batches','product_code')


    def get_batches (self,product):

        request = self.context['request']

        batches = ProductBatch.objects.filter(
            product = product
        ).annotate(Count('id')).order_by('-date_in')

        return ProductBatchSerializer(instance = batches,many = True).data


class DriverSerializer (serializers.ModelSerializer) :

    name = serializers.SerializerMethodField()

    class Meta :

        model = Employee
        fields = ['id','name']

    def get_name(self,emp):

        return emp.Contact.FirstName + " " + emp.Contact.LastName

class RouteSerializer (serializers.ModelSerializer) :

    class Meta :

        model = Route
        fields = '__all__'

from user.models import Address

class AddressSerializer (serializers.ModelSerializer) :

    class Meta :

        model = Address
        fields = ('Latitude','Longitude')
    # lat = serializers.DecimalField(max_digits=11, decimal_places=8)
    # lon = serializers.DecimalField(max_digits=11, decimal_places=8)
    # nic = serializers.CharField(max_length=15)

    # def create(self,validated_data):

    #     Latitude = validated_data.pop('lat')
    #     Longitude = validated_data.pop('lon')
    #     nic = validated_data.pop('nic')

    #     customer = Customer.objects.get(NIC__iexact = nic)
    #     address = customer.contact.Address
    #     address.Latitude = Latitude
    #     address.Longitude = Longitude
    #     address.save()

    #     return GetCustomerDetailsSerializer(instance = customer,many = False).data



            