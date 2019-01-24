from rest_framework import serializers


class ProfileSerializer(serializers.Serializer):
    """
    The profile of the current user.

    """
    is_anonymous = serializers.BooleanField(source='user.is_anonymous')
    username = serializers.CharField(source='user.username', required=False)
    display_name = serializers.SerializerMethodField()

    def get_display_name(self, obj):
        return _get_user_display_name(obj['user'])


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
