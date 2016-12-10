
$(function() {

  var zoom = 50;

  // collapse all spaces between elements
  $('.collapse').each(function () {
    $(this).html($(this).html().replace(/>\s+</g, "><"));
  });

  // thumb resize
  function doZoom(zoom) {
    zoom = Math.round(zoom);
    if (zoom < 10) zoom = 10;
    if (zoom > 1000) zoom = 1000;
    console.log('zooming to '+zoom);
    $('.pic').each(function () {
      $(this).css('maxWidth', zoom);
    });
  }

  $('body').keydown(function (e) {
    if (e.keyCode === 173) { // -_ key
      zoom *= 0.9;
      doZoom(zoom);
      return false;
    }
    if (e.keyCode === 61) { // =+ key
      zoom *= 1.1;
      doZoom(zoom);
      return false;
    }
  });

});
