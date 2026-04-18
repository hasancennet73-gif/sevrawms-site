// SEVRA - Il / Ilce Dropdown Motoru
// Bu dosya ilan-yonetimi.html icinde il/ilce secimli rota girisi icin kullanilir.

const IL_JSON_URL = "https://cdn.jsdelivr.net/gh/volkansenturk/turkiye-iller-ilceler@master/il.json";
const ILCE_JSON_URL = "https://cdn.jsdelivr.net/gh/volkansenturk/turkiye-iller-ilceler@master/ilce.json";

let SEVRA_ILLER = [];
let SEVRA_ILCELER = [];

async function sevraIlIlceYukle() {
  try {
    const [ilRes, ilceRes] = await Promise.all([
      fetch(IL_JSON_URL),
      fetch(ILCE_JSON_URL)
    ]);

    if (!ilRes.ok || !ilceRes.ok) {
      throw new Error("Il/ilce JSON dosyalari yuklenemedi");
    }

    SEVRA_ILLER = await ilRes.json();
    SEVRA_ILCELER = await ilceRes.json();

    sevraIlSelectDoldur("neredenIl");
    sevraIlSelectDoldur("nereyeIl");

    sevraIlceBagla("neredenIl", "neredenIlce");
    sevraIlceBagla("nereyeIl", "nereyeIlce");

    console.log("SEVRA il/ilce sistemi yuklendi");
  } catch (err) {
    console.error("Il/ilce verisi yuklenemedi:", err);
    alert("Il/ilce listesi yuklenemedi. Internet baglantisini veya dosya baglantilarini kontrol edin.");
  }
}

function sevraIlSelectDoldur(selectId) {
  const select = document.getElementById(selectId);
  if (!select) return;

  select.innerHTML = '<option value="">Il seciniz</option>';

  SEVRA_ILLER.forEach(il => {
    const opt = document.createElement("option");
    opt.value = il.id;
    opt.textContent = il.name;
    select.appendChild(opt);
  });
}

function sevraIlceBagla(ilSelectId, ilceSelectId) {
  const ilSelect = document.getElementById(ilSelectId);
  const ilceSelect = document.getElementById(ilceSelectId);

  if (!ilSelect || !ilceSelect) return;

  ilceSelect.innerHTML = '<option value="">Once il seciniz</option>';
  ilceSelect.disabled = true;

  ilSelect.addEventListener("change", () => {
    const secilenIlId = ilSelect.value;

    ilceSelect.innerHTML = '<option value="">Ilce seciniz</option>';

    if (!secilenIlId) {
      ilceSelect.innerHTML = '<option value="">Once il seciniz</option>';
      ilceSelect.disabled = true;
      return;
    }

    const ilceler = SEVRA_ILCELER.filter(i => String(i.il_id) === String(secilenIlId));

    ilceler.forEach(ilce => {
      const opt = document.createElement("option");
      opt.value = ilce.id;
      opt.textContent = ilce.name;
      ilceSelect.appendChild(opt);
    });

    ilceSelect.disabled = false;
  });
}

function sevraSeciliIlAdi(selectId) {
  const select = document.getElementById(selectId);
  if (!select || !select.value) return "";
  const found = SEVRA_ILLER.find(i => String(i.id) === String(select.value));
  return found ? found.name : "";
}

function sevraSeciliIlceAdi(selectId) {
  const select = document.getElementById(selectId);
  if (!select || !select.value) return "";
  const found = SEVRA_ILCELER.find(i => String(i.id) === String(select.value));
  return found ? found.name : "";
}

function sevraRotaObjesiOlustur() {
  const neredenIl = sevraSeciliIlAdi("neredenIl");
  const neredenIlce = sevraSeciliIlceAdi("neredenIlce");
  const nereyeIl = sevraSeciliIlAdi("nereyeIl");
  const nereyeIlce = sevraSeciliIlceAdi("nereyeIlce");
  const rota = `${neredenIl} / ${neredenIlce} → ${nereyeIl} / ${nereyeIlce}`;

  return {
    neredenIl,
    neredenIlce,
    nereyeIl,
    nereyeIlce,
    rota
  };
}

function sevraRotaGecerliMi() {
  const rota = sevraRotaObjesiOlustur();
  return Boolean(rota.neredenIl && rota.neredenIlce && rota.nereyeIl && rota.nereyeIlce);
}

document.addEventListener("DOMContentLoaded", sevraIlIlceYukle);
