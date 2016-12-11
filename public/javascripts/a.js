'use strict';

$(function() {

  // collapse all spaces between elements
  $('.collapse').each(function () {
    $(this).html($(this).html().replace(/>\s+</g, "><"));
  });

  // thumb resize
  (function (conf) {

    var zoom = conf.zoom;

    function zoomBy(m) {
      zoom = Math.round(zoom * m);
      if (zoom < 10) zoom = 10;
      if (zoom > 1000) zoom = 1000;
      console.log('zooming to ' + zoom);
      return zoom;
    }

    function resizePix(zoom) {
      $('.pic').each(function () {
        $(this).css('maxWidth', zoom);
      });
    }

    $('body').keydown(function (e) {
      if (e.keyCode === 173) { // -_ key
        resizePix(zoomBy(0.9));
        return false;
      }
      if (e.keyCode === 61) { // =+ key
        resizePix(zoomBy(1.11));
        return false;
      }
    });
  })(POTOSJS.conf);

});
