function saveOptions(e) {
	e.preventDefault();
	browser.storage.local.set({
		"muffcast": {
			"unsplashInterval": document.querySelector("#muffcast-unsplash-interval").value,
			"unsplashCredit": document.querySelector("#muffcast-unsplash-credit").value,
			"unsplashClient": document.querySelector("#muffcast-unsplash-client").value
		}
	});
}

function restoreOptions() {
	browser.storage.local.get("muffcast").then(function(result) {
		document.querySelector("#muffcast-unsplash-interval").value = result.muffcast && result.muffcast.unsplashInterval || 8000;
		document.querySelector("#muffcast-unsplash-credit").value = result.muffcast && result.muffcast.unsplashCredit || "";
		document.querySelector("#muffcast-unsplash-client").value = result.muffcast && result.muffcast.unsplashClient || "";
	});
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
