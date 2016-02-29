var blankCoverSizing = function () {
  var coverWidth = $('img.cover-image').width();
  var coverHeight = $('img.cover-image').height();
  $('.cover-title').css({
    'width': coverWidth * 0.7,
    'font-size': coverWidth * 0.075
  });
  $('.blank-cover-title').css({
    top: coverHeight * 0.27
  });
  $('.cover-author').css({
    'width': coverWidth * 0.7,
    'font-size': coverWidth * 0.05
  });
};

$('img.cover-image').on('load', blankCoverSizing);
$(window).resize(blankCoverSizing);
