export default function menuCtrl($state, loginService) {

  this.goToDashboard = () => {
    console.log("loginServiceMenu", loginService);
    if (loginService.login.autenticado)
      $state.go('app.dashboard');
    else
      $state.go('login');
  }

  this.logout = () => {
    loginService.limparAutenticacao();
    $state.go('login');
  }
}
