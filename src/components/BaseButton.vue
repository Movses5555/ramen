<script setup>
import { computed } from 'vue'
import { CopyIcon, СutleryIcon, TelegramIcon } from './icons/index'

const props = defineProps({
  type: {
    type: String,
    default: '',
    validator (value) {
      return ['guest', 'member', 'referal', 'copy', 'secondary', 'outline'].includes(value)
    }
  }
})

defineEmits(['click'])

const iconsMap = {
  guest: СutleryIcon,
  copy: CopyIcon,
  member: TelegramIcon,
  referal: TelegramIcon,
}

const iconByType = computed(() => iconsMap[props.type])
</script>

<template>
  <div :class="['base-button', type]" @click="$emit('click')">
    <slot></slot>
    <component v-if="iconByType" :is="iconByType" class="icon"/>
  </div>
</template>

<script>
</script>

<style scoped>
.base-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 56px;
  color: #ffffff;
  text-align: center;
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  font-weight: 600;
  line-height: 22px;
  letter-spacing: -0.43px;
  border-radius: 16px;
  cursor: pointer;
}

.guest {
  background: linear-gradient(91.4deg, #D6273A 0%, #E93A4D 50%, #FF5050 100%),
  linear-gradient(180deg, rgba(255, 255, 255, 0.17) 0%, rgba(255, 255, 255, 0) 100%);
  box-shadow: 0px 1px 2.5px 0px #E93A4D3D;
}
.guest:active {
  background: #D6273A;
}

.member {
  background: linear-gradient(0deg, #453D3C, #453D3C),
  linear-gradient(180deg, rgba(255, 255, 255, 0.17) 0%, rgba(255, 255, 255, 0) 100%);
  box-shadow: 0px 1px 2.5px 0px #453D3C3D;
}
.member:active {
  background: #3E3635;
}

.referal {
  background: linear-gradient(91.4deg, #10AA37 0%, #21C049 50%, #3DD843 100%),
  linear-gradient(180deg, rgba(255, 255, 255, 0.17) 0%, rgba(255, 255, 255, 0) 100%);
  box-shadow: 0px 1px 2.5px 0px #21C0493D;
}
.referal:active {
  background: #10AA37;
}

.copy {
  background: transparent;
  color: #453D3C;
}

.secondary {
  background: linear-gradient(0deg, #453D3C, #453D3C),
  linear-gradient(180deg, rgba(255, 255, 255, 0.17) 0%, rgba(255, 255, 255, 0) 100%);
  box-shadow: 0px 1px 2.5px 0px #453D3C3D;
}

.outline {
  color: #453D3C80;
}

.icon {
  margin-left: 8px;
}
</style>