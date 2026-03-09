import { useI18n } from '@/components/i18n-provider'
import { LanguageToggle } from '@/components/language-toggle'
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from '@/components/ui'

export default function LoginPage() {
  const { t } = useI18n()

  return (
    <div class="flex min-h-svh items-center justify-center bg-background px-4 py-10 sm:px-6">
      <div class="flex w-full max-w-md flex-col gap-6">
        <div class="flex items-center justify-between gap-3">
          <div class="flex items-center gap-3">
            <img src="/app-icon.svg" alt="OnlyWrite app icon" width="32" height="32" />
            <div>
              <div class="text-lg font-display font-bold tracking-tight text-foreground">OnlyWrite</div>
              <div class="text-xs font-medium text-muted-foreground">{t('app.subtitle')}</div>
            </div>
          </div>
          <LanguageToggle />
        </div>

        <Card class="border border-foreground bg-card">
          <CardHeader class="pb-6 text-center">
            <CardTitle class="text-2xl font-bold tracking-tight">{t('login.title')}</CardTitle>
            <CardDescription class="text-sm font-medium">{t('login.subtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form class="grid gap-6" onSubmit={(event) => event.preventDefault()}>
              <div class="flex flex-col gap-3">
                <Button variant="outline" class="w-full">
                  {t('login.apple')}
                </Button>
                <Button variant="outline" class="w-full">
                  {t('login.google')}
                </Button>
              </div>

              <div class="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:border-t after:border-border">
                <span class="relative z-10 bg-card px-3 font-medium text-muted-foreground">
                  {t('login.orEmail')}
                </span>
              </div>

              <div class="grid gap-5">
                <div class="grid gap-2">
                  <Label for="email">{t('login.email')}</Label>
                  <Input id="email" type="email" placeholder="m@example.com" required />
                </div>
                <div class="grid gap-2">
                  <div class="flex items-center justify-between">
                    <Label for="password">{t('login.password')}</Label>
                    <a href="#" class="text-sm text-foreground underline-offset-4 hover:underline">
                      {t('login.forgot')}
                    </a>
                  </div>
                  <Input id="password" type="password" required />
                </div>
                <Button type="submit" class="w-full">
                  {t('login.login')}
                </Button>
              </div>

              <div class="text-center text-sm text-muted-foreground">
                {t('login.noAccount')}{' '}
                <a href="#" class="font-medium text-foreground underline underline-offset-4">
                  {t('login.signup')}
                </a>
              </div>
            </form>
          </CardContent>
        </Card>

        <div class="text-center text-xs font-medium text-muted-foreground">
          {t('login.terms')}
          <a href="#" class="underline underline-offset-4 hover:text-foreground">
            {t('login.termsLink')}
          </a>
          {t('login.termsJoin')}
          <a href="#" class="underline underline-offset-4 hover:text-foreground">
            {t('login.privacyLink')}
          </a>
          {t('login.termsEnd')}
        </div>
      </div>
    </div>
  )
}
