from django.urls import path
from . import views
from rest_framework import generics
from .serializers import InstalmentPlanSerializer
from .models import InstallmentPlan
from rest_framework.routers import DefaultRouter
from .viewsets import InstallmentCardViewSet

app_name = 'instalment'

urlpatterns = [

    path('get-all-overdues/', views.GetAllOverDuePayments.as_view(), name='Get all overdues'),
    path('get-instalment-term-by-id/', views.GetInstalmentTermById.as_view(), name='Get instalment term by id'),
    path('plan/<int:id>', views.InstalmentPlanListAPIView.as_view() , name="Instalment Plan"),
    path('dues/<str:invoice_no>', views.ListDues.as_view(), name='Get all overdues'),
    path('overdues/<str:invoice_no>', views.ListOverdues.as_view(), name='Get all overdues'),
    path('plan/cancel', views.CancelInstalmentPlanAPIView.as_view() , name="Cancel Instalment Plan")
]

router = DefaultRouter()
router.register("cards",InstallmentCardViewSet,basename="card")


urlpatterns +=router.urls