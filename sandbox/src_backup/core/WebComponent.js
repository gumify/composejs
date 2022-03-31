import { State } from "./State"

const WebComponent = {
    wasRegistered: function(s) {
        return window.customElements.get(s) !== undefined
    },
    applyStyle: function(el, style) {
        for (let key in style) {
            el.style[key] = style[key]
        }
    }
}

export { WebComponent }