function refreshServers() {
    $.ajax({
        url: '/clear',
        type: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        data: JSON.stringify({
          'name': 'guilds'
        }),
        success: function (data) {
          // window.location.reload();
        }
    });
}
