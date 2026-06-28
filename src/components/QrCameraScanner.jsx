import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';

const REGION_ID = 'qr-camera-viewfinder';
const SCAN_DEBOUNCE_MS = 2500;

export default function QrCameraScanner({ onScan, active = true }) {
  const scannerRef = useRef(null);
  const onScanRef = useRef(onScan);
  const lastScanRef = useRef('');
  const debounceTimerRef = useRef(null);
  const [error, setError] = useState(null);
  const [starting, setStarting] = useState(true);

  onScanRef.current = onScan;

  useEffect(() => {
    if (!active) {
      setStarting(false);
      return undefined;
    }

    let mounted = true;

    const stopScanner = async (instance) => {
      if (!instance) return;
      try {
        const state = instance.getState();
        // 2 = SCANNING, 3 = PAUSED
        if (state === 2 || state === 3) {
          await instance.stop();
        }
      } catch {
        // ignore stop errors during teardown
      }
      try {
        instance.clear();
      } catch {
        // ignore clear errors during teardown
      }
    };

    const startScanner = async () => {
      const scanner = new Html5Qrcode(REGION_ID, { verbose: false });
      scannerRef.current = scanner;

      const config = {
        fps: 10,
        qrbox: (width, height) => {
          const size = Math.floor(Math.min(width, height) * 0.75);
          return { width: size, height: size };
        },
      };

      const onDecoded = (text) => {
        if (!mounted || !text?.trim()) return;
        const value = text.trim();
        if (value === lastScanRef.current) return;

        lastScanRef.current = value;
        onScanRef.current?.(value);

        if (debounceTimerRef.current) {
          window.clearTimeout(debounceTimerRef.current);
        }
        debounceTimerRef.current = window.setTimeout(() => {
          lastScanRef.current = '';
        }, SCAN_DEBOUNCE_MS);
      };

      try {
        await scanner.start({ facingMode: 'environment' }, config, onDecoded, () => {});
        if (mounted) {
          setStarting(false);
          setError(null);
        }
        return;
      } catch {
        // fall back to first listed camera (e.g. laptop webcam)
      }

      try {
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras?.length) {
          throw new Error('No camera found on this device');
        }

        await scanner.start(cameras[0].id, config, onDecoded, () => {});
        if (mounted) {
          setStarting(false);
          setError(null);
        }
      } catch (startError) {
        if (mounted) {
          setStarting(false);
          setError(
            startError?.message ||
              'Could not start the camera. Allow camera access or use booking ID below.'
          );
        }
        await stopScanner(scanner);
      }
    };

    setStarting(true);
    setError(null);
    const timerId = window.setTimeout(() => {
      startScanner();
    }, 250);

    return () => {
      mounted = false;
      window.clearTimeout(timerId);
      if (debounceTimerRef.current) {
        window.clearTimeout(debounceTimerRef.current);
      }
      const instance = scannerRef.current;
      scannerRef.current = null;
      stopScanner(instance);
    };
  }, [active]);

  return (
    <div className="qr-camera-shell">
      <div id={REGION_ID} className="qr-camera-viewfinder" />
      {starting && active && !error && (
        <p className="qr-camera-status">Starting camera…</p>
      )}
      {error && (
        <p className="qr-camera-error">{error}</p>
      )}
    </div>
  );
}
