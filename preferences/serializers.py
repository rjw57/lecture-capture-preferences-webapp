from django.utils import timezone
from rest_framework import serializers

from . import models


class ProfileSerializer(serializers.Serializer):
    """
    The profile of the current user.

    """
    is_anonymous = serializers.BooleanField(source='user.is_anonymous')
    username = serializers.CharField(source='user.username', required=False)
    display_name = serializers.SerializerMethodField()

    def get_display_name(self, obj):
        return _get_user_display_name(obj['user'])


class UserSerializer(serializers.Serializer):
    """
    A user.

    """
    username = serializers.CharField()
    display_name = serializers.SerializerMethodField()

    def get_display_name(self, obj):
        return _get_user_display_name(obj)


class PreferenceSerializer(serializers.Serializer):
    """
    A lecture capture preference.

    """
    user = UserSerializer(read_only=True)
    allow_capture = serializers.BooleanField()
    request_hold = serializers.BooleanField()
    expressed_at = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        # Get current user trying to create preference
        user = None
        if self.context is not None and 'request' in self.context:
            user = self.context['request'].user

        # The anonymous user can never create a preference due to permissions. Assert this is the
        # case
        assert user is not None and not user.is_anonymous

        return models.Preference.objects.create(
            user=user, expressed_at=timezone.now(), **validated_data
        )


def _get_user_display_name(user):
    """Return a human-friendly display name for a user."""
    # An anonymous user has no display name
    if user.is_anonymous:
        return ''

    # Form display name by concatenating first and last names and stripping whitespace
    display_name = user.get_full_name().strip()

    # If the display name is empty, use the username instead
    if display_name == '':
        return user.username

    return display_name
