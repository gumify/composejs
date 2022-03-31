import { WebComponent } from "../core/WebComponent"
import { Scope } from "../core/Scope"


const template = document.createElement("template")
template.innerHTML = `
<div class="box" data-type="compose-container"></div>
`


class BoxComposable extends HTMLElement {
    constructor({ modifier, content }, scope) {
        super()
        this.attachShadow({ mode: "open" })
        this.modifier = modifier
        this.content = content
        this.shadowRoot.appendChild(template.content.cloneNode(true))
        this.box = this.shadowRoot.querySelector(".box")

        if (typeof this.content == "function") {
            let boxScope = new Scope(this.box, this.content)
            if (scope.isRecomposing) {
                boxScope.recompose()
            } else {
                boxScope.compose()
            }
        }
    }

    connectedCallback() {
        this.modifier.$init()
    }

    disconnectedCallback() {

    }
}



function Box({ modifier = Modifier, content }, scope) {
    if (!scope) {
        console.error("Scope is required: 'Box'")
        return
    }

    if (!WebComponent.wasRegistered("compose-box")) {
        window.customElements.define('compose-box', BoxComposable)
    }
    let composable = new BoxComposable({ modifier, content }, scope)
    scope.appendChild(composable)
}


export { Box }

