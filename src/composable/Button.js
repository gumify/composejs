import { WebComponent } from "../core/WebComponent"
import { Scope } from "../core/Scope"
import { Compose } from "../core/Compose"



class ButtonComposable {
    constructor({ modifier, onClick, content }, parentScope) {
        this.content = content
        this.modifier = modifier
        this.onClick = onClick
        this.root = document.createElement("button")
        this.root.setAttribute("class", "compose-button")
        this.root.setAttribute("data-type", "compose-container")

        if (typeof this.content == "function") {
            if (!Compose.isComposed) {
                let newScope = new Scope(this.root, this.content).compose()
                newScope.signature = this.getSignature()
                Compose.scopes.push(newScope)
            } else {
                let newScope = new Scope(this.root, this.content)
                newScope.signature = this.getSignature()
                let savedScope = Compose.findScope(newScope.signature)
                newScope.states = savedScope.states
                newScope.composables = savedScope.composables
                newScope.prevChildren = savedScope.prevChildren
                newScope.recompose()
            }
        }
    }

    getSignature() {
        return this.content.toString()
    }

    connect() {
        this.modifier.$init(this.root)
        this.root.addEventListener("click", this.onButtonClick.bind(this))
        return this.root
    }

    onButtonClick(e) {
        this.onClick(e)
    }

    disconnect() {
        this.root.removeEventListener("click", this.onButtonClick)
    }
}


function Button({ modifier = Modifier, onClick, content }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Button'")
        return
    }
    let composable = new ButtonComposable({ modifier, onClick, content }, scope)
    scope.appendChild(composable)
}



export { Button }
