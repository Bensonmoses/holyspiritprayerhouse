(async function () {
    try {
        console.log("🔹 Initializing Web Chat...");

        // ✅ Fetch Direct Line Token from Secure Backend API
        const response = await fetch("/api/chatbot/token");

        if (!response.ok) {
            throw new Error(`❌ Failed to fetch Direct Line token. Status: ${response.status}`);
        }

        const { token } = await response.json();
        console.log("✅ Direct Line Token fetched successfully.");

        // ✅ Ensure WebChat Container Exists
        const chatContainer = document.getElementById("webchat-container");
        if (!chatContainer) {
            throw new Error("⚠ Chatbot container (webchat-container) not found in HTML.");
        }

        // ✅ Prevent Multiple Chatbot Renders
        if (chatContainer.hasChildNodes()) {
            console.warn("Chatbot is already initialized.");
            return;
        }

        // ✅ Check if WebChat Library is Loaded
        if (!window.WebChat) {
            throw new Error("⚠ WebChat library is not loaded.");
        }

        // ✅ Render WebChat
        window.WebChat.renderWebChat({
            directLine: window.WebChat.createDirectLine({ token }),
            userID: "User123",
            username: "Guest",
            locale: "en-US",
            styleOptions: {
                hideUploadButton: true,
                botAvatarImage: "images/bot-avatar.png",
                userAvatarImage: "images/user-avatar.png",
                backgroundColor: "#ffffff",
                bubbleBackground: "#f1f1f1",
                bubbleBorderRadius: 10
            }
        }, chatContainer);

        console.log("✅ Chatbot successfully initialized.");

        // ✅ Toggle Chatbot Visibility
        const chatbotToggle = document.getElementById("chatbot-toggle");
        if (chatbotToggle) {
            chatbotToggle.addEventListener("click", function () {
                chatContainer.style.display = chatContainer.style.display === "none" ? "block" : "none";
                console.log("🔹 Chatbot toggled.");
            });

            // ✅ Keyboard Accessibility
            chatbotToggle.addEventListener("keydown", function (event) {
                if (event.key === "Enter" || event.keyCode === 13) {
                    chatContainer.style.display = chatContainer.style.display === "none" ? "block" : "none";
                }
            });
        }

    } catch (error) {
        console.error("❌ Web Chat Error:", error);
        alert("⚠ Chatbot failed to load. Check console for details.");
    }
})();
