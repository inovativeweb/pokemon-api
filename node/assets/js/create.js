
function connectws() {       //Se conecteaza websocket la server si se proceseaza mesajele venite
    ws = new WebSocket("ws://" + window.location.hostname + ":8088");

    ws.onmessage = function (event) {
        var received = JSON.parse(event.data);
        console.log(received);

        //         $("#sel_data_msg").html("");
        switch (received.content) {

            case "create_team":
                window.location = "/team/"+received.insertId+"/edit";       
                break;
            case "pokemons_data":
                console.log(received.data)
                break;
            default: ws_msg(received);  //daca vrei sa mai incerci variante...
        }
    }

    ws.onopen = function () {
        console.log('WSocket is open...');  //daca vrei sa initiezi o comunicatie in momentulm in care sa stabilit conexiunea
    }

    ws.onclose = function (event) {
        console.log('Socket is closed. Reconnect will be attempted in 1 second.', event.reason);
        //        $("#sel_data_msg").html("Se încearcă reconectarea la server..."); //
        setTimeout(function () {    //Se incearca reconectarea ws
            ws = null;
            connectws();
        }, 1000);
    };

    ws.onerror = function (err) {
        console.error('Socket encountered error: ', err, 'Closing socket');
        ws.close();
    };
}

connectws();




function create_new_team() {
    msg = '';
    $('.field').removeClass('error')
    $('.message').hide().find('.message_content').html('');
    team_name = $('[name=team_name]');

    if (team_name.val().length < 2) { msg += 'Please fill Team name<br>'; team_name.closest('.field').addClass('error') }

    if (msg.length > 0 ) {
        $('.message').addClass('red').show().find('.message_content').html(msg);
        return;
    } else { //form validated
        var curent_date = GetTodayDate();
        $('.form').addClass('loading');
        post_via_ws('create_team',[[team_name.val(),curent_date]]);
        //request_http_pokemon();
    }
}

$(function () {
    set_active('create');
})
$('title').html($('title').html() + '>Create Teams');