from django.urls import path
from . import views



urlpatterns = [

    path('get-user-profile/', views.GetUserProfile.as_view(), name='GetUserProfile'),
    path('get-customer-details/', views.GetCustomerDetails.as_view(), name='GetCustomerDetails'),
    path('check-nic/', views.CheckCustomerByNIC.as_view(), name='CheckNIC'),
    path('search-products/',views.ProductSearch.as_view(),name = "SearchProducts"),
    path('get-product/',views.GetProductByItemCode.as_view()),
    path('get-sales/',views.GetSales.as_view()),
    path('get-receipts/',views.GetReceipts.as_view()),
    path('get-all-receipts/',views.GetAllReceipts.as_view()),
    path('get-vehicles/',views.GetVehicles.as_view()),
    path('create-sale/',views.CreateSale.as_view()),
    path('create-payment/',views.CreateReceipt.as_view()),
    path('add-customer/',views.AddCustomer.as_view()),
    path('assign-vehicle/',views.CreateSalesPersonVehicle.as_view()),
    path('product-search-label/',views.ProductSearchForLabel.as_view()),
    path('get-drivers/',views.GetDrivers.as_view()),
    path('get-routes/',views.GetRoutes.as_view()),
    path('add-sale-for-rm/',views.AddSaleForRM.as_view()),
    path('create-return-order/',views.CreateReturnOrder.as_view()),
    path('update-customer-location/',views.UpdateCustomerLocation.as_view()),
    path('get-my-products/',views.GetMyProducts.as_view()),
]