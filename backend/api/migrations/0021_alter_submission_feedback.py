# Generated by Django 5.0.2 on 2024-04-16 06:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0020_merge_20240416_1621'),
    ]

    operations = [
        migrations.AlterField(
            model_name='submission',
            name='feedback',
            field=models.TextField(blank=True, default=''),
            preserve_default=False,
        ),
    ]
