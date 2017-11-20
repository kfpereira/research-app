const createField = (name, type) => ({
  name,
  type
});

export default angular.module('pesquisaApp.database', [])
  .factory('createTable', () => createTable)
  .factory('executeSql', executeSql)
  .factory('executeBatchSql', executeBatchSql)
  .factory('createField', () => createField)
  .factory('repositoryFactory', repositoryFactory)
  .factory('insert', () => insert)
  .factory('getWhere', () => getWhere)
  .factory('getWhereLike', () => getWhereLike)
  .factory('getAll', getAll)
  .factory('getOne', getOne)
  .service('db', db)  
  .name;

function db($ionicPlatform, $cordovaSQLite) {

  return $ionicPlatform.ready().then(function() {
    var db;
    if (window.sqlitePlugin) {
      db =  window.sqlitePlugin.openDatabase({ name: "PESQUISA.db", location: 'default' });
    } else {
      db = openDatabase("PESQUISA", "1.0", "Web SQL Database", 200000);
    }
    return db;
  });
}

function getAll(sqlResult) {
  var array = [];
  for (var i=0; i < sqlResult.rows.length; i++) {
    array.push(sqlResult.rows.item(i))
  }

  return array;
}

function repositoryFactory (executeSql, getAll, getOne) {
  
  return (tabela) => ({
    buscarTodos() {
      return executeSql(`select * from ${tabela}`)
        .then(getAll);
    },

    buscarUm(condicao) {
      return executeSql(`select * from ${tabela} where ${condicao}`)
        .then(getOne);
    }
  })
}


function getWhere(filtros) {
  const clausulas = _.keys(filtros)
    .map(key => `${key} = ${getValueSql(filtros[key])}`)
    .join(' and ');
  return clausulas ?  `where ${clausulas}` : '';
}

function getWhereLike(filtros) {
  const clausulas = _.keys(filtros)
    .map(key => `UPPER(${key}) like '%${filtros[key].toUpperCase()}%' `)
    .join(' and ');
  return clausulas ?  `where ${clausulas}` : '';
}

function getValueSql(value) {
  if (_.isNumber(value)) return value;
  if (value.getTime) return value.getTime();
  if (typeof value === 'boolean') return +value;
  return `"${value}"`;
}

function insert(object, table) {
  const fields = Object.keys(object)
    .filter(key => object[key] != null && object[key] != undefined)
    .join(', ');
  const values = _.toArray(object)
    .filter(x => x != null && x != undefined)
    .map(getValueSql)
    .join(', ');
  
  return `insert or replace into ${table} (${fields}) values(${values})`

}

function executeBatchSql(db, $q) {
  const execute = (t, sql) => {
    const deferred = $q.defer();
    t.executeSql(sql, []
      , (tx, result) => deferred.resolve(result)
      , (tx, err) => deferred.reject(`${err.message} ${sql}`));
    return deferred.promise;
  }

  return (sqls) => {
    return db.then(db => {
      const deferred = $q.defer();
      db.transaction(function (t) {
        $q.all(sqls.map(sql => execute(t, sql)))
          .then(deferred.resolve, deferred.reject);
      });

      return deferred.promise;
    })
    .catch(console.log.bind(console));
  }
}

function executeSql(db, $q) {

  return (sql, params) => {
    return db.then(db => {
        var deferred = $q.defer();
        db.transaction(function (t) {
          t.executeSql(sql, params
            , (tx, result) => deferred.resolve(result)
            , (tx, err) => deferred.reject(err));
        });

        return deferred.promise;
      })
      .catch(console.log.bind(console));

  };
}

function createTable( table, fields, constraints) {
  const fieldsString = fields.map(field => `${field.name} ${field.type}`)
    .concat(constraints)
    .join(', ');

  return `create table if not exists ${table} (${fieldsString})`;
}

function getOne() {
  return function (sqlResult) {
    return sqlResult.rows.length > 0 ? sqlResult.rows.item(0) : null;
  };
}

function getAll() {
  return function (sqlResult) {
    var array = [];
    for (var i=0; i < sqlResult.rows.length; i++)
      array.push(sqlResult.rows.item(i))

    return array;
  };
}
