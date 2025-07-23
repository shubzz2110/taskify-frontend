export interface User {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  signedUpFrom: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}
