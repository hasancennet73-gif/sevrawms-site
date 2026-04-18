// SEVRA - İl / İlçe Dropdown Motoru
// Bu dosya GitHub Pages üzerinde çalışır. Admin ilan yönetiminde il seçilince bağlı ilçeleri getirir.

const SEVRA_IL_ILCE_VERSION = '2026-04-18-1';

// Ana kaynak CDN üzerinden gelir. Bağlantı sorunu olursa aşağıdaki gömülü yedek iller kullanılır.
const IL_JSON_URL = 'https://cdn.jsdelivr.net/gh/volkansenturk/turkiye-iller-ilceler@master/il.json';
const ILCE_JSON_URL = 'https://cdn.jsdelivr.net/gh/volkansenturk/turkiye-iller-ilceler@master/ilce.json';

let SEVRA_ILLER = [];
let SEVRA_ILCELER = [];
let SEVRA_IL_ILCE_READY = false;
let SEVRA_IL_ILCE_WAITERS = [];

// Kısıtlı yedek veri: İnternet/CDN açılmazsa en azından sistem boş kalmasın diye.
// Canlıda normalde CDN'deki tam Türkiye listesi yüklenir.
const SEVRA_FALLBACK_ILLER = [
  { id: '34', name: 'İstanbul' },
  { id: '06', name: 'Ankara' },
  { id: '35', name: 'İzmir' },
  { id: '16', name: 'Bursa' },
  { id: '41', name: 'Kocaeli' },
  { id: '54', name: 'Sakarya' },
  { id: '59', name: 'Tekirdağ' },
  { id: '33', name: 'Mersin' },
  { id: '01', name: 'Adana' },
  { id: '42', name: 'Konya' }
];

const SEVRA_FALLBACK_ILCELER = [
  { id: '3401', il_id: '34', name: 'Esenyurt' }, { id: '3402', il_id: '34', name: 'Tuzla' }, { id: '3403', il_id: '34', name: 'Pendik' }, { id: '3404', il_id: '34', name: 'Hadımköy' },
  { id: '0601', il_id: '06', name: 'Sincan' }, { id: '0602', il_id: '06', name: 'Kazan' }, { id: '0603', il_id: '06', name: 'Etimesgut' },
  { id: '3501', il_id: '35', name: 'Kemalpaşa' }, { id: '3502', il_id: '35', name: 'Torbalı' }, { id: '3503', il_id: '35', name: 'Aliağa' },
  { id: '1601', il_id: '16', name: 'Nilüfer' }, { id: '1602', il_id: '16', name: 'Osmangazi' }, { id: '1603', il_id: '16', name: 'Gemlik' },
  { id: '4101', il_id: '41', name: 'Gebze' }, { id: '4102', il_id: '41', name: 'Dilovası' }, { id: '4103', il_id: '41', name: 'İzmit' },
  { id: '5401', il_id: '54', name: 'Arifiye' }, { id: '5402', il_id: '54', name: 'Erenler' },
  { id: '5901', il_id: '59', name: 'Çorlu' }, { id: '5902', il_id: '59', name: 'Çerkezköy' },
  { id: '3301', il_id: '33', name: 'Akdeniz' }, { id: '3302', il_id: '33', name: 'Tarsus' },
  { id: '0101', il_id: '01', name: 'Seyhan' }, { id: '0102', il_id: '01', name: 'Ceyhan' },
  { id: '4201', il_id: '42', name: 'Selçuklu' }, { id: '4202', il_id: '42', name: 'Karatay' }
];

function sevraNormalizeText(value){
  return String(value || '').trim().toLocaleLowerCase('tr-TR');
}

function sevraSortByName(list){
  return [...list].sort((a,b) => String(a.name || '').localeCompare(String(b.name || ''), 'tr'));
}

function sevraNormalizeIl(raw){
  return {
    id: String(raw.id ?? raw.il_id ?? raw.plaka ?? raw.code ?? '').padStart(2, '0'),
    name: raw.name ?? raw.il_adi ?? raw.sehir_adi ?? raw.title ?? ''
  };
}

function sevraNormalizeIlce(raw){
  return {
    id: String(raw.id ?? raw.ilce_id ?? raw.code ?? ''),
    il_id: String(raw.il_id ?? raw.ilId ?? raw.city_id ?? raw.plaka ?? '').padStart(2, '0'),
    name: raw.name ?? raw.ilce_adi ?? raw.title ?? ''
  };
}

function sevraIlIlceReadyNotify(){
  SEVRA_IL_ILCE_READY = true;
  SEVRA_IL_ILCE_WAITERS.forEach(resolve => resolve());
  SEVRA_IL_ILCE_WAITERS = [];
}

function sevraIlIlceHazirMi(){
  if(SEVRA_IL_ILCE_READY) return Promise.resolve();
  return new Promise(resolve => SEVRA_IL_ILCE_WAITERS.push(resolve));
}

async function sevraIlIlceYukle(){
  try{
    const [ilRes, ilceRes] = await Promise.all([
      fetch(IL_JSON_URL, { cache: 'force-cache' }),
      fetch(ILCE_JSON_URL, { cache: 'force-cache' })
    ]);

    if(!ilRes.ok || !ilceRes.ok) throw new Error('CDN il/ilçe verisi alınamadı');

    const ilData = await ilRes.json();
    const ilceData = await ilceRes.json();

    SEVRA_ILLER = sevraSortByName(ilData.map(sevraNormalizeIl).filter(x => x.id && x.name));
    SEVRA_ILCELER = sevraSortByName(ilceData.map(sevraNormalizeIlce).filter(x => x.il_id && x.name));
  }catch(err){
    console.warn('SEVRA il/ilçe CDN yüklenemedi, yedek liste kullanılacak:', err.message);
    SEVRA_ILLER = sevraSortByName(SEVRA_FALLBACK_ILLER.map(sevraNormalizeIl));
    SEVRA_ILCELER = sevraSortByName(SEVRA_FALLBACK_ILCELER.map(sevraNormalizeIlce));
  }

  sevraIlSelectDoldur('neredenIl');
  sevraIlSelectDoldur('nereyeIl');
  sevraIlceBagla('neredenIl', 'neredenIlce');
  sevraIlceBagla('nereyeIl', 'nereyeIlce');
  sevraIlIlceReadyNotify();
  console.log('SEVRA il/ilçe sistemi yüklendi ✅', SEVRA_IL_ILCE_VERSION);
}

function sevraIlSelectDoldur(selectId){
  const select = document.getElementById(selectId);
  if(!select) return;
  select.innerHTML = '<option value="">İl seçiniz</option>';
  SEVRA_ILLER.forEach(il => {
    const opt = document.createElement('option');
    opt.value = il.id;
    opt.textContent = il.name;
    select.appendChild(opt);
  });
}

function sevraIlceDoldur(ilSelectId, ilceSelectId, selectedIlceName){
  const ilSelect = document.getElementById(ilSelectId);
  const ilceSelect = document.getElementById(ilceSelectId);
  if(!ilSelect || !ilceSelect) return;

  const secilenIlId = String(ilSelect.value || '');
  ilceSelect.innerHTML = '<option value="">İlçe seçiniz</option>';

  if(!secilenIlId){
    ilceSelect.innerHTML = '<option value="">Önce il seçiniz</option>';
    ilceSelect.disabled = true;
    return;
  }

  const ilceler = SEVRA_ILCELER.filter(i => String(i.il_id) === secilenIlId);
  ilceler.forEach(ilce => {
    const opt = document.createElement('option');
    opt.value = ilce.id;
    opt.textContent = ilce.name;
    if(selectedIlceName && sevraNormalizeText(selectedIlceName) === sevraNormalizeText(ilce.name)){
      opt.selected = true;
    }
    ilceSelect.appendChild(opt);
  });

  ilceSelect.disabled = false;
}

function sevraIlceBagla(ilSelectId, ilceSelectId){
  const ilSelect = document.getElementById(ilSelectId);
  const ilceSelect = document.getElementById(ilceSelectId);
  if(!ilSelect || !ilceSelect) return;

  ilceSelect.innerHTML = '<option value="">Önce il seçiniz</option>';
  ilceSelect.disabled = true;

  ilSelect.addEventListener('change', () => {
    sevraIlceDoldur(ilSelectId, ilceSelectId);
    ilceSelect.dispatchEvent(new Event('change'));
  });
}

function sevraSeciliIlAdi(selectId){
  const select = document.getElementById(selectId);
  if(!select || !select.value) return '';
  const found = SEVRA_ILLER.find(i => String(i.id) === String(select.value));
  return found ? found.name : '';
}

function sevraSeciliIlceAdi(selectId){
  const select = document.getElementById(selectId);
  if(!select || !select.value) return '';
  const found = SEVRA_ILCELER.find(i => String(i.id) === String(select.value));
  return found ? found.name : '';
}

async function sevraSetIlIlceDegeri(ilSelectId, ilceSelectId, ilName, ilceName){
  await sevraIlIlceHazirMi();
  const ilSelect = document.getElementById(ilSelectId);
  const ilceSelect = document.getElementById(ilceSelectId);
  if(!ilSelect || !ilceSelect) return;

  const il = SEVRA_ILLER.find(x => sevraNormalizeText(x.name) === sevraNormalizeText(ilName));
  if(!il){
    ilSelect.value = '';
    sevraIlceDoldur(ilSelectId, ilceSelectId);
    return;
  }

  ilSelect.value = il.id;
  sevraIlceDoldur(ilSelectId, ilceSelectId, ilceName);
}

window.sevraIlIlceYukle = sevraIlIlceYukle;
window.sevraSeciliIlAdi = sevraSeciliIlAdi;
window.sevraSeciliIlceAdi = sevraSeciliIlceAdi;
window.sevraSetIlIlceDegeri = sevraSetIlIlceDegeri;
window.sevraIlIlceHazirMi = sevraIlIlceHazirMi;

document.addEventListener('DOMContentLoaded', sevraIlIlceYukle);
