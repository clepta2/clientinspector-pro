import worker from './worker.js';

console.log('🧪 Iniciando Bateria de Testes do ClientInspector Pro (IP & User-Agent)...\n');

let pass = 0;
function assert(cond, msg) {
  if (cond) {
    pass++;
    console.log(`  ✅ ${msg}`);
  } else {
    console.error(`  ❌ FALHA: ${msg}`);
    throw new Error(msg);
  }
}

// 1. Teste de Detecção de IP
const reqIp = new Request('https://api.test/api/meu-ip', {
  headers: {
    'cf-connecting-ip': '200.189.12.34',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/128.0.0.0 Safari/537.36'
  }
});
const resIp = await worker.fetch(reqIp);
assert(resIp.status === 200, 'Endpoint /api/meu-ip responde 200 OK');
const bodyIp = await resIp.json();
assert(bodyIp.ok === true, 'JSON de resposta com ok: true');
assert(bodyIp.ip.endereco === '200.189.12.34', 'IP capturado corretamente do header cf-connecting-ip');
assert(bodyIp.navegador.nome === 'Google Chrome' || bodyIp.navegador.nome.includes('Chrome'), 'Decodifica navegador Chrome');
assert(bodyIp.sistemaOperacional.nome === 'Windows', 'Decodifica SO Windows');

// 2. Teste em formato texto puro (curl ip)
const reqTxt = new Request('https://api.test/api/ip?format=text', {
  headers: { 'cf-connecting-ip': '177.18.29.40' }
});
const resTxt = await worker.fetch(reqTxt);
assert(resTxt.status === 200, 'Formato texto responde 200 OK');
const textIp = await resTxt.text();
assert(textIp.trim() === '177.18.29.40', 'Devolve IP em texto puro para cURL');

// 3. Teste de Inspeção de Dispositivo Real / Hardware
const reqHw = new Request('https://api.test/api/dispositivo', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
  },
  body: JSON.stringify({
    cores: 8,
    ramGb: 8,
    screenWidth: 1920,
    screenHeight: 1080,
    touchPoints: 0,
    gpuRenderer: 'ANGLE (Intel UHD Graphics 620)'
  })
});
const resHw = await worker.fetch(reqHw);
assert(resHw.status === 200, 'Endpoint /api/dispositivo responde 200 OK');
const bodyHw = await resHw.json();
assert(bodyHw.dispositivo.tipo === 'Notebook / Computador Desktop', 'Identifica como Notebook / Computador Desktop');
assert(bodyHw.hardwareReal.processadorCores === 8, 'Registra 8 núcleos de CPU');
assert(bodyHw.hardwareReal.gpu.renderer.includes('Intel UHD'), 'Registra GPU Intel UHD');

// 4. Teste Forense de Foto (Detecção de Photoshop)
const reqFotoEdit = new Request('https://api.test/api/foto/forense', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    exif: {
      make: 'Adobe Systems',
      model: 'Reprocessed Document',
      software: 'Adobe Photoshop 2025 (Windows)'
    }
  })
});
const resFotoEdit = await worker.fetch(reqFotoEdit);
assert(resFotoEdit.status === 200, 'Endpoint /api/foto/forense responde 200 OK');
const bodyFotoEdit = await resFotoEdit.json();
assert(bodyFotoEdit.isEditado === true, 'Detecta imagem editada em software gráfico');
assert(bodyFotoEdit.tipo === 'ADULTERADO_EDITOR_GRAFICO', 'Classifica como ADULTERADO_EDITOR_GRAFICO');

console.log(`\n🎉 Todos os ${pass} testes do ClientInspector Pro passaram com 100% de sucesso!`);
