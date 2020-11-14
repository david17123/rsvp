import React from 'react'

interface FormContextValue<T> {
  data: T
  setData: (data: T) => void
  currentStep: string
  goToStep: (step: string) => void
  submit: (data: T) => Promise<void>
  isSubmitting: boolean
}

interface FormContextProviderProps {
  children: React.ReactNode | React.ReactNode[]
}

function useFormContextValue<T>(
  handleSubmit: (data: T) => Promise<void>,
  initialData: T,
  initialStep: string,
): FormContextValue<T> {
  const [data, setData] = React.useState<T>(initialData)
  const [currentStep, setCurrentStep] = React.useState<string>(initialStep)
  const [isSubmitting, setIsSubmitting] = React.useState<boolean>(false)

  const submitFunction = async (formData: T) => {
    setIsSubmitting(true)
    await handleSubmit(formData)
    setIsSubmitting(false)
  }

  return {
    data,
    setData,
    currentStep,
    goToStep: setCurrentStep,
    submit: React.useCallback(submitFunction, []),
    isSubmitting,
  }
}

export function createFormContext<T>(initialData: T): React.Context<FormContextValue<T>> {
  return React.createContext<FormContextValue<T>>({
    data: initialData,
    setData: () => { return },
    currentStep: '',
    goToStep: () => { return },
    submit: async () => { return },
    isSubmitting: false,
  })
}

export function createFormContextProvider<T>(
  FormContext: React.Context<FormContextValue<T>>,
  handleSubmit: (data: T) => Promise<void>,
  initialData: T,
  initialStep: string,
): React.FunctionComponent<FormContextProviderProps> {
  return (props: FormContextProviderProps) => {
    const contextValue = useFormContextValue(handleSubmit, initialData, initialStep)

    return (
      <FormContext.Provider value={contextValue}>
        {props.children}
      </FormContext.Provider>
    )
  }
}
