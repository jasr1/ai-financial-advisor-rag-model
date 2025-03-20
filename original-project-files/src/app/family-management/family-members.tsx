'use client';
import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import FamilyMember from './family-member';
import { loadFamilyMembers } from './actions';

interface FamilyMembersProps {
  familyId: number;
}

const FamilyMembers = forwardRef(({ familyId }: FamilyMembersProps, ref) => {
  const [members, setFamilyMembers] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadTable = async () => {
    try {
      const familyMembers = await loadFamilyMembers(familyId);
      setFamilyMembers(familyMembers);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Unexpected error occurred');
      }
    }
  };

  useEffect(() => {
    if (familyId) {
      loadTable();
    }
  }, [familyId]);

  useImperativeHandle(ref, () => ({
    reloadMembers: loadTable
  }));

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="prose mt-8">
      <table className="w-full">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {members.length > 0 ? (
            members.map(member => (
              <FamilyMember key={member.email} member={member} onRemove={loadTable} />
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">You have no family members yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
});

FamilyMembers.displayName = 'FamilyMembers';

export default FamilyMembers;
