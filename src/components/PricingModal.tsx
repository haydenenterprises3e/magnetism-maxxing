import { PLANS } from '../lib/plans'

export function PricingModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null

  return (
    <div className="quiz-overlay" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="quiz-modal pricing-modal" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="quiz-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="section-eyebrow">Choose Your Rank</div>
        <h3 className="quiz-question-title">Enter the gate</h3>
        <p className="quiz-question-sub">Cancel anytime. No contracts, no hidden tiers.</p>

        <div className="pricing-grid" style={{ marginTop: 32 }}>
          {PLANS.map((plan) => (
            <div key={plan.key} className={`price-card${plan.featured ? ' featured' : ''}`}>
              <div className="price-rank">{plan.rankLabel}</div>
              <div className="price-amount">
                ${plan.introPrice}
                <span>first month</span>
              </div>
              <div className="price-then">then ${plan.price}/mo</div>
              <ul className="price-list">
                {plan.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
              <a
                className="price-btn"
                href={plan.purchaseUrl}
                onClick={() => window.whop?.track('view_content', { plan: plan.title, value: plan.price, currency: 'USD' })}
              >
                {plan.ctaLabel}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
