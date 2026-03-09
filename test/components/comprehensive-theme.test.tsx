import { describe, expect, it, vi } from 'vitest'
import { fireEvent, screen, waitFor } from '@solidjs/testing-library'
import DashboardPage from '@/routes/dashboard'
import HomePage from '@/routes/index'
import { workspaceActions } from '@/state/workspace'
import { render } from '../utils/theme-test-utils'

vi.mock('@solidjs/router', () => ({
  useNavigate: () => () => undefined,
}))

describe('solid route integration', () => {
  it('renders dashboard stats from workspace state', () => {
    workspaceActions.setFolderPath('/workspace')
    workspaceActions.setFiles([
      { name: 'draft.md', isFile: true },
      { name: 'notes.md', isFile: true },
      { name: 'assets', isFile: false },
    ])
    workspaceActions.setRecentFiles([
      {
        path: '/workspace/draft.md',
        name: 'draft.md',
        accessedAt: new Date('2026-03-09T12:00:00Z').getTime(),
      },
    ])

    render(() => <DashboardPage />)

    expect(screen.getByText('Total Files')).toBeInTheDocument()
    expect(screen.getAllByText('2').length).toBeGreaterThan(0)
    expect(screen.getByText('draft.md')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Create New' })).toBeInTheDocument()
  })

  it('returns to the localized landing page when the language changes', async () => {
    render(() => <HomePage />)

    fireEvent.change(screen.getByLabelText('Language'), { target: { value: 'zh' } })

    await waitFor(() => {
      expect(screen.getByText('效率优先设计')).toBeInTheDocument()
      expect(screen.getByText('OnlyWrite 写作控制台')).toBeInTheDocument()
    })
  })
})
