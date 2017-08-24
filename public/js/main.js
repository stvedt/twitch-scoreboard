(function(){

  function init(){
    someFunction();
  }

  var config;

  // all things DOM
  var $pageTitle = document.getElementById('page-title');

  function someFunction(){
    console.log('hi from client js');
  }
  
  init();
})();
