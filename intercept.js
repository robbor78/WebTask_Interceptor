var MongoClient = require('mongodb').MongoClient;

var insertDocument = function(db, req, callback) {
    var bv = db          .collection('blogvisitors');

    bv.insertOne({
        date: Date.now(),
        useragent: req.headers['user-agent'],
        method: req.method},
                 function(err,result) {
                     console.log('data inserted.');
                     callback();

                 });
};

module.exports = function(context, req, res) {
    console.log('incoming request... ');
    console.log(req);

    MongoClient.connect(context.data.MONGO_URL, function (err, db) {
        if(err) return done(err);

        console.log('saving to db...');

        insertDocument(db, req, function() {
            console.log('closing db connection');
            db.close();

            console.log('constructing response...');
            res.writeHead(301,
                          {
                              'Location': 'https://github.com/robbor78/WebTask_Interceptor',
                              'Content-Type': 'text/html'
                          });
            res.end('<html><head><title>Redirecting...</title></head><body><h1>Redirecting</h1><p>Redirecting to <a href="https://github.com/robbor78/WebTask_Interceptor">https://github.com/robbor78/WebTask_Interceptor</a>.</p></body></html>');

            console.log('redirecting...');
        });

    });


};

