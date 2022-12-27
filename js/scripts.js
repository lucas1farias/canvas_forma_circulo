

const canvas = document.querySelector('canvas')
const cv = canvas.getContext('2d')
canvas.width = 1200
canvas.height = 600
canvas.style.border = 'purple solid 3px'
canvas.style.backgroundImage = 'radial-gradient(#444, #222, black)'
document.body.style.backgroundImage = 'linear-gradient(aqua, purple)'

// Dimensões e tamanhos de borda variáveis p/ os círculos criados em "init" 
const sizes = [7, 10, 13, 16, 19, 22, 25, 28, 31, 34, 37, 40, 43, 46, 49, 52]
const borders = [1, 2, 3]

// Receptora dos objetos (qtd. aleatórias definidas em "init") que são exibidos em "animate"
let circles = []

// Criada, mas não usada
function isEven(n) {
  return n % 2 == 0
}

// Capturar um índice de alguma var referência, que servirão de atrib. p/ os objetos de cada círculo
function randomIndex({fromArray}) {
  const index = Math.floor(Math.random() * fromArray.length)
  return index
}

// Define onde o círculo começa em [x] e [y] inicialmente (ele se desloca por causa de "Circle/update")
function locationCanvas({measure, targetSize = 0}) {
  let tutorial = {
    'objetivo': 'Criar 2 arrays com ranges diferentes: largura, altura',
    'obs_eixo_x': 'Quando se fala do eixo horizontal (x), quanto mais a <- menor o valor, e a ->, maior o valor',
    'obs_eixo_y': 'Quando se fala do eixo vertical (y), quanto mais acima, menor o valor, e quanto mais abaixo, maior o valor',
    'targetSize_if': 'seu valor na atribuição em "i" determina o limite da posição [x] do círculo p/ a <-',
    'targetSize_if': 'seu valor na subtração com "canvas" determina o limite da posição [x] do círculo p/ a ->',
    'targetSize_if_else': 'seu valor na atribuição em "i" determina o limite da posição [y] do círculo p/ cima',
    'targetSize_if_else': 'seu valor na subtração com "canvas" determina o limite da posição [y] do círculo p/ baixo',
  }
  
  let canvasWidth = []
  let canvasHeight = []

  if (measure == 'width') {
    for (let i = targetSize; i < canvas.width - targetSize; i++) {
      canvasWidth.push(i)
    }
    // a_e
    return canvasWidth[randomIndex({fromArray: canvasWidth})]
  } else if (measure == 'height') {
    for (let i2 = targetSize; i2 < canvas.height - targetSize; i2++) {
      canvasHeight.push(i2)
    }
    // a_e
    return canvasHeight[randomIndex({fromArray: canvasHeight})]
  }
}

// Define a cor aleatória de preenchimento e borda de cada círculo em "Circle/draw" 
function rgb() {
  let inks = [...Array(256).keys()]
  
  // a_e
  let indexForRed = randomIndex({fromArray: inks})
  let indexForGreen = randomIndex({fromArray: inks})
  let indexForBlue = randomIndex({fromArray: inks})
  
  // EX: 'rgba(0, 100, 255)', que é passado na função "draw" da classe "Circle"
  return `rgba(${inks[indexForRed]},${inks[indexForGreen]},${inks[indexForBlue]})`
}

// Velocidade de deslocamento de cada círculo p/ uso em "init"
function speedRate() {
  return Math.random() * (0.99 - 0.05)
}

// Definir a qtd. máxima de círculos a serem criados p/ uso em "init"
function circleAmount({ amountMax }) {
  // [0...amount], mas o zero não é desejado, pois deve haver alguma círculo
  // "splice" é usado p/ remover o índice 0
  let amounts = [...Array(amountMax + 1).keys()]
  amounts.splice(0, 1)
  
  let indexChosen = randomIndex({fromArray: amounts})
  
  // Teste da função
  console.log(`Variável || ${amounts}`)
  console.log(`Índice   || amounts[${indexChosen}]`)
  
  return amounts[indexChosen]
}

// Cria os objetos de círculo, os movimenta e controla p/ não sair do canvas
class Circle {
  constructor({ x, y, forwardSpeed, backwardsSpeed, sphereRadius = 30, borderThickness=3 }) {
    this.x = x
    this.y = y
    this.forwardSpeed = forwardSpeed
    this.backwardsSpeed = backwardsSpeed
    this.sphereRadius = sphereRadius
    this.borderThickness = borderThickness
  }
  
  // Desenho do círculo usando as vars de contexto
  draw() {
    let tutorial = {
      '__beginPath': 'inicia a criação de alguma forma',
      '__lineWidth': 'define a expressura da borda da forma', 
      '__fillStyle': 'define a cor interna da forma (preenchimento)', 
      'strokeStyle': 'define a cor da borda da forma', 
      '________arc': 'Criação de círculo (h, v, tamanho w & h, se > 0 gera esfera incompleta, não mudar, não mudar)', 
      '_____stroke': 'validação de [strokeStyle]', 
      '_______fill': 'Validação de [fillStyle]'
    }

    cv.beginPath()
    cv.lineWidth = this.borderThickness 
    // cv.fillStyle = rgb()           
    cv.strokeStyle = rgb()         
    cv.arc(this.x, this.y, this.sphereRadius, 0, Math.PI * 2, false)
    cv.stroke()                 
    // cv.fill() 
    
    // Aplicar cor na esfera a cada 5 segundos
    let seconds = new Date().getSeconds()
    let secondIsDivisibleBy5 = seconds % 5 === 0
    if (secondIsDivisibleBy5) {
      cv.fillStyle = rgb()
      cv.fill()
    }
  }
  
  // Controla cada posição [x] e [y] de cada círculo p/ não os deixar sair do canvas + movimentação
  update() {
    // [forma] enquanto sua posição x + sua dimensão for menor que a largura do canvas, contínua se movendo a -> 
    if (
      this.x + this.sphereRadius + this.borderThickness >= canvas.width ||
      this.x < this.sphereRadius
    ) {
      // Impedir saída da forma a ->
      this.forwardSpeed = -this.forwardSpeed
    }
    
    // [forma] enquanto sua posição y + sua dimensão for menor que a altura do canvas, contínua se movendo para cima
    if (
      this.y + this.sphereRadius + this.borderThickness >= canvas.height ||
      this.y < this.sphereRadius
    ) {
      // Impedir saída da forma por cima
      this.backwardsSpeed = -this.backwardsSpeed
    }
    
    // Como os círculos se movimentam (valores definidos na função "speedRate")
    this.x += this.forwardSpeed
    this.y -= this.backwardsSpeed
  }
}

// Define o raio/tamanho de cada círculo usando um dos arrays no topo do script p/ uso em "init"
function setCircleSize({sourceArray}) {
  return sourceArray[randomIndex({fromArray: sourceArray})]
}

// Define a largura das bordas de cada círculo usando um dos arrays no topo do script p/ uso em "init"
function setCircleBorderThickness({sourceArray}) {
  return sourceArray[randomIndex({fromArray: sourceArray})]
}

// Onde os objetos de círculos são definidos em qtd. e criados (anexados à "circles")
function init() {

  let thisValueDoesNotReach = 0

  let circlesToBeCreated = circleAmount({ amountMax: 70 })

  do {
    let sphereSize = setCircleSize({sourceArray: sizes})
    let sphereBorderThickness = setCircleBorderThickness({sourceArray: borders})
    
    let new_sphere = new Circle({
      x: locationCanvas({measure: 'width', targetSize: (sphereSize + sphereBorderThickness)}),
      y: locationCanvas({measure: 'height', targetSize: (sphereSize + sphereBorderThickness)}),
      forwardSpeed: speedRate(),
      backwardsSpeed: speedRate(),
      sphereRadius: sphereSize,
      borderThickness: sphereBorderThickness
    })
    
    circles.push(new_sphere)
    thisValueDoesNotReach++

  } while (thisValueDoesNotReach < circlesToBeCreated)
}

// Onde cada objeto de círculo é desenhado
function animate() {
  requestAnimationFrame(animate)
  
  cv.clearRect(0, 0, canvas.width, canvas.height)
  
  circles.forEach(circle => {
    circle.draw()
    circle.update()
  })
}

init()
animate()

// Mudar a cor de fundo do canvas ou retornar à cor de fundo original
addEventListener('keydown', event => {
  switch (event.key) {
    case 'q':
      canvas.style.backgroundColor = `${rgb()}`
      break
    case '#':
      canvas.style.backgroundColor = 'black'
  }
})
