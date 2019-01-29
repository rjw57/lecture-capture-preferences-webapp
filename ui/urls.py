"""
Default URL patterns for the :py:mod:`ui` application are provided by the :py:mod:`.urls` module.
You can use the default mapping by adding the following to your global ``urlpatterns``:

.. code::

    from django.urls import path, include

    urlpatterns = [
        # ...
        path('', include('ui.urls')),
        # ...
    ]

"""
from django.contrib.auth.decorators import login_required
from django.urls import path
from django.views.generic import TemplateView

app_name = 'ui'

urlpatterns = [
    path('', TemplateView.as_view(template_name="index.html"), name='index'),
    path(
        'preferences/new/',
        login_required(TemplateView.as_view(template_name="index.html")),
        name='preferences_new'
    ),
    path(
        'preferences/user/<slug:username>/',
        TemplateView.as_view(template_name="index.html"),
        name='preferences_user'
    ),
]
