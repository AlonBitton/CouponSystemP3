import App from 'layout/layout';
import ReactDOM from 'react-dom/client';
import reportWebVitals from 'reportWebVitals';
import interceptors from 'utils/Interceptors';
import './index.css';

interceptors.create();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
reportWebVitals();
