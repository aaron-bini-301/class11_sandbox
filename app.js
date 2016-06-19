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
  console.log('contact');
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
  console.log('article page');
  $('div').hide();
  $('#articles').fadeIn(700);
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
