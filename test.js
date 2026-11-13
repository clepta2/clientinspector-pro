import handleRequest from './worker.js';
const worker = { fetch: handleRequest };

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

console.log(`\n🎉 Todos os ${pass} testes do ClientInspector Pro passaram com 100% de sucesso!`);
