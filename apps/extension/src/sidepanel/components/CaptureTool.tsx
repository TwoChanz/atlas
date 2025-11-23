import { useState } from 'react';

interface CaptureToolProps {
  tab: chrome.tabs.Tab;
}

export function CaptureTool({ tab }: CaptureToolProps) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [message, setMessage] = useState<string>('');

  const handleCapture = async () => {
    if (!tab.url || !tab.title) {
      setMessage('Cannot capture this page');
      return;
    }

    setIsCapturing(true);
    setMessage('');

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'CAPTURE_TOOL',
        data: {
          url: tab.url,
          title: tab.title,
          favicon: tab.favIconUrl,
        },
      });

      if (response.success) {
        setMessage('Tool captured successfully!');
      } else {
        setMessage(`Failed to capture: ${response.error}`);
      }
    } catch (error) {
      setMessage('Error capturing tool');
      console.error(error);
    } finally {
      setIsCapturing(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div className="capture-tool">
      <div className="capture-tool-info">
        {tab.favIconUrl && (
          <img src={tab.favIconUrl} alt="" className="capture-tool-icon" />
        )}
        <div className="capture-tool-details">
          <h3 className="capture-tool-title">{tab.title}</h3>
          <p className="capture-tool-url">{tab.url}</p>
        </div>
      </div>

      <button
        onClick={handleCapture}
        disabled={isCapturing}
        className="capture-button"
      >
        {isCapturing ? 'Capturing...' : 'Capture Tool'}
      </button>

      {message && <p className="capture-message">{message}</p>}
    </div>
  );
}
