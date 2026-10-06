import { useState } from 'react';

export default function RebuildIndexesButton({ onSuccess }) {
  const [loading, setLoading] = useState(false);

  const handleRebuild = async () => {
    if (loading) return;

    setLoading(true);

    try {
      // ---------------------------------------------------------
      // 🔌 REAL BACKEND CALL (uncomment when ready)
      // ---------------------------------------------------------
      // const res = await fetch(`${import.meta.env.VITE_API_URL}/maintenance/rebuild-indexes`, {
      //   method: 'POST',
      // });
      // if (!res.ok) throw new Error('Rebuild failed');
      
      // ---------------------------------------------------------
      // 🧪 SIMULATED DELAY (for demo purposes)
      // ---------------------------------------------------------
      await new Promise((resolve) => setTimeout(resolve, 2500));

      // Trigger parent success callback (shows the toast)
      onSuccess?.('Database indexes rebuilt successfully');
    } catch (err) {
      console.error(err);
      onSuccess?.('Failed to rebuild indexes', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      className="btn btn-primary btn-lg"
      style={{ width: '100%', justifyContent: 'center' }}
      onClick={handleRebuild}
      disabled={loading}
    >
      {loading ? (
        <>
          <i className="fas fa-spinner fa-spin"></i>
          Rebuilding indexes…
        </>
      ) : (
        <>
          <i className="fas fa-database"></i>
          Rebuild database indexes
        </>
      )}
    </button>
  );
}