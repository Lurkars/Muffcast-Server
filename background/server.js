console.log("muffcast server v0.1");

var port = browser.runtime.connectNative("muffcast");
var waitForLoad = false;

browser.windows.getCurrent().then(function(windowInfo) {
	///*
	browser.windows.update(windowInfo.id, {
		state: "fullscreen"
	});
	//*/
	///*
	browser.tabs.query({
		currentWindow: true,
		active: true
	}).then(function(tabs) {
		var tab = tabs[0];
		browser.tabs.update(tab.id, {
			url: browser.extension.getURL("splash/splash.html")
		});
	});
	//*/
})

var sendCommand = function(message) {
	browser.tabs.query({
		currentWindow: true,
		active: true
	}).then(function(tabs) {
		for (let tab of tabs) {
			browser.tabs.sendMessage(
				tab.id, message
			).catch(function(error) {
				port.postMessage(error);
			});
		}
	});
}

/*
Listen for messages from the app.
*/
port.onMessage.addListener(function(message) {
	console.log("received", message);
	if (message.command) {
		if (message.command == "load") {
			if (message && message.url) {
				browser.tabs.query({
					currentWindow: true,
					active: true
				}).then(function(tabs) {
					var tab = tabs[0];
					waitForLoad = message;
					if (tab.url != decodeURIComponent(message.url)) {
						browser.tabs.update(tab.id, {
							url: decodeURIComponent(message.url)
						});
					} else {
						sendCommand(message);
						waitForLoad = false;
					}
				});
			}
		} else
		if (message.command == "stop") {
			browser.tabs.query({
				currentWindow: true,
				active: true
			}).then(function(tabs) {
				var tab = tabs[0];
				waitForLoad = false;
				browser.tabs.update(tab.id, {
					url: browser.extension.getURL("splash/splash.html")
				}).then(function() {
					port.postMessage("ok");
				});
			});
		} else {
			sendCommand(message);
		}
	}
});

browser.runtime.onMessage.addListener(function(message) {
	if (message !== "loaded") {
		console.log("response", message);
		port.postMessage(message);
	} else if (waitForLoad) {
		sendCommand(waitForLoad);
		waitForLoad = false;
	}
})
