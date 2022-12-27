export default function setImmediate(callback: Parameters<typeof setInterval>[0], ...args: Parameters<typeof setInterval>[2]) {
    return setInterval(callback, 0, args);
}
