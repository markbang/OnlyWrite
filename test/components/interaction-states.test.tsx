import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render as baseRender, screen, waitFor } from '@solidjs/testing-library'
import userEvent from '@testing-library/user-event'
import HomePage from '@/routes/index'
import { Button } from '@/components/ui'
import { render } from '../utils/theme-test-utils'

describe('interaction states', () => {
  it('fires click handlers for active buttons', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    baseRender(() => <Button onClick={onClick}>Press</Button>)
    await user.click(screen.getByRole('button', { name: 'Press' }))

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('keeps disabled buttons non-interactive', async () => {
    const user = userEvent.setup()
    const onClick = vi.fn()

    baseRender(() => (
      <Button disabled onClick={onClick}>
        Disabled
      </Button>
    ))

    const button = screen.getByRole('button', { name: 'Disabled' })
    await user.click(button)

    expect(button).toBeDisabled()
    expect(onClick).not.toHaveBeenCalled()
  })

  it('switches the app language from the landing page selector', async () => {
    render(() => <HomePage />)

    const select = screen.getByLabelText('Language') as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'zh' } })

    await waitFor(() => {
      expect(screen.getByRole('button', { name: '选择文件夹' })).toBeInTheDocument()
    })
  })

  it('shows the desktop-only update message in browsers', async () => {
    render(() => <HomePage />)

    fireEvent.click(screen.getByRole('button', { name: 'Check updates' }))

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalled()
    })
  })
})
