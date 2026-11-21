import { useLocation } from 'react-router-dom';
import { FLASH_STATE_KEY } from '../config/constants';

// Reads a one-off success message passed through router navigation state.
export function useFlashMessage() {
  const location = useLocation();
  return location.state?.[FLASH_STATE_KEY] ?? null;
}
