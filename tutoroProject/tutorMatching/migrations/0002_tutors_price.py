# Generated by Django 3.0 on 2019-12-23 22:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('tutorMatching', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='tutors',
            name='price',
            field=models.FloatField(default=1.0),
            preserve_default=False,
        ),
    ]
