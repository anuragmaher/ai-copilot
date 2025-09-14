import React from 'react';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select
} from '@mui/material';
import {
  Brightness4,
  Brightness7,
  Search,
  Menu as MenuIcon,
  Settings,
  Apps,
  AccountCircle
} from '@mui/icons-material';
import { useTheme } from '../../contexts/ThemeContext';
import { useSettings } from '../../contexts/SettingsContext';
import EmailList from '../Email/EmailList';
import EmailConversation from '../Email/EmailConversation';
import AICopilot from '../AI/AICopilot';

const MainLayout: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const { apiKey, model, temperature, setApiKey, setModel, setTemperature } = useSettings();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [copilotWidth, setCopilotWidth] = React.useState(27);
  const [isDragging, setIsDragging] = React.useState(false);
  const [showSettings, setShowSettings] = React.useState(false);
  const [tempApiKey, setTempApiKey] = React.useState('');
  const [tempModel, setTempModel] = React.useState('');
  const [tempTemperature, setTempTemperature] = React.useState(0.7);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    e.preventDefault();
  };

  const handleMouseMove = React.useCallback((e: MouseEvent) => {
    if (!isDragging) return;

    const containerWidth = window.innerWidth;
    const sidebarWidth = 250; // EmailList width
    const availableWidth = containerWidth - sidebarWidth;
    const mouseX = e.clientX - sidebarWidth;
    const newCopilotWidth = Math.min(Math.max(((availableWidth - mouseX) / availableWidth) * 100, 15), 50);

    setCopilotWidth(newCopilotWidth);
  }, [isDragging]);

  const handleMouseUp = React.useCallback(() => {
    setIsDragging(false);
  }, []);

  React.useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleSettingsOpen = () => {
    setTempApiKey(apiKey);
    setTempModel(model);
    setTempTemperature(temperature);
    setShowSettings(true);
  };

  const handleSettingsClose = () => {
    setShowSettings(false);
  };

  const handleSettingsSave = () => {
    setApiKey(tempApiKey);
    setModel(tempModel);
    setTemperature(tempTemperature);
    setShowSettings(false);
  };

  return (
    <Box sx={{ flexGrow: 1, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Gmail-style header */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'divider',
          color: 'text.primary'
        }}
      >
        <Toolbar sx={{ minHeight: '64px' }}>
          <IconButton
            edge="start"
            color="inherit"
            sx={{ mr: 2, color: 'text.secondary' }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            component="div"
            sx={{
              mr: 4,
              fontWeight: 400,
              color: 'text.secondary',
              fontSize: '1.375rem'
            }}
          >
            Gmail
          </Typography>

          {/* Search bar */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              maxWidth: '720px',
              bgcolor: isDarkMode ? 'rgba(241, 243, 244, 0.1)' : 'rgba(60, 64, 67, 0.1)',
              borderRadius: '8px',
              px: 2,
              py: 1,
              mr: { xs: 0, md: 4 },
              '&:hover': {
                boxShadow: '0 2px 5px 1px rgba(64,60,67,.16)'
              }
            }}
          >
            <Search sx={{ color: 'text.secondary', mr: 1 }} />
            <InputBase
              placeholder="Search mail"
              fullWidth
              sx={{
                color: 'text.primary',
                fontSize: '1rem',
                '& .MuiInputBase-input::placeholder': {
                  color: 'text.secondary',
                  opacity: 1
                }
              }}
            />
          </Box>

          {/* Spacer for mobile */}
          <Box sx={{ flexGrow: { xs: 1, md: 0 } }} />

          {/* Right side icons */}
          <IconButton color="inherit" sx={{ color: 'text.secondary' }}>
            <Apps />
          </IconButton>

          <IconButton color="inherit" onClick={handleSettingsOpen} sx={{ color: 'text.secondary' }}>
            <Settings />
          </IconButton>

          <IconButton color="inherit" onClick={toggleTheme} sx={{ color: 'text.secondary' }}>
            {isDarkMode ? <Brightness7 /> : <Brightness4 />}
          </IconButton>

          <IconButton
            color="inherit"
            onClick={handleMenu}
            sx={{ ml: 1 }}
          >
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              <AccountCircle />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Settings</MenuItem>
            <MenuItem onClick={handleClose}>Sign out</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          height: 'calc(100vh - 64px)',
          overflow: 'hidden'
        }}
      >
        <Box
          sx={{
            width: '20%',
            minWidth: '250px',
            overflow: 'hidden',
            display: { xs: 'none', md: 'block' }
          }}
        >
          <EmailList />
        </Box>

        <Box
          sx={{
            width: `${100 - 20 - copilotWidth}%`,
            overflow: 'hidden',
            display: { xs: 'none', md: 'block' }
          }}
        >
          <EmailConversation />
        </Box>

        {/* Resize Handle */}
        <Box
          onMouseDown={handleMouseDown}
          sx={{
            width: '4px',
            cursor: 'col-resize',
            bgcolor: isDragging ? 'primary.main' : 'transparent',
            transition: 'background-color 0.2s',
            '&:hover': {
              bgcolor: 'primary.light'
            },
            display: { xs: 'none', md: 'block' }
          }}
        />

        <Box
          sx={{
            width: { xs: '100%', md: `${copilotWidth}%` },
            overflow: 'hidden'
          }}
        >
          <AICopilot />
        </Box>
      </Box>

      {/* Settings Modal */}
      <Dialog
        open={showSettings}
        onClose={handleSettingsClose}
        aria-labelledby="settings-dialog-title"
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle id="settings-dialog-title">
          AI Settings
        </DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <TextField
              fullWidth
              label="OpenAI API Key"
              type="password"
              value={tempApiKey}
              onChange={(e) => setTempApiKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              variant="outlined"
              helperText="Your API key is stored locally and never sent to our servers"
            />

            <FormControl fullWidth>
              <InputLabel>Model</InputLabel>
              <Select
                label="Model"
                value={tempModel}
                onChange={(e) => setTempModel(e.target.value)}
              >
                <MenuItem value="gpt-4">GPT-4</MenuItem>
                <MenuItem value="gpt-4-turbo">GPT-4 Turbo</MenuItem>
                <MenuItem value="gpt-3.5-turbo">GPT-3.5 Turbo</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Temperature"
              type="number"
              value={tempTemperature}
              onChange={(e) => setTempTemperature(parseFloat(e.target.value))}
              inputProps={{ min: 0, max: 2, step: 0.1 }}
              helperText="Controls randomness (0-2). Lower values make output more focused and deterministic."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleSettingsClose} color="inherit">
            Cancel
          </Button>
          <Button
            onClick={handleSettingsSave}
            variant="contained"
            sx={{ ml: 1 }}
          >
            Save Settings
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default MainLayout;