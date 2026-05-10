/* SEVRA Ürün Vitrini - Dosyasız Görsel Çözüm
   Bu sürüm assets/products klasörüne bağlı kalmaz.
   Görseller dış fotoğraf linklerinden gelir; link çalışmazsa kart boş kalmasın diye otomatik SEVRA görseli üretir.
   İletişime Geç butonu mail programı açmaz; basvuru.html sayfasına yönlendirir.
*/

const SEVRA_IMAGE_POOL = {
  "fren-diski": "https://loremflickr.com/900/600/brake,disc,car?lock=101",
  "fren-balatasi": "https://loremflickr.com/900/600/brake,pads,car?lock=102",
  "motor-yagi": "https://loremflickr.com/900/600/motor,oil,car?lock=103",
  "hava-filtresi": "https://loremflickr.com/900/600/air,filter,car?lock=104",
  "yag-filtresi": "https://loremflickr.com/900/600/oil,filter,engine?lock=105",
  "yakit-filtresi": "https://loremflickr.com/900/600/fuel,filter,engine?lock=106",
  "camurluk": "https://loremflickr.com/900/600/car,fender,body?lock=107",
  "paspas": "https://loremflickr.com/900/600/car,mat,interior?lock=108",
  "silecek": "https://loremflickr.com/900/600/wiper,car,windshield?lock=109",
  "far": "https://loremflickr.com/900/600/car,headlight?lock=110",
  "stop": "https://loremflickr.com/900/600/car,tail,light?lock=111",
  "aku": "https://loremflickr.com/900/600/car,battery?lock=112",
  "amortisor": "https://loremflickr.com/900/600/car,suspension,shock?lock=113",
  "antifriz": "https://loremflickr.com/900/600/coolant,antifreeze,car?lock=114",
  "balata-spreyi": "https://loremflickr.com/900/600/car,cleaner,garage?lock=115"
};

function sevraMoney(n){
  return Number(n || 0).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " TL";
}

function sevraSlug(s){
  return String(s || "urun")
    .toLowerCase()
    .replaceAll("ğ","g").replaceAll("ü","u").replaceAll("ş","s").replaceAll("ı","i").replaceAll("ö","o").replaceAll("ç","c")
    .replace(/[^a-z0-9]+/g,"-")
    .replace(/^-+|-+$/g,"");
}

function sevraFallbackImage(title, category){
  const t = String(title || "SEVRA Ürün").replace(/[<>&]/g, "");
  const c = String(category || "Ürün").replace(/[<>&]/g, "");
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="900" height="600" viewBox="0 0 900 600">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#eef5ff"/>
        <stop offset="1" stop-color="#dfeaf7"/>
      </linearGradient>
      <radialGradient id="sun" cx="70%" cy="20%" r="45%">
        <stop offset="0" stop-color="#fff2b8"/>
        <stop offset="1" stop-color="#fff2b8" stop-opacity="0"/>
      </radialGradient>
    </defs>
    <rect width="900" height="600" fill="url(#bg)"/>
    <rect width="900" height="600" fill="url(#sun)"/>
    <circle cx="430" cy="280" r="120" fill="#d5dde7"/>
    <circle cx="430" cy="280" r="78" fill="#9aaabd"/>
    <circle cx="430" cy="280" r="42" fill="#0b2945"/>
    <circle cx="430" cy="280" r="20" fill="#ffc52f"/>
    <g fill="#617386">
      <circle cx="430" cy="148" r="15"/>
      <circle cx="430" cy="412" r="15"/>
      <circle cx="298" cy="280" r="15"/>
      <circle cx="562" cy="280" r="15"/>
      <circle cx="337" cy="187" r="15"/>
      <circle cx="523" cy="187" r="15"/>
      <circle cx="337" cy="373" r="15"/>
      <circle cx="523" cy="373" r="15"/>
    </g>
    <rect x="180" y="420" width="540" height="54" rx="22" fill="#cfd8e3"/>
    <rect x="350" y="210" width="160" height="45" rx="22" fill="#092847"/>
    <text x="430" y="240" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#ffc52f">SEVRA</text>
    <rect x="295" y="505" width="310" height="44" rx="22" fill="#ffc52f"/>
    <text x="450" y="534" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" font-weight="800" fill="#08243f">${c}</text>
    <text x="450" y="82" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" font-weight="800" fill="#08243f">${t}</text>
  </svg>`;
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

function htmlSafe(v){
  return String(v ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#39;");
}

function attrSafe(v){
  return htmlSafe(v).replace(/`/g,"&#96;");
}

function makeProduct(id, name, category, price, stock, feature, imageKey, short, desc, tags){
  return {
    id,
    name,
    category,
    price: sevraMoney(price),
    stock,
    status: stock > 0 ? "Stokta" : "Stok Sorunuz",
    feature,
    image: SEVRA_IMAGE_POOL[imageKey] || SEVRA_IMAGE_POOL["fren-diski"],
    short,
    desc,
    tags: tags || []
  };
}

const SEVRA_DEFAULT_PRODUCTS = [
  makeProduct("fren-diski-260-on", "Ticari Araç Fren Diski 260 mm Ön", "Araç Parçaları", 980, 12, "Güvenli Frenleme", "fren-diski", "260 mm ticari araç fren diski; filo, kamyonet ve lojistik saha araçları için ürün ilanı.", "Ön aks kullanımına uygun fren diski ilanıdır. Filo bakım süreçlerinde, şehir içi dağıtım araçlarında ve hafif ticari araçlarda güvenli frenleme performansını desteklemek için listelenmiştir.", ["fren diski","ön disk","ticari araç"]),
  makeProduct("fren-diski-270-arka", "Ticari Araç Fren Diski 270 mm Arka", "Araç Parçaları", 1017, 15, "Güvenli Frenleme", "fren-diski", "270 mm ticari araç fren diski; filo, kamyonet ve lojistik saha araçları için ürün ilanı.", "Arka aks kullanımına uygun fren diski ilanıdır. Depo, servis, saha ve nakliye operasyonlarında kullanılan ticari araçların periyodik bakım ihtiyaçları için uygundur.", ["fren diski","arka disk","ticari araç"]),
  makeProduct("fren-diski-280-havalandirmali", "Ticari Araç Fren Diski 280 mm Havalandırmalı", "Araç Parçaları", 1054, 18, "Güvenli Frenleme", "fren-diski", "280 mm havalandırmalı fren diski; yoğun kullanım yapan ticari araçlar için ürün ilanı.", "Havalandırmalı yapıdaki fren diski ilanıdır. Uzun yol, şehir içi dağıtım ve sık dur-kalk çalışan filo araçları için ürün görünürlüğü sağlar.", ["fren diski","havalandırmalı","fren"]),
  makeProduct("fren-diski-290-agir-hizmet", "Ticari Araç Fren Diski 290 mm Ağır Hizmet", "Araç Parçaları", 1091, 21, "Ağır Hizmet", "fren-diski", "290 mm ağır hizmet fren diski; lojistik ve servis araçları için ürün ilanı.", "Ağır hizmet şartlarında çalışan ticari araçların bakım süreçleri için listelenen fren diski ürünüdür.", ["fren diski","ağır hizmet","filo"]),
  makeProduct("fren-diski-300-kamyonet", "Ticari Araç Fren Diski 300 mm Kamyonet", "Araç Parçaları", 1128, 24, "Kamyonet Uyumlu", "fren-diski", "300 mm kamyonet fren diski; ticari araç bakım ihtiyaçları için ürün ilanı.", "Kamyonet ve hafif ticari araç grubu için fren diski ilanıdır. Ürün görünürlüğü ve teklif toplama amacıyla listelenmiştir.", ["fren diski","kamyonet","servis"]),
  makeProduct("fren-diski-310-filo", "Ticari Araç Fren Diski 310 mm Filo Kullanımı", "Araç Parçaları", 1165, 27, "Filo Bakımı", "fren-diski", "310 mm filo kullanımına uygun fren diski ürün ilanı.", "Filo araçlarının düzenli bakım ihtiyacına yönelik fren diski ürün ilanıdır.", ["fren diski","filo","fren"]),
  makeProduct("fren-diski-320-on-arka", "Fren Diski 320 mm Ön / Arka Kullanım", "Araç Parçaları", 1202, 30, "Çift Kullanım", "fren-diski", "320 mm fren diski; ön ve arka kullanım seçenekleri için ürün ilanı.", "Ticari araç bakım ve servis ihtiyaçlarında teklif alınabilecek fren diski ürün ilanıdır.", ["fren diski","araç parçası"]),
  makeProduct("fren-diski-330-profesyonel", "Profesyonel Seri Fren Diski 330 mm", "Araç Parçaları", 1239, 33, "Profesyonel Seri", "fren-diski", "330 mm profesyonel seri fren diski ürün ilanı.", "Yoğun çalışan ticari araçlar için profesyonel seri fren diski görünürlük ilanıdır.", ["fren diski","profesyonel"]),
  makeProduct("fren-diski-340-yuksek-performans", "Yüksek Performans Fren Diski 340 mm", "Araç Parçaları", 1276, 36, "Yüksek Performans", "fren-diski", "340 mm yüksek performans fren diski ürün ilanı.", "Yüksek performans beklentisi olan filo ve servis kullanıcıları için fren diski ilanıdır.", ["fren diski","performans"]),
  makeProduct("fren-diski-350-servis", "Servis Tipi Fren Diski 350 mm", "Araç Parçaları", 1313, 39, "Servis Tipi", "fren-diski", "350 mm servis tipi fren diski ürün ilanı.", "Servis ve bakım firmalarının görünürlüğü için hazırlanmış fren diski ürün ilanıdır.", ["fren diski","servis"]),

  makeProduct("fren-balatasi-on-set", "Ticari Araç Fren Balatası Ön Set", "Araç Parçaları", 650, 40, "Güvenli Sürüş", "fren-balatasi", "Ön fren balatası seti; ticari araç ve kamyonet bakımı için ürün ilanı.", "Ticari araçların ön fren sistemi bakımında kullanılabilecek balata seti ürün ilanıdır.", ["fren balatası","ön balata","bakım"]),
  makeProduct("fren-balatasi-arka-set", "Ticari Araç Fren Balatası Arka Set", "Araç Parçaları", 690, 38, "Güvenli Sürüş", "fren-balatasi", "Arka fren balatası seti; filo ve servis araçları için ürün ilanı.", "Filo ve servis araçlarında arka fren sistemi bakımı için listelenen balata setidir.", ["fren balatası","arka balata"]),
  makeProduct("fren-balatasi-agir-hizmet", "Ağır Hizmet Fren Balatası", "Araç Parçaları", 740, 34, "Ağır Hizmet", "fren-balatasi", "Ağır hizmet fren balatası; yoğun çalışan araçlar için ürün ilanı.", "Dur-kalk yoğunluğu yüksek saha araçları ve lojistik operasyonları için fren balatası ilanıdır.", ["fren balatası","ağır hizmet"]),
  makeProduct("fren-balatasi-seramik", "Seramik Katkılı Fren Balatası", "Araç Parçaları", 825, 22, "Düşük Ses", "fren-balatasi", "Seramik katkılı fren balatası ürün ilanı.", "Düşük ses ve konfor beklentisi olan ticari araç bakımları için listelenmiştir.", ["seramik balata","fren"]),
  makeProduct("fren-balatasi-filo-paket", "Filo Bakım Fren Balatası Paket", "Araç Parçaları", 910, 30, "Filo Paketi", "fren-balatasi", "Filo bakım süreçleri için fren balatası paket ilanı.", "Birden fazla araç bakımı yapan filo işletmeleri için görünürlük sağlayan ürün ilanıdır.", ["balata","filo"]),
  makeProduct("fren-balatasi-yuksek-is", "Yüksek Isı Dayanımlı Fren Balatası", "Araç Parçaları", 970, 18, "Isı Dayanımı", "fren-balatasi", "Yüksek ısı dayanımlı fren balatası ürün ilanı.", "Yoğun frenleme koşullarında çalışan ticari araçlar için balata görünürlük ilanıdır.", ["balata","yüksek ısı"]),
  makeProduct("fren-balatasi-kamyonet", "Kamyonet Fren Balatası", "Araç Parçaları", 615, 44, "Kamyonet Uyumlu", "fren-balatasi", "Kamyonet kullanımına uygun fren balatası ilanı.", "Hafif ticari ve kamyonet grubu araçlar için fren balatası ilanıdır.", ["kamyonet","balata"]),
  makeProduct("fren-balatasi-minibus", "Minibüs Fren Balatası", "Araç Parçaları", 760, 29, "Minibüs Uyumlu", "fren-balatasi", "Minibüs grubu araçlar için fren balatası ürün ilanı.", "Personel taşımacılığı ve servis araçlarının bakım ihtiyaçları için listelenmiştir.", ["minibüs","balata"]),
  makeProduct("fren-balatasi-servis", "Servis Araçları Fren Balatası", "Araç Parçaları", 785, 25, "Servis Aracı", "fren-balatasi", "Servis araçları için fren balatası ürün ilanı.", "Günlük operasyon yapan servis araçlarının fren bakım ihtiyacı için ilan kaydıdır.", ["servis","balata"]),
  makeProduct("fren-balatasi-ekonomik", "Ekonomik Seri Fren Balatası", "Araç Parçaları", 540, 55, "Ekonomik Seri", "fren-balatasi", "Ekonomik seri fren balatası ürün ilanı.", "Ekonomik bakım alternatifi arayan işletmeler için ürün görünürlüğü sağlar.", ["ekonomik","balata"]),

  makeProduct("motor-yagi-5w30-4lt", "Ticari Araç Motor Yağı 5W-30 4 Litre", "Yağ & Sıvılar", 520, 48, "Uzun Motor Ömrü", "motor-yagi", "5W-30 motor yağı; ticari araç ve filo bakımı için ürün ilanı.", "Düşük viskozite sınıfında motor yağı ihtiyacı olan ticari araçlar için ürün ilanıdır.", ["motor yağı","5w30","4 litre"]),
  makeProduct("motor-yagi-5w30-10lt", "Ticari Araç Motor Yağı 5W-30 10 Litre", "Yağ & Sıvılar", 1180, 26, "Filo Bakımı", "motor-yagi", "10 litre 5W-30 motor yağı ürün ilanı.", "Filo ve servis bakım kullanımları için 10 litre motor yağı görünürlük ilanıdır.", ["motor yağı","5w30","10 litre"]),
  makeProduct("motor-yagi-5w30-20lt", "Ticari Araç Motor Yağı 5W-30 20 Litre", "Yağ & Sıvılar", 1850, 18, "Ekonomik Bidon", "motor-yagi", "20 litre 5W-30 motor yağı ürün ilanı.", "Yoğun bakım yapan işletmeler için 20 litre motor yağı ürün ilanıdır.", ["motor yağı","5w30","20 litre"]),
  makeProduct("motor-yagi-10w40-4lt", "Motor Yağı 10W-40 4 Litre", "Yağ & Sıvılar", 430, 52, "Geniş Kullanım", "motor-yagi", "10W-40 motor yağı; ticari araç bakım ürünü ilanı.", "Geniş kullanım alanına sahip 10W-40 motor yağı ürün ilanıdır.", ["motor yağı","10w40"]),
  makeProduct("motor-yagi-10w40-20lt", "Motor Yağı 10W-40 20 Litre", "Yağ & Sıvılar", 1640, 20, "Servis Kullanımı", "motor-yagi", "20 litre 10W-40 motor yağı ürün ilanı.", "Servis ve filo bakım noktaları için 20 litre motor yağı ilanıdır.", ["motor yağı","10w40","20 litre"]),
  makeProduct("motor-yagi-15w40-20lt", "Ağır Hizmet Motor Yağı 15W-40 20 Litre", "Yağ & Sıvılar", 1720, 15, "Ağır Hizmet", "motor-yagi", "15W-40 ağır hizmet motor yağı ürün ilanı.", "Ağır hizmet tipi ticari araçlar için motor yağı görünürlük ilanıdır.", ["15w40","ağır hizmet"]),
  makeProduct("motor-yagi-sentetik", "Tam Sentetik Motor Yağı", "Yağ & Sıvılar", 910, 32, "Tam Sentetik", "motor-yagi", "Tam sentetik motor yağı ürün ilanı.", "Modern ticari araç motorları için tam sentetik motor yağı görünürlük ilanıdır.", ["sentetik","motor yağı"]),
  makeProduct("motor-yagi-filo", "Filo Bakım Motor Yağı Paketi", "Yağ & Sıvılar", 2250, 14, "Filo Paketi", "motor-yagi", "Filo bakım operasyonları için motor yağı paket ilanı.", "Birden fazla araç bakımı için motor yağı tedarik görünürlüğü sağlar.", ["filo","motor yağı"]),
  makeProduct("sanziman-yagi", "Şanzıman Yağı", "Yağ & Sıvılar", 390, 35, "Aktarma Bakımı", "motor-yagi", "Ticari araç şanzıman yağı ürün ilanı.", "Aktarma organları bakımında kullanılabilecek şanzıman yağı ürün ilanıdır.", ["şanzıman yağı"]),
  makeProduct("diferansiyel-yagi", "Diferansiyel Yağı", "Yağ & Sıvılar", 410, 30, "Aktarma Bakımı", "motor-yagi", "Ticari araç diferansiyel yağı ürün ilanı.", "Diferansiyel bakım ihtiyacı olan araçlar için yağ ürün ilanıdır.", ["diferansiyel yağı"]),

  makeProduct("hava-filtresi-standart", "Hava Filtresi Standart Seri", "Bakım Ürünleri", 320, 60, "Yüksek Filtrasyon", "hava-filtresi", "Standart seri hava filtresi ürün ilanı.", "Ticari araç motor hava giriş kalitesini destekleyen hava filtresi ilanıdır.", ["hava filtresi","filtre"]),
  makeProduct("hava-filtresi-filo", "Filo Tipi Hava Filtresi", "Bakım Ürünleri", 360, 46, "Filo Kullanımı", "hava-filtresi", "Filo tipi hava filtresi ürün ilanı.", "Filo bakım süreçlerinde kullanılabilecek hava filtresi görünürlük ilanıdır.", ["hava filtresi","filo"]),
  makeProduct("hava-filtresi-agir-hizmet", "Ağır Hizmet Hava Filtresi", "Bakım Ürünleri", 430, 28, "Ağır Hizmet", "hava-filtresi", "Ağır hizmet hava filtresi ürün ilanı.", "Tozlu saha ve yoğun çalışma koşulları için hava filtresi ürün ilanıdır.", ["hava filtresi","ağır hizmet"]),
  makeProduct("yag-filtresi-standart", "Yağ Filtresi Standart Seri", "Bakım Ürünleri", 210, 75, "Motor Koruma", "yag-filtresi", "Standart seri yağ filtresi ürün ilanı.", "Motor bakım süreçlerinde kullanılabilecek yağ filtresi ilanıdır.", ["yağ filtresi"]),
  makeProduct("yag-filtresi-premium", "Premium Yağ Filtresi", "Bakım Ürünleri", 285, 42, "Premium Filtrasyon", "yag-filtresi", "Premium yağ filtresi ürün ilanı.", "Filtrasyon kalitesi arayan işletmeler için yağ filtresi ürün ilanıdır.", ["premium","yağ filtresi"]),
  makeProduct("yakit-filtresi-standart", "Yakıt Filtresi Standart Seri", "Bakım Ürünleri", 240, 58, "Yakıt Koruma", "yakit-filtresi", "Standart seri yakıt filtresi ürün ilanı.", "Yakıt sistemini korumaya yardımcı filtre ürün ilanıdır.", ["yakıt filtresi"]),
  makeProduct("yakit-filtresi-agir-hizmet", "Ağır Hizmet Yakıt Filtresi", "Bakım Ürünleri", 310, 34, "Ağır Hizmet", "yakit-filtresi", "Ağır hizmet yakıt filtresi ürün ilanı.", "Yoğun çalışan ticari araçların yakıt filtresi ihtiyacı için listelenmiştir.", ["yakıt filtresi","ağır hizmet"]),
  makeProduct("polen-filtresi", "Polen Filtresi", "Bakım Ürünleri", 180, 66, "Kabin Konforu", "hava-filtresi", "Kabin polen filtresi ürün ilanı.", "Araç içi hava kalitesini destekleyen polen filtresi ürün ilanıdır.", ["polen filtresi"]),
  makeProduct("filtre-bakim-seti", "Filtre Bakım Seti", "Bakım Ürünleri", 760, 25, "Set Ürün", "hava-filtresi", "Hava, yağ ve yakıt filtresi bakım seti ürün ilanı.", "Periyodik bakım için filtre seti görünürlük ilanıdır.", ["filtre seti","bakım seti"]),
  makeProduct("filo-filtre-paketi", "Filo Filtre Paketi", "Bakım Ürünleri", 1450, 18, "Filo Paketi", "hava-filtresi", "Filo bakımına uygun filtre paketi ürün ilanı.", "Birden fazla araç için filtre tedarik görünürlüğü sağlar.", ["filtre","filo"]),

  makeProduct("camurluk-on-sol", "Ticari Araç Ön Sol Çamurluk", "Araç Parçaları", 1450, 10, "Kaporta Parçası", "camurluk", "Ön sol çamurluk; ticari araç kaporta ürün ilanı.", "Ticari araç kaporta bakım ve onarım süreçleri için ön sol çamurluk ilanıdır.", ["çamurluk","ön sol","kaporta"]),
  makeProduct("camurluk-on-sag", "Ticari Araç Ön Sağ Çamurluk", "Araç Parçaları", 1450, 10, "Kaporta Parçası", "camurluk", "Ön sağ çamurluk; ticari araç kaporta ürün ilanı.", "Ticari araç kaporta bakım ve onarım süreçleri için ön sağ çamurluk ilanıdır.", ["çamurluk","ön sağ","kaporta"]),
  makeProduct("camurluk-arka-sol", "Ticari Araç Arka Sol Çamurluk", "Araç Parçaları", 1320, 9, "Kaporta Parçası", "camurluk", "Arka sol çamurluk ürün ilanı.", "Ticari araç arka kaporta onarım ihtiyaçları için çamurluk ilanıdır.", ["çamurluk","arka sol"]),
  makeProduct("camurluk-arka-sag", "Ticari Araç Arka Sağ Çamurluk", "Araç Parçaları", 1320, 9, "Kaporta Parçası", "camurluk", "Arka sağ çamurluk ürün ilanı.", "Ticari araç arka kaporta onarım ihtiyaçları için çamurluk ilanıdır.", ["çamurluk","arka sağ"]),
  makeProduct("camurluk-davlumbaz-on", "Ön Davlumbaz Çamurluk İçi", "Araç Parçaları", 520, 18, "Koruma Parçası", "camurluk", "Ön davlumbaz çamurluk içi ürün ilanı.", "Çamurluk içi koruma parçası ihtiyacı için ürün görünürlüğü sağlar.", ["davlumbaz","çamurluk"]),
  makeProduct("camurluk-davlumbaz-arka", "Arka Davlumbaz Çamurluk İçi", "Araç Parçaları", 540, 16, "Koruma Parçası", "camurluk", "Arka davlumbaz çamurluk içi ürün ilanı.", "Arka çamurluk iç koruma parçası ilanıdır.", ["davlumbaz","arka"]),
  makeProduct("camurluk-seti", "Çamurluk Seti Ön / Arka", "Araç Parçaları", 2850, 6, "Set Ürün", "camurluk", "Ön ve arka çamurluk seti ürün ilanı.", "Kaporta bakım ve yenileme süreçleri için set ürün ilanıdır.", ["çamurluk seti"]),
  makeProduct("paçalik-kaucuk", "Kauçuk Paçalık", "Araç Parçaları", 260, 40, "Saha Koruma", "camurluk", "Kauçuk paçalık ürün ilanı.", "Ticari araç çamurluk ve arka alan koruması için kauçuk paçalık ilanıdır.", ["paçalık","kauçuk"]),
  makeProduct("camurluk-klipsi", "Çamurluk Klipsi Takımı", "Araç Parçaları", 90, 120, "Montaj Parçası", "camurluk", "Çamurluk klipsi takımı ürün ilanı.", "Kaporta montaj işlemleri için klips takımı ilanıdır.", ["klips","çamurluk"]),
  makeProduct("kaporta-baglanti-seti", "Kaporta Bağlantı Seti", "Araç Parçaları", 340, 32, "Montaj Seti", "camurluk", "Kaporta bağlantı seti ürün ilanı.", "Kaporta parçalarının montajına yönelik bağlantı seti görünürlük ilanıdır.", ["kaporta","bağlantı"]),

  makeProduct("paspas-kaucuk-on", "Kauçuk Paspas Ön Set", "Bakım Ürünleri", 430, 36, "Kolay Temizlik", "paspas", "Ön kauçuk paspas seti ürün ilanı.", "Ticari araç iç kullanımına uygun kolay temizlenebilir paspas seti ilanıdır.", ["paspas","kauçuk"]),
  makeProduct("paspas-kaucuk-tam-set", "Kauçuk Paspas Tam Set", "Bakım Ürünleri", 680, 24, "Tam Set", "paspas", "Tam set kauçuk paspas ürün ilanı.", "Araç içi koruma için tam set paspas ürün ilanıdır.", ["paspas","tam set"]),
  makeProduct("paspas-havuzlu", "Havuzlu Araç Paspası", "Bakım Ürünleri", 790, 20, "Havuzlu Model", "paspas", "Havuzlu araç paspası ürün ilanı.", "Sıvı ve kir tutma özelliğiyle ticari araç iç koruması için ilan kaydıdır.", ["havuzlu paspas"]),
  makeProduct("paspas-filo-paketi", "Filo Paspas Paketi", "Bakım Ürünleri", 1850, 12, "Filo Paketi", "paspas", "Filo araçları için paspas paketi ürün ilanı.", "Birden fazla araç içi koruma ihtiyacı için paspas paketi ilanıdır.", ["paspas","filo"]),
  makeProduct("bagaj-havuzu", "Bagaj Havuzu", "Bakım Ürünleri", 620, 18, "İç Koruma", "paspas", "Bagaj havuzu ürün ilanı.", "Araç bagaj alanının korunması için ürün görünürlüğü sağlar.", ["bagaj havuzu"]),
  makeProduct("zemin-koruma-seti", "Araç Zemin Koruma Seti", "Bakım Ürünleri", 940, 14, "Koruma Seti", "paspas", "Araç zemin koruma seti ürün ilanı.", "Ticari araç iç zemin koruması için set ürün ilanıdır.", ["zemin koruma"]),
  makeProduct("silecek-on-set", "Ön Silecek Takımı", "Bakım Ürünleri", 260, 50, "Net Görüş", "silecek", "Ön silecek takımı ürün ilanı.", "Yağışlı havalarda görüş kalitesini destekleyen silecek takımı ilanıdır.", ["silecek"]),
  makeProduct("silecek-aerodinamik", "Aerodinamik Silecek Takımı", "Bakım Ürünleri", 340, 38, "Sessiz Çalışma", "silecek", "Aerodinamik silecek takımı ürün ilanı.", "Sessiz ve dengeli çalışma hedefleyen silecek ürün ilanıdır.", ["aerodinamik silecek"]),
  makeProduct("cam-suyu-kislik", "Kışlık Cam Suyu", "Yağ & Sıvılar", 120, 80, "Kışlık Kullanım", "antifriz", "Kışlık cam suyu ürün ilanı.", "Soğuk hava koşullarında cam temizliği için kışlık cam suyu ilanıdır.", ["cam suyu","kışlık"]),
  makeProduct("cam-suyu-yazlik", "Yazlık Cam Suyu", "Yağ & Sıvılar", 95, 90, "Yazlık Kullanım", "antifriz", "Yazlık cam suyu ürün ilanı.", "Yazlık kullanım için cam suyu ürün ilanıdır.", ["cam suyu","yazlık"]),

  makeProduct("far-on-sol", "Ön Sol Far", "Araç Parçaları", 1650, 8, "Aydınlatma", "far", "Ön sol far ürün ilanı.", "Ticari araç aydınlatma bakım ve değişim ihtiyacı için ön sol far ilanıdır.", ["far","ön sol"]),
  makeProduct("far-on-sag", "Ön Sağ Far", "Araç Parçaları", 1650, 8, "Aydınlatma", "far", "Ön sağ far ürün ilanı.", "Ticari araç aydınlatma bakım ve değişim ihtiyacı için ön sağ far ilanıdır.", ["far","ön sağ"]),
  makeProduct("far-mercekli", "Mercekli Far Grubu", "Araç Parçaları", 2200, 5, "Mercekli Model", "far", "Mercekli far grubu ürün ilanı.", "Aydınlatma performansı ve görünüm için mercekli far grubu ilanıdır.", ["mercekli far"]),
  makeProduct("sis-fari", "Sis Farı", "Araç Parçaları", 690, 20, "Sisli Hava", "far", "Sis farı ürün ilanı.", "Sisli ve düşük görüş koşulları için sis farı ürün ilanıdır.", ["sis farı"]),
  makeProduct("stop-lambasi-sol", "Sol Stop Lambası", "Araç Parçaları", 820, 14, "Arka Aydınlatma", "stop", "Sol stop lambası ürün ilanı.", "Ticari araç arka aydınlatma bakım ihtiyacı için stop lambası ilanıdır.", ["stop lambası","sol"]),
  makeProduct("stop-lambasi-sag", "Sağ Stop Lambası", "Araç Parçaları", 820, 14, "Arka Aydınlatma", "stop", "Sağ stop lambası ürün ilanı.", "Ticari araç arka aydınlatma bakım ihtiyacı için stop lambası ilanıdır.", ["stop lambası","sağ"]),
  makeProduct("sinyal-lambasi", "Sinyal Lambası", "Araç Parçaları", 310, 32, "Görünürlük", "stop", "Sinyal lambası ürün ilanı.", "Araç sinyal aydınlatma ihtiyacı için ürün görünürlüğü sağlar.", ["sinyal"]),
  makeProduct("plaka-lambasi", "Plaka Lambası", "Araç Parçaları", 140, 60, "Yasal Görünürlük", "stop", "Plaka lambası ürün ilanı.", "Araç plaka aydınlatma bakım ihtiyacı için ürün ilanıdır.", ["plaka lambası"]),
  makeProduct("led-ampul-seti", "LED Ampul Seti", "Araç Parçaları", 290, 44, "LED Aydınlatma", "far", "LED ampul seti ürün ilanı.", "Aydınlatma bakım ve yenileme işlemleri için LED ampul seti ilanıdır.", ["led ampul"]),
  makeProduct("far-temizleme-seti", "Far Temizleme Seti", "Bakım Ürünleri", 260, 34, "Bakım Seti", "far", "Far temizleme seti ürün ilanı.", "Far yüzeyi bakım ve temizlik ihtiyaçları için ürün ilanıdır.", ["far temizleme"]),

  makeProduct("aku-60ah", "Araç Aküsü 60 Ah", "Araç Parçaları", 2150, 10, "Güçlü Marş", "aku", "60 Ah araç aküsü ürün ilanı.", "Hafif ticari ve binek araç grupları için akü ürün ilanıdır.", ["akü","60 ah"]),
  makeProduct("aku-72ah", "Araç Aküsü 72 Ah", "Araç Parçaları", 2550, 9, "Güçlü Marş", "aku", "72 Ah araç aküsü ürün ilanı.", "Ticari araç marş gücü ihtiyacı için 72 Ah akü ilanıdır.", ["akü","72 ah"]),
  makeProduct("aku-90ah", "Araç Aküsü 90 Ah", "Araç Parçaları", 3350, 6, "Yüksek Kapasite", "aku", "90 Ah araç aküsü ürün ilanı.", "Yüksek kapasite ihtiyacı olan araçlar için akü ilanıdır.", ["akü","90 ah"]),
  makeProduct("aku-100ah", "Araç Aküsü 100 Ah", "Araç Parçaları", 3820, 5, "Yüksek Kapasite", "aku", "100 Ah araç aküsü ürün ilanı.", "Ticari araç ve yoğun kullanım için 100 Ah akü görünürlük ilanıdır.", ["akü","100 ah"]),
  makeProduct("takviye-kablosu", "Akü Takviye Kablosu", "Bakım Ürünleri", 390, 25, "Acil Yardım", "aku", "Akü takviye kablosu ürün ilanı.", "Servis ve saha operasyonlarında kullanılabilecek takviye kablosu ilanıdır.", ["takviye kablosu"]),
  makeProduct("aku-kutup-basi", "Akü Kutup Başı Takımı", "Araç Parçaları", 120, 70, "Bağlantı Parçası", "aku", "Akü kutup başı takımı ürün ilanı.", "Akü bağlantı ekipmanı ihtiyacı için ürün görünürlüğü sağlar.", ["akü kutup başı"]),
  makeProduct("amortisor-on-sol", "Ön Sol Amortisör", "Araç Parçaları", 1250, 11, "Sürüş Konforu", "amortisor", "Ön sol amortisör ürün ilanı.", "Ticari araç süspansiyon bakım ihtiyacı için ön sol amortisör ilanıdır.", ["amortisör","ön sol"]),
  makeProduct("amortisor-on-sag", "Ön Sağ Amortisör", "Araç Parçaları", 1250, 11, "Sürüş Konforu", "amortisor", "Ön sağ amortisör ürün ilanı.", "Ticari araç süspansiyon bakım ihtiyacı için ön sağ amortisör ilanıdır.", ["amortisör","ön sağ"]),
  makeProduct("amortisor-arka", "Arka Amortisör", "Araç Parçaları", 1190, 12, "Yol Tutuş", "amortisor", "Arka amortisör ürün ilanı.", "Arka süspansiyon bakım ve yenileme işlemleri için amortisör ilanıdır.", ["arka amortisör"]),
  makeProduct("amortisor-takozu", "Amortisör Takozu", "Araç Parçaları", 360, 30, "Montaj Parçası", "amortisor", "Amortisör takozu ürün ilanı.", "Süspansiyon bağlantı ve bakım ihtiyaçları için takoz ürün ilanıdır.", ["amortisör takozu"]),

  makeProduct("antifriz-kirmizi-3lt", "Kırmızı Antifriz 3 Litre", "Yağ & Sıvılar", 210, 62, "Soğutma Koruma", "antifriz", "3 litre kırmızı antifriz ürün ilanı.", "Motor soğutma sistemi koruması için kırmızı antifriz ilanıdır.", ["antifriz","kırmızı"]),
  makeProduct("antifriz-mavi-3lt", "Mavi Antifriz 3 Litre", "Yağ & Sıvılar", 205, 58, "Soğutma Koruma", "antifriz", "3 litre mavi antifriz ürün ilanı.", "Motor soğutma sistemi bakım ihtiyacı için mavi antifriz ilanıdır.", ["antifriz","mavi"]),
  makeProduct("fren-hidroligi", "Fren Hidroliği DOT 4", "Yağ & Sıvılar", 160, 70, "Fren Sistemi", "antifriz", "DOT 4 fren hidroliği ürün ilanı.", "Fren sistemi bakımında kullanılabilecek hidroliği ürün ilanıdır.", ["fren hidroliği","dot 4"]),
  makeProduct("direksiyon-yagi", "Direksiyon Yağı", "Yağ & Sıvılar", 190, 48, "Direksiyon Bakımı", "antifriz", "Direksiyon yağı ürün ilanı.", "Hidrolik direksiyon sistemi bakım ihtiyacı için ürün ilanıdır.", ["direksiyon yağı"]),
  makeProduct("balata-spreyi", "Fren Balata Temizleme Spreyi", "Bakım Ürünleri", 110, 90, "Hızlı Temizlik", "balata-spreyi", "Fren balata temizleme spreyi ürün ilanı.", "Servis bakım işlemlerinde kullanılabilecek balata temizleme spreyi ilanıdır.", ["balata spreyi"]),
  makeProduct("pas-sokucu", "Pas Sökücü Sprey", "Bakım Ürünleri", 95, 85, "Bakım Spreyi", "balata-spreyi", "Pas sökücü sprey ürün ilanı.", "Bakım ve servis operasyonlarında kullanılabilecek pas sökücü ürün ilanıdır.", ["pas sökücü"]),
  makeProduct("kontak-spreyi", "Kontak Spreyi", "Bakım Ürünleri", 125, 64, "Elektrik Bakımı", "balata-spreyi", "Kontak spreyi ürün ilanı.", "Elektrik bağlantı ve bakım işlemlerinde kullanılabilecek kontak spreyi ilanıdır.", ["kontak spreyi"]),
  makeProduct("gres-yagi", "Gres Yağı", "Yağ & Sıvılar", 240, 44, "Yağlama", "motor-yagi", "Gres yağı ürün ilanı.", "Servis ve mekanik bakım işlemleri için gres yağı ürün ilanıdır.", ["gres yağı"]),
  makeProduct("zincir-yagi", "Zincir Yağı", "Yağ & Sıvılar", 135, 50, "Yağlama", "motor-yagi", "Zincir yağı ürün ilanı.", "Mekanik hareketli parça bakımları için zincir yağı ilanıdır.", ["zincir yağı"]),
  makeProduct("temizlik-bezi", "Mikrofiber Temizlik Bezi", "Bakım Ürünleri", 75, 120, "Temizlik", "balata-spreyi", "Mikrofiber temizlik bezi ürün ilanı.", "Servis, araç içi ve yüzey temizliği için mikrofiber bez ilanıdır.", ["mikrofiber","temizlik"]),

  makeProduct("debreyaj-seti", "Debriyaj Seti", "Araç Parçaları", 2850, 7, "Aktarma Organı", "amortisor", "Debriyaj seti ürün ilanı.", "Ticari araç aktarma organları bakım ihtiyacı için debriyaj seti görünürlük ilanıdır.", ["debriyaj seti"]),
  makeProduct("triger-seti", "Triger Seti", "Araç Parçaları", 1750, 12, "Motor Bakımı", "motor-yagi", "Triger seti ürün ilanı.", "Motor periyodik bakım süreçlerinde kullanılabilecek triger seti ilanıdır.", ["triger seti"]),
  makeProduct("v-kayisi", "V Kayışı", "Araç Parçaları", 230, 45, "Motor Yardımcı", "motor-yagi", "V kayışı ürün ilanı.", "Motor yardımcı ekipman bakım ihtiyacı için V kayışı ilanıdır.", ["v kayışı"]),
  makeProduct("kayis-gergi-rulmani", "Kayış Gergi Rulmanı", "Araç Parçaları", 480, 22, "Motor Yardımcı", "motor-yagi", "Kayış gergi rulmanı ürün ilanı.", "Kayış sistemi bakım ve onarım ihtiyacı için rulman ürün ilanıdır.", ["gergi rulmanı"]),
  makeProduct("radyator", "Radyatör", "Araç Parçaları", 2650, 6, "Soğutma Sistemi", "antifriz", "Radyatör ürün ilanı.", "Motor soğutma sistemi onarım ihtiyacı için radyatör ürün ilanıdır.", ["radyatör"]),
  makeProduct("termostat", "Termostat", "Araç Parçaları", 420, 28, "Soğutma Sistemi", "antifriz", "Termostat ürün ilanı.", "Soğutma sistemi bakım ihtiyacı için termostat ürün ilanıdır.", ["termostat"]),
  makeProduct("su-pompasi", "Su Pompası", "Araç Parçaları", 980, 16, "Soğutma Sistemi", "antifriz", "Su pompası ürün ilanı.", "Motor soğutma sistemi için su pompası ürün görünürlüğü sağlar.", ["su pompası"]),
  makeProduct("ayna-sol", "Sol Dikiz Aynası", "Araç Parçaları", 890, 13, "Görüş Güvenliği", "camurluk", "Sol dikiz aynası ürün ilanı.", "Araç dış görüş güvenliği için sol dikiz aynası ilanıdır.", ["dikiz aynası","sol"]),
  makeProduct("ayna-sag", "Sağ Dikiz Aynası", "Araç Parçaları", 890, 13, "Görüş Güvenliği", "camurluk", "Sağ dikiz aynası ürün ilanı.", "Araç dış görüş güvenliği için sağ dikiz aynası ilanıdır.", ["dikiz aynası","sağ"]),
  makeProduct("tampon-on", "Ön Tampon", "Araç Parçaları", 2450, 5, "Kaporta Parçası", "camurluk", "Ön tampon ürün ilanı.", "Ticari araç kaporta yenileme ve onarım ihtiyacı için ön tampon ilanıdır.", ["ön tampon"]),
  makeProduct("tampon-arka", "Arka Tampon", "Araç Parçaları", 2280, 5, "Kaporta Parçası", "camurluk", "Arka tampon ürün ilanı.", "Ticari araç kaporta yenileme ve onarım ihtiyacı için arka tampon ilanıdır.", ["arka tampon"])
];

function getProducts(){
  try{
    const saved = JSON.parse(localStorage.getItem("sevra_products") || "[]");
    const all = [...SEVRA_DEFAULT_PRODUCTS, ...saved];
    const seen = new Set();
    return all.filter(p => {
      const key = p.id || sevraSlug(p.name);
      if(seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }catch(e){
    return SEVRA_DEFAULT_PRODUCTS;
  }
}

function saveCustomProducts(list){
  localStorage.setItem("sevra_products", JSON.stringify(list));
}

function moneyClean(v){
  return String(v || "").trim();
}

function contactUrl(p){
  const params = new URLSearchParams();
  params.set("konu", "urun-talebi");
  params.set("urun", p.name || "");
  params.set("kategori", p.category || "");
  return "basvuru.html?" + params.toString();
}

function productCard(p){
  const fallback = sevraFallbackImage(p.name, p.category);
  const img = p.image || fallback;
  return `<article class="product-card" data-category="${attrSafe(p.category)}">
    <div class="product-image">
      <img src="${attrSafe(img)}" alt="${attrSafe(p.name)}" loading="lazy" onerror="this.onerror=null;this.src='${fallback}'">
      <span class="badge">Yeni</span>
      <span class="bookmark">♡</span>
    </div>
    <div class="product-body">
      <span class="product-cat">${htmlSafe(p.category)}</span>
      <h2>${htmlSafe(p.name)}</h2>
      <p>${htmlSafe(p.short || p.desc || "")}</p>
      <div class="product-meta">
        <span><i class="dot"></i>${htmlSafe(p.status || "Stokta")}${p.stock ? " (" + htmlSafe(p.stock) + ")" : ""}</span>
        <span>♡ ${htmlSafe(p.feature || "SEVRA Kalitesi")}</span>
      </div>
      <div class="product-price">${htmlSafe(p.price || "Fiyat sorunuz")}</div>
      <div class="product-buttons">
        <button class="btn" onclick="openProduct('${attrSafe(p.id)}')">Detayları Gör</button>
        <a class="btn primary" href="${attrSafe(contactUrl(p))}">İletişime Geç</a>
      </div>
    </div>
  </article>`;
}

function renderCatalog(){
  const grid = document.getElementById("productGrid") || document.getElementById("productsGrid") || document.querySelector("[data-product-grid]");
  if(!grid) return;

  const q = (document.getElementById("searchInput")?.value || "").toLowerCase().trim();
  const cat = document.getElementById("categoryFilter")?.value || "Tümü";
  const sort = document.getElementById("sortFilter")?.value || "new";

  let list = getProducts().filter(p => {
    const text = [p.name, p.category, p.short, p.desc, (p.tags || []).join(" ")].join(" ").toLowerCase();
    const hit = !q || text.includes(q);
    const okcat = cat === "Tümü" || cat === "Tüm kategoriler" || p.category === cat;
    return hit && okcat;
  });

  if(sort === "az") list = list.sort((a,b)=>String(a.name).localeCompare(String(b.name), "tr"));
  if(sort === "stock") list = list.sort((a,b)=>(b.stock || 0) - (a.stock || 0));

  grid.innerHTML = list.map(productCard).join("") || `<div class="admin-card"><b>Sonuç bulunamadı.</b><p>Arama veya kategori seçimini değiştirin.</p></div>`;
  updateCounts();
}

function updateCounts(){
  const products = getProducts();
  document.querySelectorAll("[data-count-cat]").forEach(el => {
    const cat = el.getAttribute("data-count-cat");
    const n = cat === "Tümü" ? products.length : products.filter(p => p.category === cat).length;
    el.textContent = n;
  });

  const categoryMap = {
    "Araç Parçaları": products.filter(p => p.category === "Araç Parçaları").length,
    "Yağ & Sıvılar": products.filter(p => p.category === "Yağ & Sıvılar").length,
    "Bakım Ürünleri": products.filter(p => p.category === "Bakım Ürünleri").length
  };

  document.querySelectorAll(".cat").forEach(btn => {
    const cat = btn.dataset.cat;
    const badge = btn.querySelector("span, b, small");
    if(badge && cat){
      badge.textContent = cat === "Tümü" ? products.length : (categoryMap[cat] || 0);
    }
  });
}

function setCategory(cat){
  const sel = document.getElementById("categoryFilter");
  if(sel) sel.value = cat;
  document.querySelectorAll(".cat").forEach(b => b.classList.toggle("active", b.dataset.cat === cat));
  renderCatalog();
}

function openProduct(id){
  const p = getProducts().find(x => x.id === id);
  if(!p) return;

  const fallback = sevraFallbackImage(p.name, p.category);
  const modal = document.getElementById("productModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  if(!modal || !modalTitle || !modalBody){
    alert(`${p.name}\n\n${p.desc || p.short || ""}\n\nFiyat: ${p.price || "Fiyat sorunuz"}`);
    return;
  }

  modalTitle.textContent = p.name;
  modalBody.innerHTML = `<div class="modal-content">
    <img src="${attrSafe(p.image || fallback)}" alt="${attrSafe(p.name)}" onerror="this.onerror=null;this.src='${fallback}'">
    <div>
      <span class="product-cat">${htmlSafe(p.category)}</span>
      <p>${htmlSafe(p.desc || p.short || "")}</p>
      <table class="detail-table">
        <tr><td>Durum</td><td>${htmlSafe(p.status || "Stokta")}</td></tr>
        <tr><td>Stok</td><td>${htmlSafe(p.stock || 0)}</td></tr>
        <tr><td>Fiyat</td><td>${htmlSafe(p.price || "Fiyat sorunuz")}</td></tr>
        <tr><td>Etiketler</td><td>${htmlSafe((p.tags || []).join(", "))}</td></tr>
      </table>
      <div class="product-buttons">
        <a class="btn primary" href="${attrSafe(contactUrl(p))}">İletişime Geç</a>
        <button class="btn" onclick="closeModal()">Kapat</button>
      </div>
    </div>
  </div>`;
  modal.style.display = "flex";
}

function closeModal(){
  const modal = document.getElementById("productModal");
  if(modal) modal.style.display = "none";
}

function buildCategoryOptions(selected){
  const cats = ["Araç Parçaları","Yağ & Sıvılar","Bakım Ürünleri","Aksesuar","Diğer"];
  return cats.map(c => `<option ${selected === c ? "selected" : ""}>${htmlSafe(c)}</option>`).join("");
}

function renderAdmin(){
  const form = document.getElementById("productForm");
  if(!form) return;

  const cat = document.getElementById("productCategory");
  if(cat) cat.innerHTML = buildCategoryOptions("Araç Parçaları");

  renderPreview();
  renderSavedList();
  form.addEventListener("input", renderPreview);

  const file = document.getElementById("productImageFile");
  if(file){
    file.addEventListener("change", function(){
      const f = file.files && file.files[0];
      if(!f) return;
      const reader = new FileReader();
      reader.onload = () => {
        const imageData = document.getElementById("imageData");
        if(imageData) imageData.value = reader.result;
        renderPreview();
      };
      reader.readAsDataURL(f);
    });
  }
}

function formProduct(){
  const name = document.getElementById("productName")?.value.trim() || "Yeni Ürün";
  const category = document.getElementById("productCategory")?.value || "Araç Parçaları";
  return {
    id: "urun-" + Date.now(),
    name,
    category,
    price: moneyClean(document.getElementById("productPrice")?.value) || "Fiyat sorunuz",
    stock: Number(document.getElementById("productStock")?.value || 0),
    status: document.getElementById("productStatus")?.checked ? "Stokta" : "Stok Yok",
    feature: document.getElementById("productFeature")?.value.trim() || "SEVRA Kalitesi",
    image: document.getElementById("imageData")?.value || sevraFallbackImage(name, category),
    short: document.getElementById("productShort")?.value.trim() || "",
    desc: document.getElementById("productDesc")?.value.trim() || "",
    tags: (document.getElementById("productTags")?.value || "").split(",").map(x => x.trim()).filter(Boolean)
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

  const form = document.getElementById("productForm");
  if(form) form.reset();

  const imageData = document.getElementById("imageData");
  if(imageData) imageData.value = "";

  const cat = document.getElementById("productCategory");
  if(cat) cat.innerHTML = buildCategoryOptions("Araç Parçaları");

  renderPreview();
  renderSavedList();
  alert("Ürün bu tarayıcıya kaydedildi. Canlı sitede herkese görünmesi için Firebase/backend bağlantısı gerekir.");
}

function renderSavedList(){
  const box = document.getElementById("savedProducts");
  if(!box) return;

  const custom = JSON.parse(localStorage.getItem("sevra_products") || "[]");
  box.innerHTML = custom.map((p,i) => `<div class="product-row">
    <img src="${attrSafe(p.image || sevraFallbackImage(p.name, p.category))}" alt="${attrSafe(p.name)}">
    <div><div class="row-title">${htmlSafe(p.name)}</div><div class="row-sub">${htmlSafe(p.category)} • ${htmlSafe(p.price)} • ${htmlSafe(p.status)}</div></div>
    <button class="delete-btn" onclick="deleteProduct(${i})">Sil</button>
  </div>`).join("") || `<div class="notice">Henüz sonradan eklenmiş ürün yok. Ana katalogda 100 başlangıç ürünü yayına hazırdır.</div>`;
}

function deleteProduct(i){
  const custom = JSON.parse(localStorage.getItem("sevra_products") || "[]");
  custom.splice(i, 1);
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
      if(!Array.isArray(arr)) throw new Error("Liste değil");
      saveCustomProducts(arr);
      renderSavedList();
      renderCatalog();
      alert("Ürün listesi içe aktarıldı.");
    }catch(e){
      alert("JSON dosyası okunamadı.");
    }
  };
  r.readAsText(f, "utf-8");
}

document.addEventListener("DOMContentLoaded", () => {
  renderCatalog();
  renderAdmin();

  const s = document.getElementById("searchInput");
  if(s) s.addEventListener("input", renderCatalog);

  const c = document.getElementById("categoryFilter");
  if(c) c.addEventListener("change", renderCatalog);

  const sort = document.getElementById("sortFilter");
  if(sort) sort.addEventListener("change", renderCatalog);
});
