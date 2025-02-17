import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatData } from './slices/chatSlice';
import { io } from 'socket.io-client';
import apiClient from './tools/apiClient';
import { addMessage } from './slices/chatSlice';
const Chat = () => {
  const dispatch = useDispatch();
  const { channels, messages, status } = useSelector((state) => state.chat);
  const [messageText, setMessageText] = useState('');

  const generalChannel = channels.find((c) => c.name.toLowerCase() === 'general');

  useEffect(() => {
    dispatch(fetchChatData());
  }, [dispatch]);

  useEffect(() => {
    const socket = io();

    socket.on('newMessage', (payload) => {
      dispatch(addMessage(payload.data));
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !generalChannel) return;

    try {
      const response = await apiClient.post('/messages', {
        body: messageText,
        channelId: generalChannel.id,
      });
      dispatch(addMessage(response.data.data)); // Сразу добавляем в chat.messages
    } catch (error) {
      console.error('Ошибка отправки сообщения:', error);
    }

    setMessageText('');
  };

  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'failed') return <div>Error loading chat data.</div>;
  
  
  const filteredMessages = (messages || []).filter((m) => m?.channelId === generalChannel?.id);

  return (
    <div className="chat-page">
      <div className="channels-list">
        <h3>Channels</h3>
        <ul>
          {channels.map((channel) => (
            <li key={channel.id}>{channel.name}</li>
          ))}
        </ul>
      </div>
      <div className="chat-window">
        <h3>Messages (General)</h3>
        <ul>
          {filteredMessages.map((message) => (
            <li key={message.id}>
              <strong>{message.username}</strong>: {message.body}
            </li>
          ))}
        </ul>
        <form onSubmit={handleSendMessage}>
          <input
            type="text"
            placeholder="Type a message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
