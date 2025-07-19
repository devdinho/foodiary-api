# Foodiary API

API backend para Foodiary, utilizando Serverless Framework, Drizzle ORM e Neon Database.

---

## ⚙️ Configuração de ambientes

Este projeto utiliza arquivos `.env` específicos para cada ambiente (`dev`, `staging`, `prod`), contendo as variáveis de ambiente necessárias, principalmente a URL do banco (`DATABASE_URL`).

Arquivos `.env` esperados:

* `.env.dev`
* `.env.staging`
* `.env.prod`

Cada arquivo deve conter:

```env
DATABASE_URL=URL_DO_BANCO_NEON_PARA_O_AMBIENTE
```

---

## 🚀 Comandos principais

### Deploy da API

Faz o deploy da aplicação no ambiente especificado.

```bash
npm run deploy:dev
npm run deploy:staging
npm run deploy:prod
```
##### P.S: o Deploy de dev esta bloqueado dentro do serverless.yml

Esses comandos usam as variáveis do arquivo `.env.<stage>` correspondente e setam o stage para Serverless Framework.

### Migrar o banco de dados

Executa as migrations com o Drizzle ORM para o ambiente desejado.

```bash
npm run migrate:dev
npm run migrate:staging
npm run migrate:prod
```

Esse comando lê o `.env.<stage>` e aplica as migrations no banco Neon do respectivo ambiente.

### Rodar localmente (offline)


Para rodar a API localmente, em dev:

```bash
npm run dev
```

Para rodar a API localmente, simulando a AWS em staging:

```bash
npm run offline
```

O comando carrega o `.env.<stage>` automaticamente.

---

## 📦 Scripts configurados no `package.json`

```json
    "scripts": {
        "dev": "sls offline start --reloadHandler",

        "deploy:dev": "SLS_STAGE=dev sls deploy --stage dev",
        "deploy:staging": "SLS_STAGE=staging sls deploy --stage staging",
        "deploy:prod": "SLS_STAGE=prod sls deploy --stage prod",

        "migrate:dev": "SLS_STAGE=dev npx drizzle-kit push",
        "migrate:staging": "SLS_STAGE=staging npx drizzle-kit push",
        "migrate:prod": "SLS_STAGE=prod npx drizzle-kit push",

        "offline": "SLS_STAGE=dev sls offline"
    }
```

---

## ⚠️ Atenção

* Sempre garanta que o arquivo `.env.<stage>` correto está presente e atualizado.
* Os comandos usam a variável `SLS_STAGE` para determinar qual `.env` carregar.
* O deploy para `dev` está bloqueado para evitar deploys acidentais.