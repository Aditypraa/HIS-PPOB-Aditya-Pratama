import { useContext } from 'react';
import { XCircle } from 'lucide-react';
import { AppContext } from '../../contexts/AppContext';

function ErrorDisplay() {
  const { state, dispatch } = useContext(AppContext);
  const { error } = state;

  if (!error) return null;

  // Extract message from different error shapes
  const errorMessage = typeof error === 'string'
    ? error
    : error.message || 'Terjadi kesalahan yang tidak diketahui';

  return (
    <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md shadow-lg z-[100]" role="alert">
      <div className="flex items-center">
        <XCircle className="text-red-500 mr-2" size={20} />
        <span className="block sm:inline text-sm">{errorMessage}</span>
      </div>
      <button
        onClick={() => dispatch({ type: 'CLEAR_ERROR' })}
        className="absolute top-1 right-1 text-red-500 hover:text-red-700"
        aria-label="Close"
      >
        <XCircle size={16} />
      </button>
    </div>
  );
}

export default ErrorDisplay;
