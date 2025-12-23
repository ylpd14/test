let questions = [];
let selectedIndex = null;

function addQuestion(type){
  const q = {
    type,
    label: '未命名題目',
    description: '',
    required: false
  };
  questions.push(q);
  selectedIndex = questions.length - 1;
  render();
  renderProperties();
}

function render(){
  const canvas = document.getElementById('canvas');
  canvas.innerHTML = '';
  questions.forEach((q, i) => {
    const div = document.createElement('div');
    div.className = 'question-card' + (i === selectedIndex ? ' active' : '');
    div.onclick = () => {
      selectedIndex = i;
      render();
      renderProperties();
    };
    div.innerHTML = `<strong>${q.label}</strong><div>${q.type}</div>`;
    canvas.appendChild(div);
  });
}

function renderProperties(){
  if(selectedIndex === null) return;
  const q = questions[selectedIndex];
  const p = document.getElementById('propertyPanel');
  p.innerHTML = `
    <label>題目名稱</label>
    <input value="${q.label}" oninput="updateLabel(this.value)">
    <label>題目說明</label>
    <textarea oninput="q.description=this.value">${q.description}</textarea>
    <label>
      <input type="checkbox" ${q.required?'checked':''}
        onchange="q.required=this.checked"> 必填
    </label>
  `;
}

function updateLabel(val){
  questions[selectedIndex].label = val;
  render();
}
