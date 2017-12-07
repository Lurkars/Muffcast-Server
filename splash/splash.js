/*
browser.tabs.query({
	currentWindow: true,
	active: true
}).then(function(tabs) {
	var tab = tabs[0];
	browser.tabs.insertCSS(tab.id, {
		code: "@font-face {	font-family: 'duospace';" +
			"src: url('" + browser.extension.getURL("fonts/iAWriterDuospace-Regular.eot") + "');" +
			"src: url('" + browser.extension.getURL("fonts/iAWriterDuospace-Regular.eot") + "?#iefix&v=4.7.0') format('embedded-opentype')," +
			"url('" + browser.extension.getURL("fonts/iAWriterDuospace-Regular.woff") + "') format('woff')," +
			"url('" + browser.extension.getURL("fonts/iAWriterDuospace-Regular.ttf") + "') format('truetype')," +
			"url('" + browser.extension.getURL("fonts/iAWriterDuospace-Regular.svg") + "') format('svg');" +
			"font - weight: normal;" +
			"font - style: normal;}"
	});
})
*/

var interval = 8000;

var unsplash = {};

browser.storage.local.get("muffcast").then(function(result) {
	interval = result.muffcast && result.muffcast.unsplashInterval || interval;
	unsplash.clientId = result.muffcast && result.muffcast.unsplashClient;
	unsplash.credit = result.muffcast && result.muffcast.unsplashCredit;

	setInterval(getUnsplash, interval);
})


var splash = {
	url: "",
	user: "",
	userUrl: ""
}

var getUnsplashRandom = function() {
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", "https://source.unsplash.com/random/1600x900", true);
	xhttp.addEventListener("load", function() {
		if (this.readyState == 4) {
			splash.url = this.responseURL;
			delete splash.description;
			delete splash.user;
			delete splash.userUrl;
			setBackground();
		}
	});
	xhttp.send();
}

var getUnsplash = function() {
	var background = document.getElementById("background");
	background.style.opacity = 0;
	if (unsplash && unsplash.clientId && unsplash.credit) {
		var xhttp = new XMLHttpRequest();
		xhttp.open("GET", "https://api.unsplash.com/photos/random?w=1600&h=900&client_id=" + unsplash.clientId, true);
		xhttp.addEventListener("load", function() {
			if (this.readyState == 4) {
				if (this.status == 200) {
					var response = this.responseText ? JSON.parse(this.responseText) : false;
					if (response) {
						splash.url = response.urls.custom;
						splash.description = response.description;
						splash.user = response.user.name;
						splash.userUrl = response.user.links.html + "?utm_source=" + unsplash.credit + "&utm_medium=referral&utm_campaign=api-credit";
						setBackground();
					}
				} else {
					getUnsplashRandom();
				}
			}
		});
		xhttp.setRequestHeader("content-type", "application/json");
		xhttp.send();
	} else {
		getUnsplashRandom();
	}
}

var setBackground = function() {
	setTimeout(function() {
		var background = document.getElementById("background");
		background.style['background-image'] = "url('" + splash.url + "')";
		background.style.opacity = 1;
		var userMeta = document.getElementById("user-meta");
		if (splash.user) {
			userMeta.classList.remove("hidden");
			var user = document.getElementById("user");
			user.href = splash.userUrl;
			user.innerHTML = splash.user;
		} else {
			userMeta.classList.add("hidden");
		}

		var description = document.getElementById("description");
		if (splash.description) {
			description.innerHTML = splash.description;
		} else {
			description.innerHTML = "";
		}
	}, 1500)
}

getUnsplash();
