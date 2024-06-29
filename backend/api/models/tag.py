from django.db import models

from . import Course


class Tag(models.Model):
    id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    name = models.CharField(max_length=255)
    colour = models.CharField(max_length=7)
    
    class Meta:
        db_table = 'tag'
