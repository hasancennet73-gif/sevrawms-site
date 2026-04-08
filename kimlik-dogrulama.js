<!doctype html>
<html lang="tr">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>SEVRA | Üye Paneli</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
:root{
  --line:rgba(255,255,255,.08);
  --text:#eef4ff;
  --muted:#aebcd3;
  --yellow:#f1c84d;
}
body{
  font-family:Arial,Helvetica,sans-serif;
  color:var(--text);
  background:
    radial-gradient(circle at top right, rgba(241,200,77,.08), transparent 18%),
    radial-gradient(circle at left top, rgba(44,89,179,.16), transparent 24%),
    linear-gradient(180deg,#071425,#08111b 74%,#040912);
}
.wrap{max-width:1200px;margin:0 auto;padding:26px}
.top{display:flex;align-items:center;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-bottom:18px}
.title h1{font-size:38px;margin-bottom:8px}
.title p{color:#aebcd3}
.badge{
  display:inline-flex;align-items:center;justify-content:center;min-height:34px;padding:0 12px;border-radius:999px;
  background:rgba(241,200,77,.14);color:#ffe08a;font-size:12px;font-weight:700
}
.btn{
  min-height:42px;padding:0 14px;border-radius:10px;display:inline-flex;align-items:center;justify-content:center;
  font-weight:700;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.04);color:#fff;cursor:pointer;text-decoration:none
}
.cards{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:18px}
.card,.panel{
  border:1px solid rgba(255,255,255,.08);border-radius:18px;background:rgba(255,255,255,.03);padding:18px
}
.card strong{display:block;font-size:28px;margin-bottom:6px}
.card span{color:#aebcd3;font-size:13px}
.grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
.panel h2{font-size:24px;margin-bottom:10px}
.panel p{color:#c7d3e6}
.list{display:grid;gap:10px}
.item{
  border:1px solid rgba(255,255,255,.08);border-radius:14px;background:rgba(255,255,255,.02);padding:14px
}
.item strong{display:block;font-size:15px;margin-bottom:4px}
.item span{font-size:13px;color:#c7d3e6}
@media (max-width:1100px){.grid{grid-template-columns:1fr}}
@media (max-width:900px){.cards{grid-template-columns:1fr 1fr}}
@media (max-width:680px){.cards{grid-template-columns:1fr}}
</style>
</head>
<body>
<div class="wrap">
  <div class="top">
    <div class="title">
      <h1>Üye Paneli</h1>
      <p id="welcomeText">Normal üyeler için ayrılmış alan.</p>
    </div>
    <div style="display:flex;gap:10px;flex-wrap:wrap">
      <div id="memberUser" class="badge">Üye</div>
      <button class="btn" onclick="SEVRA_KIMLIK.logout('uye-login.html')">Çıkış Yap</button>
    </div>
  </div>

  <div class="cards" id="summaryCards">
    <div class="card"><strong>0</strong><span>Aktif ilan</span></div>
    <div class="card"><strong>0</strong><span>Mesaj</span></div>
    <div class="card"><strong>0</strong><span>Aktif ürün</span></div>
    <div class="card"><strong>0</strong><span>Ziyaret</span></div>
  </div>

  <div class="grid">
    <div class="panel">
      <h2>Profil Özeti</h2>
      <div class="list" id="profileList"></div>
    </div>

    <div class="panel">
      <h2>Rolüne Göre Hızlı Akış</h2>
      <div class="list" id="roleFlowList"></div>
    </div>
  </div>

  <div class="panel" style="margin-top:18px">
    <h2>Platform Özeti</h2>
    <p id="platformText">Veri yükleniyor...</p>
  </div>
</div>

<script src="kimlik-dogrulama.js"></script>
<script>
if (SEVRA_KIMLIK.requireMember()) {
  const auth = SEVRA_KIMLIK.getAuth();
  document.getElementById("memberUser").textContent = "Üye: " + auth.username + " / " + auth.role;
}
if (typeof SEVRA_KIMLIK.trackVisit === "function") {
  SEVRA_KIMLIK.trackVisit("uye-panel");
}

function roleText(role){
  if(role === "carrier") return "Nakliyeci";
  if(role === "shipper") return "Yük Veren";
  return "Standart Üye";
}

function loadMemberPanel(){
  const auth = SEVRA_KIMLIK.getAuth() || {};
  const products = (typeof SEVRA_KIMLIK.getProducts === "function") ? SEVRA_KIMLIK.getProducts() : [];
  const messages = (typeof SEVRA_KIMLIK.getMessages === "function") ? SEVRA_KIMLIK.getMessages() : [];
  const visits = (typeof SEVRA_KIMLIK.getVisitSummary === "function") ? SEVRA_KIMLIK.getVisitSummary() : { total: 0 };
  const activeProducts = products.filter(x => x.status !== "Pasif").length;

  document.getElementById("welcomeText").textContent =
    (auth.fullName || auth.username || "Üye") + " için kişisel panel görünümü.";

  document.getElementById("summaryCards").innerHTML = `
    <div class="card"><strong>3</strong><span>Aktif ilan</span></div>
    <div class="card"><strong>${messages.length}</strong><span>Mesaj</span></div>
    <div class="card"><strong>${activeProducts}</strong><span>Aktif ürün</span></div>
    <div class="card"><strong>${visits.total || 0}</strong><span>Toplam ziyaret</span></div>
  `;

  document.getElementById("profileList").innerHTML = `
    <div class="item"><strong>Ad Soyad</strong><span>${auth.fullName || "-"}</span></div>
    <div class="item"><strong>Kullanıcı Adı</strong><span>${auth.username || "-"}</span></div>
    <div class="item"><strong>Rol</strong><span>${roleText(auth.role)}</span></div>
    <div class="item"><strong>Firma</strong><span>${auth.company || "-"}</span></div>
  `;

  let roleItems = [];
  if(auth.role === "carrier"){
    roleItems = [
      ["Nakliyeci Akışı", "Uygun yükleri incele, teklif ver ve mesajlarını takip et."],
      ["Araç Uygunluğu", "Boş araç planına göre fırsatları değerlendir."],
      ["Hızlı Takip", "Başvuru ve mesaj ekranlarını düzenli kontrol et."]
    ];
  } else if(auth.role === "shipper"){
    roleItems = [
      ["Yük Veren Akışı", "Yük ihtiyaçlarını sisteme taşı ve nakliyecileri takip et."],
      ["Teklif Kontrolü", "Gelen teklif ve mesajları tek panelden izle."],
      ["Hızlı Süreç", "Başvuru ve operasyon özetlerini düzenli güncelle."]
    ];
  } else {
    roleItems = [
      ["Üye Akışı", "Platform modüllerini incele ve gelişmeleri takip et."],
      ["Mesaj Takibi", "Yeni mesajları panel üzerinden izleyebilirsin."],
      ["Profil Yönetimi", "Üyelik bilgilerinin güncel kaldığından emin ol."]
    ];
  }

  document.getElementById("roleFlowList").innerHTML = roleItems.map(x => `
    <div class="item"><strong>${x[0]}</strong><span>${x[1]}</span></div>
  `).join('');

  document.getElementById("platformText").textContent =
    "Sistemde " + activeProducts + " aktif ürün, " + messages.length + " toplam mesaj ve " +
    (visits.total || 0) + " kayıtlı ziyaret hareketi bulunuyor.";
}

loadMemberPanel();
</script>
</body>
</html>
