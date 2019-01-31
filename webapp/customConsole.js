/*
 * customConsole.js
 * Customized console that adds a date and timestamp to all console messages.
 */

exports.log = (msg) => {
	console.log('['+new Date().toLocaleDateString()+': '+new Date().toLocaleTimeString()+'] ' + msg);
};

exports.warn = (msg) => {
	console.warn('['+new Date().toLocaleDateString()+': '+new Date().toLocaleTimeString()+'] ' + msg);
};

exports.error = (msg) => {
	console.error('['+new Date().toLocaleDateString()+': '+new Date().toLocaleTimeString()+'] ' + msg);
};