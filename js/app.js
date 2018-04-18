let matchingPairs = []; //Stores matching pairs

let selection = []; //Stores current selected cards (max 2)

let moves = 0;

let attempts = 0; // holds attemps made to select cards

let crd; // list of cards

let crd1, crd2; // card 1 and 2 selections

let timer;

const movesMade = document.querySelector(".moves"); 

// Ratings

let showMoves = Number(movesMade.innerHTML);

const getStars = document.querySelectorAll(".modal-content .stars");

// Timer

const getTime = document.querySelector(".time");
let startTime, endTime;

const replayButton = document.getElementById("replay");

let cardDeck; 

const restart = document.querySelector(".restart");

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex;
    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

document.body.onload = startGame();

function startGame(){
    var array1 = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'bicycle', 'bomb', 'leaf']; 
    
    var cardTypes = (array1.concat(array1));  // duplicate original array to create 16 total
   
    cardTypes = shuffle(cardTypes);

     cardDeck = document.querySelector('.deck');
            
        for(var j = 0; j < cardTypes.length; j++){
                
            var htmlTextToAdd = '<li class="card"><i class="fa fa-'+cardTypes[j]+'"></i></li>';
                
            cardDeck.insertAdjacentHTML('afterbegin', htmlTextToAdd);      
        } 
    crd = document.querySelectorAll('.card');
    startTimer();
    enableCards();
}

function flipCard(e){
	timer.start();
	selection.push(this);
	e.target.classList.add('show');
    e.target.classList.add('open');
    e.target.removeEventListener("click", flipCard);
    updateMoves();
    
    if (moves === 2){
        crd2 = selection[1].firstChild.className;
    	} else {
		crd1 = selection[0].firstChild.className; 
	}
}

function matchPair(){
    
    if ((moves === 2) && (crd1 === crd2)){      

       matchingPairs.push(this);

            setTimeout(function(){ 
                selection[0].classList.remove("show","open");
                selection[1].classList.remove("show","open");
                selection[0].classList.add("match");
                selection[1].classList.add("match");

                selection[0].removeEventListener("click", flipCard);
                selection[1].removeEventListener("click", flipCard);
				showComplete(); 
				selection = [];
                moves = 0;
             }, 500 ); 
    } 
}


function nonmatchPair(){

    if ((moves === 2) && (crd1 !== crd2)){  
        
        disableCards();
        
        setTimeout(function(){ 

            selection[0].classList.remove("show","open");
            selection[1].classList.remove("show","open");
            moves = 0;
            selection = [];
            enableCards();
     	}, 500); 
    } 	
} 

 
function updateMoves(){
    moves++;
    attempts++;
    updateMovesDisplay();
}

function updateMovesDisplay(){
    movesMade.innerHTML = attempts;
}


function showComplete(){
     
   if(matchingPairs.length === 8){ 
       modal.style.display = "block";
	   endTimer();
	   starRatings();
   }   
}

function startTimer() {
 // startTime = new Date();
 timer =  new Timer();   
  
	timer.addEventListener('secondsUpdated', function (e) {
		$('.timeTaken').html(timer.getTimeValues().toString());
	})
};
;

function endTimer(){
   timer.stop(); 
     $('.time').html(timer.getTimeValues().toString());
}


function starRatings(){ 
    
    if (( attempts >= 16 ) && ( attempts <= 32)){  // 3 stars
           
        } else if (( attempts >= 33 ) && ( attempts <= 64)){
            
            getStars[0].lastElementChild.classList.add("disable"); //2 stars
            
        } else { // show 1 star
            
            getStars[0].lastElementChild.previousElementSibling.classList.add("disable");
            getStars[0].lastElementChild.classList.add("disable");
    }
}


replay.onclick = function() {
    restartGame();
}

function restartGame(){
	moves = 0;
    modal.style.display = "none";
    matchingPairs = [];
    selection = [];
    attempts = 0;
    updateMovesDisplay();
    cardTypes =[]; 
    
    for (var i=crd.length;i--;){ // Remove previous card display
        crd[i].parentNode.removeChild(crd[i]);
    }
    
    [].forEach.call(crd, function(e) { //Remove "match" class from all cards
        e.classList.remove("match");
});
     endTimer();//end 
    enableCards();
	timer.reset();
	startGame();
}

function enableCards(){
    
    for(var r = 0; r < crd.length; r++){ 
            crd[r].addEventListener("click", flipCard);
            crd[r].addEventListener("click", matchPair);
	        crd[r].addEventListener("click", nonmatchPair);
            crd[r].addEventListener("click", showComplete);
        }  
}


function disableCards(){
    
    for(var t = 0; t < crd.length; t++){
        crd[t].removeEventListener("click", flipCard);
        crd[t].removeEventListener("click", matchPair);
	    crd[t].removeEventListener("click", nonmatchPair);
    }
}

restart.addEventListener("click", restartGame);
