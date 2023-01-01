from django.contrib.auth.models import User
from django.db import models


class Date(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='date', null=True)
    date = models.DateField()

    def __str__(self):
        return self.date


class Todo(models.Model):
    date = models.ForeignKey(Date, on_delete=models.CASCADE, related_name='todo')
    todo = models.CharField(max_length=256)

