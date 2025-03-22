import { createContext, useContext, useEffect, useState } from 'react';
import { 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });
    const result = await signInWithPopup(auth, provider);
    await saveUserData(result.user);
    navigate('/dashboard');
  }

  async function signup(email, password, name) {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await saveUserData({ ...result.user, displayName: name });
    navigate('/dashboard');
  }

  async function login(email, password) {
    await signInWithEmailAndPassword(auth, email, password);
    navigate('/dashboard');
  }

  async function logout() {
    await signOut(auth);
    navigate('/login');
  }

  async function saveUserData(user) {
    try {
      const userRef = doc(db, 'users', user.uid);
      const userData = {
        name: user.displayName || 'User',
        email: user.email,
        photoURL: user.photoURL || null,
        lastLogin: new Date().toISOString()
      };
      await setDoc(userRef, userData, { merge: true });
    } catch (error) {
      console.error('Error saving user data:', error);
      // Continue even if saving user data fails
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || 'User',
          photoURL: user.photoURL
        });
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    signInWithGoogle,
    signup,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
