function showWelcomeMessage(username, score, dogsCaptured) {
  var welcomeMessage = document.createElement("div");
  welcomeMessage.id = "welcome-message";
  welcomeMessage.innerHTML =
    "<h1>Hello " + username + "! Your score is " + score + "</h1>";

  if (dogsCaptured) {
    var dogsCapturedMessage = document.createElement("div");
    dogsCapturedMessage.style.fontSize = "24px";
    dogsCapturedMessage.style.marginTop = "20px";
    dogsCapturedMessage.textContent = "You have captured:";
    welcomeMessage.appendChild(dogsCapturedMessage);

    var dogsList = document.createElement("ul");
    dogsList.style.marginTop = "10px";
    for (var dogId in dogsCaptured) {
      var dogName = "";
      switch (dogId) {
        case "1":
          dogName = "Poodle";
          break;
        case "2":
          dogName = "Husky";
          break;
        case "3":
          dogName = "Shiba";
          break;
        case "4":
          dogName = "Chihuahua";
          break;
        case "5":
          dogName = "Bulldog";
          break;
        case "6":
          dogName = "Golden Retriever";
          break;
        case "7":
          dogName = "Dalmatian";
          break;
        case "8":
          dogName = "Yorkshire Terrier";
          break;
        case "20":
          dogName = " Hotdog";
          break;
        default:
          break;
      }
      var dogItem = document.createElement("li");
      dogItem.innerHTML =
        '<img src="images/dog' +
        dogId +
        '.png" alt="' +
        dogName +
        '"/><span>' +
        dogName +
        ": " +
        dogsCaptured[dogId] +
        " times</span>";
      dogsList.appendChild(dogItem);
    }
    welcomeMessage.appendChild(dogsList);
  }

  document.body.appendChild(welcomeMessage);
}

document.addEventListener("DOMContentLoaded", function () {
  var user = { username: "" };
  var savedUser = localStorage.getItem("user");
  if (savedUser) {
    user = JSON.parse(savedUser);
  }

  // Display welcome message
  if (user.username) {
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

        var savedScore = 0;
        var dogsCaptured = null;
        for (var i = 0; i < data.length; i++) {
          if (data[i].username === user.username) {
            savedScore = data[i].score;
            dogsCaptured = data[i].dogsCaptured;
            break;
          }
        }

        showWelcomeMessage(user.username, savedScore, dogsCaptured);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  }
});
