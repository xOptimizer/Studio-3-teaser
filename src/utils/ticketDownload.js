import html2canvas from 'html2canvas';

function waitForImages(element) {
  const images = element.querySelectorAll('img');
  return Promise.all(
    [...images].map(
      (img) =>
        new Promise((resolve) => {
          if (img.complete && img.naturalWidth > 0) {
            resolve();
            return;
          }
          img.onload = () => resolve();
          img.onerror = () => resolve();
        })
    )
  );
}

export async function captureElementAsPng(element, filename) {
  if (!element) {
    throw new Error('Nothing to capture');
  }

  await waitForImages(element);
  await new Promise((resolve) => {
    requestAnimationFrame(() => requestAnimationFrame(resolve));
  });

  const width = element.scrollWidth;
  const height = element.scrollHeight;

  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#F7F7F7',
    useCORS: true,
    logging: false,
    width,
    height,
    windowWidth: width,
    windowHeight: height,
    scrollX: 0,
    scrollY: 0,
  });

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to create image'));
          return;
        }

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(url);
        resolve();
      },
      'image/png'
    );
  });
}
