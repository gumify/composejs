import { Box } from "../composable/Box";
import { uuid } from "../util/uuid";
import { Compose } from "./Compose";
import { State } from "./State"


class Scope {
    constructor(element, composer) {
        this.element = element
        this.composer = composer || null
        this.children = []
        this.composables = []
        this.prevChildren = []
        this.data = null
        this.isRecomposing = false
        this.focusableEls = ["input", "textarea"]
        this.states = []
        this.signature = null
    }

    stateOf(value) {
        if (!this.isRecomposing) {
            let state = new State(value, this)
            this.states.push(state)
            return state
        }
        let state = this.states.shift()
        this.states.push(state)
        return state
    }

    appendChild(child) {
        this.composables.push(child)
        this.children.push(child.connect())
        return this
    }

    compose(composer, style) {
        if (style) {
            let st = document.createElement("style")
            st.textContent = style.textContent
            this.element.appendChild(st)
        }

        this.composables.forEach(c => c.disconnect())

        this.children = []
        this.composables = []
        this.composer = composer || this.composer
        if (this.composer.constructor.name === "AsyncFunction") {
            this.composeAsync(this.composer)
            return this
        } else if (this.composer.constructor.name === "Function") {
            this.composer(this)
        }
        
        for (let i = 0; i < this.children.length; i++) {
            if (!this.isRecomposing) {
                this.children[i].setAttribute("uuid", uuid())
            } 
            
            try {
                if (this.isRecomposing && this.prevChildren[i].className === this.children[i].className) {
                    this.children[i].setAttribute("uuid", this.prevChildren[i].getAttribute("uuid"))
                }
            } catch(e) {
                this.children[i].setAttribute("uuid", uuid())
            }

            this.element.appendChild(this.children[i])
        }
        this.isRecomposing = false
        this.prevChildren = []
        this.children.forEach(el => this.prevChildren.push(el))
        return this
    }

    recompose(composer) {
        /* TODO: add diff so that only required changes can be made to the dom */
                
        this.isRecomposing = true
        let style = this.element.querySelector("style")
        let oldEls = this.getAllChildren(this.element)
        let activeUUID = null
        let selectionStart = null
        for (let el of oldEls) {
            if (document.activeElement === el) {
                activeUUID = this.getParentElement(el).getAttribute("uuid")
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
        
        this.element.innerHTML = ''
        this.compose(composer, style)
        
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
        if (element.getAttribute("uuid")) {
            return element
        }
        return this.getParentElement(element.parentElement)
    }
}


export { Scope }
