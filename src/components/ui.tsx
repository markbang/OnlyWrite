import type { JSX, ParentProps } from 'solid-js'
import { splitProps } from 'solid-js'
import { cn } from '@/lib/utils'

type ButtonVariant = 'primary' | 'outline' | 'ghost' | 'secondary' | 'danger'
type ButtonSize = 'sm' | 'md' | 'lg'

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-foreground text-background border border-foreground hover:bg-background hover:text-foreground',
  outline: 'bg-background text-foreground border border-foreground hover:bg-foreground hover:text-background',
  ghost: 'bg-transparent text-foreground border border-transparent hover:bg-foreground hover:text-background',
  secondary: 'bg-muted text-foreground border border-foreground hover:bg-foreground hover:text-background',
  danger: 'bg-background text-destructive border border-destructive hover:bg-destructive hover:text-background',
}

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 text-sm',
  lg: 'h-11 px-5 text-sm',
}

export function Button(
  props: JSX.ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
  }
) {
  const [local, rest] = splitProps(props, ['class', 'children', 'variant', 'size', 'type'])

  return (
    <button
      type={local.type ?? 'button'}
      class={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors duration-100 disabled:cursor-not-allowed disabled:opacity-60',
        buttonVariants[local.variant ?? 'primary'],
        buttonSizes[local.size ?? 'md'],
        local.class
      )}
      {...rest}
    >
      {local.children}
    </button>
  )
}

export function Card(props: ParentProps<{ class?: string }>) {
  return (
    <section class={cn('border border-foreground bg-card text-card-foreground', props.class)}>
      {props.children}
    </section>
  )
}

export function CardHeader(props: ParentProps<{ class?: string }>) {
  return <div class={cn('p-6 pb-0', props.class)}>{props.children}</div>
}

export function CardTitle(props: ParentProps<{ class?: string }>) {
  return <h2 class={cn('text-lg font-semibold tracking-tight', props.class)}>{props.children}</h2>
}

export function CardDescription(props: ParentProps<{ class?: string }>) {
  return <p class={cn('text-sm text-muted-foreground', props.class)}>{props.children}</p>
}

export function CardContent(props: ParentProps<{ class?: string }>) {
  return <div class={cn('p-6', props.class)}>{props.children}</div>
}

export function Badge(props: ParentProps<{ class?: string; tone?: 'outline' | 'muted' }>) {
  return (
    <span
      class={cn(
        'inline-flex items-center gap-1 border px-2 py-1 text-xs font-medium',
        props.tone === 'muted'
          ? 'border-foreground bg-muted text-foreground'
          : 'border-foreground bg-background text-foreground',
        props.class
      )}
    >
      {props.children}
    </span>
  )
}

export function Input(props: JSX.InputHTMLAttributes<HTMLInputElement>) {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <input
      class={cn(
        'h-10 w-full border border-foreground bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground',
        local.class
      )}
      {...rest}
    />
  )
}

export function Textarea(props: JSX.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const [local, rest] = splitProps(props, ['class'])
  return (
    <textarea
      class={cn(
        'w-full border border-foreground bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground',
        local.class
      )}
      {...rest}
    />
  )
}

export function Label(props: ParentProps<{ for?: string; class?: string }>) {
  return (
    <label for={props.for} class={cn('text-sm font-medium text-foreground', props.class)}>
      {props.children}
    </label>
  )
}
