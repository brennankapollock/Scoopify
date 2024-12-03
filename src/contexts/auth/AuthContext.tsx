import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  sendEmailVerification
} from 'firebase/auth';
import { doc, getDoc, setDoc, collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase';
import { BusinessOnboardingData } from '../../types/business';
import { OnboardingData } from '../../types/onboarding';

export type UserRole = 'admin' | 'manager' | 'employee' | 'business_owner' | 'customer';

interface AuthUser extends User {
  role?: UserRole;
  businessId?: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signUp: (email: string, password: string, role: UserRole) => Promise<{ user: AuthUser }>;
  signIn: (email: string, password: string) => Promise<{ role: UserRole; businessId?: string; userId: string }>;
  logOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  createBusiness: (businessData: BusinessOnboardingData) => Promise<string>;
  updateBusiness: (businessId: string, businessData: Partial<BusinessOnboardingData>) => Promise<void>;
  getBusiness: (businessId: string) => Promise<BusinessOnboardingData | null>;
  createCustomer: (businessId: string, customerData: OnboardingData) => Promise<string>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const sanitizeData = (data: any): any => {
  if (!data) return data;
  
  const cleaned = Object.entries(data).reduce((acc, [key, value]) => {
    if (value === undefined || typeof value === 'function') return acc;
    
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      const cleanedNested = sanitizeData(value);
      if (Object.keys(cleanedNested).length > 0) {
        acc[key] = cleanedNested;
      }
      return acc;
    }
    
    if (Array.isArray(value)) {
      acc[key] = value.map(item => 
        typeof item === 'object' ? sanitizeData(item) : item
      ).filter(item => item !== undefined);
      return acc;
    }
    
    acc[key] = value;
    return acc;
  }, {} as any);

  return cleaned;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const userData = userDoc.data();
          const userWithRole = { 
            ...user, 
            role: userData?.role as UserRole,
            businessId: userData?.businessId
          };
          setUser(userWithRole);
        } catch (error) {
          console.error('Error fetching user data:', error);
          setUser(user);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, role: UserRole) => {
    try {
      const { user } = await createUserWithEmailAndPassword(auth, email, password);
      
      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        email,
        role,
        createdAt: new Date().toISOString(),
      });

      // Send verification email
      await sendEmailVerification(user);

      return { user: { ...user, role } as AuthUser };
    } catch (error) {
      console.error('Error during sign up:', error);
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      const userData = userDoc.data();
      
      return {
        role: userData?.role as UserRole,
        businessId: userData?.businessId,
        userId: user.uid,
      };
    } catch (error) {
      console.error('Error during sign in:', error);
      throw error;
    }
  };

  const logOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error during sign out:', error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      console.error('Error sending password reset email:', error);
      throw error;
    }
  };

  const createBusiness = async (businessData: BusinessOnboardingData): Promise<string> => {
    if (!user) throw new Error('No authenticated user');

    try {
      const sanitizedData = sanitizeData({
        ...businessData,
        ownerId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      
      // Create business document
      const businessRef = doc(db, 'businesses', user.uid);
      await setDoc(businessRef, sanitizedData);

      // Update user document with businessId
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        businessId: user.uid,
        role: 'business_owner',
      }, { merge: true });

      return user.uid;
    } catch (error) {
      console.error('Error creating business:', error);
      throw error;
    }
  };

  const updateBusiness = async (businessId: string, businessData: Partial<BusinessOnboardingData>) => {
    if (!user) throw new Error('No authenticated user');

    try {
      // Clean the data by removing undefined values and functions
      const cleanedData = JSON.parse(JSON.stringify({
        ...businessData,
        updatedAt: new Date().toISOString(),
      }));

      // Update business document
      const businessRef = doc(db, 'businesses', businessId);
      await setDoc(businessRef, cleanedData, { merge: true });
    } catch (error) {
      console.error('Error updating business:', error);
      throw error;
    }
  };

  const getBusiness = async (businessId: string): Promise<BusinessOnboardingData | null> => {
    try {
      const businessDoc = await getDoc(doc(db, 'businesses', businessId));
      if (businessDoc.exists()) {
        return businessDoc.data() as BusinessOnboardingData;
      }
      return null;
    } catch (error) {
      console.error('Error fetching business:', error);
      throw error;
    }
  };

  const createCustomer = async (businessId: string, customerData: OnboardingData): Promise<string> => {
    try {
      const sanitizedData = sanitizeData(customerData);
      
      // Create customer document
      const customersRef = collection(db, 'businesses', businessId, 'customers');
      const customerDoc = await addDoc(customersRef, {
        ...sanitizedData,
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return customerDoc.id;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  };

  const createEmployee = async (businessId: string, employeeData: Employee, password: string): Promise<string> => {
    try {
      // Create auth user
      const { user } = await createUserWithEmailAndPassword(auth, employeeData.email, password);
      
      // Create user document
      await setDoc(doc(db, 'users', user.uid), {
        email: employeeData.email,
        role: 'employee',
        businessId,
        createdAt: new Date().toISOString(),
      });

      // Create employee document
      const employeesRef = collection(db, 'businesses', businessId, 'employees');
      const employeeDoc = await addDoc(employeesRef, {
        ...employeeData,
        userId: user.uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return employeeDoc.id;
    } catch (error) {
      console.error('Error creating employee:', error);
      throw error;
    }
  };
  const value = {
    user,
    loading,
    signUp,
    signIn,
    logOut,
    resetPassword,
    createBusiness,
    updateBusiness,
    getBusiness,
    createCustomer,
    createEmployee,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;