import { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatData, addMessage } from './slices/chatSlice';
import { fetchChannels, setCurrentChannel } from './slices/channelsSlice';
import { io } from 'socket.io-client';
import apiClient from './tools/apiClient';
import store from './slices/store';
import ChannelForm from './ChannelForm';
import RenameChannelModal from './RenameChannelModal';
import DeleteChannelModal from './DeleteChannelModal';

const Chat = () => {
  const dispatch = useDispatch();
  const { messages, status } = useSelector((state) => state.chat);
  const { channels, currentChanelId } = useSelector((state) => state.channels);
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const sentMessages = useRef(new Set());
  
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [renameChannelData, setRenameChannelData] = useState(null);
  const [deleteChannelData, setDeleteChannelData] = useState(null);
  

  const currentChannel = channels.find(c => c.id === currentChanelId) || channels[0];

  useEffect(() => {
    dispatch(fetchChatData()).then(() => {
      sentMessages.current.clear();
    });
    dispatch(fetchChannels());
  }, [dispatch]);

  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    let socket = io();
    const reconnect = () => {
      console.warn('Reconnecting WebSocket...');
      socket.disconnect();
      socket = io();
    };

    socket.on('disconnect', () => {
      console.warn('WebSocket disconnected! Attempting reconnection...');
      setTimeout(reconnect, 3000);
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('newMessage', (payload) => {
      console.log('New WebSocket message:', payload);
      if (sentMessages.current.has(payload.id)) {
        sentMessages.current.delete(payload.id);
        return;
      }
      const state = store.getState();
      const isDuplicate = state.chat.messages.some(msg => msg.id === payload.id);
      if (!isDuplicate) {
        dispatch(addMessage(payload));
      }
    });
    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !currentChannel) return;
    setIsSending(true);
    try {
      const response = await apiClient.post('/messages', {
        body: messageText,
        channelId: currentChannel.id,
      });
      if (response.data) {
        sentMessages.current.add(response.data.id);
        setMessageText('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please check your network connection.');
    } finally {
      setIsSending(false);
    }
  };

  if (status === 'loading') return (
    <div className="container my-3">
      <div className="alert alert-info">Loading messages...</div>
    </div>
  );

  if (status === 'failed') return (
    <div className="container my-3">
      <div className="alert alert-danger">Error loading chat.</div>
      <button className="btn btn-primary" onClick={() => dispatch(fetchChatData())}>Retry</button>
    </div>
  );

  const filteredMessages = messages.filter(m => m.channelId === currentChannel?.id);

  return (
    <div className="container-fluid my-3">
      {isOffline && (
        <div className="alert alert-warning" role="alert">
          You are offline. Chat is unavailable.
        </div>
      )}
      <div className="row">
        {/* Sidebar: список каналов */}
        <div className="col-md-3 mb-3">
          <div className="card">
            <div className="card-header d-flex justify-content-between align-items-center">
              <span>Channels</span>
              <button className="btn btn-sm btn-primary" onClick={() => setShowAddChannel(true)}>Add Channel</button>
            </div>
            <ul className="list-group list-group-flush">
              {channels.map((channel) => (
                <li key={channel.id} className={`list-group-item d-flex justify-content-between align-items-center ${channel.id === currentChannel?.id ? 'active' : ''}`}>
                  <button
                    type="button"
                    className="btn btn-link p-0 m-0 text-decoration-none"
                    style={{ color: channel.id === currentChannel?.id ? "#fff" : "#0d6efd" }}
                    onClick={() => dispatch(setCurrentChannel(channel.id))}
                  >
                    # {channel.name}
                  </button>
                  {channel.removable && (
                    <div className="btn-group btn-group-sm">
                      <button className="btn btn-secondary" onClick={() => setRenameChannelData(channel)}>Rename</button>
                      <button className="btn btn-danger" onClick={() => setDeleteChannelData(channel)}>Delete</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
        {/* Chat Window */}
        <div className="col-md-9">
          <div className="card">
            <div className="card-header">
              Messages ({currentChannel ? currentChannel.name : 'No Channel Selected'})
            </div>
            <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <ul className="list-unstyled">
                {filteredMessages.map((message) => (
                  <li key={message.id}><strong>{message.username}</strong>: {message.body}</li>
                ))}
              </ul>
            </div>
            <div className="card-footer">
              <form onSubmit={handleSendMessage} className="d-flex">
                <input
                  type="text"
                  className="form-control me-2"
                  placeholder="Type a message..."
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  disabled={isSending}
                  autoFocus
                />
                <button type="submit" className="btn btn-primary" disabled={isSending}>
                  {isSending ? 'Sending...' : 'Send'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
      {showAddChannel && (
        <ChannelForm onClose={() => setShowAddChannel(false)} />
      )}
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
    </div>
  );
};

export default Chat;
