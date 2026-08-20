import { ICONS, type IconName } from '../lib/icons'

interface Props {
  name: IconName
  size?: number
  strokeWidth?: number
  className?: string
}

export function Icon({ name, size = 14, strokeWidth = 2, className }: Props) {
  const Cmp = ICONS[name]
  return <Cmp size={size} strokeWidth={strokeWidth} className={className} />
}
