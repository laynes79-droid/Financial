import React, { useState, useEffect } from 'react';
import { getAccounts, getCategories } from '../services/api';

const TransactionForm = ({ transaction, onSubmit }) => {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [date, setDate] = useState('');
    const [transactionType, setTransactionType] = useState('EXPENSE');
    const [account, setAccount] = useState('');
    const [category, setCategory] = useState('');

    const [accounts, setAccounts] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const accountsResponse = await getAccounts();
                setAccounts(accountsResponse.data);
                const categoriesResponse = await getCategories();
                setCategories(categoriesResponse.data);
            } catch (error) {
                console.error("Failed to fetch accounts or categories", error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        if (transaction) {
            setAmount(transaction.amount);
            setDescription(transaction.description);
            setDate(transaction.date);
            setTransactionType(transaction.transaction_type);
            setAccount(transaction.account);
            setCategory(transaction.category);
        }
    }, [transaction]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({ amount, description, date, transaction_type: transactionType, account, category });
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label>Valor:</label>
                <input type="number" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            </div>
            <div>
                <label>Descrição:</label>
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </div>
            <div>
                <label>Data:</label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
            <div>
                <label>Tipo:</label>
                <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)}>
                    <option value="EXPENSE">Despesa</option>
                    <option value="INCOME">Receita</option>
                </select>
            </div>
            <div>
                <label>Conta:</label>
                <select value={account} onChange={(e) => setAccount(e.target.value)} required>
                    <option value="">Selecione uma conta</option>
                    {accounts.map((acc) => (
                        <option key={acc.id} value={acc.id}>{acc.name}</option>
                    ))}
                </select>
            </div>
            <div>
                <label>Categoria:</label>
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Selecione uma categoria</option>
                    {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                </select>
            </div>
            <button type="submit">Salvar</button>
        </form>
    );
};

export default TransactionForm;
