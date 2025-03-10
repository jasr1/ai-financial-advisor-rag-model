// import { FC, useContext, useEffect, useState } from 'react';
// import { FC, useContext, useEffect } from 'react';
import { FC, useEffect } from 'react';

// import { useParams } from 'next/navigation';
// import { ChatbotUIContext } from '@/app/chat/context';
import { useChatbotUI } from '@/app/chat/context';
import { useChatHandler } from '@/app/chat/hooks/use-chat-handler';
// import useHotkey from '@/lib/hooks/use-hotkey';
import { useScroll } from '@/app/chat/hooks/use-scroll';
import { ChatInput } from '@/app/chat/chat-input';
import { ChatMessages } from '@/app/chat/chat-messages';
import { ChatScrollButtons } from '@/components/chat/chat-scroll-buttons';
// import Loading from '@/app/chat/loading';

interface ChatUIProps {}

export const ChatUI: FC<ChatUIProps> = () => {
    // const { handleStart, handleFocusChatInput } = useChatHandler();
    // const { handleNewChat } = useChatHandler();
    const { handleNewChat } = useChatHandler();
    // useHotkey("o", handleStart);

    // const params = useParams();
    // const { isGenerating, chatMessages } = useContext(ChatbotUIContext); // Updated context hook usage

    console.log("ChatUI Component Rendering");
    // console.log("Context State - isGenerating:", isGenerating);
    // console.log("Context State - chatMessages:", chatMessages);

    const {
        messagesStartRef, 
        messagesEndRef, 
        handleScroll, 
        scrollToBottom, 
        isAtTop, 
        isAtBottom, 
        isOverflowing, 
        scrollToTop
    } = useScroll();

    useEffect(() => {
        console.log("ChatUI mounted, initializing chat session...");
            handleNewChat();  // Safely call handleStart if it's defined
    }, [handleNewChat]);

    // const [loading, setLoading] = useState(true);

    // useEffect(() => {
    //     console.log("Params chatid:", params.chatid, "isGenerating:", isGenerating);
    //     setLoading(!params.chatid || isGenerating);
    //     if (params.chatid) {
    //         handleFocusChatInput();
    //     }
    //     console.log("Loading status:", loading);

    // }, [params.chatid, handleFocusChatInput, isGenerating, loading]);

    // console.log("Final Check - Loading:", loading);

    // if (loading) {
    //     return <Loading />;
    // }

    const { chatMessages } = useChatbotUI();
    useEffect(() => {
        console.log("Chat messages in consumer updated:", chatMessages);
    }, [chatMessages]);

    // if (isGenerating || !params.chatid) {
    //     return <Loading />;
    // }

    return (
        <div className="relative flex h-full flex-col items-center">
            <div className="absolute left-4 top-2.5 flex justify-center">
                <ChatScrollButtons
                    isAtTop={isAtTop}
                    isAtBottom={isAtBottom}
                    isOverflowing={isOverflowing}
                    scrollToTop={scrollToTop}
                    scrollToBottom={scrollToBottom}
                />
            </div>
            <div className="absolute right-4 top-1 flex h-[40px] items-center space-x-2">
            </div>
    
            <div className="bg-secondary flex max-h-[50px] min-h-[50px] w-full items-center justify-left border-b-2 font-bold p-6">
                <div className="max-w-[200px] truncate sm:max-w-[400px] md:max-w-[500px] lg:max-w-[600px] xl:max-w-[700px] text-3xl">
                    Videre Chatbot
                </div>
            </div>

            <div className="flex size-full flex-col overflow-auto border-b" onScroll={handleScroll}>
                <div ref={messagesStartRef} />
                <ChatMessages />
                <div ref={messagesEndRef} />
            </div>
            <div className="relative w-full min-w-[300px] items-end px-2 pb-3 pt-0 sm:w-[600px] sm:pb-8 sm:pt-5 md:w-[700px] lg:w-[700px] xl:w-[800px]">
                <ChatInput />
            </div>
            <div className="absolute bottom-2 right-2 hidden md:block lg:bottom-4 lg:right-4">
            </div>
        </div>
    );
};
