// the "notfound" implements a catch-all
// with page('*', notfound). Here we have
// no catch-all, so page.js will redirect
// to the location of paths which do not
// match any of the following routes
//
function setRouteMapping() {
  page.base('/basic');

  page('/', home);
  page('/about', about);
  page('/contact', contact);
  page('/contact/:contactName', contact);
  page();
}

function home() {
  $('p').text('viewing home');
  $('div').hide();
  $('#home').fadeIn(700);
}

function about() {
  $('p').text('viewing about');
  $('div').hide();
  $('#about').fadeIn(700);
}

function contact(ctx) {
  $('p').text('viewing contact ' + (ctx.params.contactName || ''));
  $('div').hide();
  $('#contact').fadeIn(700);
}

setRouteMapping();
