from django.db import models

from . import Question, QuizResponse


class QuestionResponse(models.Model):
    id = models.AutoField(primary_key=True)
    question = models.ForeignKey(Question, on_delete=models.CASCADE)
    quiz_response = models.ForeignKey(QuizResponse, on_delete=models.CASCADE)
    answer = models.TextField(blank=True)
    marks = models.PositiveIntegerField(default=0)
    feedback = models.TextField()

    class Meta:
        db_table = 'question_response'