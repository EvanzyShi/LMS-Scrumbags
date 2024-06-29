from django.db import models

from . import Post


class PostImage(models.Model):
    id = models.AutoField(primary_key=True)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    code = models.TextField()

    class Meta:
        db_table = 'post_image'