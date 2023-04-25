function initMapApp() {
  var leaderboard = [];
  var user = { username: null, score: 0 };
  var treasures = [];

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

        leaderboard = data;
        leaderboard.sort(function (a, b) {
          return b.score - a.score;
        });
        var leaderboardList = document.getElementById("leaderboard");
        leaderboardList.innerHTML = "";
        for (var i = 0; i < data.length; i++) {
          var dogsCaptured = "";
          if (data[i].dogsCaptured) {
            for (const [dogId, count] of Object.entries(data[i].dogsCaptured)) {
              dogsCaptured += `${dogId}: ${count} `;
            }
          }
          leaderboardList.innerHTML +=
            "<li>" +
            data[i].username +
            ": " +
            data[i].score +
            " | Dogs Captured: " +
            dogsCaptured +
            "</li>";
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  function updateLeaderboard(user) {
    const existingUserIndex = leaderboard.findIndex(
      (existingUser) => existingUser.username === user.username
    );

    if (existingUserIndex !== -1) {
      leaderboard[existingUserIndex] = user;
    } else {
      leaderboard.push(user);
    }

    // Add the dogsCaptured property to the user object
    var data = { ...user, dogsCaptured: user.dogsCaptured };

    fetch("update.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ user: data }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Success:", data);
        loadLeaderboard();
        localStorage.setItem("user", JSON.stringify(user));
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }

  var map;
  var userMarker;

  function initMap() {
    var usernameForm = document.createElement("form");
    usernameForm.id = "username-form";
    var usernameInput = document.createElement("input");
    usernameInput.type = "text";
    usernameInput.id = "username-input";
    usernameInput.placeholder = "Enter your username";
    var submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";
    usernameForm.appendChild(usernameInput);
    usernameForm.appendChild(submitButton);
    document.body.appendChild(usernameForm);

    var savedUser = localStorage.getItem("user");
    if (savedUser) {
      user = JSON.parse(savedUser);
    }

    if (user.username) {
      usernameForm.style.display = "none";
    }

    navigator.geolocation.watchPosition(
      function (position) {
        var location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        user.latitude = location.lat;
        user.longitude = location.lng;

        if (!map) {
          map = new google.maps.Map(document.getElementById("map"), {
            center: location,
            zoom: 200,
            panControl: true,
            zoomControl: true,
            minZoom: 18,
            maxZoom: 22,
          });
        } else {
          map.setCenter(location);
        }

        if (!userMarker) {
          userMarker = new google.maps.Marker({
            position: location,
            map: map,
            title: "You are here",
            icon: {
              url: "images/person.gif",
              scaledSize: new google.maps.Size(60, 60),
            },
          });
        } else {
          userMarker.setPosition(location);
        }

        // Define the POODLE
        // Define the POODLE
        // Define the POODLE
        var poodleIcon = {
          url: "images/poodle.png",
          scaledSize: new google.maps.Size(50, 50),
          id: 1,
        };

        var hotdogIcon = {
          url: "images/hotdog.png",
          scaledSize: new google.maps.Size(50, 50),
          id: 2,
        };

        var hotdogLocation = {
          lat: 55.60549811429528,
          lng: 12.992144595179322,
        };

        var hotdogMarker = new google.maps.Marker({
          position: hotdogLocation,
          map: map,
          icon: hotdogIcon,
        });

        var poodleLocation = {
          lat: 55.605372022499424,
          lng: 12.992152093601026,
        };

        var poodleMarker = new google.maps.Marker({
          position: poodleLocation,
          map: map,
          icon: poodleIcon,
        });

        poodleMarker.addListener("click", handlePoodleClick);

        var hotdogCollected = false;

        function handlePoodleClick() {
          if (hotdogCollected) {
            var dogId = poodleIcon.id;
            if (user.dogsCaptured && user.dogsCaptured[dogId]) {
              window.alert("You've already collected the poodle!");
            } else {
              user.score += 10;
              user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 };
              updateLeaderboard(user);
              window.alert("You caught the poodle and collected points!");
            }
          } else {
            window.alert(
              "You need to bring me a hotdog before you can collect me!"
            );
          }
        }

        function handleHotdogClick() {
          var dogId = hotdogIcon.id;
          if (user.dogsCaptured && user.dogsCaptured[dogId]) {
            window.alert("You've already collected the hotdog!");
          } else {
            var distance =
              google.maps.geometry.spherical.computeDistanceBetween(
                hotdogMarker.getPosition(),
                userMarker.getPosition()
              );
            if (distance < 100) {
              hotdogCollected = true;
              user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 };
              updateLeaderboard(user);
              window.alert(
                "You've collected the hotdog! Now bring it to the poodle to collect it."
              );
              hotdogMarker.setMap(null);
            } else {
              window.alert(
                "You need to be closer to the hotdog to collect it."
              );
            }
          }
        }

        hotdogMarker.addListener("click", handleHotdogClick);

        // Define the POODLE
        // Define the POODLE
        // Define the POODLE

        // Define the HUSKY
        // Define the HUSKY
        // Define the HUSKY

        // Define the husky icon
        // Define the husky icon
        var huskyIcon = {
          url: "images/husky.png",
          scaledSize: new google.maps.Size(50, 50),
          id: 2, // set the ID of the dog to 2 for the husky
        };

        // Define the initial location for the husky marker
        var huskyInitialLocation = {
          lat: 55.605372022499424,
          lng: 12.993152093601026,
        };

        // Define the current location for the husky marker
        var huskyCurrentLocation = huskyInitialLocation;

        // Create the husky marker
        var huskyMarker = new google.maps.Marker({
          position: huskyInitialLocation,
          map: map,
          icon: huskyIcon,
        });

        // Define the function that handles the click event for the husky marker
        function handleHuskyClick() {
          // Get the distance between the user and the husky marker
          var userLocation = {
            lat: user.latitude,
            lng: user.longitude,
          };
          var distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(userLocation),
            new google.maps.LatLng(huskyCurrentLocation)
          );

          var dogId = huskyIcon.id; // get the dog ID from the marker icon
          if (distance < 100) {
            // check if user is within 1 meter of the husky marker
            if (dogId === 2) {
              if (user.dogsCaptured && user.dogsCaptured[dogId]) {
                window.alert("You've already collected the husky!");
              } else {
                // increment the jump count and update the husky's current location
                var jumpCount = user.huskyJumpCount || 0;
                huskyCurrentLocation = {
                  lat:
                    huskyCurrentLocation.lat +
                    Math.random() * 0.0001 * (Math.random() < 0.5 ? -1 : 1),
                  lng:
                    huskyCurrentLocation.lng +
                    Math.random() * 0.0001 * (Math.random() < 0.5 ? -1 : 1),
                };
                huskyMarker.setPosition(huskyCurrentLocation);
                jumpCount++;
                user.huskyJumpCount = jumpCount;

                if (jumpCount >= 10) {
                  user.score += 50; // give the user 50 credits for catching the husky
                  user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 }; // add a new dog ID with a count of 1
                  updateLeaderboard(user);
                  window.alert("You caught the husky and earned 50 credits!");
                  huskyMarker.setMap(null); // remove the husky marker from the map
                } else {
                  window.alert(
                    "The husky jumped away! Keep clicking to catch it!"
                  );
                }
              }
            }
          } else {
            window.alert("You're too far away from the husky to catch it!");
          }
        }

        // Add a click event listener to the husky marker
        huskyMarker.addListener("click", handleHuskyClick);

        // Define the HUSKY
        // Define the HUSKY
        // Define the HUSKY

        function displayWelcomeMessage(username) {
          var welcomeMessage = document.createElement("div");
          welcomeMessage.id = "welcome-message";
          welcomeMessage.textContent = "Welcome : " + username;
          document.body.appendChild(welcomeMessage);
        }

        submitButton.addEventListener("click", function (event) {
          event.preventDefault();
          var username = usernameInput.value.trim();
          if (username) {
            user.username = username;
            usernameForm.style.display = "none";
            localStorage.setItem("username", username);
            displayWelcomeMessage(username);

            var savedTreasures = localStorage.getItem("treasures");
            if (savedTreasures) {
              treasures = JSON.parse(savedTreasures);
              treasures.forEach((treasure) => {
                var treasureMarker = new google.maps.Marker({
                  position: treasure,
                  map: map,
                  title: treasure.name,
                  icon: treasure.icon,
                });
                addTreasureClickHandler(treasureMarker, treasure);
              });
            } else {
            }
          }
        });

        var savedUsername = localStorage.getItem("username");
        if (savedUsername) {
          displayWelcomeMessage(savedUsername);
          usernameForm.style.display = "none";
        } else {
          usernameForm.style.display = "block";
        }
      },
      function (error) {
        console.error("Error:", error);
      },
      { timeout: 1000 }
    );

    loadLeaderboard();
  }

  document.addEventListener("DOMContentLoaded", function () {
    var savedUser = localStorage.getItem("user");
    if (savedUser) {
      user = JSON.parse(savedUser);
    }
    initMap();
    updateLeaderboard(user);
    startHealthTimer();

    if (!user.username) {
      document.getElementById("username-form").style.display = "block";
    }
  });

  initMap(); // Add this line at the end of the initMapApp() function
}

appLoaded = true;
if (window.initMapPending) {
  initMap();
}

window.initMapApp = initMapApp;
