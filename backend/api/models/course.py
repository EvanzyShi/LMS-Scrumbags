from django.db import models


class Course(models.Model):
	id = models.AutoField(primary_key=True)
	code = models.CharField(max_length=255)
	name = models.CharField(max_length=255)
	is_active = models.BooleanField(default=True)
	term = models.CharField(max_length=255)
	url = models.CharField(max_length=255, default=None, blank=True)

	REQUIRED_FIELDS = ['code', 'name', 'term']
    
	class Meta:
		db_table = 'course'
    
	def __str__(self):
		return(self.name)