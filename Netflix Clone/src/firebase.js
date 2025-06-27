import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, 
        getAuth, 
        signInWithEmailAndPassword,
        signOut} from 'firebase/auth';
import {addDoc, 
        collection, 
        getFirestore} from 'firebase/firestore';
import { toast } from "react-toastify";

const firebaseConfig = {
  apiKey: "AIzaSyD4VsUdEHazc4_tTvckjjDX4uA0jqL8zwc",
  authDomain: "netflix-clone-fb71e.firebaseapp.com",
  projectId: "netflix-clone-fb71e",
  storageBucket: "netflix-clone-fb71e.firebasestorage.app",
  messagingSenderId: "439309263989",
  appId: "1:439309263989:web:955be4ea41c389e347443c"
};

const app = initializeApp(firebaseConfig);
const auth=getAuth(app)
const db=getFirestore(app)

const signUp=async(name,email,password)=>{
  try {
    const res=await createUserWithEmailAndPassword(auth,email,password)
    const user=res.user;
    await addDoc(collection(db,"user"),{
      uid:user.uid,
      name,
      authProvider: "local",
      email,
    })
  } catch (error) {
    console.log(error)
    toast.error(error.code.split('/')[1].split('-').join(" "))
  }
}

const login =async(email,password)=>{
  try {
    await signInWithEmailAndPassword(auth,email,password)
  } catch (error) {
    console.log(error);
    toast.error(error.code.split('/')[1].split('-').join(" "))
    
  }
}

const logout=()=>{
  signOut(auth);
}

export {auth,db,login,signUp,logout}