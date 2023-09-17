const chatToggleButton = document.getElementById('chat-toggle-button');
const chatIframe = document.getElementById('chat-iframe');

let chatOpen = false;

chatToggleButton.addEventListener('click', () => {
  if (chatOpen) {
    chatIframe.style.display = 'none';
    chatOpen = false;
  } else {
    chatIframe.style.display = 'block';
    chatOpen = true;
  }
});
