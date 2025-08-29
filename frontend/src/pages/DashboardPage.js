import React, { useState, useEffect } from 'react';
import SummaryCard from '../components/SummaryCard';
import CategoryChart from '../components/CategoryChart';
import { getDashboardData } from '../services/api';
import './DashboardPage.css';

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await getDashboardData();
                setData(response.data);
            } catch (err) {
                setError('Falha ao buscar dados do dashboard.');
                console.error('Fetch dashboard data error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const formatCurrency = (value) => {
        if (typeof value !== 'number') {
            return 'R$ 0,00';
        }
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    if (loading) {
        return <p>Carregando dashboard...</p>;
    }

    if (error) {
        return <p style={{ color: 'red' }}>{error}</p>;
    }

    return (
        <div>
            <h2>Dashboard</h2>
            {data && (
                <>
                    <div className="summary-container">
                        <SummaryCard title="Saldo Total" value={formatCurrency(data.total_balance)} />
                        <SummaryCard title="Receitas do Mês" value={formatCurrency(data.total_income)} />
                        <SummaryCard title="Despesas do Mês" value={formatCurrency(data.total_expenses)} />
                    </div>
                    <div className="chart-container">
                        <CategoryChart data={data.expenses_by_category} />
                    </div>
                </>
            )}
        </div>
    );
};

export default DashboardPage;
