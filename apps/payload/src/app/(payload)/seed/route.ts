import { getPayload } from 'payload'
import config from '@payload-config'

import { seed } from '../../../seed'

// One-time seeding endpoint. Protected by a token so it is safe to leave deployed.
// Usage: GET /seed?token=$SEED_TOKEN   (SEED_TOKEN defaults to PAYLOAD_SECRET)
export const GET = async (req: Request) => {
  const expected = process.env.SEED_TOKEN || process.env.PAYLOAD_SECRET
  const token = new URL(req.url).searchParams.get('token')

  if (!expected || token !== expected) {
    return Response.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const payload = await getPayload({ config })
  const result = await seed(payload)
  return Response.json({ ok: true, ...result })
}
