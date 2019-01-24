"""
URL routing schema for Lecture Capture Preferences.

"""

from django.urls import path

from . import views

app_name = "preferences"

urlpatterns = [
    path('profile/', views.ProfileView.as_view(), name='profile'),
]
