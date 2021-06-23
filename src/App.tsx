import Routes from './routes'
import 'react-toastify/dist/ReactToastify.css';
import {Toaster} from 'react-hot-toast'
function App() {
  return (
      <div>
        <Routes/>
        <Toaster
          position="top-right"
          reverseOrder={false}
        />
      </div>
  );
}

export default App;
