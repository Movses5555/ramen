<script setup>
import { ref, computed } from 'vue'
import { BaseButton, HowItWorks, OnboardingStepThree, OnboardingStepOne } from './'

const emit = defineEmits(['skip'])

const activeStep = ref(0)

function goToTheNextStep () {
  activeStep.value += 1
}

function skip () {
  emit('skip')
}

const steps = computed(() => [
  {
    title: 'First crypto wallet and DEX aggregator on Telegram!',
    buttons: [
      {
        text: 'Next',
        type: 'secondary',
        handler () {
          goToTheNextStep()
        }
      },
      {
        text: 'Skip',
        type: 'outline',
        handler () {
          skip()
        }
      }
    ],
    content: {
      component: OnboardingStepOne,
      classes: 'first-step'
    }
  }, 
  {
    title: 'Invite friends and earn tokens',
    buttons: [
      {
        text: 'Next',
        type: 'secondary',
        handler () {
          goToTheNextStep()
        }
      },
      {
        text: 'Skip',
        type: 'outline',
        handler () {
          skip()
        }
      }
    ],
    content: {
      component: HowItWorks,
      classes: 'second-step'
    }
  },
  {
    title: 'Join Ramen waitlist and gather friends around the table!',
    buttons: [
      {
        text: 'Join Waitlist',
        type: 'guest',
        handler() {
          emit('join')
        }
      },
      {
        text: 'Later',
        type: 'outline',
        handler () {
          skip()
        }
      }
    ],
    content: {
      component: OnboardingStepThree,
      classes: 'third-step'
    }
  }
])
</script>

<template>
  <div class="onboarding">
    <div class="head">
      <div class="steps-line"> 
        <div v-for="(index) in steps.length" :key="index" :class="['step', (index <= activeStep + 1) && 'active']">
        </div>
      </div>
      <div class="title">
        {{ steps[activeStep].title }}
      </div>
    </div>

    <div :class="['content', activeStep === 1 && 'px-16']">
      <component :is="steps[activeStep].content.component" :class="steps[activeStep].content.classes"/>
    </div>

    <div class="buttons">
      <BaseButton 
        v-for="(button, index) in steps[activeStep].buttons" 
        :key="index"
        :type="button.type"
        class="button"
        @click="button.handler"
      >
        {{ button.text }}
      </BaseButton>
    </div>
  </div>
</template>

<style scoped>
.onboarding {
  position: relative;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.steps-line {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.step {
  width: 100%;
  height: 2px;
  background:#453D3C33;
  border-radius: 2px;
}
.step:not(:last-child) {
  margin-right: 8px;
}

.step.active {
  background: #453D3C;
}

.head {
  padding: 16px 16px 0 16px;
}

.title {
  font-family: 'Open Runde', sans-serif;
  color: #453D3C;
  font-size: 36px;
  font-weight: 600;
  line-height: 36px;
  letter-spacing: -0.02em;
  text-align: left;
  margin-top: 32px;
}

.content {
  box-sizing: border-box;
  height: 100%;
}

.buttons {
  position: fixed;
  bottom: 28px;
  width: 100%;
  padding: 0 16px;
  z-index: 999;
}

.button:not(:first-child) {
  margin-top: 12px;
}

.px-16 {
  padding-left: 16px;
  padding-right: 16px;
}

.first-step {
  display: flex;
  margin: 0 auto;
  object-fit: contain;
  width: 95%;
  height: calc(100% - 161px);
}

.second-step {
  padding-top: 24px;
  height: calc(100% - 153px);
}

.third-step {
  position: relative;
  object-fit: contain;
  width: 100%;
  height: calc(100% - 161px);
  left: -24px;
}
</style>