// Runner for `pnpm seed`. `payload run` evaluates this file with top-level
// await, so we boot Payload and invoke the seed routine here. seed.ts only
// *exports* seed(); importing it must stay side-effect free (the /seed route
// imports it too), so the invocation lives in this separate file.
import { getPayload } from 'payload'
import config from '@payload-config'
import { seed } from './seed'

const payload = await getPayload({ config })
const result = await seed(payload)
payload.logger.info(`Seed finished: ${JSON.stringify(result)}`)
process.exit(0)
