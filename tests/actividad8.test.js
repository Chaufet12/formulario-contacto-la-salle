const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const server = fs.readFileSync(path.join(root,'src/server.js'),'utf8');
const front = fs.readFileSync(path.join(root,'public/script.js'),'utf8');
function backend(body, mode='ok') {
  const routes={}; let inserted=null;
  const db={run(sql,values,cb){inserted=values; cb.call({lastID:1},mode==='db-error'?new Error('fallo DB'):null)},all(){}};
  const app={use(){},post(url,fn){routes['POST '+url]=fn},get(url,fn){routes['GET '+url]=fn},listen(){}};
  const express=()=>app; express.json=()=>()=>{};express.urlencoded=()=>()=>{};express.static=()=>()=>{};
  const sandbox={require(n){if(n==='path')return path;if(n==='dotenv')return {config(){}};if(n==='express')return express;if(n==='./database')return db;throw Error(n)},process:{env:{}},__dirname:path.join(root,'src'),console:{log(){},error(){} }};
  vm.runInNewContext(server,sandbox,{filename:'src/server.js'});
  let status=200, payload;
  routes['POST /api/contactos']({body},{status(n){status=n;return this},json(o){payload=o;return this}});
  return {status,payload,inserted};
}
function frontend(values) {
 const nodes={}; const ids=['contactForm','submitButton','formMessage','nombre','correo','asunto','mensaje','errorNombre','errorCorreo','errorAsunto','errorMensaje'];
 for(const id of ids) nodes[id]={value:values[id]||'',textContent:'',className:'',disabled:false,validity:{valid:id!=='correo'||/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(values.correo||'')},addEventListener(event,fn){this.handler=fn},reset(){this.resetCalled=true}};
 const document={getElementById:id=>nodes[id]}; let fetchCalls=0;
 vm.runInNewContext(front,{document,fetch:async()=>{fetchCalls++;return {ok:true,json:async()=>({message:'¡Mensaje enviado correctamente!'})}}});
 return {nodes,submit:async()=>{await nodes.contactForm.handler({preventDefault(){}});return fetchCalls}};
}
const valid={nombre:'Ana Ruiz',correo:'ana@ejemplo.com',asunto:'Consulta',mensaje:'Necesito información'};
test('U01 campos obligatorios',()=>{const r=backend({...valid,nombre:''});assert.equal(r.status,400);assert.equal(r.inserted,null)});
test('U02 formato de correo',()=>{const r=backend({...valid,correo:'correo-invalido'});assert.equal(r.status,400);assert.match(r.payload.message,/correo electrónico válido/)});
test('I01 inserción de contacto válido',()=>{const r=backend(valid);assert.equal(r.status,201);assert.deepEqual(Array.from(r.inserted),Object.values(valid))});
test('I02 error de persistencia controlado',()=>{const r=backend(valid,'db-error');assert.equal(r.status,500);assert.equal(r.payload.success,false)});
test('F01 envío válido desde formulario',async()=>{const f=frontend(valid);assert.equal(await f.submit(),1);assert.match(f.nodes.formMessage.textContent,/correctamente/)});
test('F02 nombre vacío bloquea envío',async()=>{const f=frontend({...valid,nombre:'  '});assert.equal(await f.submit(),0);assert.match(f.nodes.errorNombre.textContent,/obligatorio/)});
