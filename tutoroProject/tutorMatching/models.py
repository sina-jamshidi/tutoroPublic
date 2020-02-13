from django.db import models
from django.contrib.auth.models import User, AbstractBaseUser
from django.core.validators import RegexValidator, MaxValueValidator, MinValueValidator

# validators:
# user_validator = RegexValidator(r'^[0-9a-zA-z_.]*@sfu.ca$', 'Must use a valid @sfu.ca email address')
# names_validator = RegexValidator(r'^[a-zA-Z]*$', 'Only alphabet characters are allowed.')
rating_validator_max = MaxValueValidator(5.0, 'Rating cannot exceed 5.0')
rating_validator_min = MinValueValidator(0, 'Rating cannot be below 0')

class Courses(models.Model):
    course_id = models.IntegerField(primary_key=True, unique=True)
    course_num = models.IntegerField(MaxValueValidator(999, 'course num must be 3 digits'))
    course_dept = models.CharField(max_length=4)
    course_title = models.CharField(max_length=100)

    def __str__(self):
        return "%s %i: %s" % (self.course_dept, self.course_num, self.course_title)

class Students(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    # TODO: description = models.CharField(max_length=300)

    def __str__(self):
        return "%s - %s" % (self.user, self.course)

    class Meta:
        unique_together = ['user', 'course_id']
        
class Tutors(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    course = models.ForeignKey(Courses, on_delete=models.CASCADE)
    # TODO: available = models.BooleanField()
    price = models.DecimalField(max_digits=6, decimal_places=2)
    # TODO: subscribed = models.BooleanField(default=False)

    def __str__(self):
        return "%s - %s" % (self.user, self.course)

    class Meta:
        unique_together = ['user', 'course_id']

class Matches(models.Model):
    # student_user = models.CharField(max_length=20)
    # tutor_user = models.CharField(max_length=20)
    # TODO: constraint so that tutor doesn't match themselves?
    student_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='student_user')
    tutor_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tutor_user')
    course_id = models.ForeignKey(Courses, on_delete=models.CASCADE)
    date_matched = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return "student: %s - tutor: %s - course: %s" % \
            (self.student_user, self.tutor_user, self.course_id)
    class Meta:
        constraints = []
        unique_together = ['student_user', 'tutor_user', 'course_id']

class Subscription(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    subscription_date = models.DateTimeField()
    autorenew_date = models.DateTimeField()

class Ratings(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='rated')
    rated_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name='rater')
    rating = models.IntegerField(validators=[rating_validator_max, rating_validator_min])

## TODO: rate in multiple categories
## TODO: add analytics