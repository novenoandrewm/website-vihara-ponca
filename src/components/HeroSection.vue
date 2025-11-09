<template>
  <section class="rounded-2xl bg-zinc-800/60 px-6 py-10 md:px-10 md:py-14">
    <h1 class="text-3xl font-bold md:text-4xl">Vihara Avalokitesvara</h1>
    <p class="mt-3 max-w-2xl text-zinc-300">
      Informasi kegiatan rutin, PMV, dan GABI. Temukan aktivitas terbaru di
      komunitas.
    </p>
    <div class="mt-6 flex gap-3">
      <router-link
        to="/pmv"
        class="bg-brand-500 hover:bg-brand-600 rounded-xl px-4 py-2 text-white"
        >Lihat PMV</router-link
      >
      <router-link
        to="/gabi"
        class="bg-brand-500 hover:bg-brand-600 rounded-xl px-4 py-2 text-white"
        >Lihat GABI</router-link
      >
    </div>
  </section>
</template>
