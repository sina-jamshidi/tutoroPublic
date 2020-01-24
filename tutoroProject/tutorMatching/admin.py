from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Students, Tutors, Courses, Ratings, Subscription, Matches
# Register your models here.

admin.site.site_header = "Tutoro Admin"
admin.site.site_title = "Tutoro Admin"
admin.site.index_title = "Welcome"

admin.site.register(Students)
admin.site.register(Tutors)
admin.site.register(Courses)
admin.site.register(Ratings)
admin.site.register(Subscription)
admin.site.register(Matches)