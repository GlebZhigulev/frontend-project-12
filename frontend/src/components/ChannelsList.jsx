import { useDispatch, useSelector } from 'react-redux';
import { setCurrentChannel } from './slices/channelsSlice';

function ChannelsList() {
  const dispatch = useDispatch();
  const { channels, currentChannelId } = useSelector((state) => state.channels);

  return (
    <div className="channels-list">
      <h3>Channels</h3>
      <ul>
        {channels.map((channel) => (
          <li key={channel.id}>
            <button
              className={channel.id === currentChannelId ? 'active' : ''}
              onClick={() => dispatch(setCurrentChannel(channel.id))}
            >
              # {channel.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ChannelsList;
