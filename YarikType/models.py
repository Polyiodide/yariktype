from django.db import models

class User(models.Model):
    username = models.CharField(max_length=200, unique=True)
    email = models.CharField(max_length=200, unique=True)
    password = models.CharField(max_length=200)

    creation_date = models.DateField(auto_now_add=True)
    description = models.CharField(max_length=200, blank=True)

    record_first = models.IntegerField(default=0)
    record_second = models.IntegerField(default=0)
    record_third = models.IntegerField(default=0)
    record_fourth = models.IntegerField(default=0)


    def slug(self):
        return self.username
