import { toast } from "sonner"

interface ToastAction {
  label: string
  onClick: () => void
}

export const showToast = {
  success: (message: string, description?: string, action?: ToastAction) => {
    toast.success(message, {
      description,
      duration: 3000,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    })
  },

  error: (message: string, description?: string, action?: ToastAction) => {
    toast.error(message, {
      description,
      duration: 4000,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    })
  },

  info: (message: string, description?: string, action?: ToastAction) => {
    toast.info(message, {
      description,
      duration: 3000,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    })
  },

  warning: (message: string, description?: string, action?: ToastAction) => {
    toast.warning(message, {
      description,
      duration: 3000,
      action: action ? {
        label: action.label,
        onClick: action.onClick,
      } : undefined,
    })
  },
}

