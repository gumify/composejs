import { Box } from "../composable/Box";
import { uuid } from "../util/uuid";
import { Compose } from "./Compose";
import { State } from "./State"


class Scope {
    constructor(element, composer) {
        this.element = element
        this.composer = composer || null
        this.children = []
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

    appendChild(child, args, id) {
        this.children.push({ composable: child, el: child.compose(), id: id, args: args })
        return this
    }

    include(composable, ...args) {
        Box({
            content: scope => {
                composable(scope, ...args)
            }
        }, this)
    }

    static runComposer(el, content, id) {
        if (typeof content == "function") {
            if (!Compose.isComposed) {
                let newScope = new Scope(el, content).compose()
                newScope.signature = id
                Compose.scopes.push(newScope)
            } else {
                let newScope = new Scope(el, content)
                newScope.signature = id
                let savedScope = Compose.findScope(newScope.signature)
                newScope.element = savedScope.element
                newScope.states = savedScope.states
                newScope.children = savedScope.children
                newScope.prevChildren = savedScope.prevChildren
                newScope.recompose()
                Compose.removeScope(newScope.signature)
                Compose.scopes.push(newScope)
            }
        }
    }

    compose(composer) {
        this.composer = composer || this.composer
        if (this.composer.constructor.name === "AsyncFunction") {
            this.composeAsync(this.composer)
            return this
        } else if (this.composer.constructor.name === "Function") {
            this.composer(this)
        }
        
        for (let i = 0; i < this.children.length; i++) {
            this.element.appendChild(this.children[i].el)
        }
        return this
    }

    recompose(composer) {
        let oldChildren = Array.from(this.children)
        this.children = []
        
        this.composer = composer || this.composer
        if (this.composer.constructor.name === "AsyncFunction") {
            this.composeAsync(this.composer)
            return this
        } else if (this.composer.constructor.name === "Function") {
            this.composer(this)
        }

        let lastElement = null
        for (let i = 0; i < this.children.length; i++) {
            let child = this.children[i]
            let oldChild = oldChildren.find(c => c.id === child.id)

            if (oldChild) {
                oldChild.composable.recompose(child.args)
                this.children[i] = oldChild
                lastElement = oldChild.el
            } else {
                if (lastElement) {
                    lastElement.parentNode.insertBefore(child.el, lastElement.nextSibling)
                } else {
                    this.element.appendChild(child.el)
                }
                lastElement = child.el
            }
        }

        if (oldChildren.length > this.children.length) {
            let diff = oldChildren.filter(c => !this.children.find(c2 => c2.id === c.id))
            for (let c of diff) {
                c.composable.disconnect()
                this.element.removeChild(c.el)
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
