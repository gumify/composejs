import { WebComponent } from "../core/WebComponent"
import { Scope } from "../core/Scope"
import { Compose } from "../core/Compose"
import { uuid } from "../util/uuid"
import { Stack } from "../core/Stack"


class HtmlViewComposable {
    constructor({ modifier, factory, update }, parentScope, id) {
        this.modifier = modifier
        this.factory = factory
        this.update = update
        this.args = arguments[0]
        this.id = id
        
        this.root = document.createElement("div")
        this.root.setAttribute("class", "compose-html compose-layout")
        this.root.setAttribute("data-type", "compose-container")
        this.root.setAttribute("uuid", id)

        this.root.appendChild(this.factory())
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
        args.update(this.root.children[0])
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



function HtmlView({ modifier = Modifier, factory, update }, scope) {
    if (!scope) {
        console.error("Scope is required: 'HtmlView'")
        return
    }
    let id = uuid()
    let composable = new HtmlViewComposable({ modifier, factory, update }, scope, id)
    scope.appendChild(composable, arguments[0], id)
}


export { HtmlView }
