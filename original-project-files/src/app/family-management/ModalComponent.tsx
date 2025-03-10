import React, { useEffect, Suspense, useRef } from 'react';
import Modal from 'react-modal';
import FamilyMembers from './family-members';
import Loading from '@/components/loading';
import { AddFamilyMemberForm } from './add-family-member-form';
import { Separator } from '../../components/ui/separator';
import { EditFamilyForm } from './edit-family-form';

interface ModalComponentProps {
  isOpen: boolean;
  onRequestClose: () => void;
  family: { id: number; name: string } | null;
  onSave: (updatedFamily: { id: number; name: string }) => void;
}

const ModalComponent: React.FC<ModalComponentProps> = ({ isOpen, onRequestClose, family, onSave }) => {
  const familyMembersRef = useRef<any>(null);

  useEffect(() => {
    if (typeof document !== 'undefined') {
      Modal.setAppElement(document.body);
    }
  }, []);

  const handleMemberAddSuccess = () => {
    if (familyMembersRef.current) {
      familyMembersRef.current.reloadMembers();
    }
  };

  const handleFamilyEditSuccess = (updatedFamily: { id: number; name: string }) => {
    onSave(updatedFamily);
    onRequestClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Edit Family"
      className="fixed inset-0 flex items-center justify-center p-4"
      overlayClassName="fixed inset-0 bg-black bg-opacity-75"
    >
      <div className="relative bg-white rounded-lg max-w-3xl w-full max-h-full overflow-hidden">
        <button
          onClick={onRequestClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-6 w-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
        <div className="overflow-auto max-h-[calc(100vh-50px)] p-6">
          <h1 className="text-3xl font-bold">{family?.name} Family</h1>
          {family && (
            <Suspense fallback={<Loading />}>
              <FamilyMembers ref={familyMembersRef} familyId={family.id} />
            </Suspense>
          )}
          {family && (
            <>
              <Separator className="mx-auto mt-2 w-[100%]" />
              <AddFamilyMemberForm familyId={family.id} onSuccess={handleMemberAddSuccess} />
              <EditFamilyForm family={family} onSuccess={handleFamilyEditSuccess} />
            </>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ModalComponent;

