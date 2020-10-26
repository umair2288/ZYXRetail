from django.urls import path
from . import views
from rest_framework import generics
from .models import PaymentBreakdown , Order , ReturnOrder
from .serializers import (PaymentBreakdownSerializer , OrderSerializer , ReturnOrderSerializer , CreateReturnOrderSerializer , GetOrderSerializer)


app_name = 'sales'

urlpatterns = [

    # path('add-sale/', views.AddSale.as_view(), name='Create Address'),
    path('get-orders/', views.GetOrders.as_view(), name='get orders'),
    path('get-orders/<str:type>/', views.GetOrders.as_view(), name='get orders'),
    path('create-receipt/',views.CreateReceipt.as_view(), name='create receipt'),

    path('receipts/',views.GetReceipts.as_view(), name='get reciepts'),
    path('receipts/<str:type>/',views.GetReceipts.as_view(), name='get reciepts'),
    path('receipts/<str:type>/<int:year>/',views.GetReceipts.as_view(), name='get reciepts'),
    path('receipts/<str:type>/<int:year>/<int:month>/',views.GetReceipts.as_view(), name='get reciepts'),
    path('receipts/<str:type>/<int:year>/<int:month>/<int:date>/',views.GetReceipts.as_view(), name='get reciepts'),

    path('orderreciepts/<str:invoice_no>' , views.OrderReciepts.as_view() , name="Order Reciepts" ),

    # path('payment-breakdown/',views.TestAPIView.as_view(), name="serializer"),
    # path('add-sale/v2/<str:entity>', views.AddSaleV2.as_view(), name='Add Sale V2'),
    path('order/create',views.AddSaleForRM.as_view(), name="Add Sale"),
    path('order/update/<int:pk>' , generics.RetrieveUpdateAPIView.as_view(queryset=Order.objects.all() , serializer_class= OrderSerializer) , name="reterive order"),
    path('returnorder/create' , generics.CreateAPIView.as_view(queryset=ReturnOrder.objects.all() , serializer_class=CreateReturnOrderSerializer), name="Return order"),
    path('returnorder/balance' , views.ReturnOrderBalanceAmount.as_view(), name="Return Order Balance"),
    path('returnorder/update/<int:pk>' , generics.UpdateAPIView.as_view(queryset=ReturnOrder.objects.all() , serializer_class=ReturnOrderSerializer), name="Return order"),
    path('returnorder/list' , views.ListReturnOrder.as_view( ), name="Return order"),
    path('order/summary/<int:id>',views.OrderSummary.as_view(), name="Order Summary"),
    path('orders/',views.OrderListView.as_view()),
    path('rm/orders/detailed' , generics.ListAPIView.as_view(queryset=Order.objects.filter(entity=Order.ROYALMARKETING).order_by("-id") , serializer_class=GetOrderSerializer )),
    path('payment/create',views.CreatePayment.as_view(), name="Create Payment"),
    path("returnorder/<int:id>/action", views.PerformReturnOrderAction.as_view() , name="Perform Return Order Action")

]