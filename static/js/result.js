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

  document.getElementById('resultCondition').textContent = data.concern_name;
  document.getElementById('resultConfidence').textContent = data.confidence + '%';

  const adviceList = document.getElementById('resultAdvice');
  data.advice.forEach((tip) => {
    const li = document.createElement('li');
    li.textContent = tip;
    adviceList.appendChild(li);
  });
});
