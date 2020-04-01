resize();
wakeServer();

function search() {
	if (!document.getElementById("searchQ").value == "") {
		document.getElementById("home").style.display = "none";
		document.getElementById("loadingTxt").style.display = "";
		document.getElementById("results").style.display = "none";
		const req = new XMLHttpRequest();
		req.open("GET", "https://riftify.herokuapp.com/?search=" + document.getElementById("searchQ").value);
		req.send();
		req.onload=(e)=>{
			document.getElementById("loadingTxt").style.display = "none";
			document.getElementById("results").style.display = "block";
			var d = JSON.parse(req.responseText);
			document.getElementById("results").innerHTML = "";
			for (var c in d.data) {
				var song = document.createElement("DIV");
				song.onclick = function () {
					openSong(this.id);
				}
				song.id = "re" + d.data[c].id;
				song.classList.add("songResult");
				song.style = "display:block;"
				document.getElementById("results").appendChild(song);
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
			}
		}
	} else {
		document.getElementById("results").style.display = "none";
	}
}

function openSong(songId) {
	var sId = parseInt(songId.substring(2));
	const req = new XMLHttpRequest();
	req.open("GET", "http://riftify.herokuapp.com/?getSong=" + sId);
	req.send();
	document.getElementById("player").pause()
	req.onload=(e)=>{
		var d = JSON.parse(req.responseText)
		var playerSrc = d.formats[0].url;
		document.getElementById("player").src = playerSrc;
		document.getElementById("player").play();
	}
}

function home() {
	document.getElementById("home").style.display = "";
	document.getElementById("results").style.display = "none";
}

function resize() {
	var w = window.innerWidth;
	if (w > 900) {
		document.getElementById("style").href = "css/main.css";
	} else {
		document.getElementById("style").href = "css/mobile.css";
	}
}

function wakeServer() {
	const req = new XMLHttpRequest();
	req.open("GET", "https://riftify.herokuapp.com/?search=test");
	req.send();
	req.onload = function() {
		if (req.status == 200) {
			document.getElementById("searchQ").removeAttribute("disabled");
		} else {
			console.log("server is down");
		}
	}
}