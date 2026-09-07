interface ConfettiParticle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  vRot: number
  alpha: number
  shape: 'rect' | 'circle' | 'star'
}

const COLORS = [
  '#FFD700', // Gold
  '#FF6B6B', // Red
  '#4ECDC4', // Mint
  '#45B7D1', // Sky Blue
  '#96CEB4', // Sage
  '#FFEEAD', // Cream
  '#D4A5A5', // Dusty Rose
  '#9B59B6', // Purple
  '#3498DB', // Blue
  '#2ECC71', // Emerald
]

export function launchConfetti(count = 70, originX = 0.5, originY = 0.35) {
  if (typeof window === 'undefined') return

  const canvas = document.createElement('canvas')
  canvas.style.position = 'fixed'
  canvas.style.top = '0'
  canvas.style.left = '0'
  canvas.style.width = '100vw'
  canvas.style.height = '100vh'
  canvas.style.pointerEvents = 'none'
  canvas.style.zIndex = '9999'
  document.body.appendChild(canvas)

  const ctx = canvas.getContext('2d')
  if (!ctx) {
    canvas.remove()
    return
  }

  const width = (canvas.width = window.innerWidth)
  const height = (canvas.height = window.innerHeight)

  const startX = width * originX
  const startY = height * originY

  const particles: ConfettiParticle[] = Array.from({ length: count }, () => {
    const angle = Math.random() * Math.PI * 2
    const speed = Math.random() * 12 + 6
    const shapes: ('rect' | 'circle' | 'star')[] = ['rect', 'circle', 'star']
    return {
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 5,
      size: Math.random() * 9 + 6,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      rotation: Math.random() * 360,
      vRot: (Math.random() - 0.5) * 15,
      alpha: 1,
      shape: shapes[Math.floor(Math.random() * shapes.length)],
    }
  })

  let animationFrameId: number

  function drawStar(c: CanvasRenderingContext2D, r: number) {
    c.beginPath()
    for (let i = 0; i < 5; i++) {
      c.lineTo(Math.cos(((18 + i * 72) * Math.PI) / 180) * r, -Math.sin(((18 + i * 72) * Math.PI) / 180) * r)
      c.lineTo(Math.cos(((54 + i * 72) * Math.PI) / 180) * (r / 2), -Math.sin(((54 + i * 72) * Math.PI) / 180) * (r / 2))
    }
    c.closePath()
    c.fill()
  }

  function render() {
    if (!ctx) return
    ctx.clearRect(0, 0, width, height)

    let alive = false

    for (const p of particles) {
      p.x += p.vx
      p.y += p.vy
      p.vy += 0.35 // Gravity
      p.vx *= 0.98 // Air resistance
      p.rotation += p.vRot
      p.alpha -= 0.008

      if (p.alpha > 0 && p.y < height + 50) {
        alive = true
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate((p.rotation * Math.PI) / 180)
        ctx.globalAlpha = Math.max(0, p.alpha)
        ctx.fillStyle = p.color

        if (p.shape === 'rect') {
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        } else if (p.shape === 'circle') {
          ctx.beginPath()
          ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else {
          drawStar(ctx, p.size / 2)
        }

        ctx.restore()
      }
    }

    if (alive) {
      animationFrameId = requestAnimationFrame(render)
    } else {
      cancelAnimationFrame(animationFrameId)
      canvas.remove()
    }
  }

  animationFrameId = requestAnimationFrame(render)
}
