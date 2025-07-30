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

export interface CreateBoardType {
  title: string;
  description?: string;
  emoji?: string;
  createdBy: string | undefined;
  sections?: {
    title: string;
    createdBy: string | undefined;
    tasks: {
      title: string;
      description?: string;
      assignedTo?: string;
      dueDate?: Date;
      difficulty: "low" | "medium" | "hard";
      priority: "low" | "medium" | "high";
      attachments?: string[];
      createdBy: string | undefined;
    }[];
  }[];
}

export interface CreateSection {
  title: string;
  createdBy: string | undefined;
  tasks?: CreateTask[];
  board: string;
  position: number;
}

export interface CreateTask {
  title: string;
  description?: string;
  assignedTo?: string | undefined;
  dueDate?: Date | undefined;
  difficulty: "low" | "medium" | "hard";
  priority: "low" | "medium" | "high";
  attachments?: string[];
  createdBy: string | undefined;
  board: string;
  section: string;
}

export interface Board {
  _id: string;
  title: string;
  description?: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  emoji?: string;
  isFavourite: boolean;
  sections?: Section[];
  createdAt: string;
  updatedAt: string;
}

export interface Section {
  _id: string;
  title: string;
  position: string;
  createdBy: string;
  tasks: Task[];
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  assignedTo?: {
    _id: string;
    name: string;
    email: string;
    avatar: string;
  };
  dueDate?: Date;
  difficulty: "low" | "medium" | "hard";
  priority: "low" | "medium" | "high";
  attachments?: string[];
  isCompleted: boolean;
  completedBy?: string;
  createdBy: string;
  section: string;
  board: string;
  taskId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum SelectDifficultyValue {
  LOW = "low",
  MEDIUM = "medium",
  HARD = "hard",
}

export enum SelectPriorityValue {
  LOW = "low",
  MEDIUM = "medium",
  HIGH = "high",
}

export interface SelectOption {
  name: string;
  code: string;
}
