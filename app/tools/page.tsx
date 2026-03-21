import type { Metadata } from 'next'
import SocialIcon from '@/components/SocialIcon'

export const metadata: Metadata = {
  title: 'Tools',
  description: 'Open source automation tools and templates by Archit Mittal. GitHub repos, n8n workflows, and more.',
}

const TOOLS = [
  {
    name: 'AI API Cost Optimizer',
    description: 'Toolkit for reducing LLM API costs with smart caching, model switching, and request batching.',
    url: 'https://github.com/archit-akg13',
    tags: ['Python', 'LLM', 'Cost Optimization'],
  },
  {
    name: 'n8n Workflow Templates',
    description: 'Ready-to-use n8n workflow templates for common business automation scenarios.',
    url: 'https://github.com/archit-akg13',
    tags: ['n8n', 'Automation', 'No-Code'],
  },
  {
    name: 'MCP Server Toolkit',
    description: 'Tools and utilities for building MCP protocol servers for AI agent integration.',
    url: 'https://github.com/archit-akg13',
    tags: ['MCP', 'AI Agents', 'TypeScript'],
  },
]

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      <h1 className="font-heading font-bold text-3xl sm:text-4xl text-heading mb-3">Tools</h1>
      <p className="font-body text-body mb-10">
        Open source tools and templates for automation. Fork, use, and contribute.
      </p>

      <div className="space-y-4">
        {TOOLS.map((tool) => (
          <a
            key={tool.name}
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block border border-gray-200 rounded-xl p-6 hover:border-lime transition-colors group"
          >
            <div className="flex items-start gap-4">
              <SocialIcon name="github" className="w-6 h-6 text-subtle group-hover:text-lime transition-colors flex-shrink-0 mt-1" />
              <div>
                <h2 className="font-heading font-semibold text-heading group-hover:text-lime transition-colors mb-1">
                  {tool.name}
                </h2>
                <p className="font-body text-body text-sm mb-2">{tool.description}</p>
                <div className="flex gap-2">
                  {tool.tags.map((tag) => (
                    <span key={tag} className="bg-gray-100 text-body text-xs px-2 py-1 rounded font-body">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  )
}
