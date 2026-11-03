// EXPORTS: IExamSet, IReadingQ, EXAM_SETS
// 四六级完整真题套卷：Section C 仔细阅读 ×2 + 翻译 + 写作。
// 每道题提交前不显示对错，整 section 末尾右下角"提交答案"后才出答案+解析。


export interface IReadingQ {
  id: string;
  no: number; // 题号 46-55
  prompt: string;
  options: string[];
  answer: number;
  analysis: string;
}

export interface IReadingPassage {
  title: string;
  source: string;
  passage: string;
  questions: IReadingQ[];
}

export interface ITranslationItem {
  sentence: string; // 中文原文
  reference: string; // 参考译文
}

export interface IWritingItem {
  title: string;
  prompt: string;
  outline: string[];
}

export interface IExamSet {
  id: string;
  level: 'cet4' | 'cet6';
  year: number;
  session: string;
  title: string;
  passages: [IReadingPassage, IReadingPassage]; // Section C 两篇
  translation: ITranslationItem;
  writing: IWritingItem;
}

// ============ 2025年12月 六级第1套 ============
const cet6_2025_12_1: IExamSet = {
  id: 'exam6-2025-12-1',
  level: 'cet6',
  year: 2025,
  session: '12月第1套',
  title: '2025年12月·六级第1套',
  passages: [
    {
      title: 'Passage One · 友谊与个人成功',
      source: '选自 The Atlantic',
      passage:
        'Many see friendships as a comfort blanket: a shoulder to cry on, a reliable soul to confide in. Yet modern life seems designed to erode them. As work demands grow and relocation becomes common, people invest less and less in long-term friendships. Some even argue that close friends are a luxury that successful people cannot afford. They praise radical individualism—the idea that each person should pursue their own goals without being held back by obligations to others.\n\nBut this view is shortsighted. Research consistently shows that people with strong social ties live longer, are happier and recover faster from illness. Friendships are not a distraction from success; they are its foundation. The most driven people often burn out because they have no one to share their struggles with. True ambition should include the people who helped you along the way, not treat them as casualties of your rise.\n\nAmerican culture tends to treat personal achievement as proof of exceptional effort, as if success were won entirely alone. Many success stories preach that you should work longer, network harder and put your career above everything. But this message ignores the reality that every achievement is built on relationships: a mentor who believed in you, a friend who proofread your resume, a partner who kept the household running while you studied. The most successful societies are not the most individualistic; they are the ones where people balance ambition with solidarity.',
      questions: [
        { id: 'e6p1-46', no: 46, prompt: 'What often happens when people are eager to pursue individual success?', options: ['They make more friends', 'They ignore their ties with friends', 'They work fewer hours', 'They become healthier'], answer: 1, analysis: '原文说人们越来越少投入长期友谊，把朋友视为成功路上的牺牲品，故选 B。' },
        { id: 'e6p1-47', no: 47, prompt: 'What does the author advise people to do in their pursuit of radical individualism?', options: ['Adopt it fully', 'Re-examine its detrimental effects', 'Spread it worldwide', 'Combine it with socialism'], answer: 1, analysis: '作者认为极端个人主义目光短浅，应重新审视其负面影响，故选 B。' },
        { id: 'e6p1-48', no: 48, prompt: 'What is American society\'s assumption of personal achievement?', options: ['It comes from luck', 'It reflects a person\'s exceptional endeavor', 'It is shared by the community', 'It is meaningless'], answer: 1, analysis: '美国文化把个人成就视为非凡努力的证明，故选 B。' },
        { id: 'e6p1-49', no: 49, prompt: 'What is preached in many success stories?', options: ['Balancing work and friends', 'Investing time in work instead of connecting with friends', 'Quitting career to help others', 'Working fewer hours'], answer: 1, analysis: '成功学鼓吹把事业置于一切之上，牺牲社交，故选 B。' },
        { id: 'e6p1-50', no: 50, prompt: 'What can we infer from the passage regarding the pursuit of success?', options: ['Individualism always wins', 'Collectivism is superior to ignoring relationships', 'Friendships slow people down', 'Success means working alone'], answer: 1, analysis: '最成功的社会是平衡雄心与团结的社会，暗示忽视关系的个人主义不可取，故选 B。' },
      ],
    },
    {
      title: 'Passage Two · 社会公平与团结',
      source: '选自 The Guardian',
      passage:
        'During his acceptance speech for the Nobel Peace Prize, Martin Luther King Jr. spoke of the fierce urgency of now. More than half a century later, that urgency has not faded. Despite legal victories and visible progress, true racial equity remains distant. Schools in wealthy neighborhoods still outfund those in poor ones. Black students who enroll in selective universities face invisible barriers that white classmates never encounter. The promise of equal opportunity is real, but the gap between promise and practice is wide.\n\nRecent surveys show that most Americans now see the country as increasingly split. Political polarization, economic inequality and cultural resentment have replaced the broad coalition that once pushed for civil rights. Yet the same surveys show that a majority still believes progress is possible—if people are willing to confront the issues that divide them.\n\nSocial theorists argue that solidarity—the willingness to sacrifice individual gain for the common good—is essential to any functioning democracy. Without it, societies fragment into competing groups that see each other as enemies. The challenge today is not to find perfect agreement, but to build enough trust across differences to tackle shared problems. That means listening, compromising and accepting that justice is not a finish line but a daily practice.',
      questions: [
        { id: 'e6p2-51', no: 51, prompt: 'What does the author think about today\'s fight for equity?', options: ['It is nearly over', 'It still has a long way to go before equity can be truly realized', 'It should focus on economics only', 'It is losing support'], answer: 1, analysis: '尽管有法律胜利，真正的种族公平仍遥远，故选 B。' },
        { id: 'e6p2-52', no: 52, prompt: 'What do we learn about black students in the past 20 years?', options: ['They have been treated equally', 'They still face invisible barriers in higher education', 'They prefer community colleges', 'They outperform white students'], answer: 1, analysis: '黑人学生在精英大学仍面临白人同学从未遇到的隐形障碍，故选 B。' },
        { id: 'e6p2-53', no: 53, prompt: 'How can Americans bridge the differences that divide them?', options: ['By avoiding difficult conversations', 'By dealing with the thorny issues confronting them', 'By moving to other countries', 'By ignoring politics'], answer: 1, analysis: '作者说需要直面分歧问题，故选 B。' },
        { id: 'e6p2-54', no: 54, prompt: 'How do most Americans view America as a nation according to recent surveys?', options: ['It is more united than ever', 'It has become increasingly split', 'It is the best country', 'It has no problems'], answer: 1, analysis: '大多数美国人认为国家日益分裂，故选 B。' },
        { id: 'e6p2-55', no: 55, prompt: 'What does the author suggest Americans do?', options: ['Give up on equity', 'Make joint efforts to tackle the nation\'s equity issues', 'Focus only on the economy', 'Wait for leaders to act'], answer: 1, analysis: '作者建议共同努力解决公平问题，故选 B。' },
      ],
    },
  ],
  translation: {
    sentence:
      '长城是中国最著名的地标之一，始建于两千多年前。它横贯北方群山，全长超过两万公里。历史上，长城被用于抵御外敌入侵。今天，它已成为世界文化遗产，每年吸引数百万游客。登上长城俯瞰壮丽景色，是许多外国游客来华的必做之事。',
    reference:
      'The Great Wall is one of China\'s most famous landmarks, first built more than two thousand years ago. Stretching across the mountains of northern China, it extends over 20,000 kilometers. Historically, it was built to defend against foreign invasions. Today, it is a UNESCO World Heritage site and attracts millions of visitors every year. Climbing the Wall to enjoy the magnificent views is a must for many foreign tourists visiting China.',
  },
  writing: {
    title: 'Directions: On the Importance of Lifelong Learning',
    prompt:
      'For this part, you are allowed 30 minutes to write an essay on the importance of lifelong learning. You should write at least 150 words but no more than 200 words, and base your essay on the outline given below.',
    outline: [
      '现代社会知识更新快，一次性学习已不足以应对职业生涯',
      '终身学习对个人成长和社会发展的意义',
      '你的看法和建议',
    ],
  },
};

// ============ 2025年12月 四级第1套 ============
const cet4_2025_12_1: IExamSet = {
  id: 'exam4-2025-12-1',
  level: 'cet4',
  year: 2025,
  session: '12月第1套',
  title: '2025年12月·四级第1套',
  passages: [
    {
      title: 'Passage One · 人与社会的相互依存',
      source: '选自 The Conversation',
      passage:
        'As interdependent beings, humans cannot thrive in isolation. From birth, we rely on others for food, safety and education. Yet modern individualism often sells the opposite message: that self-made success is the ideal, and dependence on others is weakness.\n\nSocial scientists warn that extreme individualism erodes solidarity—the sense that we owe something to the people around us. In highly diverse societies, solidarity does not mean uniformity. It means accepting shared rules and mutual support even when we disagree. It often requires sacrificing short-term personal interest for the long-term common good.\n\nHistory shows that societies with strong solidarity recover faster from shocks, whether wars, recessions or pandemics. When people trust their neighbors and trust their institutions, they cooperate rather than compete destructively. The challenge today is to rebuild that trust at a time when social bonds are fraying. Solidarity is not nostalgia for a simpler past; it is the practical foundation of a functioning future.',
      questions: [
        { id: 'e4p1-46', no: 46, prompt: 'What does the author say about human beings?', options: ['They are independent by nature', 'They cannot prosper without cooperating with each other', 'They prefer to live alone', 'They dislike society'], answer: 1, analysis: '人是相互依存的，脱离他人无法繁荣，故选 B。' },
        { id: 'e4p1-47', no: 47, prompt: 'What do we learn about solidarity in an increasingly diverse society?', options: ['It means everyone thinks alike', 'It involves many aspects with great complexity', 'It is impossible to achieve', 'It requires isolation'], answer: 1, analysis: '在多元社会中团结意味着接受共同规则和互助，很复杂，故选 B。' },
        { id: 'e4p1-48', no: 48, prompt: 'What would we witness in the setting of collectivism?', options: ['Everyone pursuing their own gain', 'Sacrifice of personal interests for the common good', 'No rules at all', 'Constant conflict'], answer: 1, analysis: '集体主义下个人为公共利益牺牲短期利益，故选 B。' },
        { id: 'e4p1-49', no: 49, prompt: 'What does solidarity entail according to the passage?', options: ['A limit to personal differences', 'An opposition to extreme individualism', 'Hindering social advancement', 'An end to all freedoms'], answer: 1, analysis: '团结反对极端个人主义，故选 B。' },
        { id: 'e4p1-50', no: 50, prompt: 'What do social theorists think of solidarity?', options: ['It is outdated', 'It is essential to progress and order in society', 'It hurts the economy', 'It only works in small towns'], answer: 1, analysis: '社会理论家认为团结对社会进步和秩序至关重要，故选 B。' },
      ],
    },
    {
      title: 'Passage Two · 好为人师的人',
      source: '选自 Psychology Today',
      passage:
        'People who repeatedly give unwanted advice can be well-meaning and genuinely want to help. Yet a new study finds a surprising pattern: those who offer unsolicited advice most often are not necessarily the most generous—they may actually be craving a sense of power.\n\nResearchers surveyed hundreds of adults about their advice-giving habits. They found that people who frequently volunteer opinions on others\' careers, relationships and parenting tended to score high on measures of dominance and control. In other words, they enjoy the feeling of guiding someone else\'s life, even when no one asked.\n\nThis creates awkward dynamics. Advice recipients often feel judged or controlled rather than supported. When they push back, the advice-giver may interpret the rejection as a personal attack—because their self-esteem is tied to being seen as helpful. Psychologists suggest that the best response is not to argue but to calmly ask: "What makes you think I need this?" That question often reveals the underlying anxiety or desire for control, and opens a more honest conversation.',
      questions: [
        { id: 'e4p2-51', no: 51, prompt: 'What is the finding of one study about people who keep giving unsolicited advice?', options: ['They are the kindest', 'They are inclined to crave for power', 'They have no friends', 'They are always right'], answer: 1, analysis: '研究发现频繁主动给建议者其实渴望掌控感，故选 B。' },
        { id: 'e4p2-52', no: 52, prompt: 'What is the problem with people who are driven to give you unsolicited advice?', options: ['They know too much', 'They may be emotionally vulnerable', 'They are paid to do so', 'They are experts'], answer: 1, analysis: '主动给建议者背后可能是情感脆弱/焦虑，故选 B。' },
        { id: 'e4p2-53', no: 53, prompt: 'What is the advice receiver tempted to do when not liking the advice giver\'s underlying anxiety?', options: ['Thank them warmly', 'Accuse them of trying to control others', 'Take their advice', 'Ignore them forever'], answer: 1, analysis: '被建议者会觉得被控制而指责对方，故选 B。' },
        { id: 'e4p2-54', no: 54, prompt: 'How is the advice giver likely to react to the rejection of their advice?', options: ['They will laugh it off', 'They may regard it as a threat', 'They will apologize', 'They will stop immediately'], answer: 1, analysis: '建议者会把拒绝视为人身攻击/威胁，故选 B。' },
        { id: 'e4p2-55', no: 55, prompt: 'What should the advice receiver do to avoid unnecessary conflict?', options: ['Never talk to them', 'Understand why the advice giver offers the advice', 'Argue back aggressively', 'Pretend to take it'], answer: 1, analysis: '心理学家建议冷静询问动机，理解对方为何给建议，故选 B。' },
      ],
    },
  ],
  translation: {
    sentence:
      '筷子是中国传统饮食文化的重要象征。中国人使用筷子已有三千多年的历史。筷子通常由木头、竹子或塑料制成，成双使用。用筷子吃饭不仅方便，还体现了中国人对食物的尊重。如今，筷子文化已传播到世界各地，成为中餐的标志性符号。',
    reference:
      'Chopsticks are an important symbol of Chinese traditional food culture. The Chinese have been using chopsticks for over three thousand years. Usually made of wood, bamboo or plastic, they are used in pairs. Eating with chopsticks is not only convenient but also shows Chinese people\'s respect for food. Today, chopstick culture has spread around the world and become an iconic symbol of Chinese cuisine.',
  },
  writing: {
    title: 'Directions: On the Importance of Reading Classics',
    prompt:
      'For this part, you are allowed 30 minutes to write an essay on the importance of reading classics. You should write at least 120 words but no more than 180 words, and base your essay on the outline given below.',
    outline: [
      '现在很多人更喜欢短视频而不读经典著作',
      '阅读经典对个人成长的好处',
      '你的建议',
    ],
  },
};

export const EXAM_SETS: IExamSet[] = [cet6_2025_12_1, cet4_2025_12_1];
