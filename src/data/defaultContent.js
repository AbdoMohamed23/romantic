import { musicAsset } from './musicAsset'

export const defaultContent = {
  siteName: 'هدية حب',
  password: 'ThisIsLove',
  adminPassword: 'ThisIsLove',
  appearance: {
    primaryColor: '#fb7185',
    backgroundHeartColor: '#be123c',
    heartOpacity: 0.65,
  },
  dates: {
    relationshipStart: '2023-06-24T00:00:00',
    firstMeeting: '2023-06-24',
    loveConfession: '2023-09-14',
  },
  music: {
    fileName: 'romantic.mp3',
    title: 'أغنيتنا',
    src: musicAsset || '',
    volume: 0.35,
  },
  login: {
    eyebrow: 'هدية من قلبي',
    title: 'أهلاً يا حبيبتي',
    subtitle:
      'خلف هذا الباب عالم صغير صنعته لكِ وحدك — ذكرياتنا، قصتنا، وكل نبضة حب في قلبي.',
    placeholder: 'كلمة المرور السرية',
    passwordLabel: 'كلمة المرور',
    button: 'افتحي قلبي',
    error: 'كلمة المرور غير صحيحة، حاولي مرة أخرى يا جميلتي.',
    footer: 'صُنع بحب، لكِ وحدك',
  },
  welcome: {
    eyebrow: 'وصلتِ إليه أخيراً',
    title: 'مرحباً يا أجمل حب في حياتي',
    subtitle:
      'كل ما ينتظركِ هنا كُتب وأُعدّ بكِ في بالي — رحلة ناعمة عبر قصتنا، وقتنا، والحب الذي نعيشه معاً.',
    nextButton: 'Next',
  },
  story: {
    eyebrow: 'A Love Story',
    title: 'Our Story',
    firstMeeting: {
      label: 'أول يوم التقينا فيه',
      description:
        'لم أكن أعلم بعد، لكن قلبي كان قد بدأ بالفعل يجد طريقه إليكِ.',
    },
    loveConfession: {
      label: 'اليوم الذي قلت فيه "أحبك"',
      message:
        'ثلاث كلمات صغيرة — وفجأة أصبح العالم أدفأ، وأنعم، وأجمل بلا حدود.',
    },
    memoriesButton: 'Our Memories',
  },
  gallery: {
    eyebrow: 'Our Album',
    title: 'Memories',
    finalButton: 'Next',
  },
  final: {
    eyebrow: 'رسالة أخيرة',
    title: 'للأبد ودائماً',
    text: 'أينما ذهب بنا الحياة، سيجد قلبي دائماً طريقه العائد إليكِ. أنتِ حلمي الذي أريد أن أعيشه كل يوم، ونبضتي التي أشتاق إليها في كل لحظة. شكراً لأنكِ أنتِ.',
  },
  memories: [
    {
      id: 1,
      image: '',
      date: '2023-07-20',
      text: 'أول مشية طويلة لنا — ضحكنا حتى راقدت النجوم.',
    },
    {
      id: 2,
      image: '',
      date: '2023-12-25',
      text: 'أمسية شتوية دافئة، مليئة بالحنان والأحلام الهمسية.',
    },
    {
      id: 3,
      image: '',
      date: '2024-02-14',
      text: 'ورود، ضحك، وقلب عرف أنه وجد بيته.',
    },
    {
      id: 4,
      image: '',
      date: '2024-06-24',
      text: 'فصل جديد منا — أحلى من الذي قبله.',
    },
  ],
  galleryItems: [],
}
