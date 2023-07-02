const cidade = document.querySelector('#city')
const temperatura = document.querySelector("#temp")
const descricao = document.querySelectorAll('.descricao')
const umidade = document.querySelectorAll('.umidade')
const visibilidade = document.querySelectorAll('.visibilidade')
const velocidade = document.querySelectorAll('.velocidade')
const imgClima = document.querySelectorAll('.img-clima')
const main = document.querySelector('main')
const horaAtual = document.querySelector('#hora')
const data = document.querySelector('#data')
const botao = document.querySelector('#btn-search')
const input = document.querySelector('input')
const btnDetalhes = document.querySelector('#btn-details')
const detalhesMobile = document.querySelector('#details-mobile')
const favicon = document.querySelector('#favicon')

if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(obterCoordenadas, mostrarErro)
} else {
    alert('Geolocalização não suportada pelo navegador')
}

function obterCoordenadas(posicao) {
    const latitude = posicao.coords.latitude
    const longitude = posicao.coords.longitude

    buscarDadosClimaPorCoordenadas(latitude, longitude)
}

function mostrarErro(erro) {
    console.log('Erro ao obter localização:', erro.message)
}

function buscarDadosClimaPorCoordenadas(latitude, longitude) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=9e26793ea14ebe5dfab971c2c9fbee40&units=metric&lang=pt_br`)
        .then(response => response.json())
        .then(data => {
            atualizarDadosClima(data)
            buscarImagem(data.weather[0].description)
        })
        .catch(error => {
            console.log(error)
            tratarErroRequisicao()
        })
}

function atualizarDadosClima(data) {
    cidade.innerHTML = data.name
    if (data.name === undefined) {
        cidade.innerHTML = ''
        temperatura.innerHTML = ``
        descricao.forEach((descricao_data) => descricao_data.innerHTML = '')
        umidade.forEach((umidade_data) => umidade_data.innerHTML = ``)
        visibilidade.forEach((visibilidade_data) => visibilidade_data.innerHTML = ``)
        velocidade.forEach((velocidade_data) => velocidade_data.innerHTML = ``)
    }

    temperatura.innerHTML = `${Math.ceil(data.main.temp)}°C`
    descricao.forEach((descricao_data) => descricao_data.innerHTML = data.weather[0].description)
    umidade.forEach((umidade_data) => umidade_data.innerHTML = `${data.main.humidity}%`)
    visibilidade.forEach((visibilidade_data) => visibilidade_data.innerHTML = `${Math.ceil(data.visibility / 1000)} km`)
    velocidade.forEach((velocidade_data) => velocidade_data.innerHTML = `${Math.ceil(data.wind.speed * 3.6)} km/h`)

    imgClima.forEach(img => {
        img.setAttribute('src', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
    })

    favicon.setAttribute('href', `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
}

function buscarImagem(descricao) {
    fetch(`https://api.unsplash.com/search/photos/?client_id=mUJNVegN2qt68aULEWZuY97Y2_G-87a9-Ec8VP0Zjn4&query=${descricao}&page=2`)
        .then(response => response.json())
        .then(data => {
            let indiceAleatorio = Math.round(Math.random() * 9)
            main.style.backgroundImage = `url(${data.results[indiceAleatorio].urls.regular})`
        })
        .catch(error => {
            console.log(error)
        })
}

function atualizarRelogio() {
    const data = new Date()
    let hora = data.getHours()
    let minutos = data.getMinutes()
    let segundos = data.getSeconds()

    hora = formatarValorTempo(hora)
    minutos = formatarValorTempo(minutos)
    segundos = formatarValorTempo(segundos)

    horaAtual.innerHTML = `${hora}:${minutos}:${segundos}`
}

function formatarValorTempo(valor) {
    return valor < 10 ? `0${valor}` : valor
}

setInterval(atualizarRelogio, 1000)

const dataHoraAtual = new Date()
const opcoesFormato = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
}
const formatoDataHora = new Intl.DateTimeFormat('pt-BR', opcoesFormato)
const dataHoraFormatada = formatoDataHora.format(dataHoraAtual)
data.innerHTML = dataHoraFormatada

botao.addEventListener('click', (e) => {
    e.preventDefault()
    const valorinput = input.value.toLowerCase().trim()
    if (valorinput === '') {
        e.stopImmediatePropagationn()
    }

    buscarDadosClimaPorCidade(valorinput)
})

function buscarDadosClimaPorCidade(cidade) {
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cidade}&appid=9e26793ea14ebe5dfab971c2c9fbee40&units=metric&lang=pt_br`)
        .then(response => response.json())
        .then(data => {
            atualizarDadosClima(data)
            buscarImagem(data.weather[0].description)
        })
        .catch(error => {
            console.log(error)
            tratarErroRequisicao()
        })
}

function tratarErroRequisicao() {
    Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Cidade não encontrada!',
    })
}

btnDetalhes.addEventListener('click', () => {
    detalhesMobile.classList.toggle('right-0')
    detalhesMobile.classList.toggle('-right-[400px]')
})
