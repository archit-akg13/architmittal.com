import type { Metadata } from 'next'
import fs from 'node:fs'
import path from 'node:path'
import PackLibrary from '@/components/packs/PackLibrary'

export const metadata: Metadata = {
  title: 'Free automation packs — n8n workflows + Claude skills',
  description:
    'Every n8n workflow and Claude skill I post on Instagram, in one place. Free. Enter your email once and download any of them.',
  alternates: { canonical: 'https://architmittal.com/packs/' },
  openGraph: {
    title: 'Free automation packs — n8n workflows + Claude skills',
    description: 'Every workflow and skill from @learnaiwitharchit. Free, one email.',
    url: 'https://architmittal.com/packs/',
  },
}

export type PackItem = {
  id: string
  title: string
  pillar: string
  description?: string
  nodes?: number
  integrations?: string[]
  file: string
}

export default function PacksPage() {
  const index = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'public', 'packs', 'index.json'), 'utf8')) as {
    workflows: PackItem[]
    skills: PackItem[]
  }
  return <PackLibrary workflows={index.workflows} skills={index.skills} />
}
