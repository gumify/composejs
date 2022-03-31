import { WebComponent } from "../core/WebComponent"
import { Scope } from "../core/Scope"
import { Compose } from "../core/Compose"
import { uuid } from "../util/uuid"


class BoxComposable {
    constructor({ modifier, content }, parentScope) {
        this.modifier = modifier
        this.content = content
        this.root = document.createElement("div")
        this.root.setAttribute("class", "compose-box")
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

                Compose.removeScope(newScope.signature)
                Compose.scopes.push(newScope)
            }
        }
    }

    getSignature() {
        return this.content.toString()
    }

    connect() {
        this.modifier.$init(this.root)
        return this.root
    }

    disconnect() {

    }
}



function Box({ modifier = Modifier, content }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Box'")
        return
    }
    let composable = new BoxComposable({ modifier, content }, scope)
    scope.appendChild(composable)
}


export { Box }
