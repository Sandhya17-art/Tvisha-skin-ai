const uploadForm = document.getElementById('uploadForm');

if (uploadForm) {
  const uploadBox = document.getElementById('uploadBox');
  const fileInput = document.getElementById('fileInput');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const previewImage = document.getElementById('previewImage');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const loadingState = document.getElementById('loadingState');
  const resultCard = document.getElementById('resultCard');
  const resultConfBar = document.getElementById('resultConfBar');

  uploadBox.addEventListener('click', () => fileInput.click());

  fileInput.addEventListener('change', (e) => {
    handleFile(e.target.files[0]);
  });

  uploadBox.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadBox.classList.add('drag-over');
  });

  uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('drag-over');
  });

  uploadBox.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadBox.classList.remove('drag-over');
    handleFile(e.dataTransfer.files[0]);
  });

  function handleFile(file) {
    if (!file || !file.type.startsWith('image/')) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.hidden = false;
      uploadPlaceholder.hidden = true;
    };
    reader.readAsDataURL(file);

    analyzeBtn.disabled = false;
    resultCard.hidden = true;
    resultConfBar.style.width = '0%';
  }

  analyzeBtn.addEventListener('click', () => {
    analyzeBtn.disabled = true;
    resultCard.hidden = true;
    loadingState.hidden = false;

    setTimeout(() => {
      loadingState.hidden = true;
      resultCard.hidden = false;
      analyzeBtn.disabled = false;

      // animate the confidence bar in after the card appears
      requestAnimationFrame(() => {
        resultConfBar.style.transition = 'width 0.8s ease';
        resultConfBar.style.width = '94%';
      });
    }, 1800);
  });
}
