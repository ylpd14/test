let questions=[];
let selected=null;

function addQuestion(type){
  const q={
    type,
    label:'未命名的問題',
    description:'',
    required:false,

    // text
    uppercase:false,min:'',max:'',autoPrev:false,

    // date time
    date:{enabled:false,visible:true,auto:false},
    time:{enabled:false,visible:true,auto:false},
    allowManual:true,

    // shift
    shiftDisplay:'dropdown',
    shiftSmart:false,
    shiftRules:[]
  };
  questions.push(q);
  render();
}

function render(){
  const c=document.getElementById('canvas');
  c.innerHTML='';
  questions.forEach((q,i)=>{
    const d=document.createElement('div');
    d.className='question-card'+(i===selected?' active':'');
    d.onclick=()=>{selected=i;render();renderProp(q)};
    d.innerHTML=`<strong>${q.label}</strong><div>${q.type}</div>`;
    c.appendChild(d);
  });
}

function renderProp(q){
  let html=`
  <div class='prop-group'>
    <label>題目名稱</label>
    <input value="${q.label}" oninput="q.label=this.value">
    <label>題目說明</label>
    <textarea oninput="q.description=this.value">${q.description}</textarea>
    <label><input type="checkbox" ${q.required?'checked':''}
      onchange="q.required=this.checked"> 必填</label>
  </div>`;

  if(q.type==='short_text'||q.type==='long_text'){
    html+=`
    <div class='prop-group'>
      <h4>文字設定</h4>
      <label><input type="checkbox" ${q.uppercase?'checked':''}
        onchange="q.uppercase=this.checked"> 自動大寫</label>
      <label>最小字數 <input value="${q.min}" oninput="q.min=this.value"></label>
      <label>最大字數 <input value="${q.max}" oninput="q.max=this.value"></label>
      <label><input type="checkbox" ${q.autoPrev?'checked':''}
        onchange="q.autoPrev=this.checked"> 自動帶入前一筆</label>
    </div>`;
  }

  if(q.type==='date'||q.type==='time'||q.type==='datetime'){
    html+=`
    <div class='prop-group'>
      <h4>日期設定</h4>
      <label><input type="checkbox" ${q.date.enabled?'checked':''}
        onchange="q.date.enabled=this.checked"> 紀錄日期</label>
      <div class='sub'>
        <label><input type="radio" name="dvis" ${q.date.visible?'checked':''}
          onchange="q.date.visible=true"> 顯示</label>
        <label><input type="radio" name="dvis" ${!q.date.visible?'checked':''}
          onchange="q.date.visible=false"> 僅後台</label>
        <label><input type="checkbox" ${q.date.auto?'checked':''}
          onchange="q.date.auto=this.checked"> 自動今天</label>
      </div>

      <h4>時間設定</h4>
      <label><input type="checkbox" ${q.time.enabled?'checked':''}
        onchange="q.time.enabled=this.checked"> 紀錄時間</label>
      <div class='sub'>
        <label><input type="radio" name="tvis" ${q.time.visible?'checked':''}
          onchange="q.time.visible=true"> 顯示</label>
        <label><input type="radio" name="tvis" ${!q.time.visible?'checked':''}
          onchange="q.time.visible=false"> 僅後台</label>
        <label><input type="checkbox" ${q.time.auto?'checked':''}
          onchange="q.time.auto=this.checked"> 自動現在</label>
      </div>

      <label><input type="checkbox" ${q.allowManual?'checked':''}
        onchange="q.allowManual=this.checked"> 允許手動修改</label>
    </div>`;
  }

  if(q.type==='shift'){
    html+=`
    <div class='prop-group'>
      <h4>班別設定</h4>
      <label><input type="radio" name="sd" ${q.shiftDisplay==='dropdown'?'checked':''}
        onchange="q.shiftDisplay='dropdown'"> 下拉式</label>
      <label><input type="radio" name="sd" ${q.shiftDisplay==='radio'?'checked':''}
        onchange="q.shiftDisplay='radio'"> 選擇題</label>
      <label><input type="checkbox" ${q.shiftSmart?'checked':''}
        onchange="q.shiftSmart=this.checked"> 智慧化帶入</label>

      <div id="shiftRules" ${q.shiftSmart?'':'style="display:none"'}>
        ${q.shiftRules.map((r,idx)=>`
        <div class="rule-row">
          <input type="time" value="${r.start}"
            onchange="q.shiftRules[${idx}].start=this.value">
          ～
          <input type="time" value="${r.end}"
            onchange="q.shiftRules[${idx}].end=this.value">
          →
          <input value="${r.value}"
            onchange="q.shiftRules[${idx}].value=this.value">
          <button onclick="q.shiftRules.splice(${idx},1);renderProp(q)">🗑</button>
        </div>`).join('')}
        <button onclick="q.shiftRules.push({start:'',end:'',value:''});renderProp(q)">＋ 新增條件</button>
        <div class="error">${checkShift(q)}</div>
      </div>
    </div>`;
  }

  document.getElementById('propertyPanel').innerHTML=html;
}

function checkShift(q){
  const toMin=t=>{if(!t)return null;const[a,b]=t.split(':');return +a*60+ +b;}
  for(let i=0;i<q.shiftRules.length;i++){
    for(let j=i+1;j<q.shiftRules.length;j++){
      const a1=toMin(q.shiftRules[i].start),a2=toMin(q.shiftRules[i].end);
      const b1=toMin(q.shiftRules[j].start),b2=toMin(q.shiftRules[j].end);
      if(a1!=null&&a2!=null&&b1!=null&&b2!=null&&a1<b2&&b1<a2)
        return '❌ 班別時間區段不可重疊';
    }
  }
  return '';
}