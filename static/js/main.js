const uploadForm = document.getElementById('uploadForm');

if (uploadForm) {
  const uploadBox = document.getElementById('uploadBox');
  const fileInput = document.getElementById('fileInput');
  const uploadPlaceholder = document.getElementById('uploadPlaceholder');
  const previewImage = document.getElementById('previewImage');
  const analyzeBtn = document.getElementById('analyzeBtn');
  const loadingState = document.getElementById('loadingState');

  let selectedPhotoDataUrl = null;

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
      selectedPhotoDataUrl = e.target.result;
      previewImage.src = selectedPhotoDataUrl;
      previewImage.hidden = false;
      uploadPlaceholder.hidden = true;
    };
    reader.readAsDataURL(file);

    analyzeBtn.disabled = false;
  }

  analyzeBtn.addEventListener('click', () => {
    analyzeBtn.disabled = true;
    loadingState.hidden = false;

    setTimeout(() => {
      const demoResult = {
        photo: selectedPhotoDataUrl,
        condition: 'Inflammatory Acne',
        confidence: 94,
        advice: [
          'Apply broad-spectrum SPF 30+ daily',
          'Never pick or pop affected areas',
          'Use a gentle, non-comedogenic cleanser'
        ]
      };
      localStorage.setItem('tvishaDemoResult', JSON.stringify(demoResult));
      window.location.href = '/result';
    }, 1800);
  });
}
