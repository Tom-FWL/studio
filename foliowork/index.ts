import * as functions from "firebase-functions";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import * as admin from "firebase-admin";
admin.initializeApp();

export { deleteExpiredProjects } from '../functions/cleanup';

admin.initializeApp();
const db = getFirestore();

export const deleteOldProjects = functions.pubsub
  .schedule("every 24 hours") // run daily
  .timeZone("Asia/Kuala_Lumpur")
  .onRun(async (context) => {
    const now = new Date();
    const cutoffDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000); // 30 days ago
    const snapshot = await db
      .collection("projects")
      .where("isDeleted", "==", true)
      .where("deletedAt", "<=", Timestamp.fromDate(cutoffDate))
      .get();

    const batch = db.batch();
    snapshot.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Deleted ${snapshot.size} old projects.`);
    return null;
  });
