import i18next from 'i18next';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import { ToastContainer } from 'react-toastify';
import App from './components/App';
import resources from './locales/index.js';
import 'react-toastify/dist/ReactToastify.css';
import leoProfanity from 'leo-profanity';

const init = async () => {
  const i18n = i18next.createInstance();
  leoProfanity.loadDictionary('ru');
  leoProfanity.add(leoProfanity.getDictionary('en'));
  await i18n.use(initReactI18next).init({
    resources,
    lng: 'ru',
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
  });

  return (
    <I18nextProvider i18n={i18n}>
      <>
        <App />
        <ToastContainer />
      </>
    </I18nextProvider>
  );
};

export default init;
