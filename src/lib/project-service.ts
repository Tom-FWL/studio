import { db, auth } from './firebase';
import { v4 as uuidv4 } from 'uuid';
import {
  collection,
  setDoc,
  addDoc,
  getDocs,
  getDoc,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc
} from 'firebase/firestore';

// ---------- Project CRUD (scoped under user) ----------

// Add new project
export async function addProject(data: any) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const colRef = collection(db, 'users', user.uid, 'projects');
  const docRef = await addDoc(colRef, data);
  return docRef;
}

// Get all projects for the current user
export async function getProjects() {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const colRef = collection(db, 'users', user.uid, 'projects');
  const snapshot = await getDocs(colRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
}

// Delete a project
export async function deleteProject(projectId: string) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const docRef = doc(db, 'users', user.uid, 'projects', projectId);
  await deleteDoc(docRef);
}

// Update a project
export async function updateProject(projectId: string, data: any) {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');
  const docRef = doc(db, 'users', user.uid, 'projects', projectId);
  await updateDoc(docRef, data);
}

// ---------- Likes (shared projects liked globally) ----------

// Toggle like/unlike for a project by a unique user or guest
export async function toggleLikeProject(projectId: string) {
  let uid = auth.currentUser?.uid;

  // Fallback to anonymous session
  if (!uid) {
    uid = localStorage.getItem('sessionId') || uuidv4();
    localStorage.setItem('sessionId', uid);
  }

  const likeRef = doc(db, 'projects', projectId, 'likes', uid);
  const likeSnap = await getDoc(likeRef);

  if (likeSnap.exists()) {
    await deleteDoc(likeRef); // Unlike
  } else {
    await setDoc(likeRef, { likedAt: new Date() }); // Like
  }
}

// Get total likes for a project
export async function getProjectLikeCount(projectId: string): Promise<number> {
  const likesRef = collection(db, 'projects', projectId, 'likes');
  const snapshot = await getDocs(likesRef);
  return snapshot.size;
}

//Detection of Projects Existence for Runtime
export async function softDeleteProject(userId: string, projectId: string) {
  const projectRef = doc(db, 'users', userId, 'projects', projectId);
  await updateDoc(projectRef, {
    isDeleted: true,
    deletedAt: new Date()
  });
}