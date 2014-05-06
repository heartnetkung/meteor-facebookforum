Posts = new Meteor.Collection('posts');

Router.configure({
	data : function() {
		return {
			params : _.clone(this.params)
		};
	},
	waitOn : function() {
		return [Meteor.subscribe('users')];
	},
	fastRender : true
});

Router.map(function() {
	this.route('home', {
		path : '/'
	});

	this.route('postpage', {
		path : 'post/:_id',
		data : function() {
			return {
				'post_id' : this.params._id
			};
		}
	});
});

if (Meteor.isServer) {
	Meteor.publish('all_posts', function() {
		return Posts.find({});
	});
	Meteor.publish('users', function() {
		return Meteor.users.find({});
	});
	/*FastRender.onAllRoutes(function() {
	 this.subscribe('posts');
	 });*/
}

/*if (Meteor.isServer) {
 FastRender.route('post/:id', function() {
 this.subscribe('posts');
 });
 FastRender.route('/', function() {
 this.subscribe('posts');
 });
 }*/
