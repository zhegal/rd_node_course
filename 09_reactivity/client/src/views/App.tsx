import React, { useState } from 'react';
import { ChatProvider } from '../contexts/ChatContext';
import { LoginDialog } from './LoginDialog';
import { ChatLayout } from './ChatLayout';

export const App = () => {
  const [userName, setUserName] = useState(
    localStorage.getItem('userName') || '',
  );

  if (!userName) {
    return <LoginDialog onLogin={(u) => { localStorage.setItem('userName', u); setUserName(u); }} />;
  }

  return (
    <ChatProvider userName={userName}>
      <ChatLayout userName={userName} />
    </ChatProvider>
  );
};