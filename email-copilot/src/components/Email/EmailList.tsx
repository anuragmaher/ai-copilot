import React from 'react';
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Box,
  Divider,
  IconButton,
  Badge
} from '@mui/material';
import {
  Email,
  Inbox,
  Send,
  Drafts,
  StarBorder,
  LabelImportant,
  Delete,
  Label
} from '@mui/icons-material';
import { useEmail, emailDatabase } from '../../contexts/EmailContext';

interface EmailItem {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
}

const mockEmails: EmailItem[] = [
  {
    id: '1',
    sender: 'John Doe',
    subject: 'Project Update',
    preview: 'Hi, I wanted to update you on the progress...',
    timestamp: '2h ago',
    isRead: false
  },
  {
    id: '2',
    sender: 'Sarah Wilson',
    subject: 'Meeting Schedule',
    preview: 'Can we reschedule our meeting for tomorrow?',
    timestamp: '4h ago',
    isRead: true
  },
  {
    id: '3',
    sender: 'Tech Support',
    subject: 'System Maintenance',
    preview: 'Scheduled maintenance will occur this weekend...',
    timestamp: '1d ago',
    isRead: false
  },
  {
    id: '4',
    sender: 'Marketing Team',
    subject: 'Campaign Results',
    preview: 'The Q3 campaign results are now available...',
    timestamp: '2d ago',
    isRead: true
  }
];

const gmailSidebarItems = [
  { icon: <Inbox />, label: 'Inbox', count: 4, active: true },
  { icon: <StarBorder />, label: 'Starred', count: 0 },
  { icon: <Send />, label: 'Sent', count: 0 },
  { icon: <Drafts />, label: 'Drafts', count: 2 },
  { icon: <LabelImportant />, label: 'Important', count: 0 },
  { icon: <Delete />, label: 'Trash', count: 0 },
  { icon: <Label />, label: 'All Mail', count: 0 },
];

const EmailList: React.FC = () => {
  const { selectedEmail, setSelectedEmail } = useEmail();
  const [selectedFolder, setSelectedFolder] = React.useState<string>('Inbox');

  const handleEmailClick = (emailId: string) => {
    const fullEmail = emailDatabase.find(email => email.id === emailId);
    if (fullEmail) {
      setSelectedEmail(fullEmail);
    }
  };

  const handleFolderClick = (folder: string) => {
    setSelectedFolder(folder);
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Gmail-style sidebar navigation */}
      <Box sx={{ px: 1, py: 2 }}>
        <List dense sx={{ py: 0 }}>
          {gmailSidebarItems.map((item) => (
            <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selectedFolder === item.label}
                onClick={() => handleFolderClick(item.label)}
                sx={{
                  borderRadius: '0 20px 20px 0',
                  mr: 1,
                  minHeight: '32px',
                  px: 2,
                }}
              >
                <ListItemAvatar sx={{ minWidth: '32px', mr: 1 }}>
                  <Box sx={{ color: item.active ? 'primary.main' : 'text.secondary', display: 'flex' }}>
                    {item.icon}
                  </Box>
                </ListItemAvatar>
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    variant: 'body2',
                    fontWeight: item.active ? 500 : 400,
                    fontSize: '0.875rem'
                  }}
                />
                {item.count > 0 && (
                  <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                    {item.count}
                  </Typography>
                )}
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      <Divider sx={{ mx: 2 }} />

      {/* Email list section */}
      <Box sx={{ flexGrow: 1, overflow: 'auto', px: 1 }}>
        <Typography variant="body2" color="text.secondary" sx={{ p: 2, fontWeight: 500 }}>
          Recent Emails
        </Typography>
        <List sx={{ p: 0 }}>
          {mockEmails.slice(0, 3).map((email) => (
            <ListItem key={email.id} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                selected={selectedEmail?.id === email.id}
                onClick={() => handleEmailClick(email.id)}
                sx={{
                  borderRadius: 1,
                  mx: 1,
                  py: 1,
                  '&.Mui-selected': {
                    bgcolor: 'rgba(26, 115, 232, 0.08)',
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar sx={{ width: 28, height: 28, bgcolor: 'primary.main' }}>
                    <Typography variant="caption" color="white">
                      {email.sender.split(' ').map(n => n[0]).join('')}
                    </Typography>
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Typography
                      variant="body2"
                      fontWeight={!email.isRead ? 600 : 400}
                      noWrap
                      sx={{ fontSize: '0.75rem' }}
                    >
                      {email.sender}
                    </Typography>
                  }
                  secondary={
                    <Box>
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        fontWeight={!email.isRead ? 500 : 400}
                        noWrap
                        sx={{ display: 'block', fontSize: '0.7rem' }}
                      >
                        {email.subject}
                      </Typography>
                      <Typography
                        variant="caption"
                        color="text.disabled"
                        sx={{ display: 'block', fontSize: '0.65rem' }}
                      >
                        {email.timestamp}
                      </Typography>
                    </Box>
                  }
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default EmailList;