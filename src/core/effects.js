import { uuid } from "../util/uuid";
import { Stack } from "./Stack";

function LaunchOnce(func, scope) {
    let id = scope.signature
    if (Stack.launchers[id] !== undefined) {
        return
    }
    Stack.launchers[id] = true
    func(scope)
}


export { LaunchOnce }
