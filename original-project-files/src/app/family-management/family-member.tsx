'use client';
import { useState } from 'react';
import { removeFamilyMember } from './actions';
import { Loader2, Trash2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FamilyMemberProps {
  member: any;
  onRemove: () => void;
}

const FamilyMember: React.FC<FamilyMemberProps> = ({ member, onRemove }) => {
  const [isRemoving, setIsRemoving] = useState(false);

  const handleRemoval = async () => {
    setIsRemoving(true);
    await removeFamilyMember(member.id);
    setIsRemoving(false);
    onRemove();
  };

  return (
    <tr>
      <td>{member.name}</td>
      <td>{member.title}</td>
      <td>{member.email}</td>
      <td>{member.phone}</td>
      <td>
        <Button
          variant="destructive"
          disabled={isRemoving}
          onClick={handleRemoval}
        >
          {isRemoving ? (
            <Loader2 className="animate-spin" size={24}>
              <title className="sr-only">Delete</title>
            </Loader2>
          ) : (
            <Trash2Icon size={24}>
              <title className="sr-only">Delete</title>
            </Trash2Icon>
          )}
        </Button>
      </td>
    </tr>
  );
};

export default FamilyMember;
