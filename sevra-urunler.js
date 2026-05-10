function svgData(svg){
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

const PRODUCT_IMAGES = {
  "fren-diski": svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f6f9fd"/><stop offset="1" stop-color="#dfe8f4"/></linearGradient><linearGradient id="disk" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#d9e0e8"/><stop offset="1" stop-color="#7d8a99"/></linearGradient><linearGradient id="y" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffd45b"/><stop offset="1" stop-color="#f2a900"/></linearGradient></defs>
    <rect width="900" height="560" fill="url(#bg)"/><circle cx="720" cy="100" r="150" fill="#ffc12f" opacity=".18"/><rect x="90" y="390" width="720" height="78" rx="28" fill="#071b33" opacity=".10"/>
    <circle cx="450" cy="260" r="155" fill="url(#disk)"/><circle cx="450" cy="260" r="104" fill="#eef3f8"/><circle cx="450" cy="260" r="45" fill="#071b33"/><circle cx="450" cy="260" r="22" fill="url(#y)"/>
    <g fill="#071b33" opacity=".58"><circle cx="450" cy="136" r="17"/><circle cx="450" cy="384" r="17"/><circle cx="326" cy="260" r="17"/><circle cx="574" cy="260" r="17"/><circle cx="362" cy="172" r="14"/><circle cx="538" cy="348" r="14"/><circle cx="538" cy="172" r="14"/><circle cx="362" cy="348" r="14"/></g>
    <path d="M180 118h145M180 154h92M180 190h128" stroke="#071b33" stroke-width="18" stroke-linecap="round" opacity=".82"/><rect x="592" y="332" width="126" height="54" rx="18" fill="url(#y)"/><text x="608" y="367" font-family="Arial" font-size="24" font-weight="900" fill="#071b33">FREN</text>
  </svg>`),
  "fren-balatasi": svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fbff"/><stop offset="1" stop-color="#e3edf8"/></linearGradient><linearGradient id="y" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffd45b"/><stop offset="1" stop-color="#f2a900"/></linearGradient></defs>
    <rect width="900" height="560" fill="url(#bg)"/><circle cx="730" cy="110" r="150" fill="#ffc12f" opacity=".16"/><rect x="155" y="180" width="250" height="210" rx="44" fill="#0b2748"/><rect x="495" y="180" width="250" height="210" rx="44" fill="#0b2748"/><path d="M210 205c52 45 94 45 144 0v142c-51 40-96 40-144 0z" fill="#172f50" stroke="#2e527a" stroke-width="10"/><path d="M550 205c52 45 94 45 144 0v142c-51 40-96 40-144 0z" fill="#172f50" stroke="#2e527a" stroke-width="10"/><circle cx="280" cy="284" r="26" fill="url(#y)"/><circle cx="620" cy="284" r="26" fill="url(#y)"/><rect x="190" y="412" width="520" height="54" rx="20" fill="#071b33" opacity=".10"/><path d="M140 112h160M140 148h105M140 184h134" stroke="#071b33" stroke-width="18" stroke-linecap="round" opacity=".82"/>
  </svg>`),
  "motor-yagi": svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f7fbff"/><stop offset="1" stop-color="#e2ebf5"/></linearGradient><linearGradient id="b" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#123b68"/><stop offset="1" stop-color="#071b33"/></linearGradient><linearGradient id="y" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffd45b"/><stop offset="1" stop-color="#f2a900"/></linearGradient></defs>
    <rect width="900" height="560" fill="url(#bg)"/><circle cx="730" cy="105" r="150" fill="#ffc12f" opacity=".16"/><rect x="320" y="118" width="250" height="335" rx="42" fill="url(#b)"/><rect x="370" y="70" width="150" height="66" rx="18" fill="#071b33"/><rect x="360" y="226" width="170" height="118" rx="22" fill="url(#y)"/><text x="388" y="275" font-family="Arial" font-size="40" font-weight="900" fill="#071b33">5W-30</text><text x="393" y="313" font-family="Arial" font-size="24" font-weight="900" fill="#071b33">MOTOR YAĞI</text><path d="M584 184c48 52 70 98 70 138 0 42-30 72-70 72s-70-30-70-72c0-40 22-86 70-138z" fill="#ffc12f" opacity=".9"/><path d="M164 118h156M164 154h102M164 190h130" stroke="#071b33" stroke-width="18" stroke-linecap="round" opacity=".82"/><rect x="260" y="464" width="380" height="54" rx="20" fill="#071b33" opacity=".10"/>
  </svg>`),
  "hava-filtresi": svgData(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 900 560">
    <defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f8fbff"/><stop offset="1" stop-color="#e4edf7"/></linearGradient><linearGradient id="y" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#ffd45b"/><stop offset="1" stop-color="#f2a900"/></linearGradient></defs>
    <rect width="900" height="560" fill="url(#bg)"/><circle cx="720" cy="95" r="145" fill="#ffc12f" opacity=".16"/><rect x="250" y="148" width="400" height="250" rx="38" fill="#0b2748"/><rect x="285" y="180" width="330" height="185" rx="24" fill="#102f52" stroke="#2d527a" stroke-width="10"/><g stroke="url(#y)" stroke-width="18" stroke-linecap="round"><path d="M328 198v150"/><path d="M375 198v150"/><path d="M422 198v150"/><path d="M469 198v150"/><path d="M516 198v150"/><path d="M563 198v150"/></g><path d="M145 118h154M145 154h98M145 190h130" stroke="#071b33" stroke-width="18" stroke-linecap="round" opacity=".82"/><rect x="240" y="420" width="420" height="54" rx="20" fill="#071b33" opacity=".10"/><text x="330" y="492" font-family="Arial" font-size="28" font-weight="900" fill="#071b33">HAVA FİLTRESİ</text>
  </svg>`)
};

const SEVRA_DEFAULT_PRODUCTS = [
  {
    id:"fren-diski", name:"Ticari Araç Fren Diski", category:"Araç Parçaları",
    price:"1.250,00 TL", stock:25, status:"Stokta", feature:"Yüksek Performans",
    image:PRODUCT_IMAGES["fren-diski"],
    short:"Kamyonet, ticari araç ve lojistik saha araçları için fren diski ürün ilanı.",
    desc:"Ticari araçlar, kamyonetler ve yoğun saha operasyonları için güvenli frenleme desteği sunan fren diski ürün ilanı.",
    tags:["fren diski","araç parçası","ticari araç"]
  },
  {
    id:"fren-balatasi", name:"Ticari Araç Fren Balatası", category:"Araç Parçaları",
    price:"650,00 TL", stock:40, status:"Stokta", feature:"Güvenli Sürüş",
    image:PRODUCT_IMAGES["fren-balatasi"],
    short:"Ticari araçlar için fren balatası ve bakım sarf ürünü ilanı.",
    desc:"Filo araçları ve ticari araç kullanımı için güvenli duruş performansını destekleyen fren balatası ürün ilanı.",
    tags:["fren balatası","bakım","filo"]
  },
  {
    id:"motor-yagi", name:"Ticari Araç Motor Yağı 5W-30", category:"Yağ & Sıvılar",
    price:"1.850,00 TL", stock:18, status:"Stokta", feature:"Uzun Motor Ömrü",
    image:PRODUCT_IMAGES["motor-yagi"],
    short:"Filo, ticari araç ve lojistik araçları için motor yağı ürün ilanı.",
    desc:"Ticari araç motorları için uygun viskozite sınıfında, uzun motor ömrünü destekleyen motor yağı ürün ilanı.",
    tags:["motor yağı","5w30","ticari araç"]
  },
  {
    id:"hava-filtresi", name:"Hava Filtresi", category:"Bakım Ürünleri",
    price:"320,00 TL", stock:60, status:"Stokta", feature:"Yüksek Filtrasyon",
    image:PRODUCT_IMAGES["hava-filtresi"],
    short:"Ticari araçlar için yüksek performanslı hava filtresi ürün ilanı.",
    desc:"Tozlu saha, şehir içi ve uzun yol ticari araç kullanımında motor hava giriş kalitesini destekleyen hava filtresi ürün ilanı.",
    tags:["hava filtresi","bakım","filtre"]
  }
];

function safeText(v){
  return String(v || "").replace(/[&<>"]/g, function(c){
    return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c];
  });
}

function getProducts(){
  try{
    const saved = JSON.parse(localStorage.getItem("sevra_products") || "[]");
    const all = [...SEVRA_DEFAULT_PRODUCTS, ...saved];
    const seen = new Set();
    return all.filter(function(p){
      const key = p.id || p.name;
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }catch(e){
    return SEVRA_DEFAULT_PRODUCTS;
  }
}

function fallbackImage(){
  return PRODUCT_IMAGES["fren-diski"];
}

function productCard(p){
  const image = p.image || fallbackImage();
  return `<article class="product-card" data-category="${safeText(p.category)}">
    <div class="product-image">
      <img src="${image}" alt="${safeText(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='${fallbackImage()}'">
      <span class="badge">Yeni</span>
      <span class="bookmark">♡</span>
    </div>
    <div class="product-body">
      <span class="product-cat">${safeText(p.category)}</span>
      <h2>${safeText(p.name)}</h2>
      <p>${safeText(p.short || p.desc || "")}</p>
      <div class="product-meta">
        <span><i class="dot"></i>${safeText(p.status || "Stokta")}${p.stock ? " ("+safeText(p.stock)+")" : ""}</span>
        <span>🛡 ${safeText(p.feature || "SEVRA Kalitesi")}</span>
      </div>
      <div class="product-price">${safeText(p.price || "Fiyat sorunuz")}</div>
      <div class="product-buttons">
        <button class="btn" type="button" onclick="openProduct('${safeText(p.id)}')">Detayları Gör</button>
        <a class="btn primary" href="mailto:info@sevrawms.com.tr?subject=${encodeURIComponent((p.name || 'Ürün') + ' ürün talebi')}">İletişime Geç</a>
      </div>
    </div>
  </article>`;
}

function renderCatalog(){
  const grid = document.getElementById("productGrid");
  if(!grid) return;
  const q = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
  const active = document.querySelector(".cat.active")?.dataset.cat || "Tümü";
  const sort = document.getElementById("sortFilter")?.value || "new";
  let list = getProducts().filter(function(p){
    const hit = [p.name,p.category,p.short,p.desc,(p.tags||[]).join(" ")].join(" ").toLowerCase().includes(q);
    const okcat = active === "Tümü" || p.category === active;
    return hit && okcat;
  });
  if(sort === "az") list = list.sort((a,b)=>String(a.name).localeCompare(String(b.name),"tr"));
  if(sort === "stock") list = list.sort((a,b)=>(b.stock||0)-(a.stock||0));
  grid.innerHTML = list.length ? list.map(productCard).join("") : `<div class="empty"><b>Sonuç bulunamadı.</b><br>Arama veya kategori seçimini değiştirin.</div>`;
  updateCounts();
}

function updateCounts(){
  const products = getProducts();
  document.querySelectorAll("[data-count-cat]").forEach(function(el){
    const cat = el.getAttribute("data-count-cat");
    const n = cat === "Tümü" ? products.length : products.filter(p=>p.category===cat).length;
    el.textContent = n;
  });
}

function setCategory(cat){
  document.querySelectorAll(".cat").forEach(function(b){ b.classList.toggle("active", b.dataset.cat === cat); });
  renderCatalog();
}

function openProduct(id){
  const p = getProducts().find(x=>String(x.id)===String(id));
  if(!p) return;
  document.getElementById("modalTitle").textContent = p.name;
  document.getElementById("modalBody").innerHTML = `<div class="modal-content">
    <img src="${p.image || fallbackImage()}" alt="${safeText(p.name)}" onerror="this.onerror=null;this.src='${fallbackImage()}'">
    <div>
      <span class="product-cat">${safeText(p.category)}</span>
      <p>${safeText(p.desc || p.short || "")}</p>
      <table class="detail-table">
        <tr><td>Durum</td><td>${safeText(p.status || "Stokta")}</td></tr>
        <tr><td>Stok</td><td>${safeText(p.stock || 0)}</td></tr>
        <tr><td>Fiyat</td><td>${safeText(p.price || "Fiyat sorunuz")}</td></tr>
        <tr><td>Etiketler</td><td>${safeText((p.tags||[]).join(", "))}</td></tr>
      </table>
      <div class="product-buttons">
        <a class="btn primary" href="mailto:info@sevrawms.com.tr?subject=${encodeURIComponent((p.name || 'Ürün') + ' ürün talebi')}">İletişime Geç</a>
        <button class="btn" type="button" onclick="closeModal()">Kapat</button>
      </div>
    </div>
  </div>`;
  document.getElementById("productModal").style.display = "flex";
}

function closeModal(){
  document.getElementById("productModal").style.display = "none";
}

document.addEventListener("keydown", function(e){
  if(e.key === "Escape") closeModal();
});

document.addEventListener("DOMContentLoaded", function(){
  renderCatalog();
});
