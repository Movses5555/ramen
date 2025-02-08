<script setup>
import { SuccessSmallIcon } from './icons'

defineProps({
  text: {
    type: String,
    default: ''
  }
})
</script>

<template>
  <div class="toast">
    <SuccessSmallIcon />
    <span class="text">{{ text }}</span>
  </div>
</template>

<style scoped>
.toast {
  width: 100%;
  height: 56px;
  display: flex;
  align-items: center;
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: -0.43px;
  color: #453D3C;
  padding: 16.5px 16px;
  background: #FFFFFF;
  border-radius: 46px;
  box-shadow: 0px 4px 16.4px 0px #0000000F;
}

.text {
  margin-left: 8px;
}
</style>