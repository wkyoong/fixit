// This is a JavaScript file

ons.ready(function(){
     });

function getuserdetails(){
document.getElementById("get_user").innerHTML = localStorage.getItem("local_user");
document.getElementById("get_user_email").innerHTML = localStorage.getItem("local_email"); 
//document.getElementById("get_user_id").src ='http://graph.facebook.com/' + localStorage.getItem("local_id") + '/picture?type=small';
}

function sleep(millis, callback) {
    setTimeout(function()
            { callback(); }
    , millis);
}

var options = {
  animation: 'slide', // What animation to use
  onTransitionEnd: function() {alert("Hello!")} // Called when finishing transition animation
};

  
var addpostfn = {
  animation: 'slide',
  onTransitionEnd: function() {addpostfunc()}
  };  
  
function addpostfunc(){
document.getElementById("add_post_user_pic").src ='http://graph.facebook.com/' + localStorage.getItem("local_id") + '/picture?type=small';
document.getElementById("add_post_user_name").innerHTML = localStorage.getItem("local_user");
};
 
