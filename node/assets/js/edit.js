var pagename = 'edit';

function connectws() {       //Se conecteaza websocket la server si se proceseaza mesajele venite
    ws = new WebSocket("ws://" + window.location.hostname + ":8088");

    ws.onmessage = function (event) {
        var received = JSON.parse(event.data);
        //  console.log(received);

        //         $("#sel_data_msg").html("");
        switch (received.content) {

            case "https_raspuns_pokemon":

                raspuns = JSON.parse(received.data);
                pokemon = JSON.parse(received.pokemon);
                $('.message').show().addClass('blue').find('.message_content').html(raspuns.count + ' available. Picking one...');

                image = '';
                sprites = (pokemon.sprites);
                abilities = pokemon.abilities
                pokemon_id = pokemon.id
                types = pokemon.types
                nameX = (pokemon.forms[0]); name = nameX.name; name = $.ucfirst(name)
                base_experience = pokemon.base_experience
                ability_name = name + ' has '
                type_name = name + ' is '
                type_filter = []


                for (var key in sprites) {
                    if (sprites[key]) {
                        image = sprites[key]
                    }
                }
                for (var key in abilities) {
                    ability = abilities[key]
                    for (var k in ability) {
                        if (k === 'ability') {
                            ability_name += ' ' + ability[k].name + ' and'
                        }
                    }
                }
                ability_name = ability_name.substring(0, ability_name.length - 3)

                for (var keyt in types) {
                    type = types[keyt]
                    for (var kt in type) {
                        if (kt === 'type') {
                            type_name += ' ' + type[kt].name + ' and';
                            type_filter.push(type[kt].name)

                        }
                    }
                }
                type_name = type_name.substring(0, type_name.length - 3)



                new_pokemon = {}
                new_pokemon.name = name;
                new_pokemon.pokemon_id = pokemon_id;
                new_pokemon.team_id = $('[name=team_id]').val()
                new_pokemon.base_experience = base_experience;
                new_pokemon.image = image;
                new_pokemon.ability_name = ability_name;
                new_pokemon.type_name = type_name;


                var array = $.map(new_pokemon, function (value, index) {
                    return [value];
                });
                setTimeout(function () {
                    post_via_ws("add_pokemon_to_team", [array]);
                }, 10)



                new_type = {}
                new_type.pokemon_id = parseInt(pokemon_id)
                new_type.team_id = $('[name=team_id]').val()

                $(type_filter).each(function (k, type_name) {
                    new_type.type_name = type_name
                    var array_types = $.map(new_type, function (value, index) {
                        return [value];
                    });

                    post_via_ws("insert_pokemon_type", [[new_type.pokemon_id, new_type.team_id, new_type.type_name]]);
                })
             //    html = list_pokemon_field(new_pokemon);
                $('#receiver_data').html(html);
                $('#create_zone').find('.form').removeClass('loading')
                setTimeout(function () {
                    $('#receiver_data').find('.loading').removeClass('loading')
                    //  request_http_one_pokemon(pokemon.url)
                }, 10)


                setTimeout(function () {
                    $('.message').hide().removeClass('blue').find('.message_content').html('');
                }, 20)
                $('.message').hide()
                $('.loading').removeClass('loading')
                break;

            case "get_team_data":
                rasp = received.data[0]
               // console.log(received);
                $('[name=team_name]').val(rasp.team_name)

                $('.form').removeClass('loading')
                break;

            case "get_team_pokemons":
                html = ''
                rasp = received.data
                html = list_team_row(rasp, true)
                html += list_table_header();
                html += list_table(rasp);
                html += list_table_footer();
                $('#receiver_data').html(html)
                addTextByDelay2($('[name=team_name]').val(), $('.team_name'), 50);
                $('.form').removeClass('loading')
                break;

            case "create_team":
            case "deleted_pokemon_from_team":
                setTimeout(function () {
                    post_via_ws("get_team_data", [$('[name=team_id]').val()]);
                    post_via_ws("get_team_pokemons", [$('[name=team_id]').val()]);
                }, 1000);
                break;



            default: console.log('Unhandeled WS message', received);  //daca vrei sa mai incerci variante...
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



function request_http_pokemon() {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({
        api: 'request_http_pokemon',
        data: []
    }));
    else {  // reincearca pentru redundata...
        setTimeout(post_via_ws(command_send, data_send), 1000);
        return;
    }
}

function get_pokemon() {
    $('#receiver_data').closest('.form').addClass('loading')
    msg = '';
    $('.field').removeClass('error')
    $('.message').hide().find('.message_content').html('');
    team_name = $('[name=team_name]');

    if (team_name.val().length < 2) { msg += 'Please fill Team name<br>'; team_name.closest('.field').addClass('error') }

    if (msg.length > 0) {
        $('.message').addClass('red').show().find('.message_content').html(msg);
        return;
    } else { //form validated
        request_http_pokemon();
    }
}

$(function () {
    //  set_active('create');
    setTimeout(function () {
        post_via_ws("get_team_data", [$('[name=team_id]').val()]);
        post_via_ws("get_team_pokemons", [$('[name=team_id]').val()]);
    }, 1000)

})
$('title').html($('title').html() + '>Edit Team');

function rename_team() {
    $('.team_name').html('');
    $('.rename_btn').hide();
    var msg = '';
    $('.field').removeClass('error')
    $('.message').hide().find('.message_content').html('');
    team_name = $('[name=team_name]');

    if (team_name.val().length < 1) { msg += 'Please fill Team name<br>'; team_name.closest('.field').addClass('error') }

    if (msg.length > 0) {
        $('.message').removeClass('green').addClass('red').show().find('.message_content').html(msg);
        return;
    } else {
        post_via_ws("rename_team", [team_id, $('[name=team_name]').val()]);
        $('.message').addClass('green').show().find('.message_content').html('Saved');


        setTimeout(function () {
            addTextByDelay2($('[name=team_name]').val(), $('.team_name'), 50);
            $('.message').hide().find('.message_content').html('');
            $('.rename_btn').show();
        }, 1500)
    }
}

function delete_team() {
    post_via_ws("delete_team", [team_id]);
    post_via_ws("delete_pokemons", [team_id]);
    localStorage.setItem('list_items', '')
    window.location = '/'
}

function delete_p(p) {
    post_via_ws("delete_pokemon_from_team", [team_id, p.dataset.pokemon_id]);
}