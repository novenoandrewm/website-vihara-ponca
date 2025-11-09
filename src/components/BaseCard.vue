<template>
  <article class="rounded-2xl border border-zinc-700 bg-zinc-800 p-4 shadow">
    <header v-if="$slots.header" class="mb-2"><slot name="header" /></header>
    <div><slot /></div>
    <footer v-if="$slots.footer" class="mt-3 text-sm text-zinc-300">
      <slot name="footer" />
    </footer>
  </article>
</template>
