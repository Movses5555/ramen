<script setup>
import { GiftIcon } from './icons'
const steps = [
  {
    title: 'Join the waitlist',
    description: 'and get 100 tokens',
  },
  {
    title: 'Share link',
    description: 'with your friends',
  },
  {
    title: 'Get 100 tokens',
    description: 'for each invited friend',
  },
  {
    title: 'Stay tuned',
    description: 'for further\nupdates and gifts',
  },
]
</script>

<template>
  <div class="wrapper">
    <div class="title">How it works</div>
    <div class="list">
      <div v-for="(item, index) in steps" :key="index" class="item">
        <div class="line-wrapper">
          <div class="index">
            <template v-if="index !== steps.length - 1">
              {{ index + 1 }}
            </template>
            <GiftIcon v-else></GiftIcon>
          </div>
          <div class="line"></div>
        </div>
        <div class="text">
          <div class="blue">{{ item.title }}</div>
          <div>{{ item.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-family: 'Open Runde', sans-serif;
  color: #453D3C;
  font-size: 20px;
  font-weight: 600;
  line-height: 24.2px;
  letter-spacing: -0.4300000071525574px;
  text-align: left;
  margin-bottom: 16px;
}

.list {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow-y: auto;
  padding-bottom: 50px;
}

.item {
  display: flex;
  position: relative;
}

.item:not(:last-child) {
  padding-bottom: 35px;
}

.item:last-child .line {
  display: none;
}

.index {
  font-family: 'Inter', sans-serif;
  font-size: 16px;
  font-weight: 400;
  line-height: 19.09px;
  color: #ffffff;
  width: 32px;
  height: 31px;
  border-radius: 9999px;
  background: #24B3FF;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
}

.line-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.line {
  position: absolute;
  top: 31px;
  flex: 1 0 0;
  height: 100%;
  width: 2px;
  background:#24B3FF;
}

.text {
  margin-left: 16px;
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  font-weight: 500;
  line-height: 22px;
  letter-spacing: -0.4300000071525574px;
  text-align: left;
  color: #453D3C;
  white-space: pre-wrap;
}

.blue {
  color: #24B3FF;
  font-weight: 600;
}
</style>