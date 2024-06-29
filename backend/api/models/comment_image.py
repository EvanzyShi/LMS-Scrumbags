from django.db import models

from . import Comment


class CommentImage(models.Model):
    id = models.AutoField(primary_key=True)
    comment = models.ForeignKey(Comment, on_delete=models.CASCADE)
    code = models.TextField()

    class Meta:
        db_table = 'comment_image'