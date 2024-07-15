// popup.js

document.addEventListener("DOMContentLoaded", function () {
    const requestsDiv = document.getElementById("requests");
  
    function renderRequests(requests) {
      requestsDiv.innerHTML = '';
      requests.forEach((request, index) => {
        const prettyBody = JSON.stringify(JSON.parse(request.body), null, 2);
        const requestDiv = document.createElement("div");
        requestDiv.className = "request";
        requestDiv.innerHTML = `
          <strong>URL:</strong> ${request.url}<br>
          <strong>Method:</strong> ${request.method}<br>
          <strong>Time:</strong> ${new Date(request.timeStamp).toLocaleString()}<br>
          <strong>Body:</strong> 
          <textarea id="body-${index}">${prettyBody}</textarea><br>
          <button id="save-${index}">Save</button>
        `;
        requestsDiv.appendChild(requestDiv);
  
        document.getElementById(`save-${index}`).addEventListener('click', () => {
          const updatedBody = document.getElementById(`body-${index}`).value;
          try {
            JSON.parse(updatedBody); // validate JSON
            requests[index].body = updatedBody;
            chrome.storage.local.set({ requests: requests }, function() {
              alert('Request body updated!');
            });
          } catch (e) {
            alert('Invalid JSON format!');
          }
        });
      });
    }
  
    chrome.storage.local.get({ requests: [] }, function (data) {
      renderRequests(data.requests);
    });
  });
  