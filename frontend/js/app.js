// Simple vanilla JS page navigation system
function showPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page-section');
    pages.forEach(page => {
        page.style.display = 'none';
        page.classList.remove('active');
    });

    // Show target page
    const target = document.getElementById(pageId);
    if(target) {
        target.style.display = 'block';
        // Add a small delay for animation if we add one later
        setTimeout(() => target.classList.add('active'), 10);
    }
}

// Mock AI Chatbot interaction
window.sendAIMessage = function() {
    const input = document.getElementById('ai-chat-input');
    const msg = input.value.trim();
    if (!msg) return;

    const history = document.getElementById('ai-chat-history');
    
    // Append user message
    const userBubble = document.createElement('div');
    userBubble.style.textAlign = 'right';
    userBubble.style.margin = '10px 0';
    userBubble.innerHTML = `<div style="display:inline-block; padding:10px 16px; background:var(--blush-pink); border-radius:14px 14px 0 14px; color:var(--text-dark);">${msg}</div>`;
    history.appendChild(userBubble);
    
    input.value = '';
    history.scrollTop = history.scrollHeight;

    // Mock AI response
    setTimeout(() => {
        const aiBubble = document.createElement('div');
        aiBubble.style.textAlign = 'left';
        aiBubble.style.margin = '10px 0';
        aiBubble.innerHTML = `<div style="display:inline-block; padding:10px 16px; background:white; border-radius:14px 14px 14px 0; color:var(--text-dark); box-shadow: 0 2px 5px rgba(0,0,0,0.05); max-width:80%;">
        That sounds overwhelming. You’re handling a lot right now. <br>Would you like to schedule some personal time or join a nearby support circle meetup?</div>`;
        history.appendChild(aiBubble);
        history.scrollTop = history.scrollHeight;
    }, 1000);
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // We could fetch initial data from our FastAPI backend here
    console.log("SheCircle Frontend Initialized");
});
