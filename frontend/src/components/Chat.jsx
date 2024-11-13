import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatData } from './chatSlice';

const Chat = () => {
    const dispatch = useDispatch();
    const { channels, messages, status, error } = useSelector((state) => state.chat);
    useEffect(() => {
        dispatch(fetchChatData());
    }, [dispatch]);

    if (status === 'loading') return <div>Loading...</div>;
    if (status === 'failed') return <div>Error...</div>;

    return (
        <div className='chat'>
            <div className='channels'>
                <h2>Channels</h2>
                <ul>
                    {channels.map((channel) => (
                        <li key={channel.id}>{channel.name}</li>
                    ))}
                </ul>
            </div>
            <div className='messages'>
                <h2>Messages</h2>
                <ul>
                    {messages.map((message) => (
                        <li key={message.id}>{message.content}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Chat;