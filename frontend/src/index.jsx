import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './components/slices/store.js'; // путь к store.js
import init from './init.jsx';
import 'bootstrap/dist/css/bootstrap.min.css';

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector('#chat'));
  const initializedApp = await init();

  root.render(
    <Provider store={store}>
      {initializedApp}
    </Provider>
  );
};

app();