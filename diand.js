
class Model{
    constructor(tabela){
        this.tabela = tabela,
        this.query =""
    }

    inserir = async function(dados){
        try {
            this.query =  `INSERT INTO ${this.tabela}(`
    
            let keys = Object.keys(dados)
    
            for(let i=0;i<keys.length;i++){
                if(i == keys.length-1){
                    this.query += `${keys[i]})`
                }else{
                    this.query += `${keys[i]},`
                }    
            }
    
            let values = Object.values(dados)
    
            this.query += " VALUES("
    
            for(let i =0;i<values.length;i++){
                if(i == values.length-1){
                    this.query += `?)`
                }else{
                    this.query += `?,`
                }
            }
           
            await conexao.query(this.query,values).catch((err)=>{
                throw new Error(err)
            })
        } catch (error){
            return new Error(error)
        }
    }

    mostrar = async(campos=undefined,condicao=undefined)=>{
        try {
        
            if(campos){
                this.query ="SELECT "
                for(let i=0;i<campos.length;i++)
                    this.query += i== campos.length-1?`${campos[i]}`:`${campos[i]},`

                this.query += " FROM "+this.tabela
            }else{
                this.query = `SELECT * FROM ${this.tabela}`
            }

            this.query += condicao?` WHERE ${condicao}`:""

            const [dados] = await conexao.query(this.query)
            return await dados
        } catch (error){
            return new Error(error)
        }
    }
    //campos [[],[],]
    mostrarCom = async(campos,alias1,tabela2,alias2,ids,condicao=undefined)=>{
        try {
            this.query ="SELECT "
            for(let i=0;i<campos.length;i++)
                this.query += i== campos.length-1?`${campos[i][0]} as '${campos[i][1]}'`:`${campos[i][0]} as '${campos[i][1]}',`

            this.query += " FROM "+this.tabela+" as "+alias1+" INNER JOIN "+tabela2+" as "+alias2+" on "+ alias1+"."+ids[0]+" = "+alias2+"."+ids[1]

            if(condicao != undefined){
                this.query +=" WHERE "+condicao
            } 
            

            const [dados] = await conexao.query(this.query)
            return await dados
        } catch (error) {
            return new Error(error)
        }
    }

    actualizar = async function(dados,id){
        try {
            this.query =  `UPDATE ${this.tabela} SET `

            let keys = Object.keys(dados)

            for(let i=0;i<keys.length;i++){
                if(i == keys.length-1){
                    this.query += `${keys[i]} = ?`
                }else{
                    this.query += `${keys[i]} = ?,`
                }
            }

            this.query +=  ` WHERE id=${id}`
            
            let valores = Object.values(dados)
            //const existeId = await this.pegar(id)
            await conexao.query(this.query,valores)
           
            
           
        } catch (error) {
            return new Error(error)
        }

    }

    deletar = async function(id){
        try {
            this.query = ""
            const existeId = await this.pegar(id)
            this.query =  `DELETE FROM ${this.tabela} WHERE id = ${id}`
            
            await conexao.query(this.query)
         
        } catch (error) {
            throw new Error(error)
        }

    }

    pegar = async function(id){
        
        try {
            this.query = 'SELECT '
            const [campos_da_tabela] = await conexao.query(`DESC ${this.tabela}`)
    
            for(let i in campos_da_tabela){
                this.query += i==campos_da_tabela.length-1?`${campos_da_tabela[i]["Field"]}`:`${campos_da_tabela[i]["Field"]},`
            }
            
            this.query += ` FROM ${this.tabela} WHERE ${campos_da_tabela[0]["Field"]} = ${id}`

            const [dados] = await conexao.query(this.query)

            if(dados.length ==0){
                throw new Error(`Não existe em ${this.tabela} o id ${id}`)
                return;
            }

            this.query = ""
            return await dados
        } catch (error) {
            throw new Error(error)
        }
        
        
    }

    pegarValores = async(dados)=>{
        try {
            
            this.query = 'SELECT '
            const [campos_da_tabela] = await conexao.query(`DESC ${this.tabela}`)
    
            for(let i in campos_da_tabela){
                this.query += i==campos_da_tabela.length-1?`${campos_da_tabela[i]["Field"]}`:`${campos_da_tabela[i]["Field"]},`
            }
            
            this.query += ` FROM ${this.tabela} WHERE `

            let keys = Object.keys(dados)
            for(let i=0; i<keys.length;i++){
                this.query += i==keys.length-1?`${keys[i]} =?`:`${keys[i]} =? and `
            }

            let valoresCorrespondidos = Object.values(dados)

            
            
          const [dadosRetornados] = await conexao.query(this.query,valoresCorrespondidos)

            
          return await dadosRetornados
        } catch (error) {
            throw new Error(error)
        }
    }

    criar = async(comando,nome)=>{
        try {

            await conexao.query(comando)
            
        } catch (error) {
     
        }
    }
}

const con = async()=>{
    let Produto = new Model("tb_produto")

    const novoProduto ={
        nome: '12',
        cod_barra:'12',
        id_marca:1,
        quantidade:23,
        quantidade_minima:10,
        id_unidade:1,
        id_categoria:31,
        preco_compra:12000,
        preco_venda:29000
      
    }

    await Produto.actualizar({
        quantidade:10
    },14)

    const dados =  await Produto.mostrarCom([
        ["tbp.id","id"],
        ["tbp.cod_barra","cod_barra"],
        ["tbp.nome","nome"],
        ["tbp.quantidade","quantidade"],
        ["tbm.nome","marca"]
    ],"tbp","tb_marca","tbm",["id_marca","id"]) 
    
    console.log(dados)
    
   
}

//con()

module.exports = class Diang{
    constructor(lingua,config){
        this.lingua = lingua
        global.lingua = lingua
        if(lingua == 'mysql')
        {
            const mysql2 = require('mysql2/promise');
            this.conexao = mysql2.createPool({
                host:'localhost',
                user:'root',
                password:config.senha,
                database:config.nome
            });

            global.conexao = this.conexao

        }else if(lingua == 'sqlite')
        {
            const sqlite3 = require('sqlite3')
            const sqlite = require('sqlite')

            sqlite.open({
                filename: `C:\\Users\\user\\OneDrive\\Documentos\\ExemplosBD\\exemplo_ginasio`,
                driver: sqlite3.Database,
                mode:sqlite3.OPEN_READWRITE
            }).then(async(db)=>{
                console.log('conexao aberta')
                const dados = await db.all(`PRAGMA table_info([tb_usuario])`)
              //  console.log(dados)
                global.db = db 
            }).catch((err)=>{
                throw new Error(err)
            })
        }
    }

    Model = class{
        constructor(tabela){
            this.tabela = tabela,
            this.query =""
        }

    
        inserir = async (dados)=>{
            try {
                this.query =  `INSERT INTO ${this.tabela}(`
        
                let keys = Object.keys(dados)
        
                for(let i=0;i<keys.length;i++){
                    if(i == keys.length-1){
                        this.query += `${keys[i]})`
                    }else{
                        this.query += `${keys[i]},`
                    }    
                }

                let values = Object.values(dados)
        
                this.query += " VALUES("
        
                for(let i =0;i<values.length;i++){
                    if(i == values.length-1){
                        this.query += `?)`
                    }else{
                        this.query += `?,`
                    }
                }

                
                if(global.lingua == 'mysql'){
                    await global.conexao.query(this.query,values).catch((err)=>{
                        throw new Error(err)
                    })
                }else{
                    await global.db.run(this.query,values).catch((err)=>{
                        throw new Error(err)
                    })
                }
               
                
            } catch (error){
                return new Error(error)
            }
        }
    
        mostrar = async(campos=undefined,condicao=undefined)=>{
            try {
            
                if(campos){
                    this.query ="SELECT "
                    for(let i=0;i<campos.length;i++)
                        this.query += i== campos.length-1?`${campos[i]}`:`${campos[i]},`
    
                    this.query += " FROM "+this.tabela
                }else{
                    this.query = `SELECT * FROM ${this.tabela}`
                }
    
                this.query += condicao?` WHERE ${condicao}`:""

                

                if(global.lingua == 'mysql'){
                    let [dados] = await global.conexao.query(this.query)
                    return await dados
                }else{
                    let dados = await global.db.all(this.query)
                    return await dados
                }
               
                
            } catch (error){
                return new Error(error)
            }
        }

        executar= async(comando)=>{
            if(global.lingua == 'mysql'){
               let [dados] =  global.conexao.query(comando)
               return await dados
            }else{
                let dados = global.db.run(comando)
                return await dados
            }

            
        }

        actualizar = async(dados,id)=>{
            try {
                this.query =  `UPDATE ${this.tabela} SET `
    
                let keys = Object.keys(dados)
    
                for(let i=0;i<keys.length;i++){
                    if(i == keys.length-1){
                        this.query += `${keys[i]} = ?`
                    }else{
                        this.query += `${keys[i]} = ?,`
                    }
                }
    
                this.query +=  ` WHERE id=${id}`
                
                let valores = Object.values(dados)
                //const existeId = await this.pegar(id)
                if(global.lingua == 'mysql'){
                    await global.conexao.query(this.query,valores).catch((err)=>{
                        throw new Error(err)
                    })
                }else{
                    await global.db.run(this.query,values).catch((err)=>{
                        throw new Error(err)
                    })
                }
               
                
               
            } catch (error) {
                return new Error(error)
            }
    
        }

        deletar = async(id)=>{
            try {
                this.query = ""
                const existeId = await this.pegar(id)

                let [campos_da_tabela] = ''
                if(global.lingua=='mysql'){
                    [campos_da_tabela] = await global.conexao.query(`DESC ${this.tabela}`)
                    this.query =  `DELETE FROM ${this.tabela} WHERE  ${campos_da_tabela[0]["Field"]}= ${id}`

                }else{  
                    campos_da_tabela = await global.db.all(`PRAGMA table_info([${this.tabela}])`)  
                    this.query =  `DELETE FROM ${this.tabela} WHERE  ${campos_da_tabela[0]["name"]}= ${id}` 
                }
        

                if(global.lingua == 'mysql'){
                    await global.conexao.query(this.query).catch((err)=>{
                        throw new Error(err)
                    })
                }else{
                    await global.db.run(this.query).catch((err)=>{
                        throw new Error(err)
                    })
                }
             
            } catch (error) {
                throw new Error(error)
            }
    
        }

        pegarValores = async(dados)=>{
            try {
                
                this.query = 'SELECT '
                let [campos_da_tabela] = ''
                let [campos_da_tabela_sqlite] = ''
                if(global.lingua=='mysql'){
                    [campos_da_tabela] = await global.conexao.query(`DESC ${this.tabela}`)

                    for(let i in campos_da_tabela){
                        this.query += i==campos_da_tabela.length-1?`${campos_da_tabela[i]["Field"]}`:`${campos_da_tabela[i]["Field"]},`
                    }

                }else{  
                    campos_da_tabela = await global.db.all(`PRAGMA table_info([${this.tabela}])`)

                    for(let i in campos_da_tabela){
                        this.query += i==campos_da_tabela.length-1?`${campos_da_tabela[i]["name"]}`:`${campos_da_tabela[i]["name"]},`
                    }
                }
        
                
                
                this.query += ` FROM ${this.tabela} WHERE `
    
                let keys = Object.keys(dados)
                for(let i=0; i<keys.length;i++){
                    this.query += i==keys.length-1?`${keys[i]} =?`:`${keys[i]} =? and `
                }
    
                let valoresCorrespondidos = Object.values(dados)
    
                if(global.lingua == 'mysql'){
                    let [dados] = await global.conexao.query(this.query)
        
                    this.query = ""
                    return await dados
                }else{
                    let dados = await global.db.all(this.query,valoresCorrespondidos)
                    this.query = ""
                    return await dados
                }
                
            } catch (error) {
                throw new Error(error)
            }
        }
    
        pegar = async(id)=>{
            
            try {
                this.query = 'SELECT '
                let [campos_da_tabela] = ''
                let [campos_da_tabela_sqlite] = ''
                if(global.lingua=='mysql'){
                    [campos_da_tabela] = await global.conexao.query(`DESC ${this.tabela}`)

                    for(let i in campos_da_tabela){
                        this.query += i==campos_da_tabela.length-1?`${campos_da_tabela[i]["Field"]}`:`${campos_da_tabela[i]["Field"]},`
                    }

                }else{  
                    campos_da_tabela = await global.db.all(`PRAGMA table_info([${this.tabela}])`)
                    console.log(campos_da_tabela[0]['name'])
                    for(let i in campos_da_tabela){
                        this.query += i==campos_da_tabela.length-1?`${campos_da_tabela[i]["name"]}`:`${campos_da_tabela[i]["name"]},`
                    }
                }
                
                if(global.lingua == 'mysql'){
                    this.query += ` FROM ${this.tabela} WHERE ${campos_da_tabela[0]["Field"]} = ${id}`
                }else{
                    this.query += ` FROM ${this.tabela} WHERE ${campos_da_tabela[0]['name']} = ${id}`
                }
                
    
                
                if(global.lingua == 'mysql'){
                    let [dados] = await global.conexao.query(this.query)
                    if(dados.length ==0){
                        throw new Error(`Não existe em ${this.tabela} o id ${id}`)
                        return;
                    }
        
                    this.query = ""
                    return await dados
                }else{
                    let [dados] = await global.db.all(this.query)
                    if(dados.length ==0){
                        throw new Error(`Não existe em ${this.tabela} o id ${id}`)
                        return;
                    }
        
                    this.query = ""
                    return await dados
                }
    
               
               
            } catch (error) {
                throw new Error(error)
            }
            
            
        }
    
        
    
    }

}
