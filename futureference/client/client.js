Meteor.subscribe("directory");
Meteor.subscribe("quotes");

Template.main.greeting = function () {
 return "Welcome to futureference.";
};

Template.main.events({
  'click input' : function () {
  // template data, if any, is available in 'this'
  if (typeof console !== 'undefined')
    console.log("You pressed the button");
  }
  });