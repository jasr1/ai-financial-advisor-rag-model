'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import Family from './family';

interface FamilyType {
  id: number;
  name: string;
  admin_id: string;
}

const Families = () => {
  const [families, setFamilies] = useState<FamilyType[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFamilies = async () => {
      const supabase = createClient();
      const { data: userData, error: userError } = await supabase.auth.getUser();

      if (userError) {
        setError(userError.message);
        return;
      }

      const { data: familiesData, error: familiesError } = await supabase
        .from('families')
        .select('*')
        .eq('admin_id', userData.user?.id);

      if (familiesError) {
        setError(familiesError.message);
      } else {
        setFamilies(familiesData || []);
      }
    };

    fetchFamilies();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="prose mt-8">
      <table className="w-full table-auto">
        <thead>
          <tr>
            <th className="w-auto text-left">Name</th>
            <th className="w-1/4 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {families.length > 0 ? (
            families.map((family) => (
              <Family key={family.id} family={family} />
            ))
          ) : (
            <tr>
              <td colSpan={2} className="text-center">You have no families yet.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Families;
