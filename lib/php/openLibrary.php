<?php

$title = isset($_GET['title']) ? $_GET['title'] : ''; // Get title from the frontend
$author = isset($_GET['author']) ? $_GET['author'] : ''; // Get author from the frontend

// Function to construct the API request URL based on the search query
function constructApiRequest($title, $author) {
    // Encode search parameters
    $encodedTitle = !empty($title) ? urlencode($title) : '';
    $encodedAuthor = !empty($author) ? urlencode($author) : '';

    // Construct the API request URL
    $url = "https://openlibrary.org/search.json?";
    
    // Append title and/or author parameters if provided
    if (!empty($encodedTitle) && !empty($encodedAuthor)) {
        $url .= "title={$encodedTitle}&author={$encodedAuthor}";
    } elseif (!empty($encodedTitle)) {
        $url .= "title={$encodedTitle}";
    } elseif (!empty($encodedAuthor)) {
        $url .= "author={$encodedAuthor}";
    }

    return $url;
}

// Function to fetch book data from the Open Library API
function fetchBookData($title, $author) {
    // Construct the API request URL
    $url = constructApiRequest($title, $author);

    // Initialize cURL session
    $curl = curl_init();

    // Set cURL options
    curl_setopt($curl, CURLOPT_URL, $url);
    curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);

    // Execute the cURL request
    $response = curl_exec($curl);

    // Check for errors
    if ($response === false) {
        $error = curl_error($curl);
        error_log("cURL Error: " . $error); // Log cURL error
        return false; // Return false to indicate error
    }

    // Close cURL session
    curl_close($curl);

    // Log the API response
    error_log("API Response: " . $response);

    // Parse JSON response
    $data = json_decode($response, true);

    // Check if response is valid JSON
    if ($data === null) {
        error_log("Invalid JSON response from API"); // Log invalid JSON error
        return false; // Return false to indicate error
    }

    // Check if response contains book data
    if (!isset($data['docs'])) {
        error_log("No book data found in API response"); // Log no book data error
        return false; // Return false to indicate error
    }

    // Return the extracted book data
    return $data['docs'];
}

// Fetch book data based on the search query
$books = fetchBookData($title, $author);

// Check if book data retrieval was successful
if ($books === false) {
    // Return error response
    header("HTTP/1.1 500 Internal Server Error");
    exit; // Terminate script execution
}

// Set the Content-Type header
header('Content-Type: application/json');

// Return the book data as JSON response
echo json_encode($books);
?>
