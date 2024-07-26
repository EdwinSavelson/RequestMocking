(function() {
    const XHR = XMLHttpRequest.prototype;
    const open = XHR.open;
    const send = XHR.send;
    const setRequestHeader = XHR.setRequestHeader;
  console.log("XHR REQUEST SENT");
    XHR.open = function() {
      console.log("AH");

      this._requestHeaders = {};
      return open.apply(this, arguments);
    };
  
    XHR.setRequestHeader = function(header, value) {
      this._requestHeaders[header] = value;
      return setRequestHeader.apply(this, arguments);
    };
  
    XHR.send = function() {

      this.addEventListener('load', function() {


        const url = this.responseURL;
        const responseHeaders = this.getAllResponseHeaders();
        try {
          if (this.responseType != 'blob') {
            let responseBody;
            if (this.responseType === '' || this.responseType === 'text') {
              responseBody = JSON.parse(this.responseText);
              console.log(responseBody);

            } else {
              responseBody = this.response;
            }
            const responseDetails = {
              url: url,
              responseHeaders: responseHeaders,
              responseBody: responseBody
            };
  
            chrome.storage.local.get({ responses: [] }, function(result) {
              const responses = result.responses;
              responses.push(responseDetails);
              chrome.storage.local.set({ responses: responses });
            });
          }
        } catch (err) {
          console.debug("Error reading or processing response.", err);
        }
      });
  
      return send.apply(this, arguments);
    };
  })();
  