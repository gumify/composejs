import { Compose } from "./Compose"
import { Stack } from "./Stack"

class State {
    constructor(value, scope) {
        this.stateValue = value
        this.scope = scope
    }

    set value(value) {
        if (value !== this.value) {
            this.stateValue = value
            if (this.scope.recomposeEnabled) {
                if (!this.scope.isRecomposing) {
                    this.scope.recompose()
                } else {
                    Stack.pendingRecomposition.push(this.scope)
                }
            }
        }
    }

    get value() {
        return this.stateValue
    }
}


export { State }
