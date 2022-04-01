const app = document.querySelector("#app")
let stack = []
let prevStack = []


function Text({ text }, id) {
    let el = document.createElement("div")
    el.textContent = text.value
    stack.push( { el: el, states: { text: text }, type: "text" } )
}

let state = { value: "hello" }

function App() {
    Text({ text: state }, 1)
}


function compose() {
    stack = []
    App()
    for (let s of stack) {
        app.appendChild(s.el)
    }
    prevStack = Array.from(stack)
}


function recomposeText(el, states) {
    el.textContent = states.text.value
}

function recompose() {

    for (let s of stack) {
        if (s.type == "text") {
            recomposeText(s.el, s.states)
        }
    }
}


compose()

setTimeout(() => {
    state.value = "world"
    recompose()
    console.log("recomposed")
}, 3000)
