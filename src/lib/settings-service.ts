
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const SETTINGS_COLLECTION = 'settings';
const PROFILE_SETTINGS_DOC = 'profile';

type ProfileSettings = {
    avatarUrl?: string;
    updatedAt?: any;
};

export async function getProfileSettings(): Promise<ProfileSettings> {
    const docRef = doc(db, SETTINGS_COLLECTION, PROFILE_SETTINGS_DOC);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return docSnap.data() as ProfileSettings;
    }
    return {};
}

export async function updateProfileSettings(data: Partial<ProfileSettings>): Promise<void> {
    const docRef = doc(db, SETTINGS_COLLECTION, PROFILE_SETTINGS_DOC);
    await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true });
}
