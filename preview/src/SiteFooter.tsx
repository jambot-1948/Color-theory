import { reviewedLabel, reviewedOn } from './reviewed'

export default function SiteFooter() {
  return <footer className="bw-footer"><p><strong>As of <time dateTime={reviewedOn}>{reviewedLabel}</time>.</strong> Products, pairings, and product details were last checked then. Products change faster than the capabilities they fill, so check a product’s own documentation before relying on it here. Pairings are recorded, not tested.</p></footer>
}
