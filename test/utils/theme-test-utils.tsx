import { render, RenderOptions } from "@testing-library/react"
import type { ReactElement, ReactNode } from "react"
import { I18nProvider } from "../../components/i18n-provider"
import { SidebarProvider } from "../../components/ui/sidebar"


type Theme = "light" | "dark"

function applyThemeClass(theme: Theme) {
  document.documentElement.classList.remove("light", "dark")
  document.documentElement.classList.add(theme)
}

type ThemeWrapperProps = {
  children: ReactNode
  theme: Theme
  withSidebar?: boolean
}

const ThemeWrapper = ({ children, theme, withSidebar }: ThemeWrapperProps) => {
  applyThemeClass(theme)

  const content = withSidebar ? <SidebarProvider>{children}</SidebarProvider> : children

  return <I18nProvider>{content}</I18nProvider>
}

const customRender = (
  ui: ReactElement,
  options?: Omit<RenderOptions, "wrapper"> & {
    theme?: Theme
    withSidebar?: boolean
  }
) => {
  const { theme = "light", withSidebar = false, ...renderOptions } = options || {}

  return render(ui, {
    wrapper: ({ children }) => (
      <ThemeWrapper theme={theme} withSidebar={withSidebar}>
        {children}
      </ThemeWrapper>
    ),
    ...renderOptions,
  })
}

export * from "@testing-library/react"
export { customRender as render }

export const getCSSCustomProperty = (element: Element, property: string): string => {
  return getComputedStyle(element).getPropertyValue(property).trim()
}

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
    darkValue,
  }
}
