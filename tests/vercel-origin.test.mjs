import test from 'node:test';
import assert from 'node:assert/strict';
import { NodeApp } from 'astro/app/node';
import config from '../astro.config.mjs';

const forwardedRequest = host => NodeApp.createRequest({
  method:'GET',url:'/api/contact',socket:{},
  headers:{host,'x-forwarded-host':host,'x-forwarded-proto':'https'},
},{allowedDomains:config.security?.allowedDomains});

test('conserva el origen HTTPS del dominio público al pasar por Vercel',()=>{
  assert.equal(new URL(forwardedRequest('big-marketing-sand.vercel.app').url).origin,'https://big-marketing-sand.vercel.app');
});
test('no confía en dominios ajenos enviados en cabeceras proxy',()=>{
  assert.notEqual(new URL(forwardedRequest('other.vercel.app').url).hostname,'other.vercel.app');
});
