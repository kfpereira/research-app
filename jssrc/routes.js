export default angular.module('pesquisaApp.rotas', [])
  .config(routes)
  .name;

function routes($stateProvider, $urlRouterProvider) {
  function template(tpl) {
    return function ($templateCache) {
      return $templateCache.get(tpl)
    }
  }

  $stateProvider
    .state('login', {
      url: '/login',
      templateProvider: template('login.html'),
      controller: 'loginCtrl',
      controllerAs: 'ctrl'
    })

    .state('app', {
      url: '/app',
      abstract: true,
      templateProvider: template('menu.html'),
      controller: 'menuCtrl',
      controllerAs: 'ctrl'
    })

    .state('app.dashboard', {
      url: '/dashboard',
      views: {
        'menuContent': {
          templateProvider: template('dash-board.html'),
          controller: 'dashboardCtrl',
          controllerAs: 'ctrl'
        }
      }
    })

    .state('app.listaFolhas', {
      url: '/listaFolhas',
      views: {
        'menuContent': {
          templateProvider: template('lista-folhas.html'),
          controller: 'folhaCtrl',
          controllerAs: 'ctrl'
        }
      }
    })

    .state('app.entrevista', {
      url: '/entrevista/:idFolha',
      views: {
        'menuContent': {
          templateProvider: template('entrevista.html'),
          controller: 'entrevistaCtrl',
          controllerAs: 'ctrl'
        }
      }
    })

  ;
  $urlRouterProvider.otherwise('/login');
}
