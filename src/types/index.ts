export type UserRole = 
  | 'Admin' 
  | 'Finance Manager' 
  | 'Fundraising Manager' 
  | 'Program Manager' 
  | 'Volunteer Manager' 
  | 'Viewer';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  status: 'Active' | 'Invited' | 'Suspended';
  lastActive: string;
}

export interface AuthSession {
  isAuthenticated: boolean;
  user: User;
  token: string;
  isEmailVerified: boolean;
  loginTime: string;
}

export interface Organization {
  name: string;
  tagline: string;
  logo: string;
  registrationNumber: string;
  description: string;
  email: string;
  phone: string;
  website: string;
  address: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  taxExemptStatus: string;
  foundedYear: number;
}

export type CampaignStatus = 'Draft' | 'Active' | 'Paused' | 'Completed' | 'Expired';

export type CampaignCategory = 
  | 'Education' 
  | 'Hunger Relief' 
  | 'Healthcare' 
  | 'Disaster Relief' 
  | 'Women Empowerment' 
  | 'Environment' 
  | 'Child Welfare';

export interface CampaignUpdate {
  id: string;
  date: string;
  title: string;
  content: string;
  author: string;
}

export interface Campaign {
  id: string;
  title: string;
  category: CampaignCategory;
  shortDescription: string;
  fullStory: string;
  goalAmount: number;
  raisedAmount: number;
  donorsCount: number;
  startDate: string;
  endDate: string;
  beneficiaryTarget: number;
  location: string;
  problemStatement: string;
  expectedImpact: string;
  coverImage: string;
  additionalImages?: string[];
  videoUrl?: string;
  status: CampaignStatus;
  projectId?: string;
  expensesAllocated: number;
  featured?: boolean;
  updates?: CampaignUpdate[];
}

export type PaymentStatus = 'Completed' | 'Processing' | 'Failed' | 'Refunded';

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  campaignId: string;
  campaignTitle: string;
  amount: number;
  date: string;
  paymentStatus: PaymentStatus;
  paymentMethod: 'UPI' | 'Card' | 'NetBanking' | 'Bank Transfer' | 'Cheque';
  receiptNumber: string;
  isAnonymous: boolean;
  message?: string;
}

export interface Donor {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  totalDonated: number;
  donationCount: number;
  lastDonationDate: string;
  preferredCategory: CampaignCategory;
  isRecurring: boolean;
  status: 'Active' | 'Lapsed' | 'VIP';
  city: string;
  notes?: string;
  joinedDate: string;
}

export type BeneficiaryCaseStatus = 'Active' | 'Pending' | 'Completed' | 'Follow-up Required';

export interface Beneficiary {
  id: string;
  name: string;
  age: number;
  gender: 'Female' | 'Male' | 'Other' | 'Prefer not to say';
  location: string;
  category: CampaignCategory;
  programId: string;
  programName: string;
  assistanceReceived: string;
  caseStatus: BeneficiaryCaseStatus;
  registrationDate: string;
  lastFollowUpDate: string;
  nextFollowUpDate?: string;
  notes?: string;
  documentsCount: number;
  isSensitive: boolean; // Flag to safeguard sensitive information
}

export type ProjectStatus = 'Planning' | 'Active' | 'On Hold' | 'Completed';

export interface ProjectMilestone {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  category: CampaignCategory;
  location: string;
  startDate: string;
  endDate: string;
  budget: number;
  spent: number;
  beneficiariesCount: number;
  projectLead: {
    name: string;
    avatar: string;
    role: string;
  };
  status: ProjectStatus;
  progressPercentage: number;
  milestones: ProjectMilestone[];
  relatedCampaignId?: string;
}

export type IncomeCategory = 
  | 'Donations' 
  | 'Grants' 
  | 'Sponsorships' 
  | 'Events' 
  | 'Other Income';

export type ExpenseCategory = 
  | 'Program' 
  | 'Food & Provisions' 
  | 'Education Supplies' 
  | 'Medical Supplies' 
  | 'Operations' 
  | 'Salaries & Honorariums' 
  | 'Events & Workshops' 
  | 'Marketing & Outreach' 
  | 'Other Expenses';

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: IncomeCategory | ExpenseCategory;
  type: 'Income' | 'Expense';
  amount: number;
  projectId?: string;
  projectName?: string;
  campaignId?: string;
  campaignName?: string;
  paymentMethod: string;
  status: 'Completed' | 'Pending' | 'Flagged';
  referenceNo: string;
  receiptUrl?: string;
}

export type VolunteerStatus = 'Active' | 'Inactive' | 'On Leave';

export interface Volunteer {
  id: string;
  name: string;
  avatar: string;
  role: string;
  email: string;
  phone: string;
  skills: string[];
  assignedProjectId?: string;
  assignedProjectName?: string;
  hoursContributed: number;
  status: VolunteerStatus;
  joinedDate: string;
  rating?: number;
}

export type NotificationType = 
  | 'donation' 
  | 'campaign_deadline' 
  | 'campaign_milestone' 
  | 'expense_approval' 
  | 'beneficiary_followup' 
  | 'project_milestone';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: string;
  isRead: boolean;
  link?: string;
  urgency?: 'low' | 'medium' | 'high';
}
