"""
Views for Lecture Capture Preferences

"""
from django_filters import rest_framework as df_filters
from rest_framework import generics, pagination, filters

from . import serializers
from . import models as preferences_models


class ListPagination(pagination.CursorPagination):
    page_size = 50
    page_size_query_param = 'page_size'
    max_page_size = 300


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


class PreferenceFilter(df_filters.FilterSet):
    class Meta:
        model = preferences_models.Preference
        fields = []

    user = df_filters.CharFilter(field_name='user__username')
    expressed_at = df_filters.IsoDateTimeFromToRangeFilter(field_name='expressed_at')


class PreferenceListView(generics.ListAPIView):
    """
    List all user preferences.

    """
    # The queryset for this view selects only the preferences which are the most recent for each
    # user.
    queryset = (
        preferences_models.Preference.objects.all()
        .filter_most_recent_expressed_at()
        .select_related('user')
    )

    filter_backends = (filters.OrderingFilter, df_filters.DjangoFilterBackend)
    filterset_class = PreferenceFilter
    ordering = ('-expressed_at', '-user__username')
    ordering_fields = ('expressed_at',)
    pagination_class = ListPagination
    serializer_class = serializers.PreferenceSerializer
