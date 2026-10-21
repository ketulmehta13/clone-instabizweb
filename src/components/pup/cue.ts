/** Ask the walking Teddy to glance at something on the page and/or say a few words */
export type PupCue = { look?: Element; secs?: number; say?: string }

export function cuePup(cue: PupCue) {
  dispatchEvent(new CustomEvent<PupCue>('pup:cue', { detail: cue }))
}
