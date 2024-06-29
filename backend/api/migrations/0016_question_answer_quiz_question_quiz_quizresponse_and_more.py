# Generated by Django 5.0.2 on 2024-04-11 03:19

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0015_likedcomment'),
    ]

    operations = [
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('type', models.CharField(max_length=30)),
                ('text', models.TextField()),
                ('correct_answer', models.CharField(max_length=1)),
                ('marks', models.PositiveIntegerField()),
            ],
            options={
                'db_table': 'question',
            },
        ),
        migrations.CreateModel(
            name='Answer',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=1)),
                ('text', models.TextField()),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.question')),
            ],
            options={
                'db_table': 'answer',
            },
        ),
        migrations.CreateModel(
            name='Quiz',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30)),
                ('start_date', models.DateTimeField()),
                ('end_date', models.DateTimeField()),
                ('course', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.course')),
            ],
            options={
                'db_table': 'quiz',
            },
        ),
        migrations.AddField(
            model_name='question',
            name='quiz',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.quiz'),
        ),
        migrations.CreateModel(
            name='QuizResponse',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('submission_date', models.DateTimeField()),
                ('quiz', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.quiz')),
                ('student', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'quiz_response',
            },
        ),
        migrations.CreateModel(
            name='QuestionResponse',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('answer', models.CharField(max_length=1)),
                ('marks', models.PositiveIntegerField()),
                ('feedback', models.TextField()),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.question')),
                ('quiz_response', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.quizresponse')),
            ],
            options={
                'db_table': 'question_response',
            },
        ),
    ]