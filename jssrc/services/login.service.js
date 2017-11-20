export default function loginService($http, $q, serverUrl, agenteRepository, appNetwork) {

  this.limparAutenticacao = () => {
    this.login = undefined;
  }

  this.salvarUsuario = (usuario, senha, login) => {
    return agenteRepository.apagarTudo()
      .then(agenteRepository.salvar(usuario, senha, login));
  }

  this.setLogin = (token, perfil) => {
    this.login = {};
    this.login.autenticado = true;
    this.login.token = token;
    this.login.perfil = perfil;
  }

  this.getLoginLocal = (usuario, senha) => {
    return agenteRepository.buscarPeloUsuario(usuario, senha)
      .then(resposta => {
        if (!resposta) {
          let deferred = $q.defer();
          deferred.reject("Login não disponível. Verifique sua conexão com a rede");
          return deferred.promise;
        }
        else {
          const token = resposta.token;
          const perfil = {
            login: resposta.usuario,
            senha: resposta.senha
          };
          this.setLogin(token, perfil);
          return resposta;
        }
      });
  }

  this.autenticarUsuarioApi = (usuario, senha) => {
    if (appNetwork() != "wifi") {
      return this.getLoginLocal(usuario, senha);
    }

    return $http.post(`${serverUrl}/login`, {usuario, senha})
      .then(response => {
        this.setLogin(response.data.token, response.data.perfil);
        this.salvarUsuario(usuario, senha, this.login);
        return response;
      })
      .catch(() => {
        return this.getLoginLocal(usuario, senha);
      });
  }
}
