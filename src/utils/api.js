import { db } from './firebaseConfig';
import { ref, query, orderByKey, orderByChild,limitToLast, get } from 'firebase/database';

// Obtén los álbumes ordenados por clave (id)
export async function getPosts() {
  const albumsRef = query(ref(db, 'albums'), orderByKey()); // Consulta ordenada por clave
  const snapshot = await get(albumsRef);
  return snapshot.val() ? Object.values(snapshot.val()).reverse() : []; // Invertir para mostrar los más recientes primero
}

export async function getAlbum(id) {
  const snapshot = await get(ref(db, `albums/${id}`));
  return snapshot.val();
}

// Obtén todas las rutas dinámicas para los álbumes
export async function getAlbumPaths() {
  const snapshot = await get(ref(db, 'albums'));
  if (!snapshot.exists()) {
    return [];
  }
  const albums = snapshot.val();
  return Object.keys(albums).map(key => ({
    id: key, // Usa la clave como slug
  }));
}

// Obtén los datos de un álbum específico
export async function getAlbum(id) {
  const snapshot = await get(ref(db, `albums/${id}`));
  if (!snapshot.exists()) {
    throw new Error('Álbum no encontrado');
  }
  return snapshot.val();
}
export async function getNews() {
  const snapshot = await get(ref(db, 'news'));
  if (!snapshot.exists()) {
    return [];
  }
  const news = Object.values(snapshot.val());

  // Ordena las noticias por la fecha más reciente
  return news.sort((a, b) => new Date(b.date) - new Date(a.date));
}

export async function getEvents() {
  const snapshot = await get(ref(db, 'events'));
  if (!snapshot.exists()) {
    return [];
  }
  return Object.values(snapshot.val()).sort((a, b) => new Date(a.date) - new Date(b.date));
}

