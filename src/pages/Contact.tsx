import { usePageMeta } from '../lib/usePageMeta'

export default function Contact() {
  usePageMeta('Visit & contact')
  return (
    <div data-page="contact" className="tp-page">
      <div className="gutter mx-auto max-w-[110rem] py-24">
        <h1 className="font-plush text-giant">Visit & contact</h1>
      </div>
    </div>
  )
}
