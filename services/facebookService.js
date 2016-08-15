var Q = require('q'),
	credentials = require('./credentials.js'),
	request = require('request'),
	moment = require('moment');

function getPosts(user) {
	
	var deferred = Q.defer(),
		newData = [],
		fb_app_id = credentials.fb_app_id,
		fb_app_secret = credentials.fb_app_secret;
		userId = user || credentials.fb_user_id;

	if (!userId) deferred.reject('No user specified');
	
	request({
		uri: 'https://graph.facebook.com/v2.7/' + userId + '/feed?access_token=' + fb_app_id + '|' + fb_app_secret,
		json: true
	}, function(error, response, body) {
		
		if (error) return deferred.reject('Error contacting Facebook Graph API');
		if (typeof body.data == 'undefined' || !body.data.length > 0) return deferred.reject('No posts found');
		
		function getImages(posts) {
		
		    posts.forEach(function(post) {
			    
		        var deferredImages = Q.defer(),
		        	newPost = {};
		        
				request({
					uri: 'https://graph.facebook.com/' + post.object_id + '?access_token=' + fb_app_id + '|' + fb_app_secret,
					json: true
				}, function(error, response, body) {
			
					if (error && response.statusCode !== 200) deferredImages.reject('Image not found');
					
					var text_html = post.message.replace(/((http)+(s)?:\/\/[^<>\s]+)/i, '<a href="$1" target="_blank">$1</a>');
					
					newPost.id = post.id;
					newPost.text = post.message;
					newPost.text_html = text_html;
					newPost.user = userId;
					newPost.source = 'facebook';
					newPost.date = post.created_time;
					newPost.date_stamp = moment(moment.unix(newPost.date), moment.ISO_8601);
					newPost.image = body.source;
					
					deferredImages.resolve(newPost);
							
				});
		        
		        newData.push(deferredImages.promise);
		        
		    });
		
		    return Q.all(newData);
		}
		
		getImages(body.data).then(function(data) {
			deferred.resolve(data);
		}, function(err) {
			deferred.reject(err);
		});
		
	});
	
	return deferred.promise;

}

module.exports.getPosts = getPosts;