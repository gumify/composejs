import { uuid } from "../util/uuid"
import { Stack } from "../core/Stack"
import { initModifier, destroyModifier } from "../util/helper"


class SpacerComposable {
    constructor({ modifier, height, width }, scope, id) {
        this.modifier = modifier
        this.height = height
        this.width = width
        this.args = arguments[0]
        this.id = id

        this.root = document.createElement("div")
        this.root.setAttribute("class", "compose-spacer noselect")
        this.root.setAttribute("data-type", "compose-container")
        this.root.setAttribute("uuid", id)
    }

    compose() {
        return this.connect()
    }

    recompose(args) {
        if (args.height) this.root.style.height = isNaN(args.height) ? args.height : args.height + "px"
        if (args.width) this.root.style.width = isNaN(args.width) ? args.width : args.width + "px"
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


function Spacer({ modifier = Modifier, height, width }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Spacer'")
        return
    }
    let id = uuid()
    let composable = new SpacerComposable({ modifier, height, width }, scope, id)
    scope.appendChild(composable, arguments[0], id)
}


export { Spacer }
