import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChannels } from './slices/channelsSlice';
import { fetchMessages } from './slices/messagesSlice';

const Chat = () => {
  const dispatch = useDispatch();

  const { channels, loading: channelsLoading } = useSelector((state) => state.channels);
  const { messages, loading: messagesLoading } = useSelector((state) => state.messages);

  useEffect(() => {
    dispatch(fetchChannels()); // Загружаем каналы
    dispatch(fetchMessages()); // Загружаем сообщения
  }, [dispatch]);

  if (channelsLoading || messagesLoading) {
    return <div>Loading...</div>;
  }

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
        <h3>Messages</h3>
        <ul>
          {messages.map((message) => (
            <li key={message.id}>
              <strong>{message.user}</strong>: {message.text}
            </li>
          ))}
        </ul>
        <form>
          <input type="text" placeholder="Type a message..." />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
