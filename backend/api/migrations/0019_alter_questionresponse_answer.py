# Generated by Django 5.0.2 on 2024-04-14 23:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0018_quizresponse_marked_alter_questionresponse_answer_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questionresponse',
            name='answer',
            field=models.TextField(blank=True),
        ),
    ]
