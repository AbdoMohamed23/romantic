import FlowPage from '../components/FlowPage'
import NextButton from '../components/NextButton'
import { useContent } from '../context/ContentContext'

export default function Welcome({ onNext }) {
  const { content } = useContent()
  const { welcome } = content

  return (
    <FlowPage variant="center">
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
    </FlowPage>
  )
}
