import repositorios from '../bd/repositorios';
import appToast from './appToast';
import appNetwork from './appNetwork';
import loginService from './login.service';
import dashboardService from './dashboard.service';
import folhaService from './folha.service';
import entrevistaService from './entrevista.service';

export default angular.module('pesquisaApp.services', [repositorios])
  .service('appToast', appToast)
  .service('appNetwork', appNetwork)
  .service('loginService', loginService)
  .service('dashboardService', dashboardService)
  .service('folhaService', folhaService)
  .service('entrevistaService', entrevistaService)
  .name;
