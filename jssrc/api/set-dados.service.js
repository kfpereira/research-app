export default function setDadosService(serverUrl, $rootScope, $http) {


  function getUrl(dados) {
    return $http.post(`${serverUrl}/api/dados/`, dados);
  }
}

