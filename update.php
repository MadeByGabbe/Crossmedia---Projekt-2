<?php
// Load the existing leaderboard data from the JSON file
$database_file = 'database.json';
$leaderboard_data = json_decode(file_get_contents($database_file), true);

// Decode the user data from the POST request
$input_data = json_decode(file_get_contents('php://input'), true);

if (isset($input_data['user'])) {
    $new_user = $input_data['user'];

    // Check if the user already exists in the leaderboard
    $user_index = -1;
    foreach ($leaderboard_data as $index => $existing_user) {
        if ($existing_user['username'] === $new_user['username']) {
            $user_index = $index;
            break;
        }
    }

    // Update the existing user or append the new user
    if ($user_index !== -1) {
        $leaderboard_data[$user_index] = $new_user;
    } else {
        $leaderboard_data[] = $new_user;
    }

    // Save the updated leaderboard data to the JSON file
    file_put_contents($database_file, json_encode($leaderboard_data, JSON_PRETTY_PRINT));

    // Return a success message as JSON
    header('Content-Type: application/json');
    echo json_encode(['message' => 'User added to leaderboard successfully.'], JSON_PRETTY_PRINT);
} else {
    // Return an error message as JSON
    header('Content-Type: application/json');
    http_response_code(400);
    echo json_encode(['message' => 'Invalid request.'], JSON_PRETTY_PRINT);
}
?>
