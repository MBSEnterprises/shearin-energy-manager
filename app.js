let supabaseClient = null;
let selectedProperty = 'Redding';
let records = [];

const $ = id => document.getElementById(id);
const fmt = (n, digits=0) => n === null || n === undefined || n === '' || Number.isNaN(Number(n)) ? '—' : Number(n).toLocaleString(undefined,{maximumFractionDigits:digits});
const money = n => n === null || n === undefined || n === '' || Number.isNaN(Number(n)) ? '—' : Number(n).toLocaleString(undefined,{style:'currency',currency:'USD',maximumFractionDigits:2});

function loadConfig(){
  const url = localStorage.getItem('sem_supabase_url');
  const key = localStorage.getItem('sem_supabase_key');
  if(url && key && window.supabase){
    supabaseClient = window.supabase.createClient(url,key);
    $('syncStatus').textContent = 'Connected to Supabase';
    $('setupPanel').classList.add('hidden');
    loadRecords();
  }else{
    $('setupPanel').classList.remove('hidden');
    $('syncStatus').textContent = 'Not connected';
    loadLocalRecords();
  }
}

async function loadRecords(){
  if(!supabaseClient) return loadLocalRecords();
  const {data,error}=await supabaseClient.from('energy_months').select('*').order('bill_month',{ascending:false});
  if(error){$('syncStatus').textContent='Supabase error — using local data'; return loadLocalRecords();}
  records=data||[]; render();
}
function loadLocalRecords(){ records=JSON.parse(localStorage.getItem('sem_local_records')||'[]'); render(); }
async function saveRecord(record){
  if(supabaseClient){
    const {error}=await supabaseClient.from('energy_months').upsert(record,{onConflict:'property,bill_month'});
    if(error){alert(error.message); return;}
    await loadRecords();
  }else{
    const key=`${record.property}|${record.bill_month}`;
    records=records.filter(r=>`${r.property}|${r.bill_month}`!==key);
    records.push(record); records.sort((a,b)=>b.bill_month.localeCompare(a.bill_month));
    localStorage.setItem('sem_local_records',JSON.stringify(records)); render();
  }
}
function calc(r){
  const solar=Number(r.solar_production_kwh)||0;
  const exports=Number(r.grid_exports_kwh)||0;
  const imports=Number(r.grid_imports_kwh)||0;
  const direct=Math.max(0,solar-exports);
  const home=Number(r.home_consumption_kwh)||direct+imports;
  const offset=home>0?solar/home*100:null;
  return {direct,home,offset};
}
function render(){
  const latest=records.find(r=>r.property===selectedProperty);
  const cards=$('summaryCards'); cards.innerHTML='';
  const items=[];
  if(latest){
    const c=calc(latest);
    items.push(['Solar Produced', fmt(latest.solar_production_kwh,1)+' kWh', latest.bill_month]);
    items.push(['Home Used', fmt(c.home,1)+' kWh', 'estimated if Tesla home use blank']);
    items.push(['From PG&E', fmt(latest.grid_imports_kwh,1)+' kWh', 'grid imports']);
    items.push(['Sent to PG&E', fmt(latest.grid_exports_kwh,1)+' kWh', 'grid exports']);
    items.push(['Solar Offset', c.offset?fmt(c.offset,1)+'%':'—', 'solar ÷ home use']);
    items.push(['True-Up Balance', money(latest.true_up_balance), 'running balance']);
    items.push(['Added to True-Up', money(latest.nem_charge), 'monthly NEM']);
    items.push(['Gas', money(latest.gas_charge), fmt(latest.gas_therms,1)+' therms']);
    $('plainSummary').textContent=`For ${selectedProperty} in ${latest.bill_month}, solar produced ${fmt(latest.solar_production_kwh,1)} kWh. Estimated home usage was ${fmt(c.home,1)} kWh, with ${fmt(latest.grid_imports_kwh,1)} kWh imported and ${fmt(latest.grid_exports_kwh,1)} kWh exported. Solar offset was about ${c.offset?fmt(c.offset,1):'—'}%.`;
  }else{
    items.push(['No data yet','—','Add a month']); $('plainSummary').textContent='Add a monthly record to begin tracking this property.';
  }
  items.forEach(([label,value,sub])=>{const div=document.createElement('div');div.className='card metric';div.innerHTML=`<div class="label">${label}</div><div class="value">${value}</div><div class="sub">${sub}</div>`;cards.appendChild(div);});
  const tbody=$('historyTable').querySelector('tbody'); tbody.innerHTML='';
  records.forEach(r=>{const c=calc(r);const tr=document.createElement('tr');tr.innerHTML=`<td>${r.bill_month}</td><td>${r.property}</td><td>${fmt(r.solar_production_kwh,1)}</td><td>${fmt(c.home,1)}</td><td>${fmt(r.grid_imports_kwh,1)}</td><td>${fmt(r.grid_exports_kwh,1)}</td><td>${money(r.true_up_balance)}</td>`;tbody.appendChild(tr);});
}

document.querySelectorAll('.tab').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.tab,.tab-panel').forEach(x=>x.classList.remove('active'));b.classList.add('active');$(b.dataset.tab).classList.add('active');}));
document.querySelectorAll('.property').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.property').forEach(x=>x.classList.remove('active'));b.classList.add('active');selectedProperty=b.dataset.property;render();}));
$('settingsBtn').onclick=()=>$('setupPanel').classList.toggle('hidden');
$('saveSettings').onclick=()=>{localStorage.setItem('sem_supabase_url',$('supabaseUrl').value.trim());localStorage.setItem('sem_supabase_key',$('supabaseKey').value.trim());loadConfig();};
$('entryForm').onsubmit=e=>{e.preventDefault();const record={property:$('property').value,bill_month:$('billMonth').value,grid_imports_kwh:+$('gridImports').value||0,grid_exports_kwh:+$('gridExports').value||0,net_usage_kwh:+$('netUsage').value||0,nem_charge:+$('nemCharge').value||0,true_up_balance:+$('trueUpBalance').value||0,base_charge:+$('baseCharge').value||0,gas_charge:+$('gasCharge').value||0,gas_therms:+$('gasTherms').value||0,solar_production_kwh:+$('solarProduction').value||0,home_consumption_kwh:+$('homeConsumption').value||null,notes:$('notes').value};saveRecord(record);e.target.reset();$('baseCharge').value='25.39';$('gasCharge').value='0';$('gasTherms').value='0';};
loadConfig();
