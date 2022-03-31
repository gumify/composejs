import { WebComponent } from "../core/WebComponent"
import { Scope } from "../core/Scope"


const template = document.createElement("template")
template.innerHTML = `
<style>

</style>
<button class="button" data-type="compose-container"></button>
`


class ButtonComposable extends HTMLElement {
    constructor({ modifier, onClick, content }) {
        super()
        this.attachShadow({ mode: "open" })
        this.content = content
        this.modifier = modifier
        this.onClick = onClick
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.button = this.shadowRoot.querySelector(".button")

        if (typeof this.content == "function") {
            let buttonScope = new Scope(this.button, this.content).compose()
        }
    }

    connectedCallback() {
        this.modifier.$init()
        this.button.addEventListener("click", this.onButtonClick.bind(this))
    }

    onButtonClick(e) {
        this.onClick(e)
    }

    disconnectedCallback() {
        this.button.removeEventListener("click", this.onButtonClick)
    }
}


function Button({ modifier = Modifier, onClick, content }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Button'")
        return
    }

    if (!WebComponent.wasRegistered("compose-button")) {
        window.customElements.define('compose-button', ButtonComposable)
    }
    let composable = new ButtonComposable({ modifier, onClick, content })
    scope.appendChild(composable)
}



export { Button }
