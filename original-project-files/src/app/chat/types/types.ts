// export interface Message {
//     assistant_id: string | null;
//     chat_id: string;
//     content: string;
//     created_at: string;
//     id: string;
//     image_paths: string[];
//     model: string;
//     role: string;
//     sequence_number: number;
//     updated_at: string | null;
//     user_id: string;
// }

export interface MessageProps {
    message: ChatMessage;
    fileItems: ChatFile[];
    isEditing: boolean;
    isLast: boolean;
    onStartEdit?: () => void; 
    onCancelEdit?: () => void;
    onSubmitEdit?: (content: string) => void;
}

export interface ChatMessage {
    id?: string;
    type: 'user' | 'bot';
    message?: string;
    fileItems?: ChatFile[];
}

export interface ChatFile {
    id: string;
    name: string;
    type: string;
    content: string;
    created_at: string;
}

export interface FileItem {
    content: string;
    created_at: string;
    file_id: string;
    id: string;
    local_embedding: string | null;
    openai_embedding: string | null;
    sharing: string;
    tokens: number;
    updated_at: string | null;
    user_id: string;
}

export interface ExtendedFileItem extends FileItem {
    name: string;
    type: string;
    file: File;
}

export interface MessageImage {
    id: string;
    url: string;
    alt: string;
}

