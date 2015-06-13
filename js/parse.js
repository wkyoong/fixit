
// This is a JavaScript file
/*    
     function testparse(){
    var TestObject = Parse.Object.extend("TestObject");
    var testObject = new TestObject();
      testObject.save({foo: "bar"}, {
      success: function(object) {
      },
      error: function(model, error) {
      }
    });
    }
*/
///////////////////////////////////////////////////////
/////////////////Login Screen//////////////////////////
///////////////////////////////////////////////////////

var signuser = 0;
var signcon = 0;

//cant find a better way to show tabbar

function compiletabbar(){
var content = document.getElementById("tabbarplaceholder");
var pre="";
pre+='<ons-tabbar var="tabbar" animation="slide">';
pre+='<ons-tabbar-item page="home.html"    icon="globe"   label="Explore"   onclick="querypost()" active="true"></ons-tabbar-item>';
pre+='<ons-tabbar-item page="project.html" icon="home"    label="Project"   onclick="queryproject()" ></ons-tabbar-item>';
pre+='<ons-tabbar-item page="search.html"  icon="search"  label="Search"    onclick="queryusers()"></ons-tabbar-item>';
pre+='<ons-tabbar-item page="message.html" icon="comment" label="Messages" ></ons-tabbar-item>';
pre+='<ons-tabbar-item page="profile.html" icon="user"    label="profile"   onclick="populateprofile()"></ons-tabbar-item>';
pre+='</ons-tabbar>'; 
content.innerHTML=pre;
ons.compile(content);
querypost();
}

function decompiletabbar(){
var content = document.getElementById("tabbarplaceholder");
content.innerHTML='<ons-tabbar var="tabbar" hide-tabs="true"><ons-tabbar-item icon="home" label="Home" page="navigator.html" active="true"></ons-tabbar-item></ons-tabbar></ons-tabbar>'; 
ons.compile(content);
}


function logintoggle(){
    $("#login-show").slideToggle();
    $("#login-signup").slideToggle();
    signuser = 0;
    signcon = 0;
};

function logintogglesignup(){
     $("#login-signup-fill").slideToggle();
     $("#login-signup-con").slideToggle();
    signuser = 1;
    signcon = 0;
}

function logintogglesignupcon(){
     $("#login-signup-fill").slideToggle();
     $("#login-signup-user").slideToggle();
     signuser = 0;
     signcon = 1;
}

///////////////////////////////////////////////////////
/////////////////USER MANAGEMENT///////////////////////
///////////////////////////////////////////////////////

function signuserup(){
    var signupmail = $('#signup_email').val();
    var signuppass = $('#signup_password').val();
    parse_addnewuser(signupmail,signuppass,signupmail,"","","","",signuser,signcon)
    }

function parse_addnewuser(id,pass,email,fbname,fname,lname,gender,svc_user,svc_provider){
var user = new Parse.User();
user.set("username", id);
user.set("password", pass);
user.set("email", email);
user.set("name", fbname);
user.set("first_name", fname);
user.set("last_name", lname);
user.set("gender", gender);
user.set("user", svc_user);
user.set("provider", svc_provider);
user.signUp(null, {
  success: function(user) {
    // Hooray! Let them use the app now.
    compiletabbar();
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }
});
};      


function loginuser(){
    var mail = $('#login_email').val();
    var pass = $('#login_password').val();
Parse.User.logIn(mail, pass, {
  success: function(user) {
    // Do stuff after successful login.
    compiletabbar();
  },
  error: function(user, error) {
    // The login failed. Check error to see why.
    alert("Error: " + error.code + " " + error.message);
  }
});   
} 

function logoutfn(){
    Parse.User.logOut();
    decompiletabbar();
}

///////////////////////////////////////////////////////
/////////////////PROFILE MANAGEMENT////////////////////
///////////////////////////////////////////////////////

function populateprofile(){
    
    setTimeout(function()
            { 
                $("#profile_displayname").html(Parse.User.current().get("displayname"));
                $("#profile_email").html(Parse.User.current().get("email"));
                $("#profile_location").html(Parse.User.current().get("city")+", "+Parse.User.current().get("country"));
                $("#profile_phone").html(Parse.User.current().get("phone"));
                updateprofilepicafter();
                
            }
    , 250);
    
}

function updateprofilepicafter(){
    var profilepic = new Parse.Query(ProfilePicOb);
                profilepic.equalTo("poster_id",Parse.User.current().id);
                profilepic.descending("createdAt");
                profilepic.first({
                   success: function(results) {
                       if(results){
                        var pic = results.get("profilepic");
                        var cssarg = 'url('+pic.url()+')';
                        $("#profile_pic").css('backgroundImage',cssarg);
                        //console.log("Profile Pic found");
                       }
                       else{
                           console.log("No profile pic");
                           return;
                           
                        };
                   },
                        error: function(error) {
                        alert("Error: " + error.code + " " + error.message);
                   }
                })
}
 
var setprofileupdatefield=""; 
 
function setprofileupdater(field){
    setprofileupdatefield=field;
    setTimeout(function()
            { 
                if(setprofileupdatefield=="displayname"){
                $("#update_profile_field").html("Display Name");
                $("#update_profile_text").val(Parse.User.current().get("displayname"));
            }
                if(setprofileupdatefield=="email"){
                $("#update_profile_field").html("E-Mail");
                $("#update_profile_text").val(Parse.User.current().get("email"));
            }
                if(setprofileupdatefield=="phone"){
                $("#update_profile_field").html("Phone");
                $("#update_profile_text").val(Parse.User.current().get("phone"));
            }
                
            }
    , 300);
    
}

function updateProfileField(){
    var toupdate = Parse.User.current();
    var userinput=$("#update_profile_text").val();

                if(setprofileupdatefield=="displayname"){
                toupdate.set("displayname",userinput);
            }
                if(setprofileupdatefield=="email"){
                $("#update_profile_field").html("E-Mail");
                toupdate.set("email",userinput);
            }
                if(setprofileupdatefield=="phone"){
                $("#update_profile_field").html("Phone");
                toupdate.set("phone",userinput);
            }
console.log(userinput);
  toupdate.save(null, {
  
  success: function(user) {
    profileNavigator.popPage();
    populateprofile();
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }})

}

function updateProfileLocation(city,country){
    var toupdate = Parse.User.current();
    toupdate.set("city",city);
    toupdate.set("country",country);
    toupdate.save(null, {
  
  success: function(user) {
    // Do something
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }})
}

function updateProfileLatLon(lon,lat){
    var toupdate = Parse.User.current();
    var point = new Parse.GeoPoint([lat,lon]);
    toupdate.set("usergeopoint", point);
    toupdate.save(null, {
    
  success: function(user) {
    // Do something
    console.log("My Location Saved!")
  },
  error: function(user, error) {
    // Show the error message somewhere and let the user try again.
    alert("Error: " + error.code + " " + error.message);
  }})
}

var ProfilePicOb = Parse.Object.extend("ProfilePic");
     
    function saveProfilePic() {
     
    if(imagedata != "") {
            var image_file=Parse.User.current().id+".jpg";
			var parseFile = new Parse.File(image_file,{base64:imagedata});
			//console.log(parseFile);
				parseFile.save().then(function() {
					var profilepic = new ProfilePicOb();
					profilepic.set("poster_id",Parse.User.current().id);
                    profilepic.set("profilepic",parseFile);
					profilepic.save(null, {
						success:function(ob) {
							//$.mobile.changePage("#home");
                            ons.navigator.popPage();
                            setTimeout(function(){
                             updateprofilepicafter();
                             console.log("Waited and then changed the profile pic!")
                             },1000);
						}, error:function(e) {
							console.log("Oh crap", e);
						}
					});
					cleanUp();
				}, function(error) {
					//console.log("Error");
					console.log("Error with uploading pic: "+error);
				});
 
		} else {
			var profilepic = new ProfilePicOb();
            profilepic.set("poster_id",Parse.User.current().id);
			profilepic.save(null, {
				success:function(ob) {
					//$.mobile.changePage("#home");
                    ons.navigator.popPage();
				}, error:function(e) {
					console.log("Oh crap", e);
				}
			});
			cleanUp();
 
		}
        
	};

function onProfilePhotoReset(){
    $("#largeImageProfile").attr("src","img/userholder.png");
}

///////////////////////////////////////////////////////
/////////////////PROJECT MANAGEMENT////////////////////
///////////////////////////////////////////////////////

function createNewProject(){
    var projecttitle=$('#project_title').val();
    var projectdesc=$('#project_desc').val();
    var projectowner=Parse.User.current().id;
    //console.log(projectowner);
    
    var ProjectObject = Parse.Object.extend("ProjectObject");
    var project = new ProjectObject();
    
    project.set("userid",projectowner);
    project.set("title",projecttitle);
    project.set("desc",projectdesc);
    
    project.save(null, {
      success: function(user) {
      //console.log("Project Created!")
    },
    error: function(user, error) {
    alert("Error: " + error.code + " " + error.message);
  }})
    ons.navigator.popPage(); 
    var projectquery = new Parse.Query(ProjectObject);
    projectquery.equalTo("userid",Parse.User.current().id);
    projectquery.descending("createdAt");
    projectquery.first({
  success: function(object) {
    //   console.log(object.id);
    
    populateproject(object.id);
    document.getElementById("my_project_listing").innerHTML = "";
    queryproject();
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});
    
}


 
var project_query=0;
var project_current="";

function populateproject(projectid){
project_current=projectid;
console.log(project_current);
projectNavigator.pushPage('project_page.html');

var projectquery = new Parse.Query(Parse.Object.extend("ProjectObject"));
projectquery.get(projectid, {
  success: function(results) {
    //setTimeout(function() {
    document.getElementById("project_page_title").innerHTML = results.get('title');
    document.getElementById("project_page_desc").innerHTML = results.get('desc');      
    document.getElementById("project_page_budget").innerHTML = results.get('budget');      
    document.getElementById("project_page_date").innerHTML = results.get('date');      
    document.getElementById("project_page_time").innerHTML = results.get('time');      
    document.getElementById("project_page_service").innerHTML = results.get('service');      
    document.getElementById("project_page_location").innerHTML = results.get('location');      
    //}, 100);
    // The object was retrieved successfully.
  },
  error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
  }
});}

function deleteProject(){
    var projectquery = new Parse.Query(Parse.Object.extend("ProjectObject"));
    projectquery.equalTo("objectId",project_current);
    projectquery.get(project_current, {
    success: function(results) {
  
  results.destroy({
  success: function(myObject) {
      document.getElementById("my_project_listing").innerHTML = "";
      projectNavigator.popPage();
      queryproject();
    // The object was deleted from the Parse Cloud.
  },
  error: function(myObject, error) {
    // The delete failed.
    // error is a Parse.Error with an error code and message.
  }
  
}); 
  
  },
  error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
  } 
  });
}

function queryproject(){
var projectquery = new Parse.Query(Parse.Object.extend("ProjectObject"));
    projectquery.limit(50);
    projectquery.equalTo("userid",Parse.User.current().id);
    projectquery.descending("createdAt");
    
    //Somehow the function is firing 3 times - probably due to onsen ui quirks -> catch and return if auto fire
    
    if(project_query>0){return;};
    setTimeout(function() {
    project_query=0;    
    }, 1500);
    project_query+=1;
    console.log("Query project count: "+project_query);
	
    projectquery.find({
        
		success:function(results) {
			//$.mobile.loading("hide");
			var s = "";
			for(var i=0; i<results.length; i++) {
		 
                var project_id= results[i].id;
                var project_title= results[i].get("title");
                var project_desc = results[i].get("desc");
                var project_date = eval('returntime('+results[i].createdAt.getTime()+')');
                
            s+='<ons-list-item modifier="chevron" class="list-item-container" onclick="populateproject(\''+project_id+'\')"><ons-row>';
            s+='<ons-col width="95px"><img src="img/location1.png" class="thumbnail"></img></ons-col>';
            s+='<ons-col><div class="name">'+project_title+'</div>';
            s+='<div class="location"><i class="fa fa-clock-o"></i>'+project_date+'</div>';
            s+='<div class="desc">'+project_desc+'</div></ons-col><ons-col width="40px"></ons-col></ons-row></ons-list-item>';
 
			}
            $("#my_project_listing").append(s);
            //console.log(s);
            ons.compile(document.getElementById('project_div'));
		},error:function(e) {
			//$.mobile.loading("hide");
 
		}
	});
};

function parse_country(id,country){
    var LocationObject = Parse.Object.extend("LocationObject");
    var locationObject = new LocationObject();
    locationObject.set("username", id);
    locationObject.set("country", country);
    locationObject.save(null, {
      success: function(object) {
      },
      error: function(model, error) {
      }
    });
    }
    
function parse_latlon(id,lat,lon){
    var LocationObject = Parse.Object.extend("LocationObject");
    var query = new Parse.Query(LocationObject);
    var point = new Parse.GeoPoint({latitude: lat, longitude: lon});
    query.equalTo("username",id);
    query.first({
    success: function (LocationObject) {
        LocationObject.save(null, {
        success: function (results) {
        LocationObject.set("location", point);
        LocationObject.save();
                                    }
                                });

                            }
                        });

                    }

function parse_serviceprovider(){
var checkornot=document.getElementById("serviceprovidercheck").checked;
var userid=localStorage.getItem("local_id");
  var LocationObject = Parse.Object.extend("LocationObject");
    var query = new Parse.Query(LocationObject);
    query.equalTo("username",userid);
    query.first({
    success: function (LocationObject) {
        LocationObject.save(null, {
        success: function (LocationObject) {
        LocationObject.set("serviceprovider", checkornot);
        LocationObject.save();
                                    }
                                });

                            }
                        });
}
