import { describe, expect, it } from 'vitest'
import { screen } from '@solidjs/testing-library'
import globalsCss from '@/routes/globals.css?raw'
import { Button, Card, CardContent } from '@/components/ui'
import { render } from '../utils/theme-test-utils'

describe('color harmony', () => {
  it('defines the monochrome palette tokens in globals.css', () => {
    expect(globalsCss).toContain('--background: #ffffff;')
    expect(globalsCss).toContain('--foreground: #000000;')
    expect(globalsCss).toContain('--muted: #f5f5f5;')
    expect(globalsCss).toContain('--selection-bg: #000000;')
  })

  it('defines the dark palette overrides in globals.css', () => {
    expect(globalsCss).toContain('.dark {')
    expect(globalsCss).toContain('--background: #000000;')
    expect(globalsCss).toContain('--foreground: #ffffff;')
    expect(globalsCss).toContain('--muted: #0f0f0f;')
    expect(globalsCss).toContain('--selection-bg: #ffffff;')
  })

  it('uses shared border and background classes for reusable ui primitives', () => {
    const view = render(() => (
      <Card>
        <CardContent>
          <Button variant="outline">Outline action</Button>
        </CardContent>
      </Card>
    ))

    const card = view.container.querySelector('section')
    const button = screen.getByRole('button', { name: 'Outline action' })

    expect(card?.className).toContain('border-foreground')
    expect(card?.className).toContain('bg-card')
    expect(button.className).toContain('border-foreground')
  })
})
