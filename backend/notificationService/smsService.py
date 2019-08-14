from dashboard.models import Campaign
from datetime import datetime
from elasticsearch import Elasticsearch

def send_sms(user,campaign):
    es = Elasticsearch(['https://elastic:vn8L1hAAj6ThiG9g0jx3SagW@f2eb1293d857452aab693e222709b38d.us-east-1.aws.found.io:9243'])
    doc = {
        'sms': 'Hello '+user.fullName+' '+ campaign.pnTemplate,
        'email': user.email,
        'timestamp': datetime.now(),
    }
    res = es.index(index="sms-index", doc_type='sms', id=None, body=doc)
    es.indices.refresh(index="sms-index")