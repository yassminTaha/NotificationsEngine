from rest_framework import serializers
from .models import User
from .models import Campaign, Rule

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'fullName', 'email', 'phoneNumber','lastVisit','isActive','lastActiveDate','minNumberOfVisitsPerWeek','maxNumberOfVisitsPerWeek','numberOfVisitsDuringCurrentMonth','averageNumberOfVisitsPerMonth','retentionDate','costOfRetention')
    
class CampaignSerializer(serializers.ModelSerializer):
    class Meta:
        model = Campaign
        fields = ('id', 'name', 'pnTemplate', 'smsTemplate','numberOfPoints','costPerUser','startDate','endDate')

class RuleSerializer(serializers.ModelSerializer):
    class Meta:
        model = Rule
        fields = ('id', 'description', 'campaign')