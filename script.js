/*
Project: IPL Auction Project - JavaScript
Author: Wasim Ahmed
YouTube channel: https://www.youtube.com/@codingkalakar
*/

/* 
  Step 1 - Global variables 
*/
let timerInterval;
let currentTimer = 10; // 1 minute
let playerIndex = -1;
let unsoldPlayers = [];
let currentPage = 0;
const playersPerPage = 5;

/* 
  Step 2 - Basic players rendring  
*/

/*
  Players object with player info
*/

/*
const players = [
  {
    name: "Cameron Green",
    category: "AR",
    basePrice: 1750,
    highestBid: 0,
    highestBidderId: null
  },
  {
    name: "Virat Kohli",
    category: "BAT",
    basePrice: 1500,
    highestBid: 0,
    highestBidderId: null
  },
  {
    name: "Alzarri Joseph",
    category: "BOW",
    basePrice: 1150,
    highestBid: 0,
    highestBidderId: null
  }
];

*/

/*
  Functon to render players
*/
function renderPlayers() {
  // Calculate start and end index for players on the current page
  const startIndex = currentPage * playersPerPage;
  const endIndex = Math.min(startIndex + playersPerPage, players.length);
  const playersToShow = players.slice(startIndex, endIndex);

  const playersList = document.getElementById("playersList");
  playersList.innerHTML = ""; // Clear existing players

  playersToShow.forEach((player, index) => {
      const li = document.createElement("li");
      li.className = "player-item";
      li.id = `player${currentPage * playersPerPage + index}`; // Adjust id to reflect the current page

      const playerDetails = document.createElement("div");
      playerDetails.className = "player-details";

      const highestBidderInfo = player.highestBidderId ? `${teams[player.highestBidderId].name} at ₹${player.highestBid} lakhs` : "No bids";
      playerDetails.textContent = `${currentPage * playersPerPage + index + 1}. ${player.name} - ${player.category} - Base Price: ₹${player.basePrice} lakhs - Highest Bidder: ${highestBidderInfo}`;

      const startBidButton = document.createElement("button");
      startBidButton.className = "start-bid-button";
      startBidButton.textContent = "Start Bid";
      startBidButton.addEventListener("click", () => startBid(currentPage * playersPerPage + index));

      li.appendChild(playerDetails);
      li.appendChild(startBidButton);
      playersList.appendChild(li);
  });
}

renderPlayers(); // Function call

function updatePlayerDisplay(playerIndex) {
  const player = players[playerIndex];
  const playerItem = document.getElementById(`player${playerIndex}`);
  const playerDetails = playerItem.querySelector('.player-details');

  const highestBidderInfo = player.highestBidderId ? `${teams[player.highestBidderId].name} at ₹${player.highestBid} lakhs` : "No bids";
  playerDetails.textContent = `${playerIndex + 1}. ${player.name} - ${player.category} - Base Price: ₹${player.basePrice} lakhs - Highest Bidder: ${highestBidderInfo}`;
}

/* 
  Step 3 - Basic teams rendring  
*/

/*
  Teams object with team info
*/
const teams = {
  team1: { name: "Sunrisers Hyderabad", budget: 10000, players: [], bids: [] },
  team2: { name: "Chennai Super Kings", budget: 10000, players: [], bids: [] },
  team3: { name: "Mumbai Indians", budget: 10000, players: [], bids: [] },
  team4: { name: "Kolkata Knight Riders", budget: 10000, players: [], bids: [] },
  team5: { name: "Gujarat Titans", budget: 10000, players: [], bids: [] },
  team6: { name: "Delhi Capitals", budget: 10000, players: [], bids: [] }
};

/* 
  Function to render team widgets
*/
function renderTeamWidgets() {
  for (const teamId in teams) {
    const teamWidget = document.getElementById(teamId);
    teamWidget.querySelector("h2").textContent = teams[teamId].name;
    updateTeamBudget(teamId, teams[teamId].budget);

    const bidButton = teamWidget.querySelector(".bid-now-button");
    bidButton.addEventListener("click", () => teamBid(teamId));
  }
}

function updateTeamBudget(teamId, budget) {
  document.getElementById(`budget-${teamId}`).textContent = `₹${budget} lakhs`;
}

renderTeamWidgets(); // Function call

/* 
  Step 4 - Start Bid function (all teams allowed to bid)
*/
function startBid(i) {
  playerIndex = i; // Set the player index
  clearInterval(timerInterval); // Clear previous timer if any
  currentTimer = 45; // Reset the timer to 60 seconds
  timerInterval = setInterval(updateTimer, 1000); // Start the timer

  // Call functions to show timer and enable bidding buttons
  showTimerContainer();
  enableAllBidButtons();
}

/*
  Function to update the timer
*/
function updateTimer() {
  const timerElement = document.getElementById("timer");
  timerElement.textContent = currentTimer;
  if (currentTimer === 0) {
    clearInterval(timerInterval);
    disableAllBidButtons();
    hideTimerContainer();
    sellPlayer();
  }
  currentTimer--;
}

/* 
  Function to show the timer & sold button
*/
function showTimerContainer() {
  const timerContainer = document.querySelector(".timer-container");
  timerContainer.style.display = "block";

  const soldContainer = document.querySelectorAll(".sold-container");
  soldContainer.forEach(container => container.style.display = "block");
}

/* 
  Function to hide the timer & sold button
*/
function hideTimerContainer() {
  const timerContainer = document.querySelector(".timer-container");
  timerContainer.style.display = "none";

  const soldContainer = document.querySelectorAll(".sold-container");
  soldContainer.forEach(container => container.style.display = "none");
}

/* 
  Function to enable all Bid Now buttons
*/
function enableAllBidButtons() {
  const bidButtons = document.querySelectorAll(".bid-now-button");
  bidButtons.forEach(button => {
    button.disabled = false;
  });
}

/* 
  Function to disable all Bid Now buttons
*/
function disableAllBidButtons() {
  const bidButtons = document.querySelectorAll(".bid-now-button");
  bidButtons.forEach(button => {
    button.disabled = true;
  });
}

/* 
  Step 5 - Bidding by the TEAMS
*/

/* 
  Team bid function
*/
function teamBid(teamId) {
  const bidAmount = parseFloat(
    prompt(
      `Enter bidding amount for ${players[playerIndex].name}:`,
      players[playerIndex].basePrice
    )
  );

  if (isNaN(bidAmount) || bidAmount < players[playerIndex].basePrice) {
    alert("Invalid bid amount.");
    return;
  }

  // Check if the team has enough balance to place the bid
  if (bidAmount > teams[teamId].budget) {
    alert("Team does not have enough budget to place this bid.");
    return;
  }

  // Check if this is the highest bid
  if (bidAmount > players[playerIndex].highestBid) {
    players[playerIndex].highestBid = bidAmount;
    players[playerIndex].highestBidderId = teamId;
  
  // Update the display of the highest bidder next to the player's name
    updatePlayerDisplay(playerIndex);
  }

  // Store the bidding information in an array or within the teams object
  const biddingInfo = {
    teamId: teamId,
    playerIndex: playerIndex,
    bidAmount: bidAmount
  };

  // If the team has already bid on this player, update the bidding information
  if (!teams[teamId].bids) {
    teams[teamId].bids = [];
  }
  teams[teamId].bids[playerIndex] = biddingInfo;
}

/* 
  Step 6 - Sell Player to the team
*/

/*
  Function to sell the player to the highest bidder
*/
function sellPlayer() {
  const highestBidder = getHighestBidder();
  if (highestBidder !== null) {
    const teamId = highestBidder.teamId;
    const bidAmount = highestBidder.bidAmount;
    const player = players[playerIndex];

    // Deduct the bid amount from the team's budget
    teams[teamId].budget -= bidAmount;

    // Update the UI to show the player is sold to the team
    const playerListItem = document.getElementById(`player${playerIndex}`);
    playerListItem.classList.add("sold");
    playerListItem.querySelector(".start-bid-button").style.display = "none";
    const soldTo = document.createElement("span");
    soldTo.textContent = `SOLD to: ${teams[teamId].name} for ₹${bidAmount} lakhs`;
    playerListItem.appendChild(soldTo);

    // Add the player to the purchased list of the team
    const purchasedList = document.getElementById(`players-${teamId}`);
    const purchasedItem = document.createElement("li");
    purchasedItem.textContent = `${player.name} - ₹${bidAmount} lakhs`;
    purchasedList.appendChild(purchasedItem);

    // Update the team's budget on the UI
    updateTeamBudget(teamId, teams[teamId].budget);

    // Reset items
    hideTimerContainer();
    disableAllBidButtons();
    playerIndex = -1;
    players[playerIndex].sold = true;
  }
  else {
    players[playerIndex].sold = false; // Mark as unsold if no bids
  }
}

/*
  Function to get the highest bidder for the player
*/
function getHighestBidder() {
  let highestBidder = null;
  for (const teamId in teams) {
    if (teams[teamId].bids && teams[teamId].bids[playerIndex]) {
      const bidAmount = teams[teamId].bids[playerIndex].bidAmount;
      if (!highestBidder || bidAmount > highestBidder.bidAmount) {
        highestBidder = teams[teamId].bids[playerIndex];
      }
    }
  }
  return highestBidder;
}

function unsoldPlayer() {
  // Mark the player as unsold directly, if the Unsold button is pressed

  if (playerIndex !== -1) {
    players[playerIndex].sold = false;
    const player = players[playerIndex];
    
    // Add the player to the unsoldPlayers array
    unsoldPlayers.push(player);

    // Update UI to reflect the player is unsold
    const playerListItem = document.getElementById(`player${playerIndex}`);
    playerListItem.classList.add("unsold");
    const unsoldSpan = document.createElement("span");
    unsoldSpan.textContent = "UNSOLD";
    playerListItem.appendChild(unsoldSpan);

    // Reset the auction for the next player
    hideTimerContainer();
    disableAllBidButtons();
    playerIndex = -1;
  }
}

function nextPage() {
  if ((currentPage + 1) * playersPerPage < players.length) {
    currentPage++;
    renderPlayers();
  }
}

function previousPage() {
  if (currentPage > 0) {
    currentPage--;
    renderPlayers();
  }
}