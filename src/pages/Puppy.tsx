import { usePageMeta } from '../lib/usePageMeta'

export default function Puppy() {
  usePageMeta('Puppy')
  return (
    <div data-page="pup" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] py-24">
        <h1 className="font-plush text-giant">Puppy</h1>
      </div>
    </div>
  )
}
