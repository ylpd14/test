function exportExcel(){
  const rows=[];
  questions.forEach((q,i)=>{
    rows.push([`【題目 ${i+1}】`, '']);
    rows.push(['題目名稱',q.label]);
    rows.push(['題目說明',q.description]);
    rows.push(['題目類型',q.type]);
    rows.push(['是否必填',q.required?'是':'']);
    rows.push(['自動轉大寫',q.uppercase?'是':'']);
    rows.push(['最小字數',q.min]);
    rows.push(['最大字數',q.max]);
    rows.push(['自動帶入前一筆',q.autoPrev?'是':'']);

    if(q.type==='date'||q.type==='time'||q.type==='datetime'){
      rows.push(['是否紀錄日期',q.date.enabled?'是':'']);
      rows.push(['日期是否顯示',q.date.visible?'顯示':'僅後台']);
      rows.push(['日期自動帶入',q.date.auto?'是':'']);
      rows.push(['是否紀錄時間',q.time.enabled?'是':'']);
      rows.push(['時間是否顯示',q.time.visible?'顯示':'僅後台']);
      rows.push(['時間自動帶入',q.time.auto?'是':'']);
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
  ws['!cols']=[{wch:22},{wch:40}];
  const wb=XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb,ws,'表單規格');
  XLSX.writeFile(wb,'表單規格_直式.xlsx');
}