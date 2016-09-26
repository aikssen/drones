const app = angular.module('drones', []);

app.controller('GameController', function($timeout, $window) {
	const self = this;
	this.players = []; //players info
	this.player = 1; //player turn per round
	this.round = 1; //actual round
	this.winner = null;
	this.selectedMove = null; //selected movement
	this.movements = [];  //movements historic list
	this.roundResults = [];

	this.moves = [ //movements detail and win conditions
		{ name: 'rock', kills: 'scissors'},
		{ name: 'paper', kills: 'rock'},
		{ name: 'scissors', kills: 'paper'}
	];

	//comparison algorithm
	function defineWinner(choice1, choice2) {
		const choices = _.map(self.moves, 'name');

    choice1 = choices.indexOf(choice1);
    choice2 = choices.indexOf(choice2);
    if (choice1 == choice2) {
      return 2; // Tie
    }
    if (choice1 == choices.length - 1 && choice2 == 0) {
      return 1;  //Right wins - player 2
    }
    if (choice2 == choices.length - 1 && choice1 == 0) {
      return 0;  //Left wins - player 1
    }
    if (choice1 > choice2) {
      return 0; //Left wins - player 1
    } else {
      return 1; //Right wins - player 2
    }
	}

	const roundWinner = function(round){
		//find the movements for the round
		let movementsPerRound = _.filter(self.movements, { round });
		//compare movements and  define winner
		const winner = defineWinner(movementsPerRound[0].move, movementsPerRound[1].move);
		self.roundResults.push({ 
			round, 
			winner,
			label: (winner === 2) ? 'Tie' : `Player ${movementsPerRound[winner].player}` 
		});
	};

	const gameWinner = function(){
		const p1Victories = _.filter(self.roundResults, { winner: 0 }).length;
		const p2Victories = _.filter(self.roundResults, { winner: 1 }).length;
		if(p1Victories > p2Victories) {
			return 1;
		}else if(p1Victories < p2Victories) {
			return 2;
		}else if(p1Victories == p2Victories){
			return 0; // tie
		}
	};


	this.move = function(round, player, move, target){
		console.log(round, player, move);
		//set the image as selected
		this.selectedMove = move;
		//save player movement
		this.movements.push({ round, player, move });

		if(player === 1) { //change to p2
			this.player = 2; 
		} else { //go to the next round
			this.player = 1; 
			this.round++;
			
			//define round winner
			roundWinner(round); 
		}

		

		//define game winner
		// if(this.round === 3 && this.player === 2) {
		if(this.round > 3) {
			this.winner = gameWinner();
		}
		//reset move
		$timeout(function(){
			self.selectedMove = null;
		},500);

	};

	//allow to set a 'move' as selected
	this.isSelected = function(sel){
		return this.selectedMove === sel;
	};

	this.reload = function(){
		$window.location.reload();
	};

});
