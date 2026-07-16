document.addEventListener('DOMContentLoaded', () => {
  const dataString = localStorage.getItem('tvishaDemoResult');
  const noResult = document.getElementById('noResult');
  const resultWrap = document.getElementById('resultWrap');

  if (!dataString) {
    noResult.hidden = false;
    resultWrap.hidden = true;
    return;
  }

  const data = JSON.parse(dataString);

  noResult.hidden = true;
  resultWrap.hidden = false;

  if (data.photo) {
    document.getElementById('resultPhoto').src = data.photo;
  }

  document.getElementById('resultIcon').textContent = data.icon;
  document.getElementById('resultConcern').textContent = data.concern_name.toUpperCase();
  document.getElementById('resultConditionName').textContent = data.concern_name;
  document.getElementById('resultExplanation').textContent = data.explanation;

  const confidencePill = document.getElementById('resultConfidencePill');
  confidencePill.textContent = data.confidence + '% confidence';
  if (data.confidence >= 75) {
    confidencePill.classList.add('pill--green');
  } else if (data.confidence >= 50) {
    confidencePill.classList.add('pill--amber');
  } else {
    confidencePill.classList.add('pill--coral');
  }

  // all condition scores
  const scoresGrid = document.getElementById('scoresGrid');
  data.all_probs.forEach((p) => {
    const card = document.createElement('div');
    card.className = 'score-card' + (p.is_top ? ' score-card--top' : '');
    card.innerHTML = `
      <div class="score-card-row">
        <span class="score-label">${p.is_top ? '★ ' : ''}${p.label}</span>
        <span class="score-pct">${p.confidence}%</span>
      </div>
      <div class="score-track"><div class="score-fill" data-width="${p.confidence}" style="width:0%"></div></div>
    `;
    scoresGrid.appendChild(card);
  });

  // ingredients
  const ingredientsList = document.getElementById('ingredientsList');
  data.ingredients.forEach((ingredient) => {
    const span = document.createElement('span');
    span.className = 'pill pill--rose';
    span.textContent = ingredient;
    ingredientsList.appendChild(span);
  });

  // products
  const productsList = document.getElementById('productsList');
  const icons = ['🧴', '💧', '🌿', '☀️'];
  data.suggested_products.forEach((product, i) => {
    const div = document.createElement('div');
    div.className = 'product-item';
    div.innerHTML = `
      <span class="product-icon">${icons[i % icons.length]}</span>
      <div>
        <p class="product-brand">${product.brand}</p>
        <p class="product-name">${product.name}</p>
      </div>
    `;
    productsList.appendChild(div);
  });

  // advice
  const adviceList = document.getElementById('adviceList');
  data.skincare_advice.forEach((tip) => {
    const li = document.createElement('li');
    li.textContent = tip;
    adviceList.appendChild(li);
  });

  window.addEventListener('load', () => {
    setTimeout(() => {
      document.getElementById('conf-bar').style.width = data.confidence + '%';
    }, 200);
    setTimeout(() => {
      document.querySelectorAll('.score-fill').forEach((el) => {
        el.style.width = el.dataset.width + '%';
      });
    }, 400);
  });
});
