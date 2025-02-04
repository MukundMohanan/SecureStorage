var tabtextmaxlen = 20;
var seperator = "acdcc9e377db73f8b3ae141353015db7c8141a659c465cb3f42ed93e3727e8d5ff4743c887a6816821789df7914749a1ff722455b26057b6058011f3ba8886b5";
var availableTabs = [1];
function newTab2(switchtab)
{
    
    var newtextarea= document.createElement("textarea");
    var tabnum;

    if(!switchtab)
        tabnum = tabNumber2(init_tab_load=true);
    else
        tabnum = tabNumber2(init_tab_load=false);
    
    if(tabnum!=1)
        {
                newtextarea.setAttribute("id","tab-"+tabnum);
                newtextarea.setAttribute("class","border rounded actual-textarea tab-pane");
                newtextarea.setAttribute("spellcheck","false");
                newtextarea.setAttribute("wrap","soft");
                newtextarea.setAttribute("maxlength","100000");
                newtextarea.setAttribute("placeholder","Write your text here...tab"+tabnum);
                document.getElementsByClassName("tab-content")[0].appendChild(newtextarea);


                var newtab = document.createElement("button");
                newtab.setAttribute("class","tablinks");
                newtab.setAttribute("id","tab-btn-"+tabnum);
                newtab.setAttribute("onclick","switchTab(this.id)");
                newtab.innerHTML = "Tab"+tabnum;
                document.getElementsByClassName("tab")[0].appendChild(newtab);
                // console.log("New tab created succesfully.");

                availableTabs.push(tabnum);
                availableTabs = [...new Set(availableTabs)];
            
        }
    
    if(switchtab)
        {
            switchTab("tab-btn-"+tabnum);
        }

    
    
    
}

function switchTab(tabid)
{
    var active_tab = document.getElementsByClassName("border rounded actual-textarea tab-pane active")[0].id;
    active_tab = parseInt(active_tab.substr(active_tab.lastIndexOf("-")+1));
    // console.log("Current active tab : "+active_tab);
    tabid = tabid.substr(tabid.lastIndexOf("-")+1);
    // console.log("Switching to tab "+tabid);

    //deactive current active tab
    var curr_active_tab = document.getElementById("tab-btn-"+active_tab);
    var curr_active_textarea = document.getElementById("tab-"+active_tab);
    curr_active_tab.className = curr_active_tab.className.replace(" active","");
    curr_active_textarea.className = curr_active_textarea.className.replace(" active","");

    //activate the required tab
    var tab = document.getElementById("tab-btn-"+tabid);
    var textarea = document.getElementById("tab-"+tabid);
    if(!tab.className.includes(" active"))
        document.getElementById("tab-btn-"+tabid).className+=" active";
    if(!textarea.className.includes(" active"))
        document.getElementById("tab-"+tabid).className+=" active";

    
}


function tabNumber2(init_tab_load)
{
    // console.log("tab number tabs : "+availableTabs);
    if(init_tab_load)
    {
        var tabcount = document.getElementsByClassName("tab")[0].getElementsByTagName("button").length;
        return tabcount+1;
    }
    else
    {
        availableTabs.sort();
        // console.log("returning new tab to create : "+parseInt(availableTabs[availableTabs.length-1]) + 1);
        return parseInt(availableTabs[availableTabs.length-1]) + 1;
    }
    
}


$(document).on('change keyup paste', "textarea", function () {
    // console.log("text change trigg");
    setUnsavedChanges(true);
    updateText(this.id);
    
});


function updateText(tabid)
{
    tabid = tabid.substr(tabid.lastIndexOf("-")+1);
    var text = $("#tab-"+tabid).val();
    var tab = document.getElementById("tab-btn-"+tabid);
    if(text!="")
        {
            
            if(text.length<=tabtextmaxlen)
                {
                    tab.innerHTML = text+"..";
                }
                
            
            else
                {
                    tab.innerHTML = text.substr(0,tabtextmaxlen)+"..";
                }
                
        }

    else{
        tab.innerHTML = "Tab"+tabid;
    }
}


function populateTabs(text,seperator)
{
    var tabs = text.trim().split(seperator);
    
    var i=1

    tabs = tabs.filter(item => item.trim() !== '')
    //console.log("Tabs array : "+tabs);
    // console.log("length of tabs : "+tabs.length);
    
    for(i=0;i<tabs.length;i++)
        {
            
            newTab2(false);
            
            document.getElementsByClassName("border rounded actual-textarea tab-pane")[i].value = tabs[i].trim();

            updateText("tab-"+(i+1));
            
        }



}


function closeTab()
{

    if(!confirm("Are you sure you want to delete the tab? All the text in the tab will be deleted."))
        return
    

    var tabid = document.getElementsByClassName("border rounded actual-textarea tab-pane active")[0].id;
    tabid = parseInt(tabid.substr(tabid.lastIndexOf("-")+1));

    

    if(tabid!=1)
    {
        document.getElementById("tab-"+tabid).remove();
        document.getElementById("tab-btn-"+tabid).remove();
        // console.log("Deleted tab with id "+tabid);

        // console.log("Tab id index : "+availableTabs.indexOf(tabid));
        var prev_tab = availableTabs[availableTabs.indexOf(tabid)-1];
        // console.log("Making tab with id "+prev_tab+" active");
        var tab = document.getElementById("tab-btn-"+prev_tab);
        var textarea = document.getElementById("tab-"+prev_tab);
        tab.className+=" active"; //tab
        textarea.className+=" active"; //textarea

        // console.log("Removing tab "+tabid);
        availableTabs.splice(availableTabs.indexOf(parseInt(tabid)),1);

        // console.log("Removed tab : "+availableTabs);

        // console.log("Tab closed");
    }

    else
    {
        $.toast({
            heading: 'Error',
            text: "Can't close the first tab",
            showHideTransition: 'fade',
            icon: 'error'
        });
    }
    
}



function collectText()
{
    var textareas = document.getElementsByClassName("actual-textarea");

    var allText = "";

    for(var i=1;i<=textareas.length;i++)
    {
        if(textareas[i-1].value!="")
            allText = allText + seperator + textareas[i-1].value;
    }
    // console.log("collected text : "+allText);
    return allText
}


function resetTabs()
{
    availableTabs=[1];
}


