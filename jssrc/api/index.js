import buscaDadosService from './../api/busca-dados.service.js';
import setDadosService from './../api/set-dados.service.js';
import database from '../bd/database';

export default angular.module('pesquisaApp.api', [database])
  .factory('buscaDadosService', buscaDadosService)
  .factory('setDadosService', setDadosService)
  .name;
