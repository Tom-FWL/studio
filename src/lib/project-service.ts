
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, getDoc, orderBy, serverTimestamp, Timestamp, increment } from 'firebase/firestore';
import { db } from './firebase';
import type { Project } from './types';

function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}

const getMediaType = (url: string) => (url.endsWith('.mp4') ? 'video' : 'image');

// Helper to safely convert Firestore data to a serializable Project object
function toSerializableProject(doc: any): Project {
    const data = doc.data();
    return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate().toISOString() : null,
        likes: data.likes || 0,
    } as Project;
}


// Create a new project in Firestore
export async function addProject(projectData: Omit<Project, 'slug' | 'id' | 'mediaType' | 'createdAt' | 'audioUrl' | 'likes'>): Promise<Project> {
  let slug = slugify(projectData.title);
  
  // Ensure slug is unique
  const q = query(collection(db, 'projects'), where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  if (!querySnapshot.empty) {
    slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
  }

  const newProjectData = {
    ...projectData,
    slug,
    mediaType: getMediaType(projectData.mediaUrl),
    createdAt: serverTimestamp(),
    likes: 0,
  };

  const docRef = await addDoc(collection(db, 'projects'), newProjectData);
  
  return {
    ...newProjectData,
    id: docRef.id,
  } as Project;
}

// Fetch all projects from Firestore
export async function getProjects(): Promise<Project[]> {
  const projectsCol = collection(db, 'projects');
  const q = query(projectsCol, orderBy('createdAt', 'desc'));
  const projectSnapshot = await getDocs(q);
  const projectList = projectSnapshot.docs.map(toSerializableProject);
  return projectList;
}

// Fetch a single project by its slug
export async function getProjectBySlug(slug: string): Promise<Project | undefined> {
  const q = query(collection(db, 'projects'), where('slug', '==', slug));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) {
    return undefined;
  }
  const docRef = querySnapshot.docs[0];
  return toSerializableProject(docRef);
}

// Fetch a single project by its ID
export async function getProjectById(id: string): Promise<Project | undefined> {
    const projectDoc = doc(db, 'projects', id);
    const docSnap = await getDoc(projectDoc);
    if (!docSnap.exists()) {
        return undefined;
    }
    return toSerializableProject(docSnap);
}

// Update an existing project in Firestore
export async function updateProject(id: string, projectData: Omit<Project, 'id' | 'slug' | 'mediaType' | 'createdAt' | 'audioUrl' | 'likes'>): Promise<void> {
  const projectDoc = doc(db, 'projects', id);
  await updateDoc(projectDoc, {
    ...projectData,
    mediaType: getMediaType(projectData.mediaUrl),
  });
}

// Increment likes for a project
export async function likeProject(id: string): Promise<void> {
  const projectDoc = doc(db, 'projects', id);
  await updateDoc(projectDoc, {
    likes: increment(1),
  });
}

// Delete a project from Firestore
export async function deleteProject(id: string): Promise<void> {
  const projectDoc = doc(db, 'projects', id);
  await deleteDoc(projectDoc);
}

// Add contact form submission
export async function addContactMessage(data: { email: string; name: string; message: string; }) {
    await addDoc(collection(db, "contacts"), {
        ...data,
        submittedAt: serverTimestamp(),
    });
}
