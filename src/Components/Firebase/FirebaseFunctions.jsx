import { useState, useEffect } from "react";
import { auth, firebaseApp } from "./FirebaseConfig";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import {
  collection,
  addDoc,
  getFirestore,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  query,
  onSnapshot,
  where,
  Timestamp,
  setDoc,
  deleteDoc,
  runTransaction,
  Firestore,
} from "firebase/firestore";
export const createUser = async (email, pw, firstName, lastName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      pw
    );

    const user = userCredential.user;

    await updateProfile(user, {
      displayName: `${firstName} ${lastName}`,
    });

    return user;
  } catch (error) {
    throw error;
  }
};

export const login = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    throw error;
  }
};

export const loginWithGoogle = async () => {
  try {
    const googleProvider = new GoogleAuthProvider();
    await signInWithPopup(auth, googleProvider);
  } catch (error) {
    throw error;
  }
};
export const useAuthStatus = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup function to unsubscribe from the listener
    return () => unsubscribe();
  }, []);

  const isLoggedin = !!user; // Determine if user is logged in

  return { user, isLoggedin }; // Return both user and login status
};
export const logout = async () => {
  await signOut(auth);
};
const db = getFirestore(firebaseApp);
export const storeData = async (name, message, id) => {
  try {
    const timestamp = Timestamp.now().toDate();
    await addDoc(collection(db, "posts"), {
      name,
      message,
      id,
      timestamp,
    });
    console.log("Document added successfully!");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
};

// Define a variable to store cached data
let cachedData = null;

export const fetchData = async () => {
  // Check if cached data exists and return it if available
  if (cachedData) {
    return cachedData;
  }

  const db = getFirestore();
  const dataCollection = collection(db, "posts");

  try {
    const querySnapshot = await getDocs(dataCollection);
    const postData = []; // Array to collect fetched data

    querySnapshot.forEach((doc) => {
      postData.push({ postId: doc.id, ...doc.data() }); // Push document data along with postId into the array
    });

    // Sort the data by timestamp
    const newPostData = postData.sort((a, b) => b.timestamp - a.timestamp);

    // Update the cached data
    cachedData = newPostData;

    return newPostData; // Return the array containing fetched data
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error; // Throw the error to be caught by the caller
  }
};

//LIKE POST
export const likePost = async (userId, postId) => {
  const likeRef = doc(db, "likes", `${userId}_${postId}`);

  try {
    await runTransaction(db, async (transaction) => {
      // Check if the like document exists within the transaction
      const likeDoc = await transaction.get(likeRef);

      if (likeDoc.exists()) {
        // Unlike the post if already liked
        transaction.delete(likeRef);
      } else {
        // Like the post if not already liked
        transaction.set(likeRef, { userId, postId });
      }
    });
  } catch (error) {
    console.error("Error toggling like:", error);
    throw error;
  }
};

// Function to get likes count for a specific post
export const getLikesCount = async (postId) => {
  try {
    const likeQuery = query(
      collection(db, "likes"),
      where("postId", "==", postId)
    );

    const querySnapshot = await getDocs(likeQuery);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error getting likes count:", error);
    throw error;
  }
};

// Function to check if the current user has liked a post
export const isPostLikedByUser = async (userId, postId) => {
  try {
    const likeRef = doc(db, "likes", `${userId}_${postId}`);
    const likeDoc = await getDoc(likeRef);
    return likeDoc.exists();
  } catch (error) {
    console.error("Error checking if post is liked by user:", error);
    throw error;
  }
};
const commentsCollection = collection(db, "comments");

export const postComments = async (postId, comment) => {
  try {
      const timestamp = Timestamp.now().toDate();
    

    

    await addDoc(commentsCollection, {
      postId,
      timestamp,
      comment,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};
export const getComments = async (postId, setuserComments) => {
  try {
    let commentQuery = query(commentsCollection, where("postId", "==", postId));

    onSnapshot(commentQuery, (res) => {
      const comments = res.docs.map((doc) => {
        return {
          id: doc.id,
          ...doc.data(),
        };
      });

      // Sort comments based on the timestamp property in descending order
      comments.sort((a, b) => {
        const timeA = a.timestamp;
        const timeB = b.timestamp;

        return timeB - timeA;
      });

      setuserComments(comments);
    });
  } catch (error) {
    console.error(error);
  }
};


