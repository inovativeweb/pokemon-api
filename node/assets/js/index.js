



function connectws() {       //Se conecteaza websocket la server si se proceseaza mesajele venite
    ws = new WebSocket("ws://" + window.location.hostname + ":8088");

    ws.onmessage = function (event) {
        var received = JSON.parse(event.data);
        console.log(received);

        //         $("#sel_data_msg").html("");
        switch (received.content) {

            case "get_statics":
                data = received.data[0]

                $('.loading').removeClass('loading')
                $('#team_numbers').text(data.teams)
                $('#pokemon_numbers').text(data.pokemons)
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



$(function(){
    set_active('home');
})


setTimeout(function () {
    post_via_ws("get_statics", []);
}, 100)




