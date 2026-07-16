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
        icon: '🔥',
        confidence: 94.6,
        concern_name: 'Inflammatory Acne',
        explanation: 'Your skin shows inflammatory acne — red, swollen pimples, pustules, or cysts caused by bacteria and excess oil triggering an immune response.',
        all_probs: [
          { label: 'Inflammatory Acne', confidence: 94.6, is_top: true },
          { label: 'Enlarged Pores', confidence: 2.1, is_top: false },
          { label: 'Dark Spots', confidence: 1.2, is_top: false },
          { label: 'Skin Redness', confidence: 0.9, is_top: false },
          { label: 'Blackheads', confidence: 0.6, is_top: false },
          { label: 'Pigmentation', confidence: 0.4, is_top: false },
          { label: 'Whiteheads', confidence: 0.2, is_top: false },
          { label: 'Fine Lines & Wrinkles', confidence: 0.0, is_top: false }
        ],
        ingredients: ['Salicylic Acid', 'Benzoyl Peroxide', 'Tea Tree Oil', 'Zinc', 'Niacinamide'],
        suggested_products: [
          { brand: 'COSRX', name: 'Acne Pimple Master Patch' },
          { brand: 'Some By Mi', name: '30 Days Miracle Toner' },
          { brand: 'CeraVe', name: 'Acne Foaming Cream Cleanser' },
          { brand: 'COSRX', name: 'Salicylic Acid Daily Gentle Cleanser' }
        ],
        skincare_advice: [
          'Cleanse your face twice daily with a gentle non-comedogenic cleanser',
          'Never pick or pop pimples — this worsens inflammation and causes scarring',
          'Use only oil-free, non-comedogenic moisturizers and makeup',
          'Change pillowcases every 2–3 days to reduce bacteria exposure',
          'Consult a dermatologist if acne is severe or persists beyond 3 months'
        ]
      };
      localStorage.setItem('tvishaDemoResult', JSON.stringify(demoResult));
      window.location.href = '/result';
    }, 1800);
  });
}
