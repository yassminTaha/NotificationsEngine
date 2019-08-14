from django.db import models

# Create your models here.
class User(models.Model):
    fullName = models.CharField(max_length=120)
    email = models.EmailField(max_length=254)
    phoneNumber = models.CharField(max_length=20)
    lastVisit = models.DateTimeField()
    isActive = models.BooleanField(default=True)
    lastActiveDate = models.DateTimeField()
    minNumberOfVisitsPerWeek = models.IntegerField(default=0)
    maxNumberOfVisitsPerWeek = models.IntegerField(default=0)
    numberOfVisitsDuringCurrentMonth = models.IntegerField(default = 0)
    averageNumberOfVisitsPerMonth = models.IntegerField(default = 0)
    retentionDate = models.DateField(default=None, blank=True, null=True)
    costOfRetention = models.IntegerField(default=None, blank=True, null=True)
    campaignSentPNS = models.TextField(default='',blank=True, null=True)
    campaignSentSMS = models.TextField(default='',blank=True, null=True)

    def _str_(self):
        return self.fullName

class Campaign(models.Model):
    name = models.CharField(max_length=120)
    pnTemplate = models.TextField()
    smsTemplate = models.TextField()
    numberOfPoints = models.IntegerField(default=1)
    costPerUser = models.DecimalField(max_digits=5, decimal_places=2)
    startDate = models.DateField(default=None, blank=True, null=True)
    endDate = models.DateField(default=None, blank=True, null=True)

    def _str_(self):
        return self.name

class Rule(models.Model):
    description = models.TextField()
    campaign = models.ForeignKey(
        Campaign, on_delete=models.CASCADE)

    def _str_(self):
        return self.description

