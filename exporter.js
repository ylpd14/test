function exportExcel(){
  if(typeof XLSX==='undefined'){alert('Excel 模組未載入');return;}
  if(questions.length===0){alert('沒有題目');return;}
  for(const q of questions){
    if(q.type==='shift'&&q.shiftSmart&&checkShift(q)){
      alert('班別規則有重疊，請修正');return;
    }
  }

  const rows=[];
  questions.forEach((q,i)=>{
    rows.push([`【題目 ${i+1}】`, '']);
    rows.push(['題目名稱',q.label]);
    rows.push(['題目說明',q.description]);
    rows.push(['題目類型',q.type]);
    rows.push(['是否必填',q.required?'是':'']);
    rows.push(['自動大寫',q.uppercase?'是':'']);
    rows.push(['最小字數',q.min]);
    rows.push(['最大字數',q.max]);
    rows.push(['自動帶前一筆',q.autoPrev?'是':'']);

    if(['date','time','datetime'].includes(q.type)){
      rows.push(['是否紀錄日期',q.date.enabled?'是':'']);
      rows.push(['是否紀錄時間',q.time.enabled?'是':'']);
      rows.push(['是否允許手動修改',q.allowManual?'是':'']);
    }

    if(q.type==='shift'){
      rows.push(['班別呈現方式',q.shiftDisplay==='dropdown'?'下拉式':'選擇題']);
      rows.push(['是否智慧化帶入',q.shiftSmart?'是':'']);
      q.shiftRules.forEach((r,idx)=>{
        rows.push([`智慧化規則 ${idx+1}`,`${r.start}~${r.end} → ${r.value}`]);
      });
    }
    rows.push(['','']);
  });

  const ws=XLSX.utils.aoa_to_sheet(rows);
  ws['!cols']=[{wch:24},{wch:48}];
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'表單規格');
  XLSX.writeFile(wb,'表單規格_直式.xlsx');
}
