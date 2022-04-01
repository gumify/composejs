import { State } from "./State"


class Modifier {
    constructor() {
        this.element = null
        this.css = {}
    }

    $init(element) {
        if (element) {
            this.element = element
        }
        this.$applyTo(this.element, this.css)
    }

    $applyTo(element, style) {
        for (let key in style) {
            element.style[key] = style[key]
        }
    }

    background(color) {
         this.css["background"] = color
        return this
    }

    shape(shape) {
        for (let key in shape) {
            this.css[key] = shape[key]
        }
        return this
    }
}


function initializeModifier() {
    Object.defineProperty(window, "Modifier", {
        get: () => new Modifier()
    })
}


export { initializeModifier }
