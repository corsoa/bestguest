$(document).on('ready', (() => {
  window.navPage = ((pageId) => {
    $('#regular-customer-card').hide();
    $('#intro-card').hide();

    if (!pageId) {
      $('#intro-card').show();
    }
    else {
      $('#' + pageId + '-card').show();
    }
  });
  navPage();
}));
