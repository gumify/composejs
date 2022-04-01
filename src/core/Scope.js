import { Box } from "../composable/Box";
import { uuid } from "../util/uuid";
import { Compose } from "./Compose";
import { State } from "./State"


class Scope {
    constructor(element, composer) {
        this.element = element
        this.composer = composer || null
        this.composables = []
        this.focusableEls = ["input", "textarea"]
        this.states = {}
        this.signature = null
    }

    stateOf(value) {
        let id = uuid()
        if (id in this.states) {
            return this.states[id]
        }
        let state = new State(value, this)
        this.states[id] = state
        return state
    }

    appendChild(child, id) {
        this.composables.push({ composable: child, el: child.compose(), id: id })
        return this
    }

    include(composable, ...args) {
        Box({
            content: scope => {
                composable(scope, ...args)
            }
        }, this)
    }

    compose(composer) {
        this.composer = composer || this.composer
        if (this.composer.constructor.name === "AsyncFunction") {
            this.composeAsync(this.composer)
            return this
        } else if (this.composer.constructor.name === "Function") {
            this.composer(this)
        }
        
        for (let i = 0; i < this.composables.length; i++) {
            this.composables[i].el.setAttribute("uuid", this.composables[i].id)
            this.element.appendChild(this.composables[i].el)
        }
        return this
    }

    recompose(composer) {
        /* TODO: add diff so that only required changes can be made to the dom */
        let oldEls = this.getAllChildren(this.element)
        let activeUUID = null
        let selectionStart = null
        for (let el of oldEls) {
            if (document.activeElement === el) {
                let parent = this.getParentElement(el)
                if (!parent) continue
                activeUUID = parent.getAttribute("uuid")
                let oldInput
                if (this.focusableEls.includes(el.tagName.toLowerCase())) {
                    oldInput = el
                } else {
                    oldInput = el.querySelector("input,textarea")
                }
                try {
                    selectionStart = oldInput.selectionStart
                } catch(e) {
                    activeUUID = null
                }
            }
        }

        this.composables.forEach(c => {
            c.composable.disconnect()
        })
        this.composables = []
        
        this.compose(composer)
        
        if (activeUUID) {
            let newEls = this.getAllChildren(this.element)
            for (let el of newEls) {
                if (el.getAttribute("uuid") === activeUUID) {
                    let newInput
                    if (this.focusableEls.includes(el.tagName.toLowerCase())) {
                        newInput = el
                    } else {
                        newInput = el.querySelector("input,textarea")
                    }
                    this.setCaretPosition(newInput, selectionStart)
                }
            }
        }
        return this
    }


    setCaretPosition(elem, caretPos) {
        if(elem.createTextRange) {
            var range = elem.createTextRange();
            range.move('character', caretPos);
            range.select();
        }
        else {
            if(elem.selectionStart) {
                elem.focus();
                elem.setSelectionRange(caretPos, caretPos);
            }
            else
                elem.focus();
        }
    }

    getAllChildren(element, children = []) {
        if (element) {
            let els = element.children
            for (let i = 0; i < els.length; i++) {
                children.push(els[i])
                this.getAllChildren(els[i], children)
            }
        }
        return children
    }

    getParentElement(element) {
        if (element && element.getAttribute("uuid")) {
            return element
        }
        if (element.parentElement) {
            return this.getParentElement(element.parentElement)
        }
    }
}

export { Scope }
