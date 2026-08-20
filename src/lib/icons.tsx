import type { ComponentType } from 'react'
import Search from 'reicon-react/icons/Search'
import BookOpen from 'reicon-react/icons/BookOpen'
import ListCheck from 'reicon-react/icons/ListCheck'
import Route from 'reicon-react/icons/Route'
import CalendarDays from 'reicon-react/icons/CalendarDays'
import Verified from 'reicon-react/icons/Verified'
import Files from 'reicon-react/icons/Files'
import Handshake from 'reicon-react/icons/Handshake'
import ArrowRightCircle from 'reicon-react/icons/ArrowRightCircle'
import Sparkles from 'reicon-react/icons/Sparkles'
import AlertTriangle from 'reicon-react/icons/AlertTriangle'
import Lightbulb from 'reicon-react/icons/Lightbulb'
import Grid from 'reicon-react/icons/Grid'
import Settings2 from 'reicon-react/icons/Settings2'
import Diagram from 'reicon-react/icons/Diagram'
import CalendarCircle from 'reicon-react/icons/CalendarCircle'
import Users from 'reicon-react/icons/Users'
import Paperclip from 'reicon-react/icons/Paperclip'
import UserCheck from 'reicon-react/icons/UserCheck'
import Forbidden from 'reicon-react/icons/Forbidden'
import CheckCircle from 'reicon-react/icons/CheckCircle'
import Repeat from 'reicon-react/icons/Repeat'
import Refresh from 'reicon-react/icons/Refresh'
import ImageIcon from 'reicon-react/icons/Image'
import X from 'reicon-react/icons/X'
import Edit2 from 'reicon-react/icons/Edit2'
import Layout from 'reicon-react/icons/Layout'
import HelpCircle from 'reicon-react/icons/HelpCircle'
import FilePlus from 'reicon-react/icons/FilePlus'
import Undo from 'reicon-react/icons/Undo'
import Printer from 'reicon-react/icons/Printer'
import Plus from 'reicon-react/icons/Plus'
import Cursor from 'reicon-react/icons/Cursor'
import ArrowRight from 'reicon-react/icons/ArrowRight'
import Infinite from 'reicon-react/icons/Infinite'
import ShieldCheck from 'reicon-react/icons/ShieldCheck'
import CalendarCheck from 'reicon-react/icons/CalendarCheck'
import FileCheck from 'reicon-react/icons/FileCheck'
import Gear from 'reicon-react/icons/Gear'
import PenTool from 'reicon-react/icons/PenTool'
import Folder from 'reicon-react/icons/Folder'
import TrendUp from 'reicon-react/icons/TrendUp'
import Target from 'reicon-react/icons/Target'
import List from 'reicon-react/icons/List'
import Check from 'reicon-react/icons/Check'
import Minus from 'reicon-react/icons/Minus'

// Registro de íconos por nombre semántico (mismos nombres que usaba el vanilla vía
// Lucide) → componente real de reicon-react. A diferencia del vanilla, un nombre
// inválido acá es un error de compilación (import roto), no un ícono que
// silenciosamente no dibuja nada — ver CLAUDE.md original, "Bugs ya resueltos".
// reicon-react no tiene exactamente el mismo set que Lucide: algunos son la
// alternativa semánticamente más cercana disponible (ver comentarios).
export const ICONS = {
  search: Search,
  'book-open': BookOpen,
  'list-checks': ListCheck,
  'git-branch': Route, // no hay "fork" de proceso en reicon-react; Route es lo más cercano
  'calendar-days': CalendarDays,
  'badge-check': Verified,
  files: Files,
  handshake: Handshake,
  'arrow-right-circle': ArrowRightCircle,
  sparkles: Sparkles,
  'alert-triangle': AlertTriangle,
  lightbulb: Lightbulb,
  'table-2': Grid,
  'settings-2': Settings2,
  workflow: Diagram,
  'calendar-clock': CalendarCircle,
  users: Users,
  paperclip: Paperclip,
  'user-check': UserCheck,
  'circle-slash': Forbidden,
  'check-circle-2': CheckCircle,
  repeat: Repeat,
  'refresh-cw': Refresh,
  image: ImageIcon,
  x: X,
  'pencil-line': Edit2,
  'layout-list': Layout,
  'help-circle': HelpCircle,
  'file-plus': FilePlus,
  'undo-2': Undo,
  printer: Printer,
  plus: Plus,
  'mouse-pointer-click': Cursor,
  'arrow-right': ArrowRight,
  infinity: Infinite,
  'shield-check': ShieldCheck,
  'calendar-check': CalendarCheck,
  'file-check': FileCheck,
  wrench: Gear,
  'pen-tool': PenTool,
  'folder-clock': Folder,
  'trending-up': TrendUp,
  'circle-dot': Target,
  list: List,
  check: Check,
  minus: Minus,
} as const satisfies Record<string, ComponentType<{ size?: number; strokeWidth?: number; className?: string }>>

export type IconName = keyof typeof ICONS
