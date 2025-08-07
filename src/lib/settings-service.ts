import { db, auth } from './firebase';
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from 'firebase/firestore';

type AvatarSettings = {
  url?: string;
  updatedAt?: any;
};

export async function getProfileSettings(): Promise<AvatarSettings> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const docRef = doc(db, 'users', user.uid, 'media', 'avatar');
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return docSnap.data() as AvatarSettings;
  }

  return {};
}

export async function updateProfileSettings(data: Partial<AvatarSettings>): Promise<void> {
  const user = auth.currentUser;
  if (!user) throw new Error('User not authenticated');

  const docRef = doc(db, 'users', user.uid, 'media', 'avatar');
  await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}