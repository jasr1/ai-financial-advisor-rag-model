'use client';

export default function FamilyMember({ member: member }: { member: any }) {
  return (
    <tr>
      <td>{member.name}</td>
      <td>{member.title}</td>
      <td>{member.email}</td>
      <td>{member.phone}</td>
    </tr>
  );
}
