import React, { useState, useEffect } from 'react';
import { getTransactions, createTransaction, updateTransaction, deleteTransaction } from '../services/api';
import TransactionForm from '../components/TransactionForm';

const TransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const fetchTransactions = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await getTransactions();
            setTransactions(response.data);
        } catch (err) {
            setError('Falha ao buscar transações.');
            console.error('Fetch transactions error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const handleAdd = () => {
        setSelectedTransaction(null);
        setShowForm(true);
    };

    const handleEdit = (transaction) => {
        setSelectedTransaction(transaction);
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        try {
            await deleteTransaction(id);
            fetchTransactions();
        } catch (err) {
            setError('Falha ao excluir transação.');
            console.error('Delete transaction error:', err);
        }
    };

    const handleFormSubmit = async (transactionData) => {
        try {
            if (selectedTransaction) {
                await updateTransaction(selectedTransaction.id, transactionData);
            } else {
                await createTransaction(transactionData);
            }
            setShowForm(false);
            fetchTransactions();
        } catch (err) {
            setError('Falha ao salvar transação.');
            console.error('Save transaction error:', err);
        }
    };

    return (
        <div>
            <h2>Transações</h2>
            <button onClick={handleAdd}>Adicionar Transação</button>

            {showForm && (
                <TransactionForm
                    transaction={selectedTransaction}
                    onSubmit={handleFormSubmit}
                />
            )}

            {loading && <p>Carregando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <table>
                <thead>
                    <tr>
                        <th>Data</th>
                        <th>Descrição</th>
                        <th>Valor</th>
                        <th>Tipo</th>
                        <th>Categoria</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((transaction) => (
                        <tr key={transaction.id}>
                            <td>{transaction.date}</td>
                            <td>{transaction.description}</td>
                            <td>{transaction.amount}</td>
                            <td>{transaction.transaction_type}</td>
                            <td>{transaction.category_name || 'N/A'}</td>
                            <td>
                                <button onClick={() => handleEdit(transaction)}>Editar</button>
                                <button onClick={() => handleDelete(transaction.id)} style={{ marginLeft: '5px' }}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsPage;
