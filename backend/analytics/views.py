from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import ListAPIView , RetrieveAPIView
from warehouse.models import ProductPiece , MovedToVehicle
from sales.models import Receipt , Order
from django.db.models import Sum
from django.db import connection
from django.utils import timezone
from .models import Report
from .serializers import SalesSummerySerializer , CurrentStockReportSerializer , SalesSerializer , ProductVehicleStockSerializer , ReportSerializer
from rest_framework.pagination import LimitOffsetPagination
# Create your views here.

class SalesSummary(APIView):

    def get(self, request, entity="all"):
        if entity == 'royalmarketing':
            q = Receipt.objects.values('sales_person_id').annotate(total=Sum('payment'))          
        elif entity == 'sega':
            pass

        return Response(SalesSummerySerializer(instance=q.get()).data)


class StockReport(ListAPIView):

    queryset = ProductPiece.objects.filter(is_sold=False)
    serializer_class = CurrentStockReportSerializer
    pagination_class = LimitOffsetPagination

    def list(self , request):
        queryset = self.get_queryset()
        category = request.query_params.get("category",None)   
        if category and category != 'all':
            queryset=queryset.filter(batch__product__category__id=category)
        page = self.paginate_queryset(queryset)
        if page :    
            ser = self.get_serializer(instance=page , many=True)
            return self.get_paginated_response(ser.data)
        
        ser = self.get_serializer(instance=queryset, many=True)
        return Response(ser.data)


class TodaySalesReportByVehicle(ListAPIView):

    queryset = Order.objects.filter(date=timezone.now().date())
    serializer_class = SalesSerializer
    pagination_class = LimitOffsetPagination


    def list(self , request):
        queryset = self.get_queryset()
        vehicle = request.query_params.get("vehicle",None)   
        if vehicle and vehicle != 'all':
            queryset=queryset.filter(sales_person_vehicle__vehicle__id=vehicle)
        page = self.paginate_queryset(queryset)
        if page : 
            ser = self.get_serializer(instance=page , many=True)
            return self.get_paginated_response(ser.data)
        ser = self.get_serializer(instance=queryset, many=True)
        return Response(ser.data)


class ProductsByVehicle(ListAPIView):

    queryset = Order.objects.filter(date=timezone.now().date())
    serializer_class = SalesSerializer
    pagination_class = LimitOffsetPagination


    def list(self , request):
        queryset = self.get_queryset()
        vehicle = request.query_params.get("vehicle",None)   
        if vehicle and vehicle != 'all':
            queryset=queryset.filter(sales_person_vehicle__vehicle__id=vehicle)
        page = self.paginate_queryset(queryset)
        if page : 
            ser = self.get_serializer(instance=page , many=True)
            return self.get_paginated_response(ser.data)
        ser = self.get_serializer(instance=queryset, many=True)
        return Response(ser.data)



class GenerateReport(RetrieveAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer

    def retrieve(self,request,pk=None):
        query_params = request.GET.dict()
        limit = request.GET.get("limit",None)
        offset = request.GET.get("offset",0)
        report = self.get_queryset().get(id=pk)
        query = report.report_query.all()[0].query.format(**query_params) 
        get_total_query = "SELECT COUNT(*) as total FROM ( {query} ) as q".format(query=query)
        with connection.cursor() as cursor:
            cursor.execute(get_total_query)
            columns = [col[0] for col in cursor.description]  
            data = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
                ] 
            total = data[0]["total"] 
        if limit:
            query += " LIMIT {limit} OFFSET {offset} ".format(limit=limit,offset=offset) 
        with connection.cursor() as cursor:
            cursor.execute(query)
            columns = [col[0] for col in cursor.description]  
            data = [
                dict(zip(columns, row))
                for row in cursor.fetchall()
                ]  
            if limit:     
                return Response({
                    "count" : total,
                    "next" : None,
                    "previous": None,
                    "results" : data
                } )
            else : 
                return Response(data)
        
        return Response({
            "success" : False
        })

# class ProductsByVehicle(ListAPIView):

#     queryset = MovedToVehicle.objects.filter(return_warehouse__is_null=True)
#     serializer_class = ProductVehicleStockSerializer
#     pagination_class = LimitOffsetPagination


#     def list(self , request):
#         queryset = self.get_queryset()
#         vehicle = request.query_params.get("vehicle",None)   
#         if vehicle and vehicle != 'all':
#             queryset=queryset.filter(sales_person_vehicle__vehicle__id=vehicle)
        
#         page = self.paginate_queryset(queryset)
#         if page : 
#             ser = self.get_serializer(instance=page , many=True)
#             return self.get_paginated_response(ser.data)
#         ser = self.get_serializer(instance=queryset, many=True)
#         return Response(ser.data)