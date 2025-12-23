function exportExcel(){
 if(typeof XLSX==='undefined'){alert('Excel 模組未載入');return;}
 for(const f of fields){
  if(f.type==='shift'&&f.shift.smart&&checkShift(f)){
   alert('班別規則有重疊');return;
  }
 }
 const rows=[];
 rows.push(['表單標題',document.getElementById('formTitle').value]);
 rows.push(['','']);
 fields.forEach((f,i)=>{
  rows.push([`【題目 ${i+1}】`,'']);
  rows.push(['題目名稱',f.label]);
  rows.push(['題目類型',f.type]);
  rows.push(['必填',f.required?'是':'']);
  if(f.options.length)rows.push(['選項',f.options.join('|')]);
  if(f.type==='shift'&&f.shift.smart){
   f.shift.rules.forEach((r,idx)=>{
    rows.push([`班別規則 ${idx+1}`,`${r.s}~${r.e}→${r.v}`]);
   });
  }
  rows.push(['','']);
 });
 const ws=XLSX.utils.aoa_to_sheet(rows);
 const wb=XLSX.utils.book_new();
 XLSX.utils.book_append_sheet(wb,ws,'表單規格');
 XLSX.writeFile(wb,'表單規格_M3.xlsx');
}
