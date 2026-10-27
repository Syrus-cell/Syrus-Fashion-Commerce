import { createClient } from '@insforge/sdk';

const baseUrl = process.env.NEXT_PUBLIC_INSFORGE_URL || 'https://jar7p68m.us-east.insforge.app';
const anonKey = process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY || 'anon_8a16658e6c8a692320d1f45c345e3d5bf6c8a7c2c17825b2e0965795ad35901d';

export const insforge = createClient({
  baseUrl,
  anonKey,
});

