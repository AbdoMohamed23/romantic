import FlowPage from '../components/FlowPage'
import { RevealGroup, RevealItem } from '../components/Reveal'
import WordByWord from '../components/WordByWord'
import { useContent } from '../context/ContentContext'
import { config } from '../data/config'

export default function Final() {
  const { content } = useContent()
  const { final } = content

  return (
    <FlowPage variant="center">
      <RevealGroup className="flex w-full flex-col items-center">
        <RevealItem>
          <div className="heart-pulse mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-400 to-pink-500 shadow-[0_0_32px_rgba(244,114,182,0.5)]">
            <span className="text-2xl text-white">♥</span>
          </div>
        </RevealItem>

        <RevealItem>
          <p className="text-xs font-medium text-rose-400">{final.eyebrow}</p>
        </RevealItem>

        <RevealItem>
          <h1 className="font-display mt-3 text-4xl font-bold text-rose-900">
            {final.title}
          </h1>
        </RevealItem>

        <RevealItem className="mt-8 w-full">
          <div className="w-full rounded-3xl border border-white/60 bg-white/60 p-6 backdrop-blur-md">
            <WordByWord
              text={final.text}
              wordDelay={config.animations.text.wordDelay}
              className="text-base leading-loose text-rose-700 sm:text-lg"
            />
          </div>
        </RevealItem>

        <RevealItem className="mt-10">
          <p className="heart-pulse text-3xl text-rose-400">♥</p>
        </RevealItem>
      </RevealGroup>
    </FlowPage>
  )
}
