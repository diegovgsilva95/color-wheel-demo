import "../node_modules/chroma-js/chroma.min.js"
import "../node_modules/jquery/dist/jquery.min.js"
import ColorList from "./color-list.mjs"
import ColorCanvas from "./color-canvas.mjs"
const sleep = ms => new Promise(r => setTimeout(r, ms))
const addColor = color => {
    ColorList.addColor(color)
    ColorCanvas.addColor(color)
}
const addGroup = groupName => {
    ColorList.addGroup(groupName)
}
const mixNorm = 16
const mix = (a,b)=>{
  let sc = chroma.mix(a,b,0.5,"hsl")
  let sg = sc.gl()
  sc = chroma.gl(...sg.map(x=>Math.round(x*mixNorm)/mixNorm)).toString()
  return sc.toString()
}
const traverseColors = async function(groupName){
    let tmp = [...colors]
    addGroup(groupName)
    for(let cia = 0; cia < tmp.length-1; cia++){
        for(let cib = cia+1; cib < tmp.length; cib++){
        let ca = tmp[cia],
            cb = tmp[cib],
            co = mix(ca,cb),
            ch = chroma(co).get("hsl.h"),
            j = colors.length-1
        if(colors.includes(co)) continue;

        for(j = colors.length-1; j >= tmp.length; j--){
            let cj = colors[j],
                cjh = chroma(cj).get("hsl.h")
            if(cjh < ch) break;
        }
        colors.splice(j+1, 0, co)
        }
    }

    for(let i = tmp.length; i < colors.length; i++){
        let co = colors[i]
        await sleep(100)
        addColor(co)
    }
}

let colors = []

addGroup("Primary")
for(let co of ["#F00","#0F0","#00F"]){
  co = chroma(co).toString()
  colors.push(co)
  await sleep(100)
  addColor(co)
}
await sleep(2000)
await traverseColors("Secondary")
await sleep(2000)
await traverseColors("Tertiary")
await sleep(2000)
await traverseColors("Quartenary")

  