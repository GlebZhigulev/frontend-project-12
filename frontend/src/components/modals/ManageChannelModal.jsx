import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ManageChannelModal = ({ onClose, onRename, onDelete }) => {
  const { t } = useTranslation();

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t('chat.manage')}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
              aria-label="Close"
            />
          </div>
          <div className="modal-body d-flex justify-content-between">
            <button className="btn btn-secondary" onClick={onRename}>
              {t('chat.rename')}
            </button>
            <button className="btn btn-danger" onClick={onDelete}>
              {t('chat.delete')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

ManageChannelModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onRename: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default ManageChannelModal;
