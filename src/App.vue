<script setup>
import './assets/main.css'
import { ref, computed } from 'vue'
import { 
  RamenGuest, 
  RamenMember, 
  RamenReferal, 
  BaseButton, 
  BalanceWidget, 
  BaseToast,
  UserOnboarding,
} from '@/components'
import { getUser, signUser } from './services'
import RamenError from './components/icons/RamenError.vue'


const TOAST_TIMER = 3000
const TOAST_TEXT_AFTER_JOIN = 'You\'re in waitlist for Ramen!'
const ONBOARDING = 'onboarding'
const GUEST = 'guest'
const JOIN_IN_PROCESS = 'joinInProcess'
const JOIN_ERROR = 'joinError'
const MEMBER = 'member'
const REFERAL = 'referal'

const userState = ref('')
const balance = ref('')
const invitedPeople = ref('0')
const invitationToken = ref('')
const toastText = ref('')

// const initData = window.Telegram.WebApp.initData
// console.log('initData', initData);

let initData = '';
if (window.Telegram && window.Telegram.WebApp) {
  initData = window.Telegram.WebApp.initData;
  console.log('initData----', initData);
} else {
  console.log('Telegram WebApp SDK is not initialized or not available.');
}
const isLoadingUserData = ref(false)

const SHOW_ONBOARDING_STORAGE_KEY = 'show_onboarding'

const regex = /[?&]start_param=([^&]*)/

const utmData = {}

const mapUtmFields = {
  utmSource: 'utm_source',
  utmMedium: 'utm_medium',
  utmCampaign: 'utm_campaign',
  utmTerm: 'utm_term',
  utmContent: 'utm_content',
}

function parseUtm (param) {
  const match = param.match(regex)

  if (match) {
    const startParamValue = decodeURIComponent(match[1])

    const data = startParamValue?.split('__')

    data.forEach((item) => {
      const [key, value] = item.split('_')

      if (key && value) {
        if (key === 'id') {
          return
        }

        if (!mapUtmFields[key]) {
          return
        }

        utmData[mapUtmFields[key]] = value
      }
    })
  }
}

parseUtm(initData)

if (Object.keys(utmData).length) {
  window.gtag('event', 'page_view', utmData)
}

window.gtag('event', 'App', 
  {
    'Launch': 'App started',
    ...utmData
  }
)

function copy(text) {
  window.gtag('event', 'User Action', 
    {
      'Send/Copy Link': 'Copy Link',
      ...utmData
    }
  )
  const input = document.createElement('textarea')
  input.innerHTML = text
  document.body.appendChild(input)
  input.select()
  document.execCommand('copy')
  document.body.removeChild(input)
  showToast('Link copied')
}

function skipOnboarding () {
  userState.value = GUEST
  localStorage.setItem(SHOW_ONBOARDING_STORAGE_KEY, false)
}

function setUserData (userData) {
  if (!userData) {
    if (JSON.parse(localStorage.getItem(SHOW_ONBOARDING_STORAGE_KEY)) ?? true) {
      userState.value = ONBOARDING
    } else {
      userState.value = GUEST
    }
  } else {
    balance.value = userData.balance
    invitedPeople.value = userData.referralsCount
    invitationToken.value = userData.invitationToken

    if (+invitedPeople.value > 0) {
      userState.value = REFERAL
    } else {
      userState.value = MEMBER
    }
  }
}

async function loadUserData () {
  console.log('initData', initData);
  try {
    isLoadingUserData.value = true
    const userData = await getUser(initData)
    console.log('userData', userData);

    setUserData(userData)
  } catch (e) {
    console.error(e)
  } finally {
    isLoadingUserData.value = false
  }
}

loadUserData()

async function joinUser () {
  try {
    userState.value = JOIN_IN_PROCESS
    const userData = await signUser(initData)
    setUserData(userData)
    showToast(TOAST_TEXT_AFTER_JOIN)
  } catch (e) {
    userState.value = JOIN_ERROR
  } finally {
    window.gtag('event', 'User Action', 
      {
        'Join Waitlist': 'Clicked Join Waitlist',
        ...utmData
      }
    )
  }
}

function joinUserAfterOnboarding () {
  localStorage.setItem(SHOW_ONBOARDING_STORAGE_KEY, false)
  joinUser()
}

function showToast (text) {
  toastText.value = text

  setTimeout(() => {
    toastText.value = ''
  }, TOAST_TIMER)
}

const invitationLink = computed(() => `https://t.me/RamenCryptoBot/app?startapp=id_${invitationToken.value}`)

function sendLink () {
  window.gtag('event', 'User Action', 
    {
      'Send/Copy Link': 'Send Link',
      ...utmData,
    }
  )
  window.Telegram.WebApp.openTelegramLink(`https://t.me/share/url?url=${invitationLink.value}&text=%0ALet's enjoy some ramen and farm crypto together! Click the link to add 100 Ramen Tokens to your wallet`)
}

const statesMap = computed(() => ({
  [ONBOARDING]: {

  },
  [GUEST]: {
    icon: RamenGuest,
    title: '100 Ramen Tokens for joining Waitlist',
    description: 'Ramen will be cooking soon!\nWait with us and receive gifts',
    textBtn: 'Join Waitlist',
    mainButtonHandler() {
      joinUser()
    },
    hasCopy: false,
  },
  [JOIN_IN_PROCESS]: {
    icon: RamenGuest,
    title: 'Kindly wait...',
    description: 'We\'re gathering the\ningredients for Ramen',
    textBtn: 'Join Waitlist',
    hasCopy: false,
  },
  [JOIN_ERROR]: {
    icon: RamenError,
    title: 'Something went wrong',
    description: 'Please, try again or come back later',
    textBtn: 'Return home',
    mainButtonHandler() {
      userState.value = GUEST
    },
    hasCopy: false,
  },
  [MEMBER]: {
    icon: RamenMember,
    title: 'Invite your friends\nfor Ramen!',
    description: '100 Ramen Tokens for each friend.',
    textBtn: 'Send Link',
    hint: 'You haven\'t invited anyone yet',
    mainButtonHandler() {
      sendLink()
    },
    hasCopy: true,
  },
  [REFERAL]: {
    icon: RamenReferal,
    title: 'Get more friends around the table!',
    description: `100 Ramen Tokens for each friend.`,
    textBtn: 'Send Link',
    hint: `You invited: ${invitedPeople.value} people`,
    mainButtonHandler() {
      sendLink()
    },
    hasCopy: true,
  },
}))

const iconByState = computed(() => statesMap.value[userState.value]?.icon)
const title = computed(() => statesMap.value[userState.value]?.title)
const description = computed(() => statesMap.value[userState.value]?.description)
const hint = computed(() => statesMap.value[userState.value]?.hint)

const isAnimatedIcon = computed(() => userState.value === JOIN_IN_PROCESS)
const typeButton = computed(() => {
  if ([JOIN_ERROR].includes(userState.value)) {
    return 'secondary'
  }

  return userState.value
})
const textButtonByState = computed(() => statesMap.value[userState.value]?.textBtn)
const hasCopy = computed(() => statesMap.value[userState.value]?.hasCopy)
const mainButtonHandler = computed(() => statesMap.value[userState.value]?.mainButtonHandler)
const showBalanceWidget = computed(() => [MEMBER, REFERAL].includes(userState.value))
</script>

<template>
  <div v-if="!isLoadingUserData" class="app">
    <UserOnboarding v-if="userState === ONBOARDING" @skip="skipOnboarding" @join="joinUserAfterOnboarding"/>
    <div v-else class="app-wrapper">
      <BalanceWidget v-if="showBalanceWidget" :balance="balance" class="balance-widget"/>
      <section class="content">
        <component :is="iconByState" :class="isAnimatedIcon && 'rotating'"/>
        <span class="title">{{ title }}</span>
        <span class="description">{{ description }}</span>
      </section>
  
      <div class="buttons">
        <div v-if="hint" class="hint">
          {{ hint }}
        </div>
        <BaseButton v-if="userState !== JOIN_IN_PROCESS" :type="typeButton" @click="mainButtonHandler">{{ textButtonByState }}</BaseButton>
        <BaseButton v-if="hasCopy && !toastText" type="copy" class="floor" @click="copy(invitationLink)">Copy Link</BaseButton>
        <BaseToast v-if="toastText" :text="toastText" class="floor" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.app {
  height: 100%;
}

.app-wrapper {
  height: 100%;
  margin: 0 16px;
  padding-bottom: 28px;
  position: relative;
  display: flex;
  flex-direction: column;
}

.balance-widget {
  position: absolute;
  top: 16px;
  left: 0;
  right: 0;
}

.content {
  flex: 1 0 0;
  margin-top: 120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.title {
  font-family: 'Open Runde', sans-serif;
  color: #453D3C;
  font-size: 36px;
  font-weight: 600;
  line-height: 36px;
  letter-spacing: -0.02em;
  text-align: center;
  white-space: pre-wrap;
}

.description {
  font-family: 'Inter', sans-serif;
  font-size: 17px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: -0.43px;
  text-align: center;
  margin-top: 12px;
  color: #453D3C99;
  white-space: pre-wrap;
}

.buttons {
  display: flex;
  flex-direction: column;
}

.floor {
  margin-top: 12px;
}

.hint {
  margin-bottom: 20px;
  text-align: center;
  font-family: Inter;
  font-size: 17px;
  font-weight: 400;
  line-height: 22px;
  letter-spacing: -0.4300000071525574px;
  color: #453D3C99;
}

@-webkit-keyframes rotating {
  from {
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes rotating {
  from {
    -ms-transform: rotate(0deg);
    -moz-transform: rotate(0deg);
    -webkit-transform: rotate(0deg);
    -o-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  to {
    -ms-transform: rotate(360deg);
    -moz-transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    -o-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
.rotating {
  -webkit-animation: rotating 2s linear infinite;
  -moz-animation: rotating 2s linear infinite;
  -ms-animation: rotating 2s linear infinite;
  -o-animation: rotating 2s linear infinite;
  animation: rotating 2s linear infinite;
}
</style>