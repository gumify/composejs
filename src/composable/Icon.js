import { uuid } from "../util/uuid"
import { initModifier, destroyModifier } from "../util/helper"


class IconComposable {
    constructor({ modifier, icon }, parentScope, id) {
        this.modifier = modifier
        this.icon = icon
        this.root = document.createElement("div")
        this.root.setAttribute("class", "compose-icon material-icons")
        this.root.setAttribute("data-type", "compose-container")
        this.root.setAttribute("uuid", id)
        this.args = arguments[0]
        this.id = id
    }

    compose() {
        return this.connect()
    }

    recompose(args) {
        if (this.root.textContent !== args.icon) {
            this.root.innerHTML = args.icon
        }
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


function Icon({ modifier = Modifier, icon }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Icon'")
        return
    }
    let id = uuid()
    let composable = new IconComposable({ modifier, icon }, scope, id)
    scope.appendChild(composable, arguments[0], id)
}


export { Icon }
