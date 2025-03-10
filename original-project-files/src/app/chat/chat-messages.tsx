
import React, { useEffect, useRef } from 'react';
import { useChatbotUI } from '@/app/chat/context'; 
import './styles.css';

export const ChatMessages = () => {
    // const { chatMessages } = useContext(ChatbotUIContext);
    const { chatMessages } = useChatbotUI();
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        console.log("Updated messages:", chatMessages)
    }, [chatMessages]);

    return (
        <div className="chat-container">
            {chatMessages.map((msg, index) => (
                <div key={msg.id || index} className={`message ${msg.type === 'bot' ? 'bot-message' : 'user-message'}`}>
                    <div className={`${msg.type}-text`}>
                        {msg.message}
                    </div>
                </div>
            ))}
        </div>
    );
};
