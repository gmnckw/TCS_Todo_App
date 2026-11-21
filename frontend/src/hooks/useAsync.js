import { useCallback, useEffect, useState } from 'react';

// Runs `loader` whenever `deps` change or `reload` is called, exposing { data, error, loading, reload }.
// Each result is tagged with the request key it belongs to. `loading` is derived by comparing
// that key with the current one, so a superseded response can never overwrite a newer request.
export function useAsync(loader, deps = []) {
  const [reloadCount, setReloadCount] = useState(0);
  const [result, setResult] = useState({ key: null, data: null, error: null });
  const requestKey = JSON.stringify([deps, reloadCount]);

  useEffect(() => {
    let active = true;
    loader().then(
      (data) => active && setResult({ key: requestKey, data, error: null }),
      (error) => active && setResult({ key: requestKey, data: null, error }),
    );
    return () => {
      active = false;
    };
    // `loader` is recreated on every render; the caller controls re-runs through `deps`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestKey]);

  const reload = useCallback(() => setReloadCount((count) => count + 1), []);

  const loading = result.key !== requestKey;
  return {
    data: loading ? null : result.data,
    error: loading ? null : result.error,
    loading,
    reload,
  };
}
