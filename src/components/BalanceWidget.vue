<script setup>
import { RamenSmall } from './icons'
defineProps({
  balance: {
    type: [String, Number],
    required: true,
    default: ''
  }
})
</script>

<template>
  <div class="balance-widget">
    <RamenSmall />
    <span class="label">Your balance: </span>&nbsp;<span class="balance">{{ balance }}</span>
  </div>
</template>

<style scoped>
.balance-widget {
  width: 100%;
  height: 64px;
  display: flex;
  align-items: center;
  padding: 16px;
  background: #ffffff;
  border-radius: 18px;
  font-family: 'Inter', sans-serif;
  font-size: 18px;
  font-weight: 600;
  line-height: 18px;
  letter-spacing: -0.02em;
  text-align: left;
}

.label {
  margin-left: 10px;
  color: #453D3C99;
}

.balance {
  columns: #453D3C;
}

</style>