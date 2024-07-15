// background.js

chrome.webRequest.onBeforeRequest.addListener(
    function (details) {
      if (details.method === "POST" && details.requestBody) {
        const requestBody = details.requestBody.raw[0].bytes;
        const decoder = new TextDecoder("utf-8");
        const bodyString = decoder.decode(requestBody);
        
        if (bodyString.includes("query") || bodyString.includes("mutation")) {
          chrome.storage.local.get({ requests: [] }, function (data) {
            const requests = data.requests;
            requests.push({
              url: details.url,
              method: details.method,
              body: bodyString,
              timeStamp: details.timeStamp
            });
            chrome.storage.local.set({ requests: requests });
          });
        }
      }
    },
    { urls: ["<all_urls>"] },
    ["requestBody"]
  );
  