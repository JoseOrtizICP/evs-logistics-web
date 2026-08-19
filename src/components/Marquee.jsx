import { motion } from 'framer-motion'
import useIsMobile from '../hooks/useIsMobile'
import { T } from '../tema'

const flagsRow1 = ['🇲🇽','🇺🇸','🇨🇳','🇪🇨','🇨🇴','🇩🇴','🇧🇷','🇩🇪','🇯🇵','🇰🇷','🇬🇧','🇫🇷','🇮🇳','🇨🇦','🇦🇷','🇨🇱','🇵🇪','🇵🇦','🇪🇸','🇮🇹']
const flagsRow2 = ['🇹🇼','🇹🇭','🇻🇳','🇸🇬','🇳🇱','🇧🇪','🇦🇪','🇹🇷','🇵🇹','🇸🇪','🇵🇱','🇦🇺','🇳🇿','🇿🇦','🇬🇹','🇭🇳','🇨🇷','🇵🇾','🇺🇾','🇲🇾']

const MarqueeRow = ({ flags, direction = 'left', speed = 30, isMobile }) => {
  const tripled = [...flags, ...flags, ...flags]
  return (
    <div style={{
      overflow: 'hidden',
      padding: isMobile ? '4px 0' : '8px 0',
      maskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)',
      WebkitMaskImage: 'linear-gradient(90deg, transparent, black 8%, black 92%, transparent)'
    }}>
      <motion.div
        style={{ display: 'flex', gap: isMobile ? '12px' : '20px', width: 'fit-content' }}
        animate={{ x: direction === 'left' ? ['0%', '-33.33%'] : ['-33.33%', '0%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {tripled.map((flag, i) => (
          <span key={i} style={{ fontSize: isMobile ? '22px' : '32px', lineHeight: 1, flexShrink: 0 }}>{flag}</span>
        ))}
      </motion.div>
    </div>
  )
}

const Marquee = () => {
  const isMobile = useIsMobile()
  return (
    <section style={{
      background: T.banda,
      padding: isMobile ? '16px 0' : '24px 0',
      position: 'relative',
      overflow: 'hidden',
      borderTop: `1px solid ${T.bandaBorde}`,
      borderBottom: `1px solid ${T.bandaBorde}`
    }}>
      <p style={{
        textAlign: 'center',
        fontSize: isMobile ? '10px' : '11px',
        fontWeight: 600,
        letterSpacing: '3px',
        textTransform: 'uppercase',
        color: 'rgba(99,179,237,0.4)',
        marginBottom: isMobile ? '8px' : '12px'
      }}>
        Conectamos el mundo
      </p>
      <MarqueeRow flags={flagsRow1} direction="left" speed={25} isMobile={isMobile} />
      <MarqueeRow flags={flagsRow2} direction="right" speed={30} isMobile={isMobile} />
    </section>
  )
}

export default Marquee
