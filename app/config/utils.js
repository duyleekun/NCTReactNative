export function displayListenTime(listenTime: number){
    return listenTime > 1000000 ? `${Math.floor(listenTime / 100000)/10}k` :
        listenTime > 1000 ? `${Math.floor(listenTime / 100)/10}k`: listenTime
}