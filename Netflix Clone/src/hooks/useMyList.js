import { useState, useEffect } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  doc,
  setDoc,
  deleteDoc,
  collection,
  onSnapshot,
} from "firebase/firestore";

const useMyList = () => {
  const [myList, setMyList] = useState([]);
  const [user, setUser] = useState(null);

  // Listen to auth state changes
  useEffect(() => {
    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
    });
    return () => unsubAuth();
  }, []);

  // Real-time listener on the user's myList Firestore subcollection
  useEffect(() => {
    if (!user) {
      setMyList([]);
      return;
    }
    const listRef = collection(db, "users", user.uid, "myList");
    const unsubSnap = onSnapshot(listRef, (snapshot) => {
      const items = snapshot.docs.map((d) => d.data());
      setMyList(items);
    });
    return () => unsubSnap();
  }, [user]);

  const addItem = async (item) => {
    if (!user) return;
    const itemRef = doc(db, "users", user.uid, "myList", String(item.id));
    await setDoc(itemRef, item);
  };

  const removeItem = async (itemId) => {
    if (!user) return;
    const itemRef = doc(db, "users", user.uid, "myList", String(itemId));
    await deleteDoc(itemRef);
  };

  const isInList = (itemId) => myList.some((item) => item.id === itemId);

  return { myList, addItem, removeItem, isInList };
};

export default useMyList;
