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
  MenuItem
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
import EmailList from '../Email/EmailList';
import EmailConversation from '../Email/EmailConversation';
import AICopilot from '../AI/AICopilot';

const MainLayout: React.FC = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
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
            width: '50%',
            overflow: 'hidden',
            display: { xs: 'none', md: 'block' }
          }}
        >
          <EmailConversation />
        </Box>

        <Box
          sx={{
            width: { xs: '100%', md: '30%' },
            overflow: 'hidden'
          }}
        >
          <AICopilot />
        </Box>
      </Box>
    </Box>
  );
};

export default MainLayout;