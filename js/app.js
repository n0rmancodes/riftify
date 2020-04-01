resize();
wakeServer();

function search() {
	if (!document.getElementById("searchQ").value == "") {
		document.getElementById("home").style.display = "none";
		const req = new XMLHttpRequest();
		if (document.getElementById("sType").value == "t") {
			var s = "https://riftify.herokuapp.com/?search=" + document.getElementById("searchQ").value;
		} else if (document.getElementById("sType").value == "ar") {
			var s = "https://riftify.herokuapp.com/?search=" + document.getElementById("searchQ").value + "&type=artist";
		} else if (document.getElementById("sType").value == "al") {
			var s = "https://riftify.herokuapp.com/?search=" + document.getElementById("searchQ").value + "&type=album";
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
						openSong(this.id);
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
		document.getElementById("cpTitle").innerHTML = d.metadata.title_short;
		document.getElementById("cpArtist").innerHTML = d.metadata.artist.name;
		document.getElementById("cpAlbum").innerHTML = d.metadata.album.title;
		document.getElementById("cpPic").src = d.metadata.album.cover_big;
		
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