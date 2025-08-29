from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Category, Account

User = get_user_model()


class CoreAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)

    def test_create_category(self):
        url = '/api/categories/'
        data = {'name': 'Groceries', 'user': self.user.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 1)
        self.assertEqual(Category.objects.get().name, 'Groceries')

    def test_list_categories(self):
        Category.objects.create(name='Groceries', user=self.user)
        Category.objects.create(name='Salary', user=self.user)
        url = '/api/categories/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_account(self):
        url = '/api/accounts/'
        data = {'name': 'Main Account', 'balance': '1000.00', 'user': self.user.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 1)
        self.assertEqual(Account.objects.get().name, 'Main Account')

    def test_list_accounts(self):
        Account.objects.create(name='Main Account', user=self.user)
        Account.objects.create(name='Savings', user=self.user)
        url = '/api/accounts/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
