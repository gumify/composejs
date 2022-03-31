import { WebComponent } from "../core/WebComponent"
import { Scope } from "../core/Scope"
import { uuid } from "../util/uuid"


const template = document.createElement("template")
template.innerHTML = `
<style>
</style>
<div class="text-field" data-type="compose-container">
    <input type="text">
</div>
`

/* TODO: has an issue on recomposition, if the state defined in the parent scope focus is gone */ 

class TextFieldComposable extends HTMLElement {
    constructor({ modifier, value, onChange }) {
        super()
        this.attachShadow({ mode: "open" })
        
        this.modifier = modifier
        this.value = value
        this.onChange = onChange

        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.textField = this.shadowRoot.querySelector(".text-field input")
    }

    connectedCallback() {
        this.modifier.$init()
        this.textField.value = this.value
        this.textField.addEventListener("keyup", this.onTextChange.bind(this))
    }

    onTextChange(e) {
        this.onChange(this.textField.value, e)
    }

    disconnectedCallback() {
        this.textField.removeEventListener("change", this.onTextChange)
    }
}



function TextField({ modifier = Modifier, value, onChange }, scope) {
    if (!scope) {
        console.error("Scope is required: 'TextField'")
        return
    }
    if (!WebComponent.wasRegistered("compose-text-field")) {
        window.customElements.define('compose-text-field', TextFieldComposable)
    }
    let composable = new TextFieldComposable({ modifier, value, onChange })
    scope.appendChild(composable)
}


export { TextField }

