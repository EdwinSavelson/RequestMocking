(function (xhr) {

    // Save references to the original XMLHttpRequest methods
    var XHR = XMLHttpRequest.prototype;
    var open = XHR.open;
    var send = XHR.send;
    var setRequestHeader = XHR.setRequestHeader;

    // Override the open method
    XHR.open = function (method, url) {
        this._method = method; // Store the method (GET, POST, etc.)
        this._url = url; // Store the URL
        this._requestHeaders = {}; // Initialize an object to store request headers
        this._startTime = (new Date()).toISOString(); // Store the start time of the request

        return open.apply(this, arguments); // Call the original open method with the provided arguments
    };

    // Override the setRequestHeader method
    XHR.setRequestHeader = function (header, value) {
        this._requestHeaders[header] = value; // Store the request header and its value
        return setRequestHeader.apply(this, arguments); // Call the original setRequestHeader method
    };

    // Override the send method
    XHR.send = function (postData) {
        var _this = this; // Reference to the current XMLHttpRequest instance

        // Function to set up a proxy to modify responseText and response
        var setProxy = function (callback) {
            var originalResponseText = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'responseText');
            var originalResponse = Object.getOwnPropertyDescriptor(XMLHttpRequest.prototype, 'response');

            // Override the responseText property
            Object.defineProperty(_this, 'responseText', {
                get: function () {
                    return callback(originalResponseText.get.call(_this)); // Call the callback with the original responseText
                }
            });

            // Override the response property
            Object.defineProperty(_this, 'response', {
                get: function () {
                    return callback(originalResponse.get.call(_this)); // Call the callback with the original response
                }
            });
        };

        // Set up the proxy with a callback function to modify the response
        setProxy(function (response) {
            if (_this.responseType === '' || _this.responseType === 'text') {
                // Modify the response text here
                var responseBody = JSON.parse(response);
                responseBody.modified = true; // Example modification

                console.log("BODY", responseBody);
                return JSON.stringify(responseBody); // Return the modified response body

            }
            return response; // Return the original response if responseType is not text
        });

        // Add an event listener for the 'load' event
        this.addEventListener('load', function () {
            var endTime = (new Date()).toISOString(); // Store the end time of the request

            var myUrl = _this._url ? _this._url.toLowerCase() : _this._url; // Get the URL
            if (myUrl) {

                if (postData) {
                    if (typeof postData === 'string') {
                        try {
                            // Store the request headers as JSON if postData is a string
                            _this._requestHeaders = postData;
                        } catch (err) {
                            console.log('Request Header JSON decode failed, transfer_encoding field could be base64');
                            console.log(err);
                        }
                    } else if (typeof postData === 'object' || typeof postData === 'array' || typeof postData === 'number' || typeof postData === 'boolean') {
                        // Handle other types of postData if needed
                    }
                }

                // Get the response headers
                var responseHeaders = _this.getAllResponseHeaders();

                if (_this.responseType != 'blob' && _this.responseText) {
                    // If responseType is not blob and responseText is not null
                    try {
                        // Print URL, request headers, response headers, and modified response body to the console
                        console.log(_this._url);
                        console.log(JSON.parse(_this._requestHeaders));
                        console.log(responseHeaders);
                        console.log(JSON.parse(_this.responseText));

                    } catch (err) {
                        console.log("Error in responseType try catch");
                        console.log(err);
                    }
                }

            }
        });
        return send.apply(this, arguments); // Call the original send method with the provided arguments
    };

})(XMLHttpRequest);
