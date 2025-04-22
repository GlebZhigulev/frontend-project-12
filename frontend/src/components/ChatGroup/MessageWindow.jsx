import React, { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Formik, Form, Field } from 'formik';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import apiClient from '../../tools/apiClient';
import { useAuth } from '../../contexts/AuthContext';

const MessageWindow = () => {
  const { t } = useTranslation();
  const { messages } = useSelector((state) => state.messages);
  const { channels, currentChanelId } = useSelector((state) => state.channels);
  const { username } = useAuth();

  const sentMessages = useRef(new Set());

  const currentChannel = channels.find((c) => c.id === currentChanelId) || channels[0];
  const filteredMessages = messages.filter((m) => m.channelId === currentChannel?.id);

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const response = await apiClient.post('/messages', {
        body: leoProfanity.clean(values.message),
        channelId: currentChannel.id,
        username,
      });
      if (response.data) {
        sentMessages.current.add(response.data.id);
        resetForm();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('chat.sendError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="col-md-9">
      <div className="card">
        <div className="card-header">
          {t('chat.messages')}
          (
          {currentChannel?.name || t('chat.noChannelSelected')}
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
          <Formik
            initialValues={{ message: '' }}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form className="d-flex">
                <Field
                  name="message"
                  placeholder={t('chat.typeMessage')}
                  className="form-control me-2"
                  aria-label={t('chat.typeMessage')}
                  disabled={isSubmitting}
                />
                <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                  {isSubmitting ? t('chat.sending') : t('chat.send')}
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default MessageWindow;
