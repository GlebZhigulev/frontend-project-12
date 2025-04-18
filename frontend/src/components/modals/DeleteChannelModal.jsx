import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import { removeChannel } from '../../slices/channelsSlice';

const DeleteChannelModal = ({ channel, onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();

  const handleDelete = async () => {
    try {
      await dispatch(removeChannel(channel.id)).unwrap();
      toast.success(t('notifications.channelDeleted'));
      onClose();
    } catch {
      toast.error(t('notifications.channelNotDeleted'));
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t('modals.deleteChannelTitle')}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>
          <div className="modal-body">
            <p>{t('modals.deleteChannelConfirm', { channelName: channel.name })}</p>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-danger" onClick={handleDelete}>
              {t('chat.delete')}
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              {t('modals.cancel')}
            </button>
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
