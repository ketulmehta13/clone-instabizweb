import { site, whatsappLink } from '../../data/site'

/** Phone-only bar stuck to the bottom of the screen */
export function WhatsAppBar() {
  return (
    <div
      data-whatsapp-bar=""
      className="fixed inset-x-0 bottom-0 z-40 border-t-2 border-cocoa bg-milk px-3 pb-[calc(0.6rem+env(safe-area-inset-bottom))] pt-2.5 md:hidden"
    >
      <div className="mx-auto flex max-w-md gap-2">
        <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="btn btn-whatsapp !min-h-12 flex-1 !shadow-none">
          WhatsApp us
        </a>
        <a href={`tel:${site.phone}`} className="btn btn-ghost !min-h-12 !px-5">
          Call
        </a>
      </div>
    </div>
  )
}
