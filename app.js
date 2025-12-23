let fields=[],current=null;

function baseField(type){
 return{
  type,label:'未命名題目',required:false,options:[],
  date:{enabled:false,auto:false},
  time:{enabled:false,auto:false},
  shift:{smart:false,rules:[]}
 };
}

function addField(type){
 const f=baseField(type);
 if(type==='date')f.date.enabled=true;
 if(type==='shift')f.shift.smart=false;
 fields.push(f);current=fields.length-1;render();
}

function render(){
 const c=document.getElementById('canvas');c.innerHTML='';
 fields.forEach((f,i)=>{
  const d=document.createElement('div');
  d.className='card'+(i===current?' active':'');
  d.onclick=()=>{current=i;render()};
  d.innerHTML=`<strong>${f.label}</strong><div>${f.type}</div>`;
  c.appendChild(d);
 });
 renderProps();
}

function renderProps(){
 const p=document.getElementById('props');
 if(current===null){p.innerHTML='';return;}
 const f=fields[current];
 let h=`<label>題目名稱</label>
 <input value="${f.label}" oninput="f.label=this.value;render()">
 <label><input type="checkbox" ${f.required?'checked':''}
 onchange="f.required=this.checked">必填</label>`;

 if(f.type==='radio'){
  h+='<h4>選項</h4>';
  f.options.forEach((o,i)=>{
   h+=`<div class="option">
   <input value="${o}" oninput="f.options[${i}]=this.value">
   <button onclick="f.options.splice(${i},1);render()">🗑</button></div>`;
  });
  h+='<button onclick="f.options.push(\'選項\');render()">＋新增選項</button>';
 }

 if(f.type==='shift'){
  h+=`<h4>班別智慧化</h4>
  <label><input type="checkbox" ${f.shift.smart?'checked':''}
   onchange="f.shift.smart=this.checked;renderProps()">啟用智慧化</label>`;
  if(f.shift.smart){
   f.shift.rules.forEach((r,i)=>{
    h+=`<div class="rule">
    <input type="time" value="${r.s}" onchange="f.shift.rules[${i}].s=this.value">
    ~
    <input type="time" value="${r.e}" onchange="f.shift.rules[${i}].e=this.value">
    →
    <input value="${r.v}" onchange="f.shift.rules[${i}].v=this.value">
    <button onclick="f.shift.rules.splice(${i},1);renderProps()">🗑</button>
    </div>`;
   });
   h+='<button onclick="f.shift.rules.push({s:'',e:'',v:''});renderProps()">＋新增規則</button>';
   h+=`<div class="error">${checkShift(f)}</div>`;
  }
 }

 h+='<button onclick="removeField()">刪除此題</button>';
 p.innerHTML=h;
}

function checkShift(f){
 const t=m=>{if(!m)return null;const[a,b]=m.split(':');return a*60+ +b;}
 for(let i=0;i<f.shift.rules.length;i++){
  for(let j=i+1;j<f.shift.rules.length;j++){
   const a=f.shift.rules[i],b=f.shift.rules[j];
   const a1=t(a.s),a2=t(a.e),b1=t(b.s),b2=t(b.e);
   if(a1!=null&&a2!=null&&b1!=null&&b2!=null&&a1<b2&&b1<a2)
    return '❌ 班別時間重疊';
  }
 }
 return '';
}

function removeField(){
 fields.splice(current,1);current=null;render();
}

function saveJSON(){
 const data={title:document.getElementById('formTitle').value,fields};
 const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
 const a=document.createElement('a');
 a.href=URL.createObjectURL(blob);
 a.download='form_spec.json';
 a.click();
}

function loadJSON(e){
 const f=e.target.files[0];
 const r=new FileReader();
 r.onload=()=>{
  const d=JSON.parse(r.result);
  document.getElementById('formTitle').value=d.title||'';
  fields=d.fields||[];current=null;render();
 };
 r.readAsText(f);
}
