from rest_framework import viewsets
from rest_framework.response import Response
from .models import InstallmentPlan
from django.shortcuts import get_object_or_404
from .serializers import CardSerializer


class InstallmentCardViewSet(viewsets.ViewSet):
     
    def retrieve(self,request,pk=None):
        queryset = InstallmentPlan.objects.all()
        installment_plan =get_object_or_404(queryset,pk=pk)
        ser = CardSerializer(instance=installment_plan)
        return Response(ser.data)
