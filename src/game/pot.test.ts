import { Player } from "./player"
import { Pot } from "./pot"

function set_player_cards(player: Player){
  player.new_card({suit: 'C', rank: 2});
  player.new_card({suit: 'C', rank: 3});
  player.new_card({suit: 'H', rank: 13});
  player.new_card({suit: 'H', rank: 8});
  player.new_card({suit: 'C', rank: 8});
  player.new_card({suit: 'C', rank: 4});
  player.new_card({suit: 'H', rank: 9});
}


describe("The pot", function(){
  let testPot = new Pot();
  let testPlayers: Player[] = [];
  beforeEach(() => {
    testPot = new Pot();
    testPlayers = [];
    testPlayers.push(new Player("bunnyt", "123"));
    testPlayers.push(new Player("rabbit", "134"));
    testPlayers.push(new Player("horsea", "234"));
    testPlayers.push(new Player("carrot", "164"));
    testPlayers.push(new Player("froggy", "174"));
    testPlayers.push(new Player("deerit", "834"));

    testPlayers.forEach((player) => {
      set_player_cards(player);
      player.stack = 0;
      player.totalInvestment = 0;
    });
  });

  it("Gives the winnings to a single player when everyone else folds", async() =>{
    testPlayers[0].totalInvestment = 40;
    testPlayers[1].totalInvestment = 15;
    testPlayers[2].totalInvestment = 20;
    testPlayers[3].totalInvestment = 30;
    testPlayers[4].totalInvestment = 15;
    testPlayers[5].totalInvestment = 10;
    const allChips = testPlayers.reduce((prev, curr) => {return prev + curr.totalInvestment}, 0);

    testPlayers[0].folded = false;

    testPot.payout_all_pots(testPlayers);
    expect(testPlayers[0].stack).toBe(allChips);
  });

  it("Gives the strongest hand at showdown - uneven betsizes", async() =>{
    testPlayers[0].totalInvestment = 40;
    testPlayers[1].totalInvestment = 15;
    testPlayers[2].totalInvestment = 20;
    testPlayers[3].totalInvestment = 30;
    testPlayers[4].totalInvestment = 15;
    testPlayers[5].totalInvestment = 10;

    testPlayers[0].folded = false;
    testPlayers[3].folded = false;

    testPlayers[3].handRanker.reset();
    testPlayers[3].new_card({suit: 'D', rank: 8});
    testPlayers[3].new_card({suit: 'C', rank: 3});
    testPlayers[3].new_card({suit: 'H', rank: 13});
    testPlayers[3].new_card({suit: 'H', rank: 8});
    testPlayers[3].new_card({suit: 'C', rank: 8});
    testPlayers[3].new_card({suit: 'C', rank: 4});
    testPlayers[3].new_card({suit: 'H', rank: 9});

    testPot.payout_all_pots(testPlayers);
    expect(testPlayers[3].stack).toBe(120);
    expect(testPlayers[0].stack).toBe(10);
  });

  it("Splits the pot amongst players who have tied", async() =>{
    testPlayers[0].totalInvestment = 40;
    testPlayers[1].totalInvestment = 15;
    testPlayers[2].totalInvestment = 20;
    testPlayers[3].totalInvestment = 30;
    testPlayers[4].totalInvestment = 15;
    testPlayers[5].totalInvestment = 10;

    testPlayers[0].folded = false;
    testPlayers[3].folded = false;
    testPlayers[4].folded = false;

    testPot.payout_all_pots(testPlayers);
    testPlayers.forEach(player => {
      console.log(player.stack);
    });
  });
});
