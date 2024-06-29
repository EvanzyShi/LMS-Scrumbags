from django.db import models

from .lesson import Lesson


class Topic(models.Model):
    id = models.AutoField(primary_key=True)
    week = models.SmallIntegerField()
    name = models.CharField(max_length=255)
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    recording = models.CharField(max_length=255, null=True)

    REQUIRED_FIELDS = ['week', 'name', 'lesson']
    
    class Meta:
        db_table = 'topic'
    
    def __str__(self):
        return(self.name)