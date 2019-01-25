import datetime
import itertools

from django.contrib.auth import get_user_model
from django.test import TestCase
from django.utils import dateparse, timezone
from furl import furl
from rest_framework.authtoken.models import Token
from rest_framework.test import APIRequestFactory, force_authenticate

from .. import views
from .. import models


class ViewTestCase(TestCase):
    fixtures = ['preferences/tests/fixtures/common.yaml']

    def setUp(self):
        self.factory = APIRequestFactory()
        self.get_request = self.factory.get('/')
        self.user = get_user_model().objects.get(pk=1)


class ProfileViewTestCase(ViewTestCase):
    def setUp(self):
        super().setUp()
        self.view = views.ProfileView().as_view()
        self.expected_display_name = self.user.get_full_name()

    def test_anonymous(self):
        """An anonymous user should have is_anonymous set to True."""
        response = self.view(self.get_request)
        self.assertTrue(response.data['is_anonymous'])

    def test_authenticated(self):
        """A non-anonymous user should have is_anonymous set to False and username set."""
        force_authenticate(self.get_request, user=self.user)
        response = self.view(self.get_request)
        self.assertFalse(response.data['is_anonymous'])
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['display_name'], self.expected_display_name)

    def test_token_authenticated(self):
        """A token-authenticated user should get expected media back."""
        token = Token.objects.create(user=self.user)
        token_get_request = self.factory.get('/', HTTP_AUTHORIZATION=f'Token {token.key}')
        response = self.view(token_get_request)
        self.assertFalse(response.data['is_anonymous'])
        self.assertEqual(response.data['username'], self.user.username)
        self.assertEqual(response.data['display_name'], self.expected_display_name)

    def test_last_name_only(self):
        """A last name only user should have that as the display name."""
        self.user.first_name = ''
        self.user.last_name = 'GHJ'
        force_authenticate(self.get_request, user=self.user)
        response = self.view(self.get_request)
        self.assertEqual(response.data['display_name'], 'GHJ')

    def test_first_name_only(self):
        """A first name only user should have that as the display name."""
        self.user.first_name = 'GHJ'
        self.user.last_name = ''
        force_authenticate(self.get_request, user=self.user)
        response = self.view(self.get_request)
        self.assertEqual(response.data['display_name'], 'GHJ')

    def test_no_name(self):
        """A user with no name should fall back to the username as a display name."""
        self.user.first_name = ''
        self.user.last_name = ''
        force_authenticate(self.get_request, user=self.user)
        response = self.view(self.get_request)
        self.assertEqual(response.data['display_name'], self.user.username)


class PreferenceListViewTestCase(ViewTestCase):
    def setUp(self):
        super().setUp()
        self.view = views.PreferenceListView().as_view()

        # Some common querysets
        self.all_qs = models.Preference.objects.all()
        self.most_recent_qs = models.Preference.objects.all().filter_most_recent_expressed_at()

    def test_basic_functionality(self):
        """A basic GET returns all the user preferences."""
        results = self._request_all()['results']
        self.assertEqual(len(results), self.most_recent_qs.count())

    def test_pagination(self):
        """A page size of one takes as many pages as there are results."""
        response = self._request_all(data={'page_size': 1})
        self.assertGreater(response['page_count'], 1)
        self.assertEqual(len(response['results']), response['page_count'])

    def test_user_filtering(self):
        """Filtering by user returns correct result."""
        user_pref = self.most_recent_qs.filter(user=self.user).first()
        self.assertIsNotNone(user_pref)

        results = self._request_all({'user': self.user.username})['results']
        self.assertEqual(len(results), 1)
        self._assert_preference_dict_matches(results[0], user_pref)

    def test_ordering_by_expressed_at_descending(self):
        """Ordering by descending expressed_at gives correct result."""
        expected_prefs = self.most_recent_qs.order_by('-expressed_at')
        results = self._request_all({'ordering': '-expressed_at'})['results']
        self.assertEqual(len(results), expected_prefs.count())
        for pref_dict, pref in zip(results, expected_prefs):
            self._assert_preference_dict_matches(pref_dict, pref)

    def test_ordering_by_expressed_at_ascending(self):
        """Ordering by ascending expressed_at gives correct result."""
        expected_prefs = self.most_recent_qs.order_by('expressed_at')
        results = self._request_all({'ordering': 'expressed_at'})['results']
        self.assertEqual(len(results), expected_prefs.count())
        for pref_dict, pref in zip(results, expected_prefs):
            self._assert_preference_dict_matches(pref_dict, pref)

    def test_expressed_at_query(self):
        """Can query list by expressed_at range."""
        minimum = self.most_recent_qs.order_by('expressed_at')[0]
        maximum = self.most_recent_qs.order_by('-expressed_at')[0]
        self.assertGreater(maximum.expressed_at, minimum.expressed_at)
        self.assertGreater(self.most_recent_qs.count(), 2)

        # Get the expected preferences between lower and upper quartile dates
        expected_prefs = self.most_recent_qs.filter(
            expressed_at__gt=minimum.expressed_at,
            expressed_at__lt=maximum.expressed_at).order_by('-expressed_at')
        self.assertTrue(expected_prefs.exists())

        # Get list returned by query
        results = self._request_all({
            'ordering': '-expressed_at',
            'expressed_at_after':
                (minimum.expressed_at + datetime.timedelta(seconds=0.1)).isoformat(),
            'expressed_at_before':
                (maximum.expressed_at - datetime.timedelta(seconds=0.1)).isoformat(),
        })['results']

        self.assertEqual(len(results), expected_prefs.count())
        for pref_dict, pref in zip(results, expected_prefs):
            self._assert_preference_dict_matches(pref_dict, pref)

    def test_creation(self):
        """POST-ing preferences updates preferences for user"""
        for allow_capture, request_hold in itertools.product([True, False], [True, False]):
            # Update user preference
            request = self.factory.post('/', {
                'allow_capture': allow_capture, 'request_hold': request_hold
            })
            force_authenticate(request, user=self.user)
            response = self.view(request)
            self.assertEqual(response.status_code, 201)  # created

            # Most recent preference is updated
            pref = self.most_recent_qs.filter(user=self.user).first()
            self.assertIsNotNone(pref)
            self.assertEqual(pref.allow_capture, allow_capture)
            self.assertEqual(pref.request_hold, request_hold)

    def test_anonymous_creation(self):
        """POST-ing preferences updates preferences for anonymous user fails"""
        request = self.factory.post('/', {
            'allow_capture': True, 'request_hold': False
        })
        response = self.view(request)
        self.assertEqual(response.status_code, 403)  # Forbidden

    def test_creation_ignores_expressed_at(self):
        """POST-ing preferences updates preferences for user and ignores any expressed_at"""
        # Update user preference
        expressed_at_request = timezone.now() - datetime.timedelta(days=34)
        request = self.factory.post('/', {
            'allow_capture': True, 'request_hold': False,
            'expressed_at': expressed_at_request.isoformat()
        })
        force_authenticate(request, user=self.user)
        prev_pref = self.most_recent_qs.filter(user=self.user).first()
        response = self.view(request)
        self.assertEqual(response.status_code, 201)  # created
        pref = self.most_recent_qs.filter(user=self.user).first()
        self.assertNotEqual(prev_pref.id, pref.id)
        self.assertNotEqual(pref.expressed_at, expressed_at_request)

    def _assert_preference_dict_matches(self, pref_dict, pref):
        """
        Assert that a preference returned from the API matches a database object.

        """
        self.assertEqual(pref_dict['user']['username'], pref.user.username)
        self.assertEqual(pref_dict['allow_capture'], pref.allow_capture)
        self.assertEqual(pref_dict['request_hold'], pref.request_hold)
        self.assertEqual(dateparse.parse_datetime(pref_dict['expressed_at']), pref.expressed_at)

    def _request_all(self, data=None, page_count_max=20):
        """
        Fetch all preference objects from the API. Returns an object of the form

        {'results': [...], 'page_count': number }

        """
        results = []
        page_count = 0

        # Use the furl library so that it's easy to merge query arguments in.
        url = furl('/')
        if data is not None:
            url.args.update(data)

        while True:
            request = self.factory.get(url.url)
            response = self.view(request)
            self.assertEqual(response.status_code, 200)

            page_count += 1
            results.extend(response.data['results'])

            # We're done if we've run out of pages
            if response.data.get('next') is None:
                break

            # Update the URL from the "next" field in the response
            url = furl(response.data.get('next'))

            if page_count > page_count_max:
                assert False, f'Exceeded maximum page count of {page_count_max}'

        return {'results': results, 'page_count': page_count}
