import { WebComponent } from "../core/WebComponent"
import { Scope } from "../core/Scope"
import { Compose } from "../core/Compose"
import { uuid } from "../util/uuid"


class ColumnComposable {
    constructor({ modifier, content }, parentScope, id) {
        this.modifier = modifier
        this.content = content
        this.root = document.createElement("div")
        this.root.setAttribute("class", "compose-column")
        this.root.setAttribute("data-type", "compose-container")

        if (typeof this.content == "function") {
            if (!Compose.isComposed) {
                let newScope = new Scope(this.root, this.content).compose()
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
        return this.root
    }

    disconnect() {
        this.root.remove()
    }
}



function Column({ modifier = Modifier, content }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Column'")
        return
    }
    let id = uuid()
    let composable = new ColumnComposable({ modifier, content }, scope, id)
    scope.appendChild(composable, id)
}


export { Column }
