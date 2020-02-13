from tutorMatching.models import Students, Tutors, Courses, Ratings, Matches
from django.contrib.auth.models import User
from rest_framework import permissions, generics, status
from knox.auth import TokenAuthentication
from rest_framework.response import Response
from django.core.exceptions import ObjectDoesNotExist
from .serializers import ModifyStudentSerializer, ModifyTutorSerializer, GetStudentsSerializer, \
    GetTutorsSerializer, CoursesSerializer, MatchesSerializer, UsersSerializer

class GetCoursesAPI(generics.ListAPIView):
    queryset = Courses.objects.all()
    permission_classes = [
        permissions.AllowAny,
    ]
    serializer_class = CoursesSerializer

class GetOwnDetailsAPI(generics.ListAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = (TokenAuthentication,)

    def list(self, request, *args, **kwargs):
        user = self.request.user
        student_queryset = Students.objects.filter(user=user)
        tutor_queryset = Tutors.objects.filter(user=user)
        # use modify serializers here because it only returns user id and that's all we need
        students_serializer = ModifyStudentSerializer(student_queryset, many=True)
        tutor_serializer = ModifyTutorSerializer(tutor_queryset, many=True)
        return Response({
            'student': students_serializer.data,
            'tutor': tutor_serializer.data
        })

class GetStudentsAPI(generics.ListAPIView):
    serializer_class = GetStudentsSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = (TokenAuthentication,) 

    def get_queryset(self):
        tutoring_courses = Tutors.objects.filter(user=self.request.user).values_list('course_id', flat=True)
        matching_students = Students.objects.exclude(user=self.request.user
            ).filter(course_id__in=tutoring_courses)
        return matching_students

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

class GetTutorsAPI(generics.ListAPIView):
    serializer_class = GetTutorsSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = (TokenAuthentication,) 

    def get_queryset(self):
        students_courses = Students.objects.filter(user=self.request.user).values_list('course_id', flat=True)
        matching_tutors = Tutors.objects.exclude(user=self.request.user
            ).filter(course_id__in=students_courses)
        return matching_tutors

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AddStudentEntryAPI(generics.GenericAPIView):
    serializer_class = ModifyStudentSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = (TokenAuthentication,)

    def post(self, request, *args, **kwargs):
        user = self.request.user
        serializer = self.get_serializer(data={'user':user.id, \
            'course':request.data['course_id']})
        serializer.is_valid(raise_exception=True)
        if(Tutors.objects.filter(user=user.id).filter(course=request.data['course_id'])):
            return Response({"mutual_exclusion": ["You cannot tutor and be tutored in the same course"]},\
                 status=status.HTTP_403_FORBIDDEN)        
        obj = serializer.save()
        return Response({
            'user': user.id,
            'course': ModifyStudentSerializer(obj, context=self.get_serializer_context()).data['course']
        })

class AddTutorEntryAPI(generics.GenericAPIView):
    serializer_class = ModifyTutorSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = (TokenAuthentication,)

    def post(self, request, *args, **kwargs):
        user = self.request.user
        serializer = self.get_serializer(data={'user':user.id, 'course':request.data['course_id'], \
            'price':request.data['price']})
        serializer.is_valid(raise_exception=True)
        if(Students.objects.filter(user=user.id).filter(course=request.data['course_id'])):
            return Response({"mutual_exclusion": ["You cannot tutor and be tutored in the same course"]},\
                 status=status.HTTP_403_FORBIDDEN)
        obj = serializer.save()
        data = ModifyTutorSerializer(obj, context=self.get_serializer_context()).data
        return Response({
            'user': user.id,
            'course': data['course'],
            'price': data['price']
        })

# API to update tutor price
class UpdateTutorPriceAPI(generics.GenericAPIView):
    serializer_class = ModifyTutorSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = (TokenAuthentication,)

    def put(self, request, *args, **kwargs):
        user = self.request.user
        tutor_obj = Tutors.objects.filter(user=user.id).filter(course=request.data['course_id'])
        serializer = self.get_serializer(tutor_obj[0], data={'price':request.data['price']},\
             partial=True)
        serializer.is_valid(raise_exception=True)
        obj = serializer.save()
        data = ModifyTutorSerializer(obj, context=self.get_serializer_context()).data
        return Response({
            'user': user.id,
            'course': data['course'],
            'price': data['price']
        })

class RemoveStudentEntryAPI(generics.DestroyAPIView):
    serializer_class = ModifyStudentSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = (TokenAuthentication,)

    def get_object(self):
        user = self.request.user
        course = self.request.data['course_id']
        obj = Students.objects.filter(user=user.id).filter(course=course)
        return obj[0]

class RemoveTutorEntryAPI(generics.DestroyAPIView):
    serializer_class = ModifyTutorSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = (TokenAuthentication,)

    def get_object(self):
        user = self.request.user
        course = self.request.data['course_id']
        obj = Tutors.objects.filter(user=user.id).filter(course=course)
        return obj[0]

# what happens when a student searches for a tutor and requests their email
class AddMatchStudentAPI(generics.GenericAPIView):
    serializer_class = MatchesSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = (TokenAuthentication,)

    def get_object(self):
        student_user = self.request.user
        course_id = self.request.data['course_id']
        tutor_obj = Tutors.objects.get(user=self.request.data['match_id'], course=course_id)
        # use modify serializer here because it only returns user id and that's all we need
        tutor_obj_serialized = ModifyTutorSerializer(tutor_obj)
        tutor_user = tutor_obj_serialized.data['user']
        match_object = {"student_user":student_user.id, "tutor_user":tutor_user, "course_id":course_id}
        return match_object
    
    def post(self, request, *args, **kwargs):
        match_object = self.get_object()
        try:
            obj_get_or_create = Matches.objects.get(student_user=match_object['student_user'], \
                tutor_user=match_object['tutor_user'], course_id=match_object['course_id'])
            email = User.objects.get(pk=match_object['tutor_user']).email
            return Response({
                "match_id": match_object['tutor_user'],
                "email":email
            })
        except ObjectDoesNotExist:
            serializer = self.get_serializer(data=match_object)
            
            serializer.is_valid(raise_exception=True)
            obj = serializer.save()
            email = User.objects.get(pk=match_object['tutor_user']).email
            return Response({
                "match_id": match_object['tutor_user'],
                "email":email
            })

# what happens when a student searches for a tutor and requests their email
class AddMatchTutorAPI(generics.GenericAPIView):
    serializer_class = MatchesSerializer
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    authentication_classes = (TokenAuthentication,)

    def get_object(self):
        tutor_user = self.request.user
        course_id = self.request.data['course_id']
        student_obj = Students.objects.get(user=self.request.data['match_id'], course=course_id)
        # use modify student serializer here because it returns user id and that's all we need
        student_obj_serialized = ModifyStudentSerializer(student_obj)
        student_user = student_obj_serialized.data['user']
        match_object = {"student_user":student_user, "tutor_user":tutor_user.id, "course_id":course_id}
        return match_object
    
    def post(self, request, *args, **kwargs):
        match_object = self.get_object()
        try:
            obj_get_or_create = Matches.objects.get(student_user=match_object['student_user'], \
                tutor_user=match_object['tutor_user'], course_id=match_object['course_id'])
            email = User.objects.get(pk=match_object['student_user']).email
            return Response({
                "match_id": match_object['student_user'],
                "email":email
            })
        except ObjectDoesNotExist:
            serializer = self.get_serializer(data=match_object)
            serializer.is_valid(raise_exception=True)
            obj = serializer.save()
            email = User.objects.get(pk=match_object['student_user']).email
            return Response({
                "match_id": match_object['student_user'],
                "email":email
            })
