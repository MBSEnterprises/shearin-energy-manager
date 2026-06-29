const cfg = window.SHEARIN_CONFIG || {};
const hasSupabase = Boolean(cfg.SUPABASE_URL && cfg.SUPABASE_ANON_KEY && window.supabase);
const db = hasSupabase ? window.supabase.createClient(cfg.SUPABASE_URL, cfg.SUPABASE_ANON_KEY) : null;
let session = null;
let properties = [];
let readings = [];
let editingId = null;
const $ = (id) => document.getElementById(id);
const money = (n) => Number.isFinite(Number(n)) ? `$${Number(n).toLocaleString(undefined,{maximumFractionDigits:0})}` : "—";
const kwh = (n) => Number.isFinite(Number(n)) ? `${Number(n).toLocaleString(undefined,{maximumFractionDigits:0})} kWh` : "—";
const pct = (n) => Number.isFinite(Number(n)) ? `${Number(n).toFixed(0)}%` : "—";
const localKey = "shearin_energy_manager_v2";

function localLoad(){
  const saved = JSON.parse(localStorage.getItem(localKey) || "{}");
  properties = saved.properties || [];
  readings = saved.readings || [];
  if(!properties.length) seedDefaultProperties();
}
function localSave(){ localStorage.setItem(localKey, JSON.stringify({properties, readings})); }
function uuid(){ return crypto.randomUUID ? crypto.randomUUID() : String(Date.now()+Math.random()); }
function seedDefaultProperties(){
  properties = [
    {id: uuid(), name:"Redding", address:"12465 Maria Dr", true_up_month:8},
    {id: uuid(), name:"Manteca", address:"1631 Paola Pl", true_up_month:5}
  ];
  localSave();
}
function juneSamples(){
  const r = properties.find(p=>p.name.toLowerCase().includes("redding"));
  const m = properties.find(p=>p.name.toLowerCase().includes("manteca"));
  if(r && !readings.some(x=>x.property_id===r.id && x.period_end==="2026-06-22")) readings.push({id:uuid(),property_id:r.id,period_end:"2026-06-22",billing_days:32,solar_produced_kwh:1822.1,grid_imported_kwh:1554.428,grid_exported_kwh:781.88,net_usage_kwh:772.548,nem_charge:323.13,true_up_balance:4827.60,base_charge:25.39,gas_charge:0,gas_therms:0,notes:"June 2026 PG&E bill + Tesla screenshot"});
  if(m && !readings.some(x=>x.property_id===m.id && x.period_end==="2026-06-22")) readings.push({id:uuid(),property_id:m.id,period_end:"2026-06-22",billing_days:32,solar_produced_kwh:null,grid_imported_kwh:654.721,grid_exported_kwh:643.818,net_usage_kwh:10.904,nem_charge:3.55,true_up_balance:3.55,base_charge:25.39,gas_charge:17.35,gas_therms:7,notes:"June 2026 PG&E bill; Tesla production still needed"});
  localSave(); render();
}
function calc(row){
  const produced = Number(row.solar_produced_kwh);
  const exported = Number(row.grid_exported_kwh);
  const imported = Number(row.grid_imported_kwh);
  const directSolar = Number.isFinite(produced) && Number.isFinite(exported) ? Math.max(produced - exported,0) : null;
  const homeUse = Number.isFinite(imported) && Number.isFinite(directSolar) ? imported + directSolar : null;
  const offset = Number.isFinite(produced) && Number.isFinite(homeUse) && homeUse>0 ? produced/homeUse*100 : null;
  const effectiveCost = Number(row.nem_charge || 0) + Number(row.base_charge || 0) + Number(row.gas_charge || 0);
  return {directSolar, homeUse, offset, effectiveCost};
}
async function init(){
  if(!hasSupabase){
    $("setupWarning").classList.remove("hidden");
    localLoad();
    $("appView").classList.remove("hidden");
    wire(); render(); return;
  }
  const {data} = await db.auth.getSession(); session = data.session;
  db.auth.onAuthStateChange((_e,s)=>{session=s; routeAuth();});
  wire(); routeAuth();
}
function routeAuth(){
  $("authView").classList.toggle("hidden", !!session);
  $("appView").classList.toggle("hidden", !session);
  $("signOutBtn").classList.toggle("hidden", !session);
  if(session) loadRemote();
}
async function signIn(){
  const email = $("emailInput").value.trim(); if(!email) return;
  const {error} = await db.auth.signInWithOtp({email, options:{emailRedirectTo: location.href}});
  $("authMessage").textContent = error ? error.message : "Check your email for the login link.";
}
async function loadRemote(){
  let {data: props, error: pErr} = await db.from("properties").select("*").order("name");
  if(pErr){ alert(pErr.message); return; }
  if(!props.length){
    await db.from("properties").insert([{name:"Redding",address:"12465 Maria Dr",true_up_month:8},{name:"Manteca",address:"1631 Paola Pl",true_up_month:5}]);
    ({data: props} = await db.from("properties").select("*").order("name"));
  }
  properties = props || [];
  const {data: rows, error: rErr} = await db.from("monthly_readings").select("*").order("period_end", {ascending:false});
  if(rErr){ alert(rErr.message); return; }
  readings = rows || [];
  render();
}
async function saveReading(row){
  if(!hasSupabase){
    if(editingId){ readings = readings.map(r=>r.id===editingId?{...row,id:editingId}:r); editingId=null; }
    else readings.push({...row,id:uuid()});
    localSave(); render(); return;
  }
  if(editingId){ await db.from("monthly_readings").update(row).eq("id", editingId); editingId=null; }
  else await db.from("monthly_readings").insert(row);
  await loadRemote();
}
async function addProperty(e){
  e.preventDefault(); const name=$("propertyName").value.trim(); if(!name) return;
  const row={name,address:$("propertyAddress").value.trim(),true_up_month:null};
  if(hasSupabase){ await db.from("properties").insert(row); await loadRemote(); }
  else { properties.push({...row,id:uuid()}); localSave(); render(); }
  e.target.reset();
}
function wire(){
  document.querySelectorAll(".tabs button").forEach(btn=>btn.addEventListener("click",()=>{
    document.querySelectorAll(".tabs button,.tab-panel").forEach(x=>x.classList.remove("active"));
    btn.classList.add("active"); $(btn.dataset.tab).classList.add("active");
  }));
  $("signInBtn").onclick=signIn; $("signOutBtn").onclick=()=>db.auth.signOut();
  $("seedBtn").onclick=juneSamples; $("propertyForm").onsubmit=addProperty; $("clearFormBtn").onclick=()=>{editingId=null; $("readingForm").reset();};
  $("readingForm").onsubmit=(e)=>{
    e.preventDefault();
    const val=(id)=> $(id).value==="" ? null : Number($(id).value);
    saveReading({property_id:$("propertyId").value,period_end:$("periodEnd").value,billing_days:val("billingDays"),solar_produced_kwh:val("solarProduced"),grid_imported_kwh:val("gridImported"),grid_exported_kwh:val("gridExported"),net_usage_kwh:val("netUsage"),nem_charge:val("nemCharge"),true_up_balance:val("trueUpBalance"),base_charge:val("baseCharge"),gas_charge:val("gasCharge"),gas_therms:val("gasTherms"),notes:$("notes").value.trim()});
    e.target.reset();
  };
}
function render(){ renderSelectors(); renderDashboard(); renderHistory(); renderProperties(); }
function renderSelectors(){
  const opts=properties.map(p=>`<option value="${p.id}">${p.name}</option>`).join(""); $("propertyId").innerHTML=opts;
  const months=[...new Set(readings.map(r=>r.period_end))].sort().reverse(); $("monthSelect").innerHTML=months.map(m=>`<option>${m}</option>`).join("") || `<option>No readings yet</option>`;
  $("monthSelect").onchange=renderDashboard;
}
function latestForProperty(p, selected){
  const rows=readings.filter(r=>r.property_id===p.id).sort((a,b)=>b.period_end.localeCompare(a.period_end));
  return rows.find(r=>r.period_end===selected) || rows[0];
}
function renderDashboard(){
  const selected=$("monthSelect").value;
  $("dashboardCards").innerHTML=properties.map(p=>{
    const r=latestForProperty(p, selected);
    if(!r) return `<article class="property-card"><h2>${p.name}</h2><p class="muted">No readings yet.</p></article>`;
    const c=calc(r);
    return `<article class="property-card"><h2>${p.name}</h2><p class="muted">${r.period_end} • ${r.billing_days||"—"} billing days</p><div class="metric-grid">
      <div class="metric good"><span class="label">Solar Produced</span><span class="value">${kwh(r.solar_produced_kwh)}</span></div>
      <div class="metric"><span class="label">Home Used</span><span class="value">${kwh(c.homeUse)}</span></div>
      <div class="metric"><span class="label">From PG&E</span><span class="value">${kwh(r.grid_imported_kwh)}</span></div>
      <div class="metric"><span class="label">To PG&E</span><span class="value">${kwh(r.grid_exported_kwh)}</span></div>
      <div class="metric"><span class="label">Solar Used Directly</span><span class="value">${kwh(c.directSolar)}</span></div>
      <div class="metric"><span class="label">Solar Offset</span><span class="value">${pct(c.offset)}</span><div class="bar"><span style="width:${Math.min(c.offset||0,100)}%"></span></div></div>
      <div class="metric bad"><span class="label">True-Up Balance</span><span class="value">${money(r.true_up_balance)}</span></div>
      <div class="metric"><span class="label">Effective Month Cost</span><span class="value">${money(c.effectiveCost)}</span></div>
    </div><p class="calc-note">Home Used = PG&E Import + (Tesla Solar Produced - PG&E Export). This requires Tesla production for a complete estimate.</p></article>`;
  }).join("");
}
function renderHistory(){
  const rows=[...readings].sort((a,b)=>b.period_end.localeCompare(a.period_end));
  $("historyTable").innerHTML=`<thead><tr><th>Date</th><th>Property</th><th>Solar</th><th>Home Use</th><th>Import</th><th>Export</th><th>NEM</th><th>True-Up</th><th>Edit</th></tr></thead><tbody>${rows.map(r=>{const p=properties.find(x=>x.id===r.property_id)||{}; const c=calc(r); return `<tr><td>${r.period_end}</td><td>${p.name||"—"}</td><td>${kwh(r.solar_produced_kwh)}</td><td>${kwh(c.homeUse)}</td><td>${kwh(r.grid_imported_kwh)}</td><td>${kwh(r.grid_exported_kwh)}</td><td>${money(r.nem_charge)}</td><td>${money(r.true_up_balance)}</td><td><button class="ghost" onclick="editReading('${r.id}')">Edit</button></td></tr>`}).join("")}</tbody>`;
}
window.editReading=(id)=>{ const r=readings.find(x=>x.id===id); if(!r) return; editingId=id; document.querySelector('[data-tab="entry"]').click(); $("propertyId").value=r.property_id; $("periodEnd").value=r.period_end; $("solarProduced").value=r.solar_produced_kwh??""; $("gridImported").value=r.grid_imported_kwh??""; $("gridExported").value=r.grid_exported_kwh??""; $("netUsage").value=r.net_usage_kwh??""; $("nemCharge").value=r.nem_charge??""; $("trueUpBalance").value=r.true_up_balance??""; $("baseCharge").value=r.base_charge??""; $("gasCharge").value=r.gas_charge??""; $("gasTherms").value=r.gas_therms??""; $("billingDays").value=r.billing_days??""; $("notes").value=r.notes??""; };
function renderProperties(){ $("propertiesList").innerHTML=properties.map(p=>`<span class="pill"><strong>${p.name}</strong> ${p.address||""}</span>`).join(""); }
init();
