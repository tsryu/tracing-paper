document.addEventListener('DOMContentLoaded', function () {
  const imageInput = document.getElementById('imageInput');
  const deleteImageBtn = document.getElementById('deleteImage');
  const opacitySlider = document.getElementById('opacitySlider');

  imageInput.addEventListener('change', handleImageInputChange);
  deleteImageBtn.addEventListener('click', handleDeleteImageClick);
  opacitySlider.addEventListener('input', handleOpacitySliderInput);

  function handleImageInputChange(e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (e) {
        const imageUrl = e.target.result;
        displayImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  }

  function handleDeleteImageClick() {
    imageInput.value = '';
    sendMessageToContentScript({ action: 'removeOverlay' });
  }

  function handleOpacitySliderInput() {
    setOpacity(opacitySlider.value);
  }

  function displayImage(url) {
    const overlayDiv = createOverlayDiv();

    const overlayImage = new Image();
    overlayImage.src = url;
    overlayImage.style.opacity = opacitySlider.value;
    overlayImage.style.pointerEvents = 'none';

    overlayDiv.appendChild(overlayImage);

    sendMessageToContentScript({ action: 'insertOverlay', content: overlayDiv.outerHTML });
  }

  function createOverlayDiv() {
    const overlayDiv = document.createElement('div');
    Object.assign(overlayDiv.style, {
      position: 'absolute',
      top: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: '9999',
      cursor: 'grab',
    });
    overlayDiv.setAttribute('id', 'TRACING_PAPER_OVERLAY')

    return overlayDiv;
  }

  function setOpacity(value) {
    sendMessageToContentScript({ action: 'opacityOverlay', value });
  }

  function sendMessageToContentScript(message) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      const activeTabId = tabs[0].id;
      chrome.tabs.sendMessage(activeTabId, message);
    });
  }
});