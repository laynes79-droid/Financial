import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header>
            <Link to={token ? "/dashboard" : "/"}>
                <h1>Minhas Finanças</h1>
            </Link>
            <nav>
                {token ? (
                    <button onClick={handleLogout}>Logout</button>
                ) : (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register" style={{ marginLeft: '10px' }}>Registrar</Link>
                    </>
                )}
            </nav>
        </header>
    );
};

export default Header;
