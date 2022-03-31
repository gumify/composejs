import { uuid } from "../util/uuid";
import { State } from "./State"


class Scope {
    constructor(element, composer) {
        this.element = element.shadowRoot || element
        this.composer = composer || null
        this.children = []
        this.prevChildren = []
        this.data = null
        this.isRecomposing = false
        this.states = {}
        this.focusableEls = ["compose-text-field"]
    }

    stateOf({ value, id }) {
        if (!this.isRecomposing) {
            let state = new State(value, this)
            this.states[id] = state
            return state
        }
        return this.states[id]
    }

    appendChild(child) {
        this.children.push(child)
        return this
    }

    compose(composer, style) {
        console.log("Recompsing: ", this.isRecomposing)
        if (style) {
            let st = document.createElement("style")
            st.textContent = style.textContent
            this.element.appendChild(st)
        }

        this.children = []
        this.composer = composer || this.composer
        if (this.composer.constructor.name === "AsyncFunction") {
            this.composeAsync(this.composer)
            return this
        } else if (this.composer.constructor.name === "Function") {
            this.composer(this)
        }
        console.log(this.children)
        for (let i = 0; i < this.children.length; i++) {
            if (!this.isRecomposing) {
                this.children[i].setAttribute("uuid", uuid())
            } 
            
            try {
                if (this.isRecomposing && this.prevChildren[i].tagName === this.children[i].tagName) {
                    this.children[i].setAttribute("uuid", this.prevChildren[i].getAttribute("uuid"))
                }
            } catch(e) {
                this.children[i].setAttribute("uuid", uuid())
            }

            // console.log(this.children[i])
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
        console.log("Active UUID: ", this.element)
        let oldEls = this.getAllChildren(this.element)
        let activeUUID = null
        let selectionStart = null

        let doc
        if (this.element.parentNode.host) {
            doc = this.element.parentNode
        } else {
            doc = document
        }

        console.log("here", doc.activeElement)

        for (let el of oldEls) {
            if (doc.activeElement === el) {
                let activeEl = this.findActiveElement(el)
                let composeEl
                if (activeEl.getAttribute("uuid") === null) {
                    composeEl = this.getElementHost(activeEl)
                } else {
                    composeEl = activeEl
                }
                activeUUID = composeEl.getAttribute("uuid")
                let oldInput = composeEl.shadowRoot.querySelector("input,textarea")
                selectionStart = oldInput.selectionStart
            }
        }

        // console.log(document.activeElement == this.element.querySelector("compose-text-field"))
        // let oldInput = document.activeElement.shadowRoot.querySelector("input")
        // console.log(oldInput)
        // console.log(oldInput.selectionStart)
        this.element.innerHTML = ''
        this.compose(composer, style)
        
        console.log("Active UUID: ", activeUUID)
        if (activeUUID) {
            let newEls = this.getAllChildren(this.element)
            for (let el of newEls) {
                if (el.getAttribute("uuid") === activeUUID) {
                    let newInput = el.shadowRoot.querySelector("input,textarea")
                    this.setCaretPosition(newInput, selectionStart)
                }
            }
        }

        // let newInput = this.element.querySelector("compose-text-field").shadowRoot.querySelector("input")
        // this.setCaretPosition(newInput, oldInput.selectionStart)
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
            let els
            if (element.shadowRoot) {
                els = element.shadowRoot.children
            } else {
                els = element.children
            }
            for (let i = 0; i < els.length; i++) {
                children.push(els[i])
                this.getAllChildren(els[i], children)
            }
        }
        // for (let i = 0; i < children.length; i++) {
        //     if (children[i].getAttribute("uuid") === null) {
        //         children.splice(i, 1)
        //     }
        // }
        return children
    }

    findActiveElement(element) {
        if (element.shadowRoot) {
            let els = Array.from(element.shadowRoot.querySelectorAll("*"))
            let activeEl = els.find(el => {
                return el === element.shadowRoot.activeElement
            })
            if (activeEl.getAttribute("uuid")) {
                for (let i = 0; i < els.length; i++) {
                    if (element.shadowRoot.activeElement === els[i]) {
                        return this.findActiveElement(els[i])
                    }
                }
            } else {
                return activeEl
            }
        }
        return element
    }

    getElementHost(element) {
        if (element.parentNode.host) {
            return element.parentNode.host
        }
        return this.getElementHost(element.parentNode)
    }
}


export { Scope }
