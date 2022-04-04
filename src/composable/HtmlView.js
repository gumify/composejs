import { uuid } from "../util/uuid"
import { Stack } from "../core/Stack"
import { initModifier, destroyModifier } from "../util/helper"


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
        initModifier(this.id, this.root, args.modifier)
        args.update(this.root.children[0])
    }

    connect() {
        this.recompose(this.args)
        return this.root
    }

    disconnect() {
        destroyModifier(this.id, this.root)
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
