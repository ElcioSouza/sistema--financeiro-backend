## Project setup

```bash
$ npm install
```

## Variáveis de Ambiente

Este projeto utiliza as seguintes variáveis de ambiente. Crie um arquivo `.env` na raiz do projeto com as seguintes configurações:

### Configuração do Banco de Dados

```env
# URL de conexão com o banco de dados
DATABASE_URL="file:./NomeDaBaseDeDados.db"
``` 

### Configuração de Autenticação

```env
# Chave secreta para assinatura dos tokens JWT
JWT_SECRET="sua_chave_secreta_aqui"
```

### Arquivo de Exemplo

Crie seu arquivo de ambiente copiando o exemplo:

```bash
cp exemple.env .env
```

## Compile and run the project

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```