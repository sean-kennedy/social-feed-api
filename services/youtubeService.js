var Q = require('q'),
	credentials = require('./credentials.js'),
	request = require('request'),
	moment = require('moment');

function getPosts(user) {
	
	var deferred = Q.defer(),
		newData = [],
		youtube_api_key = credentials.youtube_api_key,
		userId = user || credentials.youtube_channel_id;

	if (!userId) deferred.reject('No user specified');
	
	request({
		uri: 'https://www.googleapis.com/youtube/v3/search?part=snippet,id&channelId=' + userId + '&order=date&maxResults=10&key=' + youtube_api_key,
		json: true
	}, function(error, response, body) {
		
		if (error) return deferred.reject('Error contacting YouTube API');
		if (typeof body.items == 'undefined' || !body.items.length > 0) return deferred.reject('No posts found');
		
		body.items.forEach(function(post) {
			
			var newPost = {};
			
			newPost.id = post.id.videoId;
			newPost.message = post.snippet.title;
			newPost.user = post.snippet.channelTitle;
			newPost.source = 'youtube';
			newPost.date = new Date(Date.parse(post.snippet.publishedAt)).getTime()/1000;
			newPost.date_stamp = moment(moment.unix(newPost.date), moment.ISO_8601);
			newPost.image = post.snippet.thumbnails.high.url;
			
			newData.push(newPost);
			
		});
		
		deferred.resolve(newData);
		
	});
	
	return deferred.promise;

}

module.exports.getPosts = getPosts;