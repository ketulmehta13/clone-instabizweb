import { usePageMeta } from '../lib/usePageMeta'

export default function Puppies() {
  usePageMeta('Available puppies')
  return (
    <div data-page="puppies" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] py-24">
        <h1 className="font-plush text-giant">Available puppies</h1>
      </div>
    </div>
  )
}
