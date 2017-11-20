export default function ($cordovaToast, $window) {

  return function (msg, corFundo = '#0000FF') {
    if ($window.plugins) {
      window.plugins.toast.showWithOptions({
        message: msg,
        duration: "short", // 2000 ms
        position: "center",
        styling: {
          opacity: 0.75, // 0.0 (transparent) to 1.0 (opaque). Default 0.8
          backgroundColor: corFundo, // make sure you use #RRGGBB. Default #333333
          textColor: '#FFFFFF', // Ditto. Default #FFFFFF
          textSize: 20.5, // Default is approx. 13.
          cornerRadius: 16, // minimum is 0 (square). iOS default 20, Android default 100
          horizontalPadding: 20, // iOS default 16, Android default 50
          verticalPadding: 16 // iOS default 12, Android default 30
        }
      });
    } else {
      console.log(msg);
    }
  };
}