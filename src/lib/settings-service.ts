
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const SETTINGS_COLLECTION = 'settings';
const AVATAR_SETTINGS_DOC = 'avatar'; // Changed from 'profile' to 'avatar'

// The settings structure is now specifically for the avatar URL.
type AvatarSettings = {
    url?: string;
    updatedAt?: any;
};

export async function getProfileSettings(): Promise<AvatarSettings> {
    const docRef = doc(db, SETTINGS_COLLECTION, AVATAR_SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as AvatarSettings;
    }
    return {};
}

export async function updateProfileSettings(data: Partial<AvatarSettings>): Promise<void> {
    const docRef = doc(db, SETTINGS_COLLECTION, AVATAR_SETTINGS_DOC);
    // Using setDoc with merge to create or update the document.
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
