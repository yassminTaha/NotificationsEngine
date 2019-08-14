from datetime import datetime
from apscheduler.schedulers.background import BackgroundScheduler
from notificationService import pushNotificationService

def launchPushnotificationSchedule():
    scheduler = BackgroundScheduler()
    scheduler.add_job(pushNotificationService.get_pushNotification_users, 'interval', hours=1)
    scheduler.start()