from django.db import models
from zeep import Client

# Create your models here.
class SMS :

    client = Client(wsdl="http://smeapps.mobitel.lk:8585/EnterpriseSMSV3/EnterpriseSMSWS?wsdl")
    user = {
        
        "id" : "",
        "username" : "esmsusr_fji",
        "password" : "26dmdj4",
        "customer" : ""
        
    }

    def get_service(self):

        return self.client.service

    def create_session (self):

        service = self.get_service()
        session = service.createSession(self.user)
        return session

    def close_session (self,session):

        service = self.get_service()
        service.closeSession(session)

    def send_message (self,message,recipients = ['0772191987'],sender = "R.I.B.Royal"):

        session = self.create_session()
        service = self.get_service()
        sendMessage = {
                "message" : message,
                "messageId" : "",
                "recipients" : recipients,
                "retries" : "",
                "sender" : sender,
                "messageType" : 0,
                "sequenceNum" : "",
                "status" : "",
                "time" : "",
                "type" : "",
                "user" : ""
        }

        service.sendMessages(session,sendMessage)
        self.close_session(session)