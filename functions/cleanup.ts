import * as admin from 'firebase-admin';
import { onSchedule } from 'firebase-functions/v2/scheduler';

const DAYS = 30;

export const deleteExpiredProjects = onSchedule(
  { schedule: 'every 24 hours', timeZone: 'UTC' },
  async () => {
    const db = admin.firestore();
    const bucket = admin.storage().bucket();

    const cutoff = admin.firestore.Timestamp.fromDate(
      new Date(Date.now() - DAYS * 24 * 60 * 60 * 1000)
    );

    const snap = await db
      .collection('projects')
      .where('isDeleted', '==', true)
      .where('deletedAt', '<=', cutoff)
      .get();

    for (const doc of snap.docs) {
      const data = doc.data() || {};
      const mediaPaths: string[] = Array.isArray(data.mediaPaths) ? data.mediaPaths : [];

      // Delete Storage files (ignore if already gone)
      for (const path of mediaPaths) {
        try {
          await bucket.file(path).delete({ ignoreNotFound: true });
        } catch (e) {
          console.error(`Failed to delete file ${path}:`, e);
        }
      }

      // Delete Firestore doc
      try {
        await doc.ref.delete();
      } catch (e) {
        console.error(`Failed to delete project ${doc.id}:`, e);
      }
    }
  }
);
