//Credit to https://www.w3schools.com/howto/howto_js_collapsible.asp

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "none") {
      content.style.display = "block";
      coll[i].value = "Expand Calendar";
      console.log("Collapse Calendar")
    }
    else if (content.style.display === "block"){
      content.style.display = "none";
      coll[i].value = "Collapse Calendar";
      console.log("Expand Calendar")
    }
    else{
      content.style.display = "block";
      coll[i].value = "Expand Calendar";
      console.log("Collapse Calendar")
    }
  });
}
