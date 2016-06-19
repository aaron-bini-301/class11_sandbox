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
  page('/articles', articlePage);
  page('/contact', contact);
  page('/contact/:contactName', contact);
  page('/users/', baseUser);
  page('/users/:id', loadUser, showUser);
  page('/*', pageNotFound);
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

function articlePage() {
  function Article(obj) {
    this.title = obj.title;
    this.body = obj.body;
  }

  Article.prototype.toHtml = function () {
    var template = Handlebars.compile($('#article-template').html());
    this.title = marked(this.title);
    this.body = marked(this.body);
    return template(this);
  };

  Article.all = [];

  Article.loadAll = function (rawData) {
    Article.all = rawData.map(function(element){
      return new Article(element);
    });
  };

  Article.fetchAll = function (viewCallback) {
    $.getJSON('./articles.json', function(data){
      Article.loadAll(data);
    }).done(function(){
      viewCallback();
    });
  };

  function initArticlePage () {
    Article.all.forEach(function(el){
      $('#articles').append(el.toHtml());
    });
    $('pre code').each(function(i, block) {
      hljs.highlightBlock(block);
    });
  }

  Article.fetchAll(initArticlePage);
  $('div').hide();
  $('#articles').fadeIn(700);
}

function baseUser () {
  $('div').hide();
  $('#users').fadeIn(700);
}

function loadUser (ctx, next) {
  var id = ctx.params.id;
  $.getJSON('/users/' + id + '.json', function(user){
    ctx.user = user;
  }).done(function(){
    next();
  }).fail(function(){
    pageNotFound();
  });

}

function showUser(ctx) {
  $('div').hide();
  $('#users').append('<h3>First Name: ' + ctx.user.firstName + '</h3>'
    + '<h3>Last Name: ' + ctx.user.lastName + '</h3>'
    + '<ul>'
    + '<li>Occupation: ' + ctx.user.occupation + '</li>'
    + '<li>City: ' + ctx.user.address + '</li>'
    + '<li>State: ' + ctx.user.state + '</li>'
    + '</ul>'
  );
  $('#users').fadeIn(1000);
}



function pageNotFound() {
  $('#notFound').append('<h3>OMG!</h3><p>The page at "'
    + location.hostname + location.pathname + location.search
    + '" can\'t be found.'
  );
  $('div').hide();
  $('#notFound').fadeIn(700);
}

setRouteMapping();
