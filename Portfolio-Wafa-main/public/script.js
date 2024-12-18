$(document).ready(function() {
    let $scrollToTopBtn = $('#scrollToTopBtn');
    
    // Show the button when scrolling down
    $(window).scroll(function() {
        if ($(document).scrollTop() > 100) {
            $scrollToTopBtn.fadeIn();
        } else {
            $scrollToTopBtn.fadeOut();
        }
    });

    // Scroll to the top when the button is clicked
    $scrollToTopBtn.click(function() {
        $('html, body').animate({ scrollTop: 0 }, 'smooth');  // Use 'smooth' for smooth scroll
    });

    // Contact Form Validation
    $('#contact-form').submit(function(e) {
        let name = $('#name').val();
        let email = $('#email').val();
        let message = $('#message').val();
        let emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

        if (!name || !email || !message) {
            alert('Please fill in all the fields.');
            e.preventDefault();  // Prevent form submission if validation fails
        } else if (!emailPattern.test(email)) {
            alert('Please enter a valid email address.');
            e.preventDefault();  // Prevent form submission if email is invalid
        }
    });
});
