import { Stack } from "../core/Stack"

function initModifier(id, el, modifier) {
    if (modifier) {
        modifier.$init(el)
        destroyModifier(id, el)
        Stack.modifiers[id] = modifier
    }
}

function destroyModifier(id, el) {
    if (id in Stack.modifiers) {
        Stack.modifiers[id].$destroy(el)
        delete Stack.modifiers[id]
    }
}


export { initModifier, destroyModifier }
