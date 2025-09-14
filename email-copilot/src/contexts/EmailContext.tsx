import React, { createContext, useContext, useState } from 'react';

export interface EmailData {
  id: string;
  sender: string;
  senderEmail: string;
  subject: string;
  content: string;
  timestamp: string;
}

interface EmailContextType {
  selectedEmail: EmailData | null;
  setSelectedEmail: (email: EmailData) => void;
}

const EmailContext = createContext<EmailContextType | undefined>(undefined);

export const useEmail = () => {
  const context = useContext(EmailContext);
  if (context === undefined) {
    throw new Error('useEmail must be used within an EmailProvider');
  }
  return context;
};

// Mock email data with full content
const emailDatabase: EmailData[] = [
  {
    id: '1',
    sender: 'John Doe',
    senderEmail: 'john.doe@company.com',
    subject: 'Project Update - Q3 Milestones',
    content: `Hi there,

I hope this email finds you well. I wanted to provide you with an update on our Q3 project milestones and discuss the next steps for our upcoming deliverables.

**Progress Summary:**
- ✅ Phase 1: Requirements gathering completed
- ✅ Phase 2: Design mockups approved by stakeholders
- 🔄 Phase 3: Development in progress (80% complete)
- ⏳ Phase 4: Testing and QA scheduled for next week

**Key Achievements:**
1. Successfully integrated the new authentication system
2. Improved application performance by 35%
3. Resolved all critical security vulnerabilities

**Next Steps:**
- Complete remaining development tasks by Friday
- Begin comprehensive testing on Monday
- Prepare deployment documentation

I'd love to schedule a brief call this week to discuss any concerns and align on priorities for the final sprint.

Please let me know your availability for Tuesday or Wednesday afternoon.

Best regards,
John`,
    timestamp: '2 hours ago'
  },
  {
    id: '2',
    sender: 'Sarah Wilson',
    senderEmail: 'sarah.wilson@company.com',
    subject: 'Meeting Schedule - Tomorrow\'s Presentation',
    content: `Hi,

Can we reschedule our meeting for tomorrow? I have a conflict with the client presentation that just came up.

Would Thursday at 2 PM work for you instead? We can still cover all the agenda items we planned.

Let me know if this works.

Thanks,
Sarah`,
    timestamp: '4 hours ago'
  },
  {
    id: '3',
    sender: 'Tech Support',
    senderEmail: 'support@company.com',
    subject: 'System Maintenance Notification',
    content: `Dear Team,

Scheduled maintenance will occur this weekend from Saturday 11 PM to Sunday 6 AM.

**What to expect:**
- Email services will be temporarily unavailable
- File servers will be offline during this period
- All systems will be fully restored by Sunday morning

**Preparation needed:**
- Save any work locally before Saturday evening
- Plan for offline access to critical documents
- Contact IT if you have urgent weekend requirements

We apologize for any inconvenience.

Best regards,
IT Support Team`,
    timestamp: '1 day ago'
  }
];

export const EmailProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedEmail, setSelectedEmailState] = useState<EmailData | null>(emailDatabase[0]);

  const setSelectedEmail = (email: EmailData) => {
    setSelectedEmailState(email);
  };

  return (
    <EmailContext.Provider
      value={{
        selectedEmail,
        setSelectedEmail
      }}
    >
      {children}
    </EmailContext.Provider>
  );
};

export { emailDatabase };