import {mkdir,cp,readdir,rm} from 'node:fs/promises';
await rm('dist/client',{recursive:true,force:true});
await mkdir('dist/client',{recursive:true});await mkdir('dist/server',{recursive:true});
for(const item of await readdir('dist'))if(!['client','server','.openai'].includes(item))await cp(`dist/${item}`,`dist/client/${item}`,{recursive:true});
await cp('server/worker.mjs','dist/server/index.js');
await mkdir('dist/.openai',{recursive:true});await cp('.openai/hosting.json','dist/.openai/hosting.json');await cp('drizzle','dist/.openai/drizzle',{recursive:true});
console.log('Ophira website and lead capture service built.');
