(function() {
  const open = XMLHttpRequest.prototype.open;
  const send = XMLHttpRequest.prototype.send;

  XMLHttpRequest.prototype.open = function(method, url) {
    this._url = url;
    open.apply(this, arguments);
  };

  XMLHttpRequest.prototype.send = function() {
    this.addEventListener('load', function() {
      const responseDetails = {
        url: this._url,
        status: this.status,
        responseText: this.responseText
      };

      chrome.storage.local.get({ responses: [] }, function(result) {
        const responses = result.responses;
        responses.push(responseDetails);
        chrome.storage.local.set({ responses: responses });
      });
    });

    send.apply(this, arguments);
  };
})();
