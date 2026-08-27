#!/usr/bin/env node
/**
 * Site layout gate — the same discipline as the carousel QA: every visual objection
 * Archit has raised becomes a measured check. Run against a local `next start` or prod.
 *
 *   node scripts/site-qa.mjs [--base http://127.0.0.1:3111]
 *
 * Checks per page × width: broken images, horizontal scroll, and pairwise overlap of
 * headline/stat/card elements. Exits non-zero with a list on any failure.
 */
import { execFileSync, spawn } from 'node:child_process'

const BASE = process.argv.includes('--base') ? process.argv[process.argv.indexOf('--base') + 1] : 'http://127.0.0.1:3111'
const PY = process.env.HOME + '/claude_projects/social_media_project/work/carousel-v4/.venv/bin/python'
const script = `
from playwright.sync_api import sync_playwright
import json, sys
PAGES=['/','/blog','/case-studies','/about','/contact','/book','/packs']
WIDTHS=[375,768,1024,1280,1518]
problems=[]
with sync_playwright() as p:
    b=p.chromium.launch()
    for w in WIDTHS:
        pg=b.new_page(viewport={'width':w,'height':900})
        for u in PAGES:
            try:
                pg.goto('${BASE}'+u,timeout=30000); pg.wait_for_timeout(1100)
            except Exception as e:
                problems.append(f'{u}@{w}: load failed {str(e)[:60]}'); continue
            broken=pg.evaluate('[...document.images].filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.slice(-60))')
            for src in broken: problems.append(f'{u}@{w}: broken image …{src}')
            sw=pg.evaluate('document.documentElement.scrollWidth')
            if sw>w: problems.append(f'{u}@{w}: horizontal scroll {sw}px')
            ov=pg.evaluate('''(() => {
              const sels='h1,h2,.display,.dcard,.eyebrow';
              const els=[...document.querySelectorAll(sels)].filter(e=>e.offsetParent!==null);
              const out=[];
              for(let i=0;i<els.length;i++)for(let j=i+1;j<els.length;j++){
                const a=els[i],bx=els[j];
                if(a.contains(bx)||bx.contains(a))continue;
                const r=a.getBoundingClientRect(),s=bx.getBoundingClientRect();
                if(r.width<8||s.width<8)continue;
                const x=Math.min(r.right,s.right)-Math.max(r.left,s.left);
                const y=Math.min(r.bottom,s.bottom)-Math.max(r.top,s.top);
                if(x>12&&y>12) out.push((a.textContent||'').trim().slice(0,26)+' <-> '+(bx.textContent||'').trim().slice(0,26));
              }
              return out.slice(0,4) })()''')
            for o in ov: problems.append(f'{u}@{w}: OVERLAP {o}')
        pg.close()
    b.close()
print(json.dumps(problems))
`
const out = execFileSync(PY, ['-c', script], { encoding: 'utf8', timeout: 600e3 })
const problems = JSON.parse(out.trim().split('\n').pop())
if (problems.length) {
  console.error(`SITE QA: ${problems.length} problem(s)`)
  for (const p of problems) console.error('  FAIL ' + p)
  process.exit(1)
}
console.log('SITE QA: clean across 7 pages × 5 widths')
