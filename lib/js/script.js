$('#search-button').click(function() {
    var title = $('#book-name').val(); // Corrected the ID
    var author = $('#book-author').val(); // Corrected the ID

    // Make AJAX request to PHP backend with title and author parameters
    $.ajax({
        url: './lib/php/openLibrary.php',
        type: 'GET',
        data: {
            title: title,
            author: author
        },
        dataType: 'json',
        success: function(response) {
            console.log(response); // Log the response data to the console
            populateSearchResults(response);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please try again later.'); // Alert user about the error
        }
    });
});

function populateSearchResults(books) {
    let $searchResultsSection = $('#search-results');
    $searchResultsSection.empty(); // Clear previous search results

    if (!books || books.length === 0) {
        console.log('No books found.'); // Log message for empty response
        $searchResultsSection.append('<p>No books found.</p>'); // Display message on the webpage
        return; // Exit the function
    }

    $.each(books, function(index, book) {
        var thumbnailUrl = book.cover_i ? 'https://covers.openlibrary.org/b/id/' + book.cover_i + '-S.jpg' : 'https://via.placeholder.com/100'; // Default placeholder image
        var $img = $('<img>').attr('src', thumbnailUrl).attr('alt', book.title);

        // Append thumbnail to search results section
        $searchResultsSection.append($img);
    });
}
