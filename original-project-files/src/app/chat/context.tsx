import React, { createContext, useContext, useState, Dispatch, SetStateAction, ReactNode, FC } from 'react';
import { ChatMessage, ChatFile, MessageImage } from "@/app/chat/types/types";

interface ChatbotUIContextType {
    userInput: string;
    setUserInput: Dispatch<SetStateAction<string>>;
    chatMessages: ChatMessage[];
    setChatMessages: Dispatch<SetStateAction<ChatMessage[]>>;
    chatFileItems: ChatFile[];
    setChatFileItems: Dispatch<SetStateAction<ChatFile[]>>;
    isGenerating: boolean;
    setIsGenerating: Dispatch<SetStateAction<boolean>>;
    chatFiles: ChatFile[];
    setChatFiles: Dispatch<SetStateAction<ChatFile[]>>;
    chatImages: MessageImage[];
    setChatImages: Dispatch<SetStateAction<MessageImage[]>>;
    newMessageFiles: ChatFile[];
    setNewMessageFiles: Dispatch<SetStateAction<ChatFile[]>>;
    newMessageImages: MessageImage[];
    setNewMessageImages: Dispatch<SetStateAction<MessageImage[]>>;
    showFilesDisplay: boolean;
    setShowFilesDisplay: Dispatch<SetStateAction<boolean>>;
}

const defaultValue: ChatbotUIContextType = {
    userInput: "",
    setUserInput: () => {},
    chatMessages: [],
    setChatMessages: () => {},
    chatFileItems: [],
    setChatFileItems: () => {},
    isGenerating: false,
    setIsGenerating: () => {},
    chatFiles: [],
    setChatFiles: () => {},
    chatImages: [],
    setChatImages: () => {},
    newMessageFiles: [],
    setNewMessageFiles: () => {},
    newMessageImages: [],
    setNewMessageImages: () => {},
    showFilesDisplay: false,
    setShowFilesDisplay: () => {},
};

export const ChatbotUIContext = createContext<ChatbotUIContextType>(defaultValue);

interface ChatbotUIProviderProps {
    children: ReactNode;
}

export const ChatbotUIProvider: FC<ChatbotUIProviderProps> = ({ children }) => {
    const [userInput, setUserInput] = useState<string>("");
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [chatFileItems, setChatFileItems] = useState<ChatFile[]>([]);
    const [isGenerating, setIsGenerating] = useState<boolean>(false);
    const [chatFiles, setChatFiles] = useState<ChatFile[]>([]);
    const [chatImages, setChatImages] = useState<MessageImage[]>([]);
    const [newMessageFiles, setNewMessageFiles] = useState<ChatFile[]>([]);
    const [newMessageImages, setNewMessageImages] = useState<MessageImage[]>([]);
    const [showFilesDisplay, setShowFilesDisplay] = useState<boolean>(false);

    return (
        <ChatbotUIContext.Provider value={{
            userInput, setUserInput,
            chatMessages, setChatMessages,
            chatFileItems, setChatFileItems,
            isGenerating, setIsGenerating,
            chatFiles, setChatFiles,
            chatImages, setChatImages,
            newMessageFiles, setNewMessageFiles,
            newMessageImages, setNewMessageImages,
            showFilesDisplay, setShowFilesDisplay,
        }}>
            {children}
        </ChatbotUIContext.Provider>
    );
};

export const useChatbotUI = () => useContext(ChatbotUIContext);
