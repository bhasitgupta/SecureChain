import { Button } from './button';
import { Moon } from 'lucide-react';
import { cn } from '../../lib/utils';
import { motion } from 'motion/react';
import './button-border.css';

/**
 * Reusable animated border runner for any box, card, or button.
 * Uses motion/react offsetPath animation with mask clip.
 */
export function AnimatedBorder({
  radius = 16,
  size = 60,
  duration = 5,
  colorFrom = 'transparent',
  colorVia = 'rgba(255, 0, 0, 0.45)',
  colorTo = '#FF0000',
  className = '',
}) {
  return (
    <div className={cn('animated-border-wrapper', className)}>
      <motion.div
        className="animated-border-runner"
        animate={{
          offsetDistance: ['0%', '100%'],
        }}
        style={{
          width: size,
          background: `linear-gradient(90deg, ${colorFrom}, ${colorVia}, ${colorTo})`,
          offsetPath: `rect(0 auto auto 0 round ${radius}px)`,
        }}
        transition={{
          repeat: Infinity,
          duration: duration,
          ease: 'linear',
        }}
      />
    </div>
  );
}

export function ButtonDemo() {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Button variant="outline" className="relative">
        <AnimatedBorder radius={8} size={25} duration={4} />
        <Moon size={18} />
      </Button>

      <Button variant="outline" className="relative">
        <AnimatedBorder radius={8} size={35} duration={5} />
        Animated Border
      </Button>
    </div>
  );
}

export default AnimatedBorder;
