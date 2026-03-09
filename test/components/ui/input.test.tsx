import { describe, expect, it, vi } from 'vitest'
import { render, screen } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui'

describe('Input', () => {
  it('renders a textbox with placeholder support', () => {
    render(() => <Input placeholder="Enter text" />)

    expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
  })

  it('supports common input types', () => {
    render(() => (
      <div>
        <Input type="email" placeholder="email" />
        <Input type="password" placeholder="password" />
      </div>
    ))

    expect(screen.getByPlaceholderText('email')).toHaveAttribute('type', 'email')
    expect(screen.getByPlaceholderText('password')).toHaveAttribute('type', 'password')
  })

  it('supports value, readOnly, required, and aria-invalid', () => {
    render(() => (
      <Input value="Draft" readOnly required aria-invalid="true" aria-label="Draft input" />
    ))

    const input = screen.getByLabelText('Draft input')
    expect(input).toHaveValue('Draft')
    expect(input).toHaveAttribute('readonly')
    expect(input).toBeRequired()
    expect(input).toHaveAttribute('aria-invalid', 'true')
  })

  it('merges custom classes and disabled styles', () => {
    render(() => <Input class="custom-input" disabled />)

    const input = screen.getByRole('textbox')
    expect(input).toBeDisabled()
    expect(input.className).toContain('custom-input')
    expect(input.className).toContain('border-foreground')
  })

  it('emits input events', async () => {
    const user = userEvent.setup()
    const onInput = vi.fn()

    render(() => <Input onInput={onInput} />)
    await user.type(screen.getByRole('textbox'), 'Hello')

    expect(onInput).toHaveBeenCalled()
    expect(screen.getByRole('textbox')).toHaveValue('Hello')
  })
})
