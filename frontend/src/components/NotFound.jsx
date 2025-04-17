import { useTranslation } from 'react-i18next';

function NotFound() {
  const { t } = useTranslation();
  return <h1>{t('notFound.message')}</h1>;
}

export default NotFound;
