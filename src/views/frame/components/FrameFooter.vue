<template>
  <div>
    <span style="position: fixed; bottom: 20px; right: 20px;">
      <div style="width: 200px; display: flex; flex-direction: row; justify-content: space-between">
        <a href="https://example.com" target="_blank" class="link">About</a>
        <a href="https://google.com" target="_blank" class="link"> Support </a>
        <a href="https://baidu.com" target="_blank" class="link"> Contact Us </a>
      </div>
    </span>
    ElementUI ©2022, Modifed By Fred
  </div>
</template>

<script setup></script>

<style scoped>
.link {
  color: gainsboro;
  text-decoration: none;
}
.link:hover {
  color: #249fea;
  text-decoration: underline;
}
</style>
