var path = require('path');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');

exports.headers = headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

// for successful request
exports.sendResponse = function(response, obj, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(obj);
};

// for redirect to loading when listed site still not archived (meaning url data file not downloaded yet)
exports.sendRedirect = function(response, location, statusCode){
  statusCode = statusCode || 302;
  response.writeHead(statusCode, {Location: location});
  response.end();
}

// serverAssets directly checks only if its archived OR index or loading
//   by passing isUrlInList as the callback, it will check if in list part
exports.serveAssets = function(res, asset, callback) {
  // Write some code here that helps serve up your static files!
  // (Static files are things like html (yours or archived from others...), css, 
  //    or anything that doesn't change often.)
  
  // check in public folder (is the asset loading.html or index.html)
  fs.readFile(archive.paths.siteAssets + asset, function(err, data){
    if (err){ // this means it is an outside site, so we check archives/sites folder
      fs.readFile(archive.paths.archivedSites + asset, function(err, data){
        if (err){ // this means it is not archived
          // if a callback was provided, call it, otherwise respond with 404
          callback ? callback() : res.writeHead(404, headers);
        }
        else{ // it was archived. simply respond with that actual site
          res.writeHead(200, headers);
          res.end(data.toString());
        }  
      });
    }
    else{ // it was either index.html or loading.html. simply respond with it.
      res.writeHead(200, headers);
      res.end(data.toString());
    }
  });
};



// As you progress, keep thinking about what helper functions you can put here!
