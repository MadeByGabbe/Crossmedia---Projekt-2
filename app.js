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

        // go back btn
        var goBackBtn = document.querySelector("#goBack")
        goBackBtn.addEventListener("touchstart", function () {
          window.location.href = "index.html";
        });

        var leashBtn = document.querySelector("#showLeash");
        leashBtn.addEventListener("touchstart", function () {
          window.location.href = "dogs.html";
        });

        // Intro
        if (localStorage.length === 0) {
          var intro = document.querySelector(".talkWithOwnerDiv");
          intro.style.display = "flex";
          var introBtn = document.querySelector(".talkWithOwnerBtn");
          introBtn.addEventListener("touchstart", function () {
            intro.style.display = "none";
            displayWalkWithDogs();
          });
        }

        function displayWalkWithDogs() {
          var walkWithDogs = document.querySelector(".walkWithDogsDiv");
          walkWithDogs.style.display = "flex";
          var walkWithDogsBtn = document.querySelector(".walkWithDogsBtn");
          walkWithDogsBtn.addEventListener("touchstart", function () {
            walkWithDogs.style.display = "none";
            displayDogsRunAway();
          });
         }

        function displayDogsRunAway() {
          var dogsRunAway = document.querySelector(".dogsRunsAwayDiv");
          dogsRunAway.style.display = "flex";
          var dogsRunAwayBtn = document.querySelector(".dogsRunsAwayBtn");
          dogsRunAwayBtn.addEventListener("touchstart", function () {
            dogsRunAway.style.display = "none";
            displayGameInfo();
          });
        }

        function displayGameInfo() {
          var gameInfo = document.querySelector(".gameInfo");
          gameInfo.style.display = "flex";
          var gameInfoBtn = document.querySelector(".gameInfoBtn");
          gameInfoBtn.addEventListener("touchstart", function () {
            gameInfo.style.display = "none";
          });
        }

        // Timer/Countdown

        function countdown() {
          var countdownElement = document.getElementById("countdown");
        
          var endTime = localStorage.getItem("countdownEndTime");
          if (endTime) {
            startCountdown(new Date(endTime), countdownElement);
          } else {
            var endDate = new Date();
            endDate.setHours(endDate.getHours() + 2); // Set end time to 2 hours from now
            startCountdown(endDate, countdownElement);
            localStorage.setItem("countdownEndTime", endDate);
          }
        }
        
        function startCountdown(endTime, countdownElement) {
          var timer = setInterval(function() {
            var now = new Date();
            var remainingTime = endTime - now;
        
            if (remainingTime <= 0) {
              clearInterval(timer);
              countdownElement.textContent = "00:00:00"; // Countdown is finished
              loseGame();
              localStorage.removeItem("countdownEndTime");
            } else {
              countdownElement.textContent = formatTime(remainingTime);
            }
          }, 1000); // Update every second
        }
        
        function formatTime(time) {
          var hours = Math.floor(time / (1000 * 60 * 60));
          var minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
          var seconds = Math.floor((time % (1000 * 60)) / 1000);
        
          var formattedTime = hours.toString().padStart(2, '0') + ":" +
                              minutes.toString().padStart(2, '0') + ":" +
                              seconds.toString().padStart(2, '0');
          return formattedTime;
        }
        
        window.onload = function() {
          countdown();
        };
        
        // Lose/Win game

        function loseGame() {
          var loseGame = document.querySelector(".loseGameDiv");
          loseGame.style.display = "flex";
          var loseGameBtn = document.querySelector(".loseGameBtn");
          loseGameBtn.addEventListener("touchstart", function () {
            loseGame.style.display = "none";
            localStorage.clear();
            window.location.href = "index.html";
          });
        }

        function winGame() {
          var winGame = document.querySelector(".winGameDiv");
          winGame.style.display = "flex";
          var winGameBtn = document.querySelector(".winGameBtn");
          winGameBtn.addEventListener("touchstart", function () {
            winGame.style.display = "none";
            localStorage.clear();
            window.location.href = "index.html";
          });
        }
        
        setInterval(function () {
          console.log("hej");
          if(user.dogsCaptured) {
            if (Object.keys(user.dogsCaptured).length === 9) {
              winGame();
            }
          }
         }, 5000);
        


        // Define the Poodle
        // Define the Poodle
        // Define the Poodle


        var poodleIcon = {
          url: "images/poodle.png",
          scaledSize: new google.maps.Size(100, 125),
          id: 1,
        };

        var poodleLocation = {
          lat: 55.60497685335,
          lng: 12.992490002219716,
        };
        
        var poodleMarker = new google.maps.Marker({
          position: poodleLocation,
          map: map,
          icon: poodleIcon,
        });

        poodleMarker.addListener("click", poodleGame);

        function poodleGame() {
          if (user.dogsCaptured && user.dogsCaptured[poodleIcon.id]) {
              window.alert("Du har redan fångat pudeln!");
              return;
          }
          
          var distance = google.maps.geometry.spherical.computeDistanceBetween(
            poodleMarker.getPosition(),
            userMarker.getPosition()
          );

          if (distance > 10) {
            window.alert("Du är för långt bort från Pudeln!");
            return;
          }

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
              console.log("yes");
              gameContainer.style.display = "none";
            });

            dogMessageButton.addEventListener('touchstart', function () {
              user.score += 10;
              user.dogsCaptured = { ...user.dogsCaptured, [poodleIcon.id]: 1 };
              updateLeaderboard(user);
              console.log("yes");
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
                  element.style.opacity = dirtyDogOpacity = dirtyDogOpacity - 0.001; // Change this to change the speed of cleaning	
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

        // Define the Poodle
        // Define the Poodle
        // Define the Poodle
        
        // Define the Chihuahua
        // Define the Chihuahua
        // Define the Chihuahua

        var chihuahuaIcon = {
          url: "images/chichi.png",
          scaledSize: new google.maps.Size(100, 125),
          id: 4,
        };

        var chihuahuaLocation = {
          lat: 55.60295791913047,
          lng: 12.98953396653704,
        };
        
        var chihuahuaMarker = new google.maps.Marker({
          position: chihuahuaLocation,
          map: map,
          icon: chihuahuaIcon,
        });

        chihuahuaMarker.addListener("click", chihuahuaGame);

        function chihuahuaGame() {
          if (user.dogsCaptured && user.dogsCaptured[chihuahuaIcon.id]) {
            window.alert("Du har redan fångat chihuahuan!");
            return;
          }

          var distance = google.maps.geometry.spherical.computeDistanceBetween(
            chihuahuaMarker.getPosition(),
            userMarker.getPosition()
          );

          if (distance > 10) {
            window.alert("Du är för långt bort från chihuahuan!");
            return;
          }

          let correctHandbagId = "handbag1"; // Replace with the correct handbag ID
          let penaltyTime = 10; // Penalty time in seconds

          const handbags = Array.from(document.querySelectorAll('.handbag'));
          const checkButton = document.getElementById('checkButton');
          const chihuahuaContainer = document.getElementById('chihuahua-container');
          const chihuahua = document.getElementById('chihuahua');
          const timerValue = document.getElementById('timer-value');
          const chichiGameContainer = document.querySelector('.chichiGameContainer');

          let selectedHandbag = null;
          let penaltyActive = false;
          let timerInterval = null;
          let timeRemaining = penaltyTime;

          chichiGameContainer.style.display = 'flex';
          let chichiDogMessageDiv = document.createElement('div');
          let chichiDogMessage = document.createElement('p');
          let chichiDogMessageButton = document.createElement('button');
          chichiDogMessageDiv.classList.add('chichi-dog-message');
          chichiGameContainer.appendChild(chichiDogMessageDiv);
          chichiDogMessageDiv.appendChild(chichiDogMessage);
          chichiDogMessage.classList.add('chichi-dog-message-text');
          chichiDogMessage.innerHTML = 'Voff Voff! Hj\u00E4lp mig hitta r\u00E4tt väska, den borde ha samma f\u00E4rg som mitt halsband, så hänger jag med dig!';
          chichiDogMessageButton.classList.add('chichi-dog-message-button');
          chichiDogMessageButton.innerHTML = 'Ok, jag ska hjälpa dig!';
          chichiDogMessageDiv.appendChild(chichiDogMessageButton);
          chichiDogMessageButton.addEventListener('click', () => {
            chichiDogMessageDiv.style.display = 'none';
            setEventListeners();
          });
          chichiDogMessageButton.addEventListener('touchstart', () => {
            chichiDogMessageDiv.style.display = 'none';
            setEventListeners();
          });

          function setEventListeners() {
            handbags.forEach(handbag => {
              handbag.addEventListener('click', () => {
                if (penaltyActive) return;
                if (selectedHandbag) selectedHandbag.classList.remove('selected');
                selectedHandbag = handbag;
                selectedHandbag.classList.add('selected');
              });
            });

            checkButton.addEventListener('click', () => {
              if (penaltyActive || !selectedHandbag) return;

              if (selectedHandbag.getAttribute("data-handbag-id") === correctHandbagId) {
                chihuahuaContainer.style.backgroundColor = "green";
                alert("Det va den rätta väskan! Bra jobbat!");
                endGame();
              } else {
                chihuahuaContainer.style.backgroundColor = "red";
                alert("Fel väska! Försök igen.");
                activatePenalty();
              }
            });
          }

          function endGame() {

            let chichiDogMessageDiv = document.querySelector('.chichi-dog-message');
            let chichiDogMessage = document.querySelector('.chichi-dog-message-text');
            let chichiDogMessageButton = document.querySelector('.chichi-dog-message-button');
            chichiDogMessage.innerHTML = 'Tack f\u00F6r hj\u00E4lpen! Du har f\u00E5ngat mig!';
            chichiDogMessageDiv.style.display = 'flex';
          
            chichiDogMessageButton.innerHTML = 'F\u00E5nga';
            chichiDogMessageButton.addEventListener('click', function () {
              user.score += 10;
              user.dogsCaptured = { ...user.dogsCaptured, [chihuahuaIcon.id]: 4 };
              updateLeaderboard(user);
              console.log("yes");
              chichiGameContainer.style.display = "none";
            });

            chichiDogMessageButton.addEventListener('touchstart', function () {
              user.score += 10;
              user.dogsCaptured = { ...user.dogsCaptured, [chihuahuaIcon.id]: 4 };
              updateLeaderboard(user);
              console.log("yes");
              chichiGameContainer.style.display = "none";
            });
          }

          function activatePenalty() {
            penaltyActive = true;
            checkButton.disabled = true;
            startTimer();
            setTimeout(() => {
              penaltyActive = false;
              checkButton.disabled = false;
              resetGame();
              resetTimer();
            }, penaltyTime * 1000);
          }

          function startTimer() {
            clearInterval(timerInterval);
            timeRemaining = penaltyTime;
            timerInterval = setInterval(() => {
              timeRemaining--;
              if (timeRemaining <= 0) {
                clearInterval(timerInterval);
              }
              timerValue.textContent = timeRemaining;
            }, 1000);
          }

          function resetGame() {
            if (selectedHandbag) {
              selectedHandbag.classList.remove('selected');
              selectedHandbag = null;
            }
            chihuahuaContainer.style.backgroundColor = "initial";
            clearInterval(timerInterval);
            timerValue.textContent = "";
          }

          function resetTimer() {
            clearInterval(timerInterval);
            timerValue.textContent = "";
            checkButton.disabled = false;
          }
        }




        // Define the English Bulldog
        // Define the English Bulldog
        // Define the English Bulldog

        var englishbulldogIcon = {
          url: "images/bulldog.png",
          scaledSize: new google.maps.Size(100, 200),
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

          var circle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map,
            center: huskyLocation,
            radius: 5,
          });

          var passcode = prompt("-Arya hitta min boll, den ligger här någonstans, när du hittat den kolla efter lösenkoden och skriv in den här:");
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

          var circle = new google.maps.Circle({
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.35,
            map,
            center: rottweilerLocation,
            radius: 5,
          });

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

        function displayWelcomeMessage(username) {
          var welcomeMessage = document.createElement("div");
          welcomeMessage.id = "welcome-message";
          welcomeMessage.textContent = "Välkommen : " + username;
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
