export function keyFromAction(action) {
    return btoa(JSON.stringify(action.payload))
}