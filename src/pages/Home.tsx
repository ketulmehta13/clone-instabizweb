import { usePageMeta } from '../lib/usePageMeta'

export default function Home() {
  usePageMeta(null)
  return (
    <div data-page="home" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] py-24">
        <h1 className="font-plush text-giant">Home</h1>
      </div>
    </div>
  )
}
