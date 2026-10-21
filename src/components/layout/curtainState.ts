/** How far the opening "curtain" animation has got (ms), or Infinity once it's done */
export function curtainIntroTime() {
  const anim = document
    .querySelector('.tp-curtain')
    ?.getAnimations()
    .find((a) => (a as CSSAnimation).animationName === 'tp-curtain-rest')
  return anim && anim.playState !== 'finished' && typeof anim.currentTime === 'number' ? anim.currentTime : Infinity
}

/** True while the page-change curtain is covering the screen */
export function curtainDown() {
  const state = document.querySelector<HTMLElement>('.tp-curtain')?.dataset.state
  return (state === 'intro' && curtainIntroTime() < 560) || state === 'covering' || state === 'covered' || state === 'snap'
}
