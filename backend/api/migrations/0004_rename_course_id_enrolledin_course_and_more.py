# Generated by Django 5.0.2 on 2024-03-11 03:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_enrolledin'),
    ]

    operations = [
        migrations.RenameField(
            model_name='enrolledin',
            old_name='course_id',
            new_name='course',
        ),
        migrations.RenameField(
            model_name='enrolledin',
            old_name='student_id',
            new_name='student',
        ),
    ]
