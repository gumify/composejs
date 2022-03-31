import { State } from "./State"


class Modifier {
    constructor() {
        this.element = null
        this.css = {}
        this.listenerIds = []
    }

    $stateCheck(value, onValueChange) {
        if (value instanceof State) {
            let listenerId = value.addListener(value => onValueChange(value))
            this.listenerIds.push(listenerId)
            return value.value
        } else {
            return value
        }
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


    $destroy() {
        this.listenerIds.forEach(listenerId => {
            State.removeListener(listenerId)
        })
    }

    background(color) {
         this.css["background"] = this.$stateCheck(color, value => {
            this.element.style.background = value
        })
        return this
    }

    shape(shape) {
        let style = this.$stateCheck(shape, value => {
            this.$applyTo(this.element, value)
        })
        for (let key in style) {
            this.css[key] = style[key]
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
