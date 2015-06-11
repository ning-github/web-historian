var fs = require('fs');
var path = require('path');
var _ = require('underscore');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

/*
 on POST
 first check if in list (the list simply holds ALL sites entered)
   - think of the LIST as being a to-do list of things to be archived
   - on a Cron schedule, the worker will downloadUrls on the list, placing
       those urls in the ARCHIVE

   if in list
     check if archived (recall that archived holds the downloaded site data FILES)
       if archived, take to that page
       if not archived, give loading page

   if not in list
     add to list, take to loading page
*/

exports.readListOfUrls = function(callback){
  var sites = [];
  // read the list, which is a single file at exports.paths.list
  fs.readFile(exports.paths.list, function(err, data){
    sites = data.toString().split('\n');
    callback(sites);
  });
};

exports.isUrlInList = function(url, callback){
  exports.readListOfUrls(function(sites){
    var found = _.contains(sites, url);
    callback(found);
  });
};

exports.addUrlToList = function(url, callback){
  fs.appendFile(exports.paths.list, url, function(err, data){
    callback();
  });
};

exports.isURLArchived = function(url, callback){
  // a hypothetical path that would be that url's sitefile IF it existed
  var sitePath = path.join(exports.paths.archivedSites, url);
  // if it exists, perform the callback
  fs.exists(sitePath, function(err, found){
    if (found){
      callback(found);
    }
  })
};

exports.downloadUrls = function(urls){
  // urls is an array of urls, each of which's data becomes a newly created file
  _.each(urls, function(eachUrl){
    if(!eachUrl){ return; }
    request('http://' + eachUrl).pipe(fs.createWriteStream(exports.paths.archivedSites+'/'+eachUrl));
    //  ^-- gets the site data    ^--pipes to    ^-- creation of a file with a unique path that is the url name
  });
  return true;
};
