import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { fetchMessages } from '../../slices/messagesSlice';
import { fetchChannels } from '../../slices/channelsSlice';
import { openModal } from '../../slices/modalSlice';
import ChannelSidebar from '../ChatGroup/ChannelSidebar';
import MessageWindow from '../ChatGroup/MessageWindow';

const Chat = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);

  useEffect(() => {
    dispatch(fetchMessages());
    dispatch(fetchChannels());
  }, [dispatch]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => {
      setIsOffline(true);
      toast.warn(t('chat.offline'));
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [t]);

  return (
    <div className="container-fluid my-3">
      {isOffline && (
        <div className="alert alert-warning" role="alert">
          {t('chat.offline')}
        </div>
      )}
      <div className="row">
        <ChannelSidebar
          onAddChannel={() => dispatch(openModal({ type: 'add' }))}
          onManageChannel={(channel) => dispatch(openModal({ type: 'manage', data: channel }))}
        />
        <MessageWindow />
      </div>
    </div>
  );
};

export default Chat;
