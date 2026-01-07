import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Input } from '@/components/ui/input'

describe('Input Component', () => {
  describe('Rendering', () => {
    it('should render input element', () => {
      render(<Input />)
      expect(screen.getByRole('textbox')).toBeInTheDocument()
    })

    it('should render with placeholder', () => {
      render(<Input placeholder="Enter text" />)
      expect(screen.getByPlaceholderText('Enter text')).toBeInTheDocument()
    })

    it('should render with value', () => {
      render(<Input value="Test value" readOnly />)
      expect(screen.getByRole('textbox')).toHaveValue('Test value')
    })
  })

  describe('Types', () => {
    it('should support text type', () => {
      render(<Input type="text" />)
      expect(screen.getByRole('textbox')).toHaveAttribute('type', 'text')
    })

    it('should support email type', () => {
      render(<Input type="email" placeholder="email" />)
      const input = screen.getByPlaceholderText('email')
      expect(input).toHaveAttribute('type', 'email')
    })

    it('should support password type', () => {
      render(<Input type="password" placeholder="password" />)
      const input = screen.getByPlaceholderText('password')
      expect(input).toHaveAttribute('type', 'password')
    })

    it('should support number type', () => {
      render(<Input type="number" placeholder="number" />)
      const input = screen.getByPlaceholderText('number')
      expect(input).toHaveAttribute('type', 'number')
    })
  })

  describe('States', () => {
    it('should be disabled when disabled prop is true', () => {
      render(<Input disabled />)
      expect(screen.getByRole('textbox')).toBeDisabled()
    })

    it('should be readonly when readOnly prop is true', () => {
      render(<Input readOnly />)
      expect(screen.getByRole('textbox')).toHaveAttribute('readonly')
    })

    it('should accept custom className', () => {
      render(<Input className="custom-input" />)
      expect(screen.getByRole('textbox').className).toContain('custom-input')
    })
  })

  describe('Interaction', () => {
    it('should handle onChange event', async () => {
      const user = userEvent.setup()
      let value = ''
      
      render(<Input onChange={(e) => { value = e.target.value }} />)
      const input = screen.getByRole('textbox')
      await user.type(input, 'Hello')
      expect(value).toBe('Hello')
    })

    it('should handle focus event', async () => {
      const user = userEvent.setup()
      let focused = false
      
      render(<Input onFocus={() => { focused = true }} />)
      const input = screen.getByRole('textbox')
      await user.click(input)
      expect(focused).toBe(true)
    })
  })

  describe('Styling', () => {
    it('should have base input classes', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input.className).toContain('border-2')
      expect(input.className).toContain('border-foreground')
    })

    it('should have focus classes', () => {
      render(<Input />)
      const input = screen.getByRole('textbox')
      expect(input.className).toContain('focus-visible:')
    })

    it('should have disabled styles', () => {
      render(<Input disabled />)
      const input = screen.getByRole('textbox')
      expect(input.className).toContain('disabled:')
      expect(input.className).toContain('disabled:opacity-50')
    })
  })

  describe('Accessibility', () => {
    it('should support aria-label', () => {
      render(<Input aria-label="Username input" />)
      expect(screen.getByLabelText('Username input')).toBeInTheDocument()
    })

    it('should support aria-invalid for form validation', () => {
      render(<Input aria-invalid="true" />)
      const input = screen.getByRole('textbox')
      expect(input).toHaveAttribute('aria-invalid', 'true')
    })

    it('should support required attribute', () => {
      render(<Input required />)
      expect(screen.getByRole('textbox')).toBeRequired()
    })
  })
})
