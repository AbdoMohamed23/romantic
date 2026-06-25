import { useCallback, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useMusic } from '../context/MusicContext'
import Enter from '../pages/Enter'
import Final from '../pages/Final'
import Gallery from '../pages/Gallery'
import Story from '../pages/Story'
import Welcome from '../pages/Welcome'
import FadeSwap from './FadeSwap'
import RomanticShell from './RomanticShell'

const STEPS = ['welcome', 'story', 'gallery', 'final']

const PREVIOUS_STEP = {
  story: 'welcome',
  gallery: 'story',
  final: 'gallery',
}

export default function Home() {
  const { isAuthenticated, login } = useAuth()
  const { requestMusicStart } = useMusic()
  const [step, setStep] = useState('welcome')

  const screenKey = isAuthenticated ? step : 'login'
  const canGoBack = isAuthenticated && Boolean(PREVIOUS_STEP[step])

  const goTo = useCallback((nextStep) => {
    if (STEPS.includes(nextStep) && nextStep !== step) {
      setStep(nextStep)
    }
  }, [step])

  const handleBack = useCallback(() => {
    const previous = PREVIOUS_STEP[step]
    if (previous) goTo(previous)
  }, [goTo, step])

  const handleLogin = useCallback(() => {
    login()
    requestMusicStart()
    setStep('welcome')
  }, [login, requestMusicStart])

  const renderScreen = (key) => {
    switch (key) {
      case 'login':
        return <Enter onLogin={handleLogin} />
      case 'welcome':
        return <Welcome onNext={() => goTo('story')} />
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

  return (
    <RomanticShell
      showMusic={isAuthenticated}
      showBack={canGoBack}
      onBack={handleBack}
    >
      <FadeSwap activeKey={screenKey} className="flow-screen">
        {renderScreen}
      </FadeSwap>
    </RomanticShell>
  )
}
