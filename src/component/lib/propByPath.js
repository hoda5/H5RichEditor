export function getPropByPath(obj, path, invokeFunction, root) {
    if (!path) { return obj }
    const i = path.indexOf(".")
    let v
    if (i === -1) {
        v = obj[path]
        if (invokeFunction !== false && typeof v === "function") {
            return v.call(root || obj)
        }
        return v
    } else {
        const prop = path.substr(0, i)
        path = path.substr(i + 1)
        v = obj[prop]
        if (invokeFunction !== false && typeof v === "function") {
            v = v.call(root)
        }
        if (v !== undefined) {
            return getPropByPath(v, path, invokeFunction, root || obj)
        }
    }
}