import React from 'react';
import ReactMarkdown from 'react-markdown';
import { useSettings } from '../../contexts/SettingsContext';
import { useEmail } from '../../contexts/EmailContext';
import { openaiService } from '../../services/openaiService';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
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
  ThumbUp,
  ThumbDown
} from '@mui/icons-material';

interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const AICopilot: React.FC = () => {
  const { apiKey, model, temperature, isConfigured } = useSettings();
  const { selectedEmail } = useEmail();
  const [inputText, setInputText] = React.useState('');
  const [isThinking, setIsThinking] = React.useState(false);
  const [isStreaming, setIsStreaming] = React.useState(false);
  const [messages, setMessages] = React.useState<ChatMessage[]>([]);
  const [streamingMessage, setStreamingMessage] = React.useState('');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [showReplyModal, setShowReplyModal] = React.useState(false);
  const [hoveredMessageId, setHoveredMessageId] = React.useState<string | null>(null);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages, streamingMessage, isThinking, isStreaming]);

  // Configure OpenAI service when settings change
  React.useEffect(() => {
    if (isConfigured) {
      openaiService.configure({ apiKey, model, temperature });
    }
  }, [apiKey, model, temperature, isConfigured]);

  // Clear chat when email changes
  React.useEffect(() => {
    setMessages([]);
    setStreamingMessage('');
    setIsThinking(false);
    setIsStreaming(false);
  }, [selectedEmail?.id]);

  // Generate email context from selected email
  const getEmailContext = () => {
    if (!selectedEmail) {
      return `Subject: Project Update - Q3 Milestones
From: John Doe <john.doe@company.com>
To: me@company.com

Hi there,

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
John`;
    }

    return `Subject: ${selectedEmail.subject}
From: ${selectedEmail.sender} <${selectedEmail.senderEmail}>
To: me@company.com

${selectedEmail.content}`;
  };

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    // Check if OpenAI is configured
    if (!isConfigured) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Please configure your OpenAI API key in the settings first. Click the settings icon in the header to get started.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputText;
    setInputText('');

    // Email context for the AI
    const emailContext = getEmailContext();

    // Start thinking
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsThinking(false);

    // Start streaming AI response
    setIsStreaming(true);
    setStreamingMessage('');

    try {
      let fullResponse = '';
      let prompt = currentInput;

      // Check if user is responding to intent options (numbered 1, 2, 3)
      const intentPattern = /^[123]$/;
      const isIntentSelection = intentPattern.test(currentInput.trim());

      if (isIntentSelection) {
        // Generate actual email draft based on selected intent - dynamically based on email content
        const intentMap: { [key: string]: string } = {
          '1': 'Write a concise professional email reply using the first approach/intent that was suggested. Be contextually appropriate to the original email content.',
          '2': 'Write a concise professional email reply using the second approach/intent that was suggested. Be contextually appropriate to the original email content.',
          '3': 'Write a concise professional email reply using the third approach/intent that was suggested. Be contextually appropriate to the original email content.'
        };

        prompt = intentMap[currentInput.trim()] || currentInput;
        prompt += ' Keep it concise but complete - greeting, 2-3 short paragraphs for main content, and brief closing. Aim for 80-120 words total. Do not include subject line - only the email body.';
      }

      await openaiService.generateStreamingResponse(
        prompt,
        emailContext,
        (chunk) => {
          fullResponse += chunk;
          setStreamingMessage(fullResponse);
        }
      );

      // Add AI message to chat
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fullResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setStreamingMessage('');
      setIsStreaming(false);

    } catch (error: any) {
      console.error('Error generating AI response:', error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setStreamingMessage('');
      setIsStreaming(false);
    }
  };

  const handleDraftReply = async () => {
    if (!isConfigured) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Please configure your OpenAI API key in the settings first. Click the settings icon in the header to get started.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const draftMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Draft a reply',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, draftMessage]);

    // Email context
    const emailContext = getEmailContext();

    // Start thinking
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsThinking(false);

    // Start streaming AI response with intent suggestions
    setIsStreaming(true);
    setStreamingMessage('');

    try {
      let fullResponse = '';

      await openaiService.generateStreamingResponse(
        'You must start your response with exactly this text:\n\n"Sure, I will help you draft a reply! What kind of draft do you want me to generate?\n\nI\'m suggesting these 3 contextual reply approaches based on this email. Please choose one by typing 1, 2, or 3:"\n\nThen analyze the email content and provide 3 numbered options with contextually relevant reply approaches. Keep each description to maximum 6-8 words.',
        emailContext,
        (chunk) => {
          fullResponse += chunk;
          setStreamingMessage(fullResponse);
        }
      );

      // Add AI message to chat
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fullResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setStreamingMessage('');
      setIsStreaming(false);

    } catch (error: any) {
      console.error('Error generating AI response:', error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setStreamingMessage('');
      setIsStreaming(false);
    }
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
  };

  const handleReplyAll = () => {
    console.log('Replying to all');
    alert('Draft inserted and replying to all recipients');
    setShowReplyModal(false);
  };

  const handleSummarize = async () => {
    if (!isConfigured) {
      const errorMessage: ChatMessage = {
        id: Date.now().toString(),
        type: 'ai',
        content: 'Please configure your OpenAI API key in the settings first. Click the settings icon in the header to get started.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      return;
    }

    const summarizeMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: 'Summarize',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, summarizeMessage]);

    // Email context
    const emailContext = getEmailContext();

    // Start thinking
    setIsThinking(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsThinking(false);

    // Start streaming AI response
    setIsStreaming(true);
    setStreamingMessage('');

    try {
      let fullResponse = '';

      await openaiService.generateStreamingResponse(
        'Summarize this email with clear bullet points. Include: subject, sender, key updates, achievements, next steps, action items, and timeline. Use emojis and clear formatting.',
        emailContext,
        (chunk) => {
          fullResponse += chunk;
          setStreamingMessage(fullResponse);
        }
      );

      // Add AI message to chat
      const aiMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: fullResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
      setStreamingMessage('');
      setIsStreaming(false);

    } catch (error: any) {
      console.error('Error generating AI response:', error);

      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: `Error: ${error.message}`,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, errorMessage]);
      setStreamingMessage('');
      setIsStreaming(false);
    }
  };

  const handleCopyMessage = (messageContent: string) => {
    navigator.clipboard.writeText(messageContent);
    console.log('Message copied to clipboard');
  };

  const handleThumbsUp = (messageId: string) => {
    console.log(`Thumbs up for message: ${messageId}`);
  };

  const handleThumbsDown = (messageId: string) => {
    console.log(`Thumbs down for message: ${messageId}`);
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
          py: 8,
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
              👋 Hey, I’m here to help!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.5, mb: 3 }}>
              I can help you draft professional replies, summarize long emails, and suggest the perfect tone for your messages.
            </Typography>

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
            sx={{ mb: 2 }}
            onMouseEnter={() => message.type === 'ai' && setHoveredMessageId(message.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
          >
            <Box
              sx={{
                display: 'flex',
                justifyContent: message.type === 'user' ? 'flex-end' : 'flex-start',
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

            {/* Hover Actions for AI messages */}
            {message.type === 'ai' && hoveredMessageId === message.id && (
              <Box sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                ml: 4,
                mt: 0.5
              }}>
                <Box sx={{
                  display: 'flex',
                  gap: 0.5,
                  opacity: 1,
                  transition: 'opacity 0.2s ease',
                  bgcolor: 'rgba(255, 255, 255, 0.95)',
                  borderRadius: 1,
                  p: 0.5,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  <Button
                    size="small"
                    onClick={() => handleCopyMessage(message.content)}
                    startIcon={<ContentCopy sx={{ fontSize: '0.75rem' }} />}
                    sx={{
                      minWidth: 'auto',
                      px: 1,
                      py: 0.5,
                      bgcolor: 'white',
                      color: 'text.secondary',
                      textTransform: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      border: '1px solid',
                      borderColor: 'grey.300',
                      '&:hover': {
                        bgcolor: 'primary.50',
                        color: 'primary.main',
                        borderColor: 'primary.main'
                      }
                    }}
                  >
                    Copy
                  </Button>
                  <IconButton
                    size="small"
                    onClick={() => handleThumbsUp(message.id)}
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: 'white',
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: 'success.main',
                        color: 'white'
                      }
                    }}
                  >
                    <ThumbUp sx={{ fontSize: '0.8rem' }} />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleThumbsDown(message.id)}
                    sx={{
                      width: 28,
                      height: 28,
                      bgcolor: 'white',
                      color: 'text.secondary',
                      '&:hover': {
                        bgcolor: 'error.main',
                        color: 'white'
                      }
                    }}
                  >
                    <ThumbDown sx={{ fontSize: '0.8rem' }} />
                  </IconButton>
                </Box>
              </Box>
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
                Thinking
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
            </Box>
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