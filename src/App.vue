<!-- src/App.vue -->
<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout.vue'
</script>

<template>
  <div class="min-h-screen bg-zinc-950 font-ui text-zinc-100 antialiased">
    <div class="pointer-events-none fixed inset-0 -z-10 transform-gpu">
      <div class="vignette absolute inset-0" />

      <div
        class="bg-brand-500/12 absolute -left-28 -top-32 h-[520px] w-[520px] transform-gpu rounded-full blur-3xl will-change-transform"
      />
      <div
        class="absolute -right-32 top-24 h-[560px] w-[560px] transform-gpu rounded-full bg-jade-500/10 blur-3xl will-change-transform"
      />
      <div
        class="bg-brand-500/7 absolute bottom-[-220px] left-1/3 h-[520px] w-[520px] transform-gpu rounded-full blur-3xl will-change-transform"
      />

      <div class="mandala absolute inset-0 hidden opacity-[0.10] md:block" />

      <div class="grain absolute inset-0 hidden opacity-[0.05] md:block" />

      <div
        class="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-400/20 to-transparent"
      />
    </div>

    <MainLayout />
  </div>
</template>

<style scoped>
/* Vignette */
.vignette {
  background:
    radial-gradient(
      1200px 700px at 50% 10%,
      rgba(0, 0, 0, 0) 35%,
      rgba(0, 0, 0, 0.35) 70%,
      rgba(0, 0, 0, 0.55) 100%
    ),
    radial-gradient(
      900px 600px at 15% 20%,
      rgba(224, 154, 27, 0.1),
      rgba(0, 0, 0, 0) 55%
    ),
    radial-gradient(
      900px 600px at 85% 15%,
      rgba(16, 185, 129, 0.08),
      rgba(0, 0, 0, 0) 55%
    );
}

/* Grain: lightweight */
.grain {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)' opacity='.32'/%3E%3C/svg%3E");
  background-size: 180px 180px;
}

/* Mandala-line */
.mandala {
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='220' height='220' viewBox='0 0 220 220'%3E%3Cg fill='none' stroke='rgba(255,255,255,0.10)' stroke-width='1'%3E%3Ccircle cx='110' cy='110' r='72'/%3E%3Ccircle cx='110' cy='110' r='46'/%3E%3Cpath d='M110 18v184M18 110h184M44 44l132 132M176 44L44 176'/%3E%3C/g%3E%3Cg fill='none' stroke='rgba(224,154,27,0.12)' stroke-width='1'%3E%3Ccircle cx='110' cy='110' r='98'/%3E%3C/g%3E%3C/svg%3E");
  background-size: 220px 220px;
  background-repeat: repeat;
  mask-image: radial-gradient(
    circle at 50% 30%,
    black 0%,
    black 45%,
    transparent 75%
  );
  -webkit-mask-image: radial-gradient(
    circle at 50% 30%,
    black 0%,
    black 45%,
    transparent 75%
  );
}
</style>
