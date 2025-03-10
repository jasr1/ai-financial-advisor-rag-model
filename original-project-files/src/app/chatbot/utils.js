// // utils.js
// export const setChatbotSize = () => {
//   // Find the chatbot container
//   const chatbot = document.querySelector(
//     '.react-chatbot-kit-chat-inner-container'
//   );
//   if (chatbot) {
//     chatbot.style.width = '100vw';
//     chatbot.style.height = '93%'; // Full height
//     chatbot.style.maxHeight = '100%';
//     chatbot.style.position = 'fixed';
//     chatbot.style.marginTop = '7vh';
//     chatbot.style.top = '0';
//     chatbot.style.left = '0';
//     chatbot.style.zIndex = '1000';
//     chatbot.style.overflow = 'hidden'; // Prevents overflowing content

//     // Adjust the message container to start messages from the bottom
//     const messageContainer = chatbot.querySelector(
//       '.react-chatbot-kit-chat-message-container'
//     );
//     if (messageContainer) {
//       messageContainer.style.height = 'calc(100% - 60px)'; // Adjust height to fit above input
//       messageContainer.style.flexGrow = '1'; // Allows it to grow to fill the available space
//       messageContainer.style.overflowY = 'auto'; // Enables scrolling of messages
//       messageContainer.style.display = 'flex';
//       messageContainer.style.flexDirection = 'column'; // Keep messages ordered from oldest to newest
//       messageContainer.style.justifyContent = 'flex-end'; // Align messages to the bottom
//     }

//     // Adjust the input container
//     const botMessageContainer = chatbot.querySelector(
//       '.react-chatbot-kit-chat-bot-message-container'
//     );
//     const chatInput = botMessageContainer?.querySelector(
//       '.react-chatbot-kit-chat-input'
//     );
//     if (chatInput) {
//       chatInput.style.flexShrink = '0'; // Prevents input from shrinking
//       chatInput.style.height = '50px'; // Adjust height as needed
//       chatInput.style.width = '100%'; // Make input take full width of the container
//       chatInput.style.boxSizing = 'border-box'; // Include padding and border in width
//       chatInput.style.maxWidth = '100%'; // Prevent input from exceeding screen width
//       chatInput.style.position = 'fixed'; // Fix position to bottom
//       chatInput.style.bottom = '0';
//       chatInput.style.left = '0';
//       chatInput.style.zIndex = '1000'; // Make sure it's above the chat messages

//       // Add event listener to scroll to bottom on focus
//       chatInput.addEventListener('focus', () =>
//         setTimeout(scrollToBottom, 300)
//       );
//     }
//   }
// };

// // Function to scroll the chat to the bottom
// export const scrollToBottom = () => {
//   const messageContainer = document.querySelector(
//     '.react-chatbot-kit-chat-message-container'
//   );
//   if (messageContainer) {
//     messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the bottom
//   }
// };

// // Adjust size initially
// setChatbotSize();

// // Adjust size on window resize
// window.addEventListener('resize', setChatbotSize);

export const setChatbotSize = () => {
  const chatbot = document.querySelector(
    '.react-chatbot-kit-chat-inner-container'
  );
  if (chatbot) {
    chatbot.style.width = '100vw';
    chatbot.style.height = '93%'; // Full height
    chatbot.style.maxHeight = '100%';
    chatbot.style.position = 'fixed';
    chatbot.style.marginTop = '7vh';
    chatbot.style.top = '0';
    chatbot.style.left = '0';
    chatbot.style.zIndex = '1000';
    chatbot.style.overflow = 'hidden'; // Prevents overflowing content

    const messageContainer = chatbot.querySelector(
      '.react-chatbot-kit-chat-message-container'
    );
    if (messageContainer) {
      messageContainer.style.height = 'calc(100% - 60px)'; // Adjust height to fit above input
      messageContainer.style.flexGrow = '1'; // Allows it to grow to fill the available space
      messageContainer.style.overflowY = 'auto'; // Enables scrolling of messages
      messageContainer.style.display = 'flex';
      messageContainer.style.flexDirection = 'column'; // Keep messages ordered from oldest to newest
      messageContainer.style.justifyContent = 'flex-end'; // Align messages to the bottom
    }

    const botMessageContainer = chatbot.querySelector(
      '.react-chatbot-kit-chat-bot-message-container'
    );
    const chatInput = botMessageContainer?.querySelector(
      '.react-chatbot-kit-chat-input'
    );
    if (chatInput) {
      chatInput.style.flexShrink = '0'; // Prevents input from shrinking
      chatInput.style.width = '100%'; // Make input take full width of the container
      chatInput.style.boxSizing = 'border-box'; // Include padding and border in width
      chatInput.style.maxWidth = '100%'; // Prevent input from exceeding screen width
      chatInput.style.position = 'fixed'; // Fix position to bottom
      chatInput.style.bottom = '0';
      chatInput.style.left = '0';
      chatInput.style.zIndex = '1000'; // Make sure it's above the chat messages

      chatInput.addEventListener('input', autoResizeInput);
      chatInput.addEventListener('focus', () =>
        setTimeout(scrollToBottom, 300)
      );
    }
  }
};

// Function to dynamically resize the input field
export const autoResizeInput = event => {
  const input = event.target;
  input.style.height = 'auto';
  input.style.height = `${input.scrollHeight}px`;
};

// Function to scroll the chat to the bottom
export const scrollToBottom = () => {
  const messageContainer = document.querySelector(
    '.react-chatbot-kit-chat-message-container'
  );
  if (messageContainer) {
    messageContainer.scrollTop = messageContainer.scrollHeight; // Scroll to the bottom
  }
};

setChatbotSize();
window.addEventListener('resize', setChatbotSize);
