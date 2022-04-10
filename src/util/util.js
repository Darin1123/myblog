export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export function getLevel(count) {
    if (count > 2) {
        return 3;
    }
    return count;
}

export function randomlyPick(array) {
    return array[Math.floor(Math.random() * array.length)];
}
