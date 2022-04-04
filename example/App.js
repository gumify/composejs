import { Compose } from "../src/core/Compose"
import { Text } from "../src/composable/Text"
import { Box } from "../src/composable/Box"
import { Column } from "../src/composable/Column"
import { Button } from "../src/composable/Button"
import { Spacer } from "../src/composable/Spacer"
import { Align, JustifyContent } from "../src/core/constants"
import { LaunchOnce } from "../src/core/effects"


const App = scope => {
    let counter = scope.stateOf(1)
    let interval = scope.stateOf(null)

    LaunchOnce(scope => {
        console.log("Launched Once")
        interval.value = setInterval(() => {
            counter.value++
        }, 100)
    }, scope)

    Box({
        modifier: Modifier.fillScreenSize().align(Align.Center)
            .justifyContent(JustifyContent.Center),
        content: scope => {
            Column({
                modifier: Modifier.align(Align.Center).justifyContent(JustifyContent.Center),
                content: scope => {
                    Text({ text: counter.value, textSize: 30 }, scope)
                    Button({
                        content: scope => {
                            if (interval.value === null) {
                                Text({ text: "Start" }, scope)
                            } else {
                                Text({ text: "Stop" }, scope)
                            }
                        },
                        onClick: e => {
                            if (interval.value !== null) {
                                clearInterval(interval.value)
                                interval.value = null   
                            } else {
                                interval.value = setInterval(() => {
                                    counter.value++
                                }, 100)
                            }
                        }
                    }, scope)
                }
            }, scope)
        }
    }, scope)
}


new Compose("#app").mount(App)
