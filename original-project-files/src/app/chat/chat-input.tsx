// "use client";

// import { useChatHandler } from '@/app/chat/hooks/use-chat-handler';
// import { useRef, useState, FC } from 'react';
// import { IconCirclePlus, IconPlayerStopFilled, IconSend } from '@tabler/icons-react';
// import { Input } from '@/components/ui/input';
// import TextareaAutosize from 'react-textarea-autosize';
// import { useTranslation } from 'react-i18next';
// import { cn } from '@/lib/utils';
// // import { ChatFilesDisplay } from '@/components/chat/chat-files-display';

// interface ChatInputProps {}

// export const ChatInput: FC<ChatInputProps> = () => {
//     const { t } = useTranslation();
//     const [isTyping, setIsTyping] = useState<boolean>(false);
    

//     const {
//         chatInput,
//         setChatInput,
//         handleSendMessage,
//         isGenerating,
//     } = useChatHandler();

//     const fileInputRef = useRef<HTMLInputElement>(null);

//     // useHotkey("l", handleFocusChatInput);

//     const handleKeyDown = (event: React.KeyboardEvent) => {
//         if (!isTyping && event.key === 'Enter' && !event.shiftKey) {
//             event.preventDefault();
//             if (chatInput.trim() !== '') {
//                 handleSendMessage(chatInput);
//                 setChatInput('');
//             }
//         }
//     };

//     const handlePaste = (event: React.ClipboardEvent) => {
//         const items = event.clipboardData.items;
//         for (const item of items) {
//             if (item.type.indexOf('image') === 0) {
//                 const file = item.getAsFile();
//                 if (!file) return;
//                 // Handle the file selection here, e.g., set a state or call a handler function
//             }
//         }
//     };

//     return (
//         <>
//             <div className="flex flex-col flex-wrap justify-center gap-2">
//                 {/* <ChatFilesDisplay /> */}
//             </div>

//             <div className="border-input relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
//                 <IconCirclePlus
//                     className="absolute bottom-[12px] left-3 cursor-pointer p-1 hover:opacity-50"
//                     size={32}
//                     onClick={() => fileInputRef.current?.click()}
//                 />

//                 <Input
//                     ref={fileInputRef}
//                     className="hidden"
//                     type="file"
//                     onChange={e => {
//                         if (!e.target.files) return;
//                         // Handle the file selection here, e.g., set a state or call a handler function
//                     }}
//                 />

//                 <TextareaAutosize
//                     className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent px-14 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
//                     placeholder={t(`Type start to begin creating your family charter...`)}
//                     onChange={e => setChatInput(e.target.value)}
//                     value={chatInput}
//                     minRows={1}
//                     maxRows={18}
//                     onKeyDown={handleKeyDown}
//                     onPaste={handlePaste}
//                     onCompositionStart={() => setIsTyping(true)}
//                     onCompositionEnd={() => setIsTyping(false)}
//                 />

//                 <div className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50">
//                     {isGenerating ? (
//                         <IconPlayerStopFilled
//                             className="hover:bg-background animate-pulse rounded bg-transparent p-1"
//                             // onClick={handleStopMessage} // Implement handleStopMessage if necessary
//                             size={30}
//                         />
//                     ) : (
//                         <IconSend
//                             className={cn(
//                                 "bg-primary text-secondary rounded p-1",
//                                 !chatInput && "cursor-not-allowed opacity-50"
//                             )}
//                             onClick={() => {
//                                 if (!chatInput) return;
//                                 handleSendMessage(chatInput);
//                                 setChatInput('');
//                             }}
//                             size={30}
//                         />
//                     )}
//                 </div>
//             </div>
//         </>
//     );
// };




// "use client";

// import { FC, useState, KeyboardEvent, ChangeEvent } from 'react';
// import { useTranslation } from 'react-i18next';
// import { useChatHandler } from '@/app/chat/hooks/use-chat-handler'; // Ensure path is correct

// interface ChatInputProps {}

// export const ChatInput: FC<ChatInputProps> = () => {
//     const { t } = useTranslation();
//     const [chatInput, setChatInput] = useState(""); // Managed locally if not provided by useChatHandler

//     const {
//         handleSendMessage,
//         isGenerating,
//     } = useChatHandler(); // Ensure useChatHandler provides these

//     const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
//         setChatInput(e.target.value);
//     };

//     const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === 'Enter' && chatInput.trim() !== '') {
//             e.preventDefault(); // Prevent default to avoid form submit in some contexts
//             handleSendMessage(chatInput);
//             setChatInput('');  // Clear input field after sending
//         }
//     };

//     return (
//         <div className="chat-input-container">
//             <input
//                 type="text"
//                 value={chatInput}
//                 onChange={handleInputChange}
//                 onKeyPress={handleKeyPress}
//                 placeholder={t('type_message')}
//                 disabled={isGenerating}
//                 className="chat-input"
//             />
//             {isGenerating && <span className="loading">{t('sending')}</span>}
//         </div>
//     );
// };

import { FC, useState, KeyboardEvent, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useChatHandler } from '@/app/chat/hooks/use-chat-handler';
import TextareaAutosize from 'react-textarea-autosize';
import { IconSend, IconCirclePlus, IconPlayerStopFilled } from '@tabler/icons-react'; 


interface ChatInputProps {}

export const ChatInput: FC<ChatInputProps> = () => {
    const { t } = useTranslation();
    const { handleSendMessage, isGenerating } = useChatHandler();
    const [chatInput, setChatInput] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setChatInput(event.target.value);
    };

    const handleKeyPress = (event: KeyboardEvent<HTMLTextAreaElement>) => {
        if (event.key === 'Enter' && !event.shiftKey && chatInput.trim() !== '') {
            event.preventDefault(); // Stop form submission
            handleSendMessage(chatInput);
            setChatInput('');
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        // Implement your logic for file handling here
        console.log(event.target.files);
    };

    return (
        <>
            <div className="flex flex-col flex-wrap justify-center gap-2">
                {/* Placeholder for any additional components like file displays */}
            </div>

            <div className="border-input relative mt-3 flex min-h-[60px] w-full items-center justify-center rounded-xl border-2">
                <IconCirclePlus
                    className="absolute bottom-[12px] left-3 cursor-pointer p-1 hover:opacity-50"
                    size={32}
                    onClick={() => fileInputRef.current?.click()}
                />

                <input
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    onChange={handleFileChange}
                />

                <TextareaAutosize
                    className="ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring text-md flex w-full resize-none rounded-md border-none bg-transparent px-14 py-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={t('Type start to begin creating your family charter...')}
                    onChange={handleInputChange}
                    value={chatInput}
                    minRows={1}
                    maxRows={5}
                    onKeyDown={handleKeyPress}
                />
                
                <div className="absolute bottom-[14px] right-3 cursor-pointer hover:opacity-50">
                    {isGenerating ? (
                        <IconPlayerStopFilled
                            className="hover:bg-background animate-pulse rounded bg-transparent p-1"
                            size={30}
                            // Implement stopping logic if needed
                        />
                    ) : (
                        <IconSend
                            className={`bg-primary text-secondary rounded p-1 ${!chatInput && 'cursor-not-allowed opacity-50'}`}
                            onClick={() => {
                                if (!chatInput) return;
                                handleSendMessage(chatInput);
                                setChatInput('');
                            }}
                            size={30}
                        />
                    )}
                </div>
            </div>
        </>
    );
};
