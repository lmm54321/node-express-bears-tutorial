var express     = require('express');
var app         = express();
var bodyParser  = require('body-parser');

var mongoose    = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bears',{ useNewUrlParser: true});

console.log(mongoose.connection.readyState);
var db = mongoose.connection;
db.on('error', console.log.bind(console, 'MongoDB connection error:'));
db.on('open', console.log.bind(console, 'MongoDB open:'));


var Bear        = require('./app/models/bear');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();
router.use(function(req, res, next) {
    console.log('Something is happening.');
    console.log(mongoose.connection.readyState);
    next();
});
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

router.route('/bears')
    .post(function(req, res) {
        console.log('reached POST /bears');
        var bear = new Bear();
        bear.name = req.body.name;

        bear.save(function(err){
            if (err){
                console.log(err);
                res.send(err);
                return;}
            res.json({ message: 'Bear created!' });
        });
    })
    .get(function(req, res){
        console.log('reached GET /bears');
        Bear.find(function(err, bears){
            if (err)
                res.send(err);
            res.json(bears);
        });
    });

router.route('/bears/:bear_id')
    .get(function(req, res) {
        Bear.findById(req.params.bear_id, function(err, bear){
            if (err)
                res.send(err);
            res.json(bear);
        });
    })
    .put(function(req, res){
        Bear.findById(req.params.bear_id, function(err, bear){
            if (err)
                res.send(err);
            bear.name = req.body.name;
            bear.save(function(err){
                if (err)
                    res.send(err);
                res.json({ message: 'Bear updated!' });
            });
        });
    })
    .delete(function(req, res){
        Bear.remove({
            _id: req.params.bear_id
        }, function(err, bear) {
            if (err)
                res.send(err);
            res.json({ message: 'Successfully deleted' });
        });
    });

app.use('/api', router);

app.listen(port);
console.log('Magic happens on port ' + port);
