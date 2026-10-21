import { usePageMeta } from '../lib/usePageMeta'

export default function HappyFamilies() {
  usePageMeta('Happy families')
  return (
    <div data-page="families" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] py-24">
        <h1 className="font-plush text-giant">Happy families</h1>
      </div>
    </div>
  )
}
