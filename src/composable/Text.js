import { WebComponent } from "../core/WebComponent"
import { uuid } from "../util/uuid"
import { initModifier, destroyModifier } from "../util/helper"


class TextComposable {
    constructor({ modifier, text, color, textSize, overflow, maxLines }, scope, id) {
        this.text = text
        this.modifier = modifier
        this.color = color
        this.textSize = textSize
        this.overflow = overflow
        this.maxLines = maxLines
        this.args = arguments[0]
        this.id = id

        this.root = document.createElement("div")
        this.root.setAttribute("class", "compose-text noselect")
        this.root.setAttribute("data-type", "compose-container")
        this.root.setAttribute("uuid", id)
    }

    compose() {
        return this.connect()
    }

    recompose(args) {
        this.root.innerHTML = args.text
        
        if (args.color) this.root.style.color = args.color
        if (args.textSize) this.root.style.fontSize = isNaN(args.textSize) ? args.textSize : args.textSize + "px"
        if (args.overflow) WebComponent.applyStyle(this.root, args.overflow)
        if (args.maxLines) {
            WebComponent.applyStyle(this.root, {
                "-webkit-line-clamp": args.maxLines,
                "display": "-webkit-box",
                "-webkit-box-orient": "vertical"
            })
        }

        initModifier(this.id, this.root, args.modifier)
    }

    connect() {
        this.recompose(this.args)
        return this.root
    }

    disconnect() {
        destroyModifier(this.id, this.root)
    }
}


function Text({ modifier = Modifier, text, color, textSize, overflow = {}, maxLines }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Text'")
        return
    }
    let id = uuid()
    let composable = new TextComposable({ modifier, text, color, textSize, overflow, maxLines }, scope, id)
    scope.appendChild(composable, arguments[0], id)
}


export { Text }