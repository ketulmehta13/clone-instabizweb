import { usePageMeta } from '../lib/usePageMeta'

export default function GoneHome() {
  usePageMeta('Gone home')
  return (
    <div data-page="gone" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] py-24">
        <h1 className="font-plush text-giant">Gone home</h1>
      </div>
    </div>
  )
}
