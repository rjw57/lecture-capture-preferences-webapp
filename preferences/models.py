from django.conf import settings
from django.db import models


class PreferenceQuerySet(models.QuerySet):
    """
    Custom query set subclass for :py:class:`~.Preference` objects.

    """
    def filter_most_recent_expressed_at(self):
        """
        Filter the query set so that only the most recent preference for each user is present.
        Existing filtering and ordering options are preserved.

        """
        # This works by creating a subquery which returns a single preference for each user using
        # "distinct()". This preference will be the most recent preference dues to the ordering.
        # This subquery is then used to restrict the queryset to only returning the preferences
        # which are returned by the subquery. Doing the filtering in this manner allows us to
        # preserve any additional ordering or filtering operations which are performed on the
        # queryset.
        return self.filter(id__in=models.Subquery(
            Preference.objects.all()
            .order_by('user', '-expressed_at').distinct('user').values('id')
        ))


class PreferenceManager(models.Manager):
    """
    Custom object manager for :py:class:`~.Preference` models. Ensures that Preference querysets
    are instances of :py:class:`~.PreferenceQuerySet`.

    """
    def get_queryset(self):
        return PreferenceQuerySet(self.model, using=self._db)


class Preference(models.Model):
    """
    The preference of an individual user regarding lecture capture.

    """
    #: Object manager
    objects = PreferenceManager()

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, null=False, blank=False, on_delete=models.CASCADE,
        help_text='User which expressed preference')

    allow_capture = models.BooleanField(
        null=False, blank=False,
        help_text='Does the user allow their lectures to be captured?')

    request_hold = models.BooleanField(
        null=False, blank=False,
        help_text='Does the user wish their lecture recordings to be held for editing?')

    expressed_at = models.DateTimeField(
        null=False, blank=False,
        help_text='When the user expressed this preference')

    created_at = models.DateTimeField(auto_now_add=True, help_text='Creation time')

    updated_at = models.DateTimeField(auto_now=True, help_text='Last update time')

    class Meta:
        indexes = [
            # Index the user and expressed at fields so that a query for "latest preference for
            # user" is indexed.
            models.Index(fields=['user']),
            models.Index(fields=['expressed_at']),
        ]

        unique_together = (
            # A given user cannot express preferences at identical times.
            ('user', 'expressed_at'),
        )
