// components/ModalManager.jsx
import { useSelector, useDispatch } from 'react-redux';
import AddChannelModal from './AddChannelModal';
import RenameChannelModal from './RenameChannelModal';
import DeleteChannelModal from './DeleteChannelModal';
import ManageChannelModal from './ManageChannelModal';
import { closeModal, openModal } from '../../slices/modalSlice';

const ModalRoot = () => {
  const { type, data } = useSelector((state) => state.modal);
  const dispatch = useDispatch();

  if (!type) return null;

  const handleClose = () => dispatch(closeModal());

  switch (type) {
    case 'add':
      return <AddChannelModal onClose={handleClose} />;
    case 'rename':
      return <RenameChannelModal channel={data} onClose={handleClose} />;
    case 'delete':
      return <DeleteChannelModal channel={data} onClose={handleClose} />;
    case 'manage':
      return (
        <ManageChannelModal
          onClose={handleClose}
          onRename={() => dispatch(openModal({ type: 'rename', data }))}
          onDelete={() => dispatch(openModal({ type: 'delete', data }))}
        />
      );
    default:
      return null;
  }
};

export default ModalRoot;
