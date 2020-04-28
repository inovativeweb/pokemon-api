var pagename = 'list';

function connectws() {       //Se conecteaza websocket la server si se proceseaza mesajele venite
    ws = new WebSocket("ws://" + window.location.hostname + ":8088");

    ws.onmessage = function (event) {
        var received = JSON.parse(event.data);
        //  console.log(received);

        //         $("#sel_data_msg").html("");
        switch (received.content) {

            case "get_filter_type":
                var  html = '<div class="item">Show all</div>';
                $(received.data).each(function (k, row) {
                    html += '<div class="item">' + $.ucfirst(row.type_name) + ' </div>';
                })
                $('.scrolling.menu').html(html);
                    $('.ui.dropdown')
                    .dropdown({
                    onChange: function(value, text, $selectedItem) {
                        filter_type(value);
                    }
                    })
                    ;

                break;

            case "get_list_filtered":
                html = '';
                $(received.data).each(function (k, row) {
                    html += list_team_row(row, false);
                })

                $('#receiver_data').html(html)
                localStorage.setItem("list_items", html);

                $('.loading').removeClass('loading');
                $('.form.raised').show()
                break;

            case "get_list":
                html = '';
                $(received.data).each(function (k, row) {
                    html += list_team_row(row, false);
                })

                $('#receiver_data').html(html)
                localStorage.setItem("list_items", html);

                $('.loading').removeClass('loading');
                $('.form.raised').show()
                break;

            case "get_team_pokemons":
                rasp = received.data
                team_id = received.team_id
                // html = list_team_row(rasp,true)
                html = list_table_header();
                html += list_table(rasp);
                html += list_table_footer();
                $('#table_zone_lists_' + team_id).html(html)
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



set_active('list');

setTimeout(function () {

    post_via_ws("get_filter_type", []);

    if ($('#cache_icon').hasClass('grey')) {  //no cache
        setTimeout(function () {
            post_via_ws("get_list", []);
        }, 100)
    } else {
        if (localStorage.getItem("list_items") != null) {
            var html = localStorage.getItem("list_items");
            if (html != null && html.length > 500) {
                $('#receiver_data').html(html)
                $('.loading').removeClass('loading');
                $('.form.raised').show()
            } else {
                post_via_ws("get_list", []);
            }
        } else {
            post_via_ws("get_list", []);
        }

    }

}, 600)

$('title').html($('title').html() + '>List Teams');

function filter_type(val) {
    if(val == 'show all'){
        post_via_ws("get_list", []);
    } else {
    post_via_ws("get_list_filtered", [val]);
    }
}