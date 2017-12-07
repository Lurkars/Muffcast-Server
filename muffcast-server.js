console.log("muffcast server v0.1");

var player;

var loaded = function() {
	if (document.readyState === 'complete') {
		setTimeout(function() {
			browser.runtime.sendMessage("loaded");
		}, 500);
	}
}

loaded();

document.onreadystatechange = function() {
	loaded();
}

var getPlayer = function(message) {
	return new Promise(function(resolve, reject) {
		var host = window.location.hostname;
		switch (host) {
			case "www.zdf.de":
				setTimeout(function() {
					document.getElementsByClassName("zdfplayer-start-icon")[0].click();
					resolve(document.getElementsByTagName(message.type)[message.index]);
				}, 500)
				break;
			default:
				resolve(document.getElementsByTagName(message.type)[message.index]);
		}
	})
}

browser.runtime.onMessage.addListener(function(message) {
	console.log("client", message);
	switch (message.command) {
		case "status":
			var status = {
				"api": "muffcast - server v0.1",
				"running": false
			}
			if (player) {
				status.running = true;
				status.paused = player.paused;
				status.playing = !player.paused;
				status.currentTime = player.currentTime;
				status.volume = player.volume;
				status.muted = player.muted;
				status.duration = player.duration;
				status.index = player.index;
				status.type = player.tagName;
				status.url = encodeURIComponent(window.location.href);
				status.host = encodeURIComponent(window.location.hostname);
				status.title = document.title;
			}
			browser.runtime.sendMessage(status);
			break;
		case "load":
			if (message.index >= 0) {
				getPlayer(message).then(function(response) {
					player = response;
					if (player) {
						player.currentTime = message.seek;
						player.volume = message.volume;
						player.muted = message.muted;
						player.play();
						player.index = message.index;
						player.loaded = false;
						player.addEventListener("canplay", function(event) {
							if (!player.loaded) {
								browser.runtime.sendMessage("ok");
								player.loaded = true;
							}
						})

						// DEBUG TIMEOUT FOR FOCUS
						setTimeout(function() {
							if (player.requestFullscreen) {
								player.requestFullscreen();
							} else if (player.mozRequestFullScreen) {
								player.mozRequestFullScreen();
							} else if (player.webkitRequestFullScreen) {
								player.webkitRequestFullScreen();
							} else if (player.msRequestFullscreen) {
								player.msRequestFullscreen();
							}
						}, 3000);

					} else {
						browser.runtime.sendMessage("no player found for given index");
					}
				});
			} else {
				browser.runtime.sendMessage("no index specified");
			}
			break;
		case "play":
			if (player) {
				if (message.seek) {
					player.currentTime = message.seek;
				}
				player.play();
				browser.runtime.sendMessage("ok");
			} else {
				browser.runtime.sendMessage("no player loaded");
			}
			break;
		case "pause":
			if (player) {
				if (message.seek) {
					player.currentTime = message.seek;
				}
				player.pause();
				browser.runtime.sendMessage("ok");
			} else {
				browser.runtime.sendMessage("no player loaded");
			}
			break;
		case "seek":
			if (player) {
				if (message.seek) {
					player.currentTime = message.seek;
					browser.runtime.sendMessage("ok");
				} else {
					browser.runtime.sendMessage("no seek specified");
				}
			} else {
				browser.runtime.sendMessage("no player loaded");
			}
			break;
		case "volume":
			if (player) {
				if (message.volume) {
					player.volume = message.volume;
					browser.runtime.sendMessage("ok");
				} else {
					browser.runtime.sendMessage("no volume specified");
				}
			} else {
				browser.runtime.sendMessage("no player loaded");
			}
			break;
		case "mute":
			if (player) {
				player.muted = message.muted;
				browser.runtime.sendMessage("ok");
			} else {
				browser.runtime.sendMessage("no player loaded");
			}
			break;
		default:
			browser.runtime.sendMessage("unknown command");
			break;
	}
})
