document.getElementById('quote-form').addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent the default form submission
    
    const quoteId = document.getElementById('quote_id').value; // Get the quote ID from the input field
    if (quoteId) {
      // Update the action to include the quote_id
      this.action = `/quotes/response/${quoteId}`;
      this.submit(); // Submit the form with the updated action
    } else {
      alert('Please enter a valid Quote ID.');
    }
  });
  