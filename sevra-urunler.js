const SEVRA_DEFAULT_PRODUCTS = [
  {
    id:"fren-diski", name:"Ticari Araç Fren Diski", category:"Araç Parçaları",
    price:"1.250,00 TL", stock:25, status:"Stokta", feature:"Yüksek Performans",
    image:"assets/products/fren-diski.svg",
    short:"Kamyonet, ticari araç ve lojistik saha araçları için fren diski ürün ilanı.",
    desc:"SEVRA kalitesiyle listelenen yüksek performanslı fren diski; ticari araçlar, kamyonetler ve yoğun saha operasyonları için güvenli frenleme desteği sunar.",
    tags:["fren diski","araç parçası","ticari araç"]
  },
  {
    id:"fren-balatasi", name:"Ticari Araç Fren Balatası", category:"Araç Parçaları",
    price:"650,00 TL", stock:40, status:"Stokta", feature:"Güvenli Sürüş",
    image:"assets/products/fren-balatasi.svg",
    short:"Ticari araçlar için fren balatası ve bakım sarf ürünü ilanı.",
    desc:"Filo araçları ve ticari araç kullanımı için güvenli duruş performansını destekleyen fren balatası ürün ilanı.",
    tags:["fren balatası","bakım","filo"]
  },
  {
    id:"motor-yagi", name:"Ticari Araç Motor Yağı 5W-30", category:"Yağ & Sıvılar",
    price:"1.850,00 TL", stock:18, status:"Stokta", feature:"Uzun Motor Ömrü",
    image:"assets/products/motor-yagi-5w30.svg",
    short:"Filo, ticari araç ve lojistik araçları için motor yağı ürün ilanı.",
    desc:"Ticari araç motorları için uygun viskozite sınıfında, uzun motor ömrünü destekleyen motor yağı ürün ilanı.",
    tags:["motor yağı","5w30","ticari araç"]
  },
  {
    id:"hava-filtresi", name:"Hava Filtresi", category:"Bakım Ürünleri",
    price:"320,00 TL", stock:60, status:"Stokta", feature:"Yüksek Filtrasyon",
    image:"assets/products/hava-filtresi.svg",
    short:"Ticari araçlar için yüksek performanslı hava filtresi ürün ilanı.",
    desc:"Tozlu saha, şehir içi ve uzun yol ticari araç kullanımında motor hava giriş kalitesini destekleyen hava filtresi ürün ilanı.",
    tags:["hava filtresi","bakım","filtre"]
  }
];

function getProducts(){
  try{
    const saved = JSON.parse(localStorage.getItem("sevra_products") || "[]");
    const all = [...SEVRA_DEFAULT_PRODUCTS, ...saved];
    const seen = new Set();
    return all.filter(p => {
      const key = p.id || p.name;
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }catch(e){ return SEVRA_DEFAULT_PRODUCTS; }
}
function saveCustomProducts(list){ localStorage.setItem("sevra_products", JSON.stringify(list)); }
function moneyClean(v){ return String(v||"").trim(); }
function productCard(p){
  return `<article class="product-card" data-category="${p.category}">
    <div class="product-image">
      <img src="${p.image}" alt="${p.name}" loading="lazy">
      <span class="badge">Yeni</span>
      <span class="bookmark">♡</span>
    </div>
    <div class="product-body">
      <span class="product-cat">${p.category}</span>
      <h2>${p.name}</h2>
      <p>${p.short || p.desc || ""}</p>
      <div class="product-meta">
        <span><i class="dot"></i>${p.status || "Stokta"}${p.stock ? " ("+p.stock+")" : ""}</span>
        <span>🛡 ${p.feature || "SEVRA Kalitesi"}</span>
      </div>
      <div class="product-price">${p.price || "Fiyat sorunuz"}</div>
      <div class="product-buttons">
        <button class="btn" onclick="openProduct('${p.id}')">Detayları Gör</button>
        <a class="btn primary" href="mailto:info@sevrawms.com.tr?subject=${encodeURIComponent(p.name + ' ürün talebi')}">İletişime Geç</a>
      </div>
    </div>
  </article>`;
}
function renderCatalog(){
  const grid = document.getElementById("productGrid");
  if(!grid) return;
  const q = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
  const cat = document.getElementById("categoryFilter")?.value || "Tümü";
  const sort = document.getElementById("sortFilter")?.value || "new";
  let list = getProducts().filter(p => {
    const hit = [p.name,p.category,p.short,p.desc,(p.tags||[]).join(" ")].join(" ").toLowerCase().includes(q);
    const okcat = cat === "Tümü" || p.category === cat;
    return hit && okcat;
  });
  if(sort === "az") list = list.sort((a,b)=>a.name.localeCompare(b.name,"tr"));
  if(sort === "stock") list = list.sort((a,b)=>(b.stock||0)-(a.stock||0));
  grid.innerHTML = list.map(productCard).join("") || `<div class="admin-card"><b>Sonuç bulunamadı.</b><p>Arama veya kategori seçimini değiştirin.</p></div>`;
  updateCounts();
}
function updateCounts(){
  const products = getProducts();
  document.querySelectorAll("[data-count-cat]").forEach(el=>{
    const cat = el.getAttribute("data-count-cat");
    const n = cat === "Tümü" ? products.length : products.filter(p=>p.category===cat).length;
    el.textContent = n;
  });
}
function setCategory(cat){
  const sel = document.getElementById("categoryFilter");
  if(sel) sel.value = cat;
  document.querySelectorAll(".cat").forEach(b=>b.classList.toggle("active", b.dataset.cat === cat));
  renderCatalog();
}
function openProduct(id){
  const p = getProducts().find(x=>x.id===id);
  if(!p) return;
  document.getElementById("modalTitle").textContent = p.name;
  document.getElementById("modalBody").innerHTML = `<div class="modal-content">
    <img src="${p.image}" alt="${p.name}">
    <div>
      <span class="product-cat">${p.category}</span>
      <p>${p.desc || p.short || ""}</p>
      <table class="detail-table">
        <tr><td>Durum</td><td>${p.status || "Stokta"}</td></tr>
        <tr><td>Stok</td><td>${p.stock || 0}</td></tr>
        <tr><td>Fiyat</td><td>${p.price || "Fiyat sorunuz"}</td></tr>
        <tr><td>Etiketler</td><td>${(p.tags||[]).join(", ")}</td></tr>
      </table>
      <div class="product-buttons">
        <a class="btn primary" href="mailto:info@sevrawms.com.tr?subject=${encodeURIComponent(p.name + ' ürün talebi')}">İletişime Geç</a>
        <button class="btn" onclick="closeModal()">Kapat</button>
      </div>
    </div>
  </div>`;
  document.getElementById("productModal").style.display = "flex";
}
function closeModal(){ document.getElementById("productModal").style.display = "none"; }
function buildCategoryOptions(selected){
  const cats = ["Araç Parçaları","Yağ & Sıvılar","Bakım Ürünleri","Aksesuar","Diğer"];
  return cats.map(c=>`<option ${selected===c?"selected":""}>${c}</option>`).join("");
}
function renderAdmin(){
  const form = document.getElementById("productForm");
  if(!form) return;
  document.getElementById("productCategory").innerHTML = buildCategoryOptions("Araç Parçaları");
  renderPreview();
  renderSavedList();
  form.addEventListener("input", renderPreview);
  const file = document.getElementById("productImageFile");
  file.addEventListener("change", function(){
    const f = file.files && file.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = () => {
      document.getElementById("imageData").value = reader.result;
      renderPreview();
    };
    reader.readAsDataURL(f);
  });
}
function formProduct(){
  const name = document.getElementById("productName").value.trim() || "Yeni Ürün";
  return {
    id: "urun-" + Date.now(),
    name,
    category: document.getElementById("productCategory").value,
    price: moneyClean(document.getElementById("productPrice").value) || "Fiyat sorunuz",
    stock: Number(document.getElementById("productStock").value || 0),
    status: document.getElementById("productStatus").checked ? "Stokta" : "Stok Yok",
    feature: document.getElementById("productFeature").value.trim() || "SEVRA Kalitesi",
    image: document.getElementById("imageData").value || "assets/products/fren-diski.svg",
    short: document.getElementById("productShort").value.trim(),
    desc: document.getElementById("productDesc").value.trim(),
    tags: document.getElementById("productTags").value.split(",").map(x=>x.trim()).filter(Boolean)
  };
}
function renderPreview(){
  const box = document.getElementById("livePreview");
  if(!box) return;
  box.innerHTML = `<div class="preview-card">${productCard(formProduct())}</div>`;
}
function saveProduct(){
  const custom = JSON.parse(localStorage.getItem("sevra_products") || "[]");
  custom.unshift(formProduct());
  saveCustomProducts(custom);
  document.getElementById("productForm").reset();
  document.getElementById("imageData").value = "";
  document.getElementById("productCategory").innerHTML = buildCategoryOptions("Araç Parçaları");
  renderPreview();
  renderSavedList();
  alert("Ürün bu tarayıcıya kaydedildi. Canlı sitede herkesin görmesi için bu ürün daha sonra Firebase/backend yapısına bağlanacak.");
}
function renderSavedList(){
  const box = document.getElementById("savedProducts");
  if(!box) return;
  const custom = JSON.parse(localStorage.getItem("sevra_products") || "[]");
  box.innerHTML = custom.map((p,i)=>`<div class="product-row">
    <img src="${p.image}" alt="${p.name}">
    <div><div class="row-title">${p.name}</div><div class="row-sub">${p.category} • ${p.price} • ${p.status}</div></div>
    <button class="delete-btn" onclick="deleteProduct(${i})">Sil</button>
  </div>`).join("") || `<div class="notice">Henüz sonradan eklenmiş ürün yok. Ana katalogda 4 başlangıç ürünü yayına hazırdır.</div>`;
}
function deleteProduct(i){
  const custom = JSON.parse(localStorage.getItem("sevra_products") || "[]");
  custom.splice(i,1);
  saveCustomProducts(custom);
  renderSavedList();
}
function exportProducts(){
  const data = JSON.stringify(JSON.parse(localStorage.getItem("sevra_products") || "[]"), null, 2);
  const blob = new Blob([data], {type:"application/json;charset=utf-8"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "sevra-urunler.json";
  a.click();
}
function importProductsFile(input){
  const f = input.files && input.files[0];
  if(!f) return;
  const r = new FileReader();
  r.onload = () => {
    try{
      const arr = JSON.parse(r.result);
      if(!Array.isArray(arr)) throw new Error();
      saveCustomProducts(arr);
      renderSavedList();
      alert("Ürün listesi içe aktarıldı.");
    }catch(e){ alert("JSON dosyası okunamadı."); }
  };
  r.readAsText(f, "utf-8");
}
document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  renderAdmin();
});
