import database from './database';

export default angular.module('pesquisaApp.repositorios', [database])
  .factory('nextNumberRepository', nextNumberRepository)
  .factory('agenteRepository', agenteRepository)
  .factory('pesquisaRepository', pesquisaRepository)
  .factory('perguntaRepository', perguntaRepository)
  .factory('respostaRepository', respostaRepository)
  .factory('entrevistadoRepository', entrevistadoRepository)
  .factory('folhaRepository', folhaRepository)
  .name;

function pesquisaRepository(executeSql, $q,
                            folhaRepository, entrevistadoRepository, respostaRepository, perguntaRepository,
                            getOne) {
  return {
    apagarTudo(pesquisa) {
      let p1 = folhaRepository.apagar(pesquisa);
      let p2 = entrevistadoRepository.apagar(pesquisa);
      let p3 = respostaRepository.apagar(pesquisa);
      let p4 = perguntaRepository.apagar(pesquisa);

      let id = pesquisa.id ? pesquisa.id : 0;
      let p5 = executeSql(`delete from pesquisa where id = (${id})`);

      return $q.all([p1,p2,p3,p4,p5]);
    },

    salvar(objeto) {
      let pesquisa = objeto.pesquisa;
      let sql = `insert into pesquisa(id, descricao, data) 
                 values (${pesquisa.id}, '${pesquisa.descricao}', ${pesquisa.data})`;
      return executeSql(sql)
        .then(() => {
          let p1 = folhaRepository.salvar(objeto.folhas);
          let p2 = perguntaRepository.salvar(objeto.perguntasERespostas);

          return $q.all([p1,p2]);
        });
    },

    pesquisaPrimeiro() {
      let sql = squel.select()
        .from("PESQUISA");

      return executeSql(sql)
        .then(getOne);
    }
  }
}

function perguntaRepository(executeSql, respostaRepository, getAll) {
  return {
    apagar(pesquisa) {
      let id = pesquisa.id ? pesquisa.id : 0;
      let sql = `delete from pergunta where pesquisa = (${id})`;
      return executeSql(sql);
    },

    salvar(perguntasERespostas) {
      return angular.forEach(perguntasERespostas, (value) => {
        let pergunta = value.pergunta;
        let sql = `insert into pergunta(id, pesquisa, numero, descricao)
                   values(${pergunta.id}, ${pergunta.pesquisa.id}, ${pergunta.numero}, '${pergunta.descricao}')`;
        return executeSql(sql)
          .then(() => respostaRepository.salvar(value.respostas));
      });
    },

    pesquisa(pesquisa) {
      let sql = squel.select()
        .from("PERGUNTA")
        .where("PESQUISA", pesquisa.id)
        .order("numero");

      return executeSql(sql)
        .then(getAll);
    }
  }
}

function respostaRepository(executeSql, getAll) {
  return {
    apagar(pesquisa) {
      let id = pesquisa.id ? pesquisa.id : 0;
      let sql = `delete from resposta
                  where pergunta in (select id
                                       from pergunta
                                      where pesquisa = (${id}))`;
      return executeSql(sql);
    },

    salvar(respostas) {
      return angular.forEach(respostas, (resposta) => {
        let sql = `insert into resposta(id, pergunta, opcao, descricao)
                   values(${resposta.id}, ${resposta.pergunta.id}, '${resposta.opcao}', '${resposta.descricao}')`;
        return executeSql(sql)
      });
    },

    pesquisaTudo() {
      let sql = squel.select()
        .from("RESPOSTA")
        .order("opcao");

      return executeSql(sql)
        .then(getAll);
    },

    pesquisa(pergunta) {
      let sql = squel.select()
        .from("RESPOSTA")
        .where("pergunta", pergunta.id)
        .order("opcao");

      return executeSql(sql)
        .then(getAll);
    }
  }
}

function entrevistadoRepository(executeSql, getAll) {
  return {
    apagar(pesquisa) {
      let id = pesquisa.id ? pesquisa.id : 0;
      let sql = `delete from entrevistado 
                 where pesquisa = (${id})`;
      return executeSql(sql);
    },

    salvar(pesquisa, folha, perguntasChoice) {
      // nextNumberRepository.getId();
      return angular.forEach(perguntasChoice, (entrevista) => {
        let sql = `insert into entrevistado(pesquisa, folha, pergunta, resposta) 
                 values (${pesquisa.id}, ${folha.id}, ${entrevista.choice.pergunta}, ${entrevista.choice.id})`;
        return executeSql(sql);
      });
    },

    getEntrevistados() {
      let sql = squel.select()
        .from("ENTREVISTADO");

      return executeSql(sql)
        .then(getAll);
    }
  }
}

function folhaRepository(executeSql, getAll, getOne) {
  return {
    apagar(pesquisa) {
      let id = pesquisa.id ? pesquisa.id : 0;
      let sql = `delete from folha 
                 where pesquisa = (${id})`;
      return executeSql(sql);
    },

    pesquisaTudo(pagina = 0) {
      const limitRegistros = 20;

      let sql = squel.select()
        .from("FOLHA")
        .order("numero")
        .limit(limitRegistros)
        .offset(limitRegistros * pagina);

      return executeSql(sql)
        .then(getAll);
    },

    salvar(folhas) {
      return angular.forEach(folhas, (value) => {
        let folha = value;
        let sql = `insert into folha(id, numero, pesquisa)
                   values(${folha.id},${folha.numero}, ${folha.pesquisa.id})`;
        return executeSql(sql);
      });
    },

    atualizar(folha, guid) {
      let sql = `update folha set guid = '${guid}' where id = ${folha.id}`;
      return executeSql(sql);
    },

    qtdeEntrevistasToSend() {
      return executeSql(`SELECT COUNT(1) QTDE FROM FOLHA WHERE GUID IS NOT NULL`)
        .then(getOne);
    },

    qtdeEntrevistasTotal() {
      return executeSql(`SELECT COUNT(1) QTDE FROM FOLHA`)
        .then(getOne);
    }
  }
}


function nextNumberRepository(executeSql) {
  return {
    getId() {
      let sql = `insert into nextNumber(dataHora) 
                 values (${Date.now()})`;
      return executeSql(sql);
    }
  }
}

function agenteRepository(executeSql, getOne) {
  return {
    buscarPeloUsuario(usuario, senha) {
      let sql = `select * 
                   from AGENTE 
                  where usuario = '${usuario}'
                    and senha = '${senha}'`;
      return executeSql(sql)
        .then(getOne);
    },

    apagarTudo() {
      let sql = `delete 
                   from agente`;
      return executeSql(sql);
    },

    salvar(usuario, senha, login) {
      let sql = `insert into agente(usuario, senha, token)
                 values ('${usuario}', '${senha}', '${login.token}')`;
      return executeSql(sql);
    }

  }
}