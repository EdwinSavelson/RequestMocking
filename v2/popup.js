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
      
      const headersP = document.createElement('p');
      headersP.textContent = `Headers: ${response.responseHeaders}`;
      responseDiv.appendChild(headersP);
      
      const responseBodyP = document.createElement('p');
      responseBodyP.textContent = `Response: ${JSON.stringify(response.responseBody, null, 2)}`;
      responseDiv.appendChild(responseBodyP);
      
      responsesDiv.appendChild(responseDiv);
    });
  });
});
