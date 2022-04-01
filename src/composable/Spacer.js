import { WebComponent } from "../core/WebComponent"
import { uuid } from "../util/uuid"


class SpacerComposable {
    constructor({ modifier, height, width }, scope, id) {
        this.modifier = modifier
        this.height = height
        this.width = width

        this.root = document.createElement("div")
        this.root.setAttribute("class", "compose-spacer noselect")
        this.root.setAttribute("data-type", "compose-container")
    }

    compose() {
        return this.connect()
    }

    connect() {
        if (this.height) this.root.style.height = isNaN(this.height) ? this.height : this.height + "px"
        if (this.width) this.root.style.width = isNaN(this.width) ? this.width : this.width + "px"
        this.modifier.$init(this.root)
        return this.root
    }

    disconnect() {
        this.root.remove()
    }
}


function Spacer({ modifier = Modifier, height, width }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Spacer'")
        return
    }
    let id = uuid()
    let composable = new SpacerComposable({ modifier, height, width }, scope, id)
    scope.appendChild(composable, id)
}


export { Spacer }
