// SEVRA - İl / İlçe Dropdown Motoru - FIX
// Bu dosya, önceki sürümde dropdown içinde "il" ve "il_ilce" görünmesi sorununu düzeltir.
// Veriyi Türkiye API üzerinden okur. Eski/bozuk JSON formatı gelirse parse ederek kurtarmaya çalışır.

(function(){
  const PROVINCES_URLS = [
    'https://api.turkiyeapi.dev/v1/provinces?fields=id,name,districts&sort=name',
    'https://turkiyeapi.dev/api/v1/provinces?fields=id,name,districts&sort=name'
  ];

  let SEVRA_ILLER = [];
  let SEVRA_ILCELER_BY_IL_ID = {};

  function el(id){ return document.getElementById(id); }

  function normalizeText(v){
    return String(v || '').trim();
  }

  function getArrayFromApiResponse(json){
    if(Array.isArray(json)) return json;
    if(json && Array.isArray(json.data)) return json.data;
    if(json && Array.isArray(json.provinces)) return json.provinces;
    if(json && Array.isArray(json.iller)) return json.iller;
    if(json && Array.isArray(json.il)) return json.il;
    return [];
  }

  function extractDistricts(province){
    const arr = province.districts || province.ilceler || province.district || province.children || [];
    if(!Array.isArray(arr)) return [];
    return arr.map((d, idx) => ({
      id: String(d.id ?? d.districtId ?? d.ilce_id ?? d.value ?? (idx + 1)),
      name: normalizeText(d.name ?? d.ilce ?? d.district ?? d.title ?? d.text)
    })).filter(d => d.name);
  }

  function normalizeProvinceList(rawList){
    return rawList.map((p, idx) => {
      const id = String(p.id ?? p.provinceId ?? p.il_id ?? p.plaka ?? p.plateNumber ?? p.value ?? (idx + 1));
      const name = normalizeText(p.name ?? p.il ?? p.province ?? p.city ?? p.title ?? p.text);
      return { id, name, districts: extractDistricts(p) };
    }).filter(p => p.name && p.name.toLowerCase() !== 'il' && p.name.toLowerCase() !== 'il_ilce');
  }

  function buildDistrictMap(provinces){
    const map = {};
    provinces.forEach(p => { map[p.id] = Array.isArray(p.districts) ? p.districts : []; });
    return map;
  }

  async function fetchFirstWorkingJson(urls){
    let lastError = null;
    for(const url of urls){
      try{
        const res = await fetch(url, { cache: 'no-store' });
        if(!res.ok) throw new Error('HTTP ' + res.status + ' - ' + url);
        const json = await res.json();
        return json;
      }catch(err){
        lastError = err;
        console.warn('SEVRA il/ilçe kaynağı denenemedi:', url, err);
      }
    }
    throw lastError || new Error('İl/ilçe verisi alınamadı');
  }

  function fillProvinceSelect(selectId){
    const select = el(selectId);
    if(!select) return;
    select.innerHTML = '<option value="">İl seçiniz</option>';
    SEVRA_ILLER.forEach(il => {
      const opt = document.createElement('option');
      opt.value = il.id;
      opt.textContent = il.name;
      select.appendChild(opt);
    });
  }

  function resetDistrictSelect(select, text){
    if(!select) return;
    select.innerHTML = '<option value="">' + (text || 'Önce il seçiniz') + '</option>';
    select.disabled = true;
  }

  function fillDistrictSelect(provinceSelectId, districtSelectId){
    const provinceSelect = el(provinceSelectId);
    const districtSelect = el(districtSelectId);
    if(!provinceSelect || !districtSelect) return;

    const provinceId = provinceSelect.value;
    resetDistrictSelect(districtSelect, provinceId ? 'İlçe seçiniz' : 'Önce il seçiniz');

    if(!provinceId) return;

    const districts = SEVRA_ILCELER_BY_IL_ID[provinceId] || [];
    if(!districts.length){
      resetDistrictSelect(districtSelect, 'İlçe bulunamadı');
      return;
    }

    districtSelect.innerHTML = '<option value="">İlçe seçiniz</option>';
    districts.forEach(ilce => {
      const opt = document.createElement('option');
      opt.value = ilce.id;
      opt.textContent = ilce.name;
      districtSelect.appendChild(opt);
    });
    districtSelect.disabled = false;
  }

  function bindProvinceDistrict(provinceSelectId, districtSelectId){
    const provinceSelect = el(provinceSelectId);
    const districtSelect = el(districtSelectId);
    if(!provinceSelect || !districtSelect) return;

    resetDistrictSelect(districtSelect, 'Önce il seçiniz');
    provinceSelect.addEventListener('change', function(){
      fillDistrictSelect(provinceSelectId, districtSelectId);
      if(typeof window.sevraRouteAutoUpdate === 'function') window.sevraRouteAutoUpdate();
    });
    districtSelect.addEventListener('change', function(){
      if(typeof window.sevraRouteAutoUpdate === 'function') window.sevraRouteAutoUpdate();
    });
  }

  async function sevraIlIlceYukle(){
    const raw = await fetchFirstWorkingJson(PROVINCES_URLS);
    const rawList = getArrayFromApiResponse(raw);
    SEVRA_ILLER = normalizeProvinceList(rawList);
    SEVRA_ILCELER_BY_IL_ID = buildDistrictMap(SEVRA_ILLER);

    if(!SEVRA_ILLER.length){
      throw new Error('İl listesi boş geldi. API formatı değişmiş olabilir.');
    }

    fillProvinceSelect('neredenIl');
    fillProvinceSelect('nereyeIl');
    bindProvinceDistrict('neredenIl', 'neredenIlce');
    bindProvinceDistrict('nereyeIl', 'nereyeIlce');

    console.log('SEVRA il/ilçe sistemi yüklendi ✅', SEVRA_ILLER.length, 'il');
  }

  function selectedProvinceName(selectId){
    const select = el(selectId);
    if(!select || !select.value) return '';
    const found = SEVRA_ILLER.find(i => String(i.id) === String(select.value));
    return found ? found.name : '';
  }

  function selectedDistrictName(selectId, provinceSelectId){
    const select = el(selectId);
    if(!select || !select.value) return '';
    const provinceId = provinceSelectId ? (el(provinceSelectId)?.value || '') : '';
    const list = provinceId ? (SEVRA_ILCELER_BY_IL_ID[provinceId] || []) : Object.values(SEVRA_ILCELER_BY_IL_ID).flat();
    const found = list.find(i => String(i.id) === String(select.value));
    return found ? found.name : '';
  }

  window.sevraIlIlceYukle = sevraIlIlceYukle;
  window.sevraSeciliIlAdi = selectedProvinceName;
  window.sevraSeciliIlceAdi = selectedDistrictName;
  window.sevraIlceDoldur = fillDistrictSelect;

  document.addEventListener('DOMContentLoaded', function(){
    sevraIlIlceYukle().catch(function(err){
      console.error('SEVRA il/ilçe sistemi yüklenemedi:', err);
      const statusBox = el('statusBox');
      if(statusBox){
        statusBox.textContent = 'İl/ilçe listesi yüklenemedi: ' + err.message;
        statusBox.classList.remove('hidden','status-success');
        statusBox.classList.add('status-error');
      }else{
        alert('İl/ilçe listesi yüklenemedi: ' + err.message);
      }
    });
  });
})();
