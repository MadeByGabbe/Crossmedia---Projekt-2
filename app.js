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
          scaledSize: new google.maps.Size(65, 65),
          id: 1,
        };

        var hotdogIcon = {
          url: "images/hotdog.png",
          scaledSize: new google.maps.Size(50, 50),
          id: 20,
        };

        var hotdogLocation = {
          lat: 55.603066357251976,
          lng: 12.994165427169657,
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

        poodleMarker.addListener("click", poodleGame);

        function poodleGame() {
          const gameContainer = document.querySelector('.game-container');
          const dirtyDog = document.querySelector('.dirty-dog');
          const cleanDog = document.querySelector('.clean-dog');
        
          gameContainer.style.display = 'flex';
          let dogMessageDiv = document.createElement('div');
          let dogMessage = document.createElement('p');
          let dogMessageButton = document.createElement('button');
          dogMessageDiv.classList.add('dog-message');
          gameContainer.appendChild(dogMessageDiv);
          dogMessageDiv.appendChild(dogMessage);
          dogMessage.classList.add('dog-message-text');
          dogMessage.innerHTML = 'Denna parken \u00E4r s\u00E5 smutsig! Om du vill f\u00E5nga mig m\u00E5ste du tv\u00E4tta mig f\u00F6rst!';
          dogMessageButton.classList.add('dog-message-button');
          dogMessageButton.innerHTML = 'Jag f\u00F6rst\u00E5r';
          dogMessageDiv.appendChild(dogMessageButton);
          dogMessageButton.addEventListener('click', () => {
            dogMessageDiv.style.display = 'none';
            setEventListeners();
          });
          dogMessageButton.addEventListener('touchstart', () => {
            dogMessageDiv.style.display = 'none';
            setEventListeners();
          });
          
        
        
        
          let isSwiping = false;
          let dirtyDogOpacity = 1;
        
          function revealCleanDog() {
            cleanDog.style.opacity = 1;
            let dogMessage = document.querySelector('.dog-message-text');
            let dogMessageDiv = document.querySelector('.dog-message');
            dogMessage.innerHTML = 'Tack f\u00F6r att du tv\u00E4ttade mig! Du har f\u00E5ngat mig!';
            dogMessageDiv.style.display = 'flex';
          
            let dogMessageButton = document.querySelector('.dog-message-button');
            dogMessageButton.innerHTML = 'F\u00E5nga';
            dogMessageButton.addEventListener('click', function () {
              user.score += 10;
              user.dogsCaptured = { ...user.dogsCaptured, [poodleIcon.id]: 1 };
              updateLeaderboard(user);
              gameContainer.style.display = "none";
            });
          }
        
          function handleSwipe(event) {
            if (isSwiping) {
              event.preventDefault();
              const x = event.clientX || event.touches[0].clientX;
              const y = event.clientY || event.touches[0].clientY;
              const element = document.elementFromPoint(x, y);
              if (element === dirtyDog) {
                if (dirtyDogOpacity > 0.005) {
                  element.style.opacity = dirtyDogOpacity = dirtyDogOpacity - 0.005; // Change this to change the speed of cleaning	
                  cleanDog.style.opacity = 1 - dirtyDogOpacity;
                }
                if (parseFloat(element.style.opacity) === 0.005) {
                  gameContainer.removeEventListener('mousemove', handleSwipe);
                  gameContainer.removeEventListener('touchmove', handleSwipe);
                  revealCleanDog();
                }
                setTimeout(() => {
                  element.style.opacity = dirtyDogOpacity;
                }, 0);
              }
            }
          }
        
          function handleSwipeStart(event) {
            console.log('swipe start');
            isSwiping = true;
            event.preventDefault();
          }
        
          function handleSwipeEnd(event) {
            isSwiping = false;
            event.preventDefault();
          }
        
          function setEventListeners() {
            dirtyDog.addEventListener('mousedown', handleSwipeStart);
            dirtyDog.addEventListener('touchstart', handleSwipeStart);
        
            gameContainer.addEventListener('mousemove', handleSwipe);
            gameContainer.addEventListener('touchmove', handleSwipe);
        
            document.addEventListener('mouseup', handleSwipeEnd);
            document.addEventListener('touchend', handleSwipeEnd);
          }
        
          // Create bubble element
          function createBubble(x, y) {
            if (isSwiping) {
              const bubble = document.createElement('div');
              bubble.classList.add('bubble');
              bubble.style.left = x + 'px';
              bubble.style.top = y + 'px';
              document.body.appendChild(bubble);
        
              // Remove bubble after delay
              setTimeout(() => {
                bubble.remove();
              }, 2000);
            }
          }
        
          // Listen for mousemove events
          document.addEventListener('mousemove', (event) => {
            createBubble(event.clientX, event.clientY);
          });
        }
        // Move a marker randomly within a radius of x meters (use: setInterval moveMarker)
        function moveMarkerRandom(marker, location) { 
          var radius = 30; // meters
          var randomAngle = Math.random() * 2 * Math.PI;
          var randomRadius = Math.random() * radius;
          var dx = randomRadius * Math.cos(randomAngle);
          var dy = randomRadius * Math.sin(randomAngle);
          var newLat = location.lat + (dy / 111111);
          var newLng = location.lng + (dx / (111111 * Math.cos(location.lat)));
          var newLatLng = new google.maps.LatLng(newLat, newLng);
          marker.setPosition(newLatLng);
        }

        var hotdogCollected = false;

        function handlePoodleClick() {
          if (hotdogCollected) {
            var dogId = poodleIcon.id;
            if (user.dogsCaptured && user.dogsCaptured[dogId]) {
              window.alert("Du har redan fångat pudeln!");
            } else {
              user.score += 10;
              user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 };
              updateLeaderboard(user);
              window.alert("Du fångade pudeln och samlade poäng!");
            }
          } else {
            window.alert(
              "Vill du att jag följer med dig?, Hämta en hotdog till mig från Falafelmästaren!"
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
            if (distance < 5000) {
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
          scaledSize: new google.maps.Size(65, 65),
          id: 2, // set the ID of the dog to 2 for the husky
        };

        // Define the initial location for the husky marker
        var huskyInitialLocation = {
          lat: 55.60498128234545,
          lng: 12.992214079559767,
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
          if (distance < 30000000) {
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
                  user.score += 10; // give the user 10 credits for catching the husky
                  user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 }; // add a new dog ID with a count of 1
                  updateLeaderboard(user);
                  window.alert("You caught the husky and earned 10 credits!");
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

        // DEFINE THE SHIBA
        // DEFINE THE SHIBA
        // DEFINE THE SHIBA

        var shibaIcon = {
          url: "images/shiba.png",
          scaledSize: new google.maps.Size(75, 75),
          id: 3, // set the ID of the dog to 3 for the shiba
        };

        // Define the location for the shiba marker
        var shibaLocation = {
          lat: 55.60520782888914,
          lng: 12.991357230724981,
        };

        // Create the shiba marker
        var shibaMarker = new google.maps.Marker({
          position: shibaLocation,
          map: map,
          icon: shibaIcon,
        });

        // Add a click event listener to the shiba marker
        shibaMarker.addListener("click", handleShibaClick);

        // Define the function that handles the click event for the shiba marker
        function handleShibaClick() {
          var dogId = shibaIcon.id; // get the dog ID from the marker icon
          var passcode = prompt("Please enter the passcode to collect points:");
          if (passcode === "123") {
            if (user.dogsCaptured && user.dogsCaptured[dogId]) {
              window.alert("You've already collected the shiba!");
            } else {
              user.score += 10; // give the user 10 points
              user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 }; // add a new dog ID with a count of 1
              updateLeaderboard(user);
              window.alert("You caught the shiba and collected points!");
            }
          } else {
            window.alert("Incorrect passcode. Please try again.");
          }
        }

        // DEFINE THE SHIBA
        // DEFINE THE SHIBA
        // DEFINE THE SHIBA

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
