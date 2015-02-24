var Q = require('q'),
	credentials = require('./credentials.js'),
	twit = require('twit'),
	moment = require('moment');

function getPosts(user) {
	
	var deferred = Q.defer(),
		newData = [],
		userId = user || credentials.twitter_user_id;
		T = new twit({
	    	consumer_key: credentials.twitter_consumer_key,
			consumer_secret: credentials.twitter_consumer_secret,
			access_token: credentials.twitter_access_token,
			access_token_secret: credentials.twitter_access_token_secret
		});
		
	if (!userId) deferred.reject('No user specified');
	
	T.get('statuses/user_timeline/:id', {id: userId, count: 10}, function(error, data, response) {
		
		if (error) return deferred.reject(error.message);
		
		data.forEach(function(post) {
			
			var newPost = {};
			
			newPost.id = post.id.toString();
			newPost.message = post.text;
			newPost.user = post.user.screen_name;
			newPost.source = 'twitter';
			newPost.date = new Date(Date.parse(post.created_at)).getTime()/1000;
			newPost.date_stamp = moment(moment.unix(newPost.date), moment.ISO_8601);
			if (post.entities.media) {
				newPost.image = post.entities.media[0].media_url;
			}
			
			newData.push(newPost);
			
		});
		
		deferred.resolve(newData);
		
	});
	
	return deferred.promise;

}

module.exports.getPosts = getPosts;