import { Scope } from "../core/Scope"
import { uuid } from "../util/uuid"
import { initModifier, destroyModifier } from "../util/helper"


class RowComposable {
    constructor({ modifier, content }, parentScope, id) {
        this.modifier = modifier
        this.content = content
        this.root = document.createElement("div")
        this.root.setAttribute("class", "compose-row")
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
        initModifier(this.id, this.root, args.modifier)
    }

    connect() {
        this.recompose(this.args)
        return this.root
    }

    disconnect() {
        destroyModifier(this.id, this.root)
    }
}



function Row({ modifier = Modifier, content }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Row'")
        return
    }
    let id = uuid()
    let composable = new RowComposable({ modifier, content }, scope, id)
    scope.appendChild(composable, arguments[0], id)
}


export { Row }
