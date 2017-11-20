export default function dashboardCtrl($scope, $ionicLoading, $ionicPopup, $q, $state,
                                      loginService, dashboardService,
                                      appNetwork, appToast) {

  $scope.$on('$ionicView.enter', () => {
    this.usuario = loginService.login.perfil;
    this.qtdeEntrevistasToSend();
    this.qtdeEntrevistasTotal();
  });

  this.atualizaEstruturaPesquisa = () => {
    $ionicLoading.show();

    dashboardService.importar()
      .then((dados) => {
        $ionicLoading.hide();
        let dataHora = new Date().getTime();
        localStorage.setItem("dataHoraAtualizacaoEstruturaBase", dataHora);
        this.dataHoraAtualizacaoEstruturaBase = dataHora;

        appToast("Dados atualizados com sucesso");
      })
      .catch(erro => {
        $ionicLoading.hide();
        appToast("Problema:" + erro, '#FF0000');
      })
  }

  this.atualizarEstruturaBasicaLocal = () => {
    if (appNetwork() != "wifi") {
      appToast("Você não está conectado na rede para receber a estrutura atual", '#FF0000');
      return;
    }

    let alertPopup = $ionicPopup.confirm({
      title: 'Você perderá todos os dados alterados.',
      template: 'Tem certeza que deseja continuar?',
      cancelText: 'Cancelar',
      cancelType: 'button-assertive',
      okText: 'Confirmar',
      okType: 'button-dark'
    });

    alertPopup
      .then(res => {
        if (res)
          this.atualizaEstruturaPesquisa();
      });
  }

  this.dataHoraAtualizacaoEstruturaBase = localStorage.getItem("dataHoraAtualizacaoEstruturaBase");
  this.dataHoraUltimoEnvio = localStorage.getItem("dataHoraUltimoEnvio");

  this.iniciarPesquisa = () => {
    $state.go('app.listaFolhas');
  }

  this.qtdeEntrevistasToSend = () => {
    dashboardService.qtdeEntrevistasToSend()
      .then(dados => {
        this.qtdeFolhasNaoEnviadas = dados.QTDE;
      });
  }

  this.qtdeEntrevistasTotal = () => {
    dashboardService.qtdeEntrevistasTotal()
      .then(dados => {
        this.qtdeFolhasTotal = dados.QTDE;
      });
  }

  this.enviar = () => {
    if (this.qtdeFolhasNaoEnviadas != this.qtdeFolhasTotal) {
      appToast("Você precisa responder todas as entrevistas para enviar os dados", '#FF0000');
      return;
    }
    
    dashboardService.sincronizar()
      .then(dados => {
        let dataHora = new Date().getTime();
        localStorage.setItem("dataHoraUltimoEnvio", dataHora);
        this.dataHoraUltimoEnvio = dataHora;

        if (dados.status == 200) {
          appToast("Dados enviados com sucesso");
          dashboardService.apagarPesquisa();

          this.qtdeEntrevistasToSend();
          this.qtdeEntrevistasTotal();
        }
        else
          appToast(dados.statusText + " - " + dados.data.message, '#FF0000');
      })
      .catch(erro => {
        appToast(erro.data.message, '#FF0000');
      });
  }
}
