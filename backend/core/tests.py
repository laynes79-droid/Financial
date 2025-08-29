from django.test import TestCase
from django.utils import timezone
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Category, Account, Transaction

User = get_user_model()


class CoreAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpassword')
        self.client.force_authenticate(user=self.user)
        self.account = Account.objects.create(name='Main Account', user=self.user)
        self.category = Category.objects.create(name='Groceries', user=self.user)

    def test_create_category(self):
        url = '/api/categories/'
        data = {'name': 'Food', 'user': self.user.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Category.objects.count(), 2) # including the one from setUp
        self.assertEqual(Category.objects.last().name, 'Food')

    def test_list_categories(self):
        Category.objects.create(name='Salary', user=self.user)
        url = '/api/categories/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_account(self):
        url = '/api/accounts/'
        data = {'name': 'Savings', 'balance': '500.00', 'user': self.user.id}
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Account.objects.count(), 2) # including the one from setUp
        self.assertEqual(Account.objects.last().name, 'Savings')

    def test_list_accounts(self):
        Account.objects.create(name='Savings', user=self.user)
        url = '/api/accounts/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_create_transaction(self):
        url = '/api/transactions/'
        data = {
            'account': self.account.id,
            'category': self.category.id,
            'transaction_type': 'EXPENSE',
            'amount': '50.00',
            'description': 'Weekly groceries',
            'date': '2024-01-01'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Transaction.objects.count(), 1)
        self.assertEqual(Transaction.objects.get().description, 'Weekly groceries')

    def test_list_transactions(self):
        Transaction.objects.create(
            account=self.account,
            category=self.category,
            transaction_type='EXPENSE',
            amount='50.00',
            description='Weekly groceries',
            date='2024-01-01'
        )
        url = '/api/transactions/'
        response = self.client.get(url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)

    def test_update_transaction(self):
        transaction = Transaction.objects.create(
            account=self.account,
            category=self.category,
            transaction_type='EXPENSE',
            amount='50.00',
            description='Weekly groceries',
            date='2024-01-01'
        )
        url = f'/api/transactions/{transaction.id}/'
        data = {
            'account': self.account.id,
            'category': self.category.id,
            'transaction_type': 'EXPENSE',
            'amount': '75.00',
            'description': 'Updated groceries',
            'date': '2024-01-01'
        }
        response = self.client.put(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        transaction.refresh_from_db()
        self.assertEqual(transaction.description, 'Updated groceries')
        self.assertEqual(float(transaction.amount), 75.00)

    def test_delete_transaction(self):
        transaction = Transaction.objects.create(
            account=self.account,
            category=self.category,
            transaction_type='EXPENSE',
            amount='50.00',
            description='Weekly groceries',
            date='2024-01-01'
        )
        url = f'/api/transactions/{transaction.id}/'
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Transaction.objects.count(), 0)

    def test_dashboard_data(self):
        # Create some transactions for the current month
        now = timezone.now()
        Transaction.objects.create(
            account=self.account,
            category=self.category,
            transaction_type='EXPENSE',
            amount='100.00',
            description='Test Expense 1',
            date=now.date()
        )
        Transaction.objects.create(
            account=self.account,
            transaction_type='INCOME',
            amount='500.00',
            description='Test Income',
            date=now.date()
        )
        # And one for a previous month
        Transaction.objects.create(
            account=self.account,
            category=self.category,
            transaction_type='EXPENSE',
            amount='50.00',
            description='Old Expense',
            date=(now - timezone.timedelta(days=40)).date()
        )
        self.account.balance = 400.00
        self.account.save()

        url = '/api/dashboard/'
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        data = response.data
        self.assertEqual(data['total_balance'], 400.00)
        self.assertEqual(data['total_income'], 500.00)
        self.assertEqual(data['total_expenses'], 100.00)
        self.assertEqual(len(data['expenses_by_category']), 1)
        self.assertEqual(data['expenses_by_category'][0]['category__name'], 'Groceries')
        self.assertEqual(float(data['expenses_by_category'][0]['total']), 100.00)
