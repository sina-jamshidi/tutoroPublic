# Generated by Django 3.0.1 on 2020-01-08 22:59

from django.conf import settings
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('tutorMatching', '0007_auto_20200108_2259'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='tutors',
            unique_together={('user', 'course_id')},
        ),
    ]
