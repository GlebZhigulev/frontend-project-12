import React, { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import apiClient from '../tools/apiClient';

const MessageWindow = () => {
  const { t } = useTranslation();
  const { messages } = useSelector((state) => state.chat);
  const { channels, currentChanelId } = useSelector((state) => state.channels);
  const username = useSelector((state) => state.auth.username);

  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const sentMessages = useRef(new Set());

  const currentChannel = channels.find((c) => c.id === currentChanelId) || channels[0];
  const filteredMessages = messages.filter((m) => m.channelId === currentChannel?.id);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !currentChannel) return;
    setIsSending(true);
    try {
      const response = await apiClient.post('/messages', {
        body: leoProfanity.clean(messageText),
        channelId: currentChannel.id,
        username,
      });
      if (response.data) {
        sentMessages.current.add(response.data.id);
        setMessageText('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('chat.sendError'));
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="col-md-9">
      <div className="card">
        <div className="card-header">
          {t('chat.messages')}
          {' '}
          (
          {currentChannel ? currentChannel.name : t('chat.noChannelSelected')}
          )
        </div>
        <div className="card-body" style={{ maxHeight: '400px', overflowY: 'auto' }}>
          <ul className="list-unstyled">
            {filteredMessages.map((message) => (
              <li key={message.id}>
                <strong>{message.username}</strong>
                :
                {message.body}
              </li>
            ))}
          </ul>
        </div>
        <div className="card-footer">
          <form onSubmit={handleSendMessage} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder={t('chat.typeMessage')}
              aria-label={t('chat.typeMessage')}
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              disabled={isSending}
            />
            <button type="submit" className="btn btn-primary" disabled={isSending}>
              {isSending ? t('chat.sending') : t('chat.send')}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageWindow;
