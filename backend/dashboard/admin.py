from django.contrib import admin
from dashboard.models import User, Campaign, Rule
from notificationService import launch

class UserAdmin(admin.ModelAdmin):
    list_display = ('fullName', 'email', 'lastVisit','isActive')

class CampaignAdmin(admin.ModelAdmin):
    list_display = ('name', 'numberOfPoints')


    # Register your models here.
admin.site.register(User, UserAdmin)
admin.site.register(Campaign, CampaignAdmin)
launch.launchPushnotificationSchedule()