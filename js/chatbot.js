// ========== CHATBOT FUNCTIONS ==========
function toggleChat() {
    const win = document.getElementById('chat-window');
    win.style.display = win.style.display === 'none' ? 'flex' : 'none';
}

async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const message = input.value.trim();
    if (!message) return;

    const messagesDiv = document.getElementById('chat-messages');

    // Add user message to UI
    messagesDiv.innerHTML += `<div style="background:#C6A43F; color:white; padding:0.8rem; border-radius:10px; max-width:80%; align-self:flex-end; word-wrap:break-word;">${message}</div>`;
    input.value = '';
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
        // ⚠️ Make sure the port is 5001 to match your backend!
        const response = await fetch('http://localhost:5001/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        });
        
        const data = await response.json();

        // Add bot reply to UI
        messagesDiv.innerHTML += `<div style="background:white; padding:0.8rem; border-radius:10px; max-width:80%; align-self:flex-start; box-shadow:0 2px 5px rgba(0,0,0,0.05); word-wrap:break-word;">${data.reply}</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    } catch (error) {
        console.error("Chat error:", error);
        messagesDiv.innerHTML += `<div style="color:red; font-size:0.8rem; text-align:center; width:100%;">Error: Could not reach the AI server. Make sure your backend is running.</div>`;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }
}