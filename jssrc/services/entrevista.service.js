export default function entrevistaService($q,
                                          pesquisaRepository, perguntaRepository,
                                          respostaRepository, folhaRepository,
                                          entrevistadoRepository,
                                          rfc4122) {
  this.folha = undefined;

  this.setFolha = (folha) => {
    this.folha = folha;
  }

  this.carregarPerguntasERespostas = () => {
    return pesquisaRepository.pesquisaPrimeiro()
      .then(pesquisa => {
        this.pesquisa = pesquisa;
        return perguntaRepository.pesquisa(pesquisa)
          .then(perguntas => {
            this.perguntas = perguntas;
            return respostaRepository.pesquisaTudo()
              .then((respostas) => {
                return this.respostas = respostas;
              });
          });
      });
  }

  this.getNextId = () => {
    return rfc4122.v4();
  };

  this.salvar = (pesquisa) => {
    let promessa1 = folhaRepository.atualizar(this.folha, pesquisa.guid);
    let promessa2 = entrevistadoRepository.salvar(pesquisa.pesquisa, this.folha, pesquisa.perguntasChoice);

    return $q.all([promessa1, promessa2]);
  }

  this.getEntrevistados = () => {
    return entrevistadoRepository.getEntrevistados();
  }
}
