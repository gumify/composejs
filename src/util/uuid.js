/* this is just hack to generate static uuid, but I need to find a better way to do. */
function uuid() {
    let e = new Error()
    console.log(e)
    // e = e.stack.split("\n")[2].split(":")
    e = e.stack.split("\n")[3].split(":")
    let col = e.pop().replace(")", "")
    let row = e.pop()
    let id = `${row}:${col}`
    console.log(id)
    return id
}


export { uuid }
