export default function ($cordovaNetwork, $window) {

  return function () {
    if ($window.plugins)
      return $cordovaNetwork.getNetwork();

    return 'wifi';
  };
}