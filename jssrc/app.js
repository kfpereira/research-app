// Ionic Starter App
import 'babel-polyfill'
import controllers from './controllers/index'
import routes from './routes';
import managerScripts from './scriptsBD/ManagerScripts';
import services from './services';
import api from './api';
import constants from './constants';

angular.module('templates', []);

angular.module('pesquisaApp', [
  'ionic',
  controllers,
  'ngCordova',
  'ion-autocomplete',
  'uuid',
  'templates',
  api,
  routes,
  services,
  managerScripts,
  constants
])

.config(($animateProvider, $ionicConfigProvider) => {
  $animateProvider.classNameFilter(/\bangular-animated\b/);

  $ionicConfigProvider.views.transition('none');
  if (ionic.Platform.isAndroid())
    $ionicConfigProvider.scrolling.jsScrolling(false);
})

.run(function ($rootScope, $state, loginService) {
  if (!loginService.login || !loginService.login.autenticado) {
    $state.go('login');
  }
  else {
    $state.go('app.dashboard');
  }
})

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

