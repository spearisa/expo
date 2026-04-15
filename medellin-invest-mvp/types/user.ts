export type UserRole = 'buyer' | 'broker';

export type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl: string;
  joinedAt: string;
  phone?: string;
  agency?: string;
};

export type Inquiry = {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyImage: string;
  message: string;
  status: 'pending' | 'replied' | 'closed';
  sentAt: string;
};
