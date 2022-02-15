chrome.tabs.onUpdated.addListener(function (tab) {
	chrome.scripting.executeScript({
		target: {tabId: tab, allFrames: true},
		files: ['inject.js'],
	});
});