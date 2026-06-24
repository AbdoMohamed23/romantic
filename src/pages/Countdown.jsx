import CountdownTimer from '../components/CountdownTimer'

export default function Countdown() {
  return (
    <section className="w-full max-w-3xl text-center">
      <h1 className="mb-8 text-2xl font-semibold text-rose-700 sm:text-3xl">
        Time Together
      </h1>
      <CountdownTimer />
    </section>
  )
}
