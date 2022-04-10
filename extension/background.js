chrome.tabs.onUpdated.addListener(function (tab) {

	chrome.scripting.executeScript({
		target: {tabId: tab, allFrames: true},
		files: ['inject.js'],
	}).then(console.log);

	chrome.scripting.insertCSS({
		target: {tabId: tab, allFrames: true},
		files: ['inject.css'],
	}).then(console.log);
});