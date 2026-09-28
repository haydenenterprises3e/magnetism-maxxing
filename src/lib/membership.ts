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

export type MembershipWebhookData = {
  id: string
  status: string
  user: { id: string }
  product: { id: string }
}

/** Called from the webhook on membership.activated / membership.deactivated. */
export async function syncMembershipFromWebhook(data: MembershipWebhookData) {
  const userId = data.user.id
  const productId = data.product.id
  const status = data.status

  if (productId !== STARTER_PRODUCT_ID && productId !== ASCENDING_PRODUCT_ID) {
    return // not a product we care about
  }

  // NOTE: access checks in session.ts (hasActiveProductAccess / accessLevel)
  // already hit Whop's API live on every gated page load, so this handler
  // doesn't need to grant/revoke access itself — Whop is the source of truth.
  // This is the place to update anything YOU store locally that should
  // reflect membership status, e.g.:
  //   - tagging saved progress rows with the user's current plan tier
  //   - invalidating a cache entry keyed by user_id
  //   - sending a welcome/cancellation email
  console.log(`[membership] ${userId} ${productId} -> ${status}`)
}
