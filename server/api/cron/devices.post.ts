import { requireCronAuthorization } from '../../utils/cron-auth'
import { runIdempotentCron } from '../../utils/cron-job'
import { createRandomDevice } from '../../utils/random-data'

export default defineEventHandler(async (event) => {
  requireCronAuthorization(event)

  const result = await runIdempotentCron({
    jobName: 'populate-device',
    intervalHours: 8,
    insertAsset: async (client) => {
      const input = createRandomDevice()
      const inserted = await client.query({
        text: `
          INSERT INTO asset_compliance.stock_devices (brand, cpu, ram_gb, gpu)
          VALUES ($1, $2, $3, $4)
          RETURNING number, asset_id, brand, cpu, ram_gb, gpu
        `,
        values: [input.brand, input.cpu, input.ramGb, input.gpu]
      })
      const row = inserted.rows[0]
      return {
        number: Number(row.number),
        assetId: row.asset_id,
        brand: row.brand,
        cpu: Number(row.cpu),
        ram: `${Number(row.ram_gb)} GB`,
        gpu: row.gpu
      }
    }
  })

  setResponseStatus(event, result.created ? 201 : 200)
  return result
})
