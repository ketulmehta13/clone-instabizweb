import { useEffect } from 'react'

const SITE = 'TeddyPups U.A.E.'

/** Sets the browser-tab title and the search-engine description for a page */
export function usePageMeta(title: string | null, description?: string) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE}` : `${SITE} — Premium teacup puppies in Dubai`
    if (description) document.querySelector('meta[name="description"]')?.setAttribute('content', description)
  }, [title, description])
}
