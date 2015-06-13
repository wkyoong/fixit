
     // Defaults to sessionStorage for storing the Facebook token
     openFB.init({appId: '259187507625196'});

    //  Uncomment the line below to store the Facebook token in localStorage instead of sessionStorage
    //openFB.init({appId: 'YOUR_FB_APP_ID', tokenStore: window.localStorage});

    function login() {
        openFB.login(
                function(response) {
                    if(response.status === 'connected') {
                        //alert('Facebook login succeeded, got access token: ' + response.authResponse.token);
                        //Compiles the tabbar
                        compiletabbar();
                        getInfo();
                    } else {
                        //alert('Facebook login failed: ' + response.error);
                    }
                }, {scope: 'email,read_stream,publish_stream'});
    }

    function getInfo() {
        openFB.api({
            path: '/me',
            success: function(data) {
                console.log(JSON.stringify(data));
                //document.getElementById("userName").innerHTML = data.name;
                //document.getElementById("userPic").src = 'http://graph.facebook.com/' + data.id + '/picture?type=normal';
                parse_addnewuser(data.id,data.id,data.email,data.name,data.first_name,data.last_name,data.gender,data.timezone);
                localStorage.setItem("local_user",data.name);
                localStorage.setItem("local_id",data.id);
                localStorage.setItem("local_email",data.email);
            },
            error: errorHandler});
    }

    function share() {
        openFB.api({
            method: 'POST',
            path: '/me/feed',
            params: {
                message: document.getElementById('Message').value || 'Testing Facebook APIs'
            },
            success: function() {
                alert('the item was posted on Facebook');
            },
            error: errorHandler});
    }

    function revoke() {
        openFB.revokePermissions(
                function() {
                    alert('Permissions revoked');
                },
                errorHandler);
    }

var logoutfn = {
  animation: 'slide',
  onTransitionEnd: function() {
        openFB.logout(
                function() {
                    alert('Logout successful');
                    localStorage.removeItem("local_user");
                    localStorage.removeItem("local_id");
                    localStorage.removeItem("local_email");
                },
                errorHandler);
    }
      
  };
  
function logoutfn() {
        openFB.logout(
                function() {
                    alert('Logout successful');
                    localStorage.removeItem("local_user");
                    localStorage.removeItem("local_id");
                    localStorage.removeItem("local_email");
                },
                errorHandler);
    }

    function errorHandler(error) {
        alert(error.message);
    }
    
    
