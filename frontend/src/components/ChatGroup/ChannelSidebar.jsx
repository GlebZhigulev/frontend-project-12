import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { setCurrentChannel } from '../../slices/channelsSlice';

const ChannelSidebar = ({ onAddChannel, onManageChannel }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { channels, currentChanelId } = useSelector((state) => state.channels);

  return (
    <div className="col-md-3 mb-3">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <span>{t('chat.channels')}</span>
          <button
            type="button"
            className="btn btn-sm btn-primary"
            onClick={onAddChannel}
          >
            {t('chat.addChannel')}
          </button>
        </div>
        <ul className="list-group list-group-flush">
          {channels.map((channel) => (
            <li
              key={channel.id}
              className={
                `list-group-item d-flex justify-content-between align-items-center 
                ${channel.id === currentChanelId ? 'active' : ''}`
              }
            >
              <button
                type="button"
                className="btn btn-link p-0 m-0 text-decoration-none"
                style={{ color: channel.id === currentChanelId ? '#fff' : '#0d6efd' }}
                onClick={() => dispatch(setCurrentChannel(channel.id))}
              >
                {channel.name}
              </button>
              {channel.removable && (
                <button
                  type="button"
                  className="btn btn-outline-secondary btn-sm"
                  onClick={() => onManageChannel(channel)}
                >
                  {t('chat.manage')}
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ChannelSidebar;
