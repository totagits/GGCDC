import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
import { NextRequest, NextResponse } from 'next/server';
const response=(message:string,status:number)=>NextResponse.json({error:message},{status});
export async function GET(req:NextRequest){
 const user=await getChatGPTUser(); if(!user) return response('Sign in required',401);
 try { const module=req.nextUrl.searchParams.get('module'); const rows=module?await env.DB!.prepare('SELECT * FROM records WHERE module = ? ORDER BY updated_at DESC').bind(module).all():await env.DB!.prepare('SELECT * FROM records ORDER BY updated_at DESC').all(); const links=await env.DB!.prepare('SELECT * FROM record_links').all(); return NextResponse.json({records:rows.results,links:links.results}); } catch {return response('Records are temporarily unavailable',503)}
}
export async function POST(req:NextRequest){
 const user=await getChatGPTUser(); if(!user)return response('Sign in required',401);
 let data:any;try{data=await req.json()}catch{return response('Invalid request',400)}
 const allowed=['agreements','land','employment','workforce','procurement','suppliers','skills','environment','infrastructure','benefits','grievances','transparency','monitoring','governance'];
 if(!allowed.includes(data.module)||typeof data.title!=='string'||!data.title.trim()||data.title.length>180)return response('A valid module and title are required',400);
 const id=crypto.randomUUID(), now=new Date().toISOString(); const details=JSON.stringify(data.details&&typeof data.details==='object'?data.details:{}); if(details.length>16000)return response('Record is too large',400);if(data.module==='workforce'&&data.details?.consent!=='Yes')return response('Applicant consent is required',400);
 try{await env.DB!.batch([env.DB!.prepare('INSERT INTO records (id,module,title,status,county,community,owner,due_date,summary,details,created_by,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)').bind(id,data.module,data.title.trim(),data.status||'Draft',data.county||null,data.community||null,data.owner||null,data.dueDate||null,data.summary||null,details,user.email,now,now),env.DB!.prepare('INSERT INTO record_events (id,record_id,actor,action,note,at) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),id,user.email,'Created',null,now)]);return NextResponse.json({id},{status:201})}catch{return response('Could not save record',503)}
}
export async function PATCH(req:NextRequest){
 const user=await getChatGPTUser();if(!user)return response('Sign in required',401);
 let data:any;try{data=await req.json()}catch{return response('Invalid request',400)}
 if(typeof data.id!=='string')return response('Record ID required',400);
 try{const existing=await env.DB!.prepare('SELECT id FROM records WHERE id = ?').bind(data.id).first();if(!existing)return response('Record not found',404);const now=new Date().toISOString(),details=JSON.stringify(data.details&&typeof data.details==='object'?data.details:{});if(details.length>16000)return response('Record is too large',400);if(data.module==='workforce'&&data.details?.consent!=='Yes')return response('Applicant consent is required',400);await env.DB!.batch([env.DB!.prepare('UPDATE records SET title=?,status=?,county=?,community=?,owner=?,due_date=?,summary=?,details=?,updated_at=? WHERE id=?').bind(String(data.title||'').slice(0,180),data.status||'Draft',data.county||null,data.community||null,data.owner||null,data.dueDate||null,data.summary||null,details,now,data.id),env.DB!.prepare('INSERT INTO record_events (id,record_id,actor,action,note,at) VALUES (?,?,?,?,?,?)').bind(crypto.randomUUID(),data.id,user.email,'Updated',data.note||null,now)]);return NextResponse.json({ok:true})}catch{return response('Could not update record',503)}
}
