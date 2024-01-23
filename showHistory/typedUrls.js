function onAnchorClick(event) {
  chrome.scripting.executeScript({
    target: { tabId: event.tabId },
    function: (href) => {
      window.location.href = href;
    },
    args: [event.srcElement.href],
  });
}

// Given an array of URLs, build a DOM list of those URLs in the browser action popup.
function buildPopupDom(divName, data) {
  var popupDiv = document.getElementById(divName);

  var ul = document.createElement('ul');
  popupDiv.appendChild(ul);

  for (var i = 0, ie = data.length; i < ie; ++i) {
    var a = document.createElement('a');
    a.href = data[i];
    a.appendChild(document.createTextNode(data[i]));
    a.addEventListener('click', onAnchorClick);

    var li = document.createElement('li');
    li.appendChild(a);

    ul.appendChild(li);
  }
}

// Search history to find up to ten links that a user has typed in and show those links in a popup.
function buildTypedUrlList(divName) {
  // To look for history items visited in the last week, subtract a week of microseconds from the current time.
  var microsecondsPerWeek = 1000 * 60 * 60 * 24 * 7;
  var oneWeekAgo = Date.now() - microsecondsPerWeek;

  // Track the number of callbacks from chrome.history.getVisits() that we expect to get. When it reaches zero, we have all results.
  var numRequestsOutstanding = 0;

  chrome.history.search({
    text: '', // Return every history item....
    startTime: oneWeekAgo,
    maxResults: 100 // that was accessed less than one week ago.
  },
  function (historyItems) {
    // For each history item, get details on all visits.
    for (var i = 0; i < historyItems.length; ++i) {
      var url = historyItems[i].url;
      var processVisitsWithUrl = function (url) {
        // We need the URL of the visited item to process the visit.
        // Use a closure to bind the URL into the callback's args.
        return function (visitItems) {
          processVisits(url, visitItems);
        };
      };
      chrome.history.getVisits({ url: url }, processVisitsWithUrl(url));
      numRequestsOutstanding++;
    }
    if (!numRequestsOutstanding) {
      onAllVisitsProcessed();
    }
  });

  // Maps URLs to a count of the number of times the user typed that URL into the omnibox.
  var urlToCount = {};

  // Callback for chrome.history.getVisits(). Counts the number of times a user visited a URL by typing the address.
  var processVisits = function (url, visitItems) {
    for (var i = 0, ie = visitItems.length; i < ie; ++i) {
      // Ignore items unless the user typed the URL.
      if (visitItems[i].transition != 'typed') {
        continue;
      }

      if (!urlToCount[url]) {
        urlToCount[url] = 0;
      }

      urlToCount[url]++;
    }

    // If this is the final outstanding call to processVisits(), then we have the final results. Use them to build the list of URLs to show in the popup.
    if (!--numRequestsOutstanding) {
      onAllVisitsProcessed();
    }
  };

  // This function is called when we have the final list of URLs to display.
  var onAllVisitsProcessed = function () {
    // Get the top scoring URLs.
    var urlArray = [];
    for (var url in urlToCount) {
      urlArray.push(url);
    }

    // Sort the URLs by the number of times the user typed them.
    urlArray.sort(function (a, b) {
      return urlToCount[b] - urlToCount[a];
    });

    buildPopupDom(divName, urlArray.slice(0, 10));
  };
}

document.addEventListener('DOMContentLoaded', function () {
  buildTypedUrlList('typedUrl_div');
});
