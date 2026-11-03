// EXPORTS: IVocabWord, VOCAB_WORDS, WORD_CATEGORIES
// 六级核心高频词汇（约 96 个），词性/释义为通用标准英汉释义，含例句中文翻译。

export interface IVocabWord {
  id: string;
  word: string;
  phonetic: string;
  pos: string;
  definition: string;
  example: string;
  exampleZh?: string; // 例句中文翻译（可选）
  category: string;
  // 以下为扩展字段，全部可选；未提供时学习页对应区块不显示
  phrases?: { en: string; zh: string }[]; // 与当前词相关的常用短语
  mnemonic?: string; // 巧记方法（口诀/联想/词根拆解等）
  extraExamples?: { en: string; zh: string }[]; // 额外例句（多给一些）
  senses?: { pos: string; zh: string }[]; // 多义词其它义项（不同词性/含义）
  forms?: { label: string; value: string }[]; // 词形变化（复数/时态/比较级/派生词等）
}

export const WORD_CATEGORIES = [
  '认知与学术',
  '行为与动作',
  '情感与性格',
  '社会与环境',
  '品质与状态',
] as const;

type Category = (typeof WORD_CATEGORIES)[number];

const w = (
  id: string,
  word: string,
  phonetic: string,
  pos: string,
  definition: string,
  example: string,
  category: Category,
  exampleZh?: string,
  extra?: Partial<Pick<IVocabWord, 'phrases' | 'mnemonic' | 'extraExamples'>>,
): IVocabWord => ({ id, word, phonetic, pos, definition, example, exampleZh, category, ...(extra ?? {}) });

export const VOCAB_WORDS: IVocabWord[] = [
  w('w1', 'accommodate', '/əˈkɒmədeɪt/', 'v.', '容纳；使适应，调解', 'The hotel can accommodate up to 500 guests.', '行为与动作', '这家旅馆最多可容纳 500 位客人。', {
    phrases: [{en:'accommodate sb. (with...)', zh:'为某人提供……'}, {en:'accommodate oneself to...', zh:'使自己适应……'}],
    
    extraExamples: [
      {en:'The eye can accommodate to different light levels.', zh:'眼睛能适应不同的光线。'},
      {en:'I will accommodate my plans to yours.', zh:'我会调整计划以配合你的。'},
    ],
  }),
  w('w2', 'alleviate', '/əˈliːvieɪt/', 'v.', '减轻，缓解（痛苦、问题）', 'The medicine helped alleviate the patient’s pain.', '行为与动作', '这种药帮助减轻了病人的疼痛。', {
    phrases: [{en:'alleviate pain/suffering/poverty', zh:'减轻痛苦/苦难/贫困'}, {en:'alleviate the burden of...', zh:'减轻……的负担'}],
    
    extraExamples: [
      {en:'The policy aims to alleviate traffic congestion.', zh:'该政策旨在缓解交通拥堵。'},
      {en:'Nothing could alleviate her disappointment.', zh:'没有什么能减轻她的失望。'},
    ],
  }),
  w('w3', 'ambiguous', '/æmˈbɪɡjuəs/', 'adj.', '模棱两可的，含糊不清的', 'His reply was ambiguous and confused everyone.', '品质与状态', '他的回答模棱两可，让大家都糊涂了。', {
    phrases: [{en:'an ambiguous answer/statement', zh:'模棱两可的回答/说法'}, {en:'be ambiguous about...', zh:'对……含糊其辞'}],
    
    extraExamples: [
      {en:'The wording of the contract is ambiguous.', zh:'合同措辞含糊不清。'},
      {en:'He gave an ambiguous smile.', zh:'他露出一个意味深长的微笑。'},
    ],
  }),
  w('w4', 'anticipate', '/ænˈtɪsɪpeɪt/', 'v.', '预期，预料，期待', 'We anticipate that sales will rise next quarter.', '认知与学术', '我们预计下季度销售额会上升。', {
    phrases: [{en:'anticipate doing sth.', zh:'期待做某事'}, {en:'anticipate that...', zh:'预料……'}],
    
    extraExamples: [
      {en:'We anticipated the storm and closed early.', zh:'我们预料到暴风雨，提前关门了。'},
      {en:'Try to anticipate the customer’s needs.', zh:'要尽量预判客户的需求。'},
    ],
  }),
  w('w5', 'apprehension', '/ˌæprɪˈhenʃn/', 'n.', '忧虑，恐惧；理解', 'She felt some apprehension before the exam.', '情感与性格', '考试前她感到有些忧虑。', {
    phrases: [{en:'feel apprehension about...', zh:'对……感到忧虑'}, {en:'be filled with apprehension', zh:'满怀恐惧'}],
    
    extraExamples: [
      {en:'He watched the door in apprehension.', zh:'他恐惧地盯着门口。'},
      {en:'The matter is beyond my apprehension.', zh:'这件事我无法理解。'},
    ],
  }),
  w('w6', 'articulate', '/ɑːˈtɪkjuleɪt/', 'v./adj.', '清楚表达；口齿清晰的', 'He is able to articulate his ideas clearly.', '认知与学术', '他能清楚表达自己的想法。', {
    phrases: [{en:'articulate sth. for sb.', zh:'为某人把某事讲清楚'}, {en:'an articulate speaker', zh:'口齿清晰的演讲者'}],
    
    extraExamples: [
      {en:'She is articulate and confident.', zh:'她口齿清晰、自信。'},
      {en:'He articulated his opposition to the plan.', zh:'他明确表达了对该计划的反对。'},
    ],
  }),
  w('w7', 'authentic', '/ɔːˈθentɪk/', 'adj.', '真实的，可靠的，正宗的', 'The museum displays authentic historical documents.', '品质与状态', '博物馆展出真实的历史文献。', {
    phrases: [{en:'authentic Italian food', zh:'正宗意大利菜'}, {en:'an authentic document', zh:'真实可靠的文件'}],
    
    extraExamples: [
      {en:'Is that an authentic Picasso?', zh:'那是毕加索真迹吗？'},
      {en:'The hotel offers an authentic local experience.', zh:'这家酒店提供地道的本地体验。'},
    ],
  }),
  w('w8', 'boost', '/buːst/', 'v./n.', '促进，提高，推动', 'The new policy will boost economic growth.', '行为与动作', '新政策将促进经济增长。', {
    phrases: [{en:'boost confidence/morale', zh:'增强信心/士气'}, {en:'a big boost to...', zh:'对……的巨大推动'}],
    
    extraExamples: [
      {en:'Winning the prize boosted her confidence.', zh:'获奖增强了她的信心。'},
      {en:'The tax cut gave a boost to the economy.', zh:'减税推动了经济。'},
    ],
  }),
  w('w9', 'coherent', '/kəʊˈhɪərənt/', 'adj.', '连贯的，条理清楚的', 'She gave a coherent summary of the meeting.', '认知与学术', '她做了条理清晰的会议总结。', {
    phrases: [{en:'a coherent argument/narrative', zh:'连贯的论点/叙述'}, {en:'remain coherent', zh:'保持连贯'}],
    
    extraExamples: [
      {en:'The analysis is clear and coherent.', zh:'分析清晰连贯。'},
      {en:'He was too tired to give a coherent reply.', zh:'他太累了，回答都说不连贯。'},
    ],
  }),
  w('w10', 'collaborate', '/kəˈlæbəreɪt/', 'v.', '合作，协作', 'The two teams will collaborate on the project.', '行为与动作', '两个团队将在该项目上合作。', {
    phrases: [{en:'collaborate with sb. on sth.', zh:'与某人在某事上合作'}, {en:'collaborate closely', zh:'密切合作'}],
    
    extraExamples: [
      {en:'The two companies collaborated on the design.', zh:'两家公司在设计上合作。'},
      {en:'She collaborated with the police on the enquiry.', zh:'她在调查中与警方合作。'},
    ],
  }),
  w('w11', 'compensate', '/ˈkɒmpenseɪt/', 'v.', '补偿，弥补；赔偿', 'Nothing can compensate for the loss of time.', '行为与动作', '任何东西都无法弥补时间上的损失。', {
    phrases: [{en:'compensate sb. for sth.', zh:'因某事赔偿某人'}, {en:'compensate for sth.', zh:'弥补某事'}],
    
    extraExamples: [
      {en:'The company compensated him for the injury.', zh:'公司因他受伤给予赔偿。'},
      {en:'Her enthusiasm compensates for her lack of experience.', zh:'她的热情弥补了经验的不足。'},
    ],
  }),
  w('w12', 'comprehensive', '/ˌkɒmprɪˈhensɪv/', 'adj.', '全面的，综合的，详尽的', 'The report gives a comprehensive overview.', '认知与学术', '这份报告给出了全面的概述。', {
    phrases: [{en:'a comprehensive study/review', zh:'全面的研究/回顾'}, {en:'comprehensive insurance', zh:'全险'}],
    
    extraExamples: [
      {en:'We need a comprehensive plan.', zh:'我们需要一个全面的计划。'},
      {en:'The book provides a comprehensive guide.', zh:'这本书提供了详尽指南。'},
    ],
  }),
  w('w13', 'conform', '/kənˈfɔːm/', 'v.', '遵守，符合，顺应', 'Students must conform to the school rules.', '行为与动作', '学生必须遵守学校规则。', {
    phrases: [{en:'conform to sth.', zh:'遵守/符合某事'}, {en:'conform with regulations', zh:'符合规定'}],
    
    extraExamples: [
      {en:'The building conforms to safety standards.', zh:'这座建筑符合安全标准。'},
      {en:'He refused to conform to social expectations.', zh:'他拒绝迎合社会期待。'},
    ],
  }),
  w('w14', 'consecutive', '/kənˈsekjətɪv/', 'adj.', '连续的，连贯的', 'It rained for three consecutive days.', '品质与状态', '一连下了三天雨。', {
    phrases: [{en:'three consecutive days/wins', zh:'连续三天/连胜'}, {en:'on consecutive occasions', zh:'连续多次'}],
    
    extraExamples: [
      {en:'She was voted MVP for the third consecutive year.', zh:'她连续第三年当选最有价值球员。'},
      {en:'The team won five consecutive games.', zh:'球队连胜五场。'},
    ],
  }),
  w('w15', 'consolidate', '/kənˈsɒlɪdeɪt/', 'v.', '巩固，加强；合并', 'The company moved to consolidate its market position.', '行为与动作', '公司着手巩固其市场地位。', {
    phrases: [{en:'consolidate power/one’s position', zh:'巩固权力/地位'}, {en:'consolidate debts', zh:'合并债务'}],
    
    extraExamples: [
      {en:'She took a break to consolidate her learning.', zh:'她休息一下以巩固所学。'},
      {en:'The two banks consolidated last year.', zh:'两家银行去年合并了。'},
    ],
  }),
  w('w16', 'contemplate', '/ˈkɒntəmpleɪt/', 'v.', '沉思，仔细考虑', 'She contemplated changing her career.', '认知与学术', '她考虑更换职业。', {
    phrases: [{en:'contemplate doing sth.', zh:'考虑做某事'}, {en:'contemplate the future', zh:'思考未来'}],
    
    extraExamples: [
      {en:'He sat there, contemplating his options.', zh:'他坐在那里，思考自己的选择。'},
      {en:'I have never contemplated suicide.', zh:'我从未有过自杀的念头。'},
    ],
  }),
  w('w17', 'controversial', '/ˌkɒntrəˈvɜːʃl/', 'adj.', '有争议的，引起争论的', 'The new law is highly controversial.', '社会与环境', '这部新法律极具争议。', {
    phrases: [{en:'a controversial issue/decision', zh:'有争议的问题/决定'}, {en:'highly controversial', zh:'极具争议'}],
    
    extraExamples: [
      {en:'Abortion is a controversial topic.', zh:'堕胎是个有争议的话题。'},
      {en:'He wrote a controversial book on education.', zh:'他写了一本有争议的教育书。'},
    ],
  }),
  w('w18', 'criteria', '/kraɪˈtɪəriə/', 'n.', '标准，准则（criterion 的复数）', 'The selection is based on strict criteria.', '认知与学术', '选拔基于严格的标准。', {
    phrases: [{en:'meet the criteria', zh:'符合标准'}, {en:'based on... criteria', zh:'以……为标准'}],
    
    extraExamples: [
      {en:'What are the criteria for admission?', zh:'录取标准是什么？'},
      {en:'The design fails to meet our criteria.', zh:'该设计不符合我们的标准。'},
    ],
  }),
  w('w19', 'cultivate', '/ˈkʌltɪveɪt/', 'v.', '培养，栽培；发展（关系、习惯）', 'Reading helps cultivate independent thinking.', '行为与动作', '阅读有助于培养独立思考。', {
    phrases: [{en:'cultivate good habits', zh:'养成好习惯'}, {en:'cultivate a hobby', zh:'培养爱好'}],
    
    extraExamples: [
      {en:'They cultivate rice in the south.', zh:'他们在南方种水稻。'},
      {en:'You should cultivate a positive attitude.', zh:'你应培养积极的态度。'},
    ],
  }),
  w('w20', 'dedicate', '/ˈdedɪkeɪt/', 'v.', '奉献，致力于', 'She dedicated herself to scientific research.', '行为与动作', '她献身于科学研究。', {
    phrases: [{en:'dedicate oneself to sth.', zh:'献身于某事'}, {en:'dedicate time to sth.', zh:'把时间献给某事'}],
    
    extraExamples: [
      {en:'He dedicated his life to helping the poor.', zh:'他一生都在帮助穷人。'},
      {en:'The book is dedicated to my wife.', zh:'谨以此书献给我的妻子。'},
    ],
  }),
  w('w21', 'deficiency', '/dɪˈfɪʃnsi/', 'n.', '缺乏，不足；缺陷', 'A vitamin deficiency can cause fatigue.', '品质与状态', '缺乏维生素会导致疲劳。', {
    phrases: [{en:'a deficiency of/in sth.', zh:'缺乏某物'}, {en:'mental deficiency', zh:'智力缺陷'}],
    
    extraExamples: [
      {en:'The doctor found a deficiency in iron.', zh:'医生发现缺铁。'},
      {en:'They tried to compensate for their deficiencies.', zh:'他们努力弥补不足。'},
    ],
  }),
  w('w22', 'degrade', '/dɪˈɡreɪd/', 'v.', '降低，退化；贬低', 'Plastic waste degrades very slowly in nature.', '社会与环境', '塑料垃圾在自然界降解得非常缓慢。', {
    phrases: [{en:'degrade quickly/slowly', zh:'降解快/慢'}, {en:'feel degraded', zh:'感到受辱'}],
    
    extraExamples: [
      {en:'The material degrades over time.', zh:'这种材料会随时间降解。'},
      {en:'You degrade yourself by lying.', zh:'你说谎是在贬低自己。'},
    ],
  }),
  w('w23', 'deliberate', '/dɪˈlɪbərət/', 'adj./v.', '故意的；仔细考虑', 'It was a deliberate attempt to mislead the public.', '认知与学术', '这是故意误导公众的企图。', {
    phrases: [{en:'a deliberate act/attempt', zh:'故意行为/企图'}, {en:'deliberate on sth.', zh:'仔细考虑某事'}],
    
    extraExamples: [
      {en:'Her answer was slow and deliberate.', zh:'她的回答缓慢而慎重。'},
      {en:'We need to deliberate before deciding.', zh:'我们决定前要慎重考虑。'},
    ],
  }),
  w('w24', 'denote', '/dɪˈnəʊt/', 'v.', '表示，意味着，指代', 'The term can denote more than one meaning.', '认知与学术', '该词可以表示不止一种含义。', {
    phrases: [{en:'denote sth.', zh:'表示某物'}, {en:'often denote...', zh:'常表示……'}],
    
    extraExamples: [
      {en:'A red line on the map denotes a railway.', zh:'地图上的红线表示铁路。'},
      {en:'The symbol denotes danger.', zh:'这个符号表示危险。'},
    ],
  }),
  w('w25', 'deprive', '/dɪˈpraɪv/', 'v.', '剥夺，使丧失', 'The noise deprived us of a good night’s sleep.', '行为与动作', '噪音让我们无法好好睡一觉。', {
    phrases: [{en:'deprive sb. of sth.', zh:'剥夺某人某物'}, {en:'deprive sb. of sleep/freedom', zh:'剥夺某人睡眠/自由'}],
    
    extraExamples: [
      {en:'They were deprived of education.', zh:'他们被剥夺了受教育的权利。'},
      {en:'The court deprived him of his parental rights.', zh:'法院剥夺了他的抚养权。'},
    ],
  }),
  w('w26', 'derive', '/dɪˈraɪv/', 'v.', '源于，从……获得', 'Many English words derive from Latin.', '认知与学术', '许多英语单词源自拉丁语。', {
    phrases: [{en:'derive from...', zh:'源于……'}, {en:'derive pleasure from...', zh:'从……获得乐趣'}],
    
    extraExamples: [
      {en:'He derives great satisfaction from his work.', zh:'他从工作中获得极大满足。'},
      {en:'The word derives from Greek.', zh:'这个词源于希腊语。'},
    ],
  }),
  w('w27', 'deteriorate', '/dɪˈtɪəriəreɪt/', 'v.', '恶化，变坏', 'The patient’s condition began to deteriorate.', '品质与状态', '病人的病情开始恶化。', {
    phrases: [{en:'deteriorate rapidly/steadily', zh:'迅速/持续恶化'}, {en:'health deteriorates', zh:'健康恶化'}],
    
    extraExamples: [
      {en:'His eyesight deteriorated with age.', zh:'他的视力随年龄恶化。'},
      {en:'The weather deteriorated overnight.', zh:'一夜之间天气变糟了。'},
    ],
  }),
  w('w28', 'diminish', '/dɪˈmɪnɪʃ/', 'v.', '减少，缩小，削弱', 'The pain gradually diminished.', '品质与状态', '疼痛逐渐减轻了。', {
    phrases: [{en:'diminish in size/importance', zh:'在尺寸/重要性上缩小'}, {en:'diminish rapidly', zh:'迅速减少'}],
    
    extraExamples: [
      {en:'The pain slowly diminished.', zh:'疼痛慢慢减轻了。'},
      {en:'Time will not diminish our friendship.', zh:'时间不会冲淡我们的友谊。'},
    ],
  }),
  w('w29', 'discrepancy', '/dɪsˈkrepənsi/', 'n.', '差异，不一致，矛盾', 'There is a discrepancy between the two reports.', '认知与学术', '两份报告之间存在差异。', {
    phrases: [{en:'a discrepancy between A and B', zh:'A与B之间的差异'}, {en:'price discrepancy', zh:'价格差异'}],
    
    extraExamples: [
      {en:'We noticed a discrepancy in the accounts.', zh:'我们注意到账目有出入。'},
      {en:'The discrepancy must be explained.', zh:'这个矛盾必须解释清楚。'},
    ],
  }),
  w('w30', 'diverse', '/daɪˈvɜːs/', 'adj.', '多样的，不同的', 'The city has a diverse population.', '社会与环境', '这座城市人口多样化。', {
    phrases: [{en:'diverse cultures/backgrounds', zh:'多元文化/不同背景'}, {en:'culturally diverse', zh:'文化多元'}],
    
    extraExamples: [
      {en:'The college has a diverse student body.', zh:'这所大学学生背景多元。'},
      {en:'People from diverse backgrounds live here.', zh:'不同背景的人住在这里。'},
    ],
  }),
  w('w31', 'dominate', '/ˈdɒmɪneɪt/', 'v.', '支配，主导，占优势', 'A few large firms dominate the market.', '社会与环境', '少数大公司主导着市场。', {
    phrases: [{en:'dominate the market/industry', zh:'主导市场/行业'}, {en:'dominate sb.', zh:'支配某人'}],
    
    extraExamples: [
      {en:'The team has dominated the league for years.', zh:'这支球队多年称霸联赛。'},
      {en:'He tends to dominate the conversation.', zh:'他总想主导谈话。'},
    ],
  }),
  w('w32', 'durable', '/ˈdjʊərəbl/', 'adj.', '耐用的，持久的', 'These shoes are durable and comfortable.', '品质与状态', '这双鞋结实又舒适。', {
    phrases: [{en:'durable goods', zh:'耐用品（经济学）'}, {en:'durable friendship/peace', zh:'持久的友谊/和平'}],
    
    extraExamples: [
      {en:'The shells are made of durable plastic.', zh:'外壳用耐用塑料制成。'},
      {en:'We need a durable solution to the problem.', zh:'我们需要一个持久的解决方案。'},
    ],
  }),
  w('w33', 'eligible', '/ˈelɪdʒəbl/', 'adj.', '有资格的，符合条件的', 'Only citizens are eligible to vote.', '社会与环境', '只有公民才有资格投票。', {
    phrases: [{en:'be eligible for sth.', zh:'有资格获得某物'}, {en:'be eligible to do sth.', zh:'有资格做某事'}],
    
    extraExamples: [
      {en:'Only full-time employees are eligible for the bonus.', zh:'只有全职员工才有资格拿奖金。'},
      {en:'You must be 18 or over to be eligible.', zh:'你必须年满18岁才有资格。'},
    ],
  }),
  w('w34', 'emerge', '/ɪˈmɜːdʒ/', 'v.', '出现，浮现，显露', 'New problems emerged during the discussion.', '行为与动作', '讨论中出现了一些新问题。', {
    phrases: [{en:'emerge from...', zh:'从……中出现'}, {en:'it emerged that...', zh:'据透露……'}],
    
    extraExamples: [
      {en:'The sun emerged from behind the clouds.', zh:'太阳从云后钻了出来。'},
      {en:'She emerged as a leading figure in science.', zh:'她崛起为科学界领军人物。'},
    ],
  }),
  w('w35', 'enhance', '/ɪnˈhɑːns/', 'v.', '提高，增强，改善', 'Exercise can enhance your overall health.', '行为与动作', '锻炼能改善你的整体健康。', {
    phrases: [{en:'enhance quality/performance', zh:'提高质量/性能'}, {en:'enhance one’s reputation', zh:'提升声誉'}],
    
    extraExamples: [
      {en:'The sauce enhances the flavor of the dish.', zh:'这种酱汁提升了菜品的风味。'},
      {en:'Technology has enhanced our lives.', zh:'科技改善了我们的生活。'},
    ],
  }),
  w('w36', 'enormous', '/ɪˈnɔːməs/', 'adj.', '巨大的，庞大的', 'The project required an enormous amount of effort.', '品质与状态', '这个项目需要投入巨大的精力。', {
    phrases: [{en:'an enormous amount of...', zh:'大量的……'}, {en:'enormous pressure/profit', zh:'巨大压力/利润'}],
    
    extraExamples: [
      {en:'The report caused an enormous stir.', zh:'这份报告引起了巨大轰动。'},
      {en:'They spent an enormous sum on the wedding.', zh:'他们在婚礼上花了一大笔钱。'},
    ],
  }),
  w('w37', 'evoke', '/ɪˈvəʊk/', 'v.', '唤起，引起（记忆、情感）', 'The song evoked fond memories of childhood.', '情感与性格', '这首歌唤起对童年的美好回忆。', {
    phrases: [{en:'evoke memories/emotions/response', zh:'唤起记忆/情感/反应'}, {en:'evoke sympathy', zh:'引起同情'}],
    
    extraExamples: [
      {en:'The place evoked happy memories.', zh:'这个地方唤起了美好回忆。'},
      {en:'His words evoked a strong response.', zh:'他的话引起了强烈反响。'},
    ],
  }),
  w('w38', 'exaggerate', '/ɪɡˈzædʒəreɪt/', 'v.', '夸大，夸张', 'He tends to exaggerate his achievements.', '行为与动作', '他总爱夸大自己的成就。', {
    phrases: [{en:'exaggerate the risks/dangers', zh:'夸大风险/危险'}, {en:'seriously exaggerated', zh:'被严重夸大'}],
    
    extraExamples: [
      {en:'Don’t exaggerate the problem.', zh:'别把问题夸大了。'},
      {en:'Maybe I exaggerated a little.', zh:'也许我有点夸张了。'},
    ],
  }),
  w('w39', 'explicit', '/ɪkˈsplɪsɪt/', 'adj.', '明确的，清楚的，直言的', 'The instructions are explicit and easy to follow.', '认知与学术', '说明明确易懂。', {
    phrases: [{en:'be explicit about sth.', zh:'对某事直言不讳'}, {en:'explicit instructions/permission', zh:'明确指示/许可'}],
    
    extraExamples: [
      {en:'She was quite explicit about what she wanted.', zh:'她对想要什么说得很明白。'},
      {en:'He gave explicit instructions not to enter.', zh:'他明确指示不得进入。'},
    ],
  }),
  w('w40', 'facilitate', '/fəˈsɪlɪteɪt/', 'v.', '促进，使便利', 'The new system facilitates faster data sharing.', '行为与动作', '新系统使数据共享更快捷。', {
    phrases: [{en:'facilitate communication/development', zh:'促进交流/发展'}, {en:'facilitate the process', zh:'简化流程'}],
    
    extraExamples: [
      {en:'The internet facilitates long-distance learning.', zh:'互联网便利了远程学习。'},
      {en:'Friendly chats facilitate cooperation.', zh:'友好交谈有助于合作。'},
    ],
  }),
  w('w41', 'feasible', '/ˈfiːzəbl/', 'adj.', '可行的，行得通的', 'We need to decide whether the plan is feasible.', '认知与学术', '我们需要判断这个计划是否可行。', {
    phrases: [{en:'a feasible plan/solution', zh:'可行的计划/方案'}, {en:'it is feasible to do...', zh:'做……是可行的'}],
    
    extraExamples: [
      {en:'Is it feasible to finish by Friday?', zh:'周五前能完成吗？'},
      {en:'No feasible solution has been found.', zh:'还没找到可行的解决方案。'},
    ],
  }),
  w('w42', 'fluctuate', '/ˈflʌktʃueɪt/', 'v.', '波动，起伏', 'Prices fluctuate depending on supply and demand.', '社会与环境', '价格随供需关系而波动。', {
    phrases: [{en:'fluctuate between A and B', zh:'在A和B之间波动'}, {en:'prices fluctuate', zh:'价格波动'}],
    
    extraExamples: [
      {en:'His mood fluctuates wildly.', zh:'他的情绪波动很大。'},
      {en:'The temperature fluctuates by 10 degrees.', zh:'气温起伏达10度。'},
    ],
  }),
  w('w43', 'formidable', '/ˈfɔːmɪdəbl/', 'adj.', '强大的，令人敬畏的，难对付的', 'They faced a formidable challenge.', '品质与状态', '他们面临艰巨的挑战。', {
    phrases: [{en:'a formidable challenge/opponent', zh:'艰巨的挑战/强劲对手'}, {en:'formidable reputation', zh:'令人敬畏的声望'}],
    
    extraExamples: [
      {en:'She has a formidable intellect.', zh:'她才智过人。'},
      {en:'The team is a formidable opponent.', zh:'这支队伍是强劲的对手。'},
    ],
  }),
  w('w44', 'foster', '/ˈfɒstə/', 'v.', '培养，促进，鼓励', 'The program aims to foster creativity in children.', '行为与动作', '该项目旨在培养儿童的创造力。', {
    phrases: [{en:'foster development/growth', zh:'促进发展/成长'}, {en:'foster a child', zh:'领养孩子'}],
    
    extraExamples: [
      {en:'The foster parents treated him as their own.', zh:'养父母视如己出。'},
      {en:'Good meals foster good health.', zh:'好饭养出好身体。'},
    ],
  }),
  w('w45', 'fragile', '/ˈfrædʒaɪl/', 'adj.', '脆弱的，易碎的，易损的', 'The economy remains fragile after the crisis.', '品质与状态', '危机过后经济仍然脆弱。', {
    phrases: [{en:'fragile glass/porcelain', zh:'易碎的玻璃/瓷器'}, {en:'fragile health/ego', zh:'虚弱的健康/脆弱的自尊'}],
    
    extraExamples: [
      {en:'Be careful — the vase is fragile.', zh:'小心——花瓶易碎。'},
      {en:'The political situation remains fragile.', zh:'政局依然脆弱。'},
    ],
  }),
  w('w46', 'fundamental', '/ˌfʌndəˈmentl/', 'adj.', '基本的，根本的', 'Freedom of speech is a fundamental right.', '认知与学术', '言论自由是一项基本权利。', {
    phrases: [{en:'a fundamental principle/right', zh:'基本原则/权利'}, {en:'fundamental to sth.', zh:'对……至关重要'}],
    
    extraExamples: [
      {en:'Honesty is fundamental to a good relationship.', zh:'诚实是良好关系的基石。'},
      {en:'There is a fundamental difference between them.', zh:'二者有根本区别。'},
    ],
  }),
  w('w47', 'hamper', '/ˈhæmpə/', 'v.', '阻碍，妨碍', 'Bad weather hampered the rescue efforts.', '行为与动作', '恶劣天气阻碍了救援工作。', {
    phrases: [{en:'hamper efforts/development', zh:'阻碍努力/发展'}, {en:'be hampered by...', zh:'受……阻碍'}],
    
    extraExamples: [
      {en:'The project was hampered by lack of funds.', zh:'项目因资金不足受阻。'},
      {en:'Rescue efforts were hampered by fog.', zh:'救援因雾受阻。'},
    ],
  }),
  w('w48', 'hinder', '/ˈhɪndə/', 'v.', '阻碍，妨碍，阻止', 'Lack of funding hindered the research.', '行为与动作', '资金不足阻碍了这项研究。', {
    phrases: [{en:'hinder sb. from doing sth.', zh:'阻止某人做某事'}, {en:'hinder progress', zh:'阻碍进展'}],
    
    extraExamples: [
      {en:'Don’t let me hinder you.', zh:'别让我耽误你。'},
      {en:'Overcrowding hinders learning.', zh:'过度拥挤妨碍学习。'},
    ],
  }),
  w('w49', 'hypothesis', '/haɪˈpɒθəsɪs/', 'n.', '假设，假说', 'The results support our original hypothesis.', '认知与学术', '结果支持我们最初的假设。', {
    phrases: [{en:'test/prove a hypothesis', zh:'验证/证明假设'}, {en:'put forward a hypothesis', zh:'提出假设'}],
    
    extraExamples: [
      {en:'The experiment confirmed the hypothesis.', zh:'实验证实了假设。'},
      {en:'We need to test this hypothesis further.', zh:'我们需要进一步验证这个假设。'},
    ],
  }),
  w('w50', 'identical', '/aɪˈdentɪkl/', 'adj.', '完全相同的，一致的', 'The two copies are identical in content.', '品质与状态', '两份副本内容完全相同。', {
    phrases: [{en:'identical to...', zh:'与……完全相同'}, {en:'identical twins', zh:'同卵双胞胎'}],
    
    extraExamples: [
      {en:'Your shirt is identical to mine.', zh:'你的衬衫和我的一模一样。'},
      {en:'The tests produced identical results.', zh:'测试结果完全一致。'},
    ],
  }),
  w('w51', 'implement', '/ˈɪmplɪment/', 'v.', '实施，执行，贯彻', 'The company will implement the new policy soon.', '行为与动作', '公司很快将实施新政策。', {
    phrases: [{en:'implement a policy/plan', zh:'实施政策/计划'}, {en:'implement changes', zh:'落实变革'}],
    
    extraExamples: [
      {en:'The changes will be implemented next month.', zh:'变革下月实施。'},
      {en:'We need someone to implement the ideas.', zh:'我们需要有人把想法落地。'},
    ],
  }),
  w('w52', 'implication', '/ˌɪmplɪˈkeɪʃn/', 'n.', '含义，暗示；可能的影响', 'The research has important implications for policy.', '认知与学术', '这项研究对政策有重要影响。', {
    phrases: [{en:'have implications for...', zh:'对……有影响'}, {en:'by implication', zh:'含蓄地，言外之意'}],
    
    extraExamples: [
      {en:'The theory has far-reaching implications.', zh:'该理论影响深远。'},
      {en:'He smiled, and by implication agreed.', zh:'他笑了，等于默认同意。'},
    ],
  }),
  w('w53', 'incentive', '/ɪnˈsentɪv/', 'n.', '激励，动机，刺激', 'Bonuses provide an incentive for hard work.', '社会与环境', '奖金是对努力工作的激励。', {
    phrases: [{en:'an incentive to do sth.', zh:'做某事的动力'}, {en:'tax/financial incentives', zh:'税收/财政激励'}],
    
    extraExamples: [
      {en:'There is no incentive to save water.', zh:'没有节水的激励。'},
      {en:'The bonus is a strong incentive.', zh:'奖金是很大的激励。'},
    ],
  }),
  w('w54', 'inevitable', '/ɪnˈevɪtəbl/', 'adj.', '不可避免的，必然的', 'Change is inevitable in a fast-moving industry.', '品质与状态', '在快速发展的行业里，变化是不可避免的。', {
    phrases: [{en:'it is inevitable that...', zh:'……是不可避免的'}, {en:'an inevitable result/consequence', zh:'必然结果'}],
    
    extraExamples: [
      {en:'Such a result was inevitable.', zh:'这样的结果是必然的。'},
      {en:'Death is inevitable.', zh:'死亡是不可避免的。'},
    ],
  }),
  w('w55', 'inhibit', '/ɪnˈhɪbɪt/', 'v.', '抑制，阻止，妨碍', 'Fear can inhibit people from speaking up.', '行为与动作', '恐惧会让人不敢开口说话。', {
    phrases: [{en:'inhibit sb. from doing sth.', zh:'阻止某人做某事'}, {en:'inhibit growth/development', zh:'抑制生长/发展'}],
    
    extraExamples: [
      {en:'Splendid churches inhibit the spread of weeds.', zh:'除草剂抑制杂草生长。'},
      {en:'Shyness inhibited her from raising her hand.', zh:'害羞让她不敢举手。'},
    ],
  }),
  w('w56', 'integrate', '/ˈɪntɪɡreɪt/', 'v.', '整合，使融入，结合', 'The school helps newcomers integrate into the community.', '行为与动作', '学校帮助新来者融入社区。', {
    phrases: [{en:'integrate A into B', zh:'把A整合进B'}, {en:'integrate with...', zh:'与……融为一体'}],
    
    extraExamples: [
      {en:'We need to integrate theory with practice.', zh:'我们需要理论联系实际。'},
      {en:'Immigrants find it hard to integrate.', zh:'移民很难融入。'},
    ],
  }),
  w('w57', 'intensive', '/ɪnˈtensɪv/', 'adj.', '密集的，强化的，深入的', 'She took an intensive English course before the exam.', '认知与学术', '考试前她参加了强化的英语课程。', {
    phrases: [{en:'intensive training/course', zh:'强化训练/课程'}, {en:'intensive reading', zh:'精读'}],
    
    extraExamples: [
      {en:'He spent the summer on intensive study.', zh:'他整个夏天都在强化学习。'},
      {en:'The hospital provides intensive care.', zh:'这家医院提供重症监护。'},
    ],
  }),
  w('w58', 'legitimate', '/lɪˈdʒɪtɪmət/', 'adj.', '合法的，合理的，正当的', 'They have a legitimate claim to the property.', '社会与环境', '他们对这笔财产有合法的要求权。', {
    phrases: [{en:'a legitimate business/claim', zh:'合法生意/正当要求'}, {en:'perfectly legitimate', zh:'完全合法'}],
    
    extraExamples: [
      {en:'She had a legitimate reason for being late.', zh:'她迟到有正当理由。'},
      {en:'Is his business legitimate?', zh:'他的生意合法吗？'},
    ],
  }),
  w('w59', 'magnify', '/ˈmæɡnɪfaɪ/', 'v.', '放大，夸大，增强', 'A microscope can magnify tiny objects.', '行为与动作', '显微镜能放大微小的物体。', {
    phrases: [{en:'magnify an image', zh:'放大图像'}, {en:'magnify the problem', zh:'夸大问题'}],
    
    extraExamples: [
      {en:'The microscope magnifies bacteria 1000 times.', zh:'显微镜把细菌放大1000倍。'},
      {en:'Don’t magnify your difficulties.', zh:'别夸大困难。'},
    ],
  }),
  w('w60', 'manipulate', '/məˈnɪpjuleɪt/', 'v.', '操纵，操控，巧妙处理', 'Advertisers often manipulate consumer desires.', '行为与动作', '广告商常常操纵消费者的欲望。', {
    phrases: [{en:'manipulate data/prices', zh:'操纵数据/价格'}, {en:'manipulate sb. into doing sth.', zh:'操纵某人做某事'}],
    
    extraExamples: [
      {en:'He manipulated the controls with skill.', zh:'他熟练地操作控制装置。'},
      {en:'She manipulated him into giving her money.', zh:'她哄骗他给她钱。'},
    ],
  }),
  w('w61', 'mitigate', '/ˈmɪtɪɡeɪt/', 'v.', '减轻，缓和（负面影响）', 'New measures were taken to mitigate the damage.', '行为与动作', '已采取新措施以减轻损失。', {
    phrases: [{en:'mitigate the effects/impact', zh:'减轻影响'}, {en:'mitigate risk/damage', zh:'降低风险/损失'}],
    
    extraExamples: [
      {en:'Steps were taken to mitigate the problem.', zh:'已采取措施缓解问题。'},
      {en:'Nothing could mitigate the disaster.', zh:'什么都无法减轻这场灾难。'},
    ],
  }),
  w('w62', 'notion', '/ˈnəʊʃn/', 'n.', '概念，观念，看法', 'He rejected the notion that success is purely luck.', '认知与学术', '他否定了"成功纯粹靠运气"这种观念。', {
    phrases: [{en:'have no notion of...', zh:'对……毫无概念'}, {en:'the notion that...', zh:'……这种观念'}],
    
    extraExamples: [
      {en:'I have no notion of what he means.', zh:'我完全不懂他什么意思。'},
      {en:'She had some odd notions about money.', zh:'她对金钱有些奇怪的观念。'},
    ],
  }),
  w('w63', 'obsolete', '/ˈɒbsəliːt/', 'adj.', '过时的，被淘汰的', 'Old methods soon become obsolete in technology.', '品质与状态', '在技术领域，旧方法很快过时。', {
    phrases: [{en:'obsolete technology/weapons', zh:'过时的技术/武器'}, {en:'become obsolete', zh:'被淘汰'}],
    
    extraExamples: [
      {en:'Typewriters are now obsolete.', zh:'打字机现在已被淘汰。'},
      {en:'The equipment is obsolete but still works.', zh:'设备过时但还能用。'},
    ],
  }),
  w('w64', 'optimistic', '/ˌɒptɪˈmɪstɪk/', 'adj.', '乐观的，有信心的', 'She remains optimistic about the future.', '情感与性格', '她对未来仍持乐观态度。', {
    phrases: [{en:'be optimistic about...', zh:'对……乐观'}, {en:'an optimistic view/outlook', zh:'乐观看法'}],
    
    extraExamples: [
      {en:'He is optimistic that we will succeed.', zh:'他乐观地认为我们会成功。'},
      {en:'Despite the rain, she stayed optimistic.', zh:'尽管下雨，她仍很乐观。'},
    ],
  }),
  w('w65', 'outcome', '/ˈaʊtkʌm/', 'n.', '结果，成果，结局', 'The outcome of the election surprised many.', '认知与学术', '选举结果让许多人惊讶。', {
    phrases: [{en:'a positive/negative outcome', zh:'积极/消极结果'}, {en:'the final outcome', zh:'最终结果'}],
    
    extraExamples: [
      {en:'We are waiting for the outcome.', zh:'我们在等结果。'},
      {en:'The outcome was far from expected.', zh:'结果远非预料。'},
    ],
  }),
  w('w66', 'overwhelm', '/ˌəʊvəˈwelm/', 'v.', '压倒，使不知所措', 'She was overwhelmed by the amount of work.', '情感与性格', '她被繁重的工作压得不知所措。', {
    phrases: [{en:'be overwhelmed by...', zh:'被……压得喘不过气'}, {en:'overwhelm the opposition', zh:'压倒对手'}],
    
    extraExamples: [
      {en:'The smell overwhelmed her.', zh:'这气味让她受不了。'},
      {en:'She was overwhelmed with joy.', zh:'她喜不自胜。'},
    ],
  }),
  w('w67', 'perspective', '/pəˈspektɪv/', 'n.', '观点，视角；透视', 'Reading broadens your perspective on life.', '认知与学术', '阅读能拓宽你对生活的看法。', {
    phrases: [{en:'from a... perspective', zh:'从……角度'}, {en:'broaden one’s perspective', zh:'拓宽视野'}],
    
    extraExamples: [
      {en:'Try to see it from my perspective.', zh:'试着站在我的角度看。'},
      {en:'Travel gives you a new perspective.', zh:'旅行带来新视角。'},
    ],
  }),
  w('w68', 'plausible', '/ˈplɔːzəbl/', 'adj.', '貌似合理的，可信的', 'He gave a plausible explanation for the delay.', '认知与学术', '他对延误给出了貌似合理的解释。', {
    phrases: [{en:'a plausible excuse/explanation', zh:'貌似合理的借口/解释'}, {en:'it sounds plausible', zh:'听起来有道理'}],
    
    extraExamples: [
      {en:'That is a plausible argument.', zh:'那是个貌似有理的论点。'},
      {en:'Her story sounds plausible.', zh:'她的说法听起来像真的。'},
    ],
  }),
  w('w69', 'precaution', '/prɪˈkɔːʃn/', 'n.', '预防措施，警惕', 'We took precautions to avoid accidents.', '社会与环境', '我们采取了预防措施以避免事故。', {
    phrases: [{en:'take precautions against...', zh:'采取措施预防……'}, {en:'as a precaution', zh:'作为预防'}],
    
    extraExamples: [
      {en:'Wear a helmet as a precaution.', zh:'戴头盔作为预防。'},
      {en:'Precautions were taken against fire.', zh:'已采取防火措施。'},
    ],
  }),
  w('w70', 'preliminary', '/prɪˈlɪmɪnəri/', 'adj.', '初步的，预备的', 'The preliminary results look promising.', '认知与学术', '初步结果看起来很有希望。', {
    phrases: [{en:'preliminary results/round', zh:'初步结果/预赛'}, {en:'preliminary to...', zh:'作为……的准备'}],
    
    extraExamples: [
      {en:'After a preliminary discussion, we agreed.', zh:'初步讨论后我们达成一致。'},
      {en:'She got through the preliminary round.', zh:'她通过了预赛。'},
    ],
  }),
  w('w71', 'prominent', '/ˈprɒmɪnənt/', 'adj.', '突出的，显著的，著名的', 'She played a prominent role in the campaign.', '品质与状态', '她在活动中发挥了突出作用。', {
    phrases: [{en:'a prominent figure/role', zh:'杰出人物/突出作用'}, {en:'in a prominent position', zh:'在显著位置'}],
    
    extraExamples: [
      {en:'The church is a prominent landmark.', zh:'这座教堂是显眼的地标。'},
      {en:'He played a prominent part in the project.', zh:'他在项目中作用突出。'},
    ],
  }),
  w('w72', 'prosperity', '/prɒˈsperəti/', 'n.', '繁荣，兴旺，成功', 'Economic prosperity benefits the whole society.', '社会与环境', '经济繁荣惠及整个社会。', {
    phrases: [{en:'economic prosperity', zh:'经济繁荣'}, {en:'in prosperity and adversity', zh:'无论顺境逆境'}],
    
    extraExamples: [
      {en:'The country enjoyed years of prosperity.', zh:'这个国家经历了多年繁荣。'},
      {en:'Peace brings prosperity.', zh:'和平带来繁荣。'},
    ],
  }),
  w('w73', 'rational', '/ˈræʃnəl/', 'adj.', '理性的，合理的', 'Try to make a rational decision rather than an emotional one.', '认知与学术', '尽量做出理性而非情绪化的决定。', {
    phrases: [{en:'a rational decision/choice', zh:'理性决定/选择'}, {en:'rational behavior', zh:'理性行为'}],
    
    extraExamples: [
      {en:'There must be a rational explanation.', zh:'一定有合理的解释。'},
      {en:'Let’s be rational about this.', zh:'这件事我们要理性点。'},
    ],
  }),
  w('w74', 'resilient', '/rɪˈzɪliənt/', 'adj.', '有韧性的，能迅速恢复的', 'Children are often more resilient than adults think.', '情感与性格', '孩子往往比成人想象中更有韧性。', {
    phrases: [{en:'a resilient economy', zh:'有韧性的经济'}, {en:'highly resilient', zh:'韧性很强'}],
    
    extraExamples: [
      {en:'The human body is remarkably resilient.', zh:'人体恢复力惊人。'},
      {en:'She is resilient in the face of hardship.', zh:'她面对困难很坚强。'},
    ],
  }),
  w('w75', 'restrain', '/rɪˈstreɪn/', 'v.', '抑制，约束，制止', 'He struggled to restrain his anger.', '行为与动作', '他努力克制住自己的怒气。', {
    phrases: [{en:'restrain oneself', zh:'克制自己'}, {en:'restrain sb. from doing sth.', zh:'制止某人做某事'}],
    
    extraExamples: [
      {en:'She could not restrain her tears.', zh:'她忍不住流下眼泪。'},
      {en:'The police restrained the crowd.', zh:'警察控制住人群。'},
    ],
  }),
  w('w76', 'reveal', '/rɪˈviːl/', 'v.', '揭示，透露，展现', 'The survey revealed surprising findings.', '行为与动作', '调查揭示了令人意外的发现。', {
    phrases: [{en:'reveal a secret/truth', zh:'揭露秘密/真相'}, {en:'reveal that...', zh:'透露……'}],
    
    extraExamples: [
      {en:'The curtain rose to reveal a empty stage.', zh:'幕布升起，舞台空无一人。'},
      {en:'He revealed his plans to us.', zh:'他向我们透露了计划。'},
    ],
  }),
  w('w77', 'rigorous', '/ˈrɪɡərəs/', 'adj.', '严格的，严谨的，缜密的', 'The data was collected through rigorous testing.', '认知与学术', '数据是通过严谨的测试收集的。', {
    phrases: [{en:'rigorous testing/analysis', zh:'严格测试/分析'}, {en:'rigorous standards', zh:'严格标准'}],
    
    extraExamples: [
      {en:'The report is based on rigorous research.', zh:'报告基于严谨研究。'},
      {en:'Students face rigorous exams.', zh:'学生要面对严格的考试。'},
    ],
  }),
  w('w78', 'scrutiny', '/ˈskruːtəni/', 'n.', '详细审查，仔细检查', 'The proposal came under close scrutiny.', '认知与学术', '该提案受到严密审查。', {
    phrases: [{en:'under close scrutiny', zh:'受到严密审查'}, {en:'careful scrutiny', zh:'仔细检查'}],
    
    extraExamples: [
      {en:'The policy is under public scrutiny.', zh:'该政策受到公众监督。'},
      {en:'Her argument doesn’t stand up to scrutiny.', zh:'她的论点经不起推敲。'},
    ],
  }),
  w('w79', 'simultaneously', '/ˌsɪmlˈteɪniəsli/', 'adv.', '同时地', 'The two events happened simultaneously.', '品质与状态', '两件事同时发生。', {
    phrases: [{en:'happen/occur simultaneously', zh:'同时发生'}, {en:'simultaneously with...', zh:'与……同时'}],
    
    extraExamples: [
      {en:'The two guns fired simultaneously.', zh:'两支枪同时开火。'},
      {en:'She translated simultaneously for the CEO.', zh:'她为CEO做同声传译。'},
    ],
  }),
  w('w80', 'skeptical', '/ˈskeptɪkl/', 'adj.', '怀疑的，持怀疑态度的', 'Many scientists remain skeptical of the claim.', '情感与性格', '许多科学家对这一说法仍持怀疑态度。', {
    phrases: [{en:'be skeptical of/about...', zh:'对……持怀疑态度'}, {en:'highly skeptical', zh:'非常怀疑'}],
    
    extraExamples: [
      {en:'I’m skeptical about his chances.', zh:'我怀疑他能不能成。'},
      {en:'She gave him a skeptical look.', zh:'她怀疑地看了他一眼。'},
    ],
  }),
  w('w81', 'sophisticated', '/səˈfɪstɪkeɪtɪd/', 'adj.', '复杂的，精密的；老练的', 'The lab uses sophisticated equipment.', '认知与学术', '实验室使用精密设备。', {
    phrases: [{en:'sophisticated technology/equipment', zh:'精密技术/设备'}, {en:'sophisticated taste', zh:'高雅品味'}],
    
    extraExamples: [
      {en:'She is a sophisticated woman.', zh:'她是个老练世故的女人。'},
      {en:'The system is highly sophisticated.', zh:'这套系统非常精密。'},
    ],
  }),
  w('w82', 'spontaneous', '/spɒnˈteɪniəs/', 'adj.', '自发的，自然的，即兴的', 'The audience burst into spontaneous applause.', '情感与性格', '观众爆发出自发的掌声。', {
    phrases: [{en:'spontaneous applause/reaction', zh:'自发的掌声/反应'}, {en:'spontaneous laughter', zh:'情不自禁的笑'}],
    
    extraExamples: [
      {en:'The offer was quite spontaneous.', zh:'这个提议相当即兴。'},
      {en:'He made a spontaneous decision.', zh:'他一时冲动做了决定。'},
    ],
  }),
  w('w83', 'stagnant', '/ˈstæɡnənt/', 'adj.', '停滞的，不发展的；不流动的', 'The economy has been stagnant for years.', '社会与环境', '经济多年来一直停滞不前。', {
    phrases: [{en:'a stagnant economy/market', zh:'停滞的经济/市场'}, {en:'stagnant water', zh:'死水'}],
    
    extraExamples: [
      {en:'Stagnant water breeds mosquitoes.', zh:'死水滋生蚊子。'},
      {en:'The company became stagnant.', zh:'公司陷入停滞。'},
    ],
  }),
  w('w84', 'stimulate', '/ˈstɪmjuleɪt/', 'v.', '刺激，激励，促进', 'The lecture stimulated lively discussion.', '行为与动作', '讲座引发了热烈的讨论。', {
    phrases: [{en:'stimulate growth/discussion', zh:'刺激增长/引发讨论'}, {en:'stimulate the economy', zh:'刺激经济'}],
    
    extraExamples: [
      {en:'Praise stimulates children to learn.', zh:'表扬激励孩子学习。'},
      {en:'The exhibition stimulated great interest.', zh:'展览引发了浓厚兴趣。'},
    ],
  }),
  w('w85', 'substantial', '/səbˈstænʃl/', 'adj.', '大量的，可观的；实质的', 'The project requires substantial investment.', '品质与状态', '该项目需要大量投资。', {
    phrases: [{en:'a substantial amount/sum', zh:'一大笔'}, {en:'substantial evidence', zh:'确凿证据'}],
    
    extraExamples: [
      {en:'They made substantial progress.', zh:'他们取得了重大进展。'},
      {en:'The house is a substantial building.', zh:'这房子是座坚固的建筑。'},
    ],
  }),
  w('w86', 'sufficient', '/səˈfɪʃnt/', 'adj.', '充足的，足够的', 'We have sufficient evidence to prove it.', '品质与状态', '我们有充分的证据证明这一点。', {
    phrases: [{en:'sufficient evidence/reason', zh:'充分证据/理由'}, {en:'sufficient for sth.', zh:'对……足够'}],
    
    extraExamples: [
      {en:'Do we have sufficient food?', zh:'我们吃的够吗？'},
      {en:'One example is sufficient.', zh:'一个例子就够了。'},
    ],
  }),
  w('w87', 'sustain', '/səˈsteɪn/', 'v.', '维持，支撑，承受', 'The soil can sustain only limited crops.', '行为与动作', '这片土壤只能供养有限的作物。', {
    phrases: [{en:'sustained growth/effort', zh:'持续增长/努力'}, {en:'sustain damage/losses', zh:'遭受损害/损失'}],
    
    extraExamples: [
      {en:'She could not sustain the effort.', zh:'她无法继续坚持。'},
      {en:'The shelves are sustained by steel.', zh:'架子由钢支撑。'},
    ],
  }),
  w('w88', 'tentative', '/ˈtentətɪv/', 'adj.', '试探性的，暂时的，不确定的', 'We have made a tentative plan for next month.', '认知与学术', '我们为下个月制定了一个暂定的计划。', {
    phrases: [{en:'a tentative plan/offer', zh:'暂定计划/试探性提议'}, {en:'tentative conclusion', zh:'初步结论'}],
    
    extraExamples: [
      {en:'We reached a tentative agreement.', zh:'我们达成了初步协议。'},
      {en:'She gave a tentative smile.', zh:'她迟疑地笑了笑。'},
    ],
  }),
  w('w89', 'transmit', '/trænzˈmɪt/', 'v.', '传输，传播，传递', 'The virus can transmit from person to person.', '行为与动作', '这种病毒可以在人与人之间传播。', {
    phrases: [{en:'transmit signals/disease', zh:'传输信号/传播疾病'}, {en:'transmit knowledge to...', zh:'把知识传给……'}],
    
    extraExamples: [
      {en:'The program is transmitted live.', zh:'节目现场直播。'},
      {en:'Birds transmit the virus.', zh:'鸟类传播这种病毒。'},
    ],
  }),
  w('w90', 'undergo', '/ˌʌndəˈɡəʊ/', 'v.', '经历，经受，承受', 'The city has undergone rapid change.', '行为与动作', '这座城市经历了急剧变化。', {
    phrases: [{en:'undergo changes/treatment', zh:'经历变化/接受治疗'}, {en:'undergo surgery', zh:'接受手术'}],
    
    extraExamples: [
      {en:'He underwent a major operation.', zh:'他接受了大手术。'},
      {en:'The house is undergoing repairs.', zh:'房子正在翻修。'},
    ],
  }),
  w('w91', 'undermine', '/ˌʌndəˈmaɪn/', 'v.', '削弱，逐渐损害', 'Constant criticism undermined his confidence.', '行为与动作', '不断的批评削弱了他的信心。', {
    phrases: [{en:'undermine confidence/authority', zh:'削弱信心/权威'}, {en:'undermine an argument', zh:'削弱论点'}],
    
    extraExamples: [
      {en:'Rising costs undermine profits.', zh:'成本上升侵蚀利润。'},
      {en:'His lies undermined her trust.', zh:'他的谎言破坏了她的信任。'},
    ],
  }),
  w('w92', 'utilize', '/ˈjuːtəlaɪz/', 'v.', '利用，使用', 'We should utilize available resources wisely.', '行为与动作', '我们应明智地利用可用资源。', {
    phrases: [{en:'utilize resources/time', zh:'利用资源/时间'}, {en:'be utilized for...', zh:'被用于……'}],
    
    extraExamples: [
      {en:'How can we best utilize the space?', zh:'我们怎么最好地利用空间？'},
      {en:'The coast is fully utilized.', zh:'海岸被充分利用。'},
    ],
  }),
  w('w93', 'valid', '/ˈvælɪd/', 'adj.', '有效的，合理的，有根据的', 'Your passport must be valid for travel.', '品质与状态', '你的护照必须有效才能出行。', {
    phrases: [{en:'a valid ticket/license', zh:'有效票/驾照'}, {en:'a valid reason/argument', zh:'正当理由/有根据的论点'}],
    
    extraExamples: [
      {en:'The ticket is valid for three months.', zh:'这票三个月内有效。'},
      {en:'She has a valid point.', zh:'她的观点有道理。'},
    ],
  }),
  w('w94', 'vulnerable', '/ˈvʌlnərəbl/', 'adj.', '脆弱的，易受伤害的', 'Children are especially vulnerable to the disease.', '品质与状态', '儿童尤其容易感染这种疾病。', {
    phrases: [{en:'be vulnerable to...', zh:'易受……影响'}, {en:'a vulnerable group/situation', zh:'弱势群体/脆弱局势'}],
    
    extraExamples: [
      {en:'The economy is vulnerable to shocks.', zh:'经济易受冲击。'},
      {en:'She felt vulnerable without him.', zh:'没有他她感到脆弱。'},
    ],
  }),
  w('w95', 'widespread', '/ˈwaɪdspred/', 'adj.', '广泛的，普遍的', 'The idea gained widespread acceptance.', '社会与环境', '这个想法获得了广泛认可。', {
    phrases: [{en:'widespread support/use', zh:'广泛支持/使用'}, {en:'widespread damage', zh:'大面积破坏'}],
    
    extraExamples: [
      {en:'The storm caused widespread damage.', zh:'暴风雨造成大面积破坏。'},
      {en:'English is a widespread language.', zh:'英语是广泛使用的语言。'},
    ],
  }),
  w('w96', 'zealous', '/ˈzeləs/', 'adj.', '热情的，热心的', 'She is a zealous supporter of the cause.', '情感与性格', '她是这项事业的热心支持者。', {
    phrases: [{en:'a zealous supporter/fan', zh:'热心支持者/狂热粉丝'}, {en:'zealous in sth.', zh:'在某事上很热心'}],
    
    extraExamples: [
      {en:'He is zealous about environmental issues.', zh:'他对环保问题很热心。'},
      {en:'She is zealous in her work.', zh:'她工作非常投入。'},
    ],
  }),
  w('w97', 'abandon', '/əˈbændən/', 'v.', '放弃，抛弃', 'He abandoned the plan halfway.', '行为与动作', '他中途放弃了计划。', {
    phrases: [{en:'abandon a plan/hope', zh:'放弃计划/希望'}, {en:'abandon oneself to...', zh:'沉溺于……'}],
    
    extraExamples: [
      {en:'They had to abandon the car.', zh:'他们只好弃车。'},
      {en:'Never abandon your dreams.', zh:'永远别放弃梦想。'},
    ],
  }),
  w('w98', 'absorb', '/əbˈzɔːb/', 'v.', '吸收；使全神贯注', 'Plants absorb water from the soil.', '认知与学术', '植物从土壤中吸收水分。', {
    phrases: [{en:'absorb water/energy', zh:'吸收水分/能量'}, {en:'be absorbed in...', zh:'全神贯注于……'}],
    
    extraExamples: [
      {en:'The material absorbs sound.', zh:'这种材料吸声。'},
      {en:'She was absorbed in her book.', zh:'她全神贯注地看书。'},
    ],
  }),
  w('w99', 'abundant', '/əˈbʌndənt/', 'adj.', '丰富的，充裕的', 'The region has abundant natural resources.', '品质与状态', '该地区自然资源丰富。', {
    phrases: [{en:'abundant in...', zh:'富于……'}, {en:'an abundant supply of...', zh:'充足的供应'}],
    
    extraExamples: [
      {en:'The country has abundant oil.', zh:'这个国家石油丰富。'},
      {en:'We have abundant evidence.', zh:'我们有充分证据。'},
    ],
  }),
  w('w100', 'accelerate', '/əkˈseləreɪt/', 'v.', '加速，加快', 'The car accelerated quickly.', '行为与动作', '汽车迅速加速。', {
    phrases: [{en:'accelerate growth/the process', zh:'加速增长/进程'}, {en:'accelerate from 0 to 100', zh:'从0加速到100'}],
    
    extraExamples: [
      {en:'Inflation accelerated sharply.', zh:'通胀急剧加速。'},
      {en:'The runner accelerated toward the finish.', zh:'选手冲向终点。'},
    ],
  }),
  w('w101', 'acquire', '/əˈkwaɪə/', 'v.', '获得，习得', 'She acquired a new skill.', '认知与学术', '她学会了一项新技能。', {
    phrases: [{en:'acquire knowledge/skills', zh:'获得知识/技能'}, {en:'acquire a company', zh:'收购公司'}],
    
    extraExamples: [
      {en:'He acquired a taste for jazz.', zh:'他渐渐喜欢上爵士乐。'},
      {en:'The firm was acquired last year.', zh:'这家公司去年被收购。'},
    ],
  }),
  w('w102', 'adequate', '/ˈædɪkwət/', 'adj.', '足够的，适当的', 'The room has adequate lighting.', '品质与状态', '房间照明充足。', {
    phrases: [{en:'adequate for sth.', zh:'对……足够'}, {en:'adequate supply/food', zh:'充足供应/食物'}],
    
    extraExamples: [
      {en:'Is the salary adequate?', zh:'薪水够吗？'},
      {en:'The room is adequate for one person.', zh:'这房间一个人住够了。'},
    ],
  }),
  w('w103', 'adjust', '/əˈdʒʌst/', 'v.', '调整，适应', 'You need to adjust the settings.', '行为与动作', '你需要调整设置。', {
    phrases: [{en:'adjust to sth.', zh:'适应某事'}, {en:'adjust the settings/speed', zh:'调整设置/速度'}],
    
    extraExamples: [
      {en:'It took her time to adjust.', zh:'她过了一阵才适应。'},
      {en:'Please adjust your seat.', zh:'请调整你的座位。'},
    ],
  }),
  w('w104', 'advocate', '/ˈædvəkeɪt/', 'v.', '提倡，主张', 'Many advocate a healthier diet.', '认知与学术', '许多人提倡更健康的饮食。', {
    phrases: [{en:'advocate doing sth.', zh:'提倡做某事'}, {en:'an advocate of...', zh:'……的拥护者'}],
    
    extraExamples: [
      {en:'He advocates reform.', zh:'他主张改革。'},
      {en:'She is a passionate advocate for animals.', zh:'她是动物保护的热心倡导者。'},
    ],
  }),
  w('w105', 'alter', '/ˈɔːltə/', 'v.', '改变，修改', 'We may alter the plan.', '行为与动作', '我们可能会修改计划。', {
    phrases: [{en:'alter the course/plan', zh:'改变路线/计划'}, {en:'alter one’s mind', zh:'改变主意'}],
    
    extraExamples: [
      {en:'The city has altered beyond recognition.', zh:'城市变得面目全非。'},
      {en:'She altered the dress to fit.', zh:'她改了裙子使其合身。'},
    ],
  }),
  w('w106', 'annual', '/ˈænjuəl/', 'adj.', '每年的，年度的', 'The annual meeting is in May.', '社会与环境', '年度会议在五月举行。', {
    phrases: [{en:'annual income/report', zh:'年收入/年报'}, {en:'an annual event', zh:'一年一度的活动'}],
    
    extraExamples: [
      {en:'The company holds an annual picnic.', zh:'公司每年办一次野餐。'},
      {en:'What is your annual salary?', zh:'你年薪多少？'},
    ],
  }),
  w('w107', 'appeal', '/əˈpiːl/', 'n./v.', '吸引力；呼吁', 'The design has broad appeal.', '社会与环境', '这个设计广受欢迎。', {
    phrases: [{en:'appeal to sb.', zh:'对某人有吸引力/向某人呼吁'}, {en:'make an appeal for...', zh:'呼吁……'}],
    
    extraExamples: [
      {en:'The design appeals to young people.', zh:'这个设计吸引年轻人。'},
      {en:'They made an appeal for donations.', zh:'他们呼吁捐款。'},
    ],
  }),
  w('w108', 'appropriate', '/əˈprəʊpriət/', 'adj.', '适当的，恰当的', 'Wear appropriate clothes.', '品质与状态', '穿合适的衣服。', {
    phrases: [{en:'appropriate for sth.', zh:'适合某事'}, {en:'an appropriate response', zh:'恰当回应'}],
    
    extraExamples: [
      {en:'Wear shoes appropriate for running.', zh:'穿适合跑步的鞋。'},
      {en:'Please keep your comments appropriate.', zh:'请说话得体。'},
    ],
  }),
  w('w109', 'assemble', '/əˈsembl/', 'v.', '组装；集合', 'They assembled the machine.', '行为与动作', '他们组装了这台机器。', {
    phrases: [{en:'assemble a machine/team', zh:'组装机器/集结队伍'}, {en:'assemble in the hall', zh:'在大厅集合'}],
    
    extraExamples: [
      {en:'The workers assemble cars.', zh:'工人组装汽车。'},
      {en:'A crowd assembled outside.', zh:'外面聚集了一群人。'},
    ],
  }),
  w('w110', 'assess', '/əˈses/', 'v.', '评估，评价', 'We need to assess the risks.', '认知与学术', '我们需要评估风险。', {
    phrases: [{en:'assess the impact/risk', zh:'评估影响/风险'}, {en:'assess sb.’s ability', zh:'评价某人的能力'}],
    
    extraExamples: [
      {en:'It’s hard to assess the damage.', zh:'损失难以估计。'},
      {en:'Teachers assess students’ progress.', zh:'老师评估学生进步。'},
    ],
  }),
  w('w111', 'assume', '/əˈsjuːm/', 'v.', '假定，假设', 'I assume you agree.', '认知与学术', '我假定你同意。', {
    phrases: [{en:'assume that...', zh:'假定……'}, {en:'assume responsibility/power', zh:'承担责任/掌权'}],
    
    extraExamples: [
      {en:'Don’t assume anything.', zh:'别先入为主。'},
      {en:'He assumed control last year.', zh:'他去年掌权。'},
    ],
  }),
  w('w112', 'attribute', '/əˈtrɪbjuːt/', 'v.', '归因于', 'She attributed success to hard work.', '认知与学术', '她把成功归因于努力工作。', {
    phrases: [{en:'attribute sth. to sth./sb.', zh:'把……归因于……'}, {en:'a personal attribute', zh:'个人特质'}],
    
    extraExamples: [
      {en:'He attributed his success to luck.', zh:'他把成功归于运气。'},
      {en:'Patience is her best attribute.', zh:'耐心是她最大的优点。'},
    ],
  }),
  w('w113', 'barrier', '/ˈbæriə/', 'n.', '障碍，屏障', 'Language is a barrier for some.', '社会与环境', '语言对有些人是个障碍。', {
    phrases: [{en:'a language/trade barrier', zh:'语言/贸易壁垒'}, {en:'break down barriers', zh:'打破障碍'}],
    
    extraExamples: [
      {en:'Fear is a barrier to success.', zh:'恐惧是成功的障碍。'},
      {en:'The Yangtze is a natural barrier.', zh:'长江是天然屏障。'},
    ],
  }),
  w('w114', 'behalf', '/bɪˈhɑːf/', 'n.', '代表，利益', 'He spoke on my behalf.', '社会与环境', '他代表我发言。', {
    phrases: [{en:'on behalf of sb.', zh:'代表某人'}, {en:'on sb.’s behalf', zh:'代表某人'}],
    
    extraExamples: [
      {en:'I thank you on behalf of the team.', zh:'我代表团队感谢你。'},
      {en:'He accepted the prize on her behalf.', zh:'他代她领奖。'},
    ],
  }),
  w('w115', 'capability', '/ˌkeɪpəˈbɪləti/', 'n.', '能力，性能', 'The device has advanced capabilities.', '品质与状态', '该设备有先进的功能。', {
    phrases: [{en:'nuclear capability', zh:'核能力'}, {en:'beyond one’s capabilities', zh:'超出某人能力'}],
    
    extraExamples: [
      {en:'The platform has many capabilities.', zh:'这个平台功能很多。'},
      {en:'It’s beyond my capabilities.', zh:'这超出了我的能力。'},
    ],
  }),
  w('w116', 'cease', '/siːs/', 'v.', '停止，终止', 'The noise finally ceased.', '行为与动作', '噪音终于停止了。', {
    phrases: [{en:'cease doing sth.', zh:'停止做某事'}, {en:'cease-fire', zh:'停火'}],
    
    extraExamples: [
      {en:'The company ceased trading.', zh:'公司停业了。'},
      {en:'He never ceases to amaze me.', zh:'他总能让我惊叹。'},
    ],
  }),
  w('w117', 'coincide', '/ˌkəʊɪnˈsaɪd/', 'v.', '同时发生；一致', 'Our schedules coincide.', '社会与环境', '我们的日程一致。', {
    phrases: [{en:'coincide with...', zh:'与……同时发生/一致'}, {en:'their interests coincide', zh:'他们利益一致'}],
    
    extraExamples: [
      {en:'My birthday coincides with Christmas.', zh:'我生日和圣诞节同一天。'},
      {en:'Our views coincide.', zh:'我们观点一致。'},
    ],
  }),
  w('w118', 'commence', '/kəˈmens/', 'v.', '开始，着手', 'The meeting will commence at 9.', '行为与动作', '会议将在九点开始。', {
    phrases: [{en:'commence doing sth.', zh:'开始做某事'}, {en:'commence proceedings', zh:'开始议程'}],
    
    extraExamples: [
      {en:'The ceremony commenced at noon.', zh:'典礼中午开始。'},
      {en:'Construction will commence soon.', zh:'施工很快开始。'},
    ],
  }),
  w('w119', 'compel', '/kəmˈpel/', 'v.', '强迫，迫使', 'Duty compelled him to act.', '行为与动作', '责任迫使他行动。', {
    phrases: [{en:'compel sb. to do sth.', zh:'强迫某人做某事'}, {en:'feel compelled to...', zh:'觉得必须……'}],
    
    extraExamples: [
      {en:'Hunger compelled him to steal.', zh:'饥饿迫使他偷窃。'},
      {en:'She felt compelled to speak out.', zh:'她觉得必须发声。'},
    ],
  }),
  w('w120', 'complement', '/ˈkɒmplɪment/', 'n./v.', '补充，补足', 'The wine complements the meal.', '行为与动作', '这酒和饭菜相得益彰。', {
    phrases: [{en:'complement sth.', zh:'与……互补'}, {en:'a complement to...', zh:'对……的补充'}],
    
    extraExamples: [
      {en:'The flowers complement the room.', zh:'鲜花点缀得房间更漂亮。'},
      {en:'The couple complement each other.', zh:'这对夫妻互补。'},
    ],
  }),
  w('w121', 'concede', '/kənˈsiːd/', 'v.', '承认；让步', 'He conceded the point.', '认知与学术', '他承认了这一点。', {
    phrases: [{en:'concede defeat', zh:'承认失败'}, {en:'concede that...', zh:'承认……'}],
    
    extraExamples: [
      {en:'He conceded defeat before the count ended.', zh:'计票未结束他就认输了。'},
      {en:'She conceded that she was wrong.', zh:'她承认自己错了。'},
    ],
  }),
  w('w122', 'confine', '/kənˈfaɪn/', 'v.', '限制，局限于', 'Please confine the discussion to the topic.', '行为与动作', '请把讨论限制在主题内。', {
    phrases: [{en:'confine sth. to sth.', zh:'把某事局限于某事'}, {en:'be confined to bed', zh:'卧床'}],
    
    extraExamples: [
      {en:'Please confine your remarks to the issue.', zh:'发言请紧扣议题。'},
      {en:'She was confined to a wheelchair.', zh:'她只能坐轮椅。'},
    ],
  }),
  w('w123', 'confront', '/kənˈfrʌnt/', 'v.', '面对，正视', 'We must confront the problem.', '行为与动作', '我们必须正视这个问题。', {
    phrases: [{en:'confront a problem/difficulty', zh:'面对问题/困难'}, {en:'be confronted with...', zh:'面对……'}],
    
    extraExamples: [
      {en:'We must confront our fears.', zh:'我们必须直面恐惧。'},
      {en:'He confronted his boss about the pay.', zh:'他找老板当面谈工资。'},
    ],
  }),
  w('w124', 'consensus', '/kənˈsensəs/', 'n.', '共识，一致意见', 'They reached a consensus.', '认知与学术', '他们达成了共识。', {
    phrases: [{en:'reach a consensus', zh:'达成共识'}, {en:'by consensus', zh:'一致同意'}],
    
    extraExamples: [
      {en:'There is broad consensus on this.', zh:'这一点上大家广泛共识。'},
      {en:'No consensus was reached.', zh:'没达成共识。'},
    ],
  }),
  w('w125', 'constitute', '/ˈkɒnstɪtjuːt/', 'v.', '构成，组成', 'Twelve months constitute a year.', '认知与学术', '十二个月构成一年。', {
    phrases: [{en:'constitute a threat', zh:'构成威胁'}, {en:'be constituted of...', zh:'由……组成'}],
    
    extraExamples: [
      {en:'Women constitute half the population.', zh:'女性占人口一半。'},
      {en:'This constitutes an emergency.', zh:'这构成紧急情况。'},
    ],
  }),
  w('w126', 'constrain', '/kənˈstreɪn/', 'v.', '约束，限制', 'Budget constrains our choices.', '行为与动作', '预算限制了我们的选择。', {
    phrases: [{en:'be constrained by...', zh:'受……限制'}, {en:'constrain growth', zh:'限制增长'}],
    
    extraExamples: [
      {en:'Budget constraints force cuts.', zh:'预算约束迫使削减。'},
      {en:'She felt constrained by rules.', zh:'她感到受规则束缚。'},
    ],
  }),
  w('w127', 'contemporary', '/kənˈtemprəri/', 'adj.', '当代的，现代的', 'She studies contemporary art.', '社会与环境', '她研究当代艺术。', {
    phrases: [{en:'contemporary art/literature', zh:'当代艺术/文学'}, {en:'contemporary with...', zh:'与……同时代'}],
    
    extraExamples: [
      {en:'He was contemporary with Shakespeare.', zh:'他与莎士比亚同时代。'},
      {en:'The exhibit shows contemporary design.', zh:'展览展示当代设计。'},
    ],
  }),
  w('w128', 'contradict', '/ˌkɒntrəˈdɪkt/', 'v.', '反驳，与……矛盾', 'The data contradicts his claim.', '认知与学术', '数据与他的说法矛盾。', {
    phrases: [{en:'contradict oneself', zh:'自相矛盾'}, {en:'directly contradict', zh:'直接反驳'}],
    
    extraExamples: [
      {en:'His actions contradict his words.', zh:'他言行不一。'},
      {en:'The reports contradict each other.', zh:'两份报告互相矛盾。'},
    ],
  }),
  w('w129', 'contrast', '/ˈkɒntrɑːst/', 'n./v.', '对比，对照', 'The contrast is striking.', '认知与学术', '对比十分鲜明。', {
    phrases: [{en:'by contrast', zh:'相比之下'}, {en:'contrast A with B', zh:'对比A和B'}],
    
    extraExamples: [
      {en:'By contrast, sales fell.', zh:'相比之下销售额下降。'},
      {en:'Contrast this with last year.', zh:'把这和去年对比一下。'},
    ],
  }),
  w('w130', 'crucial', '/ˈkruːʃl/', 'adj.', '至关重要的', 'Timing is crucial.', '品质与状态', '时机至关重要。', {
    phrases: [{en:'play a crucial role', zh:'发挥关键作用'}, {en:'crucial to sth.', zh:'对……至关重要'}],
    
    extraExamples: [
      {en:'This is a crucial moment.', zh:'这是关键时刻。'},
      {en:'Sleep is crucial to health.', zh:'睡眠对健康至关重要。'},
    ],
  }),
  w('w131', 'culminate', '/ˈkʌlmɪneɪt/', 'v.', '达到顶点', 'The event culminated in a celebration.', '行为与动作', '活动以庆祝达到高潮。', {
    phrases: [{en:'culminate in sth.', zh:'以……达到高潮'}, {en:'the culmination of...', zh:'……的顶点'}],
    
    extraExamples: [
      {en:'Years of work culminated in the book.', zh:'多年工作最终写成此书。'},
      {en:'The festival culminated with fireworks.', zh:'音乐节以烟花压轴。'},
    ],
  }),
  w('w132', 'deficient', '/dɪˈfɪʃnt/', 'adj.', '缺乏的，不足的', 'The soil is deficient in iron.', '品质与状态', '土壤缺铁。', {
    phrases: [{en:'be deficient in...', zh:'缺乏……'}, {en:'a deficient diet', zh:'不均衡的饮食'}],
    
    extraExamples: [
      {en:'His diet is deficient in vitamins.', zh:'他饮食中维生素不足。'},
      {en:'We found the evidence deficient.', zh:'我们发现证据不足。'},
    ],
  }),
  w('w133', 'demonstrate', '/ˈdemənstreɪt/', 'v.', '证明；演示', 'Let me demonstrate how it works.', '认知与学术', '让我演示它的工作原理。', {
    phrases: [{en:'demonstrate how to do sth.', zh:'演示怎么做'}, {en:'demonstrate that...', zh:'证明……'}],
    
    extraExamples: [
      {en:'Let me demonstrate.', zh:'我来演示一下。'},
      {en:'The data demonstrates a clear trend.', zh:'数据显示出明显趋势。'},
    ],
  }),
  w('w134', 'depict', '/dɪˈpɪkt/', 'v.', '描绘，描述', 'The painting depicts a village.', '认知与学术', '这幅画描绘了一个村庄。', {
    phrases: [{en:'depict sth. as...', zh:'把……描绘成……'}, {en:'depict a scene', zh:'描绘场景'}],
    
    extraExamples: [
      {en:'The film depicts life in prison.', zh:'这部电影描绘狱中生活。'},
      {en:'The ad depicts a happy family.', zh:'广告描绘幸福家庭。'},
    ],
  }),
  w('w135', 'designate', '/ˈdezɪɡneɪt/', 'v.', '指定，命名', 'This area is designated for parking.', '社会与环境', '该区域被指定为停车区。', {
    phrases: [{en:'designate sth. as...', zh:'把……指定为……'}, {en:'a designated hitter', zh:'指定击球员'}],
    
    extraExamples: [
      {en:'This floor is designated for staff.', zh:'这层是员工专用。'},
      {en:'She was designated as team leader.', zh:'她被指定为组长。'},
    ],
  }),
  w('w136', 'discard', '/dɪsˈkɑːd/', 'v.', '丢弃，抛弃', 'Discard the old files.', '行为与动作', '丢弃旧文件。', {
    phrases: [{en:'discard sth.', zh:'丢弃某物'}, {en:'discard old beliefs', zh:'摒弃旧观念'}],
    
    extraExamples: [
      {en:'Discard empty bottles.', zh:'把空瓶子扔掉。'},
      {en:'He discarded his coat.', zh:'他扔了外套。'},
    ],
  }),
  w('w137', 'discern', '/dɪˈsɜːn/', 'v.', '辨别，看出', 'We could discern a pattern.', '认知与学术', '我们能看出一种模式。', {
    phrases: [{en:'discern a difference/truth', zh:'辨别出不同/真相'}, {en:'it is hard to discern', zh:'很难分辨'}],
    
    extraExamples: [
      {en:'Can you discern the meaning?', zh:'你能看出意思吗？'},
      {en:'We discerned a change in his mood.', zh:'我们察觉到他情绪变化。'},
    ],
  }),
  w('w138', 'displace', '/dɪsˈpleɪs/', 'v.', '取代；使流离', 'Machines displaced many workers.', '社会与环境', '机器取代了许多工人。', {
    phrases: [{en:'displace workers/people', zh:'取代工人/使人流离'}, {en:'displaced persons', zh:'难民'}],
    
    extraExamples: [
      {en:'The war displaced thousands.', zh:'战争使成千上万人流离失所。'},
      {en:'Coal has been displaced by gas.', zh:'煤炭已被天然气取代。'},
    ],
  }),
  w('w139', 'dissipate', '/ˈdɪsɪpeɪt/', 'v.', '消散，驱散', 'The fog dissipated by noon.', '行为与动作', '雾气在中午前消散了。', {
    phrases: [{en:'the fog/fog dissipates', zh:'雾散了'}, {en:'dissipate fear/doubts', zh:'消除恐惧/疑虑'}],
    
    extraExamples: [
      {en:'Her anger slowly dissipated.', zh:'她的怒气渐渐消了。'},
      {en:'The sun dissipated the mist.', zh:'太阳驱散了薄雾。'},
    ],
  }),
  w('w140', 'distinguish', '/dɪˈstɪŋɡwɪʃ/', 'v.', '区分，辨别', 'Distinguish between fact and opinion.', '认知与学术', '区分事实与观点。', {
    phrases: [{en:'distinguish A from B', zh:'区分A和B'}, {en:'distinguish oneself', zh:'脱颖而出'}],
    
    extraExamples: [
      {en:'Can you distinguish the twins?', zh:'你能分清这对双胞胎吗？'},
      {en:'She distinguished herself in math.', zh:'她在数学上脱颖而出。'},
    ],
  }),
  w('w141', 'embed', '/ɪmˈbed/', 'v.', '嵌入', 'The image is embedded in the text.', '行为与动作', '图片嵌入在文本中。', {
    phrases: [{en:'embed sth. in sth.', zh:'把……嵌入……'}, {en:'deeply embedded', zh:'根深蒂固的'}],
    
    extraExamples: [
      {en:'The bullet was embedded in his arm.', zh:'子弹嵌在他手臂里。'},
      {en:'Cultural values are embedded in language.', zh:'文化价值观深植于语言中。'},
    ],
  }),
  w('w142', 'eminent', '/ˈemɪnənt/', 'adj.', '杰出的，卓越的', 'She is an eminent scientist.', '品质与状态', '她是位杰出的科学家。', {
    phrases: [{en:'an eminent scholar/doctor', zh:'杰出学者/医生'}, {en:'eminent domain', zh:'征用权（法律术语）'}],
    
    extraExamples: [
      {en:'He is an eminent lawyer.', zh:'他是位著名律师。'},
      {en:'She is eminent in the field.', zh:'她在该领域声望很高。'},
    ],
  }),
  w('w143', 'empirical', '/ɪmˈpɪrɪkl/', 'adj.', '实证的，经验主义的', 'The theory is based on empirical data.', '认知与学术', '该理论基于实证数据。', {
    phrases: [{en:'empirical evidence/data', zh:'实证证据/数据'}, {en:'empirical research', zh:'实证研究'}],
    
    extraExamples: [
      {en:'There is no empirical proof.', zh:'没有实证证据。'},
      {en:'Empirical studies support the theory.', zh:'实证研究支持该理论。'},
    ],
  }),
  w('w144', 'endorse', '/ɪnˈdɔːs/', 'v.', '赞同，支持', 'The committee endorsed the plan.', '认知与学术', '委员会赞同该计划。', {
    phrases: [{en:'endorse a product/plan', zh:'为产品代言/赞同计划'}, {en:'officially endorse', zh:'正式支持'}],
    
    extraExamples: [
      {en:'The celebrity endorsed the new phone.', zh:'这位明星为新手机代言。'},
      {en:'I fully endorse her decision.', zh:'我完全支持她的决定。'},
    ],
  }),
  w('w145', 'entail', '/ɪnˈteɪl/', 'v.', '需要，牵涉', 'The job entails long hours.', '行为与动作', '这份工作需要长时间。', {
    phrases: [{en:'entail doing sth.', zh:'需要做某事'}, {en:'the job entails...', zh:'这份工作需要……'}],
    
    extraExamples: [
      {en:'The project entails many risks.', zh:'这个项目涉及很多风险。'},
      {en:'The plan entails cutting costs.', zh:'该计划需要削减成本。'},
    ],
  }),
  w('w146', 'enterprise', '/ˈentəpraɪz/', 'n.', '企业，事业', 'She runs a successful enterprise.', '社会与环境', '她经营一家成功的企业。', {
    phrases: [{en:'a state-owned enterprise', zh:'国有企业'}, {en:'free enterprise', zh:'自由企业制度'}],
    
    extraExamples: [
      {en:'The enterprise employs 500 people.', zh:'这家企业雇了500人。'},
      {en:'It was a bold enterprise.', zh:'那是一项大胆的事业。'},
    ],
  }),
  w('w147', 'envisage', '/ɪnˈvɪzɪdʒ/', 'v.', '设想，想象', 'We envisage a bright future.', '认知与学术', '我们设想一个光明的未来。', {
    phrases: [{en:'envisage doing sth.', zh:'设想做某事'}, {en:'envisage a future where...', zh:'设想……的未来'}],
    
    extraExamples: [
      {en:'I don’t envisage any problems.', zh:'我预想不会有问题。'},
      {en:'He envisaged himself as a doctor.', zh:'他想象自己是医生。'},
    ],
  }),
  w('w148', 'equitable', '/ˈekwɪtəbl/', 'adj.', '公平的，公正的', 'They demand equitable treatment.', '品质与状态', '他们要求公平对待。', {
    phrases: [{en:'equitable distribution/treatment', zh:'公平分配/对待'}, {en:'an equitable solution', zh:'公平的解决方案'}],
    
    extraExamples: [
      {en:'We need an equitable system.', zh:'我们需要公平的制度。'},
      {en:'The split was equitable.', zh:'分配是公平的。'},
    ],
  }),
  w('w149', 'exert', '/ɪɡˈzɜːt/', 'v.', '施加，运用', 'He exerted great influence.', '行为与动作', '他施加了巨大影响。', {
    phrases: [{en:'exert influence/pressure', zh:'施加影响/压力'}, {en:'exert oneself', zh:'努力，尽力'}],
    
    extraExamples: [
      {en:'She exerted all her strength.', zh:'她用尽全身力气。'},
      {en:'He exerted pressure on the bank.', zh:'他向银行施压。'},
    ],
  }),
  w('w150', 'expedite', '/ˈekspədaɪt/', 'v.', '加快，促进', 'We must expedite the process.', '行为与动作', '我们必须加快进程。', {
    phrases: [{en:'expedite the process/delivery', zh:'加快进程/交付'}, {en:'expedite matters', zh:'加快事态'}],
    
    extraExamples: [
      {en:'Please expedite the order.', zh:'请加急处理订单。'},
      {en:'We need to expedite the application.', zh:'我们需要加快审批。'},
    ],
  }),
];
