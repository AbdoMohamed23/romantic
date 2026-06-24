import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import StoryTimeline, {
  TimelineLoveConfession,
  TimelineMemoryCard,
  TimelineMilestone,
} from '../components/StoryTimeline'
import { useContent } from '../context/ContentContext'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Story() {
  const navigate = useNavigate()
  const { content } = useContent()
  const { story, memories, dates } = content
  const lastMemoryIndex = memories.length - 1

  return (
    <motion.article
      className="mx-auto w-full pb-8"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.header variants={itemVariants} className="mb-8 text-center">
        <p className="text-xs font-medium tracking-wide text-rose-400">
          {story.eyebrow}
        </p>
        <h1 className="font-display mt-2 text-3xl font-bold text-rose-900">
          {story.title}
        </h1>
      </motion.header>

      <StoryTimeline>
        <TimelineMilestone
          label={story.firstMeeting.label}
          date={dates.firstMeeting}
          motionVariants={itemVariants}
        >
          {story.firstMeeting.description}
        </TimelineMilestone>

        <TimelineLoveConfession
          label={story.loveConfession.label}
          date={dates.loveConfession}
          message={story.loveConfession.message}
          motionVariants={itemVariants}
        />

        {memories.map((memory, index) => (
          <TimelineMemoryCard
            key={memory.id}
            memory={memory}
            showConnector={index < lastMemoryIndex}
            motionVariants={itemVariants}
          />
        ))}
      </StoryTimeline>

      <motion.div
        variants={itemVariants}
        className="mt-6 flex justify-center px-2"
      >
        <motion.button
          type="button"
          whileHover={{ scale: 1.03, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate('/gallery')}
          className="w-full max-w-sm rounded-2xl bg-gradient-to-r from-rose-400 via-pink-400 to-rose-500 px-6 py-4 text-base font-semibold text-white shadow-lg shadow-rose-200/80"
        >
          {story.memoriesButton}
        </motion.button>
      </motion.div>
    </motion.article>
  )
}
