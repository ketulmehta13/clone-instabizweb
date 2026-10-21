import { usePageMeta } from '../lib/usePageMeta'

export default function HowItWorks() {
  usePageMeta('How it works')
  return (
    <div data-page="how" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] py-24">
        <h1 className="font-plush text-giant">How it works</h1>
      </div>
    </div>
  )
}
