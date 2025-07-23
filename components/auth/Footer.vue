<template>
  <footer class="flex flex-col items-center space-y-2.5 w-full pb-5 justify-center px-6 xl:px-0 pt-10">
    <ul class="flex items-center gap-x-2.5 w-full justify-center flex-wrap">
      <li><a class="footer-link" href="#">&copy; Taskify.com</a></li>
      <span class="footer-link">|</span>
      <li><a class="footer-link" href="#">Resources</a></li>
      <span class="footer-link">|</span>
      <li><a class="footer-link" href="#">Pricing</a></li>
      <span class="footer-link">|</span>
      <li><a class="footer-link" href="#">Terms and Conditions</a></li>
      <span class="footer-link">|</span>
      <li><a class="footer-link" href="#">Privacy Policy</a></li>
    </ul>
    <p class="footer-text text-center mb-0 text-balance">This site is designed and developed by Shubham Homkar</p>
  </footer>
</template>

<script setup lang="ts">

</script>

<style scoped>
.footer-link {
  @apply text-surface-400 font-normal text-sm hover:text-surface-0 transition-all hover:drop-shadow shadow-surface-0 align-middle;
}

.footer-text {
  @apply text-surface-400 font-normal text-sm;
}
</style>