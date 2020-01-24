from rest_framework import serializers
from tutorMatching.models import Students, Tutors, Matches, Courses, Ratings
from django.contrib.auth.models import User

#Nested user serializer
class UsersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'first_name')

# Modify Student (add/remove course you need help with) serializer
class ModifyStudentSerializer(serializers.ModelSerializer):
    user = UsersSerializer
    class Meta:
        model = Students
        fields = ('user', 'course')

# Modify Tutor (add/remove course you can tutor) serializer
class ModifyTutorSerializer(serializers.ModelSerializer):
    user = UsersSerializer
    class Meta:
        model = Tutors
        fields = ('user', 'course', 'price')

# Get Student Matches (get students you can tutor) serializer
class GetStudentsSerializer(serializers.ModelSerializer):
    user = UsersSerializer(read_only=True)
    class Meta:
        model = Students
        fields = ('user', 'course')

# Get Tutor Matches (get tutors who can tutor you) serializer
class GetTutorsSerializer(serializers.ModelSerializer):
    user = UsersSerializer(read_only=True)
    class Meta:
        model = Tutors
        fields = ('user', 'course', 'price')      

class MatchesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Matches
        fields = '__all__'

# Matches serializer - not needed right now
# class MatchesSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Matches
#         fields = ['student_id', 'tutor_id', 'course_id']

# Courses serializer
class CoursesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Courses
        fields = '__all__'

class RatingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Ratings
        fields = '__all__'