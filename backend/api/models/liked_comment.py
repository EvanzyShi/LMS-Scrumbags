from django.db import models

from . import Comment, User


class LikedComment(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)

    REQUIRED_FIELDS = ['user', 'comment']

    class Meta:
        db_table = 'liked_comment'