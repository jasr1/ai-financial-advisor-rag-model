// class ActionProvider {
//   constructor(createChatBotMessage, setStateFunc) {
//     this.createChatBotMessage = createChatBotMessage;
//     this.setState = setStateFunc;
//   }

//   handleGreet() {
//     const message = this.createChatBotMessage('Hello! How can I assist you?');
//     this.setState(prevState => ({
//       ...prevState,
//       messages: [...prevState.messages, message],
//     }));
//   }

//   // Add more handlers for specific user interactions...
// }

// export default ActionProvider;

class ActionProvider {
  constructor(createChatBotMessage, setStateFunc) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
  }

  handleMessage = async message => {
    if (message.toLowerCase() === 'start') {
      this.handleStart();
    } else if (message.toLowerCase() === 'exit') {
      this.handleExit();
    } else {
      await this.handleGeneralMessage(message);
    }
  };

  handleStart = async () => {
    const questions = [
      "What questions help guide your family's decision-making?",
      'What are your family values?',
      'What is a statement or commitment that your family lives by?',
      "What statement defines your family's vision?",
      "What is your family's impact statement?",
    ];

    for (let question of questions) {
      const botMessage = this.createChatBotMessage(question);
      this.setState(prev => ({
        ...prev,
        messages: [...prev.messages, botMessage],
      }));

      // Wait for the user's response to each question
      const userResponse = await this.waitForUserResponse();
      const friendlyMessage = await this.sendMessageToAPI(userResponse);
      const botReply = this.createChatBotMessage(friendlyMessage);

      this.setState(prev => ({
        ...prev,
        messages: [...prev.messages, botReply],
      }));
    }
  };

  handleExit = () => {
    const botMessage = this.createChatBotMessage('Goodbye!');
    this.setState(prev => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  handleGeneralMessage = async message => {
    const response = await this.sendMessageToAPI(message);
    const botMessage = this.createChatBotMessage(response);
    this.setState(prev => ({
      ...prev,
      messages: [...prev.messages, botMessage],
    }));
  };

  sendMessageToAPI = async message => {
    try {
      const response = await fetch('http://localhost:5000/api/chat', {
        // const response = await fetch('http://192.168.1.185:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (data.error) {
        console.error('Error:', data.error);
        return "I'm sorry, something went wrong.";
      } else {
        return data.answer;
      }
    } catch (error) {
      console.error('Error22:', error);
      return "I'm sorry, something went wrong";
    }
  };

  waitForUserResponse = () => {
    return new Promise(resolve => {
      const interval = setInterval(() => {
        if (this.latestUserMessage) {
          clearInterval(interval);
          resolve(this.latestUserMessage);
          this.latestUserMessage = null;
        }
      }, 500);
    });
  };

  setLatestUserMessage = message => {
    this.latestUserMessage = message;
  };
}

export default ActionProvider;
