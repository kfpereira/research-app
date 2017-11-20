export default function dashboardService ($http, $q, serverUrl,
                                          loginService, entrevistaService,
                                          pesquisaRepository, folhaRepository) {

  function buscarDadosEstruturaBasica() {
    $http.defaults.headers.common.Authorization = `Bearer ${loginService.login.token}`;
    return $http.get(`${serverUrl}/api/dados/estrutura-basica`);
  }

  function enviarEntrevistados(dadosEnvio) {
    $http.defaults.headers.common.Authorization = `Bearer ${loginService.login.token}`;
    return $http.post(`${serverUrl}/api/dados/enviar-entrevistados`, dadosEnvio);
  }

  this.importar = () => {
    return buscarDadosEstruturaBasica()
      .then(response => {
        this.pesquisa = response.data.pesquisa;
        return apagarPesquisa(response.data.pesquisa)
          .then(() => this.salvarDados(response.data))
      });
  }

  function apagarPesquisa(pesquisa) {
    return pesquisaRepository.apagarTudo(pesquisa);
  }

  this.salvarDados = (objeto) => {
    this.folhas = objeto.folhas;
    return pesquisaRepository.salvar(objeto);
  }

  this.qtdeEntrevistasToSend = () => {
    return folhaRepository.qtdeEntrevistasToSend();
  }

  this.qtdeEntrevistasTotal = () => {
    return folhaRepository.qtdeEntrevistasTotal();
  }

  this.sincronizar = () => {
    return entrevistaService.getEntrevistados()
      .then((dados) => enviarEntrevistados(dados));
  }

  this.apagarPesquisa = () => {
    console.log(this.pesquisa);
    return pesquisaRepository.apagarTudo(this.pesquisa);
  }
}
