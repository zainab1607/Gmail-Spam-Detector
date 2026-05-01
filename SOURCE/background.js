// background.js

// Listen for messages from the content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "analyzeEmail") {
        const email = request.email;
        analyzeEmailWithAI(email)
            .then(result => {
                // Send the analysis result back to the content script
                sendResponse({ action: "analysisResult", result: result });
            })
            .catch(error => {
                console.error("Error analyzing email with AI:", error);
                // Send an error message back to the content script
                sendResponse({ action: "analysisError", error: error.message || "Failed to analyze email." });
            });
        // Return true to indicate that sendResponse will be called asynchronously
        return true;
    }
});

/**
 * Function to call the Gemini API for email scam detection.
 * NOTE: For security, do not hardcode your API key when pushing to GitHub.
 */
async function analyzeEmailWithAI(emailData) {
    const prompt = `Analyze the following email for potential scam or phishing indicators. Look for suspicious links, urgent requests, unusual sender addresses, generic greetings, grammatical errors, and requests for personal information.
    
    Email Subject: "${emailData.subject}"
    Email Sender: "${emailData.sender}"
    Email Body:
    "${emailData.body}"
    
    Based on your analysis, classify this email as "Scam" or "Legitimate". Provide a brief reason for your classification. And only Reply in short Brief reply with a scam or not with the part that is likely a scam
    RETURN THE REPLY IN PLAIN TEXT
    `;

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    const payload = {
        contents: chatHistory,
        generationConfig: {
            temperature: 0.2,
            topP: 0.95,
            topK: 40,
            maxOutputTokens: 200
        }
    };

    // IMPORTANT: Replace the string below with your actual API key for local testing.
    // Do not commit your real key to a public repository!
    const apiKey = "YOUR_GEMINI_API_KEY_HERE"; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorBody = await response.json();
            console.error("API Error Response:", errorBody);
            throw new Error(`API request failed with status ${response.status}: ${errorBody.error.message || 'Unknown error'}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            return text; // Return the AI's classification and reason
        } else {
            console.warn("Unexpected API response structure:", result);
            throw new Error("AI response was empty or malformed.");
        }
    } catch (error) {
        console.error("Error during AI analysis:", error);
        throw error; 
    }
}