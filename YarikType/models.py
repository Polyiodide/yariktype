from django.db import models

# Create your models here.
def records_default():
    return {15: None, 30: None, 60: None, 120: None}

class User(models.Model):
    username = models.CharField(max_length=200)
    email = models.CharField(max_length=200)
    password = models.CharField(max_length=200)

    creation_date = models.DateField(auto_now_add=True)
    description = models.CharField(max_length=200, blank=True)

    record_first = models.FloatField(default=0)
    record_second = models.FloatField(default=0)
    record_third = models.FloatField(default=0)
    record_fourth = models.FloatField(default=0)


    def slug(self):
        return self.username
