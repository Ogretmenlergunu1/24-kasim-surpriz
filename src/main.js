import './style.css';
import * as THREE from 'three';

// 1. Sahneyi oluşturuyoruz
const scene = new THREE.Scene();
scene.background = new THREE.Color('#17121b');

// 2. Kamerayı yerleştiriyoruz
const camera = new THREE.PerspectiveCamera(
  65,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.7, 7);
camera.lookAt(0, 1.8, 0);

// 3. Görüntü motorunu hazırlıyoruz
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.outputColorSpace = THREE.SRGBColorSpace;

document.body.appendChild(renderer.domElement);

// Malzeme oluşturmak için yardımcı fonksiyon
function material(color, metalness = 0) {
  return new THREE.MeshStandardMaterial({
    color,
    metalness,
    roughness: 0.55
  });
}

// 4. Müzenin zeminini oluşturuyoruz
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(14, 18),
  material('#403640')
);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;
scene.add(floor);

 // Mermer zemin için desen oluşturuyoruz
const marbleCanvas = document.createElement('canvas');
marbleCanvas.width = 512;
marbleCanvas.height = 512;

const marbleContext = marbleCanvas.getContext('2d');

// Koyu mermer zemini
marbleContext.fillStyle = '#24232a';
marbleContext.fillRect(0, 0, 512, 512);

// İnce mermer damarları
for (let i = 0; i < 55; i++) {
  const x = Math.random() * 512;
  const y = Math.random() * 512;

  marbleContext.beginPath();
  marbleContext.moveTo(x, y);

  marbleContext.bezierCurveTo(
    x + 35, y - 25,
    x - 20, y + 65,
    x + 100, y + 120
  );

  marbleContext.strokeStyle =
    Math.random() > 0.5
      ? 'rgba(220, 215, 205, 0.12)'
      : 'rgba(180, 150, 110, 0.10)';

  marbleContext.lineWidth = Math.random() * 1.5 + 0.3;
  marbleContext.stroke();
}

// Deseni 3D zemine uyguluyoruz
const marbleTexture = new THREE.CanvasTexture(marbleCanvas);

marbleTexture.wrapS = THREE.RepeatWrapping;
marbleTexture.wrapT = THREE.RepeatWrapping;
marbleTexture.repeat.set(3, 4);
marbleTexture.colorSpace = THREE.SRGBColorSpace;

floor.material = new THREE.MeshStandardMaterial({
  map: marbleTexture,
  roughness: 0.28,
  metalness: 0.15
});

// Duvar oluşturma fonksiyonu
function wall(width, height, depth, x, y, z, color) {
  const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    material(color)
  );
  mesh.position.set(x, y, z);
  mesh.receiveShadow = true;
  scene.add(mesh);
}

// 5. Bordo müze duvarları
wall(14, 6, 0.3, 0, 3, -2, '#542635');
wall(0.3, 6, 18, -7, 3, 0, '#542635');
// Sağ duvar — kapı tablodan daha ileride
wall(0.3, 6, 11, 7, 3, -3.5, '#542635');
wall(0.3, 6, 3, 7, 3, 7.5, '#542635');

// Kapının üzerindeki duvar
wall(0.3, 1.5, 4, 7, 5.25, 4, '#542635');

 // İkinci salon kapısının altın çerçevesi
const secondDoorGold = new THREE.MeshStandardMaterial({
  color: '#c59a4a',
  metalness: 0.65,
  roughness: 0.3
});

function secondDoorFrame(width, height, depth, x, y, z) {
  const piece = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    secondDoorGold
  );

  piece.position.set(x, y, z);
  scene.add(piece);
}

// Kapının iki yanındaki dikey altın sütun
secondDoorFrame(0.35, 4.5, 0.18, 6.8, 2.25, 2);
secondDoorFrame(0.35, 4.5, 0.18, 6.8, 2.25, 6);

// Kapının üzerindeki yatay altın bölüm
secondDoorFrame(0.35, 0.3, 4.35, 6.8, 4.5, 4);

 // İkinci salonun ahşap çift kapısı
const secondDoorWood = new THREE.MeshStandardMaterial({
  color: '#48251e',
  roughness: 0.65,
  metalness: 0.1
});

// Kapı kanatlarını ayrı gruplarda tutuyoruz
// Böylece daha sonra menteşelerinden açılabilecekler
const secondDoorLeft = new THREE.Group();
const secondDoorRight = new THREE.Group();

secondDoorLeft.position.set(6.8, 0, 2);
secondDoorRight.position.set(6.8, 0, 6);

scene.add(secondDoorLeft);
scene.add(secondDoorRight);

// Kapı kanatları
const leftDoorPanel = new THREE.Mesh(
  new THREE.BoxGeometry(0.16, 4.35, 1.95),
  secondDoorWood
);
leftDoorPanel.position.set(0, 2.175, 0.975);
secondDoorLeft.add(leftDoorPanel);

const rightDoorPanel = new THREE.Mesh(
  new THREE.BoxGeometry(0.16, 4.35, 1.95),
  secondDoorWood
);
rightDoorPanel.position.set(0, 2.175, -0.975);
secondDoorRight.add(rightDoorPanel);

// Kapıların üzerindeki altın süslemeler
const secondDoorDetailGold = new THREE.MeshStandardMaterial({
  color: '#d7ad62',
  metalness: 0.8,
  roughness: 0.25
});

function addSecondDoorDecoration(doorGroup, zOffset) {
  const decoration = new THREE.Mesh(
    new THREE.BoxGeometry(0.025, 3.4, 1.35),
    secondDoorDetailGold
  );

  decoration.position.set(-0.095, 2.2, zOffset);
  doorGroup.add(decoration);

  const innerPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.035, 3.28, 1.23),
    secondDoorWood
  );

  innerPanel.position.set(0.12, 2.2, zOffset);
  doorGroup.add(innerPanel);
}
addSecondDoorDecoration(secondDoorLeft, 0.975);
addSecondDoorDecoration(secondDoorRight, -0.975);
// İkinci salon kapılarının açılma animasyonu
let secondDoorsOpening = false;
let secondDoorProgress = 0;
// İkinci salona geçiş butonu
const secondRoomButton = document.createElement('button');// FİNAL SALONUNA GEÇİŞ BUTONU

const finalRoomButton = document.createElement('button');

finalRoomButton.textContent = 'Final Salonuna Geç →';
finalRoomButton.id = 'finalRoomButton';
finalRoomButton.style.cssText = `
  position: fixed;
  bottom: 35px;
  right: 35px;
  padding: 14px 24px;
  background: #241714;
  color: #f2d8a4;
  border: 1px solid #c59a4a;
  border-radius: 30px;
  font-family: Georgia, serif;
  font-size: 16px;
  cursor: pointer;
  z-index: 100;
  display: none;
`;
// Telefon ekranında final salonu butonunun konumu
const mobileFinalRoomStyle = document.createElement('style');

mobileFinalRoomStyle.textContent = `
  @media (max-width: 600px) {
    #finalRoomButton {
      bottom: 15px !important;
      right: 50% !important;
      transform: translateX(50%) !important;
      font-size: 14px !important;
      padding: 12px 20px !important;
    }
  }
`;

document.head.appendChild(mobileFinalRoomStyle);

document.body.appendChild(finalRoomButton);
// Final salonu butonuna tıklanınca
finalRoomButton.addEventListener('click', () => {
  startFinalDoorTransition();
});
secondRoomButton.textContent = 'İkinci Salona Geç →';
secondRoomButton.id = 'secondRoomButton';
secondRoomButton.style.cssText = `
  position: fixed;
  bottom: 35px;
  right: 35px;
  padding: 14px 24px;
  background: #241714;
  color: #f2d8a4;
  border: 1px solid #c59a4a;
  border-radius: 30px;
  font-family: Georgia, serif;
  font-size: 16px;
  cursor: pointer;
  z-index: 100;
  display: none;
`;
// Telefon ekranında ikinci salon butonunun konumu
const mobileSecondRoomStyle = document.createElement('style');

mobileSecondRoomStyle.textContent = `
  @media (max-width: 600px) {
    #secondRoomButton {
      bottom: 15px !important;
      right: 50% !important;
      transform: translateX(50%) !important;
      font-size: 14px !important;
      padding: 12px 20px !important;
    }
  }
`;

document.head.appendChild(mobileSecondRoomStyle);
document.body.appendChild(secondRoomButton);

secondRoomButton.addEventListener('click', () => {
  openSecondDoors();
  moveCameraToSecondDoor();

  secondRoomButton.style.display = 'none';
  inspectButton.style.display = 'none';
});
function openSecondDoors() {
  secondDoorProgress = 0;
  secondDoorsOpening = true;
}

function animateSecondDoors() {
  if (!secondDoorsOpening) return;

  secondDoorProgress += 0.012;

  if (secondDoorProgress >= 1) {
    secondDoorProgress = 1;
    secondDoorsOpening = false;
  }

  const smooth = secondDoorProgress * secondDoorProgress *
    (3 - 2 * secondDoorProgress);

  secondDoorLeft.rotation.y = smooth * 1.4;
  secondDoorRight.rotation.y = -smooth * 1.4;
}
// İkinci salon kapısına kamera geçişi
let movingToSecondDoor = false;
let secondDoorCameraProgress = 0;

const secondDoorCameraStart = new THREE.Vector3();
const secondDoorLookStart = new THREE.Vector3();

const secondDoorCameraEnd = new THREE.Vector3(3.5, 2.8, 4);
const secondDoorLookEnd = new THREE.Vector3(7, 2.8, 4);
// Açık kapıdan ikinci salona geçiş
let enteringSecondRoom = false;
let secondRoomEntryProgress = 0;

const secondRoomEntryStart = new THREE.Vector3(3.5, 2.8, 4);
const secondRoomEntryEnd = new THREE.Vector3(9.5, 2.8, 4);
// Üçüncü tabloya kamera geçişi
let movingToThirdPainting = false;
let thirdPaintingProgress = 0;

const thirdCameraStart = new THREE.Vector3();
const thirdLookStart = new THREE.Vector3();

const thirdCameraEnd = new THREE.Vector3(12.5, 2.8, 1.5);
const thirdLookEnd = new THREE.Vector3(17.75, 2.8, 1.5);
// DÖRDÜNCÜ TABLOYA KAMERA GEÇİŞİ

let movingToFourthPainting = false;
let fourthPaintingProgress = 0;

const fourthCameraStart = new THREE.Vector3();
const fourthLookStart = new THREE.Vector3();

// Dördüncü tablonun karşısında duracağımız konum
const fourthCameraEnd = new THREE.Vector3(12.5, 2.8, 6.5);

// Kameranın bakacağı nokta
const fourthLookEnd = new THREE.Vector3(17.75, 2.8, 6.5);
// FİNAL SALONUNUN KAPISINA KAMERA GEÇİŞİ

let movingToFinalDoor = false;
let finalDoorProgress = 0;

const finalDoorCameraStart = new THREE.Vector3();
const finalDoorLookStart = new THREE.Vector3();

// Kameranın kapıyı karşıdan göreceği nokta
const finalDoorCameraEnd = new THREE.Vector3(13.25, 2.5, 6.5);

// Kapının tam ortası
const finalDoorLookEnd = new THREE.Vector3(13.25, 2.5, 11);
// FİNAL SALONUNA KAMERA GİRİŞİ

let enteringFinalRoom = false;
let finalRoomEntryProgress = 0;

const finalRoomEntryStart = new THREE.Vector3();
const finalRoomLookStart = new THREE.Vector3();

// Kapının ötesinde, final salonunun içinde
const finalRoomEntryEnd = new THREE.Vector3(13.25, 2.5, 15);

// Kamera salonun içine doğru bakacak
const finalRoomLookEnd = new THREE.Vector3(13.25, 2.5, 20);
// KASIMPATILAR TABLOSUNA KAMERA YAKLAŞMASI

let movingToFinalPainting = false;
let finalPaintingProgress = 0;

const finalPaintingCameraStart = new THREE.Vector3();
const finalPaintingLookStart = new THREE.Vector3();

// Büyük tablonun karşısında duracağımız nokta
const finalPaintingCameraEnd = new THREE.Vector3(13.25, 3.1, 17.5);

// Kameranın bakacağı nokta: tablonun merkezi
const finalPaintingLookEnd = new THREE.Vector3(13.25, 3.1, 24.75);

function startFinalPaintingTransition() {
  finalPaintingCameraStart.copy(camera.position);

  camera.getWorldDirection(finalPaintingLookStart);
  finalPaintingLookStart.multiplyScalar(5).add(camera.position);

  finalPaintingProgress = 0;
  movingToFinalPainting = true;
}
function startFinalRoomEntry() {
  finalRoomEntryStart.copy(camera.position);

  camera.getWorldDirection(finalRoomLookStart);
  finalRoomLookStart.multiplyScalar(5).add(camera.position);

  finalRoomEntryProgress = 0;
  enteringFinalRoom = true;
}
function startFinalDoorTransition() {
  finalDoorCameraStart.copy(camera.position);

  camera.getWorldDirection(finalDoorLookStart);
  finalDoorLookStart.multiplyScalar(5).add(camera.position);

  finalDoorProgress = 0;
  movingToFinalDoor = true;

  // Kamera hareket ederken butonları gizle
  finalRoomButton.style.display = 'none';
  inspectButton.style.display = 'none';
}
function startFourthPaintingTransition() {
  // Kameranın bulunduğu konumu kaydet
  fourthCameraStart.copy(camera.position);

  // Kameranın baktığı yönü kaydet
  camera.getWorldDirection(fourthLookStart);
  fourthLookStart.multiplyScalar(5).add(camera.position);

  // Geçişi başlat
  fourthPaintingProgress = 0;
  movingToFourthPainting = true;
}
function startThirdPaintingTransition() {
  thirdCameraStart.copy(camera.position);

  camera.getWorldDirection(thirdLookStart);
  thirdLookStart.multiplyScalar(5).add(camera.position);

  thirdPaintingProgress = 0;
  movingToThirdPainting = true;
}
function enterSecondRoom() {
  secondRoomEntryProgress = 0;
  enteringSecondRoom = true;
}
function moveCameraToSecondDoor() {
  secondDoorCameraStart.copy(camera.position);

  camera.getWorldDirection(secondDoorLookStart);
  secondDoorLookStart.multiplyScalar(5).add(camera.position);

  secondDoorCameraProgress = 0;
  movingToSecondDoor = true;
}
// İKİNCİ SALON — Öğretmenliğin İzleri

// Mermer zemin
const secondRoomFloor = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 14),
  new THREE.MeshStandardMaterial({
    color: '#d8cbb5',
    roughness: 0.35,
    metalness: 0.1,
    side: THREE.DoubleSide
  })
);

secondRoomFloor.rotation.x = -Math.PI / 2;
secondRoomFloor.position.set(12, 0.02, 4);

scene.add(secondRoomFloor);
// FİNAL SALONU — KASIMIN ARMAĞANI

// Final salonunun mermer zemini
const finalRoomFloor = new THREE.Mesh(
  new THREE.PlaneGeometry(12, 14),
  new THREE.MeshStandardMaterial({
    color: '#e5d8c3',
    roughness: 0.28,
    metalness: 0.12,
    side: THREE.DoubleSide
  })
);

finalRoomFloor.rotation.x = -Math.PI / 2;

// Final kapısının arkasında, z = 11 ile z = 25 arasında
finalRoomFloor.position.set(13.25, 0.02, 18);

scene.add(finalRoomFloor);
// FİNAL SALONUNUN DUVARLARI

// Büyük kasımpatı tablosunun asılacağı karşı duvar
wall(12, 6, 0.3, 13.25, 3, 25, '#542635');

// Sol yan duvar
wall(0.3, 6, 14, 7.25, 3, 18, '#542635');

// Sağ yan duvar
wall(0.3, 6, 14, 19.25, 3, 18, '#542635');
// FİNAL SALONUNUN SICAK AYDINLATMASI

const finalRoomLight = new THREE.PointLight(
  '#ffe0ad',
  80,
  20
);

finalRoomLight.position.set(13.25, 4.8, 19);

scene.add(finalRoomLight);
// FİNAL SALONUNUN ALTIN DUVAR SÜSLEMELERİ

const finalRoomGold = new THREE.MeshStandardMaterial({
  color: '#c59a4a',
  metalness: 0.7,
  roughness: 0.3
});

function addFinalRoomTrim(width, height, depth, x, y, z) {
  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    finalRoomGold
  );

  trim.position.set(x, y, z);
  scene.add(trim);
}

// Karşı duvar — alt ve üst şeritler
addFinalRoomTrim(12, 0.07, 0.08, 13.25, 0.55, 24.8);
addFinalRoomTrim(12, 0.09, 0.08, 13.25, 5.35, 24.8);

// Sol duvar — alt ve üst şeritler
addFinalRoomTrim(0.08, 0.07, 14, 7.45, 0.55, 18);
addFinalRoomTrim(0.08, 0.09, 14, 7.45, 5.35, 18);

// Sağ duvar — alt ve üst şeritler
addFinalRoomTrim(0.08, 0.07, 14, 19.05, 0.55, 18);
addFinalRoomTrim(0.08, 0.09, 14, 19.05, 5.35, 18);
// FİNAL ESERİ — KASIMPATILAR

const finalPaintingGroup = new THREE.Group();

// Karşı duvarın tam ortası
finalPaintingGroup.position.set(13.25, 3.1, 24.75);

scene.add(finalPaintingGroup);

// Kasımpatılar görseli
const finalPaintingTexture = new THREE.TextureLoader().load(
  `${import.meta.env.BASE_URL}kasimpatilar.png`
);

finalPaintingTexture.colorSpace = THREE.SRGBColorSpace;

// Büyük final tablosu
const finalPainting = new THREE.Mesh(
  new THREE.PlaneGeometry(7.5, 4.2),
  new THREE.MeshStandardMaterial({
    map: finalPaintingTexture,
    roughness: 0.85,
    side: THREE.DoubleSide
  })
);

finalPainting.position.z = -0.03;

finalPaintingGroup.add(finalPainting);
// KASIMPATILAR TABLOSUNA ÖZEL AYDINLATMA

const finalPaintingLight = new THREE.SpotLight(
  '#ffe0b0',
  12,
  12,
  Math.PI / 4,
  0.7,
  1
);

// Işık tablonun önünde ve biraz yukarıda
finalPaintingLight.position.set(13.25, 5.5, 19);

// Işığın hedefi tablonun merkezi
finalPaintingLight.target.position.set(13.25, 3.1, 24.75);

scene.add(finalPaintingLight);
scene.add(finalPaintingLight.target);
// İKİNCİ SALON — Bordo duvarlar

// Salonun arka duvarı
wall(0.3, 6, 14, 18, 3, 4, '#542635');

// Salonun ön duvarı
wall(12, 6, 0.3, 12, 3, -3, '#542635');

// Salonun diğer yan duvarı
// Final salonuna açılan kapı için boşluklu yan duvar

// Kapının solundaki duvar
wall(5, 6, 0.3, 9.5, 3, 11, '#542635');

// Kapının sağındaki duvar
wall(3.5, 6, 0.3, 16.25, 3, 11, '#542635');

// Kapının üstündeki duvar
wall(2.5, 1.5, 0.3, 13.25, 5.25, 11, '#542635');
// FİNAL SALONUNUN ÇİFT KANATLI KAPISI

const finalDoorMaterial = new THREE.MeshStandardMaterial({
  color: '#301b19',
  roughness: 0.45,
  metalness: 0.15
});

const finalDoorGold = new THREE.MeshStandardMaterial({
  color: '#d6ae62',
  metalness: 0.8,
  roughness: 0.25
});

// Kapı kanatlarının döneceği gruplar
const finalLeftDoor = new THREE.Group();
finalLeftDoor.position.set(12, 0, 11);
scene.add(finalLeftDoor);

const finalRightDoor = new THREE.Group();
finalRightDoor.position.set(14.5, 0, 11);
scene.add(finalRightDoor);

// Sol kapı kanadı
const finalLeftPanel = new THREE.Mesh(
  new THREE.BoxGeometry(1.25, 4.5, 0.12),
  finalDoorMaterial
);
finalLeftPanel.position.set(0.625, 2.25, 0);
finalLeftDoor.add(finalLeftPanel);

// Sağ kapı kanadı
const finalRightPanel = new THREE.Mesh(
  new THREE.BoxGeometry(1.25, 4.5, 0.12),
  finalDoorMaterial
);
finalRightPanel.position.set(-0.625, 2.25, 0);
finalRightDoor.add(finalRightPanel);

// Kapıların altın süslemeleri
function addFinalDoorDecoration(door, x) {
  const goldBorder = new THREE.Mesh(
    new THREE.BoxGeometry(0.85, 3.7, 0.035),
    finalDoorGold
  );

  goldBorder.position.set(x, 2.25, -0.08);
  door.add(goldBorder);

  const innerPanel = new THREE.Mesh(
    new THREE.BoxGeometry(0.76, 3.61, 0.045),
    finalDoorMaterial
  );

  innerPanel.position.set(x, 2.25, -0.105);
  door.add(innerPanel);
}

addFinalDoorDecoration(finalLeftDoor, 0.625);
addFinalDoorDecoration(finalRightDoor, -0.625);
// Final kapısının altın kulpları
const finalHandleGeometry = new THREE.SphereGeometry(0.09, 16, 16);

const finalLeftHandle = new THREE.Mesh(
  finalHandleGeometry,
  finalDoorGold
);
finalLeftHandle.position.set(1.1, 2.2, -0.14);
finalLeftDoor.add(finalLeftHandle);

const finalRightHandle = new THREE.Mesh(
  finalHandleGeometry,
  finalDoorGold
);
finalRightHandle.position.set(-1.1, 2.2, -0.14);
finalRightDoor.add(finalRightHandle);
// FİNAL KAPISININ AÇILMA ANİMASYONU

let openingFinalDoors = false;
let finalDoorsProgress = 0;

function openFinalDoors() {
  finalDoorsProgress = 0;
  openingFinalDoors = true;
}
// İKİNCİ SALON — Altın duvar süslemeleri

const secondRoomGold = new THREE.MeshStandardMaterial({
  color: '#c59a4a',
  metalness: 0.7,
  roughness: 0.3
});

function addSecondRoomTrim(width, height, depth, x, y, z) {
  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    secondRoomGold
  );

  trim.position.set(x, y, z);
  scene.add(trim);
}

// Karşı duvardaki yatay altın şeritler
addSecondRoomTrim(0.08, 0.07, 14, 17.8, 0.55, 4);
addSecondRoomTrim(0.08, 0.09, 14, 17.8, 5.35, 4);

// Yan duvarlardaki altın şeritler
addSecondRoomTrim(12, 0.07, 0.08, 12, 0.55, -2.8);
addSecondRoomTrim(12, 0.09, 0.08, 12, 5.35, -2.8);

addSecondRoomTrim(12, 0.07, 0.08, 12, 0.55, 10.8);
addSecondRoomTrim(12, 0.09, 0.08, 12, 5.35, 10.8);
// İKİNCİ SALON — Sıcak müze aydınlatması

const secondRoomLight = new THREE.PointLight(
  '#ffe0ad',
  65,
  18
);

secondRoomLight.position.set(12, 4.8, 4);
scene.add(secondRoomLight);
// ÜÇÜNCÜ ESER — Bir İz Bırakmak

const thirdPaintingGroup = new THREE.Group();

// İkinci salonun karşı duvarı
thirdPaintingGroup.position.set(17.75, 2.8, 1.5);

// Tablo kameraya dönük olacak
thirdPaintingGroup.rotation.y = -Math.PI / 2;

scene.add(thirdPaintingGroup);

// Tablo görseli
const thirdTexture = new THREE.TextureLoader().load(
  `${import.meta.env.BASE_URL}ucuncu-tablo.png`
);

thirdTexture.colorSpace = THREE.SRGBColorSpace;

const thirdPainting = new THREE.Mesh(
  new THREE.PlaneGeometry(3.2, 2.3),
  new THREE.MeshStandardMaterial({
    map: thirdTexture,
    roughness: 0.85,
    side: THREE.DoubleSide
  })
);

thirdPainting.position.z = 0.03;
thirdPaintingGroup.add(thirdPainting);
// Üçüncü tablonun isim levhası
const thirdPlaqueCanvas = document.createElement('canvas');
thirdPlaqueCanvas.width = 1024;
thirdPlaqueCanvas.height = 256;

const thirdPlaqueContext = thirdPlaqueCanvas.getContext('2d');

// Koyu bordo zemin
thirdPlaqueContext.fillStyle = '#241714';
thirdPlaqueContext.fillRect(0, 0, 1024, 256);

// İnce altın kenarlık
thirdPlaqueContext.strokeStyle = '#c59a4a';
thirdPlaqueContext.lineWidth = 8;
thirdPlaqueContext.strokeRect(12, 12, 1000, 232);

// Eserin adı
thirdPlaqueContext.fillStyle = '#f2d8a4';
thirdPlaqueContext.font = '58px Georgia';
thirdPlaqueContext.textAlign = 'center';
thirdPlaqueContext.textBaseline = 'middle';
thirdPlaqueContext.fillText('Bir İz Bırakmak', 512, 128);

// Levhayı 3D nesneye dönüştürüyoruz
const thirdPlaqueTexture = new THREE.CanvasTexture(thirdPlaqueCanvas);
thirdPlaqueTexture.colorSpace = THREE.SRGBColorSpace;

const thirdPlaque = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 0.55),
  new THREE.MeshBasicMaterial({
    map: thirdPlaqueTexture,
    side: THREE.DoubleSide
  })
);

// Tablonun altına yerleştiriyoruz
thirdPlaque.position.set(0, -1.65, 0.08);
thirdPaintingGroup.add(thirdPlaque);
// DÖRDÜNCÜ ESER — Görünmeyen Emek

const fourthPaintingGroup = new THREE.Group();

// Üçüncü tablonun yanında, aynı duvarda
fourthPaintingGroup.position.set(17.75, 2.8, 6.5);

// Kameraya dönük
fourthPaintingGroup.rotation.y = -Math.PI / 2;

scene.add(fourthPaintingGroup);

// Dördüncü tablonun görseli
const fourthTexture = new THREE.TextureLoader().load(
  `${import.meta.env.BASE_URL}dorduncu-tablo.png`
);

fourthTexture.colorSpace = THREE.SRGBColorSpace;

const fourthPainting = new THREE.Mesh(
  new THREE.PlaneGeometry(3.2, 2.3),
  new THREE.MeshStandardMaterial({
    map: fourthTexture,
    roughness: 0.85,
    side: THREE.DoubleSide
  })
);

fourthPainting.position.z = 0.03;
fourthPaintingGroup.add(fourthPainting);
// Dördüncü tablonun isim levhası
const fourthPlaqueCanvas = document.createElement('canvas');
fourthPlaqueCanvas.width = 1024;
fourthPlaqueCanvas.height = 256;

const fourthPlaqueContext = fourthPlaqueCanvas.getContext('2d');

// Koyu bordo zemin
fourthPlaqueContext.fillStyle = '#241714';
fourthPlaqueContext.fillRect(0, 0, 1024, 256);

// İnce altın kenarlık
fourthPlaqueContext.strokeStyle = '#c59a4a';
fourthPlaqueContext.lineWidth = 8;
fourthPlaqueContext.strokeRect(12, 12, 1000, 232);

// Eserin adı
fourthPlaqueContext.fillStyle = '#f2d8a4';
fourthPlaqueContext.font = '58px Georgia';
fourthPlaqueContext.textAlign = 'center';
fourthPlaqueContext.textBaseline = 'middle';
fourthPlaqueContext.fillText('Görünmeyen Emek', 512, 128);

// Levhayı 3D nesneye dönüştürüyoruz
const fourthPlaqueTexture = new THREE.CanvasTexture(fourthPlaqueCanvas);
fourthPlaqueTexture.colorSpace = THREE.SRGBColorSpace;

const fourthPlaque = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 0.55),
  new THREE.MeshBasicMaterial({
    map: fourthPlaqueTexture,
    side: THREE.DoubleSide
  })
);

// Üçüncü tablonun levhasıyla aynı yükseklik
fourthPlaque.position.set(0, -1.65, 0.08);
fourthPaintingGroup.add(fourthPlaque);
 // Müzenin altın duvar süslemeleri
const wallGold = new THREE.MeshStandardMaterial({
  color: '#c59a4a',
  metalness: 0.7,
  roughness: 0.3
});

// İnce altın şerit oluşturma
function goldTrim(width, height, depth, x, y, z) {
  const trim = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, depth),
    wallGold
  );

  trim.position.set(x, y, z);
  scene.add(trim);
}

// Karşı duvardaki yatay altın şeritler
goldTrim(14, 0.06, 0.08, 0, 0.55, -1.8);
goldTrim(14, 0.08, 0.08, 0, 5.35, -1.8);

// Sol duvardaki altın şeritler
goldTrim(0.08, 0.06, 18, -6.8, 0.55, 0);
goldTrim(0.08, 0.08, 18, -6.8, 5.35, 0);

// Sağ duvardaki altın şeritler
goldTrim(0.08, 0.06, 18, 6.8, 0.55, 0);
goldTrim(0.08, 0.08, 18, 6.8, 5.35, 0);

// Karşı duvarda dikey dekoratif çizgiler
goldTrim(0.045, 4.7, 0.08, -5.7, 2.95, -1.8);
goldTrim(0.045, 4.7, 0.08, 5.7, 2.95, -1.8);

// 6. Altın çerçeveli tablo
const frame = new THREE.Mesh(
  new THREE.BoxGeometry(3.6, 2.6, 0.18),
  material('#c59a4a', 0.65)
);
frame.position.set(0, 2.8, -1.75);
scene.add(frame);

const painting = new THREE.Mesh(
  new THREE.PlaneGeometry(3.25, 2.25),
  new THREE.MeshStandardMaterial({
    color: '#172e45',
    side: THREE.DoubleSide
  })
);
painting.position.set(0, 2.8, -1.64);
scene.add(painting);

 // Tablo için isim levhası
const plaqueCanvas = document.createElement('canvas');
plaqueCanvas.width = 1024;
plaqueCanvas.height = 256;

const plaqueContext = plaqueCanvas.getContext('2d');

// Levhanın koyu zemini
plaqueContext.fillStyle = '#241b1a';
plaqueContext.fillRect(0, 0, 1024, 256);

// İnce altın kenarlık
plaqueContext.strokeStyle = '#c59a4a';
plaqueContext.lineWidth = 10;
plaqueContext.strokeRect(12, 12, 1000, 232);

// Eserin adı
plaqueContext.fillStyle = '#f2d8a4';
plaqueContext.font = '48px Georgia';
plaqueContext.textAlign = 'center';
plaqueContext.textBaseline = 'middle';

plaqueContext.fillText(
  'Bir Hikâyenin Başlangıcı',
  512,
  128
);

// Levhayı 3D nesneye dönüştürüyoruz
const plaqueTexture = new THREE.CanvasTexture(plaqueCanvas);
plaqueTexture.colorSpace = THREE.SRGBColorSpace;

const plaque = new THREE.Mesh(
  new THREE.PlaneGeometry(2.5, 0.625),
  new THREE.MeshBasicMaterial({
    map: plaqueTexture,
    side: THREE.DoubleSide
  })
);

// Tablonun altına yerleştiriyoruz
plaque.position.set(0, 1.15, -1.63);
scene.add(plaque);

 // İlk tablomuzun görselini yüklüyoruz
// İlk tablomuzun görselini yüklüyoruz
const paintingTexture = new THREE.TextureLoader().load(
  `${import.meta.env.BASE_URL}ilk-tablo.png`
);

// Görselin renklerini doğru gösteriyoruz
paintingTexture.colorSpace = THREE.SRGBColorSpace;

// Lacivert yüzeyin yerine tabloyu yerleştiriyoruz
painting.material = new THREE.MeshStandardMaterial({
  map: paintingTexture,
  roughness: 0.85,
  metalness: 0,
  side: THREE.DoubleSide
});

 // Tablonun üzerindeki klasik altın aydınlatma
const pictureLightGold = new THREE.MeshStandardMaterial({
  color: '#d4ad62',
  metalness: 0.85,
  roughness: 0.25
});

// Yatay altın lamba gövdesi
const pictureLamp = new THREE.Mesh(
  new THREE.CylinderGeometry(0.065, 0.065, 1.5, 24),
  pictureLightGold
);

pictureLamp.rotation.z = Math.PI / 2;
pictureLamp.position.set(0, 4.35, -1.35);
scene.add(pictureLamp);

// Lambayı duvara bağlayan iki küçük kol
for (const x of [-0.55, 0.55]) {
  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.055, 0.055, 0.35),
    pictureLightGold
  );

  arm.position.set(x, 4.35, -1.55);
  scene.add(arm);
}

// Lambanın sıcak ışığı
const pictureGlow = new THREE.SpotLight(
  '#ffdfa5',
  8,
  5,
  Math.PI / 4,
  0.65
);

pictureGlow.position.set(0, 4.25, -1.1);
pictureGlow.target.position.set(0, 2.8, -1.65);

scene.add(pictureGlow);
scene.add(pictureGlow.target);

 // Klasik duvar aplikleri
const sconceGold = new THREE.MeshStandardMaterial({
  color: '#caa45e',
  metalness: 0.8,
  roughness: 0.25
});

const sconceGlass = new THREE.MeshStandardMaterial({
  color: '#ffe1a1',
  emissive: '#ffb85c',
  emissiveIntensity: 0.9,
  roughness: 0.4
});

function createWallSconce(x) {
  // Duvara bağlı altın taban
  const base = new THREE.Mesh(
    new THREE.CylinderGeometry(0.16, 0.16, 0.07, 24),
    sconceGold
  );

  base.rotation.x = Math.PI / 2;
  base.position.set(x, 3.2, -1.78);
  scene.add(base);

  // Lambanın taşıyıcı kolu
  const arm = new THREE.Mesh(
    new THREE.BoxGeometry(0.055, 0.055, 0.35),
    sconceGold
  );

  arm.position.set(x, 3.2, -1.55);
  scene.add(arm);

  // Altın lamba yuvası
  const holder = new THREE.Mesh(
    new THREE.CylinderGeometry(0.11, 0.15, 0.15, 24),
    sconceGold
  );

  holder.position.set(x, 3.25, -1.38);
  scene.add(holder);

  // Sıcak ışık saçan cam
  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 24, 16),
    sconceGlass
  );

  glass.scale.set(0.8, 1.3, 0.8);
  glass.position.set(x, 3.48, -1.38);
  scene.add(glass);

  // Çevreye yayılan gerçek 3D ışık
  const glow = new THREE.PointLight(
    '#ffd39a',
    8,
    4
  );

  glow.position.set(x, 3.48, -1.25);
  scene.add(glow);
}

// Tablonun iki yanına aplik yerleştiriyoruz
createWallSconce(-3.2);
createWallSconce(3.2);

 // İKİNCİ TABLO — Bir Işığın Ardından

// Altın çerçeve malzemesi

// İKİNCİ TABLO — Bir Işığın Ardından

const secondFrameMaterial = new THREE.MeshStandardMaterial({
  color: '#c59a4a',
  metalness: 0.65,
  roughness: 0.35
});

// Resim ve çerçeveyi tek bir grupta tutuyoruz
const secondFrameGroup = new THREE.Group();

secondFrameGroup.position.set(5.95, 2.8, -0.5);
secondFrameGroup.rotation.y = -Math.PI / 2;
scene.add(secondFrameGroup);

// İkinci tablonun görseli

const secondTexture = new THREE.TextureLoader().load(
  `${import.meta.env.BASE_URL}ikinci-tablo.png`
);

secondTexture.colorSpace = THREE.SRGBColorSpace;

const secondPainting = new THREE.Mesh(
  new THREE.PlaneGeometry(2.8, 2.4),
  new THREE.MeshStandardMaterial({
    map: secondTexture,
    roughness: 0.85,
    side: THREE.DoubleSide
  })
);

// Resim grubun tam ortasında
secondPainting.position.set(0, 0, 0.02);
secondFrameGroup.add(secondPainting);

// Dört altın çerçeve kenarı
function addFrameEdge(width, height, x, y) {
  const edge = new THREE.Mesh(
    new THREE.BoxGeometry(width, height, 0.12),
    secondFrameMaterial
  );

  edge.position.set(x, y, 0.12);
  secondFrameGroup.add(edge);
}

// Üst ve alt kenar
addFrameEdge(3.1, 0.15, 0, 1.275);
addFrameEdge(3.1, 0.15, 0, -1.275);

// Sol ve sağ kenar
addFrameEdge(0.15, 2.7, -1.475, 0);
addFrameEdge(0.15, 2.7, 1.475, 0);

// İkinci tablo için yumuşak ışık
const secondLight = new THREE.SpotLight(
  '#ffdfa5',
  18,
  7,
  Math.PI / 4,
  0.6
);

secondLight.position.set(4.5, 5, 0);
secondLight.target.position.set(6.35, 2.8, -0.5);

scene.add(secondLight);
scene.add(secondLight.target);

 // İkinci tablonun isim levhası
const secondPlaqueCanvas = document.createElement('canvas');
secondPlaqueCanvas.width = 1024;
secondPlaqueCanvas.height = 256;

const secondPlaqueContext = secondPlaqueCanvas.getContext('2d');

// Levhanın koyu zemini
secondPlaqueContext.fillStyle = '#241b1a';
secondPlaqueContext.fillRect(0, 0, 1024, 256);

// Altın kenarlık
secondPlaqueContext.strokeStyle = '#c59a4a';
secondPlaqueContext.lineWidth = 10;
secondPlaqueContext.strokeRect(12, 12, 1000, 232);

// Eserin adı
secondPlaqueContext.fillStyle = '#f2d8a4';
secondPlaqueContext.font = '52px Georgia';
secondPlaqueContext.textAlign = 'center';
secondPlaqueContext.textBaseline = 'middle';

secondPlaqueContext.fillText(
  'Bir Işığın Ardından',
  512,
  128
);

// Yazıyı 3D levhaya dönüştürüyoruz
const secondPlaqueTexture = new THREE.CanvasTexture(secondPlaqueCanvas);
secondPlaqueTexture.colorSpace = THREE.SRGBColorSpace;

const secondPlaque = new THREE.Mesh(
  new THREE.PlaneGeometry(2.3, 0.575),
  new THREE.MeshBasicMaterial({
    map: secondPlaqueTexture,
    side: THREE.DoubleSide
  })
);

// Levhayı ikinci tabloyla aynı gruba ekliyoruz
secondPlaque.position.set(0, -1.75, 0.08);
secondFrameGroup.add(secondPlaque);



// 7. Müze ışıkları
const ambientLight = new THREE.AmbientLight('#fff0db', 1.2);
scene.add(ambientLight);

const spotlight = new THREE.SpotLight(
  '#ffd49a',
  25,
  15,
  Math.PI / 5,
  0.5
);
spotlight.position.set(0, 5, 2);
spotlight.target = painting;
scene.add(spotlight);

// 8. Ekran boyutu değiştiğinde uyum sağla
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// 9. Sahneyi sürekli çiz


const doorGroup = new THREE.Group();
scene.add(doorGroup);

// Sol kapı kanadı
const leftPivot = new THREE.Group();
leftPivot.position.set(-1.5, 0, 3);

const leftDoor = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 4, 0.15),
  new THREE.MeshStandardMaterial({
    color: '#442719',
    roughness: 0.65
  })
);
leftDoor.position.set(0.75, 2, 0);
leftPivot.add(leftDoor);
doorGroup.add(leftPivot);

// Sağ kapı kanadı
const rightPivot = new THREE.Group();
rightPivot.position.set(1.5, 0, 3);

const rightDoor = new THREE.Mesh(
  new THREE.BoxGeometry(1.5, 4, 0.15),
  new THREE.MeshStandardMaterial({
    color: '#442719',
    roughness: 0.65
  })
);
rightDoor.position.set(-0.75, 2, 0);
rightPivot.add(rightDoor);
doorGroup.add(rightPivot);

 // Kapılar için altın süsleme malzemesi
const goldMaterial = new THREE.MeshStandardMaterial({
  color: '#d8ad58',
  metalness: 0.8,
  roughness: 0.25
});

// Kapıların üzerine ince altın şeritler ekliyoruz
function addDoorDecoration(door) {
  const positions = [
    // Üst dikdörtgen
    [0, 0.65, 0.085, 0.95, 0.035],
    [0, 1.55, 0.085, 0.95, 0.035],
    [-0.475, 1.1, 0.085, 0.035, 0.9],
    [0.475, 1.1, 0.085, 0.035, 0.9],

    // Alt dikdörtgen
    [0, -0.35, 0.085, 0.95, 0.035],
    [0, -1.55, 0.085, 0.95, 0.035],
    [-0.475, -0.95, 0.085, 0.035, 1.2],
    [0.475, -0.95, 0.085, 0.035, 1.2]
  ];

  positions.forEach(([x, y, z, width, height]) => {
    const strip = new THREE.Mesh(
      new THREE.BoxGeometry(width, height, 0.025),
      goldMaterial
    );

    strip.position.set(x, y, z);
    door.add(strip);
  });
}

// Her iki kapıyı da süslüyoruz
addDoorDecoration(leftDoor);
addDoorDecoration(rightDoor);

// Altın kapı kolları
function addDoorHandle(door, x) {
  const handle = new THREE.Mesh(
    new THREE.SphereGeometry(0.085, 16, 16),
    goldMaterial
  );

  handle.position.set(x, 0, 0.13);
  door.add(handle);
}

addDoorHandle(leftDoor, 0.53);
addDoorHandle(rightDoor, -0.53);

// Kapıların arasından gelen altın ışık
const doorLight = new THREE.PointLight(
  '#ffcc77',
  35,
  8
);
doorLight.position.set(0, 2, 2.7);
scene.add(doorLight);

// Kamerayı kapının karşısına yerleştir
camera.position.set(0, 2, 7);
camera.lookAt(0, 2, 3);

// Kapıları açma animasyonu
let opening = false;
let progress = 0;

function openMuseum() {
  if (opening) return;
  opening = true;
}



// Giriş butonu
const enterButton = document.createElement('button');
enterButton.textContent = 'Müzeye Gir';

enterButton.style.position = 'fixed';
enterButton.style.bottom = '12%';
enterButton.style.left = '50%';
enterButton.style.transform = 'translateX(-50%)';
enterButton.style.padding = '15px 35px';
enterButton.style.background = '#c59a4a';
enterButton.style.color = '#211820';
enterButton.style.border = 'none';
enterButton.style.borderRadius = '30px';
enterButton.style.fontSize = '17px';
enterButton.style.cursor = 'pointer';
enterButton.style.zIndex = '10';

document.body.appendChild(enterButton);

 // Müze giriş başlığı
const museumTitle = document.createElement('div');

museumTitle.innerHTML = `
  <h1>İZLER MÜZESİ</h1>
  <p>Elifime Özel Bir 24 Kasım Sergisi</p>
`;

museumTitle.style.position = 'fixed';
museumTitle.style.top = '12%';
museumTitle.style.left = '50%';
museumTitle.style.transform = 'translateX(-50%)';
museumTitle.style.width = '90%';
museumTitle.style.textAlign = 'center';
museumTitle.style.color = '#f2d8a4';
museumTitle.style.zIndex = '10';
museumTitle.style.pointerEvents = 'none';
museumTitle.style.transition = 'opacity 1.5s ease';

museumTitle.querySelector('h1').style.cssText = `
  font-family: Georgia, serif;
  font-size: clamp(30px, 6vw, 64px);
  font-weight: normal;
  letter-spacing: 7px;
  text-shadow: 0 3px 20px rgba(0,0,0,0.8);
  margin-bottom: 14px;
`;

museumTitle.querySelector('p').style.cssText = `
  font-family: Georgia, serif;
  font-size: clamp(13px, 2vw, 19px);
  letter-spacing: 3px;
  color: #e6cda8;
  text-shadow: 0 2px 12px rgba(0,0,0,0.9);
`;

document.body.appendChild(museumTitle);

 // Salon adını gösteren yazı
const roomTitle = document.createElement('div');

roomTitle.textContent = 'GİRİŞ SALONU';

roomTitle.style.cssText = `
  position: fixed;
  top: 9%;
  left: 50%;
  transform: translateX(-50%);
  width: 90%;
  text-align: center;
  color: #f2d8a4;
  font-family: Georgia, serif;
  font-size: clamp(18px, 3vw, 30px);
  letter-spacing: 5px;
  text-shadow: 0 3px 15px rgba(0,0,0,0.9);
  z-index: 15;
  opacity: 0;
  pointer-events: none;
  transition: opacity 1.5s ease;
`;

document.body.appendChild(roomTitle);

// Salon adını gösterme fonksiyonu
function showRoomTitle() {
  roomTitle.style.opacity = '1';

  setTimeout(() => {
    roomTitle.style.opacity = '0';
  }, 3000);
}
// MÜZENİN KAPANIŞ MESAJI
const museumFinalMessage = document.createElement('div');

museumFinalMessage.innerHTML = `
  <div style="
    font-size: 28px;
    line-height: 1.7;
    font-style: italic;
    color: #f2d8a4;
    text-shadow: 0 2px 15px rgba(0,0,0,0.8);
  ">
    “Bazı çiçekler bir mevsime,<br>
    bazı güzellikler bir ömre iz bırakır.”
  </div>

  <div style="
    margin-top: 25px;
    font-size: 15px;
    letter-spacing: 2px;
    color: #d6ae62;
  ">
    24 KASIM • ÖĞRETMENLER GÜNÜN KUTLU OLSUN
  </div>
`;

Object.assign(museumFinalMessage.style, {
  width: '85%',
  maxWidth: '750px',
  padding: '35px 30px',
  background: 'rgba(35, 12, 22, 0.88)',
  border: '1px solid #d6ae62',
  textAlign: 'center',
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '85%',
  maxWidth: '750px',
  textAlign: 'center',
  zIndex: '1000',
  pointerEvents: 'none',
  opacity: '0',
  display: 'none',
  transition: 'opacity 2.5s ease'
});

document.body.appendChild(museumFinalMessage);
 // Tabloyu inceleme butonu
const inspectButton = document.createElement('button');
inspectButton.textContent = 'Tabloyu İncele';

inspectButton.style.cssText = `
  position: fixed;
  bottom: 8%;
  left: 50%;
  transform: translateX(-50%);
  padding: 14px 30px;
  background: rgba(36, 27, 26, 0.92);
  color: #f2d8a4;
  border: 1px solid #c59a4a;
  border-radius: 30px;
  font-family: Georgia, serif;
  font-size: 16px;
  cursor: pointer;
  z-index: 20;
  display: none;
`;

document.body.appendChild(inspectButton);

// Tablo detay ekranı
const paintingDetail = document.createElement('div');

paintingDetail.style.cssText = `
  position: fixed;
  inset: 0;
  background: rgba(16, 12, 19, 0.96);
  z-index: 30;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 24px;
  overflow-y: auto;
  text-align: center;
  color: #f2d8a4;
  font-family: Georgia, serif;
`;

paintingDetail.innerHTML = `
  <img
    src="/ilk-tablo.png"
    alt="Bir Hikâyenin Başlangıcı"
    style="
      max-width: 90%;
      max-height: 55vh;
      object-fit: contain;
      border: 5px solid #c59a4a;
      box-shadow: 0 0 35px rgba(197,154,74,0.2);
    "
  >

  <h2 style="
    margin-top: 25px;
    font-size: clamp(22px, 4vw, 32px);
    font-weight: normal;
  ">
    Bir Hikâyenin Başlangıcı
  </h2>

  <p style="
    margin-top: 15px;
    max-width: 550px;
    line-height: 1.8;
    font-size: 17px;
    color: #e6d4bc;
  ">
    Her güzel hikâye bir başlangıçla anlam kazanır.
    Bazı başlangıçlar ise ardında unutulmayacak izler bırakır.
  </p>

  <button id="closePainting" style="
    margin-top: 30px;
    padding: 13px 28px;
    background: transparent;
    color: #f2d8a4;
    border: 1px solid #c59a4a;
    border-radius: 25px;
    font-family: Georgia, serif;
    font-size: 15px;
    cursor: pointer;
  ">
    Müzeye Dön
  </button>
`;

document.body.appendChild(paintingDetail);

 // Sonraki eser butonunu oluşturuyoruz
const nextArtworkButton = document.createElement('button');

nextArtworkButton.textContent = 'Sonraki Eser →';

nextArtworkButton.style.cssText = `
  margin-top: 14px;
  padding: 13px 28px;
  background: #c59a4a;
  color: #211820;
  border: none;
  border-radius: 25px;
  font-family: Georgia, serif;
  font-size: 15px;
  cursor: pointer;
  transition: background 0.3s ease;
`;

// Butonu tablo detay ekranına ekliyoruz
paintingDetail.appendChild(nextArtworkButton);

// Şimdilik sonraki eser için bilgilendirme

 // İkinci tabloya sinematik geçiş
let artworkTransition = false;
let transitionProgress = 0;
let currentArtwork = 0;

const transitionStart = new THREE.Vector3();
const transitionEnd = new THREE.Vector3(1.5, 2.8, -0.5);

const lookStart = new THREE.Vector3();
const lookEnd = new THREE.Vector3(6.35, 2.8, -0.5);
nextArtworkButton.addEventListener('click', () => {
  paintingDetail.style.display = 'none';
  inspectButton.style.display = 'none';

  if (currentArtwork === 0) {
    // Birinci tablodan ikinci tabloya geçiş
    transitionStart.copy(camera.position);

    camera.getWorldDirection(lookStart);
    lookStart.multiplyScalar(5).add(camera.position);

    transitionProgress = 0;
    artworkTransition = true;

  } else if (currentArtwork === 2) {
  // Üçüncü tablodan dördüncü tabloya geçiş
  startFourthPaintingTransition();
}
});


// Tabloyu aç

 // Hangi eserde olduğumuza göre detay ekranını güncelliyoruz
inspectButton.addEventListener('click', () => {
  const detailImage = paintingDetail.querySelector('img');
  const detailTitle = paintingDetail.querySelector('h2');
  const detailMessage = paintingDetail.querySelector('p');

  if (currentArtwork === 0) {
    // Birinci eser
    detailImage.src = `${import.meta.env.BASE_URL}ilk-tablo.png`;
    detailImage.alt = 'Bir Hikâyenin Başlangıcı';

    detailTitle.textContent = 'Bir Hikâyenin Başlangıcı';

    detailMessage.textContent =
      'Her güzel hikâye bir başlangıçla anlam kazanır. ' +
      'Bazı başlangıçlar ise ardında unutulmayacak izler bırakır.';

    nextArtworkButton.style.display = 'block';

  } else if (currentArtwork === 1) {
    // İkinci eser
    detailImage.src = `${import.meta.env.BASE_URL}ikinci-tablo.png`;
    detailImage.alt = 'Bir Işığın Ardından';

    detailTitle.textContent = 'Bir Işığın Ardından';

    detailMessage.textContent =
      'Bazı insanlar yalnızca bilgi öğretmez; ' +
      'dünyaya bakışımızı da değiştirir. ' +
      'Bir sınıfta başlayan küçük bir ışık, ' +
      'yıllar sonra bile yolumuzu aydınlatabilir.';

    // Henüz üçüncü tabloyu oluşturmadık
    nextArtworkButton.style.display = 'none';
        // İkinci eserin ardından ikinci salona geçiliyor
    nextArtworkButton.style.display = 'none';

  } else if (currentArtwork === 2) {
    // Üçüncü eser — Bir İz Bırakmak
    detailImage.src = `${import.meta.env.BASE_URL}ucuncu-tablo.png`;
    detailImage.alt = 'Bir İz Bırakmak';

    detailTitle.textContent = 'Bir İz Bırakmak';

    detailMessage.textContent =
      'Bazı insanlar yalnızca bilgi öğretmez; ' +
      'bir yol gösterir, bir cesaret bırakır, ' +
      'bir geleceğe ışık olur. ' +
      'Bir öğretmenin emeği bazen hemen fark edilmez. ' +
      'Ama yıllar geçse de dokunduğu hayatlarda yaşamaya devam eder. ' +
      'Çünkü en değerli izler, gözle görülenler değil, ' +
      'bir insanın hayatında bırakılanlardır.';

        nextArtworkButton.style.display = 'block';

  } else if (currentArtwork === 3) {
    // Dördüncü eser — Görünmeyen Emek
    detailImage.src = `${import.meta.env.BASE_URL}dorduncu-tablo.png`;
    detailImage.alt = 'Görünmeyen Emek';

    detailTitle.textContent = 'Görünmeyen Emek';

    detailMessage.textContent =
      'Bir öğretmenin emeği yalnızca sınıfta geçen saatlerle ölçülmez. ' +
      'Bazen herkes uyurken hazırlanan bir dersin satırlarında, ' +
      'bazen defalarca düzeltilen bir cümlede, ' +
      'bazen de bir öğrencinin başarısı için duyulan sessiz bir umutta saklıdır. ' +
      'Görünmeyen bütün o çabalar, ' +
      'bir gün başka hayatlarda güzelliklere dönüşür.';

    // Sonraki salona geçişi daha sonra ekleyeceğiz
        nextArtworkButton.style.display = 'none';

  } else if (currentArtwork === 4) {
    // Beşinci ve son eser — Kasımpatılar
    detailImage.src = `${import.meta.env.BASE_URL}kasimpatilar.png`;
    detailImage.alt = 'Kasımpatılar';

    detailTitle.textContent = 'Kasımpatılar';

    detailMessage.textContent =
      'Kasımın kendine özgü bir güzelliği vardır. ' +
      'Biraz hüzün, biraz huzur ve bazen hiç beklenmedik bir çiçek... ' +
      'Kasımpatılar bu kez bir vazoda değil, ' +
      'küçük bir hatıranın içinde sana ulaşsın istedim. ' +
      'Bu çiçekler; emeğine, sabrına, dokunduğun hayatlara ' +
      've bütün güzel yarınlarına küçük bir teşekkür olsun. ' +
      'Umarım hayat, kalbine güzellik veren insanları ve anları ' +
      'hep karşına çıkarır. ' +
      'Öğretmenler Günün kutlu olsun. 🌼';

    // Bu müzenin son eseri
    nextArtworkButton.style.display = 'none';
  }

  paintingDetail.style.display = 'flex';
});


// Tabloyu kapat
document
  .getElementById('closePainting')
  .addEventListener('click', () => {
    paintingDetail.style.display = 'none';

    // Son eser Kasımpatılar ise kapanış mesajını göster
    if (currentArtwork === 4) {
      museumFinalMessage.style.display = 'block';

      // Yazı yavaşça belirsin
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          museumFinalMessage.style.opacity = '1';
        });
      });

      // 8 saniye sonra kaybolmaya başlasın
      setTimeout(() => {
        museumFinalMessage.style.opacity = '0';

        setTimeout(() => {
          museumFinalMessage.style.display = 'none';
        }, 2500);
      }, 8000);
    }
  });


enterButton.addEventListener('click', () => {
  openMuseum();

  enterButton.style.display = 'none';
  museumTitle.style.opacity = '0';
});


const clock = new THREE.Clock();
let cameraProgress = 0;
let roomTitleShown = false;
function animate() {
  requestAnimationFrame(animate);
animateSecondDoors();
  const delta = Math.min(clock.getDelta(), 0.05);

  if (opening) {
    // Kapılar yavaşça açılıyor
    progress = Math.min(progress + delta / 2.5, 1);

    const smooth = progress * progress * (3 - 2 * progress);

    leftPivot.rotation.y = -smooth * Math.PI / 2;
    rightPivot.rotation.y = smooth * Math.PI / 2;

    // Kapılar açıldıktan sonra kamera ilerliyor
    if (progress >= 1 && cameraProgress < 1) {
      cameraProgress = Math.min(
        cameraProgress + delta / 4,
        1
      );

      const move =
        cameraProgress * cameraProgress *
        (3 - 2 * cameraProgress);

      camera.position.z = 7 - move * 5;
      camera.lookAt(0, 2, -2);
     
if (cameraProgress >= 1) {
  inspectButton.style.display = 'block';

  if (!roomTitleShown) {
    roomTitleShown = true;
    showRoomTitle();
  }
}

    }
  }

  // Tablolar arasında yumuşak kamera hareketi
  if (artworkTransition) {
    transitionProgress = Math.min(
      transitionProgress + delta / 4,
      1
    );

    const smooth =
      transitionProgress * transitionProgress *
      (3 - 2 * transitionProgress);

    camera.position.lerpVectors(
      transitionStart,
      transitionEnd,
      smooth
    );

    const currentLook = new THREE.Vector3();
    currentLook.lerpVectors(
      lookStart,
      lookEnd,
      smooth
    );

    camera.lookAt(currentLook);

    if (transitionProgress >= 1) {
      artworkTransition = false;
      currentArtwork = 1;
      inspectButton.style.display = 'block';
      secondRoomButton.style.display = 'block';
    }
  }
// Kamera ikinci salonun kapısına ilerliyor
if (movingToSecondDoor) {
  secondDoorCameraProgress = Math.min(
    secondDoorCameraProgress + delta / 3,
    1
  );

  const smooth = secondDoorCameraProgress *
    secondDoorCameraProgress *
    (3 - 2 * secondDoorCameraProgress);

  camera.position.lerpVectors(
    secondDoorCameraStart,
    secondDoorCameraEnd,
    smooth
  );

  const currentDoorLook = new THREE.Vector3();

  currentDoorLook.lerpVectors(
    secondDoorLookStart,
    secondDoorLookEnd,
    smooth
  );

  camera.lookAt(currentDoorLook);

  if (secondDoorCameraProgress >= 1) {
  movingToSecondDoor = false;

  // Kapılar tamamen açıldığında içeri gir
  if (secondDoorProgress >= 1) {
    enterSecondRoom();
  }
}
}
// Kamera açık kapıdan ikinci salona geçiyor
if (enteringSecondRoom) {
  secondRoomEntryProgress = Math.min(
    secondRoomEntryProgress + delta / 4,
    1
  );

  const smooth = secondRoomEntryProgress *
    secondRoomEntryProgress *
    (3 - 2 * secondRoomEntryProgress);

  camera.position.lerpVectors(
    secondRoomEntryStart,
    secondRoomEntryEnd,
    smooth
  );

  // Kamera ilerlerken ileriye bakmaya devam ediyor
  camera.lookAt(
    camera.position.x + 5,
    2.8,
    4
  );

  if (secondRoomEntryProgress >= 1) {
  enteringSecondRoom = false;

  // İkinci salona giriş tamamlandı
  // Üçüncü tabloya yaklaşmayı başlat
  startThirdPaintingTransition();
}
}
// Kamera üçüncü tabloya yaklaşıyor
if (movingToThirdPainting) {
  thirdPaintingProgress = Math.min(
    thirdPaintingProgress + delta / 4,
    1
  );

  const smooth = thirdPaintingProgress *
    thirdPaintingProgress *
    (3 - 2 * thirdPaintingProgress);

  camera.position.lerpVectors(
    thirdCameraStart,
    thirdCameraEnd,
    smooth
  );

  const currentThirdLook = new THREE.Vector3();

  currentThirdLook.lerpVectors(
    thirdLookStart,
    thirdLookEnd,
    smooth
  );

  camera.lookAt(currentThirdLook);

  if (thirdPaintingProgress >= 1) {
    movingToThirdPainting = false;
    currentArtwork = 2;
    inspectButton.style.display = 'block';
  }
}
// Kamera dördüncü tabloya doğru ilerliyor
if (movingToFourthPainting) {
  fourthPaintingProgress = Math.min(
    fourthPaintingProgress + delta / 4,
    1
  );

  // Yumuşak başlangıç ve bitiş
  const smoothFourth = fourthPaintingProgress *
    fourthPaintingProgress *
    (3 - 2 * fourthPaintingProgress);

  // Kameranın konumunu değiştir
  camera.position.lerpVectors(
    fourthCameraStart,
    fourthCameraEnd,
    smoothFourth
  );

  // Kameranın bakış yönünü değiştir
  const currentFourthLook = new THREE.Vector3();

  currentFourthLook.lerpVectors(
    fourthLookStart,
    fourthLookEnd,
    smoothFourth
  );

  camera.lookAt(currentFourthLook);

  // Hareket tamamlandı
  if (fourthPaintingProgress >= 1) {
  movingToFourthPainting = false;
  currentArtwork = 3;

  inspectButton.style.display = 'block';

  // Final salonuna geçiş butonunu göster
  finalRoomButton.style.display = 'block';
}
}
// Kamera final salonunun kapısına dönüyor
if (movingToFinalDoor) {
  finalDoorProgress = Math.min(
    finalDoorProgress + delta / 4,
    1
  );

  // Yumuşak başlangıç ve bitiş
  const smoothFinalDoor = finalDoorProgress *
    finalDoorProgress *
    (3 - 2 * finalDoorProgress);

  // Kameranın konumu
  camera.position.lerpVectors(
    finalDoorCameraStart,
    finalDoorCameraEnd,
    smoothFinalDoor
  );

  // Kameranın baktığı nokta
  const currentFinalDoorLook = new THREE.Vector3();

  currentFinalDoorLook.lerpVectors(
    finalDoorLookStart,
    finalDoorLookEnd,
    smoothFinalDoor
  );

  camera.lookAt(currentFinalDoorLook);

  // Kapının karşısına ulaştık
  if (finalDoorProgress >= 1) {
  movingToFinalDoor = false;

  // Kamera kapının karşısına geldiğinde kapıları aç
  openFinalDoors();
}
}
// FİNAL KAPISI YAVAŞÇA AÇILIYOR
if (openingFinalDoors) {
  finalDoorsProgress = Math.min(
    finalDoorsProgress + delta / 3,
    1
  );

  // Yumuşak açılma hareketi
  const smoothFinalOpen =
    finalDoorsProgress *
    finalDoorsProgress *
    (3 - 2 * finalDoorsProgress);

  // İki kapı kanadı ters yönlere açılıyor
  finalLeftDoor.rotation.y = -Math.PI / 2 * smoothFinalOpen;
  finalRightDoor.rotation.y = Math.PI / 2 * smoothFinalOpen;

  if (finalDoorsProgress >= 1) {
  openingFinalDoors = false;

  // Kapılar açıldı, kamera içeri girsin
  startFinalRoomEntry();
}
}
// KAMERA FİNAL SALONUNA GİRİYOR
if (enteringFinalRoom) {
  finalRoomEntryProgress = Math.min(
    finalRoomEntryProgress + delta / 4,
    1
  );

  // Yumuşak kamera hareketi
  const smoothFinalEntry =
    finalRoomEntryProgress *
    finalRoomEntryProgress *
    (3 - 2 * finalRoomEntryProgress);

  camera.position.lerpVectors(
    finalRoomEntryStart,
    finalRoomEntryEnd,
    smoothFinalEntry
  );

  const currentFinalRoomLook = new THREE.Vector3();

  currentFinalRoomLook.lerpVectors(
    finalRoomLookStart,
    finalRoomLookEnd,
    smoothFinalEntry
  );

  camera.lookAt(currentFinalRoomLook);

  if (finalRoomEntryProgress >= 1) {
  enteringFinalRoom = false;

  // Final salonuna giriş tamamlandı.
  // Kasımpatılar tablosuna yaklaş.
  startFinalPaintingTransition();
}
}
// KAMERA KASIMPATILAR TABLOSUNA YAKLAŞIYOR
if (movingToFinalPainting) {
  finalPaintingProgress = Math.min(
    finalPaintingProgress + delta / 5,
    1
  );

  // Yumuşak başlangıç ve bitiş
  const smoothFinalPainting =
    finalPaintingProgress *
    finalPaintingProgress *
    (3 - 2 * finalPaintingProgress);

  // Kameranın konumu
  camera.position.lerpVectors(
    finalPaintingCameraStart,
    finalPaintingCameraEnd,
    smoothFinalPainting
  );

  // Kameranın baktığı nokta
  const currentFinalPaintingLook = new THREE.Vector3();

  currentFinalPaintingLook.lerpVectors(
    finalPaintingLookStart,
    finalPaintingLookEnd,
    smoothFinalPainting
  );

  camera.lookAt(currentFinalPaintingLook);

  // Hareket tamamlandı
  if (finalPaintingProgress >= 1) {
  movingToFinalPainting = false;

  // Beşinci ve son eser: Kasımpatılar
  currentArtwork = 4;

  // İnceleme butonunu göster
  inspectButton.style.display = 'block';
}
}
  renderer.render(scene, camera);
}

animate();
