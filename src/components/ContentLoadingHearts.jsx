import FlowPage from './FlowPage'

const LOADING_HEARTS = [0, 1, 2, 3, 4]

export default function ContentLoadingHearts() {
  return (
    <FlowPage variant="center">
      <div className="content-loading-hearts" role="status" aria-label="جاري التحميل">
        {LOADING_HEARTS.map((index) => (
          <span
            key={index}
            className="content-loading-hearts__item"
            style={{ '--loading-heart-delay': `${index * 0.18}s` }}
          >
            ♥
          </span>
        ))}
      </div>
    </FlowPage>
  )
}
