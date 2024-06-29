from django.db import models

from . import Quiz


class Question(models.Model):
    id = models.AutoField(primary_key=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    type = models.CharField(max_length=30)
    text = models.TextField()
    correct_answer = models.CharField(max_length=1, null=False, blank=True)
    marks = models.PositiveIntegerField()

    class Meta:
        db_table = 'question'