export default function folhaCtrl($scope, $state, $ionicLoading, folhaService, entrevistaService) {
  let numeroPaginaCorrente = 0;
  this.folhas = [];

  this.buscarFolhas = () => {
    folhaService.pesquisa(numeroPaginaCorrente)
      .then(folhas => {
        numeroPaginaCorrente ++;
        this.folhas = this.folhas.concat(folhas);

        this.possuiMaisDados = !!folhas.length;
        $scope.$broadcast("scroll.infiniteScrollComplete");
      });
  }

  $scope.$on('$ionicView.enter', () => {
    this.buscarFolhas();
  });

  this.btnGoToPesquisa = (folha) => {
    entrevistaService.setFolha(folha);
    $state.go('app.entrevista', {idFolha: folha.id});
  }

}
