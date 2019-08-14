from dashboard.models import Campaign
from datetime import datetime
from elasticsearch import Elasticsearch
from notificationService import campaignNotificationHelper
from notificationService import smsService

def send_pushNotification(user,campaign):
    es = Elasticsearch(['https://elastic:vn8L1hAAj6ThiG9g0jx3SagW@f2eb1293d857452aab693e222709b38d.us-east-1.aws.found.io:9243'])
    doc = {
        'notification': 'Hello '+user.fullName+' '+ campaign.pnTemplate,
        'email': user.email,
        'timestamp': datetime.now(),
    }
    res = es.index(index="pushnotification-index", doc_type='pushnotification', id=None, body=doc)
    print(res['result'])
    es.indices.refresh(index="pushnotification-index")

def get_pushNotification_users():
    queryset = Campaign.objects.all() 

    for val in queryset:
        if (not val.startDate is None and val.startDate > datetime.now().date()) or (not val.endDate is None  and val.endDate < datetime.now().date()):
            continue
        users = campaignNotificationHelper.get_campaign_users(val)
        for user in users:
            userPNCampaigns = user.campaignSentPNS
            pnsCampaignsList = userPNCampaigns.strip(',').split(',')
            if not userPNCampaigns is '':
                pnsCampaignsList = [int(i) for i in pnsCampaignsList]
            if val.id in pnsCampaignsList:
                smsService.send_sms(user,val)
                user.campaignSentSMS = user.campaignSentSMS + str(val.id) +','
                user.save()
            else:
                send_pushNotification(user,val)
                user.campaignSentPNS = user.campaignSentPNS + str(val.id) +','
                user.save()