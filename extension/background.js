chrome.tabs.onUpdated.addListener(function (tab) {

	chrome.scripting.executeScript({
		target: {tabId: tab, allFrames: true},
		files: ['inject.js'],
	});

	chrome.scripting.insertCSS({
		target: {tabId: tab, allFrames: true},
		files: ['inject.css'],
	});
});