from django.shortcuts import render
from rest_framework import viewsets 
from .serializers import UserSerializer, CampaignSerializer, RuleSerializer
from .models import User, Campaign, Rule                    

class UserView(viewsets.ModelViewSet):  
    serializer_class = UserSerializer 
    queryset = User.objects.all()

class CampaignView(viewsets.ModelViewSet):  
    serializer_class = CampaignSerializer 
    queryset = Campaign.objects.all()        

class RuleView(viewsets.ModelViewSet):  
    serializer_class = RuleSerializer 
    queryset = Rule.objects.all()        