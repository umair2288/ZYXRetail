from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from . import serializers
# Create your views here.


class HelloView(APIView):
    # this view should show reference to apis
    permission_classes = (IsAuthenticated, )
    
    def get(self):
        content = {'Message': "Hello World!"}
        return Response(content)


class ContactView(APIView):
    # TODO implement create contact api
    """creates an contact when this api is called"""










