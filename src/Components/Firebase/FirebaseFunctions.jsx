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
  runTransaction,
} from "firebase/firestore";
const db = getFirestore(firebaseApp);
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

    return () => unsubscribe();
  }, []);

  const isLoggedin = !!user;

  return { user, isLoggedin };
};
export const logout = async () => {
  await signOut(auth);
};

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
export const likePost = async (userId, postId, myname) => {
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
        transaction.set(likeRef, { userId, postId, myname });
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
//FUNCTION TO POST COMMENTS
export const postComments = async (myname, postId, comment) => {
  try {
    const timestamp = Timestamp.now().toDate();

    await addDoc(commentsCollection, {
      postId,
      timestamp,
      comment,
      myname,
    });
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};
//FUNCTION TO FETCH COMMENTS
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

// Function to send a connection request AND RETURN CONNECTION ID
export const sendConnectionRequest = async (
  senderId,
  receiverId,
  senderName,
  receiverName
) => {
  try {
    const timestamp = Timestamp.now().toDate();
    const connectionDocRef = await addDoc(collection(db, "connections"), {
      senderId,
      receiverId,
      status: "pending",
      timestamp,
      senderName,
      receiverName,
    });

    console.log("Connection request sent successfully!");
    return connectionDocRef.id; // Return the connection ID
  } catch (error) {
    console.error("Error sending connection request:", error);
    throw error;
  }
};

export const checkConnectionRequest = async (senderId, receiverId) => {
  try {
  
    const connectionQuerySender = query(
      collection(db, "connections"),
      where("senderId", "==", senderId),
      where("receiverId", "==", receiverId),
      where("status", "in", ["pending", "accepted"])
    );

    const connectionQueryReceiver = query(
      collection(db, "connections"),
      where("senderId", "==", receiverId),
      where("receiverId", "==", senderId),
      where("status", "in", ["pending", "accepted"])
    );

    const [senderSnapshot, receiverSnapshot] = await Promise.all([
      getDocs(connectionQuerySender),
      getDocs(connectionQueryReceiver),
    ]);

    // Check if either sender or receiver has a pending or accepted connection request
    if (
      (senderSnapshot.docs && senderSnapshot.docs.length > 0) ||
      (receiverSnapshot.docs && receiverSnapshot.docs.length > 0)
    ) {
      // There is a pending or accepted connection request
      return true;
    } else {
      // No pending or accepted connection request found
      return false;
    }
  } catch (error) {
    console.error("Error checking connection request:", error);
    throw error;
  }
};

// Function to update the status of a connection request
export const updateConnectionRequestStatus = async (connectionId, status) => {
  try {
    const connectionRef = doc(db, "connections", connectionId);

    await updateDoc(connectionRef, { status });
    console.log("Connection request status updated successfully!");
  } catch (error) {
    console.error("Error updating connection request status:", error);
    throw error;
  }
};

// FUNCTION TO ACCEPT A CONNECTION REQUEST
export const acceptConnectionRequest = async (connectionId) => {
  try {
    const connectionDocRef = doc(db, "connections", connectionId);

    const connectionDocSnapshot = await getDoc(connectionDocRef);
    if (connectionDocSnapshot.exists()) {
      // Update the connection status to "accepted" or perform other actions
      await updateDoc(connectionDocRef, { status: "accepted" });
      console.log("Connection accepted successfully!");
    } else {
      console.error("Connection document does not exist");
    }
  } catch (error) {
    console.error("Error accepting connection:", error);
    throw error;
  }
};
//FUNCTION TO DECLINE A CONNECTION REQUEST
export const declineConnectionRequest = async (connectionId) => {
  try {
    const connectionDocRef = doc(db, "connections", connectionId);
    await updateDoc(connectionDocRef, { status: "declined" });
    console.log("Connection request declined successfully!");
  } catch (error) {
    console.error("Error declining connection request:", error);
    throw error;
  }
};

export const checkConnectionRequestsData = async (userId) => {
  try {
    // Fetch connection requests where the current user is either the sender or receiver
    const snapshot = await getDocs(
      collection(db, "connections"),
      where("senderId", "==", userId),
      where("receiverId", "==", userId)
    );

    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));

    return requests;
  } catch (error) {
    console.error("Error fetching connection requests:", error);
    throw error;
  }
};

// Function to get connections for a user
export const getConnectionsForUser = async (userId) => {
  const connectionQuery = query(
    collection(db, "connections"),
    where("senderId", "==", userId),
    where("status", "==", "accepted")
  );

  const connectionSnapshot = await getDocs(connectionQuery);
  const connections = [];

  connectionSnapshot.forEach((doc) => {
    connections.push(doc.data());
  });

  return connections;
};
//FUNCTION TO FETCH ALL THE ACCEPTED REQUESTS
export const getConnectionsByStatus = async (receiverId, senderId) => {
  try {
    const q = query(
      collection(db, "connections"),
      where("receiverId", "==", receiverId),
      where("senderId", "==", senderId),
      where("status", "==", "accepted")
    );

    const snapshot = await getDocs(q);

    const connections = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));

    return connections;
  } catch (error) {
    console.error("Error fetching connections:", error);
    throw error;
  }
};
//FUNCTION TO FETCH ALL ACCEPTED CONNECTION REQUESTS WHERE THE LOGGEDIN USER IS RECEIVER
export const acceptedRequests = async (userId) => {
  try {
    const q = collection(db, "connections");

    const snapshot = await getDocs(
      query(
        q,
        where("receiverId", "==", userId),
        where("status", "==", "accepted")
      )
    );

    const connections = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    console.log(connections);
    return connections;
  } catch (error) {
    console.error("Error fetching connections:", error);
    throw error;
  }
};
//FUNCTION TO FETCH ALL ACCEPTED CONNECTION REQUESTS WHERE THE LOGGEDIN USER IS SENDER
export const acceptedRequests2 = async (userId) => {
  try {
    const q = collection(db, "connections");

    const snapshot = await getDocs(
      query(
        q,
        where("status", "==", "accepted"),
        where("senderId", "==", userId)
      )
    );

    const connections = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    console.log(connections);
    return connections;
  } catch (error) {
    console.error("Error fetching connections:", error);
    throw error;
  }
};
////FUNCTION TO FETCH ALL PENDING CONNECTION REQUESTS WHERE THE LOGGEDIN USER IS RECEIVER

export const pendingRequests = async (userId) => {
  try {
    const q = collection(db, "connections");

    const snapshot = await getDocs(
      query(
        q,
        where("status", "==", "pending"),
        where("receiverId", "==", userId)
      )
    );

    const connections = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    console.log(connections);
    return connections;
  } catch (error) {
    console.error("Error fetching connections:", error);
    throw error;
  }
};
//FUNCTION TO FETCH ALL PENDING CONNECTION REQUESTS WHERE THE LOGGEDIN USER IS SENDER

export const pendingRequests2 = async (userId) => {
  try {
    const q = collection(db, "connections");

    const snapshot = await getDocs(
      query(
        q,
        where("status", "==", "pending"),
        where("senderId", "==", userId)
      )
    );

    const connections = snapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    console.log(connections);
    return connections;
  } catch (error) {
    console.error("Error fetching connections:", error);
    throw error;
  }
};
