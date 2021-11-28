export default async function copyTextToClipboard(text: string): Promise<boolean> {
  if (!navigator.clipboard) {
    return fallbackCopyTextToClipboard(text);
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (e) {
    return false;
  }
}

function fallbackCopyTextToClipboard(text: string): boolean {
  const textArea = document.createElement('textarea');
  textArea.value = text;

  // Avoid scrolling to bottom
  textArea.style.top = '0';
  textArea.style.left = '0';
  textArea.style.position = 'fixed';

  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();

  let ret: boolean;
  try {
    ret = document.execCommand('copy');
  } catch (err) {
    ret = false;
  }

  document.body.removeChild(textArea);

  return ret;
}
