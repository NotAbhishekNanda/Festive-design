(() => {
  window.canvas = document.querySelector('canvas')
  window.ctx = canvas.getContext('2d')

  canvas.width = innerWidth
  canvas.height = innerHeight

  ctx.fillStyle = `rgba(0, 0, 0, 1)`
  ctx.fillRect(0, 0, innerWidth, innerHeight)
  
  class Stick {
    constructor(tilt) {
      this.thickness = 5
      this.tilt = tilt
      this.handleHeight = innerHeight * 0.3
      this.stickHeight = innerHeight * 0.6

      this.percent = 0
      this.delta = 0
      this.x = mouse.x
      this.y = mouse.y - this.handleHeight - this.stickHeight
    }

    draw() {
      ctx.save()

      ctx.translate(mouse.x, mouse.y)
      ctx.rotate(this.tilt)
      ctx.translate(-mouse.x, -mouse.y)

      // handle
      ctx.fillStyle = '#ddd'
      ctx.fillRect(
        mouse.x - this.thickness / 8,
        mouse.y - this.handleHeight,
        this.thickness / 4,
        this.handleHeight
      )

      // stick origin
      ctx.fillStyle = '#555'
      ctx.fillRect(
        mouse.x - this.thickness / 2,
        mouse.y - this.handleHeight - this.stickHeight,
        this.thickness,
        this.stickHeight
      )

      // stick used
      ctx.fillStyle = '#222'
      ctx.fillRect(
        mouse.x - this.thickness / 2,
        mouse.y - this.handleHeight - this.stickHeight,
        this.thickness,
        this.stickHeight * this.delta
      )

      ctx.restore()
    }

    animate() {
      this.percent += 0.004
      this.delta = Math.min(this.percent, 1) // 0 ~ 1

      this.x = mouse.x
      this.y = mouse.y - this.handleHeight - this.stickHeight * (1 - this.delta)
      
      this.draw()
    }
  }
  
  class Particle {
    constructor(x, y, velocity, size, color, dist, opacity, tilt) {
      this.x = x
      this.y = y
      this.velocity = velocity
      this.size = size
      this.color = color
      this.opacity = opacity
      this.friction = 0.98
      this.dist = dist
      this.tilt = tilt
    }
    draw() {
      ctx.save()
      ctx.translate(mouse.x, mouse.y)
      ctx.rotate(this.tilt)
      ctx.translate(-mouse.x, -mouse.y)
      ctx.fillStyle = this.color
      ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size)
      ctx.restore()
    }
    animate() {
      this.draw()

      this.velocity.x *= this.friction
      this.velocity.y *= this.friction

      this.x += this.velocity.x
      this.y += this.velocity.y

      this.opacity -= 0.06
    }
  }

  window.mouse = { x: 0, y: 0 }

  const PARTICLE_NUMS = 30
  const TILT = Math.PI / 180 * 25
  let timer = null
  let particles = []
  let stick = new Stick(TILT)

  function createParticles() {
    for (let i = 0; i < PARTICLE_NUMS; i++) {
      const dist = utils.randomIntBetween(10, 20)
      const x = stick.x
      const y = stick.y
      const theta = utils.randomIntBetween(0, 360)
      const opacity = utils.randomFloatBetween(0.1, 1, 2)
      const velocity = {
        x: Math.sin(theta) * dist,
        y: Math.cos(theta) * dist,
      }
      const size = utils.randomIntBetween(1, 3)
      const color = `hsl(${utils.randomIntBetween(1, 29)}, 100%, 90%)`
      particles.push(new Particle(x, y, velocity, size, color, dist, opacity, TILT))
    }
  }

  function init() {
    if (timer) clearInterval(timer)
    mouse.x = innerWidth * 0.3
    mouse.y = innerHeight * 1
    stick = new Stick(TILT)
    particles = []
    timer = setInterval(() => {
      if (stick.y === mouse.y - stick.handleHeight) {
        clearInterval(timer)
        timer = null
      }
      createParticles()
    }, 30)
  }

  const fps = 30
  const interval = 1000 / fps
  let now
  let then = Date.now()
  let delta

  function render() {
    requestAnimationFrame(render)

    now = Date.now()
    delta = now - then
    if (delta < interval) return

    ctx.fillStyle = `rgba(0, 0, 0, 0.5)`
    ctx.fillRect(0, 0, innerWidth, innerHeight)
    ctx.fillStyle = `rgba(255, 223, 100, ${particles.length * 0.0002})`
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    stick.animate()
    particles.forEach((particle, i) => {
      particle.animate()
      if (particle.opacity <= 0) particles.splice(i, 1)
    })

    then = now - (delta % interval)
  }

  window.addEventListener('pointerout', () => {
    mouse.x = innerWidth * 0.3
    mouse.y = innerHeight * 1
  })
  window.addEventListener('pointermove', e => {
    mouse.x = e.clientX
    mouse.y = e.clientY
  })

  window.addEventListener('resize', () => {
    canvas.width = innerWidth
    canvas.height = innerHeight

    init()
  })

  init()
  render()
})()

window.utils = {
  randomIntBetween: (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
  },
  randomFloatBetween: (min, max, decimals) => {
    const str = (Math.random() * (max - min) + min).toFixed(decimals)
    return parseFloat(str)
  }
}
