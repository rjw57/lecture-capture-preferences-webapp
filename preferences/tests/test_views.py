from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework.authtoken.models import Token
from rest_framework.test import APIRequestFactory, force_authenticate

from .. import views


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
