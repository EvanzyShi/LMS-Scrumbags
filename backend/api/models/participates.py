from django.db import models

from . import Course, User


class Participates(models.Model):
    id = models.AutoField(primary_key=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    REQUIRED_FIELDS = ['course', 'user']
    
    class Meta:
        db_table = 'participates'
    
    def __str__(self):
        return(str(self.course) + ', ' + str(self.user))