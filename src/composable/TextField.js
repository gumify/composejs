import { WebComponent } from "../core/WebComponent"


class TextFieldComposable {
    constructor({ modifier, value, onChange }, scope) {
        this.modifier = modifier
        this.value = value
        this.onChange = onChange
        this.scope = scope
        
        this.root = document.createElement("div")
        this.root.innerHTML = `
            <input type="text">
        `
        this.root.setAttribute("class", "compose-text-field")
        this.root.setAttribute("data-type", "compose-container")

        this.input = this.root.querySelector("input")
    }

    connect() {
        this.modifier.$init(this.root)
        this.input.value = this.value
        this.input.addEventListener("input", this.onTextChange.bind(this))
        return this.root
    }

    onTextChange(e) {
        this.onChange(this.input.value, e)
        this.scope.recompose()
    }

    disconnect() {
        this.input.removeEventListener("input", this.onTextChange)
    }
}



function TextField({ modifier = Modifier, value, onChange }, scope) {
    if (!scope) {
        console.error("Scope is required: 'TextField'")
        return
    }
    let composable = new TextFieldComposable({ modifier, value, onChange }, scope)
    scope.appendChild(composable)
}


export { TextField }

