import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase/config";

const COLLECTION = "scanHistory";

export const saveUserHistoryItem = async (item) => {
  await addDoc(collection(db, COLLECTION), item);
};

export const getUserHistory = async (uid) => {
  const q = query(
    collection(db, COLLECTION),
    where("uid", "==", uid)
  );

  const snapshot = await getDocs(q);

  const data = snapshot.docs.map((d) => ({
    id: d.id,
    ...d.data(),
  }));

  return data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
};

export const deleteUserHistoryItem = async (id) => {
  await deleteDoc(doc(db, COLLECTION, id));
};