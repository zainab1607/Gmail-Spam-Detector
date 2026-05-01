# Gmail-Spam-Detector
AI-powered Gmail phishing detector extension that scans email content, verifies senders, and flags suspicious or malicious emails.
Here is the professionally formatted **README.md** for your GitHub repository. This version is tailored specifically for your profile, highlighting your role in the project while maintaining all the technical and academic details.

# **Phishing Email Detector (AI-Based Chrome Extension)**

**Phishing Email Detector** is an AI-powered browser extension developed to identify and analyze suspicious emails directly within Gmail. It scans email content, verifies sender authenticity, and detects phishing attempts using an AI model to protect users from cyber threats such as phishing attacks, malicious links, and scam emails.



## **Project Description**
This project was developed as part of an **Information Security** course. The extension integrates with Gmail and performs the following automated tasks:
*   **Content Extraction**: Automatically extracts the email subject, sender, and body.
*   **AI Analysis**: Sends extracted data to the **Gemini AI** model for phishing and scam indicator analysis.
*   **Real-time Results**: Displays the security status (Scam/Phishing or Safe) directly on the Gmail interface.



## **Key Features**
*   **Real-time Email Scanning**: Instant analysis as the user opens an email.
*   **Sender Verification**: Checks for authenticity to prevent spoofing.
*   **Clean UI Notifications**: Integrated alerts inside Gmail with color indicators (Red for Scam, Green for Safe).
*   **AI-Based Analysis**: Leverages the power of Gemini for content evaluation.
*   **Automatic Sanitization**: Removes suspicious elements like links, images, and buttons before analysis to ensure safety.



## **Technical Implementation**

### **Technologies Used**
*   **Languages**: HTML, CSS, JavaScript
*   **AI Model**: Gemini
*   **API**: Gmail API
*   **Platform**: Google Chrome Extension

### **Code Logic (content.js)**
*   **getEmailContent()**: Extracts and cleans the subject, sender, and body of the email.
*   **displayScanResult()**: Dynamically updates the Gmail UI with color-coded results based on AI feedback.
*   **Message Listener**: Facilitates communication between the UI and the background scripts for AI analysis.



## **Installation Guide**
1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/phishing-email-detector.git
    ```
2.  Open **Chrome** and navigate to `chrome://extensions/`.
3.  Enable **Developer Mode** in the top right corner.
4.  Click **Load Unpacked** and select the project folder.
5.  Open Gmail to test the extension.



## **Information Security Framework**
This project adheres to the **CIA Triad**, the core pillars of Information Security:
*   **Confidentiality**: Protecting sensitive data from unauthorized access.
*   **Integrity**: Ensuring data accuracy and reliability.
*   **Availability**: Making data accessible when needed.


## **Research Paper Summary Integration**
The project also addresses challenges discussed in the research paper *"Digital Transformation in Energy Sector: Cybersecurity Challenges and Implications,"* which highlights:
*   Increased cyber risks from IoT and AI integration.
*   The impact of threats like ransomware on national security and economic stability.
*   The need for multi-layered security approaches and workforce training.




## **Conclusion**
This project demonstrates the effective use of AI in cybersecurity to provide real-time protection against phishing attacks, enhancing the overall security of daily email communicatiothe overall security of daily email communication.

