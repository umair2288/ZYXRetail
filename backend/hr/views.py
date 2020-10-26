from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Sum
from user.models import Employee
from sales.models import Order , Receipt
from .serializers import AttendanceSerializer , GenerateSalarySlipSerializer
from .models import Attendance
from datetime import date, datetime

# Create your views here.
class AttendanceView (APIView):
    def post(self, request):
        try:
            q = Employee.objects.filter(NIC=request.data['NIC'])
            time = request.data.get('time',str(datetime.now()))
            print(time)
            if q.exists():        
                emp = q.get()     
                today_att = Attendance.objects.filter(time__date = date.today()).filter(employee=emp).filter(attendance_type=request.data['attendance_type']) 
                if today_att.exists():
                    return Response({
                        "success" : False,
                        "message" : "Sorry, You already have " + request.data['attendance_type'] 
                    })
                elif request.data['attendance_type'] == "CHECKOUT":
                    today_att = Attendance.objects.filter(time__date = date.today()).filter(employee=emp).filter(attendance_type="CHECKIN")
                    if not today_att.exists():
                        return Response({
                            "success" : False,
                            "message" : "Sorry, You did not checked in to check out" 
                        })
                    sr = AttendanceSerializer(data={"employee":emp.id , "attendance_type":request.data['attendance_type'] , "time": time})
                    if sr.is_valid() :
                        att = sr.save()
                        return Response(
                            {"success":True, "message" : "Thank you "+emp.Contact.FirstName+", you have successfully "+request.data['attendance_type']}
                        )
                    else:
                        return Response({"success":False , "message":"serializer validation failed" , "err":sr.errors})
                else:
                    sr = AttendanceSerializer(data={"employee":emp.id , "attendance_type":request.data['attendance_type'] , "time": time})
                    if sr.is_valid() :
                        att = sr.save()
                        return Response(
                            {"success":True, "message" : "Thank you "+emp.Contact.FirstName+", you have successfully "+request.data['attendance_type']}
                        )
                    else:
                        return Response({"success":False , "message":"serializer validation failed" , "err":sr.errors})        
            else:
                return Response({
                    "success" : False,
                    "message": "Oops! NIC not has been registered as an employee"
                })
        except KeyError:
            return Response(
                {   "success":False,
                     "body format": {
                         "NIC" : "employee NIC number",
                         "attendance_type": "CHECKIN or CHECKOUT"
                     }
                }
            )
        
        
       
    
class TotalSales(APIView):

    def post(self,response,emp_id):
        try:
            employee = Employee.objects.get(id=emp_id)
        except ObjectDoesNotExist :
            return Response({"message": "Employee id {id} does not exists".format(id=emp_id)}, status=404)
        else:
            from_date = response.data.get("from",None)
            to_date = response.data.get("to",None)
            if (from_date and to_date):
                orders = Order.objects.filter(date__gte=from_date).filter(date__lte=to_date)
                receipts = Receipt.objects.filter(date__gte=from_date).filter(date__lte=to_date)
                if employee.EmployeeType == Employee.DRIVER :
                    orders = orders.filter(sales_person_vehicle__driver=employee)
                    receipts = receipts.filter(sales_person_vehicle__driver=employee)
                else:
                    orders = orders.filter(sales_person_vehicle__sales_person=employee)
                    receipts = receipts.filter(sales_person_vehicle__sales_person=employee)
                
                cash_sales = orders.filter(order_type=Order.CASH)
                installment_sales = orders.filter(order_type=Order.INSTALMENT)
                collections = receipts.exclude(payment_type=Receipt.REFUND)
    
                return Response({
                        "employee_id": employee.id,
                        "employee_name" : employee.Contact.FirstName + " " + employee.Contact.FirstName,
                        "employee_type": employee.EmployeeType,
                        "employee_nic" : employee.NIC,
                        "employee_address": employee.Contact.Address.__str__(),
                        "from_date" : from_date,
                        "to_date" : to_date,
                        "total_cash_sale" : float(cash_sales.aggregate(Sum('total_bill')).get('total_bill__sum') or 0),
                        "total_installment_sale":  float(installment_sales.aggregate(Sum('total_bill')).get('total_bill__sum') or 0),
                        "total_collection": float(collections.aggregate(Sum('payment')).get('payment__sum') or 0)
                    })
            else:
                return Response({         
                    "from" : [" this date is must"],
                    "to" : ["this date is must"],     
                }, status=400)
            


class GeneratePayslipView(APIView):

    def post(self, request, emp_id):


        data = {
            "employee_id" : emp_id,
            "from_date" :  request.data.get("from_date",None),
            "to_date" :  request.data.get("to_date",None),
            "allowances" : request.data.get("allowances",None),
            "deductions" : request.data.get("deductions",None)
        }

        ser = GenerateSalarySlipSerializer(data=data)
        if ser.is_valid(raise_exception=True):
            data = ser.save()  
            return Response(data)