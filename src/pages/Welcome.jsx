import { useState } from 'react'
import FlowPage from '../components/FlowPage'
import FullscreenHeartReveal from '../components/FullscreenHeartReveal'
import NextButton from '../components/NextButton'
import { RevealGroup, RevealItem } from '../components/Reveal'
import WordByWord from '../components/WordByWord'
import { useContent } from '../context/ContentContext'
import { config } from '../data/config'

export default function Welcome({ onNext, onIntroComplete }) {
  const [introDone, setIntroDone] = useState(false)
  const { content } = useContent()
  const { welcome } = content

  const handleIntroComplete = () => {
    setIntroDone(true)
    onIntroComplete?.()
  }

  return (
    <FlowPage variant="center">
      {!introDone ? (
        <FullscreenHeartReveal onComplete={handleIntroComplete} />
      ) : null}

      {introDone ? (
        <RevealGroup className="flex w-full flex-col items-center">
          <RevealItem>
            <div className="heart-pulse mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-[0_0_32px_rgba(244,114,182,0.5)]">
              <span className="text-2xl text-white">♥</span>
            </div>
          </RevealItem>

          <RevealItem>
            <p className="text-xs font-medium text-rose-400">{welcome.eyebrow}</p>
          </RevealItem>

          <RevealItem>
            <h1 className="font-display mt-3 text-4xl font-bold text-rose-900">
              {welcome.title}
            </h1>
          </RevealItem>

          <RevealItem className="mt-8 w-full">
            <div className="w-full rounded-3xl border border-white/60 bg-white/60 p-6 backdrop-blur-md">
              <WordByWord
                text={welcome.subtitle}
                wordDelay={config.animations.text.wordDelay}
                className="text-base leading-loose text-rose-700 sm:text-lg"
              />
            </div>
          </RevealItem>

          <RevealItem className="mt-10 w-full">
            <NextButton onClick={onNext}>{welcome.nextButton}</NextButton>
          </RevealItem>
        </RevealGroup>
      ) : null}
    </FlowPage>
  )
}
