// content.js

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'resendRequests') {
      message.requests.forEach(request => {
        fetch(request.url, {
          method: request.method,
          headers: {
            'Content-Type': 'application/json',
            // Include any other headers needed
          },
          body: request.body
        })
        .then(response => response.json())
        .then(data => console.log('Request sent successfully:', data))
        .catch(error => console.error('Error sending request:', error));
      });
    }
  });
  