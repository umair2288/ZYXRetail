from user.models import Employee
from user.serializers import EmployeeMinimialSerializer
from rest_framework import viewsets
from rest_framework.response import Response



class EmployeeViewSet(viewsets.ModelViewSet):

    queryset = Employee.objects.all()
    serializer_class = EmployeeMinimialSerializer
 
    def destroy(self,request , *args , **kwargs):
        try:
            instance = self.get_object()
            user = instance.User
            user.delete()
            self.perform_destroy(instance)
        except Exception:
             return Response({"message":"Unable to delete employee"},status=403)

        return Response({"message":"Delete successfull"},status=204)

   
