$(function() {

  // collapse all spaces between elements
  $('.collapse').each(function () {
    $(this).html($(this).html().replace(/>\s+</g, "><"));
  });
});
