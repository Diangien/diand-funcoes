# Funções simples que permitem o manejo da tua base de dados

Como Usar?

Instalação dos pacotes

```shell
    npm install sqlite --save
    npm install sqlite3 --save
    npm install mysql2 --save
    npm install diand --save
```

Requisição da biblioteca

```js
    const Diand = require('diand')
```

Configuração para **MySQL**

```js
    const database = new Diand('mysql',{senha:'<senha_da_base_de_dados>',nome:'exemplo.db'})

    //Exemplo
     const database = new Diand('mysql',{senha:'',nome:'stock.db'})😉
```

Configuração para **SQLite**

```js
    const database = new Diand('sqlite',`<caminho_da_base_de_dados>`)

    //Exemplo
     const database = new Diand('sqlite',`C:\\Users\\user\\OneDrive\\Documentos\\projectoTLP\\ginasio.db`)😉

```

Criação de tabelas

```js
    const variavel = new database.Model('<nome-tabela>')

    //Exemplo

    const tb_usuario = new database.Model('tb_usuario')
```




