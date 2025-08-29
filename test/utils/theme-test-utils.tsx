import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { ThemeProvider } from 'next-themes'
import { SidebarProvider } from '@/components/ui/sidebar'

interface ThemeWrapperProps {
  children: React.ReactNode
  theme?: 'light' | 'dark'
}

const ThemeWrapper = ({ children, theme = 'light' }: ThemeWrapperProps) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme={theme}
      enableSystem={false}
      disableTransitionOnChange
    >
      <SidebarProvider>
        <div className={theme}>
          {children}
        </div>
      </SidebarProvider>
    </ThemeProvider>
  )
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, 'wrapper'> & { theme?: 'light' | 'dark' }
) => {
  const { theme, ...renderOptions } = options || {}
  
  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeWrapper theme={theme}>{children}</ThemeWrapper>
    ),
    ...renderOptions,
  })
}

export * from '@testing-library/react'
export { customRender as render }

// Helper to get computed CSS custom property value
export const getCSSCustomProperty = (element: Element, property: string): string => {
  return getComputedStyle(element).getPropertyValue(property).trim()
}

// Helper to test color consistency across themes
export const testColorConsistency = (
  element: Element,
  expectedLightColor: string,
  expectedDarkColor: string,
  property: string
) => {
  const lightValue = getCSSCustomProperty(element, property)
  const darkValue = getCSSCustomProperty(element, property)
  
  return {
    light: lightValue === expectedLightColor,
    dark: darkValue === expectedDarkColor,
    lightValue,
    darkValue
  }
}