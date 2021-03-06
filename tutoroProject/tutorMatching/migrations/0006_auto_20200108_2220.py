# Generated by Django 3.0.1 on 2020-01-08 22:20

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tutorMatching', '0005_courses_course_num'),
    ]

    operations = [
        migrations.RenameField(
            model_name='students',
            old_name='course_id',
            new_name='course',
        ),
        migrations.AlterField(
            model_name='courses',
            name='course_num',
            field=models.IntegerField(verbose_name=django.core.validators.MaxValueValidator(999, 'course num must be 3 digits')),
        ),
    ]
