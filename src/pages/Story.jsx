import FlowPage from '../components/FlowPage'
import NextButton from '../components/NextButton'
import { RevealItem } from '../components/Reveal'
import StoryTimeline, {
  TimelineLoveConfession,
  TimelineMemoryCard,
  TimelineMilestone,
} from '../components/StoryTimeline'
import { useContent } from '../context/ContentContext'

export default function Story({ onNext }) {
  const { content } = useContent()
  const { story, memories, dates } = content
  const lastMemoryIndex = memories.length - 1

  return (
    <FlowPage variant="flow" className="pb-8">
      <RevealItem as="header" className="mb-8 w-full">
        <p className="text-xs font-medium tracking-wide text-rose-400">
          {story.eyebrow}
        </p>
        <h1 className="font-display mt-2 text-3xl font-bold text-rose-900">
          {story.title}
        </h1>
      </RevealItem>

      <StoryTimeline>
          <TimelineMilestone
            label={story.firstMeeting.label}
            date={dates.firstMeeting}
          >
            {story.firstMeeting.description}
          </TimelineMilestone>

          <TimelineLoveConfession
            label={story.loveConfession.label}
            date={dates.loveConfession}
            message={story.loveConfession.message}
          />

          {memories.map((memory, index) => (
            <TimelineMemoryCard
              key={memory.id}
              memory={memory}
              showConnector={index < lastMemoryIndex}
            />
          ))}
      </StoryTimeline>

      <RevealItem className="mt-6 w-full">
        <NextButton onClick={onNext}>{story.memoriesButton}</NextButton>
      </RevealItem>
    </FlowPage>
  )
}
