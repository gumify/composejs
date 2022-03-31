import { Compose } from "../src/core/Compose"
import { Text } from "../src/composable/Text"
import { Overflow, Shape } from "../src/core/constants"
import { Button } from "../src/composable/Button"
import { Box } from "../src/composable/Box"
import { TextField } from "../src/composable/TextField"


const App = scope => {
    Box({
        content: scope => {
            let title = scope.stateOf("Hello, World")
            Text({ text: title.value }, scope)

            Box({
                content: scope => {
                    let someText = scope.stateOf("hello")

                    Box({ 
                        content: scope => {
                            Box({
                                content: scope => {
                                    // scope.id = 4
                                    Text({ text: someText.value }, scope)
                                    TextField({
                                        value: someText.value,
                                        onChange: value => {
                                            someText.value = value
                                        }
                                    }, scope)
                                }
                            }, scope)
                        }
                    }, scope)

                }
            }, scope)

            
            // console.log("Called")
                    
            Button({
                content: scope => {
                    Text({ text: "click me" }, scope)
                },
                onClick: e => {
                    title.value = "I am OK!"
                }
            }, scope)
        }
    }, scope)
}

new Compose("#app").mount(App)
