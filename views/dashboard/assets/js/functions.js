function refreshServers() {
    $.ajax({
        url: '/clear',
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
        },
        error: function (data) {
          console.log(data.responseJSON);
          alert(data.responseJSON.status);
        }
    });
}
