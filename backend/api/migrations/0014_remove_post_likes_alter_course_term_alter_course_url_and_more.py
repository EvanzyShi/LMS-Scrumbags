# Generated by Django 5.0.2 on 2024-04-05 04:19

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0013_merge_20240405_1519'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='likes',
        ),
        migrations.AlterField(
            model_name='course',
            name='term',
            field=models.CharField(max_length=255),
        ),
        migrations.AlterField(
            model_name='course',
            name='url',
            field=models.CharField(default=None, max_length=255),
        ),
        migrations.CreateModel(
            name='LikedPost',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.post')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'liked_post',
            },
        ),
    ]