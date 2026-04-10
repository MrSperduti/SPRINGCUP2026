document.addEventListener("DOMContentLoaded",async()=>{
const BASE="data/";
async function load(f){try{return await (await fetch(BASE+f)).json()}catch{return null}}
const [foto,video,intv,doc,dati]=await Promise.all([
load("fotoFiles.json"),load("videoFiles.json"),
load("intervisteFiles.json"),load("regolamentoFiles.json"),
load("dati.json")]);
const c=(o,k)=>o?.[k]?.length||0;
let partite=0;
if(dati)Object.values(dati).forEach(ca=>partite+=(ca.partite||[]).length);
document.getElementById("stats").innerHTML=`
<div class="card">Foto ${c(foto,"fotoFiles")}</div>
<div class="card">Video ${c(video,"videoFiles")}</div>
<div class="card">Interviste ${c(intv,"intervisteFiles")}</div>
<div class="card">Docs ${c(doc,"regolamentoFiles")}</div>
<div class="card">Partite ${partite}</div>`;
});