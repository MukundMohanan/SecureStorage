var password=""
var site_url = window.location.pathname;
var initHash = "";
var newHash = "";
site_url = site_url.substr(1,site_url.length-2)
var seperator = "acdcc9e377db73f8b3ae141353015db7c8141a659c465cb3f42ed93e3727e8d5ff4743c887a6816821789df7914749a1ff722455b26057b6058011f3ba8886b5";
var unsaved = false;
var salt = "8141a659c465cb3f42ed93e3727e8d5ff4743c887a6816821789df"; 
var initialText = "";

window.onbeforeunload = function(){
  if(unsaved==true)
  {
    return 'Changes you made might not be saved';
  }
};

$(document).on('click', '#create-btn', function() {
    // console.log("create btn trigg");

	password = document.getElementById("password-field").value;
	var confirm_password = document.getElementById("confirmpassword-field").value;

	if((password!=confirm_password) || (password==""))
	{
		alert("Passwords must match");
	}
	else
	{

		initLoadLayout();
	}
	
});


$(document).on('click', '.save-btn', function() {
    $.LoadingOverlay("show");
    saveSite();
    unsaved = false;
    $.LoadingOverlay("hide");
});

$(document).on('click', '.reload-btn', function() {
  //loadLayout(reloadSite);
  $.LoadingOverlay("show");
  downloadSite(reloadSite); 
  $.LoadingOverlay("hide");
});

$(document).on('click', '.decrypt-btn', function() {
  $.LoadingOverlay("show");
  password = document.getElementById("password-field").value;
  downloadSite(loadSite);
  $.LoadingOverlay("hide");

});

$(document).on('click', '.change-password-btn', function() {
  //re encrypt the text with the new password, and then send to serve
  // console.log("change password");
  $("#change-password").modal('show');
});


$(document).on('click', '.delete-btn', function() {
    var sitename = prompt("Are you sure you want to delete this site? If you confirm, please type in the site name(without slashes) and click OK");
    if(sitename==site_url)
    {
        deleteSite();
    }
    else
        alert("Site name doesn't match.");
  
});

//change-password-confirm-btn -> button inside the modal
$(document).on('click', '#change-password-confirm-btn', function() {
  //re encrypt the text with the new password, and then send to server
  var password_tmp = document.getElementById("new-password").value;
  var confirm_password = document.getElementById("new-password-confirm").value;
  if(password_tmp!=confirm_password || password_tmp=="")
  {
    alert("Passwords do not match");
  }
  else
  {
    password = password_tmp;
    saveSite(supressWarning=true);
  }
  $("#change-password").modal('hide');
});


function initLoadLayout()
{
    $.ajax(
            {
                type:"GET",
                url: "/load_layout/",
                data:{                
                         
                },
                success: function( respData ) 
                {
                    document.getElementsByTagName("html")[0].innerHTML = respData;

                    // console.log("layout loaded");

                },
                error: function (jqXHR, status, err) {
                    alert("Local error callback.");
                    return "error";
                  }
             });
}

function loadLayout(text)
{
	$.ajax(
            {
                type:"GET",
                url: "/load_layout/",
                data:{                
                         
                },
                success: function( respData ) 
                {
                    document.getElementsByTagName("html")[0].innerHTML = respData;

                    // console.log("layout loaded");

                    populateTabs(text,seperator);

                },
                error: function (jqXHR, status, err) {
                    alert("Communication with server failed.");
                    return "error";
                  }
             });
}


function saveSite(supressWarning=false)
{

    if(initialText == collectText() && !supressWarning)
    {
        alert("No changes made to the text");
        return;
    }
    

	//Collect text from all the tabs
	var allText = collectText();
    // console.log("collected text : "+allText);

    //encrypt the text
    var eContent = CryptoJS.AES.encrypt(allText,password).toString();

    if(allText=="")
    {
        var conf = confirm("No text is stored on this site, this will automatically delete your site from our server. Do you want to continue?");
        if(!conf)
        {
            return;
        }
        else
        {
            eContent = "";
        }
    }

    
    if(initHash=="")
    {
        initHash = CryptoJS.SHA512(salt+password).toString();
        newHash = initHash;
        // console.log("Computed new hash");
    }

    else
    {
        newHash = CryptoJS.SHA512(salt+password).toString();

    }    
	
	$.ajax(
            {
                type:"POST",
                url: "/save_site/",
                data:{
                	site_url: site_url,
                	cipher : eContent,
                	initHash : initHash,
                    newHash : newHash,
                },
                success: function( respData ) 
                {
                	respData = JSON.stringify(respData)
                	respData = JSON.parse(respData)
                    // console.log(respData);
                	if(respData.status=='success')
                	{
                		$.toast({
						    heading: 'Success',
						    text: 'Saved succesfully!',
						    showHideTransition: 'slide',
						    icon: 'success'
						});


                        initHash = newHash;
                	}
                    else if(respData.status=='deleted')
                    {
                        $.toast({
                            heading: 'Success',
                            text: 'Site deleted!',
                            showHideTransition: 'slide',
                            icon: 'success'
                        });
                        setTimeout(function(){ window.location.href = "/"; }, 2000);

                    }
                	else
                	{
                		$.toast({
						    heading: 'Error',
						    text: 'Save failed!',
						    showHideTransition: 'fade',
						    icon: 'error'
						});
                	}
                    

                },
                error: function (jqXHR, status, err) {
                    $.toast({
                            heading: 'Error',
                            text: 'Save failed!',
                            showHideTransition: 'fade',
                            icon: 'error'
                        })

                    
                    
                  }
             });

}

function reloadSite(cipher)
{
	
    var text = decryptContent(cipher,password);
    // console.log("decrypted : "+text);
    if(text=="")
    {
        $.toast({
                heading: 'Error',
                text: "Couldn't reload",
                showHideTransition: 'slide',
                icon: 'error'
            });
        location.reload();
    }
    else
    {
        $.toast({
                heading: 'Success',
                text: 'Reloaded successfully!',
                showHideTransition: 'slide',
                icon: 'success'
            });
        loadLayout(text);
        
    }
}


async function loadSite(cipher)
{

    
    var text = decryptContent(cipher,password);
    
    if(text=="")
        {
            $("#error").modal('show');
        }
    else
    {
        // console.log("Decrypted : "+text);
        loadLayout(text);
    }

    
}


async function downloadSite(callback)
{

    $.ajax(
            {
                type:"POST",
                url: "/load_site/",
                data:{
                    site_url : site_url,
       
                },
                success: function( respData ) 
                {
                    respData = JSON.stringify(respData);
                    respData = JSON.parse(respData);
                    // console.log("cipher response : "+respData.cipher);
                    // console.log("password : "+password);
                    //return respData.cipher;
                    callback(respData.cipher)
                },
                error: function (jqXHR, status, err) {
                    //alert("Couldn't download ecrypted site from the server");
                    //return "";
                    callback("error");
                  }
             });

}


function decryptContent(cipher,password)
{
    // console.log("decrypting "+cipher+" with "+password);
	try
	{
		var text = CryptoJS.AES.decrypt(cipher,password).toString(CryptoJS.enc.Utf8).trim();
        initialText = text;
        // initHash = CryptoJS.SHA512(text + CryptoJS.SHA512(password).toString()).toString();
        initHash = CryptoJS.SHA512(salt+password).toString();
        // console.log("decryptedContent: "+text);
		return text
	}
	catch(err)
	{
        // console.log(err.toString());
		return ""
	}

	
}

function deleteSite()
{
    $.ajax(
            {
                type:"POST",
                url: "/delete_site/",
                data:{  
                    site_url : site_url,
                    initHash : initHash
                },
                success: function( respData ) 
                {
                    respData = JSON.stringify(respData);
                    respData = JSON.parse(respData);
                    if(respData.status=='success')
                    {
                        $.toast({
                        heading: 'Success',
                        text: "Site deleted!",
                        showHideTransition: 'slide',
                        icon: 'success'
                    });

                    setTimeout(function(){ window.location.href = "/"; }, 2000);

                    
                    }
                    else
                    {
                        $.toast({
                        heading: 'Error',
                        text: "Couldn't delete the site",
                        showHideTransition: 'slide',
                        icon: 'error'
                    });
                    }
                },
                error: function (jqXHR, status, err) {
                    $.toast({
                        heading: 'Error',
                        text: "Couldn't delete the site",
                        showHideTransition: 'slide',
                        icon: 'error'
                    });
                  }
             });
}


function setUnsavedChanges(status)
{
    unsaved = status;
}
