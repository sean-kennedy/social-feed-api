var express = require('express'),
	app = express(),
	Q = require('q'),
	credentials = require('./services/credentials.js'),
	facebookService = require('./services/facebookService.js'),
	twitterService = require('./services/twitterService.js'),
	youtubeService = require('./services/youtubeService.js'),
	apicache = require('apicache').options({ debug: false, enabled: true }).middleware,
	apicache_time = '5 minutes',
	port = process.env.PORT || 5050;

// Facebook
app.get('/facebook', apicache(apicache_time), function(req, res) {
	
	facebookService.getPosts(req.query.user).then(function(data) {
		res.json(data);
	}, function(err){
		res.json({error: err});
	});

});

// Twitter
app.get('/twitter', apicache(apicache_time), function(req, res) {
	
	twitterService.getPosts(req.query.user).then(function(data) {
		res.json(data);
	}, function(err){
		res.json({error: err});
	});

});

// Youtube
app.get('/youtube', apicache(apicache_time), function(req, res) {
	
	youtubeService.getPosts(req.query.user).then(function(data) {
		res.json(data);
	}, function(err){
		res.json({error: err});
	});

});

// Feed
app.get('/feed', apicache(apicache_time), function(req, res) {
	
	Q.all([facebookService.getPosts(credentials.fb_user_id), twitterService.getPosts(credentials.twitter_user_id), youtubeService.getPosts(credentials.youtube_channel_id)]).spread(function(facebook, twitter, youtube) {
		
		var feed = [].concat(facebook, twitter, youtube);
		
		feed.sort(function(x, y){
			return y.date - x.date;
		});
		
		res.json(feed);
		
	}, function(err) {
		res.json({error: err});
	});

});

app.get('/', function(req, res) {

	res.json({
		title: 'Social Feed API',
		version: '1.0',
		description: 'An API to aggregate all your social media content into one place'
	});

});

app.listen(port, function() {
	console.log('Listening on ' + port);
});