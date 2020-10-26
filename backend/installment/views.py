from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.status import HTTP_404_NOT_FOUND , HTTP_200_OK , HTTP_401_UNAUTHORIZED
from django.core import exceptions 
from sales.models import Order
from installment.models import InstallmentTerm
from installment.models import  InstallmentPlan
from datetime import datetime , date , timedelta
from installment.serializers import (OverDueIntalmentTermsSerializer , InstalmentTermSerializerWithDetails , InstalmentPlanSerializerWithTerms , InstalmentTermSerializer
, CancelInstalmentPlanSerializer)
from rest_framework import generics
from rest_framework.permissions import IsAdminUser , IsAuthenticated 

# Create your views here.


class ListOverdues(generics.ListAPIView):
    serializer_class = OverDueIntalmentTermsSerializer

    def last_date_of_current_week(self,date):
        last_date = date + timedelta(days= 6 - date.weekday())
        return last_date

    def list(self , request , invoice_no):
        try:
            instalment_plan = Order.objects.get(invoice_no=invoice_no).instalment_plan
        except exceptions.ObjectDoesNotExist:
            return Response("Invoice number not found", HTTP_404_NOT_FOUND)
       
        overdue_terms = InstallmentTerm.objects.filter(is_paid=False , plan=instalment_plan , due_date__lte=self.last_date_of_current_week(date.today()))
        return Response(InstalmentTermSerializer(instance=overdue_terms , many=True).data ,HTTP_200_OK )


class ListDues(generics.ListAPIView):
    serializer_class = OverDueIntalmentTermsSerializer

   
    def list(self , request , invoice_no):
        try:
            instalment_plan = Order.objects.get(invoice_no=invoice_no).instalment_plan
            if instalment_plan.status == InstallmentPlan.CANCELLED:
                return Response("This plan is already cancelled" , HTTP_404_NOT_FOUND)
        except exceptions.ObjectDoesNotExist:
            return Response("Invoice number not found", HTTP_404_NOT_FOUND)
       
        due_terms = InstallmentTerm.objects.filter(plan=instalment_plan)
        return Response(InstalmentTermSerializer(instance=due_terms , many=True).data ,HTTP_200_OK )


class GetAllOverDuePayments(APIView):

    def get(self, request):
        instalment_plans = InstallmentPlan.objects.all()   
       # instalment_terms = InstallmentTerm.objects.exclude(due_date__gte=datetime.today()).filter(is_paid=False)
        return Response({
            "success":True,
            "message": "Reteriving instalment over due payments",
            "data": OverDueIntalmentTermsSerializer(instance=instalment_plans,many=True).data
        })
        

class GetInstalmentTermById(APIView):

    def get(self, request):
        try:
            term_id = request.query_params["id"]
        except KeyError:
            return Response({
                "success": False,
                "message": "Key Error: id missing is query params"
            })
        else:
            query = InstallmentTerm.objects.filter(id=term_id)
            if query.exists():
                instalment_term = query.get()
                return Response({
                    "success": True,
                    "data": InstalmentTermSerializerWithDetails(instance=instalment_term).data
                })
            else :
                return Response({
                "success": False,
                "message": "Instalment Term Not found, please check your id"
                })    



class InstalmentPlanListAPIView(generics.ListAPIView):

    serializer_class = InstalmentPlanSerializerWithTerms


    def get_queryset(self):
        id = self.kwargs['id']
        return InstallmentPlan.objects.filter(id=id)


class CancelInstalmentPlanAPIView(APIView):

    permission_classes=[IsAuthenticated , IsAdminUser]

    def post(self,request,*args,**kwargs):
        if request.user.is_superuser :      
            ser = CancelInstalmentPlanSerializer(data=request.data)
            if ser.is_valid(raise_exception=True):
                ser.save()
                return Response({
                    "invoice": request.data["invoice"]
                })
            
        else:
            return Response("Please contact administartor - you need super user previleges" , HTTP_401_UNAUTHORIZED)