// This is a JavaScript file

  var pictureSource;   // picture source
    var destinationType; // sets the format of returned value 

    // Wait for PhoneGap to connect with the device
    //
    document.addEventListener("deviceready",onDeviceReady,false);

    // PhoneGap is ready to be used!
    //
    function onDeviceReady() {
        pictureSource=navigator.camera.PictureSourceType;
        destinationType=navigator.camera.DestinationType;
    }

    // Called when a photo is successfully retrieved
    //
    function onPhotoDataSuccess(imageData) {
      var smallImage = document.getElementById('smallImage');
      smallImage.style.display = 'block';
      smallImage.src = "data:image/jpeg;base64," + imageData;
      //imagedata = imageData;
    }

    function onPhotoURISuccess(imageURI) {
        //document.getElementById("post_pic").display="block";
      var largeImage = document.getElementById('largeImage');
      largeImage.style.display = 'block';
      largeImage.src ="data:image/jpeg;base64,"+ imageURI;
      imagedata = "data:image/jpeg;base64,"+ imageURI;
      //console.log(imagedata);
    }
    
    function onPhotoReset() {
      var largeImage = document.getElementById('largeImage');
      largeImage.style.display = 'none';
      largeImage.src = "";
    }

    // A button will call this function
    //
    function capturePhoto() {
      // Take picture using device camera and retrieve image as base64-encoded string
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50 });
    }

    // A button will call this function
    //
    function capturePhotoEdit() {
      // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
      navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true }); 
    }

    // A button will call this function
    //
    function getPhoto(source) {
      // Retrieve image file location from specified source
      navigator.camera.getPicture(onPhotoURISuccess, onFail, { quality: 20, 
        //destinationType: destinationType.FILE_URI,
        destinationType: destinationType.DATA_URL,
        sourceType: source });
    }

    // Called if something bad happens.
    // 
    function onFail(message) {
      alert('Failed because: ' + message);
    }


var PostOb = Parse.Object.extend("Post");
    var imagedata = "";
 
	function savePostFn() {
//		$(this).attr("disabled","disabled").button("refresh");
		var noteText = $("#postText").val();
		//if(noteText == '') return;
 
		/*
		A bit complex - we have to handle an optional pic save
		*/
		if(imagedata != "") {
			var parseFile = new Parse.File("mypic.jpg",{base64:imagedata});
			//console.log(parseFile);
				parseFile.save().then(function() {
					var post = new PostOb();
					post.set("text",noteText);
                    post.set("poster_id",localStorage.getItem("local_id"));
                    console.log(localStorage.getItem("local_id"));
                    post.set("picture",parseFile);
					post.save(null, {
						success:function(ob) {
							//$.mobile.changePage("#home");
                            ons.navigator.popPage();
						}, error:function(e) {
							console.log("Oh crap", e);
						}
					});
					cleanUp();
				}, function(error) {
					console.log("Error");
					console.log(error);
				});
 
		} else {
			var post = new PostOb();
			post.set("text",noteText);
            post.set("poster_id",localStorage.getItem("local_id"));
			post.save(null, {
				success:function(ob) {
					//$.mobile.changePage("#home");
                    ons.navigator.popPage();
				}, error:function(e) {
					console.log("Oh crap", e);
				}
			});
			cleanUp();
 
		}
        querypost();
	};

function cleanUp() {
    	imagedata = "";
	//	$("#saveNoteBtn").removeAttr("disabled").button("refresh");
	//	$("#noteText").val("");
	//	$("#takePicBtn").text("Add Pic").button("refresh");
	}

//note that something wrong with this app

function returntime(input){
    var d = new Date();
    var ago ="";
    var second = Math.ceil((d.getTime()-input)/1000);
    
    var minute = second/60;
    var hour = minute/60;
    var day = hour/24;
    var month = day/30;
    var year = day/365;
    
    if(year>=1){
        ago= Math.ceil(year)+" year";
        if(year>1){ago+="s"};
      
    }else if(month>=1){
        ago= Math.ceil(month)+" month";
        if(month>1){ago+="s"};
        
    }else if(day>=1){
        ago= Math.ceil(day)+" day";
        if(day>1){ago+="s"};
      
    }else if(hour>=1){
        ago= Math.ceil(hour)+" hour";
        if(hour>1){ago+="s"};
      
    }else if(minute>=1){
        ago= Math.ceil(minute)+" minute";
        if(minute>1){ago+="s"};
       
    }else{
        ago= Math.ceil(second)+" minute";
        if(second>1){ago+="s"};
    }
     
    ago+=" ago";
    return ago;
}


function querypost(){
var query = new Parse.Query(PostOb);
    query.limit(10);
	query.descending("createdAt");
 
	query.find({
		success:function(results) {
			//$.mobile.loading("hide");
			var s = "";
			for(var i=0; i<results.length; i++) {
				
				var pic_user = results[i].get("poster_id");
                var pic_user_name = results[i].get("name");
                var post_date = eval('returntime('+results[i].createdAt.getTime()+')');
                
                //console.log("List of users: "+pic_user);
                var pic = results[i].get("picture");
				
                //Lame - should be using a template in angularjs
        		s += "<p><div class=\"post_item_con\">";
				//s += "<h3>Note " + results[i].createdAt + "</h3>";
				//s += results[i].get("text");
                
                if(pic) {
			          //No placeholder
                      //s += "<br/><a onclick=\"\"><img class=\"post_item\" src='" + pic.url() + "'></a><br/><a><img class='profile-pic-post' src='http://graph.facebook.com/" + pic_user + "/picture?type=small'/>"+pic_user_name+"</a></div>";
			          //With Placeholder
                
                      s += "<br/><a onclick=\"\"><img class=\"post_item\" style=\"background-image: url('"+pic.url()+"')\"></a>";
                      s += "<br/><a><img class='profile-pic-post' src='http://graph.facebook.com/" + pic_user + "/picture?type=small'/></a><div class='post_name_date'><a class='b'>"+pic_user_name+"</a></br>"+post_date+"</div>";
                }
                
				s += "</br></div></p>";
                //console.log(s);
			}
			$("#home-feed").html(s);
		},error:function(e) {
			//$.mobile.loading("hide");
 
		}
	});
};
 
function queryusers(){
var query = new Parse.Query(user);
    query.limit(10);
    query.descending("createdAt");
 
	query.find({
		success:function(results) {
			//$.mobile.loading("hide");
			var s = "";
			for(var i=0; i<results.length; i++) {
				//Lame - should be using a template
				s += "<p><div class=\"post_item_con\">";
				//s += "<h3>Note " + results[i].createdAt + "</h3>";
				//s += results[i].get("text");
				var quserid = results[i].get("username");
                var qusername = results[i].get("name");
                s += "<br/><a onclick=\"\"><img class=\"post_item\" src='"+""+"'></a><br/><a><img class='profile-pic-post' src='http://graph.facebook.com/" + quserid + "/picture?type=normal'/>"+qusername+"</a></div>";
				s += "</p>";
			}
			$("#search-feed").html(s);
		},error:function(e) {
			//$.mobile.loading("hide");
 
		}
	});
};
   
