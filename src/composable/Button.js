import { WebComponent } from "../core/WebComponent"
import { Scope } from "../core/Scope"
import { Compose } from "../core/Compose"
import { uuid } from "../util/uuid"
// import {MDCRipple} from '@material/ripple';


class ButtonComposable {
    constructor({ modifier, onClick, content }, parentScope, id) {
        this.content = content
        this.modifier = modifier
        this.onClick = onClick
        this.root = document.createElement("button")
        this.root.innerHTML = `
        <span class="mdc-button__ripple"></span>
        <span class="mdc-button__label"></span>
        `
        // this.ripple = new MDCRipple(this.root)
        this.root.setAttribute("class", "compose-button")
        this.root.setAttribute("data-type", "compose-container")
        this.button = this.root.querySelector(".mdc-button__label")

        if (typeof this.content == "function") {
            if (!Compose.isComposed) {
                let newScope = new Scope(this.button, this.content).compose()
                newScope.signature = id
                Compose.scopes.push(newScope)
            } else {
                let newScope = new Scope(this.root, this.content)
                newScope.signature = id
                let savedScope = Compose.findScope(newScope.signature)
                newScope.states = savedScope.states
                newScope.composables = savedScope.composables
                newScope.prevChildren = savedScope.prevChildren
                newScope.recompose()

                Compose.removeScope(newScope.signature)
                Compose.scopes.push(newScope)
            }
        }
    }

    compose() {
        return this.connect()
    }

    connect() {
        this.modifier.$init(this.root)
        this.root.addEventListener("click", this.onButtonClick.bind(this))
        return this.root
    }

    onButtonClick(e) {
        // this.ripple.activate()
        this.onClick(e)
    }

    disconnect() {
        this.root.removeEventListener("click", this.onButtonClick)
        this.root.remove()
    }
}


function Button({ modifier = Modifier, onClick, content }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Button'")
        return
    }
    let id = uuid()
    let composable = new ButtonComposable({ modifier, onClick, content }, scope, id)
    scope.appendChild(composable, id)
}



export { Button }
