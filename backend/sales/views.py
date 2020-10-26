from django.shortcuts import render
from django.core.exceptions import ValidationError , ObjectDoesNotExist
from rest_framework.views import APIView

from rest_framework.response import Response 
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.status import HTTP_404_NOT_FOUND , HTTP_200_OK , HTTP_400_BAD_REQUEST
from user.models import Employee, Customer
from warehouse.models import ProductPiece , SalesPersonVehicle
from sales.models import Order, OrderLine ,Receipt , PaymentBreakdown , Cheque , ReturnOrder
from installment.models import InstallmentPlan, InstallmentTerm
from datetime import datetime , timedelta
from installment.serializers import InstalmentTermSerializer, InstalmentPlanSerializer
from sales.serializers import ( CreatePaymentSerializer, AddCashSaleSerializerForRM,
    GetOrderSerializer , ReceiptSerializer, GetReceiptsSerializer , PaymentBreakdownSerializer , 
 OrderSerializer , AddSaleSerializer , SaleOrderLineSerializer , ChequeSerializer , OrderSummarySerializer , ReturnOrderSerializer
 ,OrderSearchSerializer , PerformActionSerializer ,ReturnOrderBalanceSerializer
 
 )
from rest_framework import generics , filters , status , pagination
import math
import random
# Create your views here.



class AddSaleV2(generics.CreateAPIView):
    queryset = Order.objects.all()
    serializer_class = AddSaleSerializer 
    def create(self,request, entity="default", *args , **kwarg):
        data = request.data
        if entity =='sega': 
            data['invoice_no'] = "SG" + str(random.randint(1,10))
            data['entity'] = "SEGA"
            data['date'] = datetime.now()
            ser = OrderSerializer(data=data)
            if ser.is_valid(raise_exception=True):
               order =  ser.save()
               order.invoice_no = "SG" + str(order.id)
               order.save()
               for ol in data['order_lines'] :
                   ol['order'] = order.id
               ser = SaleOrderLineSerializer(data= data['order_lines'] , many=True)
               if ser.is_valid(raise_exception=True):
                   order_lines = ser.save()
                   for ol in order_lines:
                       ol.product.is_sold = True
                       ol.product.save()
            receipt_data = {
                            "payment" :  data['amount'],
                            "order" : order.id,
                            "sales_person": data['sales_person'],
                            "payment_type" : "COMPLETE"
                            }
            ser = ReceiptSerializer(data= receipt_data)
            if ser.is_valid(raise_exception=True):
                receipt = ser.save()
            payment_breakdown = data['payment_breakdown']
            for pb in payment_breakdown:
                pb['receipt'] = receipt.id
                ser = PaymentBreakdownSerializer(data=pb)
                if ser.is_valid(raise_exception=True):
                    break_down = ser.save()
                    if (pb['method'] == PaymentBreakdown.CHEQUE):
                        for cheque in pb['cheque']:
                            cheque['payment_breakdown'] = break_down.id
                        ser = ChequeSerializer(data = pb['cheque'] , many=True )
                        if ser.is_valid(raise_exception=True):
                            ser.save()
                            return Response({"Order has been created"})
                   
        if entity =='chitfund': 
            data['invoice_no'] = "CF" + str(random.randint(1,10))
            data['entity'] = "CHITFUND"
            data['date'] = datetime.now()
            ser = OrderSerializer(data=data)
            if ser.is_valid(raise_exception=True):
               order =  ser.save()
               order.invoice_no = "CF" + str(order.id)
               order.customer_group.is_locked = True
               order.customer_group.save()
               order.save()             
               for ol in data['order_lines'] :
                   ol['order'] = order.id
               ser = SaleOrderLineSerializer(data= data['order_lines'] , many=True)
               if ser.is_valid(raise_exception=True):
                   order_lines = ser.save()
                   for ol in order_lines:
                       ol.product.is_sold = True
                       ol.product.save()
            receipt_data = {
                            "payment" :  data['amount'],
                            "order" : order.id,
                            "payment_type" : "COMPLETE"
                            }
            ser = ReceiptSerializer(data= receipt_data)
            if ser.is_valid(raise_exception=True):
                receipt = ser.save()
                return Response({"Order has been created"})
                   


class AddSale(APIView):

    def post(self,request):
      #  ordinal = lambda n: "%d%s" % (n,"tsnrhtdd"[(n/10%10!=1)*(n%10<4)*n/10::4])
        data = request.data
        print(data)
        try:
            customer = Customer.objects.filter(id=data["customer_id"]).get()
            sales_person = SalePersonVehicle.objects.filter(id=data["sales_person_vehicle_id"]).get()
            product_pieces = ProductPiece.objects.filter(id__in=data["product_piece_ids"]).get()
            initial_payment = data["initial_payment"]
            number_of_terms = data["number_of_terms"]
            due_per_term = data["due_per_term"]
            start_date = data["star_date"]
            end_date = data["star_date"]

            entity = data['entity']
            if entity == Order.ROYALMARKETING:                
                no_of_terms = data["no_of_terms"]
                instalment_type = data["instalment_type"]
                week_day = data["week_day"]
                invoice_prefix = "RM"  
            if entity == Order.SEGA:
                payment_breakdown = data['payment_breakdown']
                invoice_prefix = "SG"    

        except KeyError:
           response = { "success":False, "message": "Body doesn't contain required data" }    
           return Response(response)

        except ObjectDoesNotExist:
            response = { "success":False, "message": "ID's are invalid, Object Does not exsists"} 
            return Response(response)       
        else:
            invoice_no = invoice_prefix +str(customer.id) + str(product_piece.id)
            order_data = {
                "invoice_no" : invoice_no,
                "customer" : customer,
                "sales_person": sales_person,
                "date" : datetime.today(),
                "entity": entity
            }
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
                orderLine=OrderLine(
                    order=order,
                    product=product_piece,
                    quantity=1,
                    unit_price=product_piece.sell_price,
                    discount_amount=0)
                try:
                    orderLine.full_clean()
                except ValidationError as e:
                    order.delete()
                    response = { "success":False, "message": "validating order line failed " ,"expection":e}
                    return Response(response)
                else:
                    orderLine.save()
                    product_piece.is_sold = True
                    product_piece.save()
                    ##creating instalment
                    if not entity=="ROYALMARKETING" :
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
                            product_piece.is_sold = False
                            product_piece.save()
                            order.delete()
                            response = { "success":False, "message": "validating  payment reciept failed " ,"expection":e}
                            return Response(response) 
                        else:
                            payment.save()
                            ser = PaymentBreakdownSerializer(data=payment_breakdown , many=True)
                            if ser.is_valid(raise_exception=True) :
                                ser.save()
                                return Response({
                                    "success":True,
                                    "message":"Sale order created for entity {}".format(entity),
                                    "data": OrderSerializer(instance=order).data
                                })
                            else:
                                order.delete()

                    instalment_plan = InstallmentPlan(invoice=order,initial_payment=initial_payment,no_of_terms=no_of_terms, week_day = week_day ,installment_type=instalment_type)
                    try:
                        instalment_plan.full_clean()
                    except ValidationError as e:
                        product_piece.is_sold = False
                        product_piece.save()
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
                            product_piece.is_sold = False
                            product_piece.save()
                            order.delete()
                            response = { "success":False, "message": "validating initail payment reciept failed " ,"expection":e}
                            return Response(response) 
                        else:
                            receipt_initial_payment.save()
                            instalment_amount = (product_piece.sell_price - initial_payment)/no_of_terms
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
            "data": {
                "instalment_plan" : InstalmentPlanSerializer(instance=instalment_plan).data ,
                "instalment_terms" : InstalmentTermSerializer(instance=instalment_terms , many=True).data
            }
        }                        
          
        return Response(response)





class GetOrders(APIView):


    def get(self, request , type = "all" ):
        try:
            invoice = request.query_params['invoice']
        except KeyError:
            return Response({"success":False, "message": "Query parameter invoice does not exists"}, status=HTTP_404_NOT_FOUND)
        else :
            if invoice == 'all':
                if(type=="royalmarketing"):
                    query = Order.objects.filter(entity=Order.ROYALMARKETING)
                elif(type=="sega"):
                    query = Order.objects.filter(entity=Order.SEGA)
                elif(type=="chitfund"):
                    query = Order.objects.filter(entity=Order.CHIT_FUND)
                else:
                    query = Order.objects.all()
                orders = [order for order in query]          
                return Response({
                        "success" : True,
                        "message" : "Reteriving all data",
                        "data" : GetOrderSerializer(instance=orders, many=True).data
                    })
            else:
                query = Order.objects.filter(invoice_no=invoice)
                
                try :
                    orders = query.get()
                except Exception :
                    return Response({
                        "success":False,
                        "message":"Invalid Invoice no"
                    })
                return Response({
                        "success" : True,
                        "message" : "Reteriving all data",
                        "data" : GetOrderSerializer(instance=orders ).data
                    })
          
        


class CreateReceipt(APIView):

    def post(self, request):

        try:
            data = {
                "order": request.data["order_id"],
                "instalment_term": request.data["term_id"],
                "sales_person": request.data["salesPersonId"],
                "payment_type": request.data["paymentType"],
                "payment": request.data["amount"]
            }
        except KeyError:
            return Response({
                "success": False,
                "message": "Data missing in request body"
            })
        else:
            ser = ReceiptSerializer(data=data)
            if ser.is_valid(raise_exception=True):
                receipt= ser.save()
                paid_receipts = receipt.instalment_term.paid_receipts.all()
                sum_payment = sum([paid_receipt.payment for paid_receipt in paid_receipts]) 
            
                if sum_payment == receipt.instalment_term.due_amount:
                    receipt.instalment_term.is_paid=True
                    receipt.instalment_term.save()        
                return Response({
                    "success":True,
                    "message": "Receipt created successfully",
                    "data": ReceiptSerializer(instance=receipt).data
                })


class GetReceipts(APIView):

    def get(self, request ,type="all",year="all",month="all",date="all"):
        #types : royalmarketing,sega,chitfund
        #design the query
        if type == 'all':        
            query = Receipt.objects.order_by('-date')           
        elif type == 'royalmarketing':
            query = Receipt.objects.filter(order__entity="ROYALMARKETING")
            #royalmarketing only
        elif type == 'sega' :
            query = Receipt.objects.filter(order__entity="SEGA")         
            #sega only
        elif type == 'chitfund' :
            query = Receipt.objects.filter(order__entity="CHITFUND")   
            #chit fund only
        else:
            return Response({
                "success":False,
                "message": "Check your URL-404"
            })
        
        #reterive data
        if(query.exists()):
            receipts = [receipt for receipt in query]
            return Response(
                {
                    "success":True,
                    "message": "data reterived successfly",
                    "data" : GetReceiptsSerializer(instance=receipts , many=True).data
                }
            )
        else:
            return Response ({
                "success" : True,
                "message" : "No data exisist",
                "data": []
            })



class GetTotalSalesByDateForEmployee(APIView):

    def post(self, request):
        try:
            emp_id = int(request.query_params['emp_id'])
            from_date = request.query_params['from']
            to_date = request.query_params['to']
            entity = request.query_params['entity']
        except KeyError:
            return Response({
                message:"query parameters"
            },status=400)
        query = Order.objects.filter(
            sales_person_id = emp_id
        )
        if query.exists():
            total_sum = 0
            for order in query:
                order_sum  = 0
                for ol in order.orderLines:
                    amount = ol.unit_price * ol.quantity - ol.discount_amount
                    order_sum = sum + amount
                            
                total_sum = total_sum + order_sum
            return Response({"total_sales": total_sum})




class TestAPIView(generics.CreateAPIView):
   
    queryset = PaymentBreakdown.objects.all()
    serializer_class = PaymentBreakdownSerializer

    def get_serializer(self, instance=None, data=None, many=False, partial=False):
        return super(TestAPIView, self).get_serializer(instance=instance, data=data, many=True, partial=partial)



class GetSaleActivePlanIntallmentPlanCount(APIView):
    pass

from .serializers import AddSaleSerializerForRM
class AddSaleForRM(APIView):
    def post(self,request):
        order_type = request.query_params.get("type") 
        if order_type == 'instalment':
            ser = AddSaleSerializerForRM(data=request.data)
        elif order_type == "cash":
            ser = AddCashSaleSerializerForRM(data=request.data)
        else:
            return Response({
                "success":False,
                "message":"query param should be instalment / cash"
            },HTTP_400_BAD_REQUEST)
        if(ser.is_valid(raise_exception=True)):
            print(ser.save())
            return Response({
                "success":True,
                "message" : "Your order successfully created!"
            })
        else:
            return Response({
                "success":False,
                "message" : "Order creation failed"
            },HTTP_400_BAD_REQUEST)


class OrderSummary(APIView):

    def get(self,request ,id = None):
        if(id):
            try:
                order = Order.objects.get(pk=id)
                return Response(OrderSummarySerializer(instance=order).data)
            except ObjectDoesNotExist:
                return Response("Order ID not found",status=status.HTTP_404_NOT_FOUND )



class ListReturnOrder(generics.ListAPIView):

    queryset = ReturnOrder.objects.all()
    serializer_class = ReturnOrderSerializer


    def list(self,request):
        customer_nic = request.query_params.get("customer_nic", None)
        product_code = request.query_params.get("product_code", None)
        invoice = request.query_params.get("invoice", None)
        date = request.query_params.get("date", None)
        is_revalued = request.query_params.get("is_revalued", None)

        queryset = self.get_queryset()
        
        if customer_nic is not None:
            queryset = queryset.filter(order__customer__NIC=customer_nic)
        if product_code is not None:
            queryset = queryset.filter(product_piece__item_code = product_code)
        if invoice is not None:
            queryset = queryset.filter(order__invoice_no=invoice)
        if date is not None:
            queryset = queryset.filter(date = date)
        if is_revalued is not None:
            queryset = queryset.filter(is_revalued = False)

      
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)



class OrderReciepts(generics.ListAPIView):
    serializer_class = ReceiptSerializer
    def list(self , request , invoice_no):
        try:
            order = Order.objects.get(invoice_no=invoice_no)
        except ObjectDoesNotExist:
            return Response("Reciept does not exists" , status=HTTP_404_NOT_FOUND)
        else:
            reciepts = Receipt.objects.filter(order=order)
            return Response(ReceiptSerializer(instance=reciepts , many=True).data , status=HTTP_200_OK )


class CreatePayment(APIView):
    
    def post(self,request):
        ser = CreatePaymentSerializer(data=request.data)
        if ser.is_valid(raise_exception=True):
            reciept = ser.save()
            return Response(ReceiptSerializer(instance=reciept).data , status=HTTP_200_OK)



class OrderListView(generics.ListAPIView):

    queryset = Order.objects.all()
    serializer_class = OrderSearchSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['customer__NIC' , "invoice_no"]


class PerformReturnOrderAction(APIView):

    def post(self,  request,id):
        data = request.data 
        data["return_order_id"] = id
        ser = PerformActionSerializer(data=data)
        if ser.is_valid(raise_exception=True):
            data = ser.save()
            return Response(data)

class ReturnOrderBalanceAmount(APIView):

    def get(self, request ):
        id = request.query_params.get("id")
        value = request.query_params.get("value")
        product_piece = request.query_params.get("product_piece")
        if not ( id and value ) :
            return Response("id or value not found" , HTTP_404_NOT_FOUND)
        ser = ReturnOrderBalanceSerializer(
            data = {
                "id" : id,
                "value" : value,
                "product_piece":product_piece
            }
        )

        if ser.is_valid():
            try:
                response = ser.save()
            except ValidationError as ex:
                return Response(ex.message,HTTP_400_BAD_REQUEST)
            else:
                return Response(response , status=HTTP_200_OK)