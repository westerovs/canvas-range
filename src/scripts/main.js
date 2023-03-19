const canvas = document.createElement('canvas')
canvas.id = 'canvas'
canvas.width = window.innerWidth / 2
canvas.height = window.innerHeight / 2
document.body.prepend(canvas)

export default class Range {
  constructor(canvas) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d', {willReadFrequently: true})
    
    this.mouseX = null
    // this.mouseY = null
    this.offsetX = null
    this.offsetY = null
    this.isDown = false
    
    this.range = null
    
    this.init()
  }
  
  init = () => {
    this.range = this.makeRangeControl(50, 40, 200, 25)
    this.drawRangeControl()
    this.reOffset()
    
    this.initHandlers()
  }
  
  initHandlers = () => {
    window.addEventListener('scroll', () => this.reOffset())
    window.addEventListener('resize', () => this.reOffset())
  
    canvas.addEventListener('pointerdown', (e) => this.handlePointerDown(e))
    canvas.addEventListener('pointermove', (e) => this.handlePointerMove(e))
    canvas.addEventListener('pointerup', (e) => this.handlePointerUp(e))
    canvas.addEventListener('pointerout', (e) => this.handlePointerUp(e))
  }
  
  makeRangeControl = (x, y, width, height) => {
    const range = {x, y, width, height}
    range.x1 = range.x + range.width
    range.y1 = range.y
    range.pct = 0.50
    
    return range
  }
  
  drawRangeControl = () => {
    // bar
    this.ctx.lineWidth = 6
    this.ctx.lineCap = 'round'
    this.ctx.beginPath()
    this.ctx.moveTo(this.range.x, this.range.y)
    this.ctx.lineTo(this.range.x1, this.range.y)
    this.ctx.strokeStyle = 'blue'
    this.ctx.stroke()
    
    // thumb
    this.ctx.beginPath()
    const thumbX = this.range.x + this.range.width * this.range.pct
    this.ctx.moveTo(thumbX, this.range.y - this.range.height / 2)
    this.ctx.lineTo(thumbX, this.range.y + this.range.height / 2)
    this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)'
    this.ctx.stroke()
    
    // legend
    this.ctx.fillStyle = 'blue'
    this.ctx.textAlign = 'center'
    this.ctx.textBaseline = 'top'
    this.ctx.font = '10px arial'
    
    this.ctx.fillText(
      `${Math.trunc(this.range.pct * 100)}%`,
      this.range.x + this.range.width / 2,
      (this.range.y - this.range.height / 2) - 15,
    )
  }
  
  reOffset = () => {
    const BB = this.canvas.getBoundingClientRect()
    this.offsetX = BB.left
    this.offsetY = BB.top
  }

  handlePointerDown = (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    let pointerX = e.clientX - this.offsetX
    let pointerY = e.clientY - this.offsetY
    
    this.isDown = (
      pointerX > this.range.x
      && pointerX < this.range.x + this.range.width
      && pointerY > this.range.y - this.range.height / 2
      && pointerY < this.range.y + this.range.height / 2
    )
  }
  
  handlePointerMove = (e) => {
    if (!this.isDown) return
    e.preventDefault()
    e.stopPropagation()
    
    // get mouse position
    this.mouseX = e.clientX - this.offsetX
    console.log(this.mouseX)
    // this.mouseY = parseInt(e.clientY - this.offsetY)
    
    this.range.pct = Math.max(0, Math.min(1, (this.mouseX - this.range.x) / this.range.width))
    console.log(this.range.pct)
    
    this.ctx.clearRect(
      this.range.x - 12.5,
      this.range.y - this.range.height / 2 - 15,
      this.range.width + 25,
      this.range.height + 20,
    )
    this.drawRangeControl(this.range)
  }
  
  handlePointerUp = (e) => {
    e.preventDefault()
    e.stopPropagation()
    this.isDown = false
  }
}

// todo add x,y position, and x,y offset parent
new Range(canvas)























