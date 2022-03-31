import { initializeModifier } from "./Modifier"
import { Scope } from "./Scope"


class Compose {
    constructor(selector) {
        initializeModifier()
        this.app = document.querySelector(selector)
    }

    mount(content) {
        new Scope(this.app, content).compose()
    }
}


export { Compose }
