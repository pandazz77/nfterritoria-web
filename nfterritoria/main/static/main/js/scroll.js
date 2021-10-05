// Detect request animation frame
var showRight = "animation: showRight 1.7s;"
var showLeft = "animation: showLeft 1.5s;"

var scroll = window.requestAnimationFrame ||
             // IE Fallback
             function(callback){ window.setTimeout(callback, 1000/60)};
var elementsToShow = document.querySelectorAll('.show-on-scroll div');
if(elementsToShow.length==0) {
  elementsToShow = document.querySelectorAll(".show-on-scroll-visible div")
  showRight = "animation: show 1.5s;"
  showLeft = "animation: show 1.5s;"
}
function loop() {

    Array.prototype.forEach.call(elementsToShow, function(element){
      if (isElementInViewport(element)) {
          if(element.classList.contains("right")) element.setAttribute("style",showRight);
          else if(element.classList.contains("left")) element.setAttribute("style",showLeft);
          if(element.classList.contains("last")) throw BreakException;
      }
    });

    scroll(loop);
}

// Call the loop for the first time
loop();

function isElementInViewport(el) {
  // special bonus for those using jQuery
  if (typeof jQuery === "function" && el instanceof jQuery) {
    el = el[0];
  }
  var rect = el.getBoundingClientRect();
  return (
    (rect.top <= 0
      && rect.bottom >= 0)
    ||
    (rect.bottom >= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.top <= (window.innerHeight || document.documentElement.clientHeight))
    ||
    (rect.top >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight))
  );
}