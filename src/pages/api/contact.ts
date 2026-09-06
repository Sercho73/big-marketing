import type { APIRoute } from 'astro';
import { handleContact } from '../../lib/contact.mjs';

export const prerender = false;
export const POST: APIRoute = async ({request}) => handleContact(request, {
  url: import.meta.env.SUPABASE_URL,
  key: import.meta.env.SUPABASE_SERVICE_ROLE_KEY,
});
