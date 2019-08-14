from dashboard.models import Campaign,Rule,User

def covertStringToDate(dateStr):
   adjustedDate = ''
   dateParts = dateStr.split('/')
   year = dateParts[2]
   month = dateParts[1]
   day = dateParts[0]
   adjustedDate = year + '-' + month + '-'+day
   return adjustedDate

def convert_rule_to_query(rule):
    rule = rule.lower()
    userProperties = ['lastvisit','isactive','lastactivedate','minnumberofvisitsperweek','maxnumberofvisitsperweek','numberofvisitsduringcurrentmonth','averagenumberofvisitspermonth']
    operators = ['=','>=', '<=','>','<','and','or']
    ruleQuery = 'SELECT fullName,email,phoneNumber,id,campaignSentPNS,campaignSentSMS FROM dashboard_user where '
    ruleParts = rule.split()
    index =0
    for part in ruleParts:
        if part=='if':
            continue
        if part=='then':
            break
        if part == '(':
            ruleQuery = ruleQuery + ' ('
        if part == ')':
            ruleQuery = ruleQuery + ' )'
        if part in userProperties :
            if part == 'isactive':
                if ruleParts[index-1] == 'not':
                    ruleQuery = ruleQuery + ' isactive <> 1'
                else:
                    ruleQuery = ruleQuery + ' isactive = 1'
            else:
                ruleQuery = ruleQuery + ' ' + part
        if part in operators:
            ruleQuery = ruleQuery + ' ' + part
        
        if part.isdigit():
             ruleQuery = ruleQuery + ' ' + part
        
        if  part.find("/") > -1:
            adjustedDate = covertStringToDate(part)
            ruleQuery=  ruleQuery+ ' ' + "'" + adjustedDate+"'"

        index = index + 1
    return ruleQuery



def get_campaign_users(current_campaign):
    campaign_users =[]
    campaignRules = Rule.objects.filter(campaign=current_campaign.id)
    for r in campaignRules:
            query = convert_rule_to_query(r.description)
            users = User.objects.raw(query)
            for user in users:
                userPNCampaigns = user.campaignSentPNS
                userSMSCampaigns = user.campaignSentSMS
                pnsCampaignsList = userPNCampaigns.strip(',').split(',')
                if not userPNCampaigns is '':
                    pnsCampaignsList = [int(i) for i in pnsCampaignsList]
                smsCampaignsList = userSMSCampaigns.strip(',').split(',')
                if not userSMSCampaigns is '':
                    smsCampaignsList = [int(i) for i in smsCampaignsList]
                if (current_campaign.id in pnsCampaignsList) and (current_campaign.id in smsCampaignsList) :
                  continue
                campaign_users.append(user)
    return campaign_users
   