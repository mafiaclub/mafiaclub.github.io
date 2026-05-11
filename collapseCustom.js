//Credit to https://www.w3schools.com/howto/howto_js_collapsible.asp
//reformatted for custom roles tab

var coll = document.getElementsByClassName("collapseCustom");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "none") {
      content.style.display = "block";
      console.log("Collapse Calendar")
    }
    else if (content.style.display === "block"){
      content.style.display = "none";
      console.log("Expand Calendar")
    }
    else{
      content.style.display = "block";
      console.log("Collapse Calendar")
    }
  });
};

window.onload=function(){
  document.getElementById("customPicker").click();
  console.log("I tried")
};
