import { Compose } from "../src/core/Compose"
import { Text } from "../src/composable/Text"
import { JustifyContent, Overflow, Shape } from "../src/core/constants"
import { Button } from "../src/composable/Button"
import { Box } from "../src/composable/Box"
import { TextField } from "../src/composable/TextField"
import { Spacer } from "../src/composable/Spacer"
import { Column } from "../src/composable/Column"
import { Align } from "../src/core/constants"

const App = scope => {
    Box({
        content: scope => {
            Text({ text: "hello" }, scope)
        }
    }, scope)
    Box({
        content: scope => {
            Text({ text: "hello" }, scope)
        }
    }, scope)
}


const Content = (scope, name) => {
    let text = scope.stateOf(name)
    Text({ text: text.value }, scope)

    // setTimeout(() => text.value = `Random: ${Math.random()}`, 1000)
}

new Compose("#app").mount(App)
