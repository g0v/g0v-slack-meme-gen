// Styles for different meme templates
const MEME_STYLES = {
  classic: {
    content: ({ messageTime, content, avatar, userName, channelName }) => `
      <div class="popup-content border-to-show" style="display:flex; flex-direction:column; max-height:70vh; overflow-y:auto; padding:20px; width:300px; border-radius:10px;">
        <div class="meme-time" style="text-align:end;">${messageTime}</div>
        <div class="popup-meme" style="padding:5vh 0;">
          <div class="popup-quot" style="font-size:5vh">“</div>
          <p class="meme-content" style="padding:3vh; word-break:break-word;">${content}</p>
          <div class="popup-quot" style="text-align:end; font-size:5vh">”</div>
        </div>
        <div class="popup-footer" style="display:flex; align-items:center;">
          <img class="popup-avatar" src="${avatar}" style="width:45px; height:45px; object-fit:cover; border-radius:50%;">
          <div class="popup-userName" style="display:flex; flex-direction:column; margin-left:5%;">
            <div style="font-size:small">@g0v Slack #${channelName}</div>
            <div style="font-size:large"><strong>${userName}</strong></div>
          </div>
        </div>
      </div>
    `
  },
  black: {
    content: ({ messageTime, content, avatar, userName, channelName }) => `
      <div class="popup-content border-to-show" style="display:flex; flex-direction:column; max-height:70vh; overflow-y:auto; padding:20px; width:auto; max-width:600px; background-color:black; color:white;">
        <div class="meme-time" style="display:flex; justify-content:end;">${messageTime}</div>
        <div class="popup-meme" style="display:flex; padding:5vh 0; justify-content:space-between;">
          <img class="popup-avatar" src="${avatar}" style="width:100px; height:100px; object-fit:cover;">
          <div class="popup-userName" style="display:flex; flex-direction:column; margin-left:5%;">
            <p class="meme-content" style="padding:3vh; word-break:break-word; min-width:400px">${content}</p>
            <div style="font-size:small; text-align:end;">@g0v Slack #${channelName}</div>
            <div style="font-size:large; text-align:end;"><strong>${userName}</strong></div>
          </div>
        </div>
      </div>
    `
  }
};

// Extract message data from row
function getMessageData(row) {
  return {
    avatar: row.querySelector('.avatar img')?.src || '',
    content: row.querySelector('.content > div:nth-of-type(2)')?.textContent || '',
    userName: row.querySelector('.content > div:nth-of-type(1) > .user-name')?.textContent || '',
    messageTime: row.querySelector('.content > div:nth-of-type(1) > .message-time')?.textContent || '',
    channelName: document.querySelector('h1')?.textContent || ''
  };
}

// Create and show popup
function showPopup(row, style = 'classic') {
  const existingPopup = document.querySelector('.custom-popup');
  if (existingPopup) existingPopup.remove();

  const popup = document.createElement('div');
  popup.className = 'custom-popup';
  
  const messageData = getMessageData(row);
  
  popup.innerHTML = `
    <div class="popup-header">
      <button class="close-button">&times;</button>
      <div class="style-button-group">
        <button class="my-button style-classic-button">經典</button>
        <button class="my-button style-black-button">黑底</button>
        <button id="save-image" class="my-button save-button row-action-button">儲存圖片</button>
      </div>
    </div>
    ${MEME_STYLES[style].content(messageData)}
  `;

  // Setup event listeners
  popup.querySelector('.close-button').onclick = () => popup.remove();
  popup.querySelector('.style-classic-button').onclick = () => showPopup(row, 'classic');
  popup.querySelector('.style-black-button').onclick = () => showPopup(row, 'black');
  popup.querySelector('#save-image').onclick = () => {
    html2canvas(popup.querySelector('.popup-content'), {
      scale: 2,
      allowTaint: true,
      useCORS: true,
      logging: true
    }).then(canvas => {
      const link = document.createElement('a');
      link.download = `g0v-meme-${messageData.userName}-${messageData.channelName}-${messageData.messageTime}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    });
  };

  // Convert avatar to base64
  chrome.runtime.sendMessage(
    { type: 'getBase64Image', imageUrl: messageData.avatar },
    response => {
      const avatarImg = popup.querySelector('.popup-avatar');
      avatarImg.src = response.success ? response.base64Data : messageData.avatar;
    }
  );

  document.body.appendChild(popup);
}

// Add meme generation buttons to messages
function addButtonsToRows() {
  const rows = [
    ...document.querySelectorAll('.message'),
    ...document.querySelectorAll('.message > .content > div[style="padding-top: 5px"]')
  ];

  rows.forEach(row => {
    const button = document.createElement('button');
    button.className = 'my-button row-action-button';
    button.textContent = 'meme gen!';
    button.onclick = (e) => {
      e.stopPropagation();
      showPopup(row);
    };

    const buttonContainer = document.createElement('div');
    buttonContainer.style.cssText = 'display:inline-block; margin-bottom:16px;';
    buttonContainer.appendChild(button);
    row.appendChild(buttonContainer);
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', addButtonsToRows);
addButtonsToRows();
