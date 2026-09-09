import { serverWhop } from './whopClient'

const ACCOUNT_ID = 'biz_jdcD3rL9FLYsxy'
export const STARTER_PRODUCT_ID = 'prod_gLMGkps62VudF'
export const ASCENDING_PRODUCT_ID = 'prod_JYWg9jHMiYBQE'

/** The visitor's Starter or Ascending membership, if they hold one — used to persist their progress durably. */
export async function findPaidMembership(userId: string) {
  const client = serverWhop()
  const page = await client.memberships.list({ account_id: ACCOUNT_ID, user_id: userId, first: 20 })
  return (
    page.data.find(
      (m) =>
        (m.product_id === STARTER_PRODUCT_ID || m.product_id === ASCENDING_PRODUCT_ID) &&
        (m.status === 'active' || m.status === 'trialing' || m.status === 'completed' || m.status === 'past_due'),
    ) ?? null
  )
}
