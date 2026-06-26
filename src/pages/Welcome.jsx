import FlowPage from '../components/FlowPage'
import NextButton from '../components/NextButton'
import { RevealGroup, RevealItem } from '../components/Reveal'
import WordByWord from '../components/WordByWord'
import { useContent } from '../context/ContentContext'
import { config } from '../data/config'

function WelcomeBody({ welcome, onNext, soft }) {
  if (soft) {
    return (
      <div className="flex w-full flex-col items-center">
        <div className="heart-pulse theme-shadow-glow mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500">
          <span className="text-2xl text-white">♥</span>
        </div>

        <p className="text-xs font-medium text-rose-400">{welcome.eyebrow}</p>

        <h1 className="font-display mt-3 text-4xl font-bold text-rose-900">
          {welcome.title}
        </h1>

        <div className="content-card content-card-lg mt-8 w-full">
          <p className="text-base leading-loose text-rose-700 sm:text-lg">
            {welcome.subtitle}
          </p>
        </div>

        <div className="mt-10 w-full">
          <NextButton onClick={onNext}>{welcome.nextButton}</NextButton>
        </div>
      </div>
    )
  }

  return (
    <RevealGroup className="flex w-full flex-col items-center">
      <RevealItem>
        <div className="heart-pulse theme-shadow-glow mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500">
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
        <div className="content-card content-card-lg w-full">
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
  )
}

export default function Welcome({ onNext, soft = false }) {
  const { content } = useContent()
  const { welcome } = content

  return (
    <FlowPage variant="center">
      <WelcomeBody welcome={welcome} onNext={onNext} soft={soft} />
    </FlowPage>
  )
}
