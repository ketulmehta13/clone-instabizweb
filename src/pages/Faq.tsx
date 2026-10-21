import { usePageMeta } from '../lib/usePageMeta'

export default function Faq() {
  usePageMeta('Questions & answers')
  return (
    <div data-page="faq" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] py-24">
        <h1 className="font-plush text-giant">Questions & answers</h1>
      </div>
    </div>
  )
}
