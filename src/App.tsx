import useRouteElements from './useRouteElements'
import './App.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ErrorBoundary from './pages/ErrorBoundary';
import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import Spinner from './components/common/Spinner';

function App() {
  const routeElements = useRouteElements()
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  return (
    <div className="wrapper">
      <ErrorBoundary>
        {isFetching + isMutating !== 0 && <Spinner />}
        {routeElements}
        <ToastContainer />
      </ErrorBoundary>
    </div>
  );
}

export default App;
