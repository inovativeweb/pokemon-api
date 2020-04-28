var mysql = require('mysql');


var connection_config = require('./connection_config.json');

var pool = mysql.createPool(connection_config);

pool.on('close', function (err) {
  if (err) {
    // Oops! Unexpected closing of connection, lets reconnect back.
    db = mysql.createPool(connection_config);
  } else {
    console.log('Connection closed normally.');
  }
});

var request_db = function (msg, callback) {
  console.log("msg: ", msg);
  console.log("msg_data: ", msg.data);
  var sql, resp = {
    "content": "",
    "data": ""
  };

  switch (msg.command) {

    case "get_filter_type":
      sql = "SELECT type_name FROM `pokemon_types`";
      resp.content = "get_filter_type";
      break;

    case "get_statics":
      sql = "SELECT (SELECT COUNT(*) from pokemons where 1) as pokemons, (SELECT COUNT(*) from teams where 1) as teams";
      resp.content = "get_statics";
      break;

    case "get_list_filtered":
      sql = "SELECT teams.*, " +
        "(SELECT SUM(p.base_experience) FROM pokemons as p WHERE p.team_id = teams.id ) as sum_base, " +
        "(SELECT GROUP_CONCAT(pokemon_id) from pokemons WHERE team_id=teams.id) as ids, " +
        "(SELECT GROUP_CONCAT(type_name) from pokemons WHERE team_id=teams.id) as types "
        + " FROM  pokemon_types"
        + " LEFT JOIN `teams` ON pokemon_types.id_team = teams.id   where pokemon_types.type_name=? and deleted = 0   ORDER BY created_date DESC";
      resp.content = "get_list_filtered";
      break;

    case "get_list":
      sql = "SELECT teams.*, " +
        "(SELECT SUM(p.base_experience) FROM pokemons as p WHERE p.team_id = teams.id ) as sum_base, " +
        "(SELECT GROUP_CONCAT(pokemon_id) from pokemons WHERE team_id=teams.id) as ids, " +
        "(SELECT GROUP_CONCAT(type_name) from pokemons WHERE team_id=teams.id) as types "
        + " FROM `teams`   where deleted = 0 ORDER BY created_date DESC";
      resp.content = "get_list";
      break;


    case "get_team_data":
      sql = "SELECT team_name FROM `teams` where `id` = ? ";
      resp.content = "get_team_data";
      break;
    case "get_team_pokemons":
      sql = "SELECT * FROM `pokemons` LEFT JOIN teams ON teams.id=pokemons.team_id where `team_id` = ? ORDER BY `pokemons`.`id` DESC";
      resp.content = "get_team_pokemons";
      console.log(msg.data[0])
      resp.team_id = msg.data[0];
      break;

    case "add_pokemon_to_team":
      sql = "INSERT INTO `pokemons` (`name`,`pokemon_id`,`team_id`,`base_experience`,`image`,`ability_name`,`type_name`) VALUES (?);";
      resp.content = "create_team";
      break;
    case "create_team":
      sql = "INSERT INTO `teams` (`team_name`, `created_date`) VALUES (?);";
      resp.content = "create_team";
      break;


    case "insert_pokemon_type":
      sql = "INSERT INTO `pokemon_types` (`id_pokemon`, `id_team`, `type_name`) VALUES (?);";
      resp.content = "insert_pokemon_types";
      break;

    case "save_pokemons":
      sql = "INSERT INTO `pokemons` (`name`, `team`, `role`) VALUES (?);";
      resp.content = "pokemons_data";
      break;

    case "rename_team":
      sql = "UPDATE `teams` SET `team_name` = '" + msg.data[1] + "' WHERE `teams`.`id` = " + msg.data[0] + " ;";
      resp.content = "rename_team";
      break;

    case "delete_team":
      sql = "DELETE FROM `teams` WHERE `id`=? ";
      resp.content = "delete_team";
      break;
    case "delete_pokemons":
      sql = "DELETE FROM `pokemons` WHERE `team_id`=? ";
      resp.content = "delete_pokemons";
      break;
    case "delete_pokemon_from_team":
      sql = "DELETE FROM `pokemons` WHERE `team_id`=? AND `pokemon_id`=?;";
      resp.content = "deleted_pokemon_from_team";
      break;



    default: console.log("Unknown DB command"); return;
      break;
  }


  pool.query(sql, msg.data, function (err, result, fields) {
    console.log('SQL=', this.sql);
    if (err) {
      console.log("ERROR");
      console.log(err);
    } else {
      resp.data = result;
      resp.insertId = result.insertId;
      callback(resp);
    }
  });
}

module.exports.request_db = request_db;
