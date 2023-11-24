const ColorCanvasContainer = $(".canvas-app")

export default new class {
    constructor(){
        this.hues = []
        this.requested = false
        this.W = this.H = 400
        this.canvas = $("<canvas />").prop({width: this.W, height: this.H})
        ColorCanvasContainer.append(this.canvas)
        /** @type {CanvasRenderingContext2D} */
        this.ctx = this.canvas.get(0).getContext("2d")
        requestAnimationFrame(this.draw.bind(this))
    }
    draw(){
        const {ctx, W, H} = this
        const D = H/2-2
        const STEP = 0.1
        const DIFFUSE = 5
        ctx.clearRect(0,0,W,H)

        for(let i = 0; i < 360; i+=STEP){
            let trigoP = (2*Math.PI*i/360),
                trigoX = Math.cos(trigoP),
                trigoY = Math.sin(trigoP),
                x = W/2 + trigoX * D,
                y = H/2 + trigoY * D,
                ox = W/2 + trigoX * 10,
                oy = H/2 + trigoY * 10,
                c = chroma.hsl(i, 1, 0.2)

            for(let hs of this.hues){
                let h = ((parseFloat(hs) + 180) % 360),
                    hi = ((i + 180) % 360) ,
                    d = (1 - Math.abs(h - hi) / DIFFUSE) / 2

                d = Math.max(0, Math.min(1, d))
                if(d > 0.2){
                    c = c.set("hsl.l",d)
                    break;
                }
            }
            ctx.strokeStyle = c.css()        
            ctx.beginPath()
            ctx.moveTo(ox,oy)
            ctx.lineTo(x,y)
            ctx.stroke()
        }
        this.requested = false
    }
    trigger(){
        this.draw()
        requestAnimationFrame(this.trigger.bind(this))
    }
    addColor(color){
        let hue = (chroma(color).get("hsl.h") || 0).toFixed(2)

        if(!this.hues.includes(hue)){
            this.hues.push(hue)
            if(!this.requested){
                this.requested = true
                requestAnimationFrame(this.draw.bind(this))
            }
        }        
    }
}()