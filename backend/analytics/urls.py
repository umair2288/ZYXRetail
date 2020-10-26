from django.urls import path,include
from .views import SalesSummary , StockReport , TodaySalesReportByVehicle , GenerateReport
from .models import Report

from rest_framework import generics
from .serializers import ( CurrentStockReportSerializer , 
ReportSerializer , CategoryFilterSerializer , VehicleFilterSerializer, WarehouseFilterSerializer)
from warehouse.models import ProductPiece , ProductCategory , StockVehicle , Warehouse

filter_urls = [
    path("categories/", generics.ListAPIView.as_view(queryset=ProductCategory.objects.all(), serializer_class=CategoryFilterSerializer) ),
    path("vehicles/", generics.ListAPIView.as_view(queryset=StockVehicle.objects.all(), serializer_class=VehicleFilterSerializer) ),
    path("warehouses/", generics.ListAPIView.as_view(queryset=Warehouse.objects.all(), serializer_class=WarehouseFilterSerializer) )
]


urlpatterns = [

    path("filters/",include(filter_urls)),
    path("reports/",generics.ListCreateAPIView.as_view(queryset=Report.objects.filter(disabled=False), serializer_class=ReportSerializer) , name="report_list" ),
    path("sales-summary/<str:entity>", SalesSummary.as_view() , name="Sales Summary"),
    # path("stock", generics.ListAPIView.as_view(queryset=ProductPiece.objects.filter(is_sold=False) , serializer_class=CurrentStockReportSerializer ), name="Stock Summary")
    path("stock", StockReport.as_view(), name="Stock Summary"),
    path("todaysales/",TodaySalesReportByVehicle.as_view() , name="today_sales_report"),
    path("report/<int:pk>",GenerateReport.as_view(), name = "generic_report")

]