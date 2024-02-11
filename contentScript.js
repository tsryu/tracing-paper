chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  switch (request.action) {
    case 'insertOverlay':
      insertOverlay(request.content);
      break;
    case 'removeOverlay':
      removeOverlay();
      break;
    case 'opacityOverlay':
      setOverlayOpacity(request.value);
      break;
    // Add more cases if needed

    default:
      // Handle unknown action
      break;
  }
});

function insertOverlay(content) {
  const overlayDiv = document.createElement('div');
  overlayDiv.innerHTML = content;
  document.body.appendChild(overlayDiv.firstChild);
}

function removeOverlay() {
  const overlayDiv = document.querySelector('#TRACING_PAPER_OVERLAY');
  if (overlayDiv) {
    overlayDiv.remove();
  }
}

function setOverlayOpacity(value) {
  const overlayDiv = document.querySelector('#TRACING_PAPER_OVERLAY');
  if (overlayDiv) {
    const overlayImage = overlayDiv.querySelector('img');
    if (overlayImage) {
      overlayImage.style.opacity = value;
    }
  }
}

// document에서 mousedown 이벤트를 캐치합니다.
document.addEventListener('mousedown', function(e) {
  // 드래그 가능한 엘리먼트인지 확인합니다.
  if (e.target.id === 'TRACING_PAPER_OVERLAY') {
    // 드래그가 시작되었을 때의 초기 좌표를 저장합니다.
    var offsetX = e.clientX - e.target.getBoundingClientRect().left;
    var offsetY = e.clientY - e.target.getBoundingClientRect().top;

    // 드래그 중에 발생하는 이벤트를 등록합니다.
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);

    // 드래그 중에 호출되는 함수
    function dragMove(e) {
      // 새로운 좌표를 계산하여 엘리먼트의 위치를 업데이트합니다.
      var x = e.clientX - offsetX;
      var y = e.clientY - offsetY;

      // 엘리먼트의 위치를 변경합니다.
      e.target.style.left = 0;
      e.target.style.top = 0;
      e.target.style.transform = `translate(${x}px, ${y}px)`
    }

    // 드래그 종료시 호출되는 함수
    function dragEnd() {
      // 드래그 이벤트 리스너를 제거합니다.
      document.removeEventListener('mousemove', dragMove);
      document.removeEventListener('mouseup', dragEnd);
    }
  }
});