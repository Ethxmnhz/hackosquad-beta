import { Globe, Key, Search, Code, Binary, Eye, DivideIcon as LucideIcon } from 'lucide-react';

export const categoryIcons: Record<string, LucideIcon> = {
  'Web': Globe,
  'Crypto': Key,
  'Forensics': Search,
  'Reverse Engineering': Code,
  'Binary Exploitation': Binary,
  'OSINT': Eye
};

export const defaultCategoryIcon = Globe;

export const getCategoryIcon = (category: string): LucideIcon => {
  return categoryIcons[category] || defaultCategoryIcon;
};