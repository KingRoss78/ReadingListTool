// Define variables for navigation
var currentIndex = 0;
var maxIndex = 0;

$('#search-button').click(function() {
    var title = $('#book-name').val();
    var author = $('#book-author').val();

    $.ajax({
        url: './lib/php/openLibrary.php',
        type: 'GET',
        data: {
            title: title,
            author: author
        },
        dataType: 'json',
        success: function(response) {
            console.log(response);
            populateSearchResults(response);
        },
        error: function(xhr, status, error) {
            console.error('Error fetching data:', error);
            alert('Error fetching data. Please try again later.');
        }
    });
});

function populateSearchResults(books) {
    var $carouselInner = $('#carousel-inner');
    $carouselInner.empty(); // Clear previous search results

    if (!books || books.length === 0) {
        console.log('No books found.');
        $carouselInner.append('<p>No books found.</p>');
        return;
    }

    // Reset currentIndex and maxIndex
    currentIndex = 0;
    maxIndex = Math.ceil(books.length / 5) - 1;

    // Display the initial set of images
    displayImages(books);

    // Show next set of images on clicking next button
    $('#next-btn').click(function() {
        if (currentIndex < maxIndex) {
            currentIndex++;
            displayImages(books);
        }
    });

    // Show previous set of images on clicking previous button
    $('#prev-btn').click(function() {
        if (currentIndex > 0) {
            currentIndex--;
            displayImages(books);
        }
    });

    $('.carousel-inner').css('transform', 'translateX(0)'); // Reset carousel position
    $('.carousel-container').toggle(books && books.length > 0);
}

function displayImages(books) {
    var $carouselInner = $('#carousel-inner');
    $carouselInner.empty(); // Clear previous search results

    var start = currentIndex * 5;
    var end = Math.min(start + 5, books.length);

    for (var i = start; i < end; i++) {
        var book = books[i];
        var thumbnailUrl = book.cover_i ? 'https://covers.openlibrary.org/b/id/' + book.cover_i + '-S.jpg' : 'https://via.placeholder.com/100';
        var $img = $('<img>').attr('src', thumbnailUrl).attr('alt', book.title);
        $carouselInner.append($img);
    }
}
