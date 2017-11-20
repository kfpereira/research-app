import dashboardCtrl from './dashboard.ctrl.js';
import loginCtrl from './login.ctrl';
import menuCtrl from './menu.ctrl';
import folhaCtrl from './folha.ctrl';
import entrevistaCtrl from './entrevista.ctrl';

export default angular.module('pesquisaApp.controllers', [])
  .controller('dashboardCtrl', dashboardCtrl)
  .controller('loginCtrl', loginCtrl)
  .controller('menuCtrl', menuCtrl)
  .controller('folhaCtrl', folhaCtrl)
  .controller('entrevistaCtrl', entrevistaCtrl)
  .name;

