import { Compose } from "../src/core/Compose"
import { Text } from "../src/composable/Text"
import { JustifyContent, Overflow, Shape } from "../src/core/constants"
import { Button } from "../src/composable/Button"
import { Box } from "../src/composable/Box"
import { TextField } from "../src/composable/TextField"
import { Spacer } from "../src/composable/Spacer"
import { Column } from "../src/composable/Column"
import { Align } from "../src/core/constants"
import { OutlinedButton } from "../src/composable/OutlinedButton"
import { TextButton } from "../src/composable/TextButton"
import { HtmlView } from "../src/composable/HtmlView"

const App = scope => {
    let text = scope.stateOf("hello")
    let isDisabled = scope.stateOf(false)

    Column({
        modifier: Modifier.padding(10),
        content: scope => {
            TextField({
                value: text.value,
                disabled: isDisabled.value,
                label: "Message",
                onChange: (value, e) => {
                    text.value = value
                }
            }, scope)

            HtmlView({
                modifier: Modifier.background("#333").padding({start: 20, end: 20}),
                factory: () => {
                    let el = document.createElement("div")
                    el.innerHTML = `<iframe width="560" height="315" src="https://www.youtube.com/embed/987Hc6fxXJ4" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`
                    return el
                },
                update: el => {
                }
            }, scope)

            Text({ 
                text: text.value,
                modifier: Modifier.clickable(e => {
                    alert(text.value)
                })
            }, scope)

            TextButton({
                content: scope => {
                    Text({ text: "Button" }, scope)
                },
                onClick: e => {
                    isDisabled.value = !isDisabled.value
                }
            }, scope)
        }
    }, scope)
}


const Content = (scope, name) => {
    let text = scope.stateOf(name)
    Text({ text: text.value }, scope)

    // setTimeout(() => text.value = `Random: ${Math.random()}`, 1000)
}

new Compose("#app").mount(App)
