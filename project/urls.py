"""Lecture Capture Preferences URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.contrib import admin
from django.http import HttpResponse
from django.urls import path, include, re_path
from drf_yasg import openapi
from drf_yasg.views import get_schema_view
from rest_framework import permissions

import automationcommon.views

# Django debug toolbar is only installed in developer builds
try:
    import debug_toolbar
    HAVE_DDT = True
except ImportError:
    HAVE_DDT = False

schema_view = get_schema_view(
   openapi.Info(
      title='Preferences API',
      default_version='v1',
      description='Lecture Capture Preferences API',
      contact=openapi.Contact(email='automation@uis.cam.ac.uk'),
      license=openapi.License(name='MIT License'),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
   urlconf='project.urls',
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('ucamwebauth.urls')),
    path('status', automationcommon.views.status, name='status'),
    path('healthz', lambda request: HttpResponse('ok', content_type="text/plain"), name='healthz'),
    path('api/', include('preferences.urls', namespace='preferences')),

    # lookup/ibis urls
    path('ucamlookup/', include('ucamlookup.urls')),

    # API documentation
    re_path(
        r'^api/swagger(?P<format>\.json|\.yaml)$',
        schema_view.without_ui(cache_timeout=None), name='schema-json'),

    path('', include('ui.urls', namespace='ui')),
]

# Selectively enable django debug toolbar URLs. Only if the toolbar is
# installed *and* DEBUG is True.
if HAVE_DDT and settings.DEBUG:
    urlpatterns = [
        path(r'__debug__/', include(debug_toolbar.urls)),
    ] + urlpatterns
