export default function loginCtrl($state, $ionicLoading, loginService, appToast) {
  var self = this;


  function initVariaveis() {
    this.falhaLogin = null;
    this.causa = null;
  }

  function valida (usuario, senha) {
    if (!usuario) {
      self.falhaLogin = true;
      self.causa = "Usuário precisa ser preenchido";
      return false;
    }

    if (!senha) {
      self.falhaLogin = true;
      self.causa = "Senha precisa ser preenchida";
      return false;
    }

    return true;
  }

  this.autenticarUsuarioApi = (usuario, senha) => {
    initVariaveis.call(this);

    if (!valida(usuario, senha))
      return;

    $ionicLoading.show();
    loginService.autenticarUsuarioApi(usuario, senha)
      .then(() => {
        appToast(loginService.login.perfil.login.toUpperCase() + ", bem vindo ao Aplicativo de Pesquisas");
        $ionicLoading.hide();
        this.gotoDashBoard();
      })
      .catch(erro => {
        $ionicLoading.hide();
        appToast("Falha: " + erro, '#FF0000');
      });
  }

  this.gotoDashBoard = () => {
    $state.go("app.dashboard");
  };
}
