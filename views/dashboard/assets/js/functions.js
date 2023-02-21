function refreshServers() {
    $.ajax({
        url: '/remove',
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
