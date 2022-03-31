import { WebComponent } from "../core/WebComponent"


class TextComposable {
    constructor({ modifier, text, color, textSize, overflow, maxLines }, scope) {
        this.text = text
        this.modifier = modifier
        this.color = color
        this.textSize = textSize
        this.overflow = overflow
        this.maxLines = maxLines

        this.root = document.createElement("div")
        this.root.setAttribute("class", "compose-text")
        this.root.setAttribute("data-type", "compose-container")
    }

    connect() {
        this.modifier.$init(this.root)
        this.root.textContent = this.text
        if (this.color) this.root.style.color = this.color
        if (this.textSize) this.root.style.fontSize = this.textSize
        if (this.overflow) WebComponent.applyStyle(this.root, this.overflow)

        if (this.maxLines) {
            WebComponent.applyStyle(this.root, {
                "-webkit-line-clamp": this.maxLines,
                "display": "-webkit-box",
                "-webkit-box-orient": "vertical"
            })
        }
        return this.root
    }

    disconnect() {
    }
}


function Text({ modifier = Modifier, text, color, textSize, overflow = {}, maxLines }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Text'")
        return
    }
    let composable = new TextComposable({ modifier, text, color, textSize, overflow, maxLines }, scope)
    scope.appendChild(composable)
}


export { Text }