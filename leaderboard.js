function loadLeaderboard() {
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

      data.sort(function (a, b) {
        return b.score - a.score; // Sort the leaderboard based on the score
      });

      var leaderboardList = document.getElementById("leaderboard");
      leaderboardList.innerHTML = "";

      for (var i = 0; i < data.length; i++) {
        leaderboardList.innerHTML +=
          "<li>" + data[i].username + ": " + data[i].score + "</li>";
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  loadLeaderboard();

  // Wait for the page to finish loading before accessing the form elements
  window.addEventListener("load", function () {
    var username = document.getElementById("username").value;
    var guess = document.getElementById("guess").value;

    var submitButton = document.getElementById("submit-user");
    submitButton.addEventListener("click", function (event) {
      event.preventDefault();

      // Get the username and secret phrase from the form
      var username = document.getElementById("username").value;
      var guess = document.getElementById("guess").value;

      // Check if the user has already used the secret phrase
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

          // Find the user in the database
          var user = data.find(function (item) {
            return item.username === username;
          });

          if (user) {
            if (user.secret === 1) {
              alert(
                "You have already used the secret phrase. Please try again later."
              );
              return;
            } else if (guess === "malmo") {
              // If the secret phrase is correct, set the updated score to 10
              var updatedScore = 10;

              // Set the user's "secret" field to 1 to indicate that they have used the secret phrase
              user.secret = 1;

              // Send a request to the server to update the user's score and secret status in the leaderboard
              fetch("quest.php", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  username: username,
                  score: updatedScore,
                  secret: user.secret,
                }),
              })
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

                  // Reload the leaderboard to display the updated scores
                  loadLeaderboard();

                  // Reset the form
                  document.getElementById("user-form").reset();
                })
                .catch((error) => {
                  console.error("Error:", error);
                });
            } else {
              alert("Incorrect secret phrase. Please try again.");
            }
          } else {
            alert("User not found. Please enter a valid username.");
          }
        })
        .catch((error) => {
          console.error("Error:", error);
        });
    });
  });
});
