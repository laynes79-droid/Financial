from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Sum
from .models import Account, Category, Transaction
from .serializers import AccountSerializer, CategorySerializer, TransactionSerializer
from django.contrib.auth.models import User
from .serializers import UserSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer


class AccountViewSet(viewsets.ModelViewSet):
    queryset = Account.objects.all()
    serializer_class = AccountSerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

    def get_queryset(self):
        return self.queryset.filter(user=self.request.user)


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer

    def get_queryset(self):
        return self.queryset.filter(account__user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_data(request):
    user = request.user
    now = timezone.now()

    # Total Balance
    total_balance = Account.objects.filter(user=user).aggregate(total=Sum('balance'))['total'] or 0

    # Current Month's Income and Expenses
    current_month_transactions = Transaction.objects.filter(
        account__user=user,
        date__year=now.year,
        date__month=now.month
    )
    total_income = current_month_transactions.filter(transaction_type='INCOME').aggregate(total=Sum('amount'))['total'] or 0
    total_expenses = current_month_transactions.filter(transaction_type='EXPENSE').aggregate(total=Sum('amount'))['total'] or 0

    # Expenses by Category
    expenses_by_category = current_month_transactions.filter(
        transaction_type='EXPENSE'
    ).values('category__name').annotate(total=Sum('amount')).order_by('-total')

    data = {
        'total_balance': total_balance,
        'total_income': total_income,
        'total_expenses': total_expenses,
        'expenses_by_category': list(expenses_by_category)
    }
    return Response(data)
