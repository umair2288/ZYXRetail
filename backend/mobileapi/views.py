from django.shortcuts import render
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import GetUserProfileSerializer,GetCustomerDetailsSerializer,SaleSerializer,ReceiptSerializer,CreateReceiptSerializer,ProductSerializer
from user.models import Customer,Employee
from .serializers import (
    GetUserProfileSerializer,
    ProductPieceSerializer,
    RouteSerializer,
    DriverSerializer
)
from installment.serializers import (
    InstalmentPlanSerializer,
    InstalmentTermSerializer
)
from sales.serializers import AddSaleSerializerForRM,AddCashSaleSerializerForRM
from user.serializers import CustomerSerializer
from sales.models import Receipt,Order,OrderLine,PaymentBreakdown,Cheque
from rest_framework.exceptions import ValidationError
from warehouse.serializers import (StockVehicleSerializer ,  SalesPersonVehicleSerializer)
from warehouse.models import (ProductPiece,StockVehicle,SalesPersonVehicle,Warehouse,Product,Route , MovedToVehicle)
from django.db.models import Q,Count
from rest_framework.permissions import IsAuthenticated,AllowAny
from datetime import datetime,timedelta,date,time
from installment.models import InstallmentTerm,InstallmentPlan
from django.db.models import Count,Q
from rest_framework.status import HTTP_400_BAD_REQUEST
from django.core.exceptions import EmptyResultSet
from django.utils import timezone
from sales.serializers import CreatePaymentSerializer
from rest_framework.filters import SearchFilter

# Create your views here.

class GetUserProfile(APIView):
   
    def get(self,request):
        print(request.user)


        return Response(
            {
                "success": True,
                "message" : "profile reterived successfuly",
                "data" : GetUserProfileSerializer(instance=request.user.employee).data
            }
        )


class GetCustomerDetails(APIView):

    permission_classes = [AllowAny,]

    def get(self, request):
        
        try:
            nic = request.query_params['nic']
        except KeyError:
            return Response({
                "success": False,
                "message": "this request require query parameter 'nic'"
            })
        else:
            customers = Customer.objects.filter(Q(NIC__iexact = nic) | Q(orders__invoice_no__iexact = nic)).annotate(Count('id'))
            if not customers.exists():
                return Response({
                    "success": False,
                    "message": "Customer does not exist"
                    })
            else:
                return Response({
                    "success": True,
                    "message": "data retrieved successfully",
                    "data" : GetCustomerDetailsSerializer(instance=customers.first()).data
                })



        
class CheckCustomerByNIC (APIView) :

    permission_classes = [IsAuthenticated]

    def post (self,request) :

        nic = request.data.get('nic')

        try:
            customer = Customer.objects.get(NIC__iexact = nic)

        except:

            return Response({
                "success" : True,
                "message" : "NIC has not associated with any Customer yet"
            })

        return Response({
            "success" : False,
            "message" : "NIC has already associated with another Customer"
        })

from rest_framework.pagination import PageNumberPagination

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 1000

from django.db.models import F,Case,When,IntegerField,Value,Q,ExpressionWrapper
from django.db.models.functions import Exp

class ProductSearch (ListAPIView) :

    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    serializer_class = ProductPieceSerializer
    search_fields = ['item_code','batch__product__product_code','batch__product__title',]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):
        request = self.request
        sales_person = request.user.employee
        spv = sales_person.vehicles.filter(date=date.today()).order_by("-id")
        raw_query = '''
        select wp.* from warehouse_productpiece wp 
        inner join (
            select item_id , case when current_vehicle = {vehicle_id} then 1 else 0 end as is_available from (
                select pp2.id as item_id , 
                case 
                    when mtv_2.id is null then null else mtv_2.to_vehicle_id 
                end as current_vehicle
                from 
                (
                    select pp.id , max(mtv.id) as latest_mtv
                    from warehouse_productpiece pp
                    left join warehouse_movedtovehicle as mtv on mtv.product_piece_id = pp.id
                    group by pp.id
                ) as test
                left join warehouse_movedtovehicle as mtv_2 on mtv_2.id = test.latest_mtv
                inner join warehouse_productpiece as pp2 on pp2.id = test.id
            ) test2
        ) test3 on test3.item_id = wp.id
        order by test3.is_available desc '''.format(vehicle_id=spv.first().vehicle.id)

        pieces_in_inventory = ProductPiece.objects.filter(is_sold=False , batch__product__is_current = True).annotate(Count('id')) # returns availables pieces in inventory  
        # pieces_in_inventory = ProductPiece.objects.raw(raw_query) 
        return pieces_in_inventory

    # def list(self,request):
    #     response = self.get_serializer_class(instance=self.get_queryset(), many=True)

        # if len(pieces) > 0 :

        #     return Response({
        #         "success" : True,
        #         "message" : "Products Retrieved Successfully",
        #         "products" : ProductPieceSerializer(instance = pieces,many = True,context = {"request" : request }).data
        #     })

        # return Response({
        #     "success" : False,
        #     "message" : "No products found for your query"
        # })

class GetMyProducts (ListAPIView):

    permission_classes = [IsAuthenticated]
    filter_backends = [SearchFilter]
    serializer_class = ProductPieceSerializer
    search_fields = ['item_code','batch__product__product_code','batch__product__title',]
    pagination_class = StandardResultsSetPagination

    def get_queryset(self):

        request = self.request
        # query = request.query_params.get('search')
        # entity = request.query_params.get('entity',Warehouse.ROYALMARKETING)

        pieces = ProductPiece.objects.filter(
            is_sold = False,
            batch__product__is_current = True,
            vehicle__to_vehicle__sales_persons__date = date.today(),
            vehicle__to_vehicle__sales_persons__sales_person__User = request.user
        ).annotate(Count('id'))
        
        return pieces

class GetProductByItemCode (APIView) :

    permission_classes = [IsAuthenticated]

    def get(self,request):

        item_code = request.query_params.get('item_code')
        # print(item_code)

        try :
            product = ProductPiece.objects.get(item_code = item_code,is_sold = False,batch__product__is_current = True)

        except:

            return Response ({
                "success" : False,
                "message" : "Invalid Product"
            })

        return Response ({
            "success" : True,
            "message" : "Product retrieved successfully",
            "product" : ProductPieceSerializer(instance = product,many = False,context = {"request" : request}).data 
        })
        
class CreateSale (APIView) :

    permission_classes = [IsAuthenticated]

    def post (self,request) :

    #    ordinal = lambda n: "%d%s" % (n,"tsnrhtdd"[(n/10%10!=1)*(n%10<4)*n/10::4])
        data = request.data
        print(data)
        try:
            customer = Customer.objects.filter(id=data["customer_id"]).get()
            sales_person = Employee.objects.filter(User = request.user).get()
            product_pieces = data['products']
            initial_payment = data["initial_payment"]
            cheques = data['cheques']
            discount = data['discount']
            entity = data['entity']
            if entity == Order.ROYALMARKETING :                
                no_of_terms = data["no_of_terms"]
                instalment_type = data["instalment_type"]
            
        except KeyError:
           response = { "success":False, "message": "Body doesn't contain required data" }
          
           return Response(response)

        except ObjectDoesNotExist:
            response = { "success":False, "message": "ID's are invalid, Object Does not exsists"} 
            return Response(response)       

        else:
            orders = Order.objects.filter(customer = customer)
            invoice_no = "IN" +str(customer.id) + str(len(orders)+1)
            order = Order(
                invoice_no = invoice_no,
                customer=customer,
                sales_person=sales_person,
                date=datetime.today(),
                entity=entity )
            try:
                order.full_clean()
            except ValidationError as e:
                response = { "success":False, "message": "validating order failed " ,"expection":e}
                return Response(response)
            else:
                order.save()
                product_array = []
                totalPrice = 0
                for pp in product_pieces :

                    product_piece = ProductPiece.objects.get(id = pp.get('id'))
                    product_array.append(product_piece)
                    totalPrice += product_piece.sell_price

                    orderLine=OrderLine(
                        order=order,
                        product=product_piece,
                        quantity=1,
                        unit_price=product_piece.sell_price,
                        discount_amount = product_piece.sell_price * discount / 100
                    )
                    try:
                        orderLine.full_clean()
                    except ValidationError as e:
                        order.delete()
                        for product in product_array :
                            product.is_sold = False
                            product.save()

                        response = { "success":False, "message": "validating order line failed " ,"expection":e}
                        return Response(response)
                    else:
                        orderLine.save()
                        product_piece.is_sold = True
                        product_piece.save()

                ##creating instalment
                if not entity==Order.ROYALMARKETING :
                    

                    totalPrice = initial_payment

                    for cheque in cheques : 

                        totalPrice += cheque['amount']


                    payment = Receipt(
                        order=order, 
                        payment_type=Receipt.COMPLETE ,
                        payment = initial_payment,
                        date = datetime.today(),
                        sales_person = sales_person
                    )

                    try:
                        payment.full_clean()
                    except ValidationError as e:
                        for product in product_array :
                            product.is_sold = False
                            product.save()
                        order.delete()
                        response = { "success":False, "message": "validating  payment reciept failed " ,"expection":e}
                        return Response(response) 
                    else:
                        payment.save()
                        payment_breakdown = PaymentBreakdown.objects.create(
                            receipt = payment,
                            method = PaymentBreakdown.CASH,
                            amount = initial_payment
                        )

                        if len(cheques) > 0 :

                            payment_breakdown = PaymentBreakdown.objects.create(
                                receipt = payment,
                                method = PaymentBreakdown.CHEQUE,
                                amount = totalPrice - initial_payment
                            )

                            for cheque in cheques :

                                Cheque.objects.create(
                                    payment_breakdown = payment_breakdown,
                                    cheque_no = cheque['cheque_no'],
                                    deposit_date = cheque['date'],
                                    amount = cheque['amount'],
                                    bank = cheque['bank']
                                )

                    return Response({
                        "success":True,
                        "message":"Sale order created for entity {}".format(entity),
                        "data":SaleSerializer(instance=order,many = False,context = {"request":request}).data
                    })   
                instalment_plan = InstallmentPlan(invoice=order,initial_payment=initial_payment,no_of_terms=no_of_terms,installment_type=instalment_type)
                try:
                    instalment_plan.full_clean()
                except ValidationError as e:
                    for product in product_array :
                        product.is_sold = False
                        product.save()
                    order.delete()
                    response = { "success":False, "message": "validating instalment plan failed " ,"expection":e}
                    return Response(response)                   
                else:
                    instalment_plan.save()
                    receipt_initial_payment = Receipt(
                        order=order, 
                        payment_type="INITIAL" ,
                        payment = initial_payment,
                        date = datetime.today(),
                        sales_person = sales_person
                        )
                    try:
                        receipt_initial_payment.full_clean()
                    except ValidationError as e:
                        for product in product_array :
                            product.is_sold = False
                            product.save()
                        order.delete()
                        response = { "success":False, "message": "validating initail payment reciept failed " ,"expection":e}
                        return Response(response) 
                    else:
                        receipt_initial_payment.save()
                        instalment_amount = (totalPrice - initial_payment)/no_of_terms
                        due_date = datetime.today()
                        if(instalment_type=="Weekly"):
                            days = 7
                        elif(instalment_type=="Monthly"):
                            days = 30
                        else:
                            response = { "success":False, "message": "invalid instalment type expected 'Weekly' or 'Monthly' "}
                            return Response(response)
                        for term in range(no_of_terms):
                            due_date = due_date  + timedelta(days=days)
            
                            print("Term " + str(term+1) + "-" + str(instalment_amount) + "-"  + str(due_date) )
                            instalment_term = InstallmentTerm(plan = instalment_plan, title="Term " +str(term+1) ,due_amount=instalment_amount,due_date=due_date)
                            try:
                                instalment_term.full_clean()
                            except ValidationError as e:
                                order.delete()
                                response = { "success":False, "message": "validating instalment (Weekly)term at term {}".format(term) ,"expection":e}
                                return Response(response) 
                            else:
                                instalment_term.save()

        query = InstallmentTerm.objects.filter(plan=instalment_plan)
        instalment_terms = [instalment_term for instalment_term in query]
        response = {
            "success": True,
            "message" : "sale added successfuly ",
            "data": SaleSerializer(instance = order,many = False,context = {"request":request}).data
        }                        
          
        return Response(response)

from .models import SMS

class CreateReceipt(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):

        # print(request.data)
        try:
            sales_person_vehicle = SalesPersonVehicle.objects.get(sales_person__User = request.user,date = datetime.today())
        except :

            return Response({
                "success" : False,
                "message" : "Sales person vehicle doesn't exist"
            })

        try:
            installment_plan = InstallmentPlan.objects.get(id = request.data.get('plan_id'))
        except :
            return Response({
                "success" : False,
                "message" : "Installment plan doesn't exist"
            })

        

        try:
            data = {
                "invoice_no" : installment_plan.invoice.invoice_no,
                "sales_person_vehicle_id" : sales_person_vehicle.id,
                "date" : timezone.now(),
                "total_payment" : request.data.get('amount'),
                "discount" : 0.00
            }
        except KeyError:
            return Response({
                "success": False,
                "message": "Data missing in request body"
            })
        else:
            ser = CreatePaymentSerializer(data=data)
            if ser.is_valid():
                receipt= ser.save()
                sms = SMS()
                receiptData = ReceiptSerializer(instance=receipt).data
                message = "Hi "+receiptData['customer']['name']+", Your payment has recieved successfully.\nAmount : LKR."+str(receiptData['payment']) + "\nThank you.\nHotline - 0773883879"
                sms.send_message(message,recipients = [receiptData['customer']['contact']])
                return Response({
                    "success":True,
                    "message": "Receipt created successfully",
                    "data": receiptData
                })

            return Response({
                "success": False,
                "message": ser.errors
            })

class GetSales (APIView):

    permission_classes = [IsAuthenticated]

    def get(self,request):

        sales = Order.objects.filter(sales_person_vehicle__sales_person__User = request.user)
        if request.query_params.get('today') :
            today_min = datetime.combine(date.today(), time.min) 
            today_max = datetime.combine(date.today(), time.max)

            sales = sales.filter(date__gte = today_min,date__lte = today_max)
        
        if not sales.exists() :
            return Response({
                "success" : False,
                "message" : "Sales not found"
            })

        return Response({
            "success" : True,
            "message" : "Sales successfully recieved",
            "sales" : SaleSerializer(instance = sales,many = True , context = {"request" : request}).data
        })

class GetReceipts (APIView) :

    permission_classes = [IsAuthenticated]

    def get(self,request):

        try:
            salesPersonVehicle = SalesPersonVehicle.objects.get(sales_person__User=request.user,date = date.today())

        except Exception as ex :
            return Response({
                "success" : False,
                "message" : "Sales person vehicle does not exist"
            })

        receipts = Receipt.objects.filter(sales_person_vehicle = salesPersonVehicle ,payment_type = Receipt.INSTALMENT)
        if request.query_params.get('today') :
            today_min = datetime.combine(date.today(), time.min) 
            today_max = datetime.combine(date.today(), time.max)

            receipts = receipts.filter(date__gte = today_min,date__lte = today_max)
        
        if not receipts.exists() :
            return Response({
                "success" : False,
                "message" : "Reciepts not found"
            })

        return Response({
            "success" : True,
            "message" : "Reciepts successfully recieved",
            "collections" : ReceiptSerializer(instance = receipts,many = True , context = {"request" : request}).data
        })


class AddCustomer (APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request):
        print(request.data)
        serializer = CustomerSerializer(data=request.data)
        employee = Employee.objects.get(User = request.user)

        if serializer.is_valid():
            data=serializer.save()

            response = {
                "success": True , 
                "message" : "Customer Created Successfully" ,
                'data':GetCustomerDetailsSerializer(instance = Customer.objects.get(id = data['id']),many = False,context = {"request":request}).data}
        else:
            response = {"success": False,"message" : serializer.errors}

        return Response(response)

class GetVehicles (ListAPIView) :

    serializer_class = StockVehicleSerializer

    def get_queryset (self) :

        queryset = StockVehicle.objects.filter(is_current = True)

        if (self.request.query_params.get('entity')):

            queryset = queryset.filter(entity = self.request.query_params.get('entity'))

        return queryset

class GetDrivers (ListAPIView) :

    serializer_class = DriverSerializer

    def get_queryset(self):

        queryset = Employee.objects.filter(Q(IsCurrent = True) & Q(EmployeeType = "DRIVER")).exclude(Q(drivers__driver__in = SalesPersonVehicle.objects.filter(date = date.today()).values('driver')))

        if (self.request.query_params.get('entity')):

            queryset = queryset.filter(Entity = self.request.query_params.get('entity'))

        return queryset

class GetRoutes (ListAPIView) :

    serializer_class = RouteSerializer

    def get_queryset(self):

        return Route.objects.all()

class CreateSalesPersonVehicle (APIView) :

    permission_classes = [IsAuthenticated]

    def post (self,request):
        
        if not request.data.get('vehicle') :

            return Response({
                "success" : False,
                "message" : "Please provide the vehicle no"
            })

        if not request.data.get('route') :

            return Response({
                "success" : False,
                "message" : "Please provide the route"
            })

        if not request.data.get('driver') :

            return Response({
                "success" : False,
                "message" : "Please provide the driver"
            })

        try :
            stockVehicle = StockVehicle.objects.get(vehicle_no = request.data.get('vehicle'),is_current = True)
        except : 

            return Response({
                "success" : False,
                "message" : "Vehicle doesn't exist. Please provide the correct vehicle no"
            })

        try :
            # print(request.data.get('route'))
            route = Route.objects.get(id = request.data.get('route'))
        except : 

            return Response({
                "success" : False,
                "message" : "Route doesn't exist. Please provide the correct route"
            })

        try :
            driver = Employee.objects.get(id = request.data.get('driver'),EmployeeType = "DRIVER")
        except : 

            return Response({
                "success" : False,
                "message" : "Driver doesn't exist. Please provide the correct driver"
            })


        try:
            salesPersonVehicle = SalesPersonVehicle.objects.get(vehicle = stockVehicle,date = date.today())

            return Response ({
                "success" : False,
                "message" : "Sorry, This vehicle has already assigned for another sales person : " + salesPersonVehicle.sales_person.contact.FirstName
            })

        except:
            pass

        try:
            salesPersonVehicle = SalesPersonVehicle.objects.get(driver = driver,date = date.today())

            return Response ({
                "success" : False,
                "message" : "Sorry, This driver has already assigned for another sales person : " + salesPersonVehicle.sales_person.contact.FirstName
            })

        except:
            pass

        try :

            salesPersonVehicle = SalesPersonVehicle.objects.get(sales_person = request.user.employee,date = date.today())

            return Response ({
                "success" : False,
                "message" : "Sorry, You have already assigned for Vehicle No : " + salesPersonVehicle.vehicle.vehicle_no
            })

        except:

            salesPersonVehicle = SalesPersonVehicle.objects.create(
                sales_person = request.user.employee,
                driver = driver,
                route = route, 
                date = date.today(),
                vehicle = stockVehicle)

            return Response({
                "success" : True,
                "message" : "Successfully assigned the vehicle for you today",
                "data" : SalesPersonVehicleSerializer(instance=salesPersonVehicle ).data#StockVehicleSerializer(instance = salesPersonVehicle.vehicle,many=False).data
            })

from django.db.models import Q
from rest_framework.filters import SearchFilter


class ProductSearchForLabel (ListAPIView):

    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    filter_backends = [SearchFilter]
    search_fields = ['^product_code','^title']
    pagination_class = StandardResultsSetPagination

from django.db import transaction

class AddSaleForRM (APIView):

    @transaction.atomic
    def post (self,request):

        order_type = request.data.get('type')

        try:
            sales_person_vehicle = SalesPersonVehicle.objects.get(sales_person__User = request.user,date = datetime.today())
        except :

            return Response({
                "success" : False,
                "message" : "Sales person vehicle doesn't exist"
            })

        request.data['sales_person_vehicle_id'] = sales_person_vehicle.id
        request.data['start_date'] = date.today() + timedelta(days =  7)
        request.data['end_date'] = date.today() + timedelta(days = request.data['number_of_terms'] * 7)
        print(request.data['number_of_terms'])
    
        if order_type == "Installment" :

            ser = AddSaleSerializerForRM(data = request.data)

        elif order_type == "Cash":

            ser = AddCashSaleSerializerForRM(data = request.data)

        else:

            return Response({
                "success" : False,
                "message" : "Payment type should be cash or installment"
            })

        if ser.is_valid():

            try:

                orderObj = ser.save()

            except Exception as ex :

                print(ex)
                return Response({
                    "success":False,
                    "message" : "Your order failed!"
                    # "data" : {}
                })
                
            
            order  = Order.objects.get(id = orderObj.id)

            try :
                data = SaleSerializer(instance = order ,many = False,context = {"request" : request}).data
            except Exception as ex :

                print(ex)
                return Response({
                    "success":False,
                    "message" : "Your order failed!"
                    # "data" : {}
                })

            # print(ser.save())
            if order_type == "Installment" :

                sms = SMS()
                message = "Hi "+data['customer']['name']+", Order has been successfully created.\nTotal Amount : "+str(data['totalPrice']-float(data['discount']))+"\nInvoice : "+data['invoice_no']+"\nInitial Payment : LKR."+str(data['instalment_plan']['initial_payment'])+"\nNo of terms : "+str(data['instalment_plan']['no_of_terms'])+"\nThank you.\nHotline - 0773883879"
                sms.send_message(message,recipients = [data['customer']['contact']])

            return Response({
                "success" : True,
                "message" : "Your order successfully created!",
                # "data" : {}
                "data" : data
            })

        else:
            print("Helloooooo")
            return Response({
                "success":False,
                "message" : "Order creation failed"
            })

from .serializers import ReturnOrderSerializer

class CreateReturnOrder (APIView):

    def post(self, request):

        try:
            salesPersonVehicle = SalesPersonVehicle.objects.get(sales_person__User=request.user,date = date.today())

        except Exception as ex :
            return Response({
                "success" : False,
                "message" : "Sales person vehicle does not exist"
            })
        
        request.data['sales_person_vehicle'] = salesPersonVehicle.id
        
        serializer = ReturnOrderSerializer(data=request.data)

        if serializer.is_valid():

            returnOrder = serializer.save()

            custSerializer = GetCustomerDetailsSerializer(instance = returnOrder.order.customer,many = False).data
            sms = SMS()
            message = "Hi "+custSerializer['name']+", Return order has been successfully created.\nItem Code : "+returnOrder.product_piece.item_code+"\nInvoice : "+returnOrder.order.invoice_no+"\nReason : "+returnOrder.return_order_type+"\nThank you."
            sms.send_message(message,recipients = [custSerializer['contact']])
            return Response({
                "success" : True,
                "message" : "Return Order Successfully Created",
                "data" : custSerializer,
                "returnOrder" : serializer.data
            })

        return Response({
            "success":False,
            "message" : serializer.errors
        })

from .serializers import AddressSerializer

class UpdateCustomerLocation (APIView) :

    def put (self, request):

        try:
            nic = request.data.get('nic')
        except :
            return Response({
                "success" : False,
                "message" : "Parameters are wrong"
            })

        customer = Customer.objects.get(NIC__iexact = nic)
        address = customer.contact.Address
        serializer = AddressSerializer(address,data = request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response({
            "success" : True,
            "message" : "Location Updated Successfully",
            "customer" : GetCustomerDetailsSerializer(instance = customer,many = False).data
        })

class GetAllReceipts (ListAPIView):

    serializer_class = ReceiptSerializer

    def get_queryset(self):

        request = self.request

        receipts = Receipt.objects.filter(
            order__invoice_no = request.query_params.get('order')
        ).order_by('-date')

        return receipts