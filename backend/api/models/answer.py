from django.db import models

from . import Question


class Answer(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    name = models.CharField(max_length=1)
    text = models.TextField()

    class Meta:
        db_table = 'answer'