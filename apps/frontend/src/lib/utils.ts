import { twMerge } from 'tailwind-merge'

export const cn = (
  ...inputs: (string | false | null | undefined)[]
): string => twMerge(inputs.filter(Boolean).join(' '))
