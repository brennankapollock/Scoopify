import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { db } from './firebase';

interface ToolUsage {
  name: string;
  email: string;
  toolId: string;
  createdAt: string;
  userAgent: string;
  referrer: string;
  timestamp?: Date;
}

export const trackToolUsage = async (data: Omit<ToolUsage, 'createdAt' | 'timestamp'>) => {
  try {
    // Create usage record
    const usageRef = collection(db, 'analytics', 'tools', 'usage');
    await addDoc(usageRef, {
      ...data,
      createdAt: new Date().toISOString(),
      timestamp: new Date(),
    });

    // Also track unique users
    const usersRef = collection(db, 'analytics', 'tools', 'users');
    const userQuery = query(usersRef, where('email', '==', data.email));
    const userDocs = await getDocs(userQuery);
    
    if (userDocs.empty) {
      await addDoc(usersRef, {
        name: data.name,
        email: data.email,
        firstToolUsed: data.toolId,
        firstUsedAt: new Date().toISOString(),
        lastUsedAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error tracking tool usage:', error);
    throw error;
  }
};