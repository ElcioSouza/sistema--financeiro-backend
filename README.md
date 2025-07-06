# Carteira Financeira

## 📝 Descrição
Sistema de gerenciamento de carteira financeira desenvolvido com NestJS, permitindo controle de transações financeiras e gestão de usuários.

## 🚀 Tecnologias Utilizadas
- [NestJS](https://nestjs.com/)
- [Prisma](https://www.prisma.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [SQLite](https://www.sqlite.org/)
- [JWT](https://jwt.io/) para autenticação

## 📋 Funcionalidades
- Autenticação de usuários
- Gerenciamento de usuários
- Controle de transações financeiras
- Estorno de transações
- Proteção de rotas com JWT

## 🛠️ Pré-requisitos
- Node.js
- npm ou yarn
- Git

## ⚙️ Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositório]
cd carteira-financeiro
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
```bash
npx prisma migrate dev
```

4. Inicie o servidor de desenvolvimento:
```bash
npm run start:dev
```

## 🔧 Estrutura do Projeto
```
src/
├── app/          # Configurações principais do app
├── auth/         # Módulo de autenticação
├── prisma/       # Configuração do Prisma
├── transactions/ # Módulo de transações
└── users/        # Módulo de usuários
```

## 📚 Documentação da API

### Autenticação
- POST `/auth/login` - Login de usuário

### Usuários
- POST `/users` - Criar novo usuário
- GET `/users` - Listar usuários

### Transações
- POST `/transactions` - Criar nova transação
- POST `/transactions/reverse` - Estornar transação

## 🔐 Variáveis de Ambiente
Crie um arquivo `.env` na raiz do projeto:
```env
DATABASE_URL="file:./prisma/Carteirafinanceiro.db"
JWT_SECRET="seu-segredo-aqui"
```

## 🧪 Testes
```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e
```

## 👥 Contribuição
1. Faça o fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença
Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
