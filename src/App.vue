<template>
  <div id="app" class="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black text-white">
    <Navbar />
    <main>
      <router-view />
    </main>
    <Footer />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Footer
  }
}
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Bebas+Neue&display=swap');

* {
  font-family: 'Inter', sans-serif;
}

h1, h2, h3 {
  font-family: 'Bebas Neue', sans-serif;
  letter-spacing: 0.02em;
}
</style>
