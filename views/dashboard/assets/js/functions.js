let stop = false;

function refreshServers() {
    if (stop == true) return;
    $.ajax({
        url: '/refreshGuilds',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({
          'name': 'guilds'
        }),
        beforeSend: function(xhr){
           xhr.withCredentials = true;
        },
        success: function (data) {
          window.location.reload();
          stop = true;
        },
        error: function (data) {
          console.log(data.responseJSON);
          alert(data.responseJSON.status);
        }
    });
}
