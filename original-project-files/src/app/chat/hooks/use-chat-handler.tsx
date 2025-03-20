// import { useState, useCallback, useContext, useEffect } from 'react';
// import { ChatbotUIContext } from '@/app/chat/context';
// import { ChatMessage } from '@/app/chat/types/types';

// const questions = [
//     "Enter up to three questions that guide your family’s decision making.",
//     "What are your family values?",
//     "What is a statement or commitment that your family lives by?",
//     "What statement defines your family's vision?",
//     "What is your family's impact statement?",
// ];

// export const useChatHandler = () => {
//     const { chatMessages, setChatMessages } = useContext(ChatbotUIContext);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [isGenerating, setIsGenerating] = useState(false);

//     const createChatBotMessage = useCallback((text, messageType): ChatMessage => {
//         return {
//             id: Date.now().toString(),
//             type: messageType,
//             message: text
//         };
//     }, []);

//     // Initialize chat with a welcome message
//     useEffect(() => {
//         const welcomeMessage = createChatBotMessage("Welcome to Videre Chatbot!", 'bot');
//         setChatMessages([welcomeMessage]);
//     }, [createChatBotMessage, setChatMessages]);

//     const sendMessageToAPI = useCallback(async (message) => {
//         if (['start', 'exit'].includes(message.toLowerCase())) {
//             console.log("Control message received, not sending to API:", message);
//             return;
//         }
//         try {
//             const response = await fetch('http://localhost:8000/api/chat', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ message }),
//             });
//             if (!response.ok) throw new Error(`HTTP error ${response.status}`);
//             const { answer } = await response.json();
//             return answer;
//         } catch (error) {
//             console.error("Error during fetch or parsing:", error);
//         }
//     }, []);

//     const handleGeneralMessage = useCallback(async (message) => {
//         const response = await sendMessageToAPI(message);
//         if(response) {
//             const botMessage = createChatBotMessage(response, 'bot');
//             setChatMessages(prev => [...prev, botMessage]);
//         }
//     }, [sendMessageToAPI, createChatBotMessage, setChatMessages]);

//     const handleStart = useCallback(() => {
//         if (currentQuestionIndex < questions.length) {
//             const message = createChatBotMessage(questions[currentQuestionIndex], 'bot');
//             setChatMessages(prevMessages => [...prevMessages, message]);
//             setCurrentQuestionIndex(current => current + 1);
//         }
//     }, [createChatBotMessage, currentQuestionIndex, setChatMessages]);


//     const handleExit = useCallback(() => {
//         const exitMessage = createChatBotMessage("Goodbye!", "bot");
//         setChatMessages(prev => [...prev, exitMessage]);
//     }, [createChatBotMessage, setChatMessages]);

//     const handleSendMessage = useCallback(async (messageText: string) => {
//         setIsGenerating(true);
//         try {
//             const message: ChatMessage = createChatBotMessage(messageText, 'user');
//             setChatMessages(prev => {
//                 console.log("Adding message:", message);  // Log to confirm message is being added
//                 return [...prev, message];
//             });
        
//             if (messageText.trim().toLowerCase() === "start" && currentQuestionIndex === 0) {
//                 handleStart();
//             } else if (messageText.trim().toLowerCase() === "exit") {
//                 handleExit();
//             } else {
//                 await handleGeneralMessage(messageText);
//             }
//         } catch (error) {
//             console.error("Failed to handle message:", error);
//         } finally {
//             setIsGenerating(false);
//         }
//     }, [createChatBotMessage, handleStart, handleExit, handleGeneralMessage, setChatMessages, currentQuestionIndex]);

//     const handleNewChat = useCallback(() => {
//         setChatMessages([]);  // Clearing existing messages for new chat session
//         setCurrentQuestionIndex(0);  // Reset question index
//     }, [setChatMessages]);

//     return {
//         chatMessages,
//         handleSendMessage,
//         handleNewChat,
//         handleStart,
//         isGenerating,
//     };
// };


// import { useState, useCallback, useContext } from 'react';
// import { ChatbotUIContext } from '@/app/chat/context';
// import { ChatMessage } from '@/app/chat/types/types';
// import { v4 as uuidv4 } from 'uuid';

// const questions = [
//     "Enter up to three questions that guide your family’s decision making.",
//     "What are your family values?",
//     "What is a statement or commitment that your family lives by?",
//     "What statement defines your family's vision?",
//     "What is your family's impact statement?",
// ];

// export const useChatHandler = () => {
//     const { chatMessages, setChatMessages } = useContext(ChatbotUIContext);
//     const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
//     const [isGenerating, setIsGenerating] = useState(false);

//     const createChatBotMessage = useCallback((text, messageType): ChatMessage => ({
//         id: uuidv4(),
//         type: messageType,
//         message: text
//     }), []);

//     const addMessage = useCallback((message: ChatMessage) => {
//         setChatMessages(prevMessages => [...prevMessages, message]);
//     }, [setChatMessages]);

//     const handleQuestions = useCallback(() => {
//         console.log("Current Index Before Update:", currentQuestionIndex);
//         if (currentQuestionIndex < questions.length) {
//             addMessage(createChatBotMessage(questions[currentQuestionIndex], 'bot'));
//             setCurrentQuestionIndex(current => {
//                 console.log("Updating Index From:", current, "To:", current + 1);
//                 return current + 1;
//             });
//         } else {
//             addMessage(createChatBotMessage("You may type exit to finish creating your charter.", 'bot'));
//         }
//     }, [addMessage, createChatBotMessage, currentQuestionIndex]);

//     const submitResponses = useCallback(async () => {
//         // Filter messages to only include those from the user
//         const userResponses = chatMessages.filter(msg => msg.type === 'user').map(msg => msg.message);
        
//         // Send the user responses to the backend
//         try {
//             const response = await fetch('http://localhost:8000/api/chat/submit_responses', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ responses: userResponses }),
//                 credentials: 'include' 
//             });
//             if (!response.ok) {
//                 throw new Error(`HTTP error ${response.status}`);
//             }
//             const result = await response.json();
//             console.log("Responses submitted successfully:", result);
//         } catch (error) {
//             console.error("Failed to submit responses:", error);
//         }
//     }, [chatMessages]);
    
//     const sendMessageToAPI = useCallback(async (message) => {
//         try {
//             const response = await fetch('http://localhost:8000/api/chat/send_message', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ message }),
//                 credentials: 'include' 
//             });
//             if (!response.ok) throw new Error(`HTTP error ${response.status}`);
//             const { answer } = await response.json();
//             return answer;
//         } catch (error) {
//             console.error("Error during fetch or parsing:", error);
//             return "Sorry, there was an error processing your message.";
//         }
//     }, []);
    
//     const handleSendMessage = useCallback(async(messageText: string) => {
//         setIsGenerating(true);
//         const normalizedText = messageText.trim().toLowerCase();
//         try {
//             addMessage(createChatBotMessage(messageText, 'user'));

//             if (normalizedText === "start" && currentQuestionIndex === 0) {
//                 handleQuestions();
//             } else if (normalizedText === "exit") {
//                 await submitResponses(); 
//                 setChatMessages([]);
//                 setCurrentQuestionIndex(0);
//                 addMessage(createChatBotMessage("Thank you, I have recorded your responses. Goodbye!", 'bot'));
//             } else {
//                 const apiResponse = await sendMessageToAPI(messageText);
//                 addMessage(createChatBotMessage(apiResponse, 'bot'));
//                 handleQuestions(); 
//             }
//         } finally {
//             setIsGenerating(false);
//         }
//     }, [addMessage, handleQuestions, createChatBotMessage, currentQuestionIndex, setChatMessages, submitResponses, sendMessageToAPI]);

//     const handleNewChat = useCallback(() => {
//         setChatMessages([]);  // Clearing existing messages for new chat session
//         setCurrentQuestionIndex(0);  // Reset question index
//     }, [setChatMessages]);

//     return {
//         chatMessages,
//         handleSendMessage,
//         handleNewChat,
//         isGenerating,
//     };
// };

import { useState, useCallback, useContext } from 'react';
import { ChatbotUIContext } from '@/app/chat/context';
import { ChatMessage } from '@/app/chat/types/types';
import { v4 as uuidv4 } from 'uuid';

const questions = [
    "Enter up to three questions that guide your family’s decision making.",
    "What are your family values?",
    "What is a statement or commitment that your family lives by?",
    "What statement defines your family's vision?",
    "What is your family's impact statement?",
];

export const useChatHandler = () => {
    const { chatMessages, setChatMessages } = useContext(ChatbotUIContext);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [questionsCompleted, setQuestionsCompleted] = useState(false);

    const createChatBotMessage = useCallback((text, messageType): ChatMessage => ({
        id: uuidv4(),
        type: messageType,
        message: text
    }), []);

    const addMessage = useCallback((message: ChatMessage) => {
        setChatMessages(prevMessages => [...prevMessages, message]);
    }, [setChatMessages]);

    const handleQuestions = useCallback(() => {
        if (currentQuestionIndex < questions.length) {
            addMessage(createChatBotMessage(questions[currentQuestionIndex], 'bot'));
            setCurrentQuestionIndex(current => current + 1);
        } else {
            addMessage(createChatBotMessage("You may type exit to finish creating your charter.", 'bot'));
            setQuestionsCompleted(true);  // Mark the completion of questions
        }
    }, [addMessage, createChatBotMessage, currentQuestionIndex]);

    const submitResponses = useCallback(async () => {
        // Logic to submit responses to the backend
        // After submitting, allow API interactions
        const userResponses = chatMessages.filter(msg => msg.type === 'user').map(msg => msg.message);
        try {
            const response = await fetch('http://localhost:8000/api/chat/submit_responses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ responses: userResponses }),
                credentials: 'include'
            });
            if (!response.ok) {
                throw new Error(`HTTP error ${response.status}`);
            }
            const result = await response.json();
            console.log("Responses submitted successfully:", result);
        } catch (error) {
            console.error("Failed to submit responses:", error);
        }
    }, [chatMessages]);

    const sendMessageToAPI = useCallback(async (message) => {
        try {
            const response = await fetch('http://localhost:8000/api/chat/send_message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message }),
                credentials: 'include'
            });
            if (!response.ok) throw new Error(`HTTP error ${response.status}`);
            const { answer } = await response.json();
            return answer;
        } catch (error) {
            console.error("Error during fetch or parsing:", error);
            return "Sorry, there was an error processing your message.";
        }
    }, []);

    const handleSendMessage = useCallback(async (messageText: string) => {
        setIsGenerating(true);
        const normalizedText = messageText.trim().toLowerCase();
        try {
            addMessage(createChatBotMessage(messageText, 'user'));
    
            // Start the questionnaire if "start" is input and it's the first interaction.
            if (normalizedText === "start" && currentQuestionIndex === 0) {
                handleQuestions();
            } else if (normalizedText === "exit" && questionsCompleted) {
                // Allow exiting only if the questionnaire has been completed.
                await submitResponses(); 
                setChatMessages([]);
                setCurrentQuestionIndex(0);
                setQuestionsCompleted(false);
                addMessage(createChatBotMessage("Thank you, I have recorded your responses. Goodbye!", 'bot'));
            } else {
                // Handle general inquiries or continue with questions if the session has started.
                if (currentQuestionIndex > 0 && currentQuestionIndex <= questions.length) {
                    handleQuestions();
                } else {
                    // If no questionnaire is active or needed, handle as a general inquiry.
                    if (questionsCompleted || currentQuestionIndex === 0) {
                        const apiResponse = await sendMessageToAPI(messageText);
                        addMessage(createChatBotMessage(apiResponse, 'bot'));
                    } else {
                        // Prompt to continue or start the questionnaire if not yet started.
                        addMessage(createChatBotMessage("Please type 'start' to begin the questionnaire, or ask anything else.", 'bot'));
                    }
                }
            }
        } finally {
            setIsGenerating(false);
        }
    }, [addMessage, handleQuestions, createChatBotMessage, currentQuestionIndex, setChatMessages, submitResponses, sendMessageToAPI, questionsCompleted]);
    
    const handleNewChat = useCallback(() => {
        setChatMessages([]);
        setCurrentQuestionIndex(0);
        setQuestionsCompleted(false);  // Reset the question completion status
    }, [setChatMessages]);

    return {
        chatMessages,
        handleSendMessage,
        handleNewChat,
        isGenerating,
    };
};
