// Simple vanilla JS page navigation system
function showPage(pageId) {
    const pages = document.querySelectorAll('.page-section');

    pages.forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });

    const target = document.getElementById(pageId);

    if (target) {
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);
    }
}


// Send AI Message
window.sendAIMessage = function () {

    const input = document.getElementById('ai-chat-input');
    const msg = input.value.trim();

    if (!msg) return;

    const history = document.getElementById('ai-chat-history');

    // USER MESSAGE
    const userBubble = document.createElement('div');
    userBubble.style.textAlign = 'right';
    userBubble.style.margin = '10px 0';

    userBubble.innerHTML = `
        <div style="display:inline-block;padding:10px 16px;background:var(--blush-pink);border-radius:14px 14px 0 14px;color:var(--text-dark);max-width:80%;">
            ${msg}
        </div>
    `;

    history.appendChild(userBubble);

    input.value = '';
    history.scrollTop = history.scrollHeight;


    // AI TYPING INDICATOR
    const typingBubble = document.createElement('div');
    typingBubble.style.textAlign = 'left';
    typingBubble.style.margin = '10px 0';

    typingBubble.innerHTML = `
        <div style="display:inline-block;padding:10px 16px;background:white;border-radius:14px 14px 14px 0;box-shadow:0 2px 5px rgba(0,0,0,0.05);">
            SheCircle AI is typing...
        </div>
    `;

    history.appendChild(typingBubble);
    history.scrollTop = history.scrollHeight;


    // CALL FASTAPI BACKEND
    fetch("http://127.0.0.1:8000/api/ai/support", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: msg
        })
    })
        .then(res => res.json())
        .then(data => {

            history.removeChild(typingBubble);

            const aiBubble = document.createElement('div');
            aiBubble.style.textAlign = 'left';
            aiBubble.style.margin = '10px 0';

            aiBubble.innerHTML = `
            <div style="display:inline-block;padding:10px 16px;background:white;border-radius:14px 14px 14px 0;color:var(--text-dark);box-shadow:0 2px 5px rgba(0,0,0,0.05);max-width:80%;">
                ${data.reply}
            </div>
        `;

            history.appendChild(aiBubble);
            history.scrollTop = history.scrollHeight;

        })
        .catch(err => {

            history.removeChild(typingBubble);

            const errorBubble = document.createElement('div');
            errorBubble.style.textAlign = 'left';
            errorBubble.style.margin = '10px 0';

            errorBubble.innerHTML = `
            <div style="display:inline-block;padding:10px 16px;background:#ffe5e5;border-radius:14px;color:#a33;">
                Sorry, something went wrong. Please try again.
            </div>
        `;

            history.appendChild(errorBubble);

            console.error("Chat error:", err);
        });

};


// Send message with ENTER key
document.addEventListener('DOMContentLoaded', () => {

    console.log("SheCircle Frontend Initialized");

    const input = document.getElementById("ai-chat-input");

    if (input) {
        input.addEventListener("keypress", function (e) {
            if (e.key === "Enter") {
                window.sendAIMessage();
            }
        });
    }

});
