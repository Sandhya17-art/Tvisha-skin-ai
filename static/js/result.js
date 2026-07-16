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

  const photo = document.getElementById('resultPhoto');
  if (data.photo) {
    photo.src = data.photo;
  } else {
    photo.hidden = true;
  }

  document.getElementById('resultCondition').textContent = data.condition;
  document.getElementById('resultConfidence').textContent = data.confidence + '%';

  const adviceList = document.getElementById('resultAdvice');
  adviceList.innerHTML = '';
  data.advice.forEach((tip) => {
    const li = document.createElement('li');
    li.textContent = tip;
    adviceList.appendChild(li);
  });

  requestAnimationFrame(() => {
    const bar = document.getElementById('resultConfBar');
    bar.style.transition = 'width 0.8s ease';
    bar.style.width = data.confidence + '%';
  });
});
