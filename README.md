# ComposeJS 

A declarative toolkit for mobile application development using the JavaScript programming language.


## Composables

**Text**

The most basic way to display text is to use the `Text` composable with a `String` as an argument.

Signature:

```
function Text : Void
```

Parameters:

* `modifier: Modifier`
* `text: String`
* `color: Color, String`
* `textSize: String`
* `overflow: Overflow`
* `maxLines: Int`

Example:

```js
let state = scope.stateOf({ value: "hello, world", id: 1 })
let color = scope.stateOf({ value: "green", id: 2 })

Text({ 
    text: state.value,
    modifier: Modifier.background("yellow")
        .shape(Shape.roundedCorner({ topStart: "20px" })),
    color: color.value,
    textSize: "200px",
    overflow: Overflow.Ellipsis,
    maxLines: 1
}, scope)
```


**Button**

The most basic way to display button is to use the `Button` composable with a composable content as an argument.

Signature:

```
function Button : Void
```

Parameters:

* `modifier: Modifier`
* `onClick: Function`
* `content: Composable`

Example:

```js
Button({ 
    onClick: e => console.log("Clicked!"),
    content: scope => {
        Text({ text: "Click Me!" }, scope)
    }
}, scope)
```


## Constants

**Shape**

A shape describing the rectangle with rounded corners.

Signature:

```
const Shape : Object
```

**Overflow**

describe the text overflow.

Signature:

```
const Overflow : Object
```


**Color**

pre-defined colors.

Signature:

```
const Color : Object
```
