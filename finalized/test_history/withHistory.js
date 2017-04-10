/**
 * Created by vigon on 07/02/2017.
 */

// We use a global variable to hold the current page number
var currentPage = 1;



function createView(stateObject, pushHistory) {
    document.getElementById('contentBox').innerHTML = '<h1>'+stateObject.title+'</h1>'+boxcontent[stateObject.contentId];
    currentPage = stateObject.contentId;

    // Save state on history stack
    // - First argument is any object that will let you restore state
    // - Second argument is a title (not the page title, and not currently used)
    // - Third argument is the URL - this will appear in the browser address bar
    if (pushHistory) history.pushState(stateObject, stateObject.title, '?page='+stateObject.contentId);
}


window.onpopstate = function(event) {
    // We use false as the second argument below
    // - state will already be on the stack when going Back/Forwards
    createView(event.state, false);
};




var boxcontent = new Array();
boxcontent[1] = 'Content for Page 1 is content.';
boxcontent[2] = 'This exciting stuff is content for Page 2.';
boxcontent[3] = 'Page 3 is probably the best page, in content terms.';
boxcontent[4] = 'Wow, you\'re still reading this crap?';


// We also have to push the initial state onto the history stack
history.pushState( { contentId: 1, title: 'Welcome to Page 1' }, 'Welcome to Page 1', '?page=1');


function onClickOnDiv(){
    createView( { contentId: (currentPage<boxcontent.length-1? currentPage+1 : 1),
        title: 'Welcome to Page '+(currentPage<boxcontent.length-1? currentPage+1 : 1) }, true );
    return false;
}

setTimeout(function(){
    var $toto=document.getElementById("toto")
    $toto.onclick=onClickOnDiv
    $toto.style.backgroundColor="red"
},100)



