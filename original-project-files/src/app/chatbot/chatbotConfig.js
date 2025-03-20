import { createChatBotMessage } from 'react-chatbot-kit';
import React, { forwardRef } from 'react';

const CustomInput = forwardRef((props, ref) => (
  <textarea
    ref={ref}
    className="react-chatbot-kit-chat-input"
    placeholder="Type a message..."
    value={props.inputText}
    onChange={props.handleInputChange}
    onKeyPress={props.handleInputKeyPress}
  />
));

CustomInput.displayName = 'CustomInput';

const chatbotConfig = {
  botName: 'MyBot',
  initialMessages: [createChatBotMessage('Hi! How can I help you today?')],
  // Add more configuration options here...
  customComponents: {
    // customInput: CustomInput,
    customInput: props => <CustomInput {...props} />,
  },
};

export default chatbotConfig;

// import { createChatBotMessage } from 'react-chatbot-kit';
// import React, { forwardRef } from 'react';
// // import ActionProvider from './actionProvider';
// // import MessageParser from './messageParser';

// const CustomInput = forwardRef((props, ref) => (
//   <textarea
//     ref={ref}
//     className="react-chatbot-kit-chat-input"
//     placeholder="Type a message..."
//     value={props.inputText}
//     onChange={props.handleInputChange}
//     onKeyDown={props.handleInputKeyPress} // Use onKeyDown instead of onKeyPress
//   />
// ));

// const config = {
//   initialMessages: [createChatBotMessage('Hi! How can I help you today?')],
//   botName: 'ChatBot',
//   customComponents: {
//     // Pass the CustomInput component correctly
//     customInput: props => <CustomInput {...props} />,
//   },
//   state: {
//     messages: [],
//   },
//   widgets: [],
// };

// export default config;
