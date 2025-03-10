import React, { useState } from 'react';
import { MessageProps } from '@/app/chat/types/types'; 

export const Message: React.FC<MessageProps> = ({
    message,
    isEditing,
    isLast,
    onStartEdit,  
    onCancelEdit,
    onSubmitEdit,
}) => {
    const [editContent, setEditContent] = useState<string>(message.message || '');

    const handleEditSubmit = () => {
        if (editContent !== undefined) {
            onSubmitEdit?.(editContent);
        }
        onCancelEdit?.();
    };
    

    return (
        <div className={`message ${isLast ? 'last-message' : ''}`}>
            {isEditing ? (
                <div>
                    <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                    />
                    <button onClick={handleEditSubmit}>Submit</button>
                    <button onClick={onCancelEdit}>Cancel</button>
                </div>
            ) : (
                <div>
                    <p>{message.message}</p>
                    <button onClick={onStartEdit}>Edit</button>
                    {/* Optionally render file items if they exist */}
                    {message.fileItems && message.fileItems.map((fileItem) => (
                        <div key={fileItem.id}>{fileItem.name}</div>
                    ))}
                </div>
            )}
        </div>
    );
};
