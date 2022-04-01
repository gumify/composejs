import { WebComponent } from "../core/WebComponent"
// import { MDCTextField } from '@material/textfield';


class TextFieldComposable {
    constructor({ modifier, value, onChange, label }, scope) {
        this.modifier = modifier
        this.value = value
        this.onChange = onChange
        this.scope = scope
        
        this.root = document.createElement("label")
        this.root.innerHTML = `
        <span class="mdc-text-field__ripple"></span>
        <span class="mdc-floating-label">${label}</span>
        <input class="mdc-text-field__input" type="text">
        <span class="mdc-line-ripple"></span>
        `
        this.root.setAttribute("class", "compose-text-field mdc-text-field mdc-text-field--filled")
        this.root.setAttribute("data-type", "compose-container")

        this.label = this.root.querySelector(".mdc-floating-label")

        this.input = this.root.querySelector("input")
    }

    connect() {
        if (this.value !== "") {
            WebComponent.applyStyle(this.label, {
                "transform": "translate(0, -20px) scale(0.8)",
                "opacity": "1"
            })
        }
        this.modifier.$init(this.root)
        this.input.value = this.value
        this.input.addEventListener("input", this.onTextChange.bind(this))
        // const textField = new MDCTextField(this.root)
        this.input.addEventListener("focusout", this.onInputFocusOut.bind(this))
        this.input.addEventListener("focus", this.onInputFocus.bind(this))
        return this.root
    }

    onInputFocus(e) {
        if (this.input.value == "") {
            WebComponent.applyStyle(this.label, {
                "transform": "translate(0, -20px) scale(0.8)",
                "opacity": "1"
            })
        }
    }

    onInputFocusOut(e) {
        if (this.input.value == "") {
            WebComponent.applyStyle(this.label, {
                "transform": "translate(0, -10px) scale(1)",
                "opacity": "0.8"
            })
        } 
        
        // else {
        //     WebComponent.applyStyle(this.label, {
        //         "transform": "translate(0, -20px) scale(0.8)",
        //         "opacity": "1"
        //     })
        // }
    }

    onTextChange(e) {
        this.onChange(this.input.value, e)
        this.scope.recompose()
    }

    disconnect() {
        this.input.removeEventListener("input", this.onTextChange)
        this.input.removeEventListener("focusout", this.onInputFocusOut)
        this.input.removeEventListener("focus", this.onInputFocus)
    }
}



function TextField({ modifier = Modifier, value, onChange, label = "" }, scope) {
    if (!scope) {
        console.error("Scope is required: 'TextField'")
        return
    }
    let composable = new TextFieldComposable({ modifier, value, onChange, label }, scope)
    scope.appendChild(composable)
}


export { TextField }

