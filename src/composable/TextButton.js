import { WebComponent } from "../core/WebComponent"
import { Scope } from "../core/Scope"
import { Compose } from "../core/Compose"
import { uuid } from "../util/uuid"
import {MDCRipple} from '@material/ripple'
import { Stack } from "../core/Stack"


class TextButtonComposable {
    constructor({ modifier, onClick, content, disabled }, parentScope, id) {
        this.content = content
        this.modifier = modifier
        this.onClick = onClick
        this.disabled = disabled
        this.root = document.createElement("button")
        this.root.innerHTML = `
        <span class="mdc-button__ripple"></span>
        <span class="mdc-button__label"></span>
        `
        this.ripple = new MDCRipple(this.root)
        this.root.setAttribute("class", "compose-text-button mdc-button")
        this.root.setAttribute("data-type", "compose-container")
        this.root.setAttribute("uuid", id)
        this.button = this.root.querySelector(".mdc-button__label")
        this.args = arguments[0]
        this.id = id

        Scope.runComposer(this.button, this.content, id)
    }

    compose() {
        return this.connect()
    }

    recompose(args) {
        if (args.modifier) {
            args.modifier.$init(this.root)
            if (this.id in Stack.modifiers) {
                Stack.modifiers[this.id].$destroy(this.root)
                delete Stack.modifiers[this.id]
            }
            Stack.modifiers[this.id] = args.modifier
        }
        this.root.disabled = args.disabled
    }

    connect() {
        this.recompose(this.args)
        
        this.root.addEventListener("click", this.onButtonClick.bind(this))
        this.root.addEventListener("mouseup", this.onMouseUp.bind(this))
        return this.root
    }

    onButtonClick(e) {
        if (!this.disabled) {
            this.ripple.activate()
            this.onClick(e)
        }
    }

    onMouseUp(e) {
        this.ripple.deactivate()
    }

    disconnect() {
        this.root.removeEventListener("click", this.onButtonClick)
        this.root.removeEventListener("mouseup", this.onMouseUp)
        if (this.id in Stack.modifiers) {
            Stack.modifiers[this.id].$destroy(this.root)
            delete Stack.modifiers[this.id]
        }
    }
}


function TextButton({ modifier = Modifier, onClick, content, disabled = false }, scope) {
    if (!scope) {
        console.error("Scope is required: 'TextButton'")
        return
    }
    let id = uuid()
    let composable = new TextButtonComposable({ modifier, onClick, content, disabled }, scope, id)
    scope.appendChild(composable, arguments[0], id)
}



export { TextButton }
