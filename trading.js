// Define variables
var users = [];
var currentUser = null;

// Fetch user data from the database and populate the users array
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
    users = data;
  })
  .catch((error) => {
    console.error("Error:", error);
  });

// Event listener for the "Add Item" button
document.getElementById("add-item").addEventListener("click", function () {
  var name = document.getElementById("item-name").value.trim();
  var description = document.getElementById("item-description").value.trim();
  var value = document.getElementById("item-value").value.trim();

  // Validate input
  if (!name || !description || !value) {
    alert("Please fill in all fields.");
    return;
  }

  // Create new item object
  var newItem = {
    name: name,
    description: description,
    value: value,
    owner: currentUser.username,
  };

  // Add the new item to the user's inventory
  currentUser.inventory.push(newItem);

  // Save the updated user data to the database
  fetch("update.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ user: currentUser }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      console.log("Success:", data);
      updateInventoryDisplay();
    })
    .catch((error) => {
      console.error("Error:", error);
    });
});

// Function to update the inventory display
function updateInventoryDisplay() {
  var inventoryList = document.getElementById("inventory");
  inventoryList.innerHTML = "";

  if (currentUser.inventory.length === 0) {
    inventoryList.innerHTML = "<li>No items in inventory.</li>";
  } else {
    for (var i = 0; i < currentUser.inventory.length; i++) {
      var item = currentUser.inventory[i];
      var listItem = document.createElement("li");
      listItem.textContent =
        item.name + " - " + item.description + " - " + item.value;
      inventoryList.appendChild(listItem);
    }
  }
}

// Event listener for the "Login" button
document.getElementById("login-button").addEventListener("click", function () {
  var username = document.getElementById("username-input").value.trim();

  // Find the user in the users array
  var foundUser = users.find(function (user) {
    return user.username === username;
  });

  // If user not found, display error message and return
  if (!foundUser) {
    alert("User not found.");
    return;
  }

  // Set the current user to the found user and update the display
  currentUser = foundUser;
  updateInventoryDisplay();
  document.getElementById("login-form").style.display = "none";
  document.getElementById("inventory-container").style.display = "block";
});
