interface JQuery {
  slider(options: object): JQuery;
}

(function($){
  $.fn.slider = function(options) {
    let settings = $.extend( {
      name: 'Fedor',
      age: 25
    }, options)
    const anchor = this[0];
    return this;
  }
})(jQuery)

$('.target').slider({})