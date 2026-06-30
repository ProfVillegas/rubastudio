<template>
  <div :class="['flex flex-col gap-1', classExtra]">
    <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ label }}</label>
    <input
      :type="type"
      :step="step"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      class="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 bg-white placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
    />
  </div>
</template>
 
<script setup>
defineProps({
  modelValue:  { default: '' },
  label:       { type: String, required: true },
  placeholder: { type: String, default: '' },
  type:        { type: String, default: 'text' },
  step:        { type: String, default: undefined },
  classExtra:  { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>