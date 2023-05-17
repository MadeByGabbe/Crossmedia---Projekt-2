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

        // Define the English Bulldog
        // Define the English Bulldog
        // Define the English Bulldog

        var englishbulldogIcon = {
          url: "images/bulldog.png",
          scaledSize: new google.maps.Size(75, 175),
          id: 5,
        };

        var hotdogIcon = {
          url: "images/hotdog.png",
          scaledSize: new google.maps.Size(100, 150),
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

        var englishbulldogLocation = {
          lat: 55.605372022499424,
          lng: 12.992152093601026,
        };

        var englishbulldogMarker = new google.maps.Marker({
          position: englishbulldogLocation,
          map: map,
          icon: englishbulldogIcon,
        });

        englishbulldogMarker.addListener("click", handleenglishbulldogClick);

        var hotdogCollected = false;

        function handleenglishbulldogClick() {
          if (hotdogCollected) {
            var dogId = englishbulldogIcon.id;
            if (user.dogsCaptured && user.dogsCaptured[dogId]) {
              window.alert("Du har redan fångat engelsk bulldog!");
            } else {
              user.score += 10;
              user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 };
              updateLeaderboard(user);
              window.alert("Du fångade engelska bulldog och samlade poäng!");
            }
          } else {
            window.alert(
              "- Francis den III:e Vill du att jag följer med dig vof.. vof..?, hämta varmkorven till mig från Falafelmästaren lite längre ner i parken!"
            );
          }
        }

        function handleHotdogClick() {
          var dogId = hotdogIcon.id;
          if (user.dogsCaptured && user.dogsCaptured[dogId]) {
            window.alert("Du har redan samlat varmkorven!");
          } else {
            var distance =
              google.maps.geometry.spherical.computeDistanceBetween(
                hotdogMarker.getPosition(),
                userMarker.getPosition()
              );
            if (distance < 10) {
              hotdogCollected = true;
              user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 };
              updateLeaderboard(user);
              window.alert("Du har samlat varmkorven!.");
              hotdogMarker.setMap(null);
            } else {
              window.alert("Du måste vara närmare varmkorven.");
            }
          }
        }

        hotdogMarker.addListener("click", handleHotdogClick);

        // Define the English Bulldog
        // Define the English Bulldog
        // Define the English Bulldog

        // DEFINE THE SHIBA
        // DEFINE THE SHIBA
        // DEFINE THE SHIBA

        var shibaIcon = {
          url: "images/shiba.png",
          scaledSize: new google.maps.Size(75, 130),
          id: 3, // set the ID of the dog to 3 for the shiba
        };

        // Define the location for the shiba marker
        var shibaLocation = {
          lat: 55.60318936427057,
          lng: 12.98605771075296,
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
          var passcode = prompt("-Lola, imponera mig för att få lösenkoden!:");
          if (passcode === "shine") {
            if (user.dogsCaptured && user.dogsCaptured[dogId]) {
              window.alert("Du har redan fångat Shiban!");
            } else {
              user.score += 10; // give the user 10 points
              user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 }; // add a new dog ID with a count of 1
              updateLeaderboard(user);
              window.alert("Du har fångat shiban och fått poäng!");
            }
          } else {
            window.alert("- Lola, Fel lösenord, prova igen.");
          }
        }

        // DEFINE THE SHIBA
        // DEFINE THE SHIBA
        // DEFINE THE SHIBA

        // DEFINE THE HUSKY
        // DEFINE THE HUSKY
        // DEFINE THE HUSKY

        var huskyIcon = {
          url: "images/husky.png",
          scaledSize: new google.maps.Size(75, 130),
          id: 2, // set the ID of the dog to 2 for the husky
        };

        // Define the location for the husky marker
        var huskyLocation = {
          lat: 55.60272524698542,
          lng: 12.990935926577087,
        };

        // Create the husky marker
        var huskyMarker = new google.maps.Marker({
          position: huskyLocation,
          map: map,
          icon: huskyIcon,
        });

        // Add a click event listener to the husky marker
        huskyMarker.addListener("click", handleHuskyClick);

        // Define the function that handles the click event for the husky marker
        function handleHuskyClick() {
          var dogId = huskyIcon.id; // get the dog ID from the marker icon
          var passcode = prompt("-Arya hitta min boll för att få lösenkoden:");
          if (passcode === "sommar") {
            if (user.dogsCaptured && user.dogsCaptured[dogId]) {
              window.alert("Du har redan fångat Huskyn!");
            } else {
              user.score += 10; // give the user 10 points
              user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 }; // add a new dog ID with a count of 1
              updateLeaderboard(user);
              window.alert("Du fångade Huskyn och samlade poäng !");
            }
          } else {
            window.alert("Fel lösenkod, prova igen!");
          }
        }

        // DEFINE THE HUSKY
        // DEFINE THE HUSKY
        // DEFINE THE HUSKY

        // DEFINE THE TAX
        // DEFINE THE TAX
        // DEFINE THE TAX

        var taxIcon = {
          url: "images/tax.png",
          scaledSize: new google.maps.Size(75, 130),
          id: 8, // set the ID of the dog to 2 for the tax
        };

        // Define the location for the tax marker
        var taxLocation = {
          lat: 55.604195759782094,
          lng: 12.98952533299405,
        };

        // Create the tax marker
        var taxMarker = new google.maps.Marker({
          position: taxLocation,
          map: map,
          icon: taxIcon,
        });

        // Add a click event listener to the tax marker
        taxMarker.addListener("click", handleTaxClick);

        // Define the function that handles the click event for the tax marker
        function handleTaxClick() {
          var dogId = taxIcon.id; // get the dog ID from the marker icon
          var passcode = prompt(
            "-King, Vinn mot gamla gubben i sten, sax, påse för att få lösenkoden:"
          );
          if (passcode === "glad") {
            if (user.dogsCaptured && user.dogsCaptured[dogId]) {
              window.alert("Du har redan fångat Taxen!");
            } else {
              user.score += 10; // give the user 10 points
              user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 }; // add a new dog ID with a count of 1
              updateLeaderboard(user);
              window.alert("Du fångade Taxen och samlade poäng !");
            }
          } else {
            window.alert("Fel lösenkod, prova igen!");
          }
        }

        // DEFINE THE TAX
        // DEFINE THE TAX
        // DEFINE THE TAX

        // Click event Hotdog
        // Click event Hotdog
        // Click event Hotdog

        function handleHotdogClick() {
          var dogId = hotdogIcon.id;
          var distance = google.maps.geometry.spherical.computeDistanceBetween(
            hotdogMarker.getPosition(),
            userMarker.getPosition()
          );
          if (distance < 10) {
            hotdogCollected = true;
            user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 };
            updateLeaderboard(user);
            window.alert("Du har samlat varmkorven!.");
            hotdogMarker.setMap(null);
          } else {
            window.alert("Du måste vara närmare varmkorven.");
          }
        }

        hotdogMarker.addListener("click", handleHotdogClick);

        // Click event Hotdog
        // Click event Hotdog
        // Click event Hotdog

        // DEFINE THE ROTTWEILER
        // DEFINE THE ROTTWEILER
        // DEFINE THE ROTTWEILER

        var rottweilerIcon = {
          url: "images/rottweiler.png",
          scaledSize: new google.maps.Size(75, 130),
          id: 30, // set the ID of the dog to 2 for the rottweiler
        };

        // Define the location for the rottweiler marker
        var rottweilerLocation = {
          lat: 55.604148936345396,
          lng: 12.985029925130261,
        };

        // Create the rottweiler marker
        var rottweilerMarker = new google.maps.Marker({
          position: rottweilerLocation,
          map: map,
          icon: rottweilerIcon,
        });

        // Add a click event listener to the rottweiler marker
        rottweilerMarker.addListener("click", handleRottweilerClick);

        // Define the function that handles the click event for the rottweiler marker
        function handleRottweilerClick() {
          var dogId = rottweilerIcon.id; // get the dog ID from the marker icon
          var passcode = prompt(
            "-Bamse, hitta ett ben, för att få lösenkoden:"
          );
          if (passcode === "giveon") {
            if (user.dogsCaptured && user.dogsCaptured[dogId]) {
              window.alert("Du har redan fångat Rottweilern!");
            } else {
              user.score += 10; // give the user 10 points
              user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 }; // add a new dog ID with a count of 1
              updateLeaderboard(user);
              window.alert("Du fångade Rottweilern och samlade poäng!");
            }
          } else {
            window.alert("Fel lösenkod, prova igen!");
          }
        }

        // DEFINE THE ROTTWEILER
        // DEFINE THE ROTTWEILER
        // DEFINE THE ROTTWEILER

        // Define the CANECORSO
        // Define the CANECORSO
        // Define the CANECORSO

        var canecorsoIcon = {
          url: "images/canecorso.png",
          scaledSize: new google.maps.Size(75, 125),
          id: 31, // set the ID of the dog to 3 for the canecorso
        };

        // Define the initial location for the canecorso marker
        var canecorsoInitialLocation = {
          lat: 55.60172125633804,
          lng: 12.992361954184194,
        };

        // Define the current location for the canecorso marker
        var canecorsoCurrentLocation = canecorsoInitialLocation;

        // Create the canecorso marker
        var canecorsoMarker = new google.maps.Marker({
          position: canecorsoInitialLocation,
          map: map,
          icon: canecorsoIcon,
        });

        // Define the function that handles the click event for the canecorso marker
        function handleCanecorsoClick() {
          // Get the distance between the user and the canecorso marker
          var userLocation = {
            lat: user.latitude,
            lng: user.longitude,
          };
          var distance = google.maps.geometry.spherical.computeDistanceBetween(
            new google.maps.LatLng(userLocation),
            new google.maps.LatLng(canecorsoCurrentLocation)
          );

          var dogId = canecorsoIcon.id; // get the dog ID from the marker icon
          if (distance < 3) {
            // check if user is within 1 meter of the canecorso marker
            if (dogId === 31) {
              if (user.dogsCaptured && user.dogsCaptured[dogId]) {
                window.alert("Du har redan fångat Cane Corson!");
              } else {
                // increment the jump count and update the canecorso's current location
                var jumpCount = user.canecorsoJumpCount || 0;
                canecorsoCurrentLocation = {
                  lat:
                    canecorsoCurrentLocation.lat +
                    Math.random() * 0.0001 * (Math.random() < 0.5 ? -1 : 1),
                  lng:
                    canecorsoCurrentLocation.lng +
                    Math.random() * 0.0001 * (Math.random() < 0.5 ? -1 : 1),
                };
                canecorsoMarker.setPosition(canecorsoCurrentLocation);
                jumpCount++;
                user.canecorsoJumpCount = jumpCount;

                if (jumpCount >= 10) {
                  user.score += 10; // give the user 10 credits for catching the canecorso
                  user.dogsCaptured = { ...user.dogsCaptured, [dogId]: 1 }; // add a new dog ID with a count of 1
                  updateLeaderboard(user);
                  window.alert("Du fångade Cane Corson!");
                  canecorsoMarker.setMap(null); // remove the canecorso marker from the map
                } else {
                  window.alert(
                    "-Spike, du kan inte fånga mig, (Spike sprang iväg!)"
                  );
                }
              }
            }
          } else {
            window.alert("Du är för långt borta kom närmare");
          }
        }

        // Add a click event listener to the canecorso marker
        canecorsoMarker.addListener("click", handleCanecorsoClick);

        // Define the CANECORSO
        // Define the CANECORSO
        // Define the CANECORSO

        // Define the owner
        // Define the owner
        // Define the owner

        // Define the owner icon
        var ownerIcon = {
          url: "images/owner.png",
          scaledSize: new google.maps.Size(75, 130),
          id: 42, // behövs ej
        };

        // Define the location for the owner marker
        var ownerLocation = {
          lat: 55.60530166796243,
          lng: 12.991493044211184,
        };

        // Create the owner marker
        var ownerMarker = new google.maps.Marker({
          position: ownerLocation,
          map: map,
          icon: ownerIcon,
        });

        // Add a click event listener to the owner marker
        ownerMarker.addListener("click", handleOwnerClick);

        // Define the function that handles the click event for the owner marker
        function handleOwnerClick() {
          var dogIds = [31, 1]; // Dog IDs that need to be captured
          var hasAllDogs = dogIds.every(function (id) {
            return user.dogsCaptured && user.dogsCaptured[id];
          });

          if (hasAllDogs) {
            // User has captured all required dogs
            window.alert("Tack så mycket för hjälpen, ha en bra sommar!");
            // Perform owner-related actions here
          } else {
            // User hasn't captured all required dogs
            window.alert(
              "Tjenare de bra om du kan rasta mina hundar vi ses här igen om 1h!"
            );
          }
        }

        // Define the owner
        // Define the owner
        // Define the owner

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
            user.score += 0;
            updateLeaderboard(user);

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
