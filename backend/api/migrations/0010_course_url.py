# Generated by Django 5.0.2 on 2024-04-01 10:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0009_post_anonymous'),
    ]

    operations = [
        migrations.AddField(
            model_name='course',
            name='url',
            field=models.URLField(default='', max_length=255),
        ),
    ]
