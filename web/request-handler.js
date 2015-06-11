// headers (imported from previous sprint)
var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

var path = require('path');
var archive = require('../helpers/archive-helpers');
// require more modules/folders here!
var urlParser = require('url');
var utils = require('./http-helpers');

exports.handleRequest = function (req, res) {
  /////     GET     /////
  if (req.method === 'GET'){
    var parts = urlParser.parse(req.url);
    var urlPath = parts.pathname === '/' ? '/index.html' : parts.pathname;
    // check if the site is index/loading or archived
    //  if neither, isUrlInList's callback wrapper will be called
    utils.serveAssets(res, urlPath, function(){
      archive.isUrlInList(urlPath.slice(1), function(found){
        if (found) {
          // redirect to loading (url was in list but NOT archived)
          utils.sendRedirect(res, 'loading.html');
        } else {
          utils.sendResponse(res, '404: page not found', 404);
        }
      });
    });  
  }
  /////    POST    /////
  if (req.method === 'POST') {
    var str = '';
    req.on('data', function(chunk){
      str+=chunk;
    });
    req.on('end', function(){
      var url = str.split('=')[1]; // www.google.com
      // check if url is in list
      archive.isUrlInList(url, function(found){
        if (found){ // in list
          // then is it archived?
          archive.isURLArchived(url, function(exists){
            if (exists){ // is archived
              // then redirect to that actual site
              utils.sendRedirect(res, '/'+url);
            } else { // listed, but still not archived
              // redirect to laoding
              utils.sendRedirect(res, '/loading.html');
            }
          });
        } else {  // not in list
          // add to list
          archive.addUrlToList(url, function(){
            // and then redirect to loading
            utils.sendRedirect(res, 'loading.html');
          });
        }
      });
    });
  }
  res.end(archive.paths.list);
};

