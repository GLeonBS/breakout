import './style.scss'

const canvas = document.createElement('canvas')
const context = canvas.getContext('2d')

const raioDaBola = 10
const alturaDaRaquete = 10
const larguraDaRaquete = 75
const contagemDeBlocosEmLinha = 6
const contagemDeBlocosEmColuna = 3
const larguraDoBloco = 75
const alturaDoBloco = 20
const enchimentoDoBloco = 10
const parteSuperiorDoBloco = 60
const lateralEsquerdaDoBloco = 10

canvas.width =
  (larguraDoBloco + enchimentoDoBloco) * contagemDeBlocosEmLinha +
  lateralEsquerdaDoBloco
canvas.height = 400

let raqueteX = canvas.width - larguraDaRaquete
let direitaPressionada = false
let esquerdaPressionada = false

let x = canvas.width / 2
let y = canvas.height - 30
let nivel
let vidas = 3
if (localStorage.getItem('nivel') === null || localStorage.getItem('nivel') === '1') {
  nivel = 1
  localStorage.setItem('nivel', nivel.toString())
  localStorage.setItem('vidas', '3')
} else {
  nivel = parseInt(localStorage.getItem('nivel'))
  vidas = parseInt(localStorage.getItem('vidas'))
}
let dx = nivel
let dy = -nivel


let pontos = 0


const blocos: Bloco[][] = []

for (let c = 0; c < contagemDeBlocosEmColuna; c++) {
  blocos[c] = []
  for (let l = 0; l < contagemDeBlocosEmLinha; l++) {
    blocos[c][l] = { x: 0, y: 0, estado: 1 }
  }
}

document.onkeydown = (e) => {
  if (e.code === 'ArrowRight') {
    direitaPressionada = true
  } else if (e.code === 'ArrowLeft') {
    esquerdaPressionada = true
  }
}
document.onkeyup = (e) => {
  if (e.code === 'ArrowRight') {
    direitaPressionada = false
  } else if (e.code === 'ArrowLeft') {
    esquerdaPressionada = false
  }
}
document.onmousemove = (e) => {
  const relativoX = e.clientX - canvas.offsetLeft
  if (relativoX > 0 && relativoX < canvas.width) {
    raqueteX = relativoX - larguraDaRaquete / 2
  }
}

function detectaColisao() {
  for (let c = 0; c < contagemDeBlocosEmColuna; c++) {
    for (let l = 0; l < contagemDeBlocosEmLinha; l++) {
      const bloco = blocos[c][l]

      if (bloco.estado === 1) {
        if (
          x > bloco.x &&
          x < bloco.x + larguraDoBloco &&
          y > bloco.y &&
          y < bloco.y + alturaDoBloco + alturaDoBloco / 2
        ) {
          dy = -dy
          bloco.estado = 0
          pontos++

          if (pontos == contagemDeBlocosEmLinha * contagemDeBlocosEmColuna) {
            alert('Você passou para o próximo nível, parabéns!')
            nivel++
            localStorage.setItem('nivel', nivel.toString())
            document.location.reload()
          }
        }
      }
    }
  }
}

function desenhaBola() {
  context.beginPath()
  context.arc(x, y, raioDaBola, 0, Math.PI * 2)
  context.fillStyle = 'yellow'
  context.fill()
  context.closePath()
}

function desenhaRaquete() {
  context.beginPath()
  context.rect(
    raqueteX,
    canvas.height - alturaDaRaquete,
    larguraDaRaquete,
    alturaDaRaquete
  )
  context.fillStyle = '#fff'
  context.fill()
  context.closePath()
}

function desenhaPontos() {
  context.font = '24px Arial'
  context.fillStyle = 'white'
  context.fillText(`Pontos: ${pontos}`, 8, 30)
}

function desenhaVidas() {
  context.font = '24px Arial'
  context.fillStyle = 'lime'
  context.fillText(`Vidas: ${vidas}`, canvas.width - 100, 30)
}

function desenhaBlocos() {
  for (let c = 0; c < contagemDeBlocosEmColuna; c++) {
    for (let r = 0; r < contagemDeBlocosEmLinha; r++) {
      if (blocos[c][r].estado == 1) {
        const blocoX =
          r * (larguraDoBloco + enchimentoDoBloco) + lateralEsquerdaDoBloco

        const blocoY =
          c * (alturaDoBloco + enchimentoDoBloco) + parteSuperiorDoBloco

        blocos[c][r].x = blocoX
        blocos[c][r].y = blocoY

        context.beginPath()
        context.rect(blocoX, blocoY, larguraDoBloco, alturaDoBloco)
        context.fillStyle = 'deeppink'
        context.fill()
        context.closePath()
      }
    }
  }
}

function desenha() {
  context.clearRect(0, 0, canvas.width, canvas.height)
  desenhaBlocos()
  desenhaBola()
  desenhaRaquete()
  desenhaPontos()
  desenhaVidas()
  detectaColisao()

  if (x + dx > canvas.width - raioDaBola || x + dx < raioDaBola) {
    dx = -dx
  }
  if (y + dy < raioDaBola) {
    dy = -dy
  } else if (y + dy > canvas.height - alturaDaRaquete - raioDaBola) {
    if (x > raqueteX && x < raqueteX + larguraDaRaquete) {
      dy = -dy
    } else {
      vidas--
      localStorage.setItem('vidas', vidas.toString())
      if (!vidas) {
        alert('Fim de jogo')
        localStorage.setItem('nivel', '1')
        localStorage.setItem('vidas', '3')
        document.location.reload()
      } else {
        x = canvas.width / 2
        y = canvas.height - 30
        dx = 2
        dy = -2
        raqueteX = (canvas.width - larguraDaRaquete) / 2
        dx = parseInt(localStorage.getItem('nivel'))
        dy = parseInt(localStorage.getItem('nivel'))
      }
    }
  }

  if (direitaPressionada && raqueteX < canvas.width - larguraDaRaquete) {
    raqueteX += 7
  } else if (esquerdaPressionada && raqueteX > 0) {
    raqueteX -= 7
  }

  x += dx
  y += dy
  requestAnimationFrame(desenha)
}

document.body.appendChild(canvas)

desenha()
