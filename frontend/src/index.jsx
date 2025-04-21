import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import store from './slices/store'; // путь к store.js
import init from './init';
import 'bootstrap/dist/css/bootstrap.min.css';
import { setupSocket } from './tools/socket';

const app = async () => {
  const root = ReactDOM.createRoot(document.querySelector('#chat'));
  const initializedApp = await init();
  setupSocket(store);
  root.render(<Provider store={store}>{initializedApp}</Provider>);
};
app();
