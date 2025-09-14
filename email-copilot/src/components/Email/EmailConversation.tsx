import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  IconButton,
  Stack,
  Chip,
  Toolbar
} from '@mui/material';
import {
  Reply,
  ReplyAll,
  Forward,
  Star,
  StarBorder,
  MoreVert,
  AttachFile,
  Archive,
  Delete,
  MarkunreadMailbox,
  Print,
  KeyboardArrowLeft,
  KeyboardArrowRight
} from '@mui/icons-material';
import { useEmail } from '../../contexts/EmailContext';

interface EmailMessage {
  id: string;
  sender: string;
  senderEmail: string;
  recipient: string;
  subject: string;
  content: string;
  timestamp: string;
  isStarred: boolean;
}

const mockEmailThread: EmailMessage = {
  id: '1',
  sender: 'John Doe',
  senderEmail: 'john.doe@company.com',
  recipient: 'me@company.com',
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
  timestamp: '2 hours ago',
  isStarred: false
};

const EmailConversation: React.FC = () => {
  const { selectedEmail } = useEmail();
  const [isStarred, setIsStarred] = React.useState(false);
  const [replyText, setReplyText] = React.useState('');

  // Use selected email from context or fallback to mock data
  const currentEmail = selectedEmail || mockEmailThread;

  const handleStarToggle = () => {
    setIsStarred(!isStarred);
  };

  const handleReply = () => {
    console.log('Reply:', replyText);
    setReplyText('');
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column', bgcolor: 'background.default' }}>
      {/* Gmail-style toolbar */}
      <Box sx={{
        borderBottom: 1,
        borderColor: 'divider',
        bgcolor: 'background.paper'
      }}>
        <Toolbar variant="dense" sx={{ minHeight: '48px', px: 2 }}>
          <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
            <IconButton size="small" color="inherit">
              <Archive fontSize="small" />
            </IconButton>
            <IconButton size="small" color="inherit">
              <Delete fontSize="small" />
            </IconButton>
            <IconButton size="small" color="inherit">
              <MarkunreadMailbox fontSize="small" />
            </IconButton>
          </Stack>

          <Box sx={{ flexGrow: 1 }} />

          <Stack direction="row" spacing={1}>
            <IconButton size="small" color="inherit">
              <Print fontSize="small" />
            </IconButton>
            <IconButton size="small" color="inherit">
              <KeyboardArrowLeft fontSize="small" />
            </IconButton>
            <IconButton size="small" color="inherit">
              <KeyboardArrowRight fontSize="small" />
            </IconButton>
          </Stack>
        </Toolbar>
      </Box>

      {/* Email header */}
      <Box sx={{ px: 3, py: 2, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="h4" sx={{ mb: 2, fontWeight: 400 }}>
          {currentEmail.subject}
        </Typography>

        <Chip
          label="Inbox"
          size="small"
          sx={{
            bgcolor: 'grey.100',
            color: 'text.secondary',
            fontSize: '0.75rem',
            height: '24px'
          }}
        />
      </Box>

      {/* Email content */}
      <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
        <Box sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 3 }}>
            <Avatar sx={{ width: 40, height: 40, bgcolor: 'primary.main' }}>
              {currentEmail.sender.split(' ').map(n => n[0]).join('')}
            </Avatar>

            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box>
                  <Typography variant="body1" fontWeight={500}>
                    {currentEmail.sender}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    &lt;{currentEmail.senderEmail}&gt;
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    {currentEmail.timestamp}
                  </Typography>
                  <IconButton size="small" onClick={handleStarToggle}>
                    {isStarred ? <Star color="warning" fontSize="small" /> : <StarBorder fontSize="small" />}
                  </IconButton>
                  <IconButton size="small">
                    <Reply fontSize="small" />
                  </IconButton>
                  <IconButton size="small">
                    <MoreVert fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                to me
              </Typography>
            </Box>
          </Box>

          <Typography
            variant="body1"
            sx={{
              whiteSpace: 'pre-wrap',
              lineHeight: 1.6,
              fontSize: '0.875rem',
              color: 'text.primary'
            }}
          >
            {currentEmail.content}
          </Typography>
        </Box>
      </Box>

      {/* Reply section */}
      <Box sx={{ borderTop: 1, borderColor: 'divider', bgcolor: 'background.paper' }}>
        <Box sx={{ p: 3 }}>
          <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
            <Button
              startIcon={<Reply fontSize="small" />}
              size="small"
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Reply
            </Button>
            <Button
              startIcon={<ReplyAll fontSize="small" />}
              size="small"
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Reply all
            </Button>
            <Button
              startIcon={<Forward fontSize="small" />}
              size="small"
              sx={{
                textTransform: 'none',
                color: 'text.secondary',
                '&:hover': { bgcolor: 'grey.100' }
              }}
            >
              Forward
            </Button>
          </Stack>

          <TextField
            multiline
            rows={4}
            fullWidth
            placeholder="Click here to Reply"
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            variant="outlined"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                fontSize: '0.875rem',
              }
            }}
          />

          <Stack direction="row" spacing={1} justifyContent="flex-end">
            <Button
              variant="contained"
              size="small"
              onClick={handleReply}
              disabled={!replyText.trim()}
              sx={{
                textTransform: 'none',
                px: 3,
                bgcolor: 'primary.main',
                '&:hover': { bgcolor: 'primary.dark' }
              }}
            >
              Send
            </Button>
            <IconButton size="small" sx={{ color: 'text.secondary' }}>
              <AttachFile fontSize="small" />
            </IconButton>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default EmailConversation;