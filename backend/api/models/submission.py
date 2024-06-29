from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models

from . import Assignment, User


class Submission(models.Model):
    id = models.AutoField(primary_key=True)
    student = models.ForeignKey(User, on_delete=models.CASCADE)
    assignment = models.ForeignKey(Assignment, on_delete=models.CASCADE)
    submission_date = models.DateTimeField()
    status = models.CharField(max_length=255, default='Not Graded')
    grade = models.IntegerField(validators=[MinValueValidator(0), MaxValueValidator(100)], null=True)
    feedback = models.TextField(blank=True)

    class Meta:
        db_table = 'submission'