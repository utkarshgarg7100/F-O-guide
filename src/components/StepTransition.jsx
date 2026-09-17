/** Fades + nudges content in from the side it came from. Re-keyed per screen by the parent. */
export default function StepTransition({ direction, children, className = '' }) {
  const animation =
    direction < 0 ? 'animate-[step-in-back_280ms_cubic-bezier(0.16,1,0.3,1)]' : 'animate-[step-in-next_280ms_cubic-bezier(0.16,1,0.3,1)]'
  return <div className={`${animation} motion-reduce:animate-none ${className}`}>{children}</div>
}
