document.addEventListener('DOMContentLoaded', function() {
  chrome.storage.local.get({ responses: [] }, function(result) {
    const responses = result.responses;
    const responsesDiv = document.getElementById('responses');
    
    responses.forEach(function(response) {
      const responseDiv = document.createElement('div');
      responseDiv.className = 'response';
      
      const urlP = document.createElement('p');
      urlP.textContent = `URL: ${response.url}`;
      responseDiv.appendChild(urlP);
      
      const statusP = document.createElement('p');
      statusP.textContent = `Status: ${response.status}`;
      responseDiv.appendChild(statusP);
      
      const responseTextP = document.createElement('p');
      responseTextP.textContent = `Response: ${response.responseText}`;
      responseDiv.appendChild(responseTextP);
      
      responsesDiv.appendChild(responseDiv);
    });
  });
});
