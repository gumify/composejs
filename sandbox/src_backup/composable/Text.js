import { WebComponent } from "../core/WebComponent"
import { State } from "../core/State"


const template = document.createElement("template")
template.innerHTML = `
<style>

</style>
<div class="text" data-type="compose-container"></div>
`

class TextComposable extends HTMLElement {
    constructor({ modifier, text, color, textSize, overflow, maxLines }) {
        super()
        this.attachShadow({ mode: "open" })
        
        this.text = text
        this.modifier = modifier
        this.color = color
        this.textSize = textSize
        this.overflow = overflow
        this.maxLines = maxLines

        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.textView = this.shadowRoot.querySelector(".text")
    }

    connectedCallback() {
        this.modifier.$init()
        this.textView.textContent = this.text
        if (this.color) this.textView.style.color = this.color
        if (this.textSize) this.textView.style.fontSize = this.textSize
        if (this.overflow) WebComponent.applyStyle(this.textView, this.overflow)

        if (this.maxLines) {
            WebComponent.applyStyle(this.textView, {
                "-webkit-line-clamp": this.maxLines,
                "display": "-webkit-box",
                "-webkit-box-orient": "vertical"
            })
        }
    }

    disconnectedCallback() {
    }
}


function Text({ modifier = Modifier, text, color, textSize, overflow = {}, maxLines }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Text'")
        return
    }

    if (!WebComponent.wasRegistered("compose-text")) {
        window.customElements.define('compose-text', TextComposable)
    }
    let composable = new TextComposable({ modifier, text, color, textSize, overflow, maxLines })
    scope.appendChild(composable)
}


export { Text }