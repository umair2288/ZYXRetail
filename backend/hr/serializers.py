from rest_framework import serializers
from .models import Attendance , Payment , Payslip
from user.models import Employee 
from user.serializers import EmployeeSerializer , CreateEmployeeSerializer , EmployeeMinimialSerializer


class EmployeeProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        exclude = ("User",)
        depth = 2


class AttendanceSerializer(serializers.ModelSerializer):

    class Meta:
        model = Attendance
        fields = "__all__"


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = "__all__"


class GetAttendanceSerializer(serializers.ModelSerializer):
    employee = EmployeeMinimialSerializer()

    class Meta:
        model = Attendance
        fields = "__all__"


class GenerateSalarySlipSerializer(serializers.Serializer):

    employee_id = serializers.IntegerField()
    allowances = serializers.ListField()
    deductions = serializers.ListField()
    from_date = serializers.DateField()
    to_date = serializers.DateField()


    def create(self,validated_data):
        validated_data["employee_id"]
        slip = Payslip(employee_id=validated_data["employee_id"], from_date=validated_data["from_date"] , to_date=validated_data["to_date"])
        slip.save()
        total_earnings = 0
        total_deductions = 0
        salary = []
        
        for allowance in validated_data["allowances"]:
            payment = Payment(payslip = slip , amount=allowance["amount"], payment_type=Payment.EARNING , description=allowance["description"])
            payment.save()
            total_earnings = total_earnings + payment.amount
        
        for allowance in validated_data["deductions"]:
            payment = Payment(payslip = slip , amount=allowance["amount"], payment_type=Payment.DEDUCTION , description=allowance["description"])
            payment.save()
            total_deductions = total_deductions + payment.amount
        
        query = Payment.objects.filter(payslip=slip)
        deductions = PaymentSerializer(instance= query.filter(payment_type=Payment.DEDUCTION), many=True).data
        earnings = PaymentSerializer(instance= query.filter(payment_type=Payment.EARNING), many=True).data
        length = max(len(deductions) , len(earnings))
        for _ in range(length):     
            if( len(earnings)>0 and len(deductions)>0):
                earning = earnings.pop(0)
                deduction = deductions.pop(0)
                print(earning)
                salary.append({
                "earning_detail" : earning["description"],
                "earning_amount" : earning["amount"],
                "deduction_detail" : deduction["description"],
                "deduction_amount" : deduction["amount"]
            })
            elif(len(earnings)>0):
                earning = earnings.pop(0)
                print(earning)
                salary.append({
                    "earning_detail" : earning["description"],
                    "earning_amount" : earning["amount"],
                    "deduction_detail" : None,
                    "deduction_amount" : None
                })
            elif(len(deductions)>0):
                deduction = deductions.pop(0)
                salary.append({
                    "earning_detail" : None,
                    "earning_amount" : None,
                    "deduction_detail" : deduction["description"],
                    "deduction_amount" : deduction["amount"]
                })
            else:
                raise Exception("Unexpected Lenth of payments")
 
        data = {
                "employee_name": slip.employee.Contact.FirstName + " " + slip.employee.Contact.LastName,
                "employee_address": slip.employee.Contact.Address.__str__(),
                "employee_nic": slip.employee.NIC,
                "salary_period" : "From {from_date} To {to_date}".format(from_date=validated_data["from_date"], to_date=validated_data["to_date"]),
                "salary": salary,
                "total" : {
                    "total_earnings": total_earnings,
                    "total_deductions" : total_deductions
                }
        }
        return data