from django.db import models

from . import Course


class Lesson(models.Model):
	id = models.AutoField(primary_key=True)
	course = models.ForeignKey(Course, on_delete=models.CASCADE)
	name = models.CharField(max_length=255)
	type = models.CharField(max_length=255) # 'lecture' or 'tutorial'
    
	REQUIRED_FIELDS = ['course', 'name', 'type']
    
	class Meta:
		db_table = 'lesson'
    
	def __str__(self):
		return(self.name)