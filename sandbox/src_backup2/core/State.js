import { Compose } from "./Compose"
import { Scope } from "./Scope"

class State {
    constructor(value, scope) {
        this.stateValue = value
        this.scope = scope
    }

    set value(value) {
        if (value !== this.value) {
            this.stateValue = value
            this.scope.recompose()
        }
    }

    get value() {
        return this.stateValue
    }
}


export { State }
