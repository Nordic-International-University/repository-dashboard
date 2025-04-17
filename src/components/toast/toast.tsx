import { toast as sonerToast } from 'sonner'

export const toast = (message: string, label: string, callback: () => void) =>
  sonerToast(message, {
    action: {
      label: label,
      onClick: () => callback(),
    },
  })
