var has_cache = (localStorage.getItem("has_cache") != null && localStorage.getItem("has_cache") === '1') ? true : false;
if (has_cache) {
    $('#cache_icon').addClass('icon').addClass('server').addClass('orange')
} else {
    $('#cache_icon').addClass('icon').addClass('server').addClass('grey')
}


'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// Jquery document ready passing in JQuery so not to conflict with other
// libs that use $

(function ($) {
    var BodFlipBox = function () {
        function BodFlipBox(flipbox) {
            _classCallCheck(this, BodFlipBox);

            this.$window = $(window);
            this.$flipbox = $(flipbox);
            this.$inner = this.$flipbox.find('.flip-inner');
            this.$front = this.$flipbox.find('.flip-front');
            this.$frontImage = this.$flipbox.find('.flip-front-image');
            this.$frontContent = this.$flipbox.find('.flip-front-content');
            this.$backContent = this.$flipbox.find('.flip-back-content');
            this.backContentPadding = parseInt(this.$backContent.css('padding-top')) * 2;
            this.timer;

            // bind event callback menthods so they use class version of this
            this.mousehoverstart = this.mousehoverstart.bind(this);
            this.mousehoverleave = this.mousehoverleave.bind(this);
            this.touchstart = this.touchstart.bind(this);
            this.resize = this.resize.bind(this);
            this.debounceresize = this.debounceresize.bind(this);

            // setup events
            this.$flipbox.on('mouseenter', this.mousehoverstart);
            this.$flipbox.on('mouseleave', this.mousehoverleave);
            this.$flipbox.on('touchstart', this.touchstart);
            this.$window.on('resize', this.debounceresize);

            this.resize();
        }

        _createClass(BodFlipBox, [{
            key: 'mousehoverstart',
            value: function mousehoverstart() {
                this.$inner.addClass('hover');


            }
        }, {
            key: 'mousehoverleave',
            value: function mousehoverleave() {
                this.$inner.removeClass('hover');
            }
        }, {
            key: 'touchstart',
            value: function touchstart() {
                this.$inner.toggleClass('hover');
            }
        }, {
            key: 'debounceresize',
            value: function debounceresize() {
                // debounce : don't keep calling resize box method, only call if not resized for 0.25s
                clearTimeout(this.timer);
                this.timer = setTimeout(this.resize, 250);
            }
        }, {
            key: 'resize',
            value: function resize() {
                // we need to set the height of the flip box based on the max
                // front and back height
                // outerheight() returns height in pixels with padding and border or margin
                var height = Math.max(isNaN(this.$frontContent.height()) ? 0 : this.$frontContent.height(), isNaN(this.$backContent.height()) ? 0 : this.$backContent.height()) + this.backContentPadding;
                // this.$inner.height(height);
                this.$frontImage.height(height);
            }
        }]);

        return BodFlipBox;
    }();
    $(function () {
        $('.title').popup();
        $('.ui.checkbox').checkbox();
        // loop round all the flip boxes on the page creating an instance
        // for each one adding to an array

        window.bodFlipBoxs = [];
        $('.bod-flip-box').each(function () {
            bodFlipBoxs.push(new BodFlipBox(this));
        });
    });
})(jQuery);




$.ucfirst = function (str) {

    var text = str;


    var parts = text.split(' '),
        len = parts.length,
        i, words = [];
    for (i = 0; i < len; i++) {
        var part = parts[i];
        var first = part[0].toUpperCase();
        var rest = part.substring(1, part.length);
        var word = first + rest;
        words.push(word);

    }

    return words.join(' ');
};






function list_table_footer() {
    return ' </tbody>'
        + '</table>';
}



function GetTodayDate() {
    var tdate = new Date();
    var dd = tdate.getDate(); //yields day
    var MM = tdate.getMonth(); //yields month
    var yyyy = tdate.getFullYear(); //yields year
    var currentDate = yyyy + "-" + (MM + 1) + "-" + dd;
    return currentDate;
}


function list_table_header() {
    var lc = '';
    if (pagename == 'edit') lc = '<th scope="col" width="80px">Remove</th> ';
    return '            <div id="table_zone_lists"> ' +
        '<table class="table table-striped table-hover table-responsive ui red"> ' +
        '<thead> ' +
        '<tr class=""> ' +
        '<th scope="col">Pokemon Name</th> ' +
        '<th scope="col">Base experience</th> ' +
        '<th scope="col">Sprite</th> ' +
        '<th scope="col">Ability</th> ' +
        '<th scope="col">Types</th> ' +
        lc +
        '</tr> ' +
        '</thead> ' +
        '<tbody id="results_table">';
}

var team_id;

function list_team_row(data, opened) {
    var row = ''; var sum = 0; var img = ''; var id = 0;
    var ids = data.ids ? data.ids : '';
    var ids_array = [];
    var type_data = '';
    // if (data[0] !== undefined) team_id = data[0].team_id;  else return;
    if (opened) {  //for edit
        $(data).each(function (k, v) {
            sum += parseInt(v.base_experience);
            type_data += v.type_name + '<br>';
            img += '<img src="/assets/img/' + v.pokemon_id + '.png">'

        });
    } else {
        if (ids === null) { }
        else {
            ids_array = ids.split(",");

            $(ids_array).each(function (k, id_pix) {
                if ($.isNumeric(id_pix) && id_pix > 0) {
                    img += '<img src="/assets/img/' + id_pix + '.png"/>';
                }
            })
        }
    }
    if (img.length < 1) { img = 'No pokemon added to the team' }

    sum = !opened ? data.sum_base : sum;

    row += '<div class="ui segment"> ';
    row += '<h2 class="ui right floated header team_name">' + (data.team_name ? data.team_name : '') + '</h2> ';
    row += '<div class="ui clearing divider"></div> ';
    row += $.isNumeric(sum) ? ' <h5 class="ui right floated header">' + sum + ' experience</h5><br>' : ''
    row += '<div class="ui left floated ">' + img + '</div>';
    row += (opened ? type_data : (data.types ? data.types : ''));

    row += '<div class="ui clearing "></div><br>';
    row += !opened ? '<h5 class="ui right floated header"><a href="/team/' + data.id + '/edit"><i class="icon edit outline"></i></a></h5>' : '';
    row += $.isNumeric(sum) && !opened ? '<h5 class="ui right floated header">   <i team_id="' + data.id + '" onclick="toggle_team_details(this)"  class="icon  ' + (opened ? 'minus' : 'plus') + ' blue outline"></i></h5>' : '';

    row += '<br></div><div id="table_zone_lists_' + data.id + '"></div>';
    return row;
}


function toggle_cache(obj) {
    var icon = $(obj);
    if (icon.hasClass('orange')) {   //disable
        localStorage.setItem("has_cache", '0')
        icon.removeClass('orange').addClass('grey');
        localStorage.setItem('list_items', '');
        location.reload();
    }
    else {
        localStorage.setItem("has_cache", '1')
        icon.removeClass('grey').addClass('orange');
        location.reload();
    }
}


function toggle_team_details(obj) {
    var icon = $(obj);
    team_id = icon.attr('team_id');
    if (icon.hasClass('plus')) {   //expand
        icon.removeClass('plus').addClass('minus');
        if ($('#table_zone_lists_' + team_id).length > 0 && $('#table_zone_lists_' + team_id).html().length > 50) {
            $('#table_zone_lists_' + team_id).show();
        } else {
            post_via_ws("get_team_pokemons", [team_id]);
        }
    }
    else {
        $('#table_zone_lists_' + team_id).hide()
        icon.removeClass('minus').addClass('plus');
    }
}





function list_table(data) {
    var row = ''; var sum = 0; var img = '';
    if ($.isNumeric(data)) {
        // data = 
    }


   if (data[0] !== undefined) team_id = data[0].team_id;
   // else return;
    $(data).each(function (k, v) {
        sum += parseInt(v.base_experience);
        img += '<img src="/assets/img/' + v.pokemon_id + '.png">'


    });
    $(data).each(function (k, v) {

        row += '<tr>' +
            '<td>' + v.name + '</td>' +
            '<td>' + v.base_experience + '</td>' +
            '<td>' + '<img src="/assets/img/' + v.pokemon_id + '.png">' + '</td>' +
            '<td>' + v.ability_name + '</td>' +
            '<td>' + v.type_name + '</td>';
        if (pagename == 'edit') row += '<td><span data-pokemon_id="' + v.pokemon_id + '" onclick="delete_p(this)" style="cursor: pointer"><i class="icon trash alternate outline red"></i></span></td>';
        row += '</tr>';
    })
    return row;
}

function set_active(step) {
    $('.nav.navbar-nav li').removeClass('active');
    $('[step=' + step + ']').addClass('active')
}


function post_via_ws(command_send, data_send) {
    if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({
        command: command_send,
        data: data_send
    }));
    else {  // reincearca pentru redundata...
        setTimeout(post_via_ws(command_send, data_send), 1000);
        return;
    }
}





var addTextByDelay2 = function (text, elem, delay) {
    if (!elem) {
        elem = $("body");
    }
    if (!delay) {
        delay = 300;
    }
    if (text.length > 0) {
        //append first character
        elem.append(text[0]);
        setTimeout(
            function () {
                //Slice text by 1 character and call function again
                addTextByDelay2(text.slice(1), elem, delay);
            }, delay
        );
    }
}

$('.ui.dropdown')
    .dropdown({
        onChange: function (value, text, $selectedItem) {
            filter_type(value);
        }
    })
    ;