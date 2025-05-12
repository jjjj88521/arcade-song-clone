import type { Component } from 'vue'
import type { InputComponents } from './interface'
import AutoFormFieldArray from './AutoFormFieldArray.vue'
import AutoFormFieldBoolean from './AutoFormFieldBoolean.vue'
import AutoFormFieldDate from './AutoFormFieldDate.vue'
import AutoFormFieldEnum from './AutoFormFieldEnum.vue'
import AutoFormFieldFile from './AutoFormFieldFile.vue'
import AutoFormFieldInput from './AutoFormFieldInput.vue'
import AutoFormFieldNumber from './AutoFormFieldNumber.vue'
import AutoFormFieldObject from './AutoFormFieldObject.vue'

export const INPUT_COMPONENTS: InputComponents = {
  date: AutoFormFieldDate as Component,
  select: AutoFormFieldEnum as Component,
  radio: AutoFormFieldEnum as Component,
  checkbox: AutoFormFieldBoolean as Component,
  switch: AutoFormFieldBoolean as Component,
  textarea: AutoFormFieldInput as Component,
  number: AutoFormFieldNumber as Component,
  string: AutoFormFieldInput as Component,
  file: AutoFormFieldFile as Component,
  array: AutoFormFieldArray as Component,
  object: AutoFormFieldObject as Component,
}

/**
 * Define handlers for specific Zod types.
 * You can expand this object to support more types.
 */
export const DEFAULT_ZOD_HANDLERS: {
  [key: string]: keyof typeof INPUT_COMPONENTS
} = {
  ZodString: 'string',
  ZodBoolean: 'checkbox',
  ZodDate: 'date',
  ZodEnum: 'select',
  ZodNativeEnum: 'select',
  ZodNumber: 'number',
  ZodArray: 'array',
  ZodObject: 'object',
}
