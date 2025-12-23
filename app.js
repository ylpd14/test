let fields=[],current=null;

function addField(type){
  const f={type,label:'未命名題目',options:[],rules:[]};
  fields.push(f);
  current=fields.length-1;
  render();
}

function render(){
  const c=document.getElementById('canvas');
  c.innerHTML='';
  fields.forEach((f,i)=>{
    const d=document.createElement('div');
    d.className='card'+(i===current?' active':'');
    d.onclick=()=>{current=i;render()};
    d.innerHTML=f.label+' ('+f.type+')';
    c.appendChild(d);
  });
  renderProps();
}

function renderProps(){
  const p=document.getElementById('props');
  if(current===null){p.innerHTML='';return;}
  const f=fields[current];
  let html=`
    <label>題目名稱</label>
    <input value="${f.label}" oninput="f.label=this.value;render()">
    <button onclick="removeField()">刪除此題</button>
  `;
  if(f.type==='radio'){
    html+='<h4>選項</h4>';
    f.options.forEach((o,i)=>{
      html+=`<div class="option">
        <input value="${o}" oninput="f.options[${i}]=this.value">
        <button onclick="f.options.splice(${i},1);render()">🗑</button>
      </div>`;
    });
    html+='<button onclick="f.options.push(\'選項\');render()">＋新增選項</button>';
  }
  p.innerHTML=html;
}

function removeField(){
  fields.splice(current,1);
  current=null;
  render();
}
