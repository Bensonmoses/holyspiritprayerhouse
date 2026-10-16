document.addEventListener("DOMContentLoaded", function () {
    const chatbotToggle = document.getElementById("chatbot-toggle");
    const chatbotPopup = document.getElementById("chatbot-popup");
    const closeChatbot = document.getElementById("close-chatbot");
    const chatbotIframe = chatbotPopup.querySelector("iframe");

    chatbotToggle.addEventListener("click", function () {
        chatbotPopup.classList.add("active");

        // Ensure iframe reloads when chatbot opens
        chatbotIframe.src = chatbotIframe.src;

        chatbotPopup.style.display = "block";
        chatbotToggle.style.opacity = "0";
        chatbotToggle.style.pointerEvents = "none";
    });

    closeChatbot.addEventListener("click", function () {
        chatbotPopup.classList.remove("active");

        setTimeout(() => {
            chatbotPopup.style.display = "none";
            chatbotToggle.style.opacity = "1";
            chatbotToggle.style.pointerEvents = "auto";
        }, 300);
    });
});
