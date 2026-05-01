// popup.js

document.addEventListener('DOMContentLoaded', () => {
    const scanButton = document.getElementById('scanButton');
    const buttonText = document.getElementById('buttonText');
    const statusMessage = document.getElementById('statusMessage');

    // Add a click listener to the scan button
    scanButton.addEventListener('click', async () => {
        // Show loading state
        buttonText.innerHTML = '<div class="loading-spinner"></div> Scanning...';
        scanButton.disabled = true;
        statusMessage.classList.add('hidden'); // Hide previous messages

        try {
            // Query for the active tab in the current window
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

            // Check if the current tab is a Gmail page
            if (tab.url && tab.url.startsWith('https://mail.google.com/')) {
                // Execute the content script in the active tab
                // The content script will then extract email content and send it to the background script
                await chrome.scripting.executeScript({
                    target: { tabId: tab.id },
                    files: ['content.js']
                });

                // Send a message to the content script to initiate the scan
                chrome.tabs.sendMessage(tab.id, { action: "scanEmail" });

                // Listen for messages from the content script (e.g., scan results or errors)
                // This listener is set up once and will handle responses
                const messageListener = (message) => {
                    if (message.action === "scanResult") {
                        statusMessage.textContent = `Result: ${message.result}`;
                        statusMessage.classList.remove('hidden');
                        // Remove the listener after receiving the result to prevent multiple calls
                        chrome.runtime.onMessage.removeListener(messageListener);
                    } else if (message.action === "scanError") {
                        statusMessage.textContent = `Error: ${message.error}`;
                        statusMessage.classList.remove('hidden');
                        chrome.runtime.onMessage.removeListener(messageListener);
                    }
                    // Reset button state after receiving any response
                    buttonText.textContent = 'Scan Open Email';
                    scanButton.disabled = false;
                };
                chrome.runtime.onMessage.addListener(messageListener);

            } else {
                // If not on a Gmail page, display an error message
                statusMessage.textContent = "Please navigate to Gmail to scan an email.";
                statusMessage.classList.remove('hidden');
                buttonText.textContent = 'Scan Open Email';
                scanButton.disabled = false;
            }
        } catch (error) {
            // Handle any errors during script execution or tab querying
            console.error("Error in popup.js:", error);
            statusMessage.textContent = `An unexpected error occurred: ${error.message}`;
            statusMessage.classList.remove('hidden');
            buttonText.textContent = 'Scan Open Email';
            scanButton.disabled = false;
        }
    });
});
