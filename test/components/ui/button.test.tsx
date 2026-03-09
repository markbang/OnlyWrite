import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui'

describe('Button', () => {
  it('renders button text', () => {
    render(() => <Button>Save</Button>)

    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
  })

  it('uses button as the default type', () => {
    render(() => <Button>Default</Button>)

    expect(screen.getByRole('button')).toHaveAttribute('type', 'button')
  })

  it('supports custom type and aria-label', () => {
    render(() => (
      <Button type="submit" aria-label="Submit form">
        Submit
      </Button>
    ))

    const button = screen.getByLabelText('Submit form')
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('applies variant classes', () => {
    render(() => (
      <div>
        <Button>Primary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="danger">Danger</Button>
      </div>
    ))

    expect(screen.getByRole('button', { name: 'Primary' }).className).toContain('bg-foreground')
    expect(screen.getByRole('button', { name: 'Outline' }).className).toContain('border-foreground')
    expect(screen.getByRole('button', { name: 'Ghost' }).className).toContain('bg-transparent')
    expect(screen.getByRole('button', { name: 'Secondary' }).className).toContain('bg-muted')
    expect(screen.getByRole('button', { name: 'Danger' }).className).toContain('border-destructive')
  })

  it('applies size classes and merges custom classes', () => {
    render(() => (
      <>
        <Button size="sm">Small</Button>
        <Button size="lg" class="custom-class">
          Large
        </Button>
      </>
    ))

    expect(screen.getByRole('button', { name: 'Small' }).className).toContain('h-8')
    expect(screen.getByRole('button', { name: 'Large' }).className).toContain('h-11')
    expect(screen.getByRole('button', { name: 'Large' }).className).toContain('custom-class')
  })

  it('handles click events', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(() => <Button onClick={onClick}>Click me</Button>)
    await user.click(screen.getByRole('button', { name: 'Click me' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('respects disabled state', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    render(() => (
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    ))

    const button = screen.getByRole('button', { name: 'Disabled' })
    expect(button).toBeDisabled()

    await user.click(button)
    expect(onClick).not.toHaveBeenCalled()
  })
})
