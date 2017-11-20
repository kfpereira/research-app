import dataBase from '../bd/database';

export default angular.module('pesquisaApp.scriptsBD', [dataBase])
  .run(execute)
  .factory('createTableLocal', createTableLocal)
  .factory('createSequenceLocal', createSequenceLocal)
  .name;""

function createTableLocal(createTable, executeSql) {
  return (name, constraints, ...fields) => {
    const table = name;
    const pkConstraint = ['primary key (id)'];
    executeSql(createTable(table, fields, pkConstraint.concat(constraints)));
  }
}

function createSequenceLocal() {
  return executeSql("CREATE TABLE IF NOT EXISTS next_visita (ID INTEGER PRIMARY KEY AUTOINCREMENT, datahora TEXT)");
}


function execute(createTableLocal, createField) {
  criarTabelasSistema(createTableLocal, createField);
  criarSequences(createTableLocal, createField)
}

function criarTabelasSistema(createTableLocal, createField) {
  pesquisas(createTableLocal, createField);
  perguntas(createTableLocal, createField);
  respostas(createTableLocal, createField);
  folhas(createTableLocal, createField);
  entrevistados(createTableLocal, createField);
  agente(createTableLocal, createField);
}

function criarSequences(createTableLocal, createField) {
  nextNumber(createTableLocal, createField);
}

function pesquisas(createTableLocal, createField) {
  createTableLocal('PESQUISA', [],
    createField('id', 'integer'),
    createField('descricao', 'text'),
    createField('data', 'date')
  );
}

function perguntas(createTableLocal, createField) {
  createTableLocal('PERGUNTA', ['foreign key (pesquisa) references PESQUISAS(id)'],
    createField('id', 'integer'),
    createField('pesquisa', 'integer'),
    createField('numero', 'integer'),
    createField('descricao', 'text')
  );
}

function respostas(createTableLocal, createField) {
  createTableLocal(
    'RESPOSTA', ['foreign key (pergunta) references PERGUNTAS(id)'],
    createField('id', 'integer'),
    createField('pergunta', 'integer'),
    createField('opcao', 'text'),
    createField('descricao', 'text')
  );
}

function folhas(createTableLocal, createField) {
  createTableLocal('FOLHA', ['foreign key (pesquisa) references PESQUISAS(id)'],
    createField('id', 'integer'),
    createField('pesquisa', 'integer'),
    createField('numero', 'integer'),
    createField('guid', 'text')
  );
}

function entrevistados(createTableLocal, createField) {
  createTableLocal(
    'ENTREVISTADO',
    [
      'foreign key (pesquisa) references PESQUISAS(id)',
      'foreign key (pergunta) references PERGUNTAS(id)',
      'foreign key (resposta) references RESPOSTAS(id)',
      'foreign key (folha) references FOLHA(id)'
    ],
    createField('id', 'integer'),
    createField('pesquisa', 'integer'),
    createField('pergunta', 'integer'),
    createField('resposta', 'integer'),
    createField('folha', 'integer')
  );
}


function nextNumber(createTableLocal, createField) {
  createTableLocal(
    'nextNumber',
    [],
    createField('id', 'integer'),
    createField('dataHora', 'text')
  );
}
function agente(createTableLocal, createField) {
  createTableLocal(
    'agente',
    [],
    createField('id', 'integer'),
    createField('usuario', 'text'),
    createField('senha', 'text'),
    createField('token', 'clob')
  );
}