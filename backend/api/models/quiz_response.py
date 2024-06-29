from django.db import models

from . import Quiz, User


class QuizResponse(models.Model):
    id = models.AutoField(primary_key=True)
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    submission_date = models.DateTimeField(auto_now_add=True)
    marked = models.BooleanField(default=False)

    class Meta:
        db_table = 'quiz_response'