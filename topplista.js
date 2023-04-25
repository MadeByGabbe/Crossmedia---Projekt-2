fetch("database.json")
  .then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then((data) => {
    if (!data) {
      console.error("Data is null");
      return;
    }

    // Sort the leaderboard based on the score
    data.sort(function (a, b) {
      return b.score - a.score;
    });

    // Add each user to the leaderboard table
    var leaderboardTable = document
      .getElementById("leaderboard")
      .getElementsByTagName("tbody")[0];
    for (var i = 0; i < data.length; i++) {
      var row = leaderboardTable.insertRow(-1);
      var rankCell = row.insertCell(0);
      var usernameCell = row.insertCell(1);
      var scoreCell = row.insertCell(2);
      var rankingTitleCell = row.insertCell(3);
      rankCell.textContent = i + 1;
      usernameCell.textContent = data[i].username;
      scoreCell.textContent = data[i].score;

      // Assign ranking titles based on the rank
      let rankingTitle = "";
      switch (i) {
        case 0:
          rankingTitle = "Alpha Dog Walker";
          break;
        case 1:
          rankingTitle = "Top Dog Walker";
          break;
        case 2:
          rankingTitle = "Elite Dog Walker";
          break;
        case 3:
          rankingTitle = "Master Dog Walker";
          break;
        case 4:
          rankingTitle = "Champion Dog Walker";
          break;
        case 5:
          rankingTitle = "Experienced Dog Walker";
          break;
        case 6:
          rankingTitle = "Skilled Dog Walker";
          break;
        case 7:
          rankingTitle = "Junior Dog Walker";
          break;
        case 8:
          rankingTitle = "Novice Dog Walker";
          break;
        default:
          rankingTitle = "Rookie Dog Walker";
      }
      rankingTitleCell.textContent = rankingTitle;

      // Apply live RGB colors to the top 3 ranks
      if (i < 3) {
        rankingTitleCell.classList.add("top-3");
      } else {
        rankingTitleCell.classList.add("other-ranks");
      }
    }
  })
  .catch((error) => {
    console.error("Error:", error);
  });
