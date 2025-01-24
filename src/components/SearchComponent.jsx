import { useState, useEffect } from 'react';
import { db } from '../utils/firebaseConfig'; // Configuración de Firebase
import { ref, onValue } from 'firebase/database';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false); // Controla si el diálogo está abierto o cerrado

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }

    const fetchResults = async () => {
      try {
        const newsRef = ref(db, 'news');
        const albumsRef = ref(db, 'albums');

        let newsData = [];
        let albumsData = [];

        // Fetch noticias desde Firebase
        onValue(newsRef, snapshot => {
          if (snapshot.exists()) {
            newsData = Object.entries(snapshot.val()).map(([id, item]) => ({
              id,
              ...item,
              type: 'noticia',
            }));
          }

          // Fetch álbumes desde Firebase
          onValue(albumsRef, albumSnapshot => {
            if (albumSnapshot.exists()) {
              albumsData = Object.entries(albumSnapshot.val()).map(([id, item]) => ({
                id,
                ...item,
                type: 'album',
              }));
            }

            // Combina y filtra los resultados
            const combinedResults = [...newsData, ...albumsData].filter(item =>
              item.title?.toLowerCase().includes(searchTerm.toLowerCase())
            );

            setSearchResults(combinedResults);
          });
        });
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchResults();
  }, [searchTerm]);

  const closeDialog = (e) => {
    if (e.target.id === 'dialog-overlay') {
      setIsOpen(false);
      setSearchTerm('');
      setSearchResults([]);
    }
  };

  return (
    <div className="relative">
      {/* Botón para abrir el diálogo */}
      <button
        className="p-2 text-lg bg-blue-600 text-black rounded-full hover:bg-blue-700 transition"
        onClick={() => setIsOpen(true)}
      >
        🔍
      </button>

      {/* Diálogo */}
      {isOpen && (
        <div
          id="dialog-overlay"
          className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
          onClick={closeDialog}
        >
          <div
            className="bg-white rounded-lg shadow-lg w-full max-w-3xl p-6 relative"
            onClick={(e) => e.stopPropagation()} // Evita el cierre al hacer clic dentro
          >
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => setIsOpen(false)}
            >
              ✖
            </button>
            <form onSubmit={(e) => e.preventDefault()} className="mb-6">
              <input
                id="site-search"
                type="text"
                placeholder="Buscar noticias o álbumes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-4 text-black border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </form>

            <div className="divide-y divide-gray-300">
              {/* Resultados de Noticias */}
              {searchResults.some(item => item.type === 'noticia') && (
                <div className="mb-4">
                  <h2 className="text-xl font-bold text-gray-700 mb-2">Noticias</h2>
                  <ul className="space-y-4">
                    {searchResults
                      .filter(item => item.type === 'noticia')
                      .map(item => (
                        <li key={item.id} onClick={() => setIsOpen(false)}>
                          <a
                            href={`/noticias/${item.id}`}
                            className="flex items-center space-x-4"
                          >
                            <img
                              className="w-16 h-16 object-cover rounded-lg shadow-md"
                              src={item.image}
                              alt={item.title}
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                              <p className="text-sm text-gray-600">
                                {new Date(item.date).toLocaleDateString()}
                              </p>
                            </div>
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}

              {/* Resultados de Álbumes */}
              {searchResults.some(item => item.type === 'album') && (
                <div>
                  <h2 className="text-xl font-bold text-gray-700 mb-2">Álbumes</h2>
                  <ul className="space-y-4">
                    {searchResults
                      .filter(item => item.type === 'album')
                      .map(item => (
                        <li key={item.id} onClick={() => setIsOpen(false)}>
                          <a
                            href={`/blog/${item.id}`}
                            className="flex items-center space-x-4"
                          >
                            <img
                              className="w-16 h-16 object-cover rounded-lg shadow-md"
                              src={item.coverImage}
                              alt={item.title}
                            />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                              <p className="text-sm text-gray-600">{item.artist}</p>
                            </div>
                          </a>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>

            {searchResults.length === 0 && searchTerm && (
              <p className="text-gray-600 text-center mt-6">No se encontraron resultados.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default SearchComponent;
