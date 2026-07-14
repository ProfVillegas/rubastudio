<template>
  <div :class="['flex flex-col gap-1', classExtra]">
    <label class="text-xs font-medium text-slate-500 uppercase tracking-wide">{{ label }}</label>
    <select
      :value="modelValue"
      @change="$emit('update:modelValue', $event.target.value)"
      class="rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm text-slate-800 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent transition"
    >
      <option v-if="placeholder" value="" disabled>{{ placeholder }}</option>
      <slot />
    </select>
  </div>
</template>
 
<script setup>
defineProps({
  modelValue:  { default: '' },
  label:       { type: String, required: true },
  placeholder: { type: String, default: '' },
  classExtra:  { type: String, default: '' },
})
defineEmits(['update:modelValue'])
</script>