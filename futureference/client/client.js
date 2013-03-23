Meteor.subscribe("directory");
Meteor.subscribe("quotes");

Template.main.greeting = function () {
 	return "Welcome to futureference.";
};

Template.userPage.userName = function() {
 	return "User Name";
};

Template.quote.selectedQuote = function() {
	if (Session.get("selectedQuote") == this._id)
		return true;
	else
		return false;
};

Template.quote.isOwner = function() {
	return Meteor.userId() == this.owner;
};

Template.main.quote = function() { 
 	return Quotes.find({owner: Meteor.userId()});
};

Template.userPage.user = function() {
	return Quotes.find({owner: 5344});
}

Template.main.events({});

Template.quote.events({
	'click' : function() {
		Session.set("selectedQuote", this._id);
	}
});