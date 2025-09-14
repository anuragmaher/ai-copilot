import React from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Stack,
  Card,
  CardContent,
  Button,
  Avatar
} from '@mui/material';
import {
  Send,
  AutoFixHigh,
  SmartToy,
  TrendingUp,
  ContentCopy
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
    await new Promise(resolve => setTimeout(resolve, 1500));
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
    await new Promise(resolve => setTimeout(resolve, 1000));
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
    console.log('Inserting draft');
    alert('Draft would be inserted into the email compose area');
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
      bgcolor: 'background.default'
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
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <Typography sx={{ fontSize: '1.5rem' }}>⋯</Typography>
          </IconButton>
          <IconButton size="small" sx={{ color: 'text.secondary' }}>
            <Typography sx={{ fontSize: '1.2rem' }}>✕</Typography>
          </IconButton>
        </Box>
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
        {/* Quick Actions - only show if no messages */}
        {messages.length === 0 && (
          <Box>
            <Stack spacing={1}>
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outlined"
                  onClick={action.title === 'Draft a reply' ? handleDraftReply : undefined}
                  disabled={isThinking || isStreaming}
                  sx={{
                    justifyContent: 'flex-start',
                    textTransform: 'none',
                    py: 1.5,
                    borderRadius: 2,
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
        )}

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
                  ? '16px 16px 4px 16px'
                  : '16px 16px 16px 4px',
                p: 2
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: '0.875rem',
                  whiteSpace: 'pre-wrap',
                  color: message.type === 'user' ? '#ffffff' : 'inherit'
                }}
              >
                {message.content}
              </Typography>
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
              borderRadius: '16px 16px 16px 4px',
              px: 2,
              py: 1,
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
              borderRadius: '16px 16px 16px 4px',
              p: 2
            }}>
              <Typography variant="body2" sx={{ fontSize: '0.875rem', whiteSpace: 'pre-wrap' }}>
                {streamingMessage}
                <Box component="span" sx={{
                  display: 'inline-block',
                  width: '2px',
                  height: '16px',
                  bgcolor: 'primary.main',
                  ml: 0.5,
                  animation: 'blink 1s infinite'
                }} />
              </Typography>
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
              onClick={() => setShowInsertButton(false)}
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
              Discard
            </Button>
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
          borderRadius: 3,
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
    </Box>
  );
};

export default AICopilot;