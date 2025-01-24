import { useState, useEffect } from 'react';
import { ref, increment, onValue, update } from 'firebase/database';
import { db } from '../utils/firebaseConfig';

export default function LikeCounter({ albumId }) {
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    const likesRef = ref(db, `albums/${albumId}/likes`);
    const unsubscribe = onValue(likesRef, snapshot => {
      setLikes(snapshot.val() || 0);
    });

    return () => unsubscribe();
  }, [albumId]);

  const handleLike = () => {
    const likesRef = ref(db, `albums/${albumId}`);
    update(likesRef, { likes: increment(1) });
  };

  return (
<div className="flex flex-row items-center justify-between mt-8 space-x-6">
  <button
    onClick={handleLike}
    className="flex items-center space-x-3 px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold text-lg rounded-full shadow-lg transform hover:scale-105 transition-transform duration-300"
  >
    <span>Me gusta</span>
    <span className="text-2xl">👍</span>
  </button>
  <div
    className="flex items-center justify-center w-24 h-24 bg-orange-500 text-white font-bold text-1xl rounded-full shadow-md transform hover:scale-110 transition-transform duration-300"
  >
    {likes} likes 🌟
  </div>
</div>


  );
}
