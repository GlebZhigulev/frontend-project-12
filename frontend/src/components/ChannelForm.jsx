import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import { addChannel } from './slices/channelsSlice';
import PropTypes from 'prop-types';

const ChannelForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { channels } = useSelector(state => state.channels);

  const initialValues = { name: '' };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'Минимум 3 символа')
      .max(20, 'Максимум 20 символов')
      .test('unique', 'Имя канала должно быть уникальным', function(value) {
        return !channels.some(ch => ch.name === value);
      })
      .required('Обязательное поле'),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      await dispatch(addChannel(values.name)).unwrap();
      onClose();
    } catch (error) {
      setErrors({ name: error.message || 'Ошибка при добавлении канала' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal show d-block" tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Добавить канал</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close"></button>
          </div>
          <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
            {({ isSubmitting }) => (
              <Form>
                <div className="modal-body">
                  <div className="mb-3">
                    <Field name="name" autoFocus placeholder="Название канала" className="form-control" />
                    <ErrorMessage name="name" component="div" className="text-danger mt-1" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>Добавить</button>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>Отмена</button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

ChannelForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default ChannelForm;
