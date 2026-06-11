class Jugador {
    //Las propiedades privadas solo puede la misma clase usarlas.
    #nombre
    #puntaje
    #respuestasCorrectas

    constructor(nombre) {
        this.nombre = nombre
        this.#puntaje = 0
        this.#respuestasCorrectas = 0
    }

    //set es un metodo que nos permite asignar un valor a nuestra propiedad seguridad a la hora de
    // modificarle el valor de la propiedad (practicamente las validaciones)
    //excalidraw.com
    set nombre(value) {
        this.#nombre = value
    }

    //get me devuelve el valor de la propiedad  
    get nombre() {
        return this.#nombre
    }

    get puntaje() {
        return `Tienes ${this.#puntaje} puntos  `
    }

    set respuestasCorrectas(value) {
        this.#respuestasCorrectas = value
    }

    get respuestasCorrectas() {
        return this.#respuestasCorrectas
    }

    //Propiedades vituales (no existen en las llaves privadas) - objetos.puntos 
    get puntos() {
        return this.#puntaje
    }
    sumarPuntos(puntos) {
        this.#puntaje = this.#puntaje + puntos
    }

    aumentarCorrectas() {
        this.respuestasCorrectas = this.respuestasCorrectas + 1
    }
    //SOLID investigar
    reiniciar() {
        this.nombre = ''
        this.#puntaje = 0
        this.respuestasCorrectas = 0

    }
}

//Molde para crear preguntas
class Pregunta {
    #texto
    #opciones
    #respuestaCorrecta
    #puntos

    constructor(texto, opciones, respuestaCorrecta, puntos) {
        this.texto = texto
        this.opciones = opciones
        this.#respuestaCorrecta = respuestaCorrecta
        this.puntos = puntos
    }

    set texto(value) {
        this.#texto = value
    }

    get texto() {
        return this.#texto
    }

    set opciones(value) {
        if (Array.isArray(value)) {
            this.#opciones = value

        } else {
            //lanza el error 
            throw new Error('No se acaeptan valores distintos a un array')
        }
    }

    get opciones() {
        return this.#opciones
    }

    set puntos(value) {
        this.#puntos = value
    }

    get puntos() {
        return this.#puntos
    }

    validarRespuesta(respuesta) {
        return respuesta == this.#respuestaCorrecta
    }
}

class Quiz {
    #preguntas
    #preguntaActual
    #jugador
    #indice

    constructor(preguntas, jugador) {
        this.preguntas = preguntas
        this.jugador = jugador
        this.#indice = 0
    }

    set preguntas(value) {
        this.#preguntas = value
    }

    get preguntas() {
        return this.#preguntas
    }

    set jugador(value) {
        this.#jugador = value
    }

    get jugador() {
        return this.#jugador
    }
    set preguntaActual(value) {
        this.#preguntaActual = value
    }

    get preguntaActual() {
        return this.#preguntaActual
    }

    iniciar() {
        this.#indice = 0
        this.preguntaActual = this.preguntas[this.#indice]

    }

    mostrarPregunta() {
        return this.preguntaActual
    }

    siguientePregunta() {
        this.#indice++
        this.preguntaActual = this.preguntas[this.#indice]

    }

    estadoPregunta() {
        return `Pregunta ${this.#indice + 1} de ${this.#preguntas.length}`
    }

    estadoPreguntaPorcentaje() {
        let porcentaje = 100 / this.#preguntas.length
        return (this.#indice + 1) * porcentaje
    }

    responder(respuesta) {
        //capturar la respuesta del usuario
        let res = this.preguntaActual.validarRespuesta(respuesta)
        if (res) {
            this.jugador.aumentarCorrectas()
            this.jugador.sumarPuntos(this.preguntaActual.puntos)
        }
    }

    finalizarQuiz() {
        return { nombre: this.jugador.nombre, puntaje: this.jugador.puntos, correctas: this.jugador.respuestasCorrectas }
    }

}

let formInicio = document.querySelector('#form-iniciar')
let pantalla1 = document.querySelector('#pantalla-inicio')
let pantalla2 = document.querySelector('#pantalla-quiz')
let estadoJugador = document.querySelector('#estado-jugador')
let puntajeJugador = document.querySelector('#estado-puntaje')
let correctasJugador = document.querySelector('#estado-correctas')
let preguntaVisual = document.querySelector('#texto-pregunta')
let respuestasVisual = document.querySelector('#opciones-respuesta')
let feedbackRespuesta = document.querySelector('#feedback-respuesta')
let btnSiguiente = document.querySelector('#btn-siguiente')
let btnFinalizado = document.querySelector('#btn-finalizado')
let estadoPregunta = document.querySelector('#estado-pregunta')
let barraProgreso = document.querySelector('#barra-progreso')
let pantallaFinal = document.querySelector('#pantalla-final')
let resultadoJugador = document.querySelector('#resultado-jugador')
let resultadoPuntaje = document.querySelector('#resultado-puntaje')
let resultadoCorrectas = document.querySelector('#resultado-correctas')
let btnReiniciar = document.querySelector('#btn-reiniciar')

const pregunta1 = new Pregunta('¿Cual es mi edad?', ['10', '20', '30', '40', '50'], '30', 10)
const pregunta2 = new Pregunta('¿Cual es mi sueño?', ['10', '20', '30', '40', '50'], '20', 10)
const pregunta3 = new Pregunta('¿Cual es mi mercado?', ['10', '20', '30', '40', '50'], '50', 10)
const pregunta4 = new Pregunta('¿Cual es mi efjdk?', ['10', '20', '30', '40', '50'], '10', 10)
const pregunta5 = new Pregunta('¿Cual es mi comida favorita?', ['10', '20', '30', '40', '50'], '40', 10)

let QuizOne
const ArregloPreguntas = [pregunta1, pregunta2, pregunta3, pregunta4, pregunta5]


formInicio.addEventListener('submit', () => {
    event.preventDefault()
    let playerOne = new Jugador(event.target['nombre-jugador'].value)
    QuizOne = new Quiz(ArregloPreguntas, playerOne)
    QuizOne.iniciar()
    formInicio.reset()

    pantalla1.classList.add('d-none')
    pantalla2.classList.remove('d-none')

    rederizar(playerOne)

})

respuestasVisual.addEventListener('click', (event) => {
    // Verificamos que el clic se haya realizado sobre un botón de respuesta.
    // Los botones tienen la propiedad 'disabled', mientras que el contenedor no.
    // Si se hace clic en el contenedor vacío, la condición será falsa.
    //// Evita ejecutar la lógica cuando se hace clic en el contenedor.
    // Solo los botones de respuesta poseen la propiedad 'disabled'.

    if (event.target.disabled != undefined) {
        event.target.classList.add('active')
        let esCorrecta = QuizOne.preguntaActual.validarRespuesta(event.target.textContent)

        feedbackRespuesta.textContent = `Su respuesta es ${esCorrecta ? 'correcta' : 'incorrecta'}`
        if (!esCorrecta) {
            feedbackRespuesta.classList.remove('alert-success')
            feedbackRespuesta.classList.add('alert-danger')
        }

        feedbackRespuesta.classList.remove('d-none')

        let botonesRespuesta = respuestasVisual.childNodes
        botonesRespuesta.forEach(btn => btn.disabled = true)

        QuizOne.responder(event.target.textContent)
        btnSiguiente.disabled = false

        if (!btnFinalizado.classList.contains('d-none')) {
            btnFinalizado.disabled = false;
        }
    }
})

const rederizar = (playerOne) => {
    estadoPregunta.textContent = QuizOne.estadoPregunta()
    barraProgreso.style = `width: ${QuizOne.estadoPreguntaPorcentaje()}%`
    feedbackRespuesta.classList.add('d-none')
    feedbackRespuesta.classList.add('alert-success')
    feedbackRespuesta.classList.remove('alert-danger')

    estadoJugador.textContent = `Jugador: ${playerOne.nombre}`
    puntajeJugador.textContent = playerOne.puntaje
    correctasJugador.textContent = `Correctas : ${playerOne.respuestasCorrectas}`
    preguntaVisual.textContent = QuizOne.preguntaActual.texto
    respuestasVisual.innerHTML = ''

    QuizOne.preguntaActual.opciones.forEach(item => {
        let btnRespuesta = document.createElement('button')
        btnRespuesta.className = 'btn btn-outline-primary text-start py-3'
        btnRespuesta.textContent = item
        respuestasVisual.append(btnRespuesta)
    })

    if (QuizOne.estadoPreguntaPorcentaje() == 100) {
        btnFinalizado.classList.remove('d-none')
        btnSiguiente.classList.add('d-none')
    }
    btnSiguiente.disabled = true
}

btnSiguiente.addEventListener('click', (event) => {
    QuizOne.siguientePregunta()
    rederizar(QuizOne.jugador)
})

btnFinalizado.addEventListener('click', (event) => {
    pantalla2.classList.add('d-none')
    pantallaFinal.classList.remove('d-none')

    let fin = QuizOne.finalizarQuiz()

    resultadoJugador.textContent = fin.nombre
    resultadoCorrectas.textContent = fin.correctas
    resultadoPuntaje.textContent = fin.puntaje
    btnFinalizado.classList.add('d-none')
    btnSiguiente.classList.remove('d-none')
})

btnReiniciar.addEventListener('click', (event) => {
    QuizOne.jugador.reiniciar()
    pantallaFinal.classList.add('d-none')
    pantalla1.classList.remove('d-none')
})



