from django.db import models

from . import Post, User


class LikedPost(models.Model):
    id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    
    REQUIRED_FIELDS = ['user', 'post']
    
    class Meta:
        db_table = 'liked_post'