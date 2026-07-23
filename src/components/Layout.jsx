import { motion } from 'framer-motion';
import { useDate } from '../context/DateContext';
export function Shell({ children, step }) { return <main className="shell"><div className="sparkles">💗　✨　💕　⭐　💗　✨</div>{step && <div className="progress"><span>Step {step}/6</span><div><i style={{width:`${step / 6 * 100}%`}} /></div></div>}<motion.section className="card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -15 }} transition={{ duration: .35 }}>{children}</motion.section></main>; }
export function Button({ children, className = '', ...props }) { return <motion.button className={`button ${className}`} whileHover={{scale:1.04}} whileTap={{scale:.96}} {...props}>{children}</motion.button>; }
export function DarkToggle() { const { update } = useDate(); return <button className="dark" onClick={() => { document.documentElement.classList.toggle('darkmode'); update({}); }} aria-label="Toggle dark mode">◐</button>; }
