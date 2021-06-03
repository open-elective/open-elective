# open-elective
var completes = document.querySelectorAll(".complete");
completes[0].classList.toggle('complete');
completes[1].classList.toggle('complete');
completes[2].classList.toggle('complete');
completes[3].classList.toggle('complete');
var toggleButton = document.getElementById("toggleButton");


function toggleComplete(){
  //var lastComplete = completes[completes.length - 2];
  completes[3].classList.toggle('complete');
}

toggleButton.onclick = toggleComplete;