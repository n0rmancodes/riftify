resize();
wakeServer();
sessionStorage.removeItem("requiresRefresh");

setInterval(function() {
	if (document.getElementById("player").src && !document.getElementById("player").ended) {
		sessionStorage.setItem("curPlayProg", document.getElementById("player").currentTime);
		console.log("saved progress point: " + document.getElementById("player").currentTime);
	}
}, 10000)

document.getElementById('player').addEventListener('ended', function() {
	togglePlay("pause");
})

if (sessionStorage.getItem("curPlayId")) {
	openSong(sessionStorage.getItem("curPlayId"), "onLoad");
	if (sessionStorage.getItem("curPlayProg")) {
		document.getElementById("player").currentTime = sessionStorage.getItem("curPlayProg");
	}
}	

if (!localStorage.getItem("forceLower")) {
	localStorage.setItem("forceLower", "d");
	document.getElementById("forceLower").value = "d";
} else {
	document.getElementById("forceLower").value = localStorage.getItem("forceLower");
}

if (!localStorage.getItem("hidePlayer")) {
	localStorage.setItem("hidePlayer", "d");
	document.getElementById("hidePlayer").value = "d";
} else {
	document.getElementById("hidePlayer").value = localStorage.getItem("hidePlayer");
	if (localStorage.getItem("hidePlayer") == "e") {
		document.getElementById("hPlayer").style.display = "none";
	}
}

function search() {
	if (!document.getElementById("searchQ").value == "") {
		document.getElementById("home").style.display = "none";
		document.getElementById("settingsPage").style.display = "none";
		document.getElementById("settingsBtn").innerHTML = "settings";
		const req = new XMLHttpRequest();
		if (document.getElementById("sType").value == "t") {
			var s = "https://riftifyapi.herokuapp.com/?search=" + document.getElementById("searchQ").value;
		} else if (document.getElementById("sType").value == "ar") {
			var s = "https://riftifyapi.herokuapp.com/?search=" + document.getElementById("searchQ").value + "&type=artist";
		} else if (document.getElementById("sType").value == "al") {
			var s = "https://riftifyapi.herokuapp.com/?search=" + document.getElementById("searchQ").value + "&type=album";
		}
		req.open("GET", s);
		req.send();
		req.onload=(e)=>{
			document.getElementById("results").style.display = "block";
			var d = JSON.parse(req.responseText);
			document.getElementById("resultsC").innerHTML = "";
			for (var c in d.data) {
				var song = document.createElement("DIV");
				song.id = "re" + d.data[c].id;
				song.classList.add("songResult");
				song.style = "display:block;"
				if (d.data[c].type == "track") {
					song.onclick = function () {
						openSong(this.id, "search");
					}
					document.getElementById("resultsC").appendChild(song);
					var cover = document.createElement("IMG");
					cover.src = d.data[c].album.cover_medium;
					cover.classList.add("albumCover");
					document.getElementById("re" + d.data[c].id).appendChild(cover);
					var metaDiv = document.createElement("DIV");
					metaDiv.classList.add("songResultMeta");
					metaDiv.id = "re" + c + "m"
					document.getElementById("re" + d.data[c].id).appendChild(metaDiv)
					var title = document.createElement("H3");
					title.innerHTML = d.data[c].title;
					document.getElementById("re"+c+"m").appendChild(title);
					var artist = document.createElement("H4");
					artist.innerHTML = d.data[c].artist.name;
					document.getElementById("re"+c+"m").appendChild(artist);
					var album = document.createElement("H4");
					album.innerHTML = d.data[c].album.title;
					document.getElementById("re"+c+"m").appendChild(album);
				} else if (d.data[c].type == "artist") {
					document.getElementById("resultsC").appendChild(song);
					var cover = document.createElement("IMG");
					cover.src = d.data[c].picture_medium;
					cover.classList.add("albumCover");
					document.getElementById("re"+d.data[c].id).appendChild(cover);
					var metaDiv = document.createElement("DIV");
					metaDiv.classList.add("songResultMeta");
					metaDiv.id = "re" + c + "m"
					document.getElementById("re" + d.data[c].id).appendChild(metaDiv)
					var title = document.createElement("H3");
					title.innerHTML = d.data[c].name;
					document.getElementById("re"+c+"m").appendChild(title);
					var albN = document.createElement("H4");
					albN.innerHTML = d.data[c].nb_album.toLocaleString() + " albums released";
					document.getElementById("re"+c+"m").appendChild(albN);
					var fanNum = document.createElement("H4");
					fanNum.innerHTML = d.data[c].nb_fan.toLocaleString() + " Deezer fans";
					document.getElementById("re"+c+"m").appendChild(fanNum);
				} else if (d.data[c].type == "album") {
					document.getElementById("resultsC").appendChild(song);
					var cover = document.createElement("IMG");
					cover.src = d.data[c].cover_medium;
					cover.classList.add("albumCover");
					document.getElementById("re"+d.data[c].id).appendChild(cover);
					var metaDiv = document.createElement("DIV");
					metaDiv.classList.add("songResultMeta");
					metaDiv.id = "re" + c + "m"
					document.getElementById("re" + d.data[c].id).appendChild(metaDiv)
					var title = document.createElement("H3");
					title.innerHTML = d.data[c].title;
					document.getElementById("re"+c+"m").appendChild(title);
					var artist = document.createElement("H4");
					artist.innerHTML = d.data[c].artist.name;
					document.getElementById("re"+c+"m").appendChild(artist);
					var trackN = document.createElement("H4");
					trackN.innerHTML = d.data[c].nb_tracks.toLocaleString() + " tracks";
					document.getElementById("re"+c+"m").appendChild(trackN);
				}
			}
		}
	} else {
		document.getElementById("results").style.display = "none";
	}
}

function openSong(songId, fSrc) {
	if (fSrc && fSrc == "search") {
		var sId = parseInt(songId.substring(2));
	} else {
		var sId = parseFloat(songId);
	}
	const req = new XMLHttpRequest();
	req.open("GET", "https://riftifyapi.herokuapp.com/?getSong=" + sId);
	req.send();
	togglePlay("pause");
	req.onload=(e)=>{
		sessionStorage.setItem("curPlayId", sId)
		var d = JSON.parse(req.responseText)
		if (!d.formats.url) {
			if (d.formats[0].isDashMPD == true) {
				req.open("GET", "https://coorsproxyunlimited.herokuapp.com/" + d.formats[0].url);
				req.send();
				req.onload=(e)=>{
					var rsp = req.responseText
					var playerSrc1 = rsp.split("<BaseURL>")[1]
					var playerSrc = playerSrc1.split("/</BaseURL><SegmentList><Initialization sourceURL")[0];
					document.getElementById("player").src = playerSrc;
				}
			} else {
				var playerSrc = d.formats[0].url;
				document.getElementById("player").src = playerSrc;
			}
		} else {
			console.log("fuck")
		}
		if (fSrc == "onLoad") {
			togglePlay("pause");
		} else {
			togglePlay("play");
		}
		document.getElementById("pBtn").removeAttribute("disabled");
		if (!localStorage.getItem("forceLower") == "d") {
			document.getElementById("cpTitle").innerHTML = d.metadata.title_short;
			document.getElementById("cpArtist").innerHTML = d.metadata.artist.name;
			document.getElementById("cpAlbum").innerHTML = d.metadata.album.title;
		} else {
			document.getElementById("cpTitle").innerHTML = d.metadata.title_short.toLowerCase();
			document.getElementById("cpArtist").innerHTML = d.metadata.artist.name.toLowerCase();
			document.getElementById("cpAlbum").innerHTML = d.metadata.album.title.toLowerCase();
		}
		sessionStorage.setItem("embedId", d.yId);
		document.title = d.metadata.title_short + " - " + d.metadata.artist.name + " | riftify";
		document.getElementById("cpPic").src = d.metadata.album.cover_big;
		document.getElementById("hPlayer").style.display = "";
	}
}

function getDash(parentString, substring) {
    return parentString.substring(parentString.indexOf(substring) + substring.length)
}

function home() {
	if (!sessionStorage.getItem("requiresRefresh")) {
		document.getElementById("home").style.display = "";
		document.getElementById("results").style.display = "none";
		document.getElementById("settingsPage").style.display = "none";
		document.getElementById("settingsBtn").onClick = function() {
			openSettings();
		}
	} else {
		location.reload();
	}
}

function resize() {
	var w = window.innerWidth;
	if (w > 900) {
		document.getElementById("style").href = "css/main.css";
	} else {
		document.getElementById("style").href = "css/mobile.css";
	}
}

function openSettings() {
	if (document.getElementById("settingsPage").style.display == "") {
		document.getElementById("settingsBtn").innerHTML = "settings";
		home();
	} else {
		document.getElementById("home").style.display = "none";
		document.getElementById("results").style.display = "none";
		document.getElementById("settingsPage").style.display = "";
		document.getElementById("settingsBtn").innerHTML = "close settings";
	}
}

function change(setting) {
	if (setting == "hidePlayer") {
		localStorage.setItem("hidePlayer", document.getElementById("hidePlayer").value);
	} else if (setting == "forceLower") {
		localStorage.setItem("forceLower", document.getElementById("forceLower").value);
		sessionStorage.setItem("requiresRefresh", "y");
		document.getElementById("settingsBtn").innerHTML = "close settings (requires reload)";
	}
}

function wakeServer() {
	const req = new XMLHttpRequest();
	req.open("GET", "https://riftifyapi.herokuapp.com/?search=test");
	req.send();
	req.onload = function() {
		if (req.status == 200) {
			document.getElementById("searchQ").removeAttribute("disabled");
		} else {
			console.log("server is down");
		}
	}
}

function togglePlay(frc) {
	if (!frc) {
		if (document.getElementById("pBtn").innerHTML == "play") {
			document.getElementById("player").play();
			document.getElementById("pBtn").innerHTML = "pause";
		} else {
			document.getElementById("player").pause();
			document.getElementById("pBtn").innerHTML = "play";
		}
	} else if (frc) {
		if (frc == "play") {
			document.getElementById("player").play();
			document.getElementById("pBtn").innerHTML = "pause";
		} else {
			document.getElementById("player").pause();
			document.getElementById("pBtn").innerHTML = "play";
		}
	}
}

function toggleLoop() {
	if (document.getElementById("loopBtn").classList.contains("activeBtn")) {
		document.getElementById("player").removeAttribute("loop");
		document.getElementById("loopBtn").classList.remove("activeBtn");
	} else {
		document.getElementById("player").setAttribute("loop", "true");
		document.getElementById("loopBtn").classList.add("activeBtn");
	}
}

function embedVideo() {
	if (sessionStorage.getItem("embedId")) {
		togglePlay("pause");
		document.getElementById("embedOverlay").style.display = "";
		if (document.getElementById("loopBtn").classList.contains("activeBtn")) {
			if (sessionStorage.getItem("curPlayProg")) {
				document.getElementById("ytPlayer").src = "https://www.youtube-nocookie.com/embed/" + sessionStorage.getItem("embedId") + "/?autoplay=true&loop=true&start=" + Math.round(parseInt(sessionStorage.getItem("curPlayProg")));
			} else {
				document.getElementById("ytPlayer").src = "https://www.youtube-nocookie.com/embed/" + sessionStorage.getItem("embedId") + "/?autoplay=true&loop=true";
			}
		} else {
			if (sessionStorage.getItem("curPlayProg")) {
				document.getElementById("ytPlayer").src = "https://www.youtube-nocookie.com/embed/" + sessionStorage.getItem("embedId") + "/?autoplay=true&start=" + Math.round(parseInt(sessionStorage.getItem("curPlayProg")));
			} else {
				document.getElementById("ytPlayer").src = "https://www.youtube-nocookie.com/embed/" + sessionStorage.getItem("embedId") + "/?autoplay=true";
			}
		}
	} else {
		return;
	}
}

function hideOverlay(ol) {
	if (!ol) {
		return;
	} else if (ol == 'embed') {
		document.getElementById("ytPlayer").src = "about:blank";
		document.getElementById("embedOverlay").style.display = "none";
	}
}