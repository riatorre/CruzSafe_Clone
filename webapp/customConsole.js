/*
 * customConsole.js
 * Customized console that adds a date and timestamp to all console messages.
 */

export function log(msg) {
    console.log('[' + new Date().toLocaleDateString() + ': ' + new Date().toLocaleTimeString() + '] ' + msg);
}

export function warn(msg) {
    console.warn('[' + new Date().toLocaleDateString() + ': ' + new Date().toLocaleTimeString() + '] ' + msg);
}

export function error(msg) {
    console.error('[' + new Date().toLocaleDateString() + ': ' + new Date().toLocaleTimeString() + '] ' + msg);
}