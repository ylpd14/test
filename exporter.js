function exportExcel(){
  if(typeof XLSX==='undefined'){
    alert('Excel 匯出模組未載入');
    return;
  }
  const rows=[];
  questions.forEach((q,i)=>{
    rows.push([`【題目 ${i+1}】`, '']);
    rows.push(['題目名稱',q.label]);
    rows.push(['題目說明',q.description]);
    rows.push(['題目類型',q.type]);
    rows.push(['是否必填',q.required?'是':'']);
    rows.push(['','']);
  });
  const ws=XLSX.utils.aoa_to_sheet(rows);
  ws['!cols']=[{wch:24},{wch:42}];
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'表單規格');
  XLSX.writeFile(wb,'表單規格_直式.xlsx');
}