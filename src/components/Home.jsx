import { useCallback, useState } from 'react'
import { config } from '../data/config'
import { useAuth } from '../hooks/useAuth'
import { useMusic } from '../context/MusicContext'
import Enter from '../pages/Enter'
import Final from '../pages/Final'
import Gallery from '../pages/Gallery'
import Story from '../pages/Story'
import Welcome from '../pages/Welcome'
import FadeSwap from './FadeSwap'
import LoginHeartBurst from './LoginHeartBurst'
import RomanticShell from './RomanticShell'

const STEPS = ['enter', 'welcome', 'story', 'gallery', 'final']
const { skipIntroKey } = config.auth

const PREVIOUS_STEP = {
  story: 'welcome',
  gallery: 'story',
  final: 'gallery',
}

function shouldSkipLoginIntro() {
  return sessionStorage.getItem(skipIntroKey) === 'true'
}

export default function Home() {
  const { isAuthenticated, login } = useAuth()
  const { requestMusicStart, playMusic } = useMusic()
  const [step, setStep] = useState(() => (isAuthenticated ? 'welcome' : 'enter'))
  const [heartOverlay, setHeartOverlay] = useState(false)
  const [welcomeFadeDone, setWelcomeFadeDone] = useState(false)
  const [calmWelcome, setCalmWelcome] = useState(isAuthenticated)

  const canGoBack =
    isAuthenticated && Boolean(PREVIOUS_STEP[step]) && !heartOverlay

  const goTo = useCallback((nextStep) => {
    if (STEPS.includes(nextStep) && nextStep !== step) {
      setStep(nextStep)
    }
  }, [step])

  const handleBack = useCallback(() => {
    const previous = PREVIOUS_STEP[step]
    if (previous) goTo(previous)
  }, [goTo, step])

  const completeLogin = useCallback(() => {
    login()
  }, [login])

  const handleLogin = useCallback(() => {
    if (shouldSkipLoginIntro()) {
      sessionStorage.removeItem(skipIntroKey)
      setCalmWelcome(true)
      completeLogin()
      requestMusicStart()
      void playMusic()
      setStep('welcome')
      return
    }

    setWelcomeFadeDone(false)
    requestMusicStart()
    void playMusic()
    setHeartOverlay(true)
  }, [completeLogin, requestMusicStart, playMusic])

  const handleHeartsCovered = useCallback(() => {
    setCalmWelcome(true)
    completeLogin()
    setStep('welcome')
    setWelcomeFadeDone(true)
  }, [completeLogin])

  const handleHeartsComplete = useCallback(() => {
    setHeartOverlay(false)
    setWelcomeFadeDone(false)
  }, [])

  const handleWelcomeNext = useCallback(() => {
    setCalmWelcome(false)
    goTo('story')
  }, [goTo])

  const renderStep = (key) => {
    switch (key) {
      case 'enter':
        return <Enter onLogin={handleLogin} />
      case 'welcome':
        return (
          <Welcome soft={calmWelcome} onNext={handleWelcomeNext} />
        )
      case 'story':
        return <Story onNext={() => goTo('gallery')} />
      case 'gallery':
        return <Gallery onNext={() => goTo('final')} />
      case 'final':
        return <Final />
      default:
        return null
    }
  }

  const showMusic = heartOverlay || (isAuthenticated && step !== 'enter')

  return (
    <RomanticShell
      showMusic={showMusic}
      showBack={canGoBack}
      onBack={handleBack}
    >
      <FadeSwap activeKey={step} className="flow-screen">
        {renderStep}
      </FadeSwap>

      {heartOverlay ? (
        <LoginHeartBurst
          onCovered={handleHeartsCovered}
          onComplete={handleHeartsComplete}
          canExit={welcomeFadeDone}
        />
      ) : null}
    </RomanticShell>
  )
}
