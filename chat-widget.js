// chat-widget.js
class KnowledgeWidget {
  constructor(webhookUrl) {
    this.webhookUrl = webhookUrl;
    this.init();
  }
  
  init() {
    // Создаём кнопку чата
    const btn = document.createElement('button');
    btn.innerHTML = '💬 Помощь';
    btn.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;padding:12px 20px;background:#007bff;color:white;border:none;border-radius:25px;cursor:pointer;';
    btn.onclick = () => this.toggleChat();
    document.body.appendChild(btn);
  }
  
  toggleChat() {
    if (document.getElementById('kb-chat')) {
      document.getElementById('kb-chat').remove();
      return;
    }
    
    const chat = document.createElement('div');
    chat.id = 'kb-chat';
    chat.style.cssText = 'position:fixed;bottom:70px;right:20px;width:320px;height:400px;background:white;border:1px solid #ddd;border-radius:10px;box-shadow:0 4px 12px rgba(0,0,0,0.15);display:flex;flex-direction:column;z-index:9999;';
    chat.innerHTML = `
      <div style="padding:12px;background:#007bff;color:white;border-radius:10px 10px 0 0;font-weight:bold;">Помощник</div>
      <div id="kb-messages" style="flex:1;padding:12px;overflow-y:auto;font-size:14px;"></div>
      <div style="padding:12px;border-top:1px solid #eee;display:flex;">
        <input id="kb-input" type="text" placeholder="Ваш вопрос..." style="flex:1;padding:8px;border:1px solid #ddd;border-radius:4px;"/>
        <button id="kb-send" style="margin-left:8px;padding:8px 16px;background:#007bff;color:white;border:none;border-radius:4px;cursor:pointer;">➤</button>
      </div>
    `;
    document.body.appendChild(chat);
    
    document.getElementById('kb-send').onclick = () => this.send();
    document.getElementById('kb-input').onkeypress = (e) => e.key === 'Enter' && this.send();
  }
  
  async send() {
    const input = document.getElementById('kb-input');
    const messages = document.getElementById('kb-messages');
    const question = input.value.trim();
    if (!question) return;
    
    // Показываем вопрос
    messages.innerHTML += `<div style="text-align:right;margin:4px 0;"><strong>Вы:</strong> ${question}</div>`;
    input.value = '';
    
    // Отправляем в n8n
    try {
      const response = await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ text: question })
      });
      const data = await response.json();
      messages.innerHTML += `<div style="margin:4px 0;color:#007bff;"><strong>Помощник:</strong> ${data.answer || data.output || 'Нет ответа'}</div>`;
      messages.scrollTop = messages.scrollHeight;
    } catch (err) {
      messages.innerHTML += `<div style="margin:4px 0;color:red;">Ошибка соединения</div>`;
    }
  }
}

// Инициализация (замените URL на ваш webhook)
document.addEventListener('DOMContentLoaded', () => {
  new KnowledgeWidget('https://ВАШ-n8n-сервер/webhook/kb');
});
