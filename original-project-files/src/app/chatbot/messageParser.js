// class MessageParser {
//   constructor(actionProvider) {
//     this.actionProvider = actionProvider;
//   }

//   parse(message) {
//     const lowerCaseMessage = message.toLowerCase();

//     if (lowerCaseMessage.includes('hello') || lowerCaseMessage.includes('hi')) {
//       this.actionProvider.handleGreet();
//     }

//     // Add more parsing logic for different commands...
//   }
// }

// export default MessageParser;

class MessageParser {
  constructor(actionProvider) {
    this.actionProvider = actionProvider;
  }

  parse(message) {
    this.actionProvider.handleMessage(message);
  }
}

export default MessageParser;
