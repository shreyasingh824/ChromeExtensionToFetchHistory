# Typed URL History Chrome Extension
# Overview
The "Typed URL History" Chrome extension is a simple tool that reads your browsing history and displays the top ten pages you frequently visit by typing the URL. This extension provides a convenient way to quickly access your most frequently typed URLs.

# Installation
To install the extension, follow these steps:

Download the extension files to your computer.

Open Google Chrome and go to the "Extensions" page by clicking on the three dots in the top-right corner, selecting "More tools," and then choosing "Extensions."

Enable "Developer mode" by toggling the switch in the top-right corner.

Click on the "Load unpacked" button and select the folder containing the extension files.

The "Typed URL History" extension should now be added to your Chrome browser.

# How it Works
The extension uses the Chrome Extension Manifest version 3 and requests the following permissions:

activeTab: Allows the extension to interact with the currently active tab.
history: Grants access to the browsing history to analyze typed URLs.
The main components of the extension include:

Popup Interface (typedUrls.html):

Displays the top ten recently typed URLs.
Clicking on a URL opens the corresponding page.
Script (typedUrls.js):

Handles the logic for retrieving and processing browsing history.
Counts the number of times a user typed each URL.
Builds and sorts a list of URLs based on usage frequency.
