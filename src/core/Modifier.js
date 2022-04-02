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

    $destroy(element) {
        for (let key in this.css) {
            if (key === "clickable") {
                element.removeEventListener("click", this.css[key])
            }
        }
    }

    $applyTo(element, style) {
        for (let key in style) {
            if (key === "clickable") {
                element.addEventListener("click", style[key])
            } else {
                element.style[key] = style[key]
            }
        }
    }

    background(color) {
         this.css["background"] = color
        return this
    }

    size(height, width) {
        if (!width) {
            let v = isNaN(height) ? height : height + "px"
            this.css["height"] = v
            this.css["width"] = v
        } else {
            this.css["height"] = isNaN(height) ? height : height + "px"
            this.css["width"] = isNaN(width) ? width : width + "px"
        }
        return this
    }

    padding(padding) {
        if (padding.top) this.css["padding-top"] = isNaN(padding.top) ? padding.top : padding.top + "px"
        
        if (padding.end) {
            this.css["padding-right"] = isNaN(padding.end) ? padding.end : padding.end + "px"
        }
        else if (padding.right) this.css["padding-right"] = isNaN(padding.right) ? padding.right : padding.right + "px"

        if (padding.bottom) this.css["padding-bottom"] = isNaN(padding.bottom) ? padding.bottom : padding.bottom + "px"
       
        if (padding.start) this.css["padding-left"] = isNaN(padding.start) ? padding.start : padding.start + "px"
        else if (padding.left) this.css["padding-left"] = isNaN(padding.left) ? padding.left : padding.left + "px"
        
        if (padding !== "") {
            this.css["padding"] = isNaN(padding) ? padding : padding + "px"
        }
        return this
    }

    shape(shape) {
        for (let key in shape) {
            this.css[key] = shape[key]
        }
        return this
    }

    fillMaxWidth() {
        this.css.width = "100%"
        return this
    }
    fillMaxHeight() {
        this.css.height = "100%"
        return this
    }
    fillMaxSize() {
        this.fillMaxWidth()
        this.fillMaxHeight()
        return this
    }
    fillScreenWidth() {
        this.css.width = "100vw"
        this.css.maxWidth = "100%"
        return this
    }
    fillScreenHeight() {
        this.css.height = "100vh"
        this.css.maxHeight = "100%"
        return this
    }
    fillScreenSize() {
        this.fillScreenWidth()
        this.fillScreenHeight()
        return this
    }

    height(value) {
        this.css.height = isNaN(value) ? value : value + "px"
        return this
    }

    width(value) {
        this.css.width = isNaN(value) ? value : value + "px"
        return this
    }

    scale(value) {
        this.css.scale = value
        return this
    }

    align(value) {
        for (let key in value) {
            this.css[key] = value[key]
        }
        return this
    }

    alignSelf(value) {
        for (let key in value) {
            this.css[key] = value[key]
        }
        return this
    }

    justifySelf(value) {
        for (let key in value) {
            this.css[key] = value[key]
        }
        return this
    }

    basis(value) {
        this.css.flexBasis = value
        return this
    }

    justifyContent(value) {
        for (let key in value) {
            this.css[key] = value[key]
        }
        return this
    }

    clickable(callback) {
        this.css.cursor = "pointer"
        this.css.clickable = callback
        return this
    }
}


function initializeModifier() {
    Object.defineProperty(window, "Modifier", {
        get: () => new Modifier()
    })
}


export { initializeModifier }
