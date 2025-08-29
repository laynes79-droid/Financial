# Minhas Finanças

## Sobre o Projeto

Minhas Finanças é uma aplicação de gestão financeira pessoal que permite aos usuários controlar suas despesas e receitas de forma simples e eficaz. O projeto é composto por um backend em Django e um frontend em React.

## Funcionalidades

- **Autenticação de Usuários:** Sistema de login e registro para acesso seguro.
- **Gestão de Contas:** Crie e gerencie múltiplas contas financeiras.
- **Categorização:** Organize suas transações em categorias personalizadas.
- **Registro de Transações:** Adicione suas receitas e despesas de forma rápida.

## Tecnologias Utilizadas

**Backend:**
- Python
- Django
- Django REST Framework

**Frontend:**
- React
- JavaScript
- Axios
- React Router

## Como Executar o Projeto

### Pré-requisitos

- Python 3.8+
- Node.js 14+
- npm ou yarn

### Backend

1. **Navegue até o diretório do backend:**
   ```bash
   cd backend
   ```
2. **Crie e ative um ambiente virtual:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # No Windows, use `venv\Scripts\activate`
   ```
3. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Aplique as migrações do banco de dados:**
   ```bash
   python manage.py migrate
   ```

5. **Inicie o servidor de desenvolvimento:**
   ```bash
   python manage.py runserver
   ```
   O servidor estará disponível em `http://127.0.0.1:8000`.

### Frontend

1. **Navegue até o diretório do frontend:**
   ```bash
   cd frontend
   ```
2. **Instale as dependências:**
   ```bash
   npm install
   ```
3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   A aplicação estará disponível em `http://localhost:3000`.

## Como Executar os Testes

### Backend

1. **Navegue até o diretório do backend:**
   ```bash
   cd backend
   ```
2. **Execute os testes:**
   ```bash
   python manage.py test core
   ```
