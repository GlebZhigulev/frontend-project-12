import { useDispatch } from 'react-redux';
import { removeChannel } from './slices/channelsSlice';
import PropTypes from 'prop-types';

const DeleteChannelModal = ({ channel, onClose }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(removeChannel(channel.id)).unwrap();
      onClose();
    } catch (error) {
      alert('Ошибка при удалении канала');
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Удалить канал</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <p>Вы уверены, что хотите удалить канал &quot;{channel.name}&quot;?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={handleDelete}>Удалить</button>
            <button className="btn btn-secondary" onClick={onClose}>Отмена</button>
          </div>
        </div>
      </div>
    </div>
  );
};

DeleteChannelModal.propTypes = {
  channel: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DeleteChannelModal;
