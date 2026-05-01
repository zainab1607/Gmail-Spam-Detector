// content.js

// Function to extract the email content from the currently open email
function getEmailContent() {
    let emailBody = '';
    let emailSubject = '';
    let emailSender = '';

    // Attempt to find the email subject
    // Gmail's subject line often has 'h2' or 'h1' tags within a specific class
    const subjectElement = document.querySelector('h2.hP'); // Common selector for subject
    if (subjectElement) {
        emailSubject = subjectElement.textContent.trim();
    } else {
        // Fallback for other potential subject elements
        const fallbackSubject = document.querySelector('div.nH.hC > div.nH > div.nH > div.nH > div.hP');
        if (fallbackSubject) {
            emailSubject = fallbackSubject.textContent.trim();
        }
    }

    // Attempt to find the email sender
    // The sender is often in a span with 'go' class, or a div with 'gD'
    const senderElement = document.querySelector('span.go, div.gD');
    if (senderElement) {
        emailSender = senderElement.getAttribute('email') || senderElement.textContent.trim();
    }

    // Attempt to find the main email body
    // Gmail's email body is usually within a div with class 'nH' and 'aY' or similar,
    // often inside a 'div.nH.aY' or 'div.nH.aY.V8' or 'div.a3s'
    const emailBodyContainer = document.querySelector('div.nH.aY, div.nH.aY.V8, div.a3s.aiL');
    if (emailBodyContainer) {
        // Clone the element to remove interactive parts like links or buttons
        // This helps in getting a cleaner text for analysis
        const clonedBody = emailBodyContainer.cloneNode(true);

        // Remove common interactive elements or signatures that might skew results
        clonedBody.querySelectorAll('a, button, img, .gmail_signature').forEach(el => el.remove());

        emailBody = clonedBody.innerText.trim();
    } else {
        // Fallback for other potential body elements
        const fallbackBody = document.querySelector('div[role="listitem"] > div > div > div > div > div > div > div > div > div.nH > div.nH.aY');
        if (fallbackBody) {
            const clonedBody = fallbackBody.cloneNode(true);
            clonedBody.querySelectorAll('a, button, img, .gmail_signature').forEach(el => el.remove());
            emailBody = clonedBody.innerText.trim();
        }
    }

    if (!emailBody && !emailSubject && !emailSender) {
        console.warn("Could not find email content. Ensure an email is open and the DOM structure is as expected.");
        return null;
    }

    return {
        subject: emailSubject,
        sender: emailSender,
        body: emailBody
    };
}

// Function to display the scan result on the Gmail page
function displayScanResult(result, isScam) {
    // Remove any existing result display to avoid duplicates
    const existingResultDiv = document.getElementById('scam-detector-result');
    if (existingResultDiv) {
        existingResultDiv.remove();
    }

    // Create a new div element for the result
    const resultDiv = document.createElement('div');
    resultDiv.id = 'scam-detector-result';
    resultDiv.style.cssText = `
        position: fixed;
        top: 10px;
        right: 10px;
        background-color: ${isScam ? '#fee2e2' : '#d1fae5'}; /* Tailwind red-100 or green-100 */
        color: ${isScam ? '#991b1b' : '#065f46'}; /* Tailwind red-800 or green-800 */
        border: 1px solid ${isScam ? '#f87171' : '#34d399'}; /* Tailwind red-400 or green-400 */
        padding: 12px 20px;
        border-radius: 8px;
        font-family: "Inter", sans-serif;
        font-size: 1rem;
        font-weight: 600;
        z-index: 10000; /* Ensure it's on top */
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 350px;
        word-wrap: break-word;
        text-align: left;
    `;

    const icon = document.createElement('span');
    icon.innerHTML = isScam ? '&#x26A0;&#xFE0F;' : '&#x2705;'; // Warning sign or Checkmark
    icon.style.fontSize = '1.5rem';

    const textSpan = document.createElement('span');
    textSpan.textContent = result;

    resultDiv.appendChild(icon);
    resultDiv.appendChild(textSpan);

    document.body.appendChild(resultDiv);

    // Automatically remove the message after a few seconds
    setTimeout(() => {
        if (resultDiv.parentNode) {
            resultDiv.remove();
        }
    }, 10000); // Display for 10 seconds
}

// Listen for messages from the popup script
chrome.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
    if (request.action === "scanEmail") {
        const emailData = getEmailContent();

        if (emailData && (emailData.body || emailData.subject)) {
            // Send the extracted email content to the background script for AI analysis
            chrome.runtime.sendMessage({ action: "analyzeEmail", email: emailData }, (response) => {
                if (response && response.action === "analysisResult") {
                    // Display the result received from the background script
                    const isScam = response.result.toLowerCase().includes('scam') || response.result.toLowerCase().includes('phishing');
                    displayScanResult(response.result, isScam);
                    // Also send back to popup for status message
                    chrome.runtime.sendMessage({ action: "scanResult", result: response.result });
                } else if (response && response.action === "analysisError") {
                    console.error("Error during analysis:", response.error);
                    displayScanResult(`Error: ${response.error}`, true); // Display error as a warning
                    chrome.runtime.sendMessage({ action: "scanError", error: response.error });
                }
            });
        } else {
            const errorMessage = "Could not find an open email or its content. Please ensure an email is open in Gmail.";
            console.warn(errorMessage);
            displayScanResult(errorMessage, true); // Display error as a warning
            chrome.runtime.sendMessage({ action: "scanError", error: errorMessage });
        }
    }
});
