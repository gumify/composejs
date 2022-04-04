import { uuid } from "../util/uuid"
import { MDCTextField } from '@material/textfield';
import { initModifier, destroyModifier } from "../util/helper"


class TextFieldComposable {
    constructor({ modifier, value, onChange, label, disabled }, scope, id) {
        this.modifier = modifier
        this.value = value
        this.onChange = onChange
        this.scope = scope
        this.label = label
        this.disabled = disabled
        this.args = arguments[0]
    
        this.root = document.createElement("label")
        this.root.innerHTML = `
        <span class="mdc-text-field__ripple"></span>
        <span class="mdc-floating-label"></span>
        <input class="mdc-text-field__input" type="text">
        <span class="mdc-line-ripple"></span>
        `
        this.root.setAttribute("class", "compose-text-field mdc-text-field mdc-text-field--filled")
        this.root.setAttribute("data-type", "compose-container")
        this.root.setAttribute("uuid", id)

        this.labelEl = this.root.querySelector(".mdc-floating-label")
        this.inputEl = this.root.querySelector("input")
    }

    compose() {
        return this.connect()
    }

    recompose(args) {
        if (args.disabled) {
            this.root.classList.add("mdc-text-field--disabled")
        } else {
            this.root.classList.remove("mdc-text-field--disabled")
        }
        this.inputEl.disabled = args.disabled
        this.labelEl.textContent = this.label
        this.inputEl.value = args.value
        initModifier(this.id, this.root, args.modifier)
    }

    connect() {
        this.recompose(this.args)

        this.inputEl.addEventListener("input", this.onTextChange.bind(this))
        new MDCTextField(this.root)
        return this.root
    }

    onTextChange(e) {
        this.onChange(this.inputEl.value, e)
        this.scope.recompose()
    }

    disconnect() {
        destroyModifier(this.id, this.root)
        this.inputEl.removeEventListener("input", this.onTextChange)
    }
}


function TextField({ modifier = Modifier, value, onChange, label = "", disabled = false }, scope) {
    if (!scope) {
        console.error("Scope is required: 'TextField'")
        return
    }
    let id = uuid()
    let composable = new TextFieldComposable({ modifier, value, onChange, label, disabled }, scope, id)
    scope.appendChild(composable, arguments[0], id)
}


export { TextField }

