import { WebComponent } from "../core/WebComponent"
import { Scope } from "../core/Scope"
import { Compose } from "../core/Compose"
import { uuid } from "../util/uuid"
import { Stack } from "../core/Stack"


class ColumnComposable {
    constructor({ modifier, content }, parentScope, id) {
        this.modifier = modifier
        this.content = content
        this.root = document.createElement("div")
        this.root.setAttribute("class", "compose-column")
        this.root.setAttribute("data-type", "compose-container")
        this.root.setAttribute("uuid", id)
        this.args = arguments[0]
        this.id = id

        Scope.runComposer(this.root, this.content, id)
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
    }

    connect() {
        this.recompose(this.args)
        return this.root
    }

    disconnect() {
        if (this.id in Stack.modifiers) {
            Stack.modifiers[this.id].$destroy(this.root)
            delete Stack.modifiers[this.id]
        }
    }
}



function Column({ modifier = Modifier, content }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Column'")
        return
    }
    let id = uuid()
    let composable = new ColumnComposable({ modifier, content }, scope, id)
    scope.appendChild(composable, arguments[0], id)
}


export { Column }
