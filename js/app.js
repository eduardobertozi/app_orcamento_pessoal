class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    
    validarDados() {
        //percorrer cada um dos elementos do atributo despesa
        for(let i in this) {
            if(this[i] == undefined || this[i] == '' || this[i] == null) {
                return false
            }
        }
        return true
    }

}

class Bd {

    constructor() {
        let id = localStorage.getItem('id') //Por padrão vem como null
        //Se for nulo, setar como numérico
        if(id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId() {
        //recupera o valor do id para ver se já existe
        let proximoId = localStorage.getItem('id')
        //retornar a lógica para criar um novo id
        return parseInt(proximoId) + 1
    }

    gravar(d) {
        //Antes de gravar, recuperar o valor existente e executar o método
        let id = this.getProximoId()
        //Converter o item para Json
        localStorage.setItem(id, JSON.stringify(d))
        //Gravar o novo item com o novo id
        localStorage.setItem('id', id)
    }

    recuperarTodosRegistros() {
        //array de despesas
        let despesas = Array()

        let id = localStorage.getItem('id')
        //recuperar todas as despesas cadastradas em local storage
        for(let i = 1; i <= id; i++) {
            //recuperar a despesa
            let despesa = JSON.parse(localStorage.getItem(i))

            //existe a possibilidade de haver indices que foram pulados / removidos
            //nesses casos vamos pular os indices
            if(despesa == null) {
                //desconsidera e pula para o proximo ignorando o push
                continue
            }
            despesa.id = i
            despesas.push(despesa)
        }

        return despesas
    }

    pesquisar(despesa) {
        //recuperar todos os dados
        let despesasFiltradas = Array()
        despesasFiltradas = this.recuperarTodosRegistros()

        //ano
        if(despesa.ano != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano)
        }
        //mes
        if(despesa.mes != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes)
        }
        //dia
        if(despesa.dia != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia)
        }
        //tipo
        if(despesa.tipo != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo)
        }
        //descricao
        if(despesa.descricao != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao)
        }
        //valor
        if(despesa.valor != ''){
            despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor)
        }

        return despesasFiltradas
    }

    remover(id) {
        localStorage.removeItem(id)
    }

}

let bd = new Bd()

//Capturar do html os inputs
function cadastrarDespesa() {

    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    //atruir os valores dos inputs instanciando o objeto Despesa
    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    //Validacão
    if(despesa.validarDados()) {
        //Executar o método de gravação na instancia do objeto bd
        bd.gravar(despesa)    

        //cor do header
        let header = document.getElementById('headerRegistro')
        header.classList.add("text-success")

        //Conteudo do cabeçalho
        document.getElementById('tituloRegistro').innerHTML = 'Registrado com sucesso!'

        //Conteudo do corpo
        document.getElementById('corpoRegistro').innerHTML = 'Seus dados foram salvos.'

        //Botão cor
        let btn = document.getElementById('btnRegistro')
        btn.classList.add("btn-success")

        //Botao Conteudo
        btn.innerHTML = 'Finalizar'

        //dialog de sucesso
        $('#registraDespesa').modal('show')

        //reset
        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
            
    } else {
        //dialog de erro
        $('#registraDespesa').modal('show')
        
        //Cabeçalho cor
        let header = document.getElementById('headerRegistro')
        header.classList.add("text-danger")

        //Conteudo do cabeçalho
        document.getElementById('tituloRegistro').innerHTML = 'Erro no registro!'

        //Conteudo do corpo
        document.getElementById('corpoRegistro').innerHTML = 'Dados vazios ou incorretos.'

        //Botão cor
        let btn = document.getElementById('btnRegistro')
        btn.classList.add("btn-danger")

        //Botao Conteudo
        btn.innerHTML = 'Refazer'
            
    }

}

function carregaListaDespesas(despesas = Array(), filtro = false) {

    if(despesas.length == 0 && filtro == false){
        //array que contem os objetos
        despesas = bd.recuperarTodosRegistros()
    }

    //selecionando o elemento tbody da tabela
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
    //percorrer o array dispesas, listando cada dispesa de forma dinâmica
    despesas.forEach(function(d){

        //criando a linha(tr)
        let linha = listaDespesas.insertRow()

        //criar as colunas (td)
        linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
        
        //ajustar o tipo
        switch(d.tipo) {
            case '1': d.tipo = 'Alimentacao'
            break
            case '2': d.tipo = 'Educação'
            break
            case '3': d.tipo = 'Lazer'
            break
            case '4': d.tipo = 'Saúde'
            break
            case '5': d.tipo = 'Transporte'
            break
        }
        linha.insertCell(1).innerHTML = d.tipo
        linha.insertCell(2).innerHTML = d.descricao
        linha.insertCell(3).innerHTML = d.valor

        //criar o botão de exclusao
        let btn = document.createElement("button")
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.id = `id_despesa_${d.id}`
        btn.onclick = function() {
            //remover a despesa
            let id = this.id.replace('id_despesa_', '')
            bd.remover(id)

            window.location.reload()
        }
        linha.insertCell(4).append(btn)
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)

    carregaListaDespesas(despesas, true)
}