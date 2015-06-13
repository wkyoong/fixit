
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
    console.log("logging out..");
    Parse.User.logOut();
    decompiletabbar();
    console.log("logged out!");
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
            var parseThumb= new Parse.File(image_file,{base64:thumbdata});
			//console.log(parseFile);
				parseFile.save().then(function() {
					var profilepic = new ProfilePicOb();
					profilepic.set("poster_id",Parse.User.current().id);
                    profilepic.set("profilepic",parseFile);
                    //profilepic.set("thumbnail",parseThumb);
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


function updateskill(){
    ons.navigator.pushPage("profile_add_skill.html");
    if(Parse.User.current().get("skill1")==1){cb1=true}else{cb1=false};
    if(Parse.User.current().get("skill2")==1){cb2=true}else{cb2=false};
    if(Parse.User.current().get("skill3")==1){cb3=true}else{cb3=false};
    if(Parse.User.current().get("skill4")==1){cb4=true}else{cb4=false};
    if(Parse.User.current().get("skill5")==1){cb5=true}else{cb5=false};
    if(Parse.User.current().get("skill6")==1){cb6=true}else{cb6=false};
    if(Parse.User.current().get("skill7")==1){cb7=true}else{cb7=false};
    if(Parse.User.current().get("skill8")==1){cb8=true}else{cb8=false};
    
    setTimeout(function()
            { 
                $("#checkbox1").attr("checked",cb1);
                $("#checkbox2").attr("checked",cb2);
                $("#checkbox3").attr("checked",cb3);
                $("#checkbox4").attr("checked",cb4);
                $("#checkbox5").attr("checked",cb5);
                $("#checkbox6").attr("checked",cb6);
                $("#checkbox7").attr("checked",cb7);
                $("#checkbox8").attr("checked",cb8);
                
            }
    , 250);
}

function updateskillbtn(){
    
    if(document.getElementById('checkbox1').checked){var sk1=1}else{var sk1=0};
    if(document.getElementById('checkbox2').checked){var sk2=1}else{var sk2=0};
    if(document.getElementById('checkbox3').checked){var sk3=1}else{var sk3=0};
    if(document.getElementById('checkbox4').checked){var sk4=1}else{var sk4=0};
    if(document.getElementById('checkbox5').checked){var sk5=1}else{var sk5=0};
    if(document.getElementById('checkbox6').checked){var sk6=1}else{var sk6=0};
    if(document.getElementById('checkbox7').checked){var sk7=1}else{var sk7=0};
    if(document.getElementById('checkbox8').checked){var sk8=1}else{var sk8=0};
    
    var skills = Parse.User.current();

    skills.set("skill1",sk1); 
    skills.set("skill2",sk2);
    skills.set("skill3",sk3); 
    skills.set("skill4",sk4);
    skills.set("skill5",sk5); 
    skills.set("skill6",sk6);
    skills.set("skill7",sk7); 
    skills.set("skill8",sk8);
    
    skills.save(null, {success:function(ob) {}, error:function(e) {console.log("Oh crap", e);}})
                        
    ons.navigator.popPage();
    
}



///////////////////////////////////////////////////////
/////////////////PROJECT MANAGEMENT////////////////////
///////////////////////////////////////////////////////

function createNewProject(){
    //var projecttitle=$('#project_title').val();
    //var projectdesc=$('#project_desc').val();
    //var projectowner=Parse.User.current().id;
    //console.log(projectowner);
    
    var ProjectObject = Parse.Object.extend("ProjectObject");
    var project = new ProjectObject();
    
    project.set("userid",Parse.User.current().id);
    project.set("title",$('#project_title').val());
    project.set("desc",projectdesc=$('#project_desc').val());
    ///////////////////////////
    
    if(imagedata != "") {
            var image_file=Parse.User.current().id+".jpg";
    		var parseFile = new Parse.File(image_file,{base64:imagedata});
            //var parseThumb= new Parse.File(image_file,{base64:thumbdata});
			//console.log(parseFile);
				parseFile.save().then(function() {
					project.set("project_pic",parseFile);
					project.save(null, {
						success:function(ob) {
							//$.mobile.changePage("#home");
                            setTimeout(function(){
                            // updateprofilepicafter();
                            },1000);
						}, error:function(e) {
							console.log("Oh crap", e);
						}
					});
					//cleanUp();
				}, function(error) {
					//console.log("Error");
					console.log("Error with uploading pic: "+error);
				});
                
		} 

    
    /////////////////////////
 /*   project.save(null, {
      success: function(user) {
      //console.log("Project Created!")
    },
    error: function(user, error) {
    alert("Error: " + error.code + " " + error.message);
  }})*/
    ons.navigator.popPage(); 
    var projectquery = new Parse.Query(ProjectObject);
    projectquery.equalTo("userid",Parse.User.current().id);
    projectquery.descending("createdAt");
    
    setTimeout(function(){
    projectquery.first({
  success: function(object) {
    //   console.log(object.id);
    
    // psuhing to project pic
            var ProjectPicOb = Parse.Object.extend("ProjectPic");
            var projectpicpush = new ProjectPicOb();
            
            parseFile.save().then(function() {
                    projectpicpush.set("project_id",object.id);
            		projectpicpush.set("projectpic",parseFile);
					projectpicpush.save(null, {
						success:function(ob) {
							//$.mobile.changePage("#home");
                            setTimeout(function(){
                            // updateprofilepicafter();
                            },1000);
						}, error:function(e) {
							console.log("Oh crap", e);
						}
					});
					//cleanUp();
				}, function(error) {
					//console.log("Error");
					console.log("Error with uploading pic: "+error);
				});
    
    populateproject(object.id,1);
    
    document.getElementById("my_project_listing").innerHTML = "";
    queryproject();
  },
  error: function(error) {
    alert("Error: " + error.code + " " + error.message);
  }
});
    },3000); 
}


 
var project_query=0;
var project_current="";

function populateproject(projectid,push){
project_current=projectid;
//console.log(project_current);
if(push==1){projectNavigator.pushPage('project_page.html');}
var projectquery = new Parse.Query(Parse.Object.extend("ProjectObject"));

projectquery.get(projectid, {
  success: function(results) {
    //setTimeout(function() {
    if(results.get('desc')==undefined){var descfield="Please describe the work"}/*else if(results.get('desc').length==0){var descfield="Please describe the work"}*/else{var descfield=results.get('desc')}
    if(results.get('budget')==undefined){var budgetfield="How much is your budget?"}/*else if(results.get('budget').length==0){var budgetfield="How much is your budget?"}*/else{var budgetfield=results.get('budget')}
    if(results.get('date')==undefined){var datefield="When do you need this service?"}/*else if(results.get('date').length==0){var datefield="When do you need this service?"}*/else{var datefield=results.get('date')}
    if(results.get('time')==undefined){var timefield="When is the best time to contact you?"}/*else if(results.get('time').length==0){var timefield="When is the best time to contact you?"}*/else{var timefield=results.get('time')}
    if(results.get('service')==undefined){var servicefield="What services do you need?"}/*else if(results.get('service').length==0){var servicefield="What services do you need?"}*/else{var servicefield=results.get('service')}
    if(results.get('location')==undefined){var locationfield="Where would the work be?"}/*else if(results.get('location').length==0){var locationfield="Where would the work be?"}*/else{var locationfield=results.get('location')}
    
    document.getElementById("project_page_title").innerHTML = "<a class=\"black\" onclick='updateProjectText(\"text\",\"title\",\""+project_current+"\",\""+results.get('title')+"\")'>"+results.get('title')+"</a>";
    document.getElementById("project_page_desc").innerHTML = "<a class=\"black\" onclick='updateProjectText(\"text\",\"desc\",\""+project_current+"\",\""+descfield+"\")'>"+descfield+"</a>";     
    document.getElementById("project_page_budget").innerHTML = "<a class=\"black\" onclick='updateProjectText(\"budget\",\"budget\",\""+project_current+"\",\""+budgetfield+"\")'>"+budgetfield+"</a>";   
    document.getElementById("project_page_date").innerHTML = "<a class=\"black\" onclick='updateProjectText(\"date\",\"date\",\""+project_current+"\",\""+datefield+"\")'>"+datefield+"</a>";      
    document.getElementById("project_page_time").innerHTML = "<a class=\"black\" onclick='updateProjectText(\"time\",\"time\",\""+"\",\""+timefield+"\")'>"+timefield+"</a>"; 
    document.getElementById("project_page_service").innerHTML = "<a class=\"black\" onclick='updateProjectText(\"service\",\"service\",\""+"\",\""+servicefield+"\")'>"+servicefield+"</a>";    
    document.getElementById("project_page_location").innerHTML = "<a class=\"black\" onclick='updateProjectText(\"location\",\"location\",\""+"\",\""+locationfield+"\")'>"+locationfield+"</a>";     
    //}, 100);
    
//    console.log(Math.floor($(window).width()/3));
    getProjectImages();
  },
  error: function(object, error) {
    // The object was not retrieved successfully.
    // error is a Parse.Error with an error code and message.
  }
});}

function getProjectImages(){
    var projectpicquery = new Parse.Query(Parse.Object.extend("ProjectPic"));
    projectpicquery.equalTo("project_id",project_current);
    projectpicquery.find({
        
    success:function(results) {
    
    var s = "";
	for(var i=0; i<results.length; i++) {
    
    s+='<li class="projectimgli"><a onclick="fullscreenimg(\''+results[i].get("projectpic").url()+'\')"><img class="projectimg" src="'+results[i].get("projectpic").url()+'"</img></a></li>';
    
    }
    document.getElementById("project_pics").innerHTML = s;
    console.log(s);
    setTimeout(function(){
    $('.projectimg').css({"height":Math.floor($(window).width()/3)});
    $('.projectimgli').css({"height":Math.floor($(window).width()/3)});
    },1000);
    },error: function(object,error){}

});
}

function updateProjectText(type,field,projectid,placeholder){
    //$(".project_list").hide();
    //pfield=".project_"+field;
    //$(".project_text").show();
    console.log(placeholder);
    console.log(field);
    projectNavigator.pushPage("project_updater.html");
        
        setTimeout(function(){
            if(field=="title"){$('#update_project_field').html('Project Title');}
            if(field=="desc"){$('#update_project_field').html('Project Description');}
            if(field=="budget"){$('#update_project_field').html('Project Budget');}
            if(field=="date"){$('#update_project_field').html('Appointment Date');}
            if(field=="time"){$('#update_project_field').html('Appointment Time');}
            if(field=="location"){$('#update_project_field').html('Project Location');}
            if(field=="service"){$('#update_project_field').html('Services Required');}
            $('#update_project_text').val(placeholder);
        }, 300);    
    project_updating_field=field;
}

var project_updating_field="";

function updateProjectField(){
    var value =$('#update_project_text').val();
    var Point = Parse.Object.extend("ProjectObject");
    var point = new Point();
    point.id = project_current;
    point.set(project_updating_field, value);
    point.save(null, {
    success: function(point) {
        ons.navigator.popPage();
        populateproject(project_current,0);
    // Saved successfully.
    },
    error: function(point, error) {
    }
    });
}

function projectpageback(){
    ons.navigator.popPage();
    queryproject();
}


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
 	
    projectquery.find({
        
		success:function(results) {
			//$.mobile.loading("hide");
			var s = "";
			for(var i=0; i<results.length; i++) {
		 
                var project_id= results[i].id;
                var project_title= results[i].get("title");
                var project_desc = results[i].get("desc");
                var project_date = eval('returntime('+results[i].createdAt.getTime()+')');
                var project_pic = results[i].get("project_pic").url();
            //if(project_pic==undefined){project_pic="img/location1.png";}
                
            s+='<ons-list-item modifier="chevron" class="list-item-container" onclick="populateproject(\''+project_id+'\',1)"><ons-row>';
            s+='<ons-col width="95px"><img src="'+project_pic+'" class="thumbnail"></img></ons-col>';
            s+='<ons-col><div class="name">'+project_title+'</div>';
            s+='<div class="location"><i class="fa fa-clock-o"></i>'+' '+project_date+'</div>';
            s+='<div class="desc">'+project_desc+'</div></ons-col><ons-col width="40px"></ons-col></ons-row></ons-list-item>';
            
			}
            $("#my_project_listing").html(s);
            //console.log(s);
            ons.compile(document.getElementById('project_div'));
            
		},error:function(e) {
			//$.mobile.loading("hide");
 
		}
	});
};


var ProjectPicOb = Parse.Object.extend("ProjectPic");
     
    function saveProjectPic(){
     
    if(imagedata != "") {
            var image_file=project_current+".jpg";
    		var parseFile = new Parse.File(image_file,{base64:imagedata});
            //var parseThumb= new Parse.File(image_file,{base64:thumbdata});
			//console.log(parseFile);
				parseFile.save().then(function() {
					var projectpic = new ProjectPicOb();
					projectpic.set("project_id",project_current);
                    projectpic.set("projectpic",parseFile);
                    //projectpic.set("thumbnail",parseThumb);
					projectpic.save(null, {
						success:function(ob) {
							//$.mobile.changePage("#home");
                            ons.navigator.popPage();
                            setTimeout(function(){
                             //do something
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
			var projectpic = new ProjectPicOb();
            projectpic.set("project_id",project_current);
			projectpic.save(null, {
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

function onProjectPhotoReset(){
    $("#largeImage").attr("src","");
}

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
