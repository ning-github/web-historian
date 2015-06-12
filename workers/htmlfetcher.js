// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
var archive = require('../helpers/archive-helpers');
// just call it (this will be continously run on a schedule by cron)
archive.readListOfUrls(archive.downloadUrls);

/* NOTES */

/*
  To run this, can simply type: 

    $ node htmlfetchers.js

  This can be turned into a cronjob with a crontab.txt file.
  
  The command: 

    $ crontab -e

  will show you panel of current cronjobs and you can manage 
*/