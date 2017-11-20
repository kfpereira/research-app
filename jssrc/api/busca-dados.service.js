export default function buscaDadosService($q, $ionicPopup, serverUrl, executeSql, executeBatchSql, insert, $http) {

  function buscarDadosEstruturaBasica() {
    return $http.get(`${serverUrl}/api/dados/estrutura-basica`);
  }

  const check = (x, msg) => {
    if (!x) throw Error(msg);
  } 

  function salvarObjeto(objeto, tabela) {
    check(objeto, 'Objeto é obrigatório');
    check(tabela, 'Tabela é obrigatório');
    return insert(objeto, tabela);
  }

  function salvarObjetos (array, tabela) {
    check(array, 'Array é obrigatório');
    check(tabela, 'Tabela é obrigatório');
    return array.map(o => salvarObjeto(o, tabela));
  }

  function salvadorObjetos(filter, tabela) {
    if (!filter) throw Error('Filter é obrigatório')
    return ({data}) => {
      if (!data) return;
      return salvarObjetos(filter(data), tabela);
    };
  }

  function combinarSalvadores(...fns) {
    return response => _.flatten(fns.map(fn => fn(response)));
  }

  function deleteFrom(tabela) {
    return () => executeSql(`delete from ${tabela}`);
  }

  function deleteFromWhere(tabela, where) {
    return () => executeSql(`delete from ${tabela} where ${where}`);
  }

  const atualizadorLocal = {
    atualizarEstruturaBasica() {
      return buscarDadosEstruturaBasica()
        .then(combinarSalvadores(
          salvadorObjetos(x => x.pesquisas, 'pesquisas'),
          salvadorObjetos(x => x.perguntas, 'perguntas'),
          salvadorObjetos(x => x.respostas, 'respostas'),
          salvadorObjetos(x => x.folhas, 'folhas')
        ))
        .then(sqls => {
          return deleteFrom('folhas')()
            .then(deleteFrom('respostas'))
            .then(deleteFrom('perguntas'))
            .then(deleteFrom('pesquisas'))
            .then(deleteFromWhere('nextNumber', 'codigo <> (select max(codigo) from nextnumber)'))
            .then(() => executeBatchSql(sqls))
            .catch(erro => {
              $ionicPopup.alert({
                title: 'Problema:',
                template: erro
              });
              console.log('Erro ao inserir estrutura basica', erro)
            });
        })
        .catch(callback => {
          $ionicPopup.alert({
            title: 'Problema:',
            template: callback
          });
        });

    },

    atualizar() {
      return $q.when(this.atualizarEstruturaBasica());
    }
  }

  return atualizadorLocal;  
}
