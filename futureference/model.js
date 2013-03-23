Quotes = new Meteor.Collection("quotes");
Quotes.allow({
	insert: function(userId, quote) {
		return false; //use createQuote instead
	},
	update: function(userId, quote) {
		return false; //no editing quotes, that would ruin the fun
	},
	remove: function(userId, quote) {
		return quote.owner == userId; //you can only remove quotes that you "own"
	}
});

if (Meteor.isServer) {
	Meteor.methods({
		/* put all your sweet new methods here
		 * it's trusted code, so you can do pretty much anything
		 */
		 //user related methods
		 addToLikeCount:function(_userId)
		 {
		 	var userId = Meteor.userId();
		 	if (userId == _userId)
		 	{
			 	var user = Meteor.users.findOne({_id: userId});
			 	var newTotal = user.totalLiked;
			 	newTotal++;
			 	Meteor.users.update({_id: userId}, {$set: {totalLiked: newTotal}});
		 	}
		 }
	});
}