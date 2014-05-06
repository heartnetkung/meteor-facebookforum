if (!Accounts.loginServiceConfiguration.findOne({})) {
	Accounts.loginServiceConfiguration.insert({
		service : "facebook",
		appId: Meteor.settings.facebookAppId,
        secret: Meteor.settings.facebookSecret
	});
}