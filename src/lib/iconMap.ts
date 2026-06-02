import {
  Scale, Gavel, Landmark, Building2, Building, Briefcase, FileText, FileSignature,
  Scroll, Stamp, BookOpen, Library, ShieldCheck, Shield, Lock, KeyRound, Award,
  BadgeCheck, Crown, Gem, Star, Users, UserCheck, Handshake, Target, Eye, Telescope,
  Compass, Brain, Lightbulb, Zap, TrendingUp, BarChart2, PieChart, LineChart, Coins,
  Banknote, Wallet, Receipt, Globe, Network, GitBranch, Hotel, Store, Factory, Home,
  Heart, CheckCircle2, Phone, Mail, MapPin, Clock,
  type LucideIcon,
} from 'lucide-react'

// Curated, law-firm-relevant icon set used by the IconPicker and dynamic renderers.
export const ICON_MAP: Record<string, LucideIcon> = {
  Scale, Gavel, Landmark, Building2, Building, Briefcase, FileText, FileSignature,
  Scroll, Stamp, BookOpen, Library, ShieldCheck, Shield, Lock, KeyRound, Award,
  BadgeCheck, Crown, Gem, Star, Users, UserCheck, Handshake, Target, Eye, Telescope,
  Compass, Brain, Lightbulb, Zap, TrendingUp, BarChart2, PieChart, LineChart, Coins,
  Banknote, Wallet, Receipt, Globe, Network, GitBranch, Hotel, Store, Factory, Home,
  Heart, CheckCircle2, Phone, Mail, MapPin, Clock,
}

export const ICON_NAMES = Object.keys(ICON_MAP)

export function getIcon(name?: string | null): LucideIcon | null {
  if (!name) return null
  return ICON_MAP[name] ?? null
}
