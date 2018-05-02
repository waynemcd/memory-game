let matchingPairs = []; //Stores matching pairs

let selection = []; //Stores current selected cards (max 2)

let moves = 0;

let attempts = 0; // holds the attemps made to select cards

let crd; // list of cards

let crd1, crd2; // card 1 and 2 selections

let timer;

const panelStars = document.getElementsByClassName("stars panel"); // Get all the stars on the main UI

const getStars = document.querySelectorAll(".stars"); // Get all the stars on the results screen

const movesMade = document.querySelector(".moves"); //Moves on main UI
const movesUsed = document.querySelector(".moves-used"); // Moves on the results screen

let revealTwo = 0; // Tracks the number of pairs flipped

// Timer
const getTime = document.querySelector(".time");
let startTime, endTime;

const replayButton = document.getElementById("replay"); //Get the replay button on the main UI

let cardDeck; 

const restart = document.querySelector(".restart"); // Get the restart button the results slide

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
	// store all card types available
    var array1 = ['diamond', 'paper-plane-o', 'anchor', 'bolt', 'cube', 'bicycle', 'bomb', 'leaf']; 
    
    var cardTypes = (array1.concat(array1));  // duplicate original array to create 16 cards total
   
    cardTypes = shuffle(cardTypes);

     cardDeck = document.querySelector('.deck'); 
	
	//Create card layout   
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
	selection.push(this); // Add flipped card to selection array
	
	//flip card and disable
	e.target.classList.add('show');
    e.target.classList.add('open');
    e.target.removeEventListener("click", flipCard);
    updateMoves();
	starRatings();
    
	// If this is the second flip, assign this flip to second spot in the array
    if (moves === 2){
        crd2 = selection[1].firstChild.className;
    	} else {
		crd1 = selection[0].firstChild.className; 
	}
}

// Handle matching pairs
function matchPair(){
    
    if ((moves === 2) && (crd1 === crd2)){      

       matchingPairs.push(this);   //If pair matches push pair to own array 

            setTimeout(function(){ 
                selection[0].classList.remove("show","open");
                selection[1].classList.remove("show","open");
                selection[0].classList.add("match");
                selection[1].classList.add("match");

                selection[0].removeEventListener("click", flipCard);
                selection[1].removeEventListener("click", flipCard);
				showComplete(); // Check if all cards flipped
				selection = []; // Clear selection array
                moves = 0; //reset moves
             }, 500 ); 
    } 
}

function nonmatchPair(){
// If cards don't match, turn them back over and clear the selection array
    if ((moves === 2) && (crd1 !== crd2)){  
        
        disableCards();
        
        setTimeout(function(){ 

            selection[0].classList.remove("show","open");
            selection[1].classList.remove("show","open");
            moves = 0;
            selection = []; // Reset selection array
            enableCards();  
     	}, 500); 
    } 	
} 


function updateMoves(){
    moves++;  // Tracks the amount of cards flipped
    attempts++; 
    updateMovesDisplay();
	
	//Update moves display after pair of cards selected
	if(attempts % 2 == false){
		revealTwo++;
		movesMade.innerHTML = revealTwo;
	}
}

function updateMovesDisplay(){
   
	
}

// All cards matched, show the results screen
function showComplete(){  
   if(matchingPairs.length === 8){ 
       modal.style.display = "block";
	   timer.stop();  
	   starRatings();
	   movesUsed.innerHTML = revealTwo;  //Update moves display on results pop up window
   }   
}

// Timer
function startTimer() {
 timer =  new Timer();   
	timer.addEventListener('secondsUpdated', function(e) {
		$('.timeTaken').html(timer.getTimeValues().toString());
	})
};


function endTimer(){
   timer.stop(); 
     $('.timeTaken').html(timer.getTimeValues().toString());
}


function starRatings(){ 
    
    if (( attempts >= 0 ) && ( attempts <= 32)){  // 3 stars
           
        } else if (( attempts >= 33 ) && ( attempts <= 64)){
            
            getStars[0].lastElementChild.classList.add("disable"); //2 stars
			panelStars[0].lastElementChild.classList.add("disable"); //2 stars
            
        } else { // show 1 star
            
            getStars[0].lastElementChild.previousElementSibling.classList.add("disable");
			panelStars[0].lastElementChild.previousElementSibling.classList.add("disable");
			
            getStars[0].lastElementChild.classList.add("disable");
			panelStars[0].lastElementChild.classList.add("disable");
    }
}

// Reset stars display
function clearStars() {
	 getStars[0].lastElementChild.classList.remove("disable"); 
	 panelStars[0].lastElementChild.classList.remove("disable"); 
	 getStars[0].lastElementChild.previousElementSibling.classList.remove("disable");
	 panelStars[0].lastElementChild.previousElementSibling.classList.remove("disable");         getStars[0].lastElementChild.classList.remove("disable");
	 panelStars[0].lastElementChild.classList.remove("disable");
}


replay.onclick = function() {
    restartGame();
}

function restartGame(){
	moves = 0;   // Reset moves display
    modal.style.display = "none";  // Hide results screen
    matchingPairs = [];  //Reset matching pairs array
    selection = [];   // Reset selected cards array
    attempts = 0;  
    updateMovesDisplay();
    cardTypes =[]; 
    
    for (var i=crd.length;i--;){ // Remove previous card display
        crd[i].parentNode.removeChild(crd[i]);
    }
    
    [].forEach.call(crd, function(e) { //Remove "match" class from all cards
        e.classList.remove("match");
	});
	
	clearStars(); //Reset stars
    endTimer(); 
    enableCards();
	startGame();
	revealTwo=0; //reset move display
	movesMade.innerHTML="0";
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
