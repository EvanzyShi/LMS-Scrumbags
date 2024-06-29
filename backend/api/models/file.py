from uuid import uuid4

from django.db import models

from . import User


class File(models.Model):
    token = models.UUIDField(default=uuid4, editable=False)
    folder = models.CharField(max_length=32)
    reference_id = models.IntegerField()
    filename = models.CharField(max_length=128)
    added_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)
    uploaded_on = models.DateTimeField(auto_now_add=True)

    class Meta:
        managed = False
        db_table = 'file'
