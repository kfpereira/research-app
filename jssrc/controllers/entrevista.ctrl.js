export default function entrevistaCtrl($scope, $state, appToast, entrevistaService) {
  let self = this;
  this.pesquisa = {};

  this.carregarPerguntasERespostas = () => {
    entrevistaService.carregarPerguntasERespostas()
      .then(() => {
        this.pesquisa.pesquisa = entrevistaService.pesquisa;
        this.pesquisa.perguntas = entrevistaService.perguntas;
        this.pesquisa.respostas = entrevistaService.respostas;
      });
  }

  $scope.$on('$ionicView.enter', () => {
    this.pesquisa.numeroFolha = entrevistaService.folha.numero;
    this.pesquisa.guid = entrevistaService.getNextId();
    this.carregarPerguntasERespostas();
  });

  function achouResposta(pergunta) {
    let achou = false;
    angular.forEach(self.pesquisa.perguntasChoice, (perguntaChoose) => {
      if (pergunta.numero === perguntaChoose.choice.pergunta) {
        achou = true;
      }
    });
    return achou;
  }

  function validar() {
    let msg = null;
    let keepGoing = true;
    angular.forEach(self.pesquisa.perguntas, (pergunta) => {
      if (keepGoing) {
        var achou = achouResposta(pergunta);
        if (!achou) {
          msg = "Pergunta " + pergunta.numero + " deve ser preenchida\n";
          keepGoing = false;
        }
      }
    });

    return msg;
  }

  this.salvar = () => {
    let msg = validar();
    if (msg) {
      appToast(msg, '#FF0000');
      return;
    }

    entrevistaService.salvar(this.pesquisa)
      .then(() => {
        appToast("Entrevista salva com sucesso");
        $state.go('app.listaFolhas');
      });
  }

  this.voltar = () => {
    $state.go('app.listaFolhas');
  }
}
