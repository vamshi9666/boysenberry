/*

boysenInsertions.js - content script 

-Call script to add listener to every element, which then shows CSS for that element in a fixed position element
-Capture mouse movement, and display x,y coordinates

*/
var currentElement = "";

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
  console.log(request);
	if (request.action == "finishedParsing"){
    appendBox();
    $("body").bind("mousemove",function(event){
      var x = event.pageX;
      var y = event.screenY;
      var element = document.elementFromPoint(x,y);
      updateBox(element);
    });
	}
});


/*	Listen for the keyboard shortcut */

//’secret’ specifies the numerical keystrokes that make up the word “mario”
var secret = "667989836978";
var input = "";
var timer;

//The following function sets a timer that checks for user input. You can change the variation in how long the user has to input by changing the number in ‘setTimeout.’ In this case, it’s set for 500 milliseconds or ½ second.
$(document).keyup(function(e) {
   input += e.which;
   clearTimeout(timer);
   timer = setTimeout(function() { input = ""; }, 500);
   check_input();
});

//Once the time is up, this function is run to see if the user’s input is the same as the secret code
function check_input() {
    if(input == secret) {
      //the code used to reveal mario and the world is then put here   
      chrome.runtime.sendMessage({action: "boysen"}, function(response) {
        console.log(response.farewell);
      });
    }
    console.log(input);
}

function alertMsg() {
  console.log("somethign was clicked");
}

/*
Adds the box to our page
*/
function appendBox(){
  var box = '<div class="popupWrap"><div class="popupTitle"><div class="popupTitleInner">boysenberry</div><div id="search_icon" class="popupTitleDisplayModeToggle">toggle view</div></div><div class="popupClassDisplay"><div id="boxClassName" class="popupClassDisplayOuter">.class {</div><div id="boxClassBody" class="popupClassDisplayBody">width:400px;<br>height:500px;<br>background-color: rgba(241,241,241,0.8);<br>right:20px;<br>top:20px;<br>display: none;<br>overflow-x:hidden; <br></div><div class="popupClassDisplayOuter">}</div></div></div>';
  $("body").prepend(box);
}

/*
Updates the box according to which element we are hovering over
*/
function updateBox(element){
  if(element){
    var elementID;
    if(!element.id){
      element.id = "boysen"+Math.floor((Math.random() * 10000) + 1);
    }
    elementID = element.id;
    var accessID = "#"+elementID;
    if($(accessID) != null){
      var className = $(accessID).attr('class');
      var classCSS = $(accessID).getStyleObject();
      var css = grabStyle(classCSS);
      if(!className){
        className = "anonymous_class";
      }
      var classString = "."+className+" {";
      if(className != currentElement){
        $("#boxClassName").html(classString);
        currentElement = className;
      }
      $("#boxClassBody").html(css);
    }
  }
}

function grabStyle(styleObject){
  var string = "";
  for (var key in styleObject) {
    var val = styleObject[key];
    string += key + ":" + val + "<br>";
  }
  return string;
}

/*
 * getStyleObject Plugin for jQuery JavaScript Library
 * From: http://upshots.org/?p=112
 *
 * Copyright: Unknown, see source link
 * Plugin version by Dakota Schneider (http://hackthetruth.org)
 */

(function($){
    $.fn.getStyleObject = function(){
        var dom = this.get(0);
        var style;
        var returns = {};
        if(window.getComputedStyle){
            var camelize = function(a,b){
                return b.toUpperCase();
            }
            style = window.getComputedStyle(dom, null);
            for(var i=0;i<style.length;i++){
                var prop = style[i];
                var camel = prop.replace(/\-([a-z])/g, camelize);
                var val = style.getPropertyValue(prop);
                returns[camel] = val;
            }
            return returns;
        }
        if(dom.currentStyle){
            style = dom.currentStyle;
            for(var prop in style){
                returns[prop] = style[prop];
            }
            return returns;
        }
        return this.css();
    }
})(jQuery);


