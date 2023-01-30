chrome.tabs.onUpdated.addListener(function (tab) {

	chrome.scripting.executeScript({
		target: {tabId: tab, allFrames: true},
		files: ['inject.js'],
	}).then((...args) => { console.log('executeScript', ...args); });

	chrome.scripting.insertCSS({
		target: {tabId: tab, allFrames: true},
		files: ['inject.css'],
	}).then((...args) => { console.log('insertCSS', ...args); });
});