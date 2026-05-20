export interface QuotationItem {
  id: string;
  serviceName: string;
  description: string;
  price: number;
  quantity: number;
  total: number;
}

export interface Quotation {
  id?: string;
  userId: string;
  quotationNumber: string;
  documentTitle?: string;
  date: string;
  companyLogo?: string;
  companyName: string;
  companyAddress: string;
  clientName: string;
  clientAddress: string;
  clientPhone: string;
  items: QuotationItem[];
  totalAmount: number;
  notes: string;
  authorizedPerson?: string;
  createdAt?: any;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  year: string;
}

export interface CV {
  id?: string;
  userId: string;
  fullName: string;
  profession: string;
  profilePhoto?: string;
  aboutMe: string;
  email: string;
  phone: string;
  address: string;
  skills: string[];
  languages: { language: string; proficiency: string }[];
  hobbies: string[];
  experience: Experience[];
  education: Education[];
  socialLinks: { platform: string; url: string }[];
  createdAt?: any;
}

export interface Receipt {
  id?: string;
  userId: string;
  receiptNumber: string;
  date: string;
  companyLogo?: string;
  receivedFrom: string;
  amount: number;
  paymentMethod: string;
  purpose: string;
  authorizedPerson?: string;
  createdAt?: any;
}
