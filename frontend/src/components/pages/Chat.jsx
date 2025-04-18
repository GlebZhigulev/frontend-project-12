import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { fetchChatData } from '../../slices/chatSlice';
import { fetchChannels } from '../../slices/channelsSlice';
import store from '../../slices/store';
import ChannelForm from '../modals/AddChannelModal';
import RenameChannelModal from '../modals/RenameChannelModal';
import DeleteChannelModal from '../modals/DeleteChannelModal';
import ManageChannelModal from '../modals/ManageChannelModal';
import ChannelSidebar from '../ChatGroup/ChannelSidebar';
import MessageWindow from '../ChatGroup/MessageWindow';

const Chat = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [renameChannelData, setRenameChannelData] = useState(null);
  const [deleteChannelData, setDeleteChannelData] = useState(null);
  const [manageChannel, setManageChannel] = useState(null);

  useEffect(() => {
    dispatch(fetchChatData());
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

  useEffect(() => {
    let socket = io();
    const reconnect = () => {
      socket.disconnect();
      socket = io();
    };
    socket.on('disconnect', () => setTimeout(reconnect, 3000));
    socket.on('newMessage', (payload) => {
      const state = store.getState();
      const isDuplicate = state.chat.messages.some((msg) => msg.id === payload.id);
      if (!isDuplicate) {
        dispatch({ type: 'chat/addMessage', payload });
      }
    });
    return () => { socket.disconnect(); };
  }, [dispatch]);

  return (
    <div className="container-fluid my-3">
      {isOffline && (
        <div className="alert alert-warning" role="alert">
          {t('chat.offline')}
        </div>
      )}
      <div className="row">
        <ChannelSidebar
          onAddChannel={() => setShowAddChannel(true)}
          onManageChannel={setManageChannel}
        />
        <MessageWindow />
      </div>
      {showAddChannel && <ChannelForm onClose={() => setShowAddChannel(false)} />}
      {renameChannelData && (
        <RenameChannelModal
          channel={renameChannelData}
          onClose={() => setRenameChannelData(null)}
        />
      )}
      {deleteChannelData && (
        <DeleteChannelModal
          channel={deleteChannelData}
          onClose={() => setDeleteChannelData(null)}
        />
      )}
      {manageChannel && (
        <ManageChannelModal
          onClose={() => setManageChannel(null)}
          onRename={() => {
            setRenameChannelData(manageChannel);
            setManageChannel(null);
          }}
          onDelete={() => {
            setDeleteChannelData(manageChannel);
            setManageChannel(null);
          }}
        />
      )}
    </div>
  );
};

export default Chat;
