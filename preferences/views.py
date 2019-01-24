"""
Views for Lecture Capture Preferences

"""
from rest_framework import generics

from . import serializers


class ProfileView(generics.RetrieveAPIView):
    """
    Endpoint to retrieve the profile of the current user.

    """
    serializer_class = serializers.ProfileSerializer

    def get_object(self):
        """
        Return an object representing what is known about a user from the request. The object can
        be serialised with :py:class:`api.serializers.ProfileSerializer`.

        """
        obj = {'user': self.request.user}
        return obj
