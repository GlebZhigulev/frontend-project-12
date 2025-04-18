import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import leoProfanity from 'leo-profanity';
import { addChannel } from '../../slices/channelsSlice';

const ChannelForm = ({ onClose }) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { channels } = useSelector((state) => state.channels);

  const initialValues = { name: '' };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, 'От 3 до 20 символов')
      .max(20, 'От 3 до 20 символов')
      .test('unique', t('validation.unique'), (value) => !channels.some((ch) => ch.name === value))
      .required(t('validation.required')),
  });

  const handleSubmit = async (values, { setSubmitting, setErrors }) => {
    try {
      const cleanName = leoProfanity.clean(values.name);
      await dispatch(addChannel(cleanName)).unwrap();
      toast.success(t('notifications.channelCreated'));
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
            <h5 className="modal-title">{t('modals.addChannelTitle')}</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Close" />
          </div>
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label" htmlFor="channelName">
                      Имя канала
                      <Field name="name">
                        {({ field }) => (
                          <input
                            id="channelName"
                            name={field.name}
                            value={field.value}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            placeholder="Название канала"
                            className="form-control d-block w-100"
                          />
                        )}
                      </Field>
                    </label>
                    <ErrorMessage name="name" component="div" className="text-danger mt-1" />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
                    {t('chat.addChannel')}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={onClose}>
                    {t('modals.cancel')}
                  </button>
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
