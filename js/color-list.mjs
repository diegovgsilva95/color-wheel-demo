import * as Vue from "../node_modules/vue/dist/vue.esm-browser.js"

let ColorListTemplate = await (await fetch("/view/color-list.htm")).text()
let ColorListContainer = $(".color-list-app").get(0)

export default new class {
    constructor(){
        this.colorGroups = Vue.ref([])
        this.appOptions = {
            template: ColorListTemplate,
            data: _ => ({
                color_groups: this.colorGroups
            })
        }
        this.app = Vue.createApp(this.appOptions).mount(ColorListContainer)
    }
    addGroup(groupTitle){
        this.colorGroups.value.push({title: groupTitle, colors: []})
    }
    addColor(color){
        if(this.colorGroups.value.length == 0) this.addGroup("?")
        this.colorGroups.value.slice(-1)[0].colors.push(color)
    }
}()