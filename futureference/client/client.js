Meteor.subscribe("directory");
Meteor.subscribe("quotes");


Session.setDefault("currentPage", 0);

Accounts.ui.config({
	passwordSignupFields: 'USERNAME_AND_EMAIL'
});

//THIS CODE WAS TAKEN FROM THE 'TODOS' EXAMPLE
//*******************************
// Returns an event map that handles the "escape" and "return" keys and
// "blur" events on a text input (given by selector) and interprets them
// as "ok" or "cancel".
var okCancelEvents = function (selector, callbacks) {
  var ok = callbacks.ok || function () {};
  var cancel = callbacks.cancel || function () {};

  var events = {};
  events['keyup '+selector+', keydown '+selector+', focusout '+selector] =
    function (evt) {
      if (evt.type === "keydown" && evt.which === 27) {
        // escape = cancel
        cancel.call(this, evt);

      } else if (evt.type === "keyup" && evt.which === 13 ||
                 evt.type === "focusout") {
        // blur/return/enter = ok/submit if non-empty
        var value = String(evt.target.value || "");
        if (value)
          ok.call(this, value, evt);
        else
          cancel.call(this, evt);
      }
    };

  return events;
};
//*******************************


Template.home.greeting = function () {
 	
 	return "Welcome to futureference.";
};

Template.main.currentPage = function() {
	return Session.get("currentPage");
}

Template.home.userQuotes = function() {
 	return Quotes.find({owner: Meteor.userId()});
};

Template.userPage.userName = function() {
	var username = Meteor.users.findOne({_id: Session.get("currentPage")}).username;
	return username;
	//eventually return the Session variable that has the page stored
};
Template.quote.total = function(){
	console.log(this.totalLiked);
	return ("Likes: "  + this.totalLiked.toString());
}
Template.quote.selectedQuote = function() {
	if (Meteor.userId() != null)
	{
		if (Session.get("selectedQuote") == this._id)
			return true;
		else
			return false;
	}
	else
		return false;	
};

Template.quote.isOwner = function() {
	//we return if they're the owner, so they can delete the quotes
	return Meteor.userId() == this.owner;
};
Template.quote.isFaved = function() {
    //we return if they're the owner, so they can delete the quotes
    var favArray = Meteor.users.findOne({_id: Meteor.userId()}).favsList
 if (favArray != null){
    if (favArray.length > 0 ){
        for (var i = 0; i < favArray.length; i++){
            if (favArray[i] == this._id){
                return true;
            }
        }
    }
}
    return false;
};

Template.quote.rendered = function() {
	$('.quotes').tooltip();
};

Template.home.loggedIn = function() {
	return Meteor.userId();
};

Template.home.quote = function() { 
	//this is the main page, so it just shows the quotes 
	//of the logged in user
 	return Quotes.find({owner: Meteor.userId()});
};

Template.userPage.user = function() {
	//this is hardcoded to my test account right now
	//eventually it should be tied to a Session variable like
	//Session.get("currentPage", userId);
	return Quotes.find({owner: Session.get("currentPage")});
};

Template.nav.loggedIn = function() {
	return Meteor.userId();
};

Template.main.events({
	'click input.btnMyPage':function(){
		Session.set("currentPage", Meteor.userId());
	}
});

Template.main.events({
	'click input.btnHome':function(){
		Session.set("currentPage", 0);
	}
});

Template.quote.events({
	'click' : function() {
		if (Session.get("selectedQuote") == this._id)
			Session.set("selectedQuote", null);
		else
			Session.set("selectedQuote", this._id);
	},
	'click input.btnDelete': function(){
		Meteor.call("deleteQuote", Meteor.userId(), this._id);
	},
	'click input.btnFavorite': function(){
		
		Meteor.call("addToFavs", this);

	},
	'click input.btnUnFav': function(){
		
		Meteor.call("removeFavs", this);

	}
});

Template.userSearch.events(okCancelEvents('#txtFriendSearch', {
	ok: function(text, evt){
		//this needs to only work if the email is on their friends list
		//but it can wait I suppose
		/*Meteor.call("checkFriend", Meteor.userId(), text, function(err, data){
			if (err)
			{
				console.log(err);
				evt.target.value = "";
			}
			else
			{
				if (data.friendId == null)
					console.log("not friends")
				else
					Session.set("currentPage", data.friendId);
				evt.target.value = "";
			}
		});*/
		Session.set("currentPage", Meteor.users.findOne({emails: {$elemMatch: {address: text}}})._id);
	}
}));

//for the addquote enter key button
Template.userPage.events(okCancelEvents('#txtAddQuote',{
	ok: function(text, evt){
		Meteor.call("addQuote", Session.get("currentPage"), text);
		evt.target.value = "";
	}
}));
