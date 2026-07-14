export type DatetimePickerValue = string | number | number[]

export interface Props {
  modelValue: boolean
  title?: string
  defaultValue?: number | [number, number]
  type?: 'datetime' | 'datetimerange' | 'date' | 'daterange'
}

export interface Emits {
  (e: 'update:modelValue', value: boolean): void
  (e: 'confirm', value: number | [number, number]): void
}
