import React from 'react';
import ReactMarkdown from 'react-markdown';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Card,
  CardContent,
  Button,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Send,
  AutoFixHigh,
  SmartToy,
  TrendingUp,
  ContentCopy,
  Reply,
  ReplyAll,
  AutoAwesome,
  ArrowDropUp,
  ShortText,
  FormatAlignLeft,
  Psychology,
  ExpandMore,
  Business,
  SentimentSatisfiedAlt,
  Edit
} from '@mui/icons-material';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AICopilot: React.FC = () => {
  const [inputText, setInputText] = React.useState('');
  const [isThinking, setIsThinking] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [streamingMessage, setStreamingMessage] = React.useState('');
  const [showInsertButton, setShowInsertButton] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showReplyModal, setShowReplyModal] = React.useState(false);
  const [refineMenuAnchorEl, setRefineMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, isThinking, isStreaming]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');

    // Start thinking
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, 2250));
    setIsThinking(false);

    // Start streaming AI response
    setIsStreaming(true);
    setStreamingMessage('');

    let response = '';
    if (inputText.toLowerCase().includes('summarize') || inputText.toLowerCase().includes('summary')) {
      response = `• Subject: Project Update - Q3 Milestones
• Phase 1: Requirements gathering completed ✅
• Phase 2: Design mockups approved ✅
• Phase 3: Development 80% complete 🔄
• Phase 4: Testing scheduled for next week ⏳
• Key achievements: New auth system, 35% performance boost, security fixes
• Next: Complete dev by Friday, start testing Monday
• Meeting requested: Tuesday or Wednesday afternoon`;
    } else if (inputText.toLowerCase().includes('1') || inputText.toLowerCase().includes('acknowledge') || inputText.toLowerCase().includes('schedule')) {
      response = `Hi John,

Thanks for the great progress update! Excellent work on completing phases 1 & 2 and achieving 80% development completion.

I'm particularly impressed with:
- New authentication system integration
- 35% performance improvement
- Security vulnerability resolution

Let's schedule a call this week to discuss next steps. Tuesday afternoon at 2:00 PM works well for me.

Best regards,
[Your name]`;
    } else if (inputText.toLowerCase().includes('2') || inputText.toLowerCase().includes('request') || inputText.toLowerCase().includes('details')) {
      response = `Hi John,

Thanks for the update. Could you provide more details on:

- Specifics of the remaining 20% development work
- Testing scenarios planned for next week
- Any potential risks or blockers
- Resource needs for the final sprint

Also, please share the updated timeline with key testing and deployment milestones.

Best regards,
[Your name]`;
    } else if (inputText.toLowerCase().includes('3') || inputText.toLowerCase().includes('feedback') || inputText.toLowerCase().includes('milestones')) {
      response = `Hi John,

Excellent progress on Q3 milestones! The 80% completion rate and key achievements are impressive.

**Feedback:**
- Phases 1 & 2 completion: Outstanding
- 35% performance boost: Exceptional
- Security fixes: Critical and well-executed

**Next Steps:**
- Add buffer time for testing complexity
- Prepare deployment documentation
- Plan post-deployment monitoring

Let's schedule that call to finalize details.

Best regards,
[Your name]`;
    } else {
      response = `I understand. Could you provide more details about what specific aspects you'd like me to focus on in the reply?`;
    }

    // Simulate streaming
    let currentText = '';
    for (let i = 0; i < response.length; i++) {
      currentText += response[i];
      setStreamingMessage(currentText);
      const delay = response[i] === '\n' ? 50 : Math.random() * 20 + 5;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Add AI message to chat
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setStreamingMessage('');
    setIsStreaming(false);

    // Show insert button for actual draft responses (not intent suggestions)
    const isDraftResponse = userMessage.content.toLowerCase().includes('1') ||
                           userMessage.content.toLowerCase().includes('2') ||
                           userMessage.content.toLowerCase().includes('3') ||
                           userMessage.content.toLowerCase().includes('acknowledge') ||
                           userMessage.content.toLowerCase().includes('request') ||
                           userMessage.content.toLowerCase().includes('feedback') ||
                           userMessage.content.toLowerCase().includes('details') ||
                           userMessage.content.toLowerCase().includes('schedule') ||
                           userMessage.content.toLowerCase().includes('milestones');

    setShowInsertButton(isDraftResponse);
  };

  const handleDraftReply = async () => {
    const draftMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Draft a reply',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, draftMessage]);

    // Start thinking
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsThinking(false);

    // Start streaming AI response with intent suggestions
    setIsStreaming(true);
    setStreamingMessage('');

    const response = `Sure, how would you like me to draft your reply?

1. Acknowledge progress and schedule follow-up meeting

2. Request additional project details and clarification

3. Provide feedback on milestones and next steps

Feel free to remix and combine any of these options to create a custom response.`;

    // Simulate streaming
    let currentText = '';
    for (let i = 0; i < response.length; i++) {
      currentText += response[i];
      setStreamingMessage(currentText);
      const delay = response[i] === '\n' ? 50 : Math.random() * 15 + 3;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Add AI message to chat
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setStreamingMessage('');
    setIsStreaming(false);
  };

  const handleInsertDraft = () => {
    setShowReplyModal(true);
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleResetChat = () => {
    setMessages([]);
    setStreamingMessage('');
    setShowInsertButton(false);
    setIsThinking(false);
    setIsStreaming(false);
    setInputText('');
    handleMenuClose();
  };

  const handleReplyModalClose = () => {
    setShowReplyModal(false);
  };

  const handleReply = () => {
    console.log('Replying to email');
    alert('Draft inserted and replying to sender only');
    setShowReplyModal(false);
    setShowInsertButton(false);
  };

  const handleReplyAll = () => {
    console.log('Replying to all');
    alert('Draft inserted and replying to all recipients');
    setShowReplyModal(false);
    setShowInsertButton(false);
  };

  const handleSummarize = async () => {
    const summarizeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Summarize',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, summarizeMessage]);

    // Start thinking
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, 2250));
    setIsThinking(false);

    // Start streaming AI response with bullet point summary
    setIsStreaming(true);
    setStreamingMessage('');

    const response = `**Email Summary:**

• **Subject**: Project Update - Q3 Milestones

• **Sender**: John Doe (john.doe@company.com)

• **Key Updates**:
  - Phase 1 & 2 completed ✅
  - Phase 3 development 80% complete 🔄
  - Phase 4 testing scheduled for next week

• **Major Achievements**:
  - New authentication system integrated
  - 35% performance improvement achieved
  - All critical security vulnerabilities resolved

• **Next Steps**:
  - Complete remaining development by Friday
  - Begin comprehensive testing Monday
  - Prepare deployment documentation

• **Action Required**:
  - Schedule follow-up call (Tuesday or Wednesday afternoon)
  - Discuss final sprint priorities and concerns

• **Timeline**: On track for Q3 delivery with testing phase starting next week`;

    // Simulate streaming
    let currentText = '';
    for (let i = 0; i < response.length; i++) {
      currentText += response[i];
      setStreamingMessage(currentText);
      const delay = response[i] === '\n' ? 50 : Math.random() * 15 + 3;
      await new Promise(resolve => setTimeout(resolve, delay));
    }

    // Add AI message to chat
    const aiMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'ai',
      content: response,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, aiMessage]);
    setStreamingMessage('');
    setIsStreaming(false);
  };

  const handleRefineMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setRefineMenuAnchorEl(event.currentTarget);
  };

  const handleRefineMenuClose = () => {
    setRefineMenuAnchorEl(null);
  };

  const handleRefineOption = (option: string) => {
    console.log(`Refining with option: ${option}`);
    // Add logic here to refine the last AI response based on the selected option
    handleRefineMenuClose();
    setShowInsertButton(false);
  };

  const quickActions = [
    {
      title: 'Draft a reply',
      description: 'Generate a professional response',
      icon: <AutoFixHigh />,
      color: '#1a73e8'
    },
    {
      title: 'Summarize',
      description: 'Extract key points',
      icon: <TrendingUp />,
      color: '#34a853'
    },
  ];

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      bgcolor: 'background.default',
      borderLeft: 1,
      borderColor: 'divider'
    }}>
      {/* Header with close button */}
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        p: 2,
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <SmartToy sx={{ color: 'primary.main' }} />
          <Typography variant="h6" sx={{ fontWeight: 500 }}>
            AI Copilot
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconButton size="small" sx={{ color: 'text.secondary' }} onClick={handleMenuOpen}>
            <Typography sx={{ fontSize: '1.5rem' }}>⋯</Typography>
          </IconButton>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <Typography sx={{ fontSize: '1.2rem' }}>✕</Typography>
          </IconButton>
        </Box>

        {/* Dropdown Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        >
          <MenuItem onClick={handleResetChat}>
            Reset chat
          </MenuItem>
        </Menu>
      </Box>

      {/* Chat Messages Area */}
      <Box sx={{
        flexGrow: 1,
        overflow: 'auto',
        p: 2,
        display: 'flex',
        flexDirection: 'column',
        gap: 2
      }}>
        {/* Welcome Section - always show */}
          <Box sx={{
            py: 2,
            pb: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: 3
          }}>
            <Box sx={{
              display: 'flex',
              justifyContent: 'center',
              mb: 1
            }}>
              <Box sx={{
                width: 80,
                height: 80,
                bgcolor: '#fdd835',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(253, 216, 53, 0.3)'
              }}>
                <AutoAwesome sx={{ fontSize: '2.5rem', color: 'white' }} />
              </Box>
            </Box>

            <Box sx={{ textAlign: 'left' }}>
              <Typography variant="h6" sx={{ fontWeight: 500, mb: 1, color: 'text.primary' }}>
                Hi! I'm your AI Email Copilot
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, mb: 3 }}>
                I can help you draft professional replies, summarize long emails, and suggest the perfect tone for your messages.
              </Typography>

              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, display: 'block', mb: 2 }}>
                What I can do:
              </Typography>
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <AutoFixHigh sx={{ fontSize: '1.1rem', color: '#1a73e8' }} />
                  <Typography variant="body2" color="text.secondary">
                    Draft professional replies
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <TrendingUp sx={{ fontSize: '1.1rem', color: '#34a853' }} />
                  <Typography variant="body2" color="text.secondary">
                    Summarize key points
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <SmartToy sx={{ fontSize: '1.1rem', color: '#ea4335' }} />
                  <Typography variant="body2" color="text.secondary">
                    Suggest improvements
                  </Typography>
                </Box>
              </Stack>
            </Box>

            {/* Quick Action Buttons */}
            <Box sx={{ mt: 2 }}>
              <Stack spacing={1}>
                {quickActions.map((action, index) => (
                  <Button
                    key={index}
                    variant="outlined"
                    onClick={
                      action.title === 'Draft a reply' ? handleDraftReply :
                      action.title === 'Summarize' ? handleSummarize :
                      undefined
                    }
                    disabled={isThinking || isStreaming}
                    sx={{
                      justifyContent: 'flex-start',
                      textTransform: 'none',
                      py: 1.5,
                      borderRadius: 1,
                      color: 'text.primary',
                      borderColor: 'divider',
                      '&:hover': {
                        bgcolor: 'grey.50',
                        borderColor: 'primary.main'
                      }
                    }}
                    startIcon={
                      <Box sx={{ color: action.color }}>
                        {action.icon}
                      </Box>
                    }
                  >
                    <Box sx={{ textAlign: 'left' }}>
                      <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
                        {action.title}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {action.description}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Stack>
            </Box>
          </Box>

        {/* Chat Messages */}
        {messages.map((message) => (
          <Box
            key={message.id}
            sx={{
              display: 'flex',
              justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
              mb: 1
            }}
          >
            {message.type === 'ai' && (
              <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'grey.300' }}>
                <SmartToy sx={{ fontSize: '0.8rem' }} />
              </Avatar>
            )}

            <Box
              sx={{
                maxWidth: '80%',
                bgcolor: message.type === 'user' ? '#4285f4' : '#f8f9fa',
                color: message.type === 'user' ? '#ffffff' : 'text.primary',
                borderRadius: message.type === 'user'
                  ? '8px 8px 2px 8px'
                  : '8px 8px 8px 2px',
                p: 1.5
              }}
            >
              {message.type === 'user' ? (
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap',
                    color: '#ffffff'
                  }}
                >
                  {message.content}
                </Typography>
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <Typography variant="body2" sx={{ fontSize: '0.875rem', mb: 1, '&:last-child': { mb: 0 } }}>
                        {children}
                      </Typography>
                    ),
                    h1: ({ children }) => (
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                        {children}
                      </Typography>
                    ),
                    h2: ({ children }) => (
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
                        {children}
                      </Typography>
                    ),
                    strong: ({ children }) => (
                      <Typography component="span" sx={{ fontWeight: 600 }}>
                        {children}
                      </Typography>
                    ),
                    ul: ({ children }) => (
                      <Box component="ul" sx={{ pl: 2, mb: 1, '&:last-child': { mb: 0 } }}>
                        {children}
                      </Box>
                    ),
                    li: ({ children }) => (
                      <Typography component="li" variant="body2" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                        {children}
                      </Typography>
                    )
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )}
            </Box>

            {message.type === 'user' && (
              <Avatar
                sx={{ width: 24, height: 24, ml: 1 }}
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
              />
            )}
          </Box>
        ))}

        {/* Thinking State */}
        {isThinking && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mb: 1 }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'grey.300' }}>
              <SmartToy sx={{ fontSize: '0.8rem' }} />
            </Avatar>
            <Box sx={{
              bgcolor: '#f8f9fa',
              borderRadius: '8px 8px 8px 2px',
              px: 1.5,
              py: 0.75,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}>
              <Box sx={{
                width: 6,
                height: 6,
                bgcolor: 'primary.main',
                borderRadius: '50%',
                animation: 'pulse 1.5s ease-in-out infinite'
              }} />
              <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
                Copilot
              </Typography>
            </Box>
          </Box>
        )}

        {/* Streaming Response */}
        {isStreaming && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', mb: 1 }}>
            <Avatar sx={{ width: 24, height: 24, mr: 1, bgcolor: 'grey.300' }}>
              <SmartToy sx={{ fontSize: '0.8rem' }} />
            </Avatar>
            <Box sx={{
              maxWidth: '80%',
              bgcolor: '#f8f9fa',
              borderRadius: '8px 8px 8px 2px',
              p: 1.5
            }}>
              <Box sx={{ position: 'relative' }}>
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <Typography variant="body2" sx={{ fontSize: '0.875rem', mb: 1, '&:last-child': { mb: 0 } }}>
                        {children}
                      </Typography>
                    ),
                    h1: ({ children }) => (
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '1rem' }}>
                        {children}
                      </Typography>
                    ),
                    h2: ({ children }) => (
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, fontSize: '0.95rem' }}>
                        {children}
                      </Typography>
                    ),
                    strong: ({ children }) => (
                      <Typography component="span" sx={{ fontWeight: 600 }}>
                        {children}
                      </Typography>
                    ),
                    ul: ({ children }) => (
                      <Box component="ul" sx={{ pl: 2, mb: 1, '&:last-child': { mb: 0 } }}>
                        {children}
                      </Box>
                    ),
                    li: ({ children }) => (
                      <Typography component="li" variant="body2" sx={{ fontSize: '0.875rem', mb: 0.5 }}>
                        {children}
                      </Typography>
                    )
                  }}
                >
                  {streamingMessage}
                </ReactMarkdown>
                <Box component="span" sx={{
                  display: 'inline-block',
                  width: '2px',
                  height: '16px',
                  bgcolor: 'primary.main',
                  ml: 0.5,
                  animation: 'blink 1s infinite'
                }} />
              </Box>
            </Box>
          </Box>
        )}

        {/* Insert Button for draft responses */}
        {showInsertButton && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', gap: 1, mt: 0.5, ml: 4 }}>
            <Button
              variant="contained"
              startIcon={<ContentCopy />}
              onClick={handleInsertDraft}
              sx={{
                textTransform: 'none',
                borderRadius: 1.5,
                bgcolor: '#4285f4',
                color: 'white',
                px: 3,
                py: 1,
                fontWeight: 500,
                '&:hover': {
                  bgcolor: '#3367d6'
                }
              }}
            >
              Insert draft
            </Button>
            <Button
              variant="outlined"
              size="small"
              onClick={handleRefineMenuOpen}
              endIcon={<ArrowDropUp />}
              sx={{
                textTransform: 'none',
                borderRadius: 1.5,
                borderColor: '#dadce0',
                color: 'text.secondary',
                '&:hover': {
                  borderColor: '#5f6368',
                  bgcolor: 'grey.50'
                }
              }}
            >
              Refine
            </Button>

            {/* Refine Menu */}
            <Menu
              anchorEl={refineMenuAnchorEl}
              open={Boolean(refineMenuAnchorEl)}
              onClose={handleRefineMenuClose}
              anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
              transformOrigin={{ vertical: 'bottom', horizontal: 'center' }}
              sx={{
                '& .MuiPaper-root': {
                  minWidth: '220px',
                  mt: -1,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  borderRadius: 1
                }
              }}
            >
              <MenuItem onClick={() => handleRefineOption('expand')}>
                <ExpandMore sx={{ mr: 2, fontSize: '1rem' }} />
                Expand
              </MenuItem>
              <MenuItem onClick={() => handleRefineOption('make-short')}>
                <ShortText sx={{ mr: 2, fontSize: '1rem' }} />
                Make it short
              </MenuItem>
              <MenuItem onClick={() => handleRefineOption('make-professional')}>
                <Business sx={{ mr: 2, fontSize: '1rem' }} />
                Make it professional
              </MenuItem>
              <MenuItem onClick={() => handleRefineOption('make-empathetic')}>
                <SentimentSatisfiedAlt sx={{ mr: 2, fontSize: '1rem' }} />
                Make it empathetic
              </MenuItem>
              <MenuItem onClick={() => handleRefineOption('improve-writing')}>
                <Edit sx={{ mr: 2, fontSize: '1rem' }} />
                Improve writing
              </MenuItem>
            </Menu>
          </Box>
        )}

        {/* Invisible element to scroll to */}
        <div ref={messagesEndRef} />
      </Box>


      {/* Input area */}
      <Box sx={{ p: 2 }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: 1,
          bgcolor: 'grey.100',
          borderRadius: 1,
          p: 1
        }}>
          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Message AI Copilot"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            variant="standard"
            InputProps={{
              disableUnderline: true,
              sx: { fontSize: '0.875rem', px: 1 }
            }}
          />
          <IconButton
            onClick={handleSendMessage}
            disabled={!inputText.trim() || isThinking || isStreaming}
            size="small"
            sx={{
              bgcolor: inputText.trim() ? 'primary.main' : 'grey.400',
              color: 'white',
              '&:hover': {
                bgcolor: inputText.trim() ? 'primary.dark' : 'grey.400'
              },
              '&.Mui-disabled': {
                bgcolor: 'grey.400',
                color: 'white'
              }
            }}
          >
            <Send fontSize="small" />
          </IconButton>
        </Box>
      </Box>

      {/* Reply Modal */}
      <Dialog
        open={showReplyModal}
        onClose={handleReplyModalClose}
        aria-labelledby="reply-dialog-title"
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle id="reply-dialog-title" sx={{ textAlign: 'center', pb: 2 }}>
          How would you like to respond?
        </DialogTitle>
        <DialogContent sx={{ pt: 0 }}>
          <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', mb: 2 }}>
            Choose how to send your draft
          </Typography>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', gap: 1, pb: 3 }}>
          <Button
            onClick={handleReply}
            variant="contained"
            startIcon={<Reply />}
            sx={{
              textTransform: 'none',
              bgcolor: '#4285f4',
              '&:hover': { bgcolor: '#3367d6' },
              px: 3
            }}
          >
            Reply
          </Button>
          <Button
            onClick={handleReplyAll}
            variant="outlined"
            startIcon={<ReplyAll />}
            sx={{
              textTransform: 'none',
              borderColor: '#dadce0',
              color: 'text.secondary',
              '&:hover': {
                borderColor: '#5f6368',
                bgcolor: 'grey.50'
              },
              px: 3
            }}
          >
            Reply All
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AICopilot;