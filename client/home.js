var subscription = Meteor.subscribe('all_posts');
Template.home.posts = function() {
	return Posts.find({}, {
		sort : _(['timestamp']).object([-1])
	});
};

Template.home.events({
	'keyup textarea:not([disabled])' : function(event) {
		if (!$(event.target).val())
			$('.post-topic').addClass('hide');
		else
			$('.post-topic').removeClass('hide');
	},
	'click .post-topic' : function(event) {
		var currentUser = Meteor.user();
		Posts.insert({
			timestamp : new Date(),
			author : {
				name : currentUser.profile.name,
				fb_id : currentUser.services.facebook.id,
				id : currentUser._id
			},
			text : $('textarea').val(),
			comments : [],
			likes : []
		});
		$('textarea').val('');
	},
	'click .whole-post' : function() {
		console.log('/post/' + this._id);
		Router.go('/post/' + this._id);
	}
});

Template.postpage.currentPost = function() {
	return Posts.findOne(this.post_id, {
		transform : function(post) {
			post.hasLiked = _.contains(post.likes, Meteor.user()._id);
			return post;
		}
	});
};
Template.postpage.events({
	'click .like-button' : function(event) {
		if ($(event.target).closest('.like-button').hasClass('liked')) {
			Posts.update({
				_id : this._id
			}, {
				$pull : {
					likes : Meteor.userId()
				}
			});
		} else {
			Posts.update({
				_id : this._id
			}, {
				$addToSet : {
					likes : Meteor.userId()
				}
			});
		}
	},
	'keyup textarea:not([disabled])' : function(event) {
		if ((event.which === 13) && !event.shiftKey) {
			console.log(this._id)
			var currentUser = Meteor.user();
			Posts.update({
				_id : this._id
			}, {
				$push : {
					comments : {
						timestamp : new Date(),
						author : {
							name : currentUser.profile.name,
							fb_id : currentUser.services.facebook.id,
							id : currentUser._id
						},
						text : $(event.target).val()
					}
				}
			});
			$(event.target).val('');
		}
	}
});

Template.topbar.events({
	'click .logout' : function() {
		Meteor.logout();
	},
	'click .login' : function() {
		Meteor.loginWithFacebook();
	}
});
