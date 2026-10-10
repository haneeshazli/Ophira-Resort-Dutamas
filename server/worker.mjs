const salaries=['below-3000','3000-5000','5000-8000','8000-12000','above-12000'];
const budgets=['below-300000','300000-500000','500000-800000','800000-1000000','above-1000000'];
const json=(data,status=200)=>Response.json(data,{status,headers:{'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
function database(env){if(!env.DB)throw new Error('Lead storage unavailable');return env.DB;}
export async function captureLead(request,env){
 if(request.method!=='POST')return json({error:'method'},405);
 const origin=request.headers.get('origin');
 if((origin&&origin!==new URL(request.url).origin)||request.headers.get('sec-fetch-site')==='cross-site')return json({error:'origin'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return json({error:'content_type'},415);
 if(Number(request.headers.get('content-length'))>4096)return json({error:'too_large'},413);
 let data;try{const body=await request.text();if(body.length>4096)return json({error:'too_large'},413);data=JSON.parse(body)}catch{return json({error:'invalid'},400)}
 if(!data||typeof data!=='object')return json({error:'invalid'},400);
 const validText=v=>typeof v==='string'&&v.trim().length>=2&&v.trim().length<=100&&!/[\u0000-\u001f]/.test(v);
 const phone=typeof data.phone==='string'?data.phone.replace(/[\s()-]/g,''):'';
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(data.id||'')||!validText(data.name)||!validText(data.occupation)||!salaries.includes(data.salary)||!['condo','landed','commercial'].includes(data.propertyType)||!budgets.includes(data.budget)||!/^\+?[0-9]{9,15}$/.test(phone)||typeof data.whatsapp!=='boolean'||!['bm','en'].includes(data.language))return json({error:'validation'},400);
 try{
  await database(env).prepare('INSERT INTO leads (id,name,salary,occupation,property_type,budget,phone,whatsapp,language,created_at) VALUES (?,?,?,?,?,?,?,?,?,?) ON CONFLICT(id) DO NOTHING').bind(data.id,data.name.trim(),data.salary,data.occupation.trim(),data.propertyType,data.budget,phone,data.whatsapp?1:0,data.language,new Date().toISOString()).run();
  return json({ok:true},201);
 }catch{console.error('Lead submission storage failure');return json({error:'unavailable'},503)}
}
export default {async fetch(request,env){
 const path=new URL(request.url).pathname;
 if(path==='/api/leads')return captureLead(request,env);
 if(path.startsWith('/api/'))return json({error:'not_found'},404);
 return env.ASSETS.fetch(request);
}};
