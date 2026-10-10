// All Ophira enquiries are stored in the existing Sites database.
const upstream='https://ophira-resort-residences.hans-01.chatgpt.site/api/leads';
const pagesOrigin='https://haneeshazli.github.io';
function headers(request){const h={'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Vary':'Origin'};if(request.headers.get('origin')===pagesOrigin){h['Access-Control-Allow-Origin']=pagesOrigin;h['Access-Control-Allow-Methods']='POST, OPTIONS';h['Access-Control-Allow-Headers']='Content-Type'}return h;}
const reply=(request,data,status)=>Response.json(data,{status,headers:headers(request)});
export function OPTIONS(request){return new Response(null,{status:request.headers.get('origin')===pagesOrigin?204:403,headers:headers(request)})}
export async function POST(request){
 const origin=request.headers.get('origin');
 if(origin&&origin!==new URL(request.url).origin&&origin!==pagesOrigin)return reply(request,{error:'origin'},403);
 if(!request.headers.get('content-type')?.startsWith('application/json'))return reply(request,{error:'content_type'},415);
 if(Number(request.headers.get('content-length'))>4096)return reply(request,{error:'too_large'},413);
 let body;try{body=await request.text();if(body.length>4096)return reply(request,{error:'too_large'},413);const value=JSON.parse(body);if(!value||Array.isArray(value)||typeof value!=='object')return reply(request,{error:'validation'},400)}catch{return reply(request,{error:'invalid'},400)}
 try{
  // Send only the submitted JSON, never visitor cookies or authentication headers.
  const response=await fetch(upstream,{method:'POST',headers:{'Content-Type':'application/json'},body,redirect:'error',signal:AbortSignal.timeout(15000)});
  if(!response.ok)return reply(request,{error:response.status===400?'validation':'unavailable'},response.status===400?400:503);
  const result=await response.json();if(result.ok!==true)throw new Error('Unexpected lead service response');
  return reply(request,{ok:true},201);
 }catch{console.error('Ophira lead service unavailable');return reply(request,{error:'unavailable'},503)}
}
