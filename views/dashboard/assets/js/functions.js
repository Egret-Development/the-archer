function refreshServers() {
  eraseCookie("guilds");
  // window.location.reload();
}

function eraseCookie(name) {   
  document.cookie = name+'=; Max-Age=-99999999;';  
}