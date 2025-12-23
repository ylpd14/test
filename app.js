let questions=[],selected=null;

function addQuestion(type){
  questions.push({
    type,
    label:'未命名題目',
    description:'',
    required:false
  });
  render();
}

function render(){
  const c=document.getElementById('canvas');
  c.innerHTML='';
  questions.forEach((q,i)=>{
    const d=document.createElement('div');
    d.className='question-card'+(i===selected?' active':'');
    d.onclick=()=>{selected=i;render();renderProp(q)};
    d.innerHTML='<strong>'+q.label+'</strong><div>'+q.type+'</div>';
    c.appendChild(d);
  });
}

function renderProp(q){
  document.getElementById('propertyPanel').innerHTML=`
    <div class="prop-group">
      <label>題目名稱</label>
      <input value="${q.label}" oninput="q.label=this.value">
      <label>題目說明</label>
      <textarea oninput="q.description=this.value">${q.description}</textarea>
      <label><input type="checkbox" ${q.required?'checked':''}
        onchange="q.required=this.checked"> 必填</label>
    </div>
  `;
}