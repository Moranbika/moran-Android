// 词书库数据（墨墨式）：按阶段（小学/初中/高中/大学/考研…）分组，
// 阶段下再按册/版本分多本，内置词书可进入学习并展示单元单词列表。
// 内置可学习的词库：大学六级 CET-6（96 词拆分单元）、初中英语各册、小学英语。

import { VOCAB_WORDS, WORD_CATEGORIES } from './words';
import type { IVocabWord } from './words';

export interface BookUnit {
  id: string;
  title: string; // 单元标题（如"Unit 1 · 认知与学术"）
  words: IVocabWord[];
}

export interface VocabBook {
  id: string;
  name: string;
  stage: string; // 阶段分类（小学英语/初中英语/高中英语/大学英语/考研英语/成人本科/新概念英语/云词库）
  wordCount: number;
  builtin: boolean; // 是否内置可直接学习
  desc?: string;
  units?: BookUnit[]; // 内置书的单元划分
}

// 阶段分组展示顺序
export const BOOK_STAGES = [
  '小学英语',
  '初中英语',
  '高中英语',
  '大学英语',
  '考研英语',
  '成人本科',
  '新概念英语',
  '云词库',
];

type Category = (typeof WORD_CATEGORIES)[number];

type WordPair = { en: string; zh: string };
type WordPairInput = WordPair | [string, string];
type WordExtras = {
  phrases?: WordPairInput[];
  mnemonic?: string;
  extraExamples?: WordPairInput[];
  senses?: IVocabWord['senses'];
  forms?: IVocabWord['forms'];
};

const toWordPairs = (pairs?: WordPairInput[]): WordPair[] | undefined =>
  pairs?.map((pair) => (Array.isArray(pair) ? { en: pair[0], zh: pair[1] } : pair));

const w = (
  id: string,
  word: string,
  phonetic: string,
  pos: string,
  definition: string,
  example: string,
  category: Category,
  exampleZh?: string,
  extra?: WordExtras,
): IVocabWord => {
  const { phrases, extraExamples, ...rest } = extra ?? {};
  return {
    id,
    word,
    phonetic,
    pos,
    definition,
    example,
    exampleZh,
    category,
    ...rest,
    phrases: toWordPairs(phrases),
    extraExamples: toWordPairs(extraExamples),
  };
};

// ===== 大学六级 CET-6：复用内置 96 词，按类别拆成单元 =====
function buildCet6Units(): BookUnit[] {
  return WORD_CATEGORIES.map((c, i) => ({
    id: `cet6-u${i + 1}`,
    title: `Unit ${i + 1} · ${c}`,
    words: VOCAB_WORDS.filter((x) => x.category === c),
  }));
}

// ===== 小学英语：人教版PEP三年级上册（2024新版）真实词表 =====
const PRIMARY_WORDS: IVocabWord[] = [
  w('p3-1', 'hello', '/həˈləʊ/', 'int.', '你好', 'Hello, I am Amy.', '情感与性格', '你好，我是艾米。'),
  w('p3-2', 'hi', '/haɪ/', 'int.', '嗨，你好', 'Hi, nice to meet you.', '情感与性格', '嗨，很高兴见到你。'),
  w('p3-3', 'name', '/neɪm/', 'n.', '名字', 'My name is Tom.', '认知与学术', '我的名字叫汤姆。'),
  w('p3-4', 'nice', '/naɪs/', 'adj.', '令人愉快的；友好的', 'She is very nice.', '品质与状态', '她人很好。'),
  w('p3-5', 'good', '/ɡʊd/', 'adj.', '好的', 'Good morning, teacher.', '品质与状态', '早上好，老师。'),
  w('p3-6', 'morning', '/ˈmɔːnɪŋ/', 'n.', '早晨；上午', 'Good morning, boys.', '认知与学术', '早上好，孩子们。'),
  w('p3-7', 'meet', '/miːt/', 'v.', '遇见；会面', 'Nice to meet you.', '行为与动作', '很高兴见到你。'),
  w('p3-8', 'this', '/ðɪs/', 'pron.', '这，这个', 'This is my friend.', '认知与学术', '这是我的朋友。'),
  w('p3-9', 'goodbye', '/ˌɡʊdˈbaɪ/', 'int.', '再见', 'Goodbye, see you.', '情感与性格', '再见，回头见。'),
  w('p3-10', 'friend', '/frend/', 'n.', '朋友', 'He is my good friend.', '情感与性格', '他是我的好朋友。'),
  w('p3-11', 'help', '/help/', 'v.', '帮助', 'Can you help me?', '行为与动作', '你能帮我吗？'),
  w('p3-12', 'say', '/seɪ/', 'v.', '说；讲', 'Say it again, please.', '行为与动作', '请再说一遍。'),
  w('p3-13', 'smile', '/smaɪl/', 'v./n.', '微笑', 'Please smile at me.', '情感与性格', '请对我微笑。'),
  w('p3-14', 'listen', '/ˈlɪsn/', 'v.', '听；倾听', 'Listen to the teacher.', '认知与学术', '听老师讲。'),
  w('p3-15', 'share', '/ʃeə/', 'v.', '分享', 'We share the toys.', '行为与动作', '我们分享玩具。'),
  w('p3-16', 'and', '/ænd/', 'conj.', '和；与', 'You and I are friends.', '认知与学术', '你和我都是朋友。'),
  w('p3-17', 'who', '/huː/', 'pron.', '谁', 'Who is that girl?', '认知与学术', '那个女孩是谁？'),
  w('p3-18', 'you', '/juː/', 'pron.', '你；你们', 'You are nice.', '认知与学术', '你很好。'),
  w('p3-19', 'are', '/ɑː/', 'v.', '是（be 的复数）', 'You are my friend.', '认知与学术', '你是我的朋友。'),
  w('p3-20', 'great', '/ɡreɪt/', 'adj.', '很好的；极好的', 'That is great!', '品质与状态', '那太棒了！'),
  w('p3-21', 'mum', '/mʌm/', 'n.', '妈妈', 'My mum is kind.', '社会与环境', '我妈妈很和蔼。'),
  w('p3-22', 'mom', '/mɒm/', 'n.', '妈妈（美式）', 'I love my mom.', '社会与环境', '我爱我妈妈。'),
  w('p3-23', 'dad', '/dæd/', 'n.', '爸爸', 'My dad can cook.', '社会与环境', '我爸爸会做饭。'),
  w('p3-24', 'brother', '/ˈbrʌðə/', 'n.', '兄弟', 'I have a little brother.', '社会与环境', '我有一个小弟弟。'),
  w('p3-25', 'sister', '/ˈsɪstə/', 'n.', '姐妹', 'My sister is cute.', '社会与环境', '我妹妹很可爱。'),
  w('p3-26', 'photo', '/ˈfəʊtəʊ/', 'n.', '照片', 'This is our family photo.', '认知与学术', '这是我们家的照片。'),
  w('p3-27', 'that', '/ðæt/', 'pron.', '那，那个', 'That is my brother.', '认知与学术', '那是我弟弟。'),
  w('p3-28', 'thank', '/θæŋk/', 'v.', '感谢', 'Thank you for helping.', '情感与性格', '谢谢你的帮助。'),
  w('p3-29', 'cat', '/kæt/', 'n.', '猫', 'The cat is sleeping.', '社会与环境', '那只猫在睡觉。'),
  w('p3-30', 'dog', '/dɒɡ/', 'n.', '狗', 'My dog runs fast.', '社会与环境', '我的狗跑得很快。'),
  w('p3-31', 'panda', '/ˈpændə/', 'n.', '熊猫', 'Pandas live in China.', '社会与环境', '熊猫生活在中国。'),
  w('p3-32', 'tiger', '/ˈtaɪɡə/', 'n.', '老虎', 'The tiger is strong.', '社会与环境', '老虎很强壮。'),
  w('p3-33', 'elephant', '/ˈelɪfənt/', 'n.', '大象', 'The elephant has a long nose.', '社会与环境', '大象有长鼻子。'),
  w('p3-34', 'monkey', '/ˈmʌŋki/', 'n.', '猴子', 'The monkey likes bananas.', '社会与环境', '猴子喜欢香蕉。'),
  w('p3-35', 'bird', '/bɜːd/', 'n.', '鸟', 'A bird can fly.', '社会与环境', '鸟会飞。'),
  w('p3-36', 'duck', '/dʌk/', 'n.', '鸭子', 'The duck swims in the water.', '社会与环境', '鸭子在水中游。'),
  w('p3-37', 'pig', '/pɪɡ/', 'n.', '猪', 'The pig is fat.', '社会与环境', '猪很胖。'),
  w('p3-38', 'bear', '/beə/', 'n.', '熊', 'The bear is big.', '社会与环境', '熊很大。'),
  w('p3-39', 'fish', '/fɪʃ/', 'n.', '鱼', 'There are fish in the lake.', '社会与环境', '湖里有鱼。'),
  w('p3-40', 'zoo', '/zuː/', 'n.', '动物园', 'We go to the zoo.', '社会与环境', '我们去动物园。'),
  w('p3-41', 'funny', '/ˈfʌni/', 'adj.', '有趣的；滑稽的', 'The monkey is funny.', '品质与状态', '猴子很有趣。'),
  w('p3-42', 'animal', '/ˈænɪml/', 'n.', '动物', 'Pandas are cute animals.', '社会与环境', '熊猫是可爱的动物。'),
  w('p3-43', 'apple', '/ˈæpl/', 'n.', '苹果', 'I eat an apple a day.', '认知与学术', '我每天吃一个苹果。'),
  w('p3-44', 'flower', '/ˈflaʊə/', 'n.', '花', 'The flower is beautiful.', '社会与环境', '这朵花很漂亮。'),
  w('p3-45', 'ant', '/ænt/', 'n.', '蚂蚁', 'The ant is small.', '社会与环境', '蚂蚁很小。'),
  w('p3-46', 'tree', '/triː/', 'n.', '树', 'The tree is tall.', '社会与环境', '这棵树很高。'),
  w('p3-47', 'grass', '/ɡrɑːs/', 'n.', '草；草地', 'The grass is green.', '社会与环境', '草地是绿色的。'),
  w('p3-48', 'foot', '/fʊt/', 'n.', '脚', 'I hurt my foot.', '认知与学术', '我弄伤了脚。'),
  w('p3-49', 'leg', '/leɡ/', 'n.', '腿', 'The dog has four legs.', '认知与学术', '狗有四条腿。'),
  w('p3-50', 'body', '/ˈbɒdi/', 'n.', '身体', 'Touch your body.', '认知与学术', '摸摸你的身体。'),
  w('p3-51', 'head', '/hed/', 'n.', '头', 'Touch your head.', '认知与学术', '摸摸你的头。'),
  w('p3-52', 'hand', '/hænd/', 'n.', '手', 'Wave your hand.', '认知与学术', '挥挥你的手。'),
  w('p3-53', 'arm', '/ɑːm/', 'n.', '胳膊', 'Raise your arm.', '认知与学术', '举起你的胳膊。'),
  w('p3-54', 'mouth', '/maʊθ/', 'n.', '嘴', 'Open your mouth.', '认知与学术', '张开你的嘴。'),
  w('p3-55', 'nose', '/nəʊz/', 'n.', '鼻子', 'I have a small nose.', '认知与学术', '我有一个小鼻子。'),
  w('p3-56', 'eye', '/aɪ/', 'n.', '眼睛', 'Close your eyes.', '认知与学术', '闭上眼睛。'),
  w('p3-57', 'ear', '/ɪə/', 'n.', '耳朵', 'I have two ears.', '认知与学术', '我有两只耳朵。'),
  w('p3-58', 'face', '/feɪs/', 'n.', '脸', 'This is my face.', '认知与学术', '这是我的脸。'),
  w('p3-59', 'red', '/red/', 'adj.', '红色的', 'The apple is red.', '品质与状态', '苹果是红色的。'),
  w('p3-60', 'blue', '/bluː/', 'adj.', '蓝色的', 'The sky is blue.', '品质与状态', '天空是蓝色的。'),
  w('p3-61', 'green', '/ɡriːn/', 'adj.', '绿色的', 'The grass is green.', '品质与状态', '草是绿色的。'),
  w('p3-62', 'yellow', '/ˈjeləʊ/', 'adj.', '黄色的', 'The banana is yellow.', '品质与状态', '香蕉是黄色的。'),
  w('p3-63', 'black', '/blæk/', 'adj.', '黑色的', 'I have a black cat.', '品质与状态', '我有一只黑猫。'),
  w('p3-64', 'white', '/waɪt/', 'adj.', '白色的', 'She wears a white dress.', '品质与状态', '她穿着白色连衣裙。'),
  w('p3-65', 'brown', '/braʊn/', 'adj.', '棕色的', 'The bear is brown.', '品质与状态', '熊是棕色的。'),
  w('p3-66', 'orange', '/ˈɒrɪndʒ/', 'n./adj.', '橙子；橙色的', 'I like oranges.', '认知与学术', '我喜欢橙子。'),
  w('p3-67', 'colour', '/ˈkʌlə/', 'n.', '颜色', 'What colour is it?', '认知与学术', '它是什么颜色？'),
  w('p3-68', 'one', '/wʌn/', 'num.', '一', 'I have one book.', '认知与学术', '我有一本书。'),
  w('p3-69', 'two', '/tuː/', 'num.', '二', 'There are two cats.', '认知与学术', '有两只猫。'),
  w('p3-70', 'three', '/θriː/', 'num.', '三', 'I have three pens.', '认知与学术', '我有三支钢笔。'),
  w('p3-71', 'four', '/fɔː/', 'num.', '四', 'There are four chairs.', '认知与学术', '有四把椅子。'),
  w('p3-72', 'five', '/faɪv/', 'num.', '五', 'I can count to five.', '认知与学术', '我能数到五。'),
  w('p3-73', 'six', '/sɪks/', 'num.', '六', 'I have six pencils.', '认知与学术', '我有六支铅笔。'),
  w('p3-74', 'seven', '/ˈsevn/', 'num.', '七', 'There are seven days.', '认知与学术', '有七天。'),
  w('p3-75', 'eight', '/eɪt/', 'num.', '八', 'I am eight years old.', '认知与学术', '我八岁了。'),
  w('p3-76', 'nine', '/naɪn/', 'num.', '九', 'I have nine toys.', '认知与学术', '我有九个玩具。'),
  w('p3-77', 'ten', '/ten/', 'num.', '十', 'Count to ten, please.', '认知与学术', '请数到十。'),
  w('p3-78', 'number', '/ˈnʌmbə/', 'n.', '数字', 'I know these numbers.', '认知与学术', '我认识这些数字。'),
  w('p3-79', 'count', '/kaʊnt/', 'v.', '数；计数', 'Count the apples.', '认知与学术', '数一数苹果。'),
  w('p3-80', 'rice', '/raɪs/', 'n.', '米饭', 'We eat rice every day.', '认知与学术', '我们每天吃米饭。'),
  w('p3-81', 'cake', '/keɪk/', 'n.', '蛋糕', 'The cake is sweet.', '认知与学术', '蛋糕很甜。'),
  w('p3-82', 'milk', '/mɪlk/', 'n.', '牛奶', 'I drink milk at breakfast.', '认知与学术', '我早餐喝牛奶。'),
  w('p3-83', 'egg', '/eɡ/', 'n.', '鸡蛋', 'She has an egg.', '认知与学术', '她有一个鸡蛋。'),
  w('p3-84', 'juice', '/dʒuːs/', 'n.', '果汁', 'I like apple juice.', '认知与学术', '我喜欢苹果汁。'),
  w('p3-85', 'bread', '/bred/', 'n.', '面包', 'I eat bread for breakfast.', '认知与学术', '我早餐吃面包。'),
  w('p3-86', 'water', '/ˈwɔːtə/', 'n.', '水', 'Drink some water.', '认知与学术', '喝点水。'),
  w('p3-87', 'pen', '/pen/', 'n.', '钢笔', 'This is my pen.', '认知与学术', '这是我的钢笔。'),
  w('p3-88', 'ruler', '/ˈruːlə/', 'n.', '尺子', 'The ruler is long.', '认知与学术', '这把尺子很长。'),
  w('p3-89', 'pencil', '/ˈpensl/', 'n.', '铅笔', 'I have a pencil.', '认知与学术', '我有一支铅笔。'),
  w('p3-90', 'eraser', '/ɪˈreɪzə/', 'n.', '橡皮', 'Use the eraser, please.', '认知与学术', '请用橡皮。'),
  w('p3-91', 'bag', '/bæɡ/', 'n.', '书包', 'My bag is heavy.', '认知与学术', '我的书包很重。'),
  w('p3-92', 'crayon', '/ˈkreɪən/', 'n.', '蜡笔', 'The crayon is green.', '认知与学术', '这支蜡笔是绿色的。'),
  w('p3-93', 'book', '/bʊk/', 'n.', '书', 'I read a book.', '认知与学术', '我读一本书。'),
  w('p3-94', 'school', '/skuːl/', 'n.', '学校', 'We go to school by bus.', '社会与环境', '我们坐公交去上学。'),
  w('p3-95', 'play', '/pleɪ/', 'v.', '玩；打（球）', 'We play games.', '行为与动作', '我们玩游戏。'),
  w('p3-96', 'learn', '/lɜːn/', 'v.', '学习', 'We learn English.', '认知与学术', '我们学英语。'),
  w('p3-97', 'read', '/riːd/', 'v.', '读；阅读', 'Read the story.', '认知与学术', '读这个故事。'),
  w('p3-98', 'write', '/raɪt/', 'v.', '写', 'Write your name.', '行为与动作', '写下你的名字。'),
  w('p3-99', 'sing', '/sɪŋ/', 'v.', '唱歌', 'We sing a song.', '行为与动作', '我们唱一首歌。'),
  w('p3-100', 'time', '/taɪm/', 'n.', '时间', 'What time is it?', '认知与学术', '现在几点了？'),
];

// ===== 大学四级高频词 =====
const CET4_WORDS: IVocabWord[] = [
  w('c4-1', 'ancient', '/ˈeɪnʃənt/', 'adj.', '古代的', 'We visited an ancient city.', '社会与环境', '我们参观了一座古城。'),
  w('c4-2', 'aspect', '/ˈæspekt/', 'n.', '方面', 'Consider every aspect.', '认知与学术', '考虑每个方面。'),
  w('c4-3', 'atmosphere', '/ˈætməsfɪə/', 'n.', '气氛，大气', 'The atmosphere was warm.', '社会与环境', '气氛很温暖。'),
  w('c4-4', 'average', '/ˈævərɪdʒ/', 'adj./n.', '平均的', 'The average age is 20.', '品质与状态', '平均年龄是 20 岁。'),
  w('c4-5', 'benefit', '/ˈbenɪfɪt/', 'n./v.', '好处；受益', 'Exercise benefits health.', '社会与环境', '锻炼有益健康。'),
  w('c4-6', 'budget', '/ˈbʌdʒɪt/', 'n.', '预算', 'We have a tight budget.', '社会与环境', '我们预算紧张。'),
  w('c4-7', 'capacity', '/kəˈpæsəti/', 'n.', '容量，能力', 'The hall has a large capacity.', '品质与状态', '大厅容量很大。'),
  w('c4-8', 'complex', '/ˈkɒmpleks/', 'adj.', '复杂的', 'It is a complex problem.', '品质与状态', '这是个复杂问题。'),
  w('c4-9', 'constant', '/ˈkɒnstənt/', 'adj.', '持续的', 'The machine makes a constant noise.', '品质与状态', '机器发出持续噪音。'),
  w('c4-10', 'consume', '/kənˈsjuːm/', 'v.', '消耗，消费', 'The car consumes a lot of fuel.', '行为与动作', '这车耗油很多。'),
  w('c4-11', 'decline', '/dɪˈklaɪn/', 'v.', '下降，拒绝', 'Sales declined this year.', '行为与动作', '今年销售下降。'),
  w('c4-12', 'efficient', '/ɪˈfɪʃnt/', 'adj.', '高效的', 'This is an efficient method.', '品质与状态', '这是高效的方法。'),
  w('c4-13', 'evaluate', '/ɪˈvæljueɪt/', 'v.', '评价', 'We evaluate the results.', '认知与学术', '我们评估结果。'),
  w('c4-14', 'expand', '/ɪkˈspænd/', 'v.', '扩大', 'The company expanded quickly.', '行为与动作', '公司迅速扩张。'),
  w('c4-15', 'global', '/ˈɡləʊbl/', 'adj.', '全球的', 'It is a global issue.', '社会与环境', '这是个全球性问题。'),
  w('c4-16', 'ignore', '/ɪɡˈnɔː/', 'v.', '忽视', 'Do not ignore the warning.', '行为与动作', '不要忽视警告。'),
  w('c4-17', 'impact', '/ˈɪmpækt/', 'n.', '影响', 'It has a big impact.', '社会与环境', '它有很大影响。'),
  w('c4-18', 'indicate', '/ˈɪndɪkeɪt/', 'v.', '表明', 'The sign indicates the way.', '认知与学术', '这个标志指路。'),
  w('c4-19', 'maintain', '/meɪnˈteɪn/', 'v.', '维持', 'Maintain a healthy weight.', '行为与动作', '保持健康体重。'),
  w('c4-20', 'observe', '/əbˈzɜːv/', 'v.', '观察', 'Scientists observe the stars.', '认知与学术', '科学家观察星星。'),
  w('c4-21', 'potential', '/pəˈtenʃl/', 'n.', '潜力', 'She has great potential.', '品质与状态', '她有很大潜力。'),
  w('c4-22', 'strategy', '/ˈstrætədʒi/', 'n.', '策略', 'We need a new strategy.', '认知与学术', '我们需要新策略。'),
  w('c4-23', 'transform', '/trænsˈfɔːm/', 'v.', '转变', 'Technology transforms our lives.', '行为与动作', '技术改变我们的生活。'),
  w('c4-24', 'urgent', '/ˈɜːdʒənt/', 'adj.', '紧急的', 'This is an urgent matter.', '品质与状态', '这是件紧急的事。'),
];

// ===== 考研核心词 =====
const KAOYAN_WORDS: IVocabWord[] = [
  w('ky-1', 'academic', '/ˌækəˈdemɪk/', 'adj.', '学术的', 'She has strong academic skills.', '认知与学术', '她有很强的学术能力。'),
  w('ky-2', 'allocate', '/ˈæləkeɪt/', 'v.', '分配', 'Allocate resources fairly.', '行为与动作', '公平分配资源。'),
  w('ky-3', 'analyse', '/ˈænəlaɪz/', 'v.', '分析', 'We analysed the data.', '认知与学术', '我们分析了数据。'),
  w('ky-4', 'bias', '/ˈbaɪəs/', 'n.', '偏见', 'Avoid bias in the report.', '认知与学术', '报告中避免偏见。'),
  w('ky-5', 'compelling', '/kəmˈpelɪŋ/', 'adj.', '令人信服的', 'He gave a compelling argument.', '品质与状态', '他给出有说服力的论点。'),
  w('ky-6', 'deduce', '/dɪˈdjuːs/', 'v.', '推断', 'We deduced the answer.', '认知与学术', '我们推断出答案。'),
  w('ky-7', 'dilemma', '/dɪˈlemə/', 'n.', '困境', 'She faced a dilemma.', '社会与环境', '她面临两难。'),
  w('ky-8', 'dynamic', '/daɪˈnæmɪk/', 'adj.', '动态的', 'Markets are dynamic.', '品质与状态', '市场是动态的。'),
  w('ky-9', 'elaborate', '/ɪˈlæbərət/', 'adj.', '精心制作的', 'It is an elaborate design.', '品质与状态', '这是精心的设计。'),
  w('ky-10', 'framework', '/ˈfreɪmwɜːk/', 'n.', '框架', 'Build a framework first.', '认知与学术', '先建立框架。'),
  w('ky-11', 'intrinsic', '/ɪnˈtrɪnsɪk/', 'adj.', '内在的', 'Learning has intrinsic value.', '品质与状态', '学习有内在价值。'),
  w('ky-12', 'justify', '/ˈdʒʌstɪfaɪ/', 'v.', '证明正当', 'Can you justify your decision?', '认知与学术', '你能证明你的决定合理吗？'),
  w('ky-13', 'mechanism', '/ˈmekənɪzəm/', 'n.', '机制', 'The mechanism is complex.', '认知与学术', '机制很复杂。'),
  w('ky-14', 'norm', '/nɔːm/', 'n.', '规范，标准', 'Follow the social norms.', '社会与环境', '遵守社会规范。'),
  w('ky-15', 'paradox', '/ˈpærədɒks/', 'n.', '悖论', 'Life is full of paradoxes.', '认知与学术', '生活充满悖论。'),
  w('ky-16', 'phenomenon', '/fəˈnɒmɪnən/', 'n.', '现象', 'It is a natural phenomenon.', '认知与学术', '这是自然现象。'),
  w('ky-17', 'pragmatic', '/præɡˈmætɪk/', 'adj.', '务实的', 'Take a pragmatic approach.', '品质与状态', '采取务实的方法。'),
  w('ky-18', 'rationale', '/ˌræʃəˈnɑːl/', 'n.', '理由', 'Explain the rationale.', '认知与学术', '解释理由。'),
  w('ky-19', 'synthesize', '/ˈsɪnθəsaɪz/', 'v.', '综合', 'Synthesize the findings.', '认知与学术', '综合各项发现。'),
  w('ky-20', 'trait', '/treɪt/', 'n.', '特征', 'Honesty is a good trait.', '品质与状态', '诚实是好品质。'),
  w('ky-21', 'validity', '/vəˈlɪdəti/', 'n.', '有效性', 'Check the validity of the data.', '认知与学术', '检查数据的有效性。'),
  w('ky-22', 'welfare', '/ˈwelfeə/', 'n.', '福利', 'The policy improves welfare.', '社会与环境', '该政策改善福利。'),
];

// ===== 高中英语（必修 + 高考核心） =====
const SENIOR_WORDS: IVocabWord[] = [
  w('sh-1', 'appreciate', '/əˈpriːʃieɪt/', 'v.', '感激，欣赏', 'I appreciate your help.', '情感与性格', '我感激你的帮助。'),
  w('sh-2', 'determine', '/dɪˈtɜːmɪn/', 'v.', '决定，确定', 'We determined the cause.', '认知与学术', '我们确定了原因。'),
  w('sh-3', 'emphasize', '/ˈemfəsaɪz/', 'v.', '强调', 'He emphasized the point.', '行为与动作', '他强调了这一点。'),
  w('sh-4', 'essential', '/ɪˈsenʃl/', 'adj.', '必要的', 'Water is essential.', '品质与状态', '水必不可少。'),
  w('sh-5', 'involve', '/ɪnˈvɒlv/', 'v.', '涉及', 'The task involves teamwork.', '行为与动作', '任务需要团队合作。'),
  w('sh-6', 'motivate', '/ˈməʊtɪveɪt/', 'v.', '激励', 'Praise motivates students.', '情感与性格', '表扬激励学生。'),
  w('sh-7', 'obtain', '/əbˈteɪn/', 'v.', '获得', 'You can obtain it online.', '行为与动作', '你可以在线获取。'),
  w('sh-8', 'previous', '/ˈpriːviəs/', 'adj.', '之前的', 'Check the previous page.', '品质与状态', '查看前一页。'),
  w('sh-9', 'relevant', '/ˈreləvənt/', 'adj.', '相关的', 'Give relevant examples.', '品质与状态', '给出相关例子。'),
  w('sh-10', 'significant', '/sɪɡˈnɪfɪkənt/', 'adj.', '重要的', 'It is a significant change.', '品质与状态', '这是重要变化。'),
  w('sh-11', 'unique', '/juˈniːk/', 'adj.', '独特的', 'Each person is unique.', '品质与状态', '每个人都独一无二。'),
  w('sh-12', 'apply', '/əˈplaɪ/', 'v.', '申请，应用', 'Apply for the job.', '行为与动作', '申请这份工作。'),
  w('sh-13', 'prefer', '/prɪˈfɜː/', 'v.', '更喜欢', 'I prefer tea to coffee.', '情感与性格', '与咖啡相比我更喜欢茶。'),
  w('sh-14', 'require', '/rɪˈkwaɪə/', 'v.', '需要', 'The job requires skill.', '行为与动作', '这份工作需要技能。'),
  w('sh-15', 'adapt', '/əˈdæpt/', 'v.', '适应', 'Adapt to the new life.', '行为与动作', '适应新生活。'),
  w('sh-16', 'perform', '/pəˈfɔːm/', 'v.', '表演，执行', 'They performed well.', '行为与动作', '他们表现很好。'),
  w('sh-17', 'symbol', '/ˈsɪmbl/', 'n.', '象征', 'The dove is a symbol of peace.', '社会与环境', '鸽子是和平的象征。'),
  w('sh-18', 'devote', '/dɪˈvəʊt/', 'v.', '奉献', 'She devotes time to study.', '行为与动作', '她把时间投入学习。'),
];

// ===== 成人本科英语 =====
const ADULT_WORDS: IVocabWord[] = [
  w('ad-1', 'certificate', '/səˈtɪfɪkət/', 'n.', '证书', 'She got a certificate.', '社会与环境', '她获得了证书。'),
  w('ad-2', 'skill', '/skɪl/', 'n.', '技能', 'Learning needs skills.', '认知与学术', '学习需要技能。'),
  w('ad-3', 'practical', '/ˈpræktɪkl/', 'adj.', '实用的', 'Take practical courses.', '品质与状态', '上实用的课程。'),
  w('ad-4', 'diploma', '/dɪˈpləʊmə/', 'n.', '文凭', 'He earned a diploma.', '社会与环境', '他获得了文凭。'),
  w('ad-5', 'career', '/kəˈrɪə/', 'n.', '职业，生涯', 'She built a great career.', '社会与环境', '她建立了出色的职业生涯。'),
  w('ad-6', 'professional', '/prəˈfeʃənl/', 'adj.', '专业的', 'Professional skills matter.', '品质与状态', '专业技能很重要。'),
  w('ad-7', 'knowledge', '/ˈnɒlɪdʒ/', 'n.', '知识', 'Knowledge is power.', '认知与学术', '知识就是力量。'),
  w('ad-8', 'improvement', '/ɪmˈpruːvmənt/', 'n.', '改进', 'We saw real improvement.', '认知与学术', '我们看到真正的进步。'),
  w('ad-9', 'lifelong', '/ˈlaɪflɒŋ/', 'adj.', '终身的', 'Learning is lifelong.', '品质与状态', '学习是终身的。'),
  w('ad-10', 'development', '/dɪˈveləpmənt/', 'n.', '发展', 'Personal development matters.', '社会与环境', '个人发展很重要。'),
  w('ad-11', 'training', '/ˈtreɪnɪŋ/', 'n.', '培训', 'She attended training.', '认知与学术', '她参加了培训。'),
  w('ad-12', 'motivation', '/ˌməʊtɪˈveɪʃn/', 'n.', '动机', 'Motivation drives success.', '情感与性格', '动机推动成功。'),
  w('ad-13', 'qualification', '/ˌkwɒlɪfɪˈkeɪʃn/', 'n.', '资格', 'She has the qualifications.', '社会与环境', '她有相关资格。'),
  w('ad-14', 'individual', '/ˌɪndɪˈvɪdʒuəl/', 'n./adj.', '个人', 'Every individual matters.', '社会与环境', '每个人都很重要。'),
  w('ad-15', 'advance', '/ədˈvɑːns/', 'v.', '前进，进步', 'Technology advances fast.', '行为与动作', '技术进步很快。'),
  w('ad-16', 'promote', '/prəˈməʊt/', 'v.', '提升，促进', 'The company promotes growth.', '行为与动作', '公司促进增长。'),
];

// ===== 新概念英语（一、二册基础） =====
const NC1_WORDS: IVocabWord[] = [
  w('nc1-1', 'listen', '/ˈlɪsn/', 'v.', '听', 'Listen to the teacher.', '认知与学术', '听老师讲。'),
  w('nc1-2', 'speak', '/spiːk/', 'v.', '说', 'She can speak English.', '行为与动作', '她会说英语。'),
  w('nc1-3', 'read', '/riːd/', 'v.', '读', 'Read the sentence aloud.', '认知与学术', '大声读句子。'),
  w('nc1-4', 'write', '/raɪt/', 'v.', '写', 'Write your name here.', '行为与动作', '在这里写下你的名字。'),
  w('nc1-5', 'remember', '/rɪˈmembə/', 'v.', '记住', 'Remember the new words.', '认知与学术', '记住新单词。'),
  w('nc1-6', 'understand', '/ˌʌndəˈstænd/', 'v.', '理解', 'Do you understand?', '认知与学术', '你明白吗？'),
  w('nc1-7', 'practice', '/ˈpræktɪs/', 'v./n.', '练习', 'Practice makes perfect.', '行为与动作', '熟能生巧。'),
  w('nc1-8', 'question', '/ˈkwestʃən/', 'n.', '问题', 'Ask a question.', '认知与学术', '问一个问题。'),
  w('nc1-9', 'answer', '/ˈɑːnsə/', 'n./v.', '回答', 'Give a clear answer.', '认知与学术', '给出清楚的回答。'),
  w('nc1-10', 'lesson', '/ˈlesn/', 'n.', '课', 'The lesson is easy.', '认知与学术', '这课很简单。'),
  w('nc1-11', 'begin', '/bɪˈɡɪn/', 'v.', '开始', 'Let us begin.', '行为与动作', '我们开始吧。'),
  w('nc1-12', 'finish', '/ˈfɪnɪʃ/', 'v.', '完成', 'Finish your homework.', '行为与动作', '完成你的作业。'),
  w('nc1-13', 'easy', '/ˈiːzi/', 'adj.', '容易的', 'The test is easy.', '品质与状态', '考试很简单。'),
  w('nc1-14', 'difficult', '/ˈdɪfɪkəlt/', 'adj.', '困难的', 'The task is difficult.', '品质与状态', '任务很难。'),
  w('nc1-15', 'enjoy', '/ɪnˈdʒɔɪ/', 'v.', '享受', 'I enjoy reading.', '情感与性格', '我喜欢阅读。'),
  w('nc1-16', 'beautiful', '/ˈbjuːtɪfl/', 'adj.', '美丽的', 'The view is beautiful.', '品质与状态', '景色很美。'),
];

const NC2_WORDS: IVocabWord[] = [
  w('nc2-1', 'adventure', '/ədˈventʃə/', 'n.', '冒险', 'Life is an adventure.', '社会与环境', '生活是一场冒险。'),
  w('nc2-2', 'attitude', '/ˈætɪtjuːd/', 'n.', '态度', 'Keep a positive attitude.', '情感与性格', '保持积极态度。'),
  w('nc2-3', 'behave', '/bɪˈheɪv/', 'v.', '表现，举止', 'Behave well in class.', '行为与动作', '在课堂上表现好。'),
  w('nc2-4', 'combine', '/kəmˈbaɪn/', 'v.', '结合', 'Combine theory with practice.', '行为与动作', '理论与实践相结合。'),
  w('nc2-5', 'curiosity', '/ˌkjʊəriˈɒsəti/', 'n.', '好奇心', 'Children have curiosity.', '情感与性格', '孩子有好奇心。'),
  w('nc2-6', 'deserve', '/dɪˈzɜːv/', 'v.', '值得', 'You deserve a rest.', '情感与性格', '你该休息一下。'),
  w('nc2-7', 'expense', '/ɪkˈspens/', 'n.', '花费', 'It is worth the expense.', '社会与环境', '这笔花费值得。'),
  w('nc2-8', 'generous', '/ˈdʒenərəs/', 'adj.', '慷慨的', 'She is generous to others.', '情感与性格', '她对别人很慷慨。'),
  w('nc2-9', 'independent', '/ˌɪndɪˈpendənt/', 'adj.', '独立的', 'Be an independent learner.', '品质与状态', '做个独立的学习者。'),
  w('nc2-10', 'jealous', '/ˈdʒeləs/', 'adj.', '嫉妒的', 'He is jealous of her success.', '情感与性格', '他嫉妒她的成功。'),
  w('nc2-11', 'modest', '/ˈmɒdɪst/', 'adj.', '谦虚的', 'Stay modest and kind.', '品质与状态', '保持谦虚善良。'),
  w('nc2-12', 'ordinary', '/ˈɔːdnri/', 'adj.', '普通的', 'It is an ordinary day.', '品质与状态', '这是普通的一天。'),
  w('nc2-13', 'patience', '/ˈpeɪʃns/', 'n.', '耐心', 'Be patient, please.', '情感与性格', '请耐心。'),
  w('nc2-14', 'recognize', '/ˈrekəɡnaɪz/', 'v.', '认出，承认', 'I recognize her voice.', '认知与学术', '我听出她的声音。'),
  w('nc2-15', 'refuse', '/rɪˈfjuːz/', 'v.', '拒绝', 'He refused to answer.', '行为与动作', '他拒绝回答。'),
  w('nc2-16', 'sensible', '/ˈsensəbl/', 'adj.', '明智的', 'Make a sensible choice.', '品质与状态', '做明智的选择。'),
  w('nc2-17', 'silence', '/ˈsaɪləns/', 'n.', '沉默', 'There was silence in the room.', '情感与性格', '房间里一片沉默。'),
  w('nc2-18', 'splendid', '/ˈsplendɪd/', 'adj.', '壮丽的，极好的', 'What a splendid idea!', '品质与状态', '多棒的主意！'),
  w('nc2-19', 'steady', '/ˈstedi/', 'adj.', '稳定的', 'Keep a steady pace.', '品质与状态', '保持稳定的节奏。'),
  w('nc2-20', 'whisper', '/ˈwɪspə/', 'v.', '低语', 'She whispered the answer.', '行为与动作', '她低声说出答案。'),
];

// ===== 初中英语：初一 / 初二 / 初三 各上、下册（人教版风格） =====
const JUNIOR_BOOKS: Array<{ id: string; name: string; units: Array<{ title: string; words: IVocabWord[] }> }> = [
  {
    id: 'junior-7a',
    name: '人教版初中英语七年级上册（2024新版）',
    units: [
      {
        title: 'Unit 1 · You and Me',
        words: [
          w('j7a1-1', 'make friends', '/meɪk frendz/', 'phr.', '交朋友', 'I want to make friends with you.', '行为与动作', '我想和你交朋友。', {
            phrases: [{en:'make friends with sb.', zh:'和某人交朋友'}, {en:'make friends easily', zh:'很容易交到朋友'}],
            
            extraExamples: [
              {en:'He likes making new friends.', zh:'他喜欢交新朋友。'},
              {en:'It is easy to make friends here.', zh:'在这里很容易交到朋友。'},
            ],
          }),
          w('j7a1-2', 'get to know', '/ɡet tuː nəʊ/', 'phr.', '认识；了解', 'I get to know her slowly.', '认知与学术', '我慢慢了解她。', {
            phrases: [{en:'get to know each other', zh:'互相了解'}, {en:'get to know sb. better', zh:'更了解某人'}],
            
            extraExamples: [
              {en:'You will get to know the city soon.', zh:'你很快就会熟悉这座城市。'},
              {en:'I want to get to know you better.', zh:'我想更了解你。'},
            ],
          }),
          w('j7a1-3', 'each other', '/iːtʃ ˈʌðə(r)/', 'phr.', '互相；彼此', 'We help each other.', '社会与环境', '我们互相帮助。', {
            phrases: [{en:'help each other', zh:'互相帮助'}, {en:'love each other', zh:'彼此相爱'}],
            
            extraExamples: [
              {en:'They looked at each other.', zh:'他们互相看了看。'},
              {en:'We should learn from each other.', zh:'我们应该互相学习。'},
            ],
          }),
          w('j7a1-4', 'full', '/fʊl/', 'adj.', '完整的；满的', 'Write your full name.', '品质与状态', '写你的全名。', {
            phrases: [{en:'be full of...', zh:'充满……'}, {en:'full name', zh:'全名'}],
            
            extraExamples: [
              {en:'The box is full of books.', zh:'箱子里装满了书。'},
              {en:'She told me the full story.', zh:'她告诉了我整件事。'},
            ],
          }),
          w('j7a1-5', 'grade', '/ɡreɪd/', 'n.', '年级；等级', 'I am in Grade Seven.', '认知与学术', '我上七年级。', {
            phrases: [{en:'in Grade Seven', zh:'在七年级'}, {en:'get good grades', zh:'取得好成绩'}],
            
            extraExamples: [
              {en:'She got a good grade in English.', zh:'她英语成绩很好。'},
              {en:'My brother is in Grade 9.', zh:'我弟弟上九年级。'},
            ],
          }),
          w('j7a1-6', 'last name', '/lɑːst neɪm/', 'phr.', '姓氏', 'My last name is Li.', '社会与环境', '我姓李。', {
            phrases: [{en:'last name = family name', zh:'姓氏'}, {en:'What is your last name?', zh:'你姓什么？'}],
            
            extraExamples: [
              {en:'Her last name is Wang.', zh:'她姓王。'},
              {en:'Please write your last name first.', zh:'请先写你的姓氏。'},
            ],
          }),
          w('j7a1-7', 'classmate', '/ˈklɑːsmeɪt/', 'n.', '同班同学', 'He is my classmate.', '社会与环境', '他是我的同班同学。', {
            phrases: [{en:'my classmate', zh:'我的同班同学'}, {en:'a former classmate', zh:'以前的同学'}],
            
            extraExamples: [
              {en:'She is my classmate from primary school.', zh:'她是我小学同学。'},
              {en:'I met an old classmate yesterday.', zh:'我昨天遇到了老同学。'},
            ],
          }),
          w('j7a1-8', 'class teacher', '/klɑːs ˈtiːtʃə(r)/', 'phr.', '班主任', 'Our class teacher is kind.', '社会与环境', '我们班主任很和蔼。', {
            phrases: [{en:'our class teacher', zh:'我们的班主任'}, {en:'talk to the class teacher', zh:'和班主任谈谈'}],
            
            extraExamples: [
              {en:'Our class teacher is very strict.', zh:'我们班主任很严格。'},
              {en:'The class teacher called my parents.', zh:'班主任给我父母打了电话。'},
            ],
          }),
          w('j7a1-9', 'first name', '/fɜːst neɪm/', 'phr.', '名字', 'Her first name is Lucy.', '社会与环境', '她叫露西。', {
            phrases: [{en:'first name = given name', zh:'名字'}, {en:'What is your first name?', zh:'你叫什么名字？'}],
            
            extraExamples: [
              {en:'My first name is Tom.', zh:'我叫汤姆。'},
              {en:'Please call me by my first name.', zh:'请叫我的名字。'},
            ],
          }),
          w('j7a1-10', 'mistake', '/mɪˈsteɪk/', 'n.', '错误；失误', 'Everyone makes mistakes.', '认知与学术', '人人都会犯错。', {
            phrases: [{en:'make a mistake', zh:'犯错误'}, {en:'by mistake', zh:'错误地'}],
            
            extraExamples: [
              {en:'I made a mistake in my homework.', zh:'我作业里有个错误。'},
              {en:'Don\u2019t be afraid of making mistakes.', zh:'别害怕犯错。'},
            ],
          }),
          w('j7a1-11', 'country', '/ˈkʌntri/', 'n.', '国家', 'China is a big country.', '社会与环境', '中国是个大国。', {
            phrases: [{en:'a big/small country', zh:'大/小国'}, {en:'around the country', zh:'全国各地'}],
            
            extraExamples: [
              {en:'Japan is an island country.', zh:'日本是个岛国。'},
              {en:'He traveled around the country.', zh:'他周游全国。'},
            ],
          }),
          w('j7a1-12', 'same', '/seɪm/', 'adj.', '相同的', 'We are in the same class.', '品质与状态', '我们在同一个班。', {
            phrases: [{en:'the same as...', zh:'和……一样'}, {en:'the same age', zh:'同龄'}],
            
            extraExamples: [
              {en:'We are the same age.', zh:'我们同岁。'},
              {en:'She wears the same dress as me.', zh:'她穿的裙子和我的一样。'},
            ],
          }),
          w('j7a1-13', 'twin', '/twɪn/', 'n.', '双胞胎之一', 'They are twin sisters.', '社会与环境', '她们是双胞胎姐妹。', {
            phrases: [{en:'twin sisters/brothers', zh:'双胞胎姐妹/兄弟'}, {en:'a twin bed', zh:'一对单人床之一'}],
            
            extraExamples: [
              {en:'I have a twin brother.', zh:'我有个双胞胎哥哥。'},
              {en:'The twin girls look the same.', zh:'这对双胞胎女孩长得一模一样。'},
            ],
          }),
          w('j7a1-14', 'both', '/bəʊθ/', 'pron.', '两个；两个都', 'Both of us like music.', '认知与学术', '我们俩都喜欢音乐。', {
            phrases: [{en:'both of us', zh:'我们俩都'}, {en:'both...and...', zh:'……和……都'}],
            
            extraExamples: [
              {en:'Both my parents are teachers.', zh:'我父母都是老师。'},
              {en:'I like both English and math.', zh:'英语和数学我都喜欢。'},
            ],
          }),
          w('j7a1-15', 'band', '/bænd/', 'n.', '乐队', 'He plays in a band.', '社会与环境', '他在乐队演奏。', {
            phrases: [{en:'a rock band', zh:'摇滚乐队'}, {en:'play in a band', zh:'在乐队演奏'}],
            
            extraExamples: [
              {en:'She sings in a band.', zh:'她在乐队里唱歌。'},
              {en:'The band is playing tonight.', zh:'乐队今晚演出。'},
            ],
          }),
          w('j7a1-16', 'a lot', '/ə lɒt/', 'phr.', '很；非常', 'Thanks a lot.', '认知与学术', '非常感谢。', {
            phrases: [{en:'thanks a lot', zh:'非常感谢'}, {en:'a lot of...', zh:'许多……'}],
            
            extraExamples: [
              {en:'I like it a lot.', zh:'我非常喜欢它。'},
              {en:'There are a lot of books here.', zh:'这里有很多书。'},
            ],
          }),
          w('j7a1-17', 'guitar', '/ɡɪˈtɑː(r)/', 'n.', '吉他', 'She plays the guitar.', '社会与环境', '她弹吉他。', {
            phrases: [{en:'play the guitar', zh:'弹吉他'}, {en:'an acoustic guitar', zh:'原声吉他'}],
            
            extraExamples: [
              {en:'He plays the guitar in a band.', zh:'他在乐队弹吉他。'},
              {en:'I want to learn the guitar.', zh:'我想学吉他。'},
            ],
          }),
          w('j7a1-18', 'tennis', '/ˈtenɪs/', 'n.', '网球', 'We play tennis after school.', '社会与环境', '我们放学后打网球。', {
            phrases: [{en:'play tennis', zh:'打网球'}, {en:'a tennis court', zh:'网球场'}],
            
            extraExamples: [
              {en:'She is good at tennis.', zh:'她网球打得好。'},
              {en:'We play tennis every weekend.', zh:'我们每周末打网球。'},
            ],
          }),
          w('j7a1-19', 'post', '/pəʊst/', 'n.', '帖子；邮政 v. 邮寄', 'He posted a photo online.', '行为与动作', '他在网上发了张照片。', {
            phrases: [{en:'post a photo', zh:'发照片'}, {en:'by post', zh:'邮寄'}],
            
            extraExamples: [
              {en:'She posted a message online.', zh:'她在网上发了条消息。'},
              {en:'I sent the book by post.', zh:'我把书寄出去了。'},
            ],
          }),
          w('j7a1-20', 'even', '/ˈiːvn/', 'adv.', '甚至；连', 'Even a child knows that.', '认知与学术', '连小孩都知道。', {
            phrases: [{en:'even if/though', zh:'即使'}, {en:'even more', zh:'甚至更'}],
            
            extraExamples: [
              {en:'Even he can do it.', zh:'连他都会做。'},
              {en:'She works even on Sundays.', zh:'她甚至星期天都工作。'},
            ],
          }),
          w('j7a1-21', 'would', '/wʊd/', 'modal v.', '愿意；将会', 'Would you like some tea?', '情感与性格', '你想喝点茶吗？', {
            phrases: [{en:'would like to do', zh:'想要做某事'}, {en:'Would you like...?', zh:'你想要……吗？'}],
            
            extraExamples: [
              {en:'I would like a cup of coffee.', zh:'我想要一杯咖啡。'},
              {en:'Would you help me?', zh:'你能帮我吗？'},
            ],
          }),
          w('j7a1-22', 'information', '/ˌɪnfəˈmeɪʃn/', 'n.', '信息；消息', 'I look for information online.', '认知与学术', '我在网上找信息。', {
            phrases: [{en:'look for information', zh:'查找信息'}, {en:'information about...', zh:'关于……的信息'}],
            
            extraExamples: [
              {en:'I need more information.', zh:'我需要更多信息。'},
              {en:'The book has useful information.', zh:'这本书有有用的信息。'},
            ],
          }),
          w('j7a1-23', 'hobby', '/ˈhɒbi/', 'n.', '业余爱好', 'Reading is my hobby.', '认知与学术', '阅读是我的爱好。', {
            phrases: [{en:'my hobby is...', zh:'我的爱好是……'}, {en:'a hobby of mine', zh:'我的一个爱好'}],
            
            extraExamples: [
              {en:'Swimming is my favorite hobby.', zh:'游泳是我最喜欢的爱好。'},
              {en:'He has many hobbies.', zh:'他有很多爱好。'},
            ],
          }),
          w('j7a1-24', 'UK', '/ˌjuːˈkeɪ/', 'n.', '英国', 'He comes from the UK.', '社会与环境', '他来自英国。', {
            phrases: [{en:'the UK', zh:'英国'}, {en:'in the UK', zh:'在英国'}],
            
            extraExamples: [
              {en:'She studied in the UK for three years.', zh:'她在英国学习了三年。'},
              {en:'The UK is an island country.', zh:'英国是个岛国。'},
            ],
          }),
          w('j7a1-25', 'US', '/ˌjuːˈes/', 'n.', '美国', 'She lives in the US.', '社会与环境', '她住在美国。', {
            phrases: [{en:'the US', zh:'美国'}, {en:'in the US', zh:'在美国'}],
            
            extraExamples: [
              {en:'He was born in the US.', zh:'他出生在美国。'},
              {en:'The US is a big country.', zh:'美国是个大国。'},
            ],
          }),
          w('j7a1-26', 'Australia', '/ɒˈstreɪliə/', 'n.', '澳大利亚', 'Koalas live in Australia.', '社会与环境', '考拉生活在澳大利亚。', {
            phrases: [{en:'in Australia', zh:'在澳大利亚'}, {en:'from Australia', zh:'来自澳大利亚'}],
            
            extraExamples: [
              {en:'I want to visit Australia.', zh:'我想去澳大利亚旅游。'},
              {en:'Kangaroos live in Australia.', zh:'袋鼠生活在澳大利亚。'},
            ],
          }),
          w('j7a1-27', 'Singapore', '/ˌsɪŋgəˈpɔː(r)/', 'n.', '新加坡', 'Singapore is a clean city.', '社会与环境', '新加坡是个干净的城市。', {
            phrases: [{en:'in Singapore', zh:'在新加坡'}, {en:'Singapore is a city-state.', zh:'新加坡是个城市国家'}],
            
            extraExamples: [
              {en:'Singapore is very clean.', zh:'新加坡非常干净。'},
              {en:'He works in Singapore.', zh:'他在新加坡工作。'},
            ],
          }),
          w('j7a1-28', 'London', '/ˈlʌndən/', 'n.', '伦敦', 'London is the UK capital.', '社会与环境', '伦敦是英国首都。', {
            phrases: [{en:'London is the capital of the UK.', zh:'伦敦是英国首都'}, {en:'in London', zh:'在伦敦'}],
            
            extraExamples: [
              {en:'London is a big city.', zh:'伦敦是个大城市。'},
              {en:'I want to visit London.', zh:'我想去伦敦旅游。'},
            ],
          }),
          w('j7a1-29', 'mean', '/miːn/', 'v.', '意思是；打算', 'What does this word mean?', '认知与学术', '这个词是什么意思？', {
            phrases: [{en:'What do you mean?', zh:'你是什么意思？'}, {en:'mean to do sth.', zh:'打算做某事'}],
            
            extraExamples: [
              {en:'What does this word mean?', zh:'这个词是什么意思？'},
              {en:'I mean to go tomorrow.', zh:'我打算明天去。'},
            ],
          }),
          w('j7a1-30', 'husband', '/ˈhʌzbənd/', 'n.', '丈夫', 'Her husband is a doctor.', '社会与环境', '她丈夫是医生。', {
            phrases: [{en:'her husband', zh:'她的丈夫'}, {en:'husband and wife', zh:'夫妻'}],
            
            extraExamples: [
              {en:'Her husband is a teacher.', zh:'她丈夫是老师。'},
              {en:'They are husband and wife.', zh:'他们是夫妻。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 2 · We\'re Family!',
        words: [
          w('j7a2-1', 'bat', '/bæt/', 'n.', '球棒；球拍', 'He has a new bat.', '社会与环境', '他有一个新球拍。', {
            phrases: [{en:'a baseball bat', zh:'棒球棒'}, {en:'a table tennis bat', zh:'乒乓球拍'}],
            
            extraExamples: [
              {en:'He hit the ball with the bat.', zh:'他用球棒击球。'},
              {en:'I need a new tennis bat.', zh:'我需要一个新网球拍。'},
            ],
          }),
          w('j7a2-2', 'ping-pong bat', '/pɪŋ pɒŋ bæt/', 'phr.', '乒乓球拍', 'I need a new ping-pong bat.', '社会与环境', '我需要新乒乓球拍。', {
            phrases: [{en:'a ping-pong bat', zh:'乒乓球拍'}, {en:'play ping-pong', zh:'打乒乓球'}],
            
            extraExamples: [
              {en:'He bought a new ping-pong bat.', zh:'他买了个新乒乓球拍。'},
              {en:'We play ping-pong after class.', zh:'我们课后打乒乓球。'},
            ],
          }),
          w('j7a2-3', 'every day', '/ˈevri deɪ/', 'phr.', '每天', 'I read English every day.', '认知与学术', '我每天读英语。', {
            phrases: [{en:'every day', zh:'每天（作状语）'}, {en:'everyday life', zh:'日常生活（作形容词）'}],
            
            extraExamples: [
              {en:'I exercise every day.', zh:'我每天锻炼。'},
              {en:'Running is part of my everyday life.', zh:'跑步是我日常生活的一部分。'},
            ],
          }),
          w('j7a2-4', 'together', '/təˈɡeðə(r)/', 'adv.', '在一起；共同', 'We study together.', '认知与学术', '我们一起学习。', {
            phrases: [{en:'study together', zh:'一起学习'}, {en:'together with...', zh:'和……一起'}],
            
            extraExamples: [
              {en:'We live together.', zh:'我们住在一起。'},
              {en:'She travels together with her friends.', zh:'她和朋友一起旅行。'},
            ],
          }),
          w('j7a2-5', 'fishing rod', '/ˈfɪʃɪŋ rɒd/', 'n.', '钓竿', 'He bought a fishing rod.', '社会与环境', '他买了一根钓竿。', {
            phrases: [{en:'a fishing rod', zh:'一根钓竿'}, {en:'go fishing', zh:'去钓鱼'}],
            
            extraExamples: [
              {en:'He bought a new fishing rod.', zh:'他买了根新钓竿。'},
              {en:'My father likes fishing with his fishing rod.', zh:'我爸爸喜欢用他的钓竿钓鱼。'},
            ],
          }),
          w('j7a2-6', 'spend', '/spend/', 'v.', '花（时间、钱等）', 'I spend an hour reading.', '行为与动作', '我花一小时阅读。', {
            phrases: [{en:'spend time/money on sth.', zh:'在某事上花时间/钱'}, {en:'spend time (in) doing sth.', zh:'花时间做某事'}],
            
            extraExamples: [
              {en:'I spend two hours on homework.', zh:'我花两小时做作业。'},
              {en:'She spent 50 yuan on the book.', zh:'她花 50 元买了这本书。'},
            ],
          }),
          w('j7a2-7', 'a lot of', '/ə lɒt ɒv/', 'phr.', '大量；许多', 'We have a lot of books.', '认知与学术', '我们有很多书。', {
            phrases: [{en:'a lot of books/people', zh:'很多书/人'}, {en:'lots of...', zh:'许多……'}],
            
            extraExamples: [
              {en:'There are a lot of students in the playground.', zh:'操场上有很多学生。'},
              {en:'We have a lot of homework today.', zh:'我们今天有很多作业。'},
            ],
          }),
          w('j7a2-8', 'really', '/ˈriːəli/', 'adv.', '非常；确实；真正地', 'I really like it.', '认知与学术', '我真的很喜欢它。', {
            phrases: [{en:'really like', zh:'真的很喜欢'}, {en:'not really', zh:'不完全是；不见得'}],
            
            extraExamples: [
              {en:'I really want to go.', zh:'我真的很想去。'},
              {en:'It is really cold today.', zh:'今天真的很冷。'},
            ],
          }),
          w('j7a2-9', 'activity', '/ækˈtɪvəti/', 'n.', '活动', 'We have many after-school activities.', '社会与环境', '我们有很多课外活动。', {
            phrases: [{en:'after-school activities', zh:'课外活动'}, {en:'take part in an activity', zh:'参加活动'}],
            
            extraExamples: [
              {en:'We have many outdoor activities.', zh:'我们有很多户外活动。'},
              {en:'Reading is a useful activity.', zh:'阅读是有用的活动。'},
            ],
          }),
          w('j7a2-10', 'chess', '/tʃes/', 'n.', '国际象棋', 'He plays chess well.', '认知与学术', '他象棋下得好。', {
            phrases: [{en:'play chess', zh:'下国际象棋'}, {en:'a chess game', zh:'一局棋'}],
            
            extraExamples: [
              {en:'He likes playing chess.', zh:'他喜欢下象棋。'},
              {en:'They are playing chess.', zh:'他们在下象棋。'},
            ],
          }),
          w('j7a2-11', 'Chinese chess', '/tʃaɪˈniːz tʃes/', 'phr.', '中国象棋', 'Grandpa plays Chinese chess.', '社会与环境', '爷爷下中国象棋。', {
            phrases: [{en:'play Chinese chess', zh:'下中国象棋'}, {en:'Chinese chess board', zh:'中国象棋棋盘'}],
            
            extraExamples: [
              {en:'My grandpa plays Chinese chess every day.', zh:'我爷爷每天下中国象棋。'},
              {en:'Chinese chess is popular in China.', zh:'中国象棋在中国很流行。'},
            ],
          }),
          w('j7a2-12', 'funny', '/ˈfʌni/', 'adj.', '好笑的；奇怪的', 'The story is funny.', '情感与性格', '这个故事很好笑。', {
            phrases: [{en:'a funny story/joke', zh:'好笑的故事/笑话'}, {en:'feel funny', zh:'觉得奇怪'}],
            
            extraExamples: [
              {en:'He told a funny story.', zh:'他讲了个好笑的故事。'},
              {en:'The clown is very funny.', zh:'小丑很搞笑。'},
            ],
          }),
          w('j7a2-13', 'laugh', '/lɑːf/', 'v.', '笑；发笑', 'The joke makes me laugh.', '行为与动作', '这个笑话让我笑。', {
            phrases: [{en:'laugh at...', zh:'嘲笑……'}, {en:'laugh loudly', zh:'大声笑'}],
            
            extraExamples: [
              {en:'The joke made everyone laugh.', zh:'这个笑话让大家都笑了。'},
              {en:'Don\u2019t laugh at others.', zh:'不要嘲笑别人。'},
            ],
          }),
          w('j7a2-14', 'different', '/ˈdɪfrənt/', 'adj.', '不同的', 'We are in different classes.', '品质与状态', '我们在不同的班。', {
            phrases: [{en:'be different from...', zh:'与……不同'}, {en:'different kinds of...', zh:'不同种类的……'}],
            
            extraExamples: [
              {en:'We have different ideas.', zh:'我们有不同的想法。'},
              {en:'This book is different from that one.', zh:'这本书和那本不同。'},
            ],
          }),
          w('j7a2-15', 'violin', '/ˌvaɪəˈlɪn/', 'n.', '小提琴', 'She plays the violin.', '社会与环境', '她拉小提琴。', {
            phrases: [{en:'play the violin', zh:'拉小提琴'}, {en:'a violin lesson', zh:'小提琴课'}],
            
            extraExamples: [
              {en:'She practices the violin every day.', zh:'她每天练习小提琴。'},
              {en:'He plays the violin in an orchestra.', zh:'他在乐团拉小提琴。'},
            ],
          }),
          w('j7a2-16', 'have fun', '/hæv fʌn/', 'phr.', '玩得高兴', 'We have fun at the party.', '情感与性格', '我们在聚会上玩得开心。', {
            phrases: [{en:'have fun doing sth.', zh:'做某事很开心'}, {en:'Have fun!', zh:'玩得开心！'}],
            
            extraExamples: [
              {en:'We had fun at the park.', zh:'我们在公园玩得很开心。'},
              {en:'Have fun on your trip!', zh:'祝你旅途愉快！'},
            ],
          }),
          w('j7a2-17', 'pink', '/pɪŋk/', 'adj.', '粉红色的', 'She has a pink hat.', '品质与状态', '她有一顶粉色帽子。', {
            phrases: [{en:'a pink dress', zh:'粉色连衣裙'}, {en:'in pink', zh:'穿粉色衣服'}],
            
            extraExamples: [
              {en:'She likes pink.', zh:'她喜欢粉色。'},
              {en:'The flowers are pink.', zh:'花是粉色的。'},
            ],
          }),
          w('j7a2-18', 'hat', '/hæt/', 'n.', '帽子', 'He wears a blue hat.', '社会与环境', '他戴着蓝帽子。', {
            phrases: [{en:'wear a hat', zh:'戴帽子'}, {en:'a baseball cap', zh:'棒球帽'}],
            
            extraExamples: [
              {en:'He took off his hat.', zh:'他摘下帽子。'},
              {en:'She wears a red hat.', zh:'她戴着红帽子。'},
            ],
          }),
          w('j7a2-19', 'handsome', '/ˈhænsəm/', 'adj.', '英俊的', 'He is a handsome boy.', '情感与性格', '他是个英俊的男孩。', {
            phrases: [{en:'a handsome boy/man', zh:'英俊的男孩/男人'}, {en:'a handsome salary', zh:'可观的薪水'}],
            
            extraExamples: [
              {en:'He is a handsome young man.', zh:'他是个英俊的年轻人。'},
              {en:'What a handsome house!', zh:'多漂亮的房子啊！'},
            ],
          }),
          w('j7a2-20', 'knee', '/niː/', 'n.', '膝；膝盖', 'I hurt my knee.', '社会与环境', '我弄伤了膝盖。', {
            phrases: [{en:'hurt one\u2019s knee', zh:'伤到膝盖'}, {en:'on one\u2019s knees', zh:'跪着'}],
            
            extraExamples: [
              {en:'I fell and hurt my knee.', zh:'我摔倒伤到了膝盖。'},
              {en:'The baby is on its knees.', zh:'宝宝跪着。'},
            ],
          }),
          w('j7a2-21', 'at night', '/æt naɪt/', 'phr.', '在夜晚', 'We read at night.', '认知与学术', '我们在晚上读书。', {
            phrases: [{en:'at night', zh:'在晚上'}, {en:'good night', zh:'晚安'}],
            
            extraExamples: [
              {en:'I often read at night.', zh:'我经常在晚上读书。'},
              {en:'The stars come out at night.', zh:'星星晚上出来。'},
            ],
          }),
          w('j7a2-22', 'in the middle', '/ɪn ðə ˈmɪdl/', 'phr.', '在中间', 'The table is in the middle.', '社会与环境', '桌子在中间。', {
            phrases: [{en:'in the middle of...', zh:'在……中间'}, {en:'the middle of the road', zh:'路中间'}],
            
            extraExamples: [
              {en:'There is a table in the middle of the room.', zh:'房间中间有张桌子。'},
              {en:'He stopped in the middle of the road.', zh:'他在路中间停了下来。'},
            ],
          }),
          w('j7a2-23', 'grandchild', '/ˈɡræntʃaɪld/', 'n.', '（外）孙子；（外）孙女', 'They love their grandchild.', '社会与环境', '他们疼爱孙子。', {
            phrases: [{en:'their grandchild', zh:'他们的孙子/孙女'}, {en:'grandchildren (复数)', zh:'孙子孙女们'}],
            
            extraExamples: [
              {en:'They have three grandchildren.', zh:'他们有三个孙子孙女。'},
              {en:'The grandparents love their grandchild.', zh:'祖父母疼爱孙子。'},
            ],
          }),
          w('j7a2-24', 'son', '/sʌn/', 'n.', '儿子', 'Their son is ten.', '社会与环境', '他们的儿子十岁。', {
            phrases: [{en:'their son', zh:'他们的儿子'}, {en:'son and heir', zh:'子嗣继承人'}],
            
            extraExamples: [
              {en:'They have one son and two daughters.', zh:'他们有一个儿子和两个女儿。'},
              {en:'Her son is a doctor.', zh:'她儿子是医生。'},
            ],
          }),
          w('j7a2-25', 'next to', '/nekst tuː/', 'phr.', '紧邻；在……近旁', 'The shop is next to the school.', '社会与环境', '商店紧挨着学校。', {
            phrases: [{en:'next to...', zh:'紧邻……'}, {en:'the next room', zh:'隔壁房间'}],
            
            extraExamples: [
              {en:'The bank is next to the post office.', zh:'银行紧挨着邮局。'},
              {en:'Sit next to me.', zh:'坐我旁边。'},
            ],
          }),
          w('j7a2-26', 'hike', '/haɪk/', 'v.', '远足；徒步旅行', 'We hike on weekends.', '行为与动作', '我们周末远足。', {
            phrases: [{en:'go hiking', zh:'去远足'}, {en:'a long hike', zh:'长途徒步'}],
            
            extraExamples: [
              {en:'We hiked up the mountain.', zh:'我们徒步爬上了山。'},
              {en:'They hiked for five hours.', zh:'他们徒步走了五个小时。'},
            ],
          }),
          w('j7a2-27', 'go hiking', '/ɡəʊ ˈhaɪkɪŋ/', 'phr.', '去远足', 'We go hiking in autumn.', '行为与动作', '我们秋天去远足。', {
            phrases: [{en:'go hiking', zh:'去远足'}, {en:'go shopping/swimming', zh:'去购物/游泳'}],
            
            extraExamples: [
              {en:'We often go hiking on weekends.', zh:'我们周末经常去远足。'},
              {en:'They went hiking in the mountains.', zh:'他们去山里远足了。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 3 · My School',
        words: [
          w('j7a3-1', 'hall', '/hɔːl/', 'n.', '礼堂；大厅', 'We meet in the school hall.', '社会与环境', '我们在学校礼堂集合。', {
            phrases: [{en:'the school hall', zh:'学校礼堂'}, {en:'a concert hall', zh:'音乐厅'}],
            
            extraExamples: [
              {en:'The meeting is in the school hall.', zh:'会议在学校礼堂举行。'},
              {en:'We had dinner in the dining hall.', zh:'我们在餐厅吃了晚饭。'},
            ],
          }),
          w('j7a3-2', 'dining hall', '/ˈdaɪnɪŋ hɔːl/', 'n.', '餐厅；食堂', 'We have lunch in the dining hall.', '社会与环境', '我们在食堂吃午饭。', {
            phrases: [{en:'in the dining hall', zh:'在食堂'}, {en:'the school dining hall', zh:'学校食堂'}],
            
            extraExamples: [
              {en:'We eat lunch in the dining hall.', zh:'我们在食堂吃午饭。'},
              {en:'The dining hall is very clean.', zh:'食堂很干净。'},
            ],
          }),
          w('j7a3-3', 'in front of', '/ɪn frʌnt ɒv/', 'phr.', '在……前面', 'There is a tree in front of the classroom.', '社会与环境', '教室前面有一棵树。', {
            phrases: [{en:'in front of the classroom', zh:'在教室前面'}, {en:'in the front of...', zh:'在……（内部的）前部'}],
            
            extraExamples: [
              {en:'There is a tree in front of the house.', zh:'房子前面有一棵树。'},
              {en:'He sits in the front of the classroom.', zh:'他坐在教室前排。'},
            ],
          }),
          w('j7a3-4', 'building', '/ˈbɪldɪŋ/', 'n.', '建筑物；楼房', 'Our classroom building is new.', '社会与环境', '我们的教学楼很新。', {
            phrases: [{en:'a tall building', zh:'高楼'}, {en:'a classroom building', zh:'教学楼'}],
            
            extraExamples: [
              {en:'There are many tall buildings here.', zh:'这里有很多高楼。'},
              {en:'Our library is a new building.', zh:'我们的图书馆是栋新楼。'},
            ],
          }),
          w('j7a3-5', 'across', '/əˈkrɒs/', 'prep.', '过；穿过', 'Walk across the bridge.', '行为与动作', '走过桥。', {
            phrases: [{en:'walk across the bridge', zh:'走过桥'}, {en:'go across the street', zh:'过马路'}],
            
            extraExamples: [
              {en:'Walk across the road carefully.', zh:'小心过马路。'},
              {en:'The boy ran across the field.', zh:'男孩跑过田野。'},
            ],
          }),
          w('j7a3-6', 'across from', '/əˈkrɒs frɒm/', 'phr.', '在……对面', 'The library is across from the office.', '社会与环境', '图书馆在办公室对面。', {
            phrases: [{en:'across from the school', zh:'在学校对面'}, {en:'across from the park', zh:'在公园对面'}],
            
            extraExamples: [
              {en:'The bank is across from the hospital.', zh:'银行在医院对面。'},
              {en:'Our house is across from the park.', zh:'我家在公园对面。'},
            ],
          }),
          w('j7a3-7', 'field', '/fiːld/', 'n.', '场地；田地', 'We play on the field.', '社会与环境', '我们在场地玩。', {
            phrases: [{en:'on the field', zh:'在场地上'}, {en:'a football field', zh:'足球场'}],
            
            extraExamples: [
              {en:'The students are playing on the field.', zh:'学生们在操场上玩。'},
              {en:'There are cows in the field.', zh:'田里有牛。'},
            ],
          }),
          w('j7a3-8', 'sports field', '/spɔːts fiːld/', 'n.', '运动场', 'We run on the sports field.', '社会与环境', '我们在运动场跑步。', {
            phrases: [{en:'on the sports field', zh:'在运动场上'}, {en:'a school sports field', zh:'学校运动场'}],
            
            extraExamples: [
              {en:'We have PE on the sports field.', zh:'我们在运动场上体育课。'},
              {en:'The sports field is very big.', zh:'运动场很大。'},
            ],
          }),
          w('j7a3-9', 'gym', '/dʒɪm/', 'n.', '体育馆；健身房', 'We play basketball in the gym.', '社会与环境', '我们在体育馆打篮球。', {
            phrases: [{en:'in the gym', zh:'在体育馆'}, {en:'go to the gym', zh:'去健身房'}],
            
            extraExamples: [
              {en:'We play basketball in the gym.', zh:'我们在体育馆打篮球。'},
              {en:'He goes to the gym every day.', zh:'他每天去健身房。'},
            ],
          }),
          w('j7a3-10', 'office', '/ˈɒfɪs/', 'n.', '办公室', 'The teachers\u2019 office is on the second floor.', '社会与环境', '教师办公室在二楼。', {
            phrases: [{en:'the teachers\u2019 office', zh:'教师办公室'}, {en:'an office worker', zh:'上班族'}],
            
            extraExamples: [
              {en:'The teachers are in the office.', zh:'老师们在办公室。'},
              {en:'My father works in an office.', zh:'我爸爸在办公室工作。'},
            ],
          }),
          w('j7a3-11', 'large', '/lɑːdʒ/', 'adj.', '大的；大号的', 'Our school has a large playground.', '品质与状态', '我们学校有个大操场。', {
            phrases: [{en:'a large playground', zh:'大操场'}, {en:'a large number of...', zh:'大量……'}],
            
            extraExamples: [
              {en:'China is a large country.', zh:'中国是个大国。'},
              {en:'We live in a large house.', zh:'我们住在大房子里。'},
            ],
          }),
          w('j7a3-12', 'special', '/ˈspeʃl/', 'adj.', '特别的；特殊的', 'Today is a special day.', '品质与状态', '今天是个特别的日子。', {
            phrases: [{en:'a special day', zh:'特别的日子'}, {en:'something special', zh:'特别的东西'}],
            
            extraExamples: [
              {en:'Today is a special day for me.', zh:'今天对我来说是特别的日子。'},
              {en:'Is there anything special?', zh:'有什么特别的吗？'},
            ],
          }),
          w('j7a3-13', 'smart', '/smɑːt/', 'adj.', '智能的；聪明的', 'We have a smart board.', '品质与状态', '我们有智能白板。', {
            phrases: [{en:'a smart board/phone', zh:'智能白板/手机'}, {en:'a smart student', zh:'聪明的学生'}],
            
            extraExamples: [
              {en:'She is a smart student.', zh:'她是个聪明的学生。'},
              {en:'I have a new smart phone.', zh:'我有一部新智能手机。'},
            ],
          }),
          w('j7a3-14', 'whiteboard', '/ˈwaɪtbɔːd/', 'n.', '白板；白色书写板', 'The teacher writes on the whiteboard.', '社会与环境', '老师在白板上写字。', {
            phrases: [{en:'on the whiteboard', zh:'在白板上'}, {en:'write on the whiteboard', zh:'在白板上写字'}],
            
            extraExamples: [
              {en:'The teacher writes words on the whiteboard.', zh:'老师在白板上写单词。'},
              {en:'There is a big whiteboard in the classroom.', zh:'教室里有个大白板。'},
            ],
          }),
          w('j7a3-15', 'put up', '/pʊt ʌp/', 'phr.', '张贴；搭建', 'Put up the poster on the wall.', '行为与动作', '把海报贴在墙上。', {
            phrases: [{en:'put up a poster', zh:'张贴海报'}, {en:'put up a tent', zh:'搭帐篷'}],
            
            extraExamples: [
              {en:'We put up some pictures on the wall.', zh:'我们在墙上贴了些画。'},
              {en:'They put up a tent in the field.', zh:'他们在田野里搭了帐篷。'},
            ],
          }),
          w('j7a3-16', 'important', '/ɪmˈpɔːtnt/', 'adj.', '重要的', 'English is very important.', '品质与状态', '英语很重要。', {
            phrases: [{en:'be important to...', zh:'对……很重要'}, {en:'an important meeting', zh:'重要会议'}],
            
            extraExamples: [
              {en:'Health is very important.', zh:'健康很重要。'},
              {en:'It is important to learn English well.', zh:'学好英语很重要。'},
            ],
          }),
          w('j7a3-17', 'notice', '/ˈnəʊtɪs/', 'n.', '通知；注意 v. 注意到', 'I read the notice on the wall.', '认知与学术', '我看了墙上的通知。', {
            phrases: [{en:'put up a notice', zh:'张贴通知'}, {en:'notice sb. do sth.', zh:'注意到某人做某事'}],
            
            extraExamples: [
              {en:'I read the notice on the wall.', zh:'我看了墙上的通知。'},
              {en:'Did you notice the man?', zh:'你注意到那个人了吗？'},
            ],
          }),
          w('j7a3-18', 'locker', '/ˈlɒkə(r)/', 'n.', '有锁存物柜；寄物柜', 'I put my books in the locker.', '社会与环境', '我把书放进储物柜。', {
            phrases: [{en:'in the locker', zh:'在储物柜里'}, {en:'a locker room', zh:'更衣室'}],
            
            extraExamples: [
              {en:'I put my coat in the locker.', zh:'我把外套放进储物柜。'},
              {en:'Each student has a locker.', zh:'每个学生都有一个储物柜。'},
            ],
          }),
          w('j7a3-19', 'drawer', '/drɔː(r)/', 'n.', '抽屉', 'Put the pen in the drawer.', '社会与环境', '把笔放进抽屉。', {
            phrases: [{en:'in the drawer', zh:'在抽屉里'}, {en:'open/close the drawer', zh:'打开/关上抽屉'}],
            
            extraExamples: [
              {en:'Put the keys in the drawer.', zh:'把钥匙放进抽屉。'},
              {en:'He opened the drawer and took out a book.', zh:'他打开抽屉拿出一本书。'},
            ],
          }),
          w('j7a3-20', 'at the back of', '/æt ðə bæk ɒv/', 'phr.', '在……后面', 'Sit at the back of the classroom.', '社会与环境', '坐在教室后面。', {
            phrases: [{en:'at the back of the classroom', zh:'在教室后面'}, {en:'in the back of...', zh:'在……后部'}],
            
            extraExamples: [
              {en:'Sit at the back of the room.', zh:'坐在房间后面。'},
              {en:'There is a blackboard at the back of the classroom.', zh:'教室后面有块黑板。'},
            ],
          }),
          w('j7a3-21', 'corner', '/ˈkɔːnə(r)/', 'n.', '角；墙角；街角', 'The desk is in the corner.', '社会与环境', '桌子在角落里。', {
            phrases: [{en:'in the corner', zh:'在角落里'}, {en:'at the corner of the street', zh:'在街角'}],
            
            extraExamples: [
              {en:'The desk is in the corner of the room.', zh:'桌子在房间角落里。'},
              {en:'There is a shop at the corner.', zh:'街角有家商店。'},
            ],
          }),
          w('j7a3-22', 'bookcase', '/ˈbʊkkeɪs/', 'n.', '书架；书柜', 'There are many books in the bookcase.', '社会与环境', '书柜里有很多书。', {
            phrases: [{en:'in the bookcase', zh:'在书柜里'}, {en:'a tall bookcase', zh:'高书柜'}],
            
            extraExamples: [
              {en:'There are many books in the bookcase.', zh:'书柜里有很多书。'},
              {en:'He put the book on the bookcase.', zh:'他把书放在书柜上。'},
            ],
          }),
          w('j7a3-23', 'screen', '/skriːn/', 'n.', '屏幕；银幕', 'The screen is big.', '社会与环境', '屏幕很大。', {
            phrases: [{en:'a big screen', zh:'大屏幕'}, {en:'on the screen', zh:'在屏幕上'}],
            
            extraExamples: [
              {en:'The screen of the computer is big.', zh:'电脑屏幕很大。'},
              {en:'The movie is on the screen.', zh:'电影在银幕上。'},
            ],
          }),
          w('j7a3-24', 'modern', '/ˈmɒdn/', 'adj.', '现代的；当代的', 'There are many modern buildings.', '品质与状态', '有很多现代建筑。', {
            phrases: [{en:'modern buildings', zh:'现代建筑'}, {en:'modern life', zh:'现代生活'}],
            
            extraExamples: [
              {en:'This is a modern city.', zh:'这是一座现代化城市。'},
              {en:'I like modern music.', zh:'我喜欢现代音乐。'},
            ],
          }),
          w('j7a3-25', 'amazing', '/əˈmeɪzɪŋ/', 'adj.', '令人惊奇的', 'The school looks amazing.', '情感与性格', '这所学校看起来真棒。', {
            phrases: [{en:'an amazing story', zh:'令人惊奇的故事'}, {en:'look amazing', zh:'看起来很棒'}],
            
            extraExamples: [
              {en:'The view is amazing.', zh:'景色令人惊叹。'},
              {en:'She has an amazing voice.', zh:'她的嗓音很棒。'},
            ],
          }),
          w('j7a3-26', 'raise', '/reɪz/', 'v.', '使升高；提高；举起', 'We raise the flag on Monday.', '行为与动作', '我们周一升国旗。', {
            phrases: [{en:'raise the flag', zh:'升国旗'}, {en:'raise one\u2019s hand', zh:'举手'}],
            
            extraExamples: [
              {en:'Raise your hand if you know the answer.', zh:'知道答案请举手。'},
              {en:'We raise the flag every Monday.', zh:'我们每周一升国旗。'},
            ],
          }),
          w('j7a3-27', 'flag', '/flæɡ/', 'n.', '旗；旗帜', 'The flag is flying.', '社会与环境', '国旗在飘扬。', {
            phrases: [{en:'the national flag', zh:'国旗'}, {en:'raise the flag', zh:'升国旗'}],
            
            extraExamples: [
              {en:'The Chinese flag is red.', zh:'中国国旗是红色的。'},
              {en:'The flag is flying in the wind.', zh:'旗帜在风中飘扬。'},
            ],
          }),
          w('j7a3-28', 'seat', '/siːt/', 'n.', '座位', 'Please take your seat.', '社会与环境', '请就座。', {
            phrases: [{en:'take a seat', zh:'坐下'}, {en:'take your seat', zh:'就座'}],
            
            extraExamples: [
              {en:'Please take a seat.', zh:'请坐。'},
              {en:'This is my seat.', zh:'这是我的座位。'},
            ],
          }),
          w('j7a3-29', 'similar', '/ˈsɪmələ(r)/', 'adj.', '类似的；相像的', 'Our school is similar to yours.', '品质与状态', '我们学校和你们的很像。', {
            phrases: [{en:'be similar to...', zh:'与……相似'}, {en:'similar interests', zh:'相似的兴趣'}],
            
            extraExamples: [
              {en:'Our houses are similar.', zh:'我们的房子很像。'},
              {en:'Your idea is similar to mine.', zh:'你的想法和我的相似。'},
            ],
          }),
          w('j7a3-30', 'sound', '/saʊnd/', 'v.', '听起来 n. 声音', 'Your idea sounds great.', '行为与动作', '你的主意听起来很棒。', {
            phrases: [{en:'sound great/nice', zh:'听起来很棒/不错'}, {en:'the sound of music', zh:'音乐声'}],
            
            extraExamples: [
              {en:'Your idea sounds great.', zh:'你的主意听起来很棒。'},
              {en:'I heard a strange sound.', zh:'我听到一个奇怪的声音。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 4 · My Favourite Subject',
        words: [
          w('j7a4-1', 'biology', '/baɪˈɒlədʒi/', 'n.', '生物学', 'Biology is my favourite subject.', '认知与学术', '生物是我最喜欢的科目。', {
            phrases: [{en:'a biology class', zh:'生物课'}, {en:'study biology', zh:'学生物'}],
            
            extraExamples: [
              {en:'Biology is my favourite subject.', zh:'生物是我最喜欢的科目。'},
              {en:'We learn about plants in biology.', zh:'生物课上我们学植物。'},
            ],
          }),
          w('j7a4-2', 'IT', '/ˌaɪˈtiː/', 'n.', '信息技术', 'We type in the IT class.', '认知与学术', '我们在信息课打字。', {
            phrases: [{en:'an IT class', zh:'信息课'}, {en:'IT teacher', zh:'信息技术老师'}],
            
            extraExamples: [
              {en:'We have IT class on Wednesday.', zh:'我们周三有信息课。'},
              {en:'I like IT class very much.', zh:'我非常喜欢信息课。'},
            ],
          }),
          w('j7a4-3', 'geography', '/dʒiˈɒɡrəfi/', 'n.', '地理（学）', 'We learn about cities in geography.', '认知与学术', '地理课上我们学城市。', {
            phrases: [{en:'a geography class', zh:'地理课'}, {en:'study geography', zh:'学地理'}],
            
            extraExamples: [
              {en:'Geography is interesting.', zh:'地理很有趣。'},
              {en:'We learn about countries in geography.', zh:'地理课上我们学各国。'},
            ],
          }),
          w('j7a4-4', 'history', '/ˈhɪstri/', 'n.', '历史；历史课', 'History tells us about the past.', '认知与学术', '历史告诉我们过去。', {
            phrases: [{en:'a history book', zh:'历史书'}, {en:'in history', zh:'在历史上'}],
            
            extraExamples: [
              {en:'History is my favourite subject.', zh:'历史是我最喜欢的科目。'},
              {en:'We learn about old China in history.', zh:'历史课上我们学古代中国。'},
            ],
          }),
          w('j7a4-5', 'boring', '/ˈbɔːrɪŋ/', 'adj.', '乏味的；令人生厌的', 'The movie is boring.', '品质与状态', '这部电影很无聊。', {
            phrases: [{en:'a boring movie/book', zh:'无聊的电影/书'}, {en:'be boring', zh:'很无聊'}],
            
            extraExamples: [
              {en:'The movie is boring.', zh:'这部电影很无聊。'},
              {en:'The lesson was boring.', zh:'这节课很无聊。'},
            ],
          }),
          w('j7a4-6', 'useful', '/ˈjuːsfl/', 'adj.', '有用的；有益的', 'The book is very useful.', '品质与状态', '这本书很有用。', {
            phrases: [{en:'be useful for...', zh:'对……有用'}, {en:'a useful book', zh:'有用的书'}],
            
            extraExamples: [
              {en:'This book is very useful.', zh:'这本书很有用。'},
              {en:'The Internet is useful for study.', zh:'互联网对学习很有用。'},
            ],
          }),
          w('j7a4-7', 'exciting', '/ɪkˈsaɪtɪŋ/', 'adj.', '令人激动的；使人兴奋的', 'The game is exciting.', '情感与性格', '这场比赛很激动人心。', {
            phrases: [{en:'an exciting game/movie', zh:'激动人心的比赛/电影'}, {en:'be exciting', zh:'令人激动'}],
            
            extraExamples: [
              {en:'The game is very exciting.', zh:'这场比赛很激动人心。'},
              {en:'I had an exciting trip.', zh:'我经历了一次激动人心的旅行。'},
            ],
          }),
          w('j7a4-8', 'past', '/pɑːst/', 'n.', '过去 adj. 过去的', 'In the past, there was no library.', '认知与学术', '过去这里没有图书馆。', {
            phrases: [{en:'in the past', zh:'在过去'}, {en:'the past few years', zh:'过去几年'}],
            
            extraExamples: [
              {en:'In the past, people walked to work.', zh:'过去人们走路上班。'},
              {en:'He has been to many places in the past.', zh:'他过去去过很多地方。'},
            ],
          }),
          w('j7a4-9', 'number', '/ˈnʌmbə(r)/', 'n.', '数字；号码', 'Write your phone number.', '认知与学术', '写下你的电话号码。', {
            phrases: [{en:'phone number', zh:'电话号码'}, {en:'a number of...', zh:'许多……'}],
            
            extraExamples: [
              {en:'What is your phone number?', zh:'你的电话号码是多少？'},
              {en:'I don\u2019t know the number.', zh:'我不知道号码。'},
            ],
          }),
          w('j7a4-10', 'reason', '/ˈriːzn/', 'n.', '原因；理由', 'Tell me the reason.', '认知与学术', '告诉我原因。', {
            phrases: [{en:'the reason for...', zh:'……的原因'}, {en:'the reason why...', zh:'……的理由'}],
            
            extraExamples: [
              {en:'Tell me the reason why you are late.', zh:'告诉我你迟到的原因。'},
              {en:'There is no reason to be afraid.', zh:'没有理由害怕。'},
            ],
          }),
          w('j7a4-11', 'listen to', '/ˈlɪsn tuː/', 'phr.', '听；倾听', 'Listen to the teacher.', '行为与动作', '听老师讲。', {
            phrases: [{en:'listen to the teacher', zh:'听老师讲'}, {en:'listen to music', zh:'听音乐'}],
            
            extraExamples: [
              {en:'Listen to me carefully.', zh:'仔细听我说。'},
              {en:'I like listening to music.', zh:'我喜欢听音乐。'},
            ],
          }),
          w('j7a4-12', 'remember', '/rɪˈmembə(r)/', 'v.', '记住；记起', 'Remember the new words.', '认知与学术', '记住新单词。', {
            phrases: [{en:'remember to do sth.', zh:'记得去做某事'}, {en:'remember doing sth.', zh:'记得做过某事'}],
            
            extraExamples: [
              {en:'Remember to close the door.', zh:'记得关门。'},
              {en:'I remember her name.', zh:'我记得她的名字。'},
            ],
          }),
          w('j7a4-13', 'as', '/æz/', 'prep.', '如同；作为 conj. 当……时', 'He works as a teacher.', '认知与学术', '他当老师。', {
            phrases: [{en:'work as...', zh:'担任……工作'}, {en:'as well as', zh:'和……一样好'}],
            
            extraExamples: [
              {en:'He works as a doctor.', zh:'他当医生。'},
              {en:'As a student, I should study hard.', zh:'作为学生，我应该努力学习。'},
            ],
          }),
          w('j7a4-14', 'French', '/frentʃ/', 'n.', '法语 adj. 法国的', 'He can speak French.', '认知与学术', '他会说法语。', {
            phrases: [{en:'speak French', zh:'说法语'}, {en:'French food', zh:'法国菜'}],
            
            extraExamples: [
              {en:'She can speak French.', zh:'她会说法语。'},
              {en:'I like French food.', zh:'我喜欢法国菜。'},
            ],
          }),
          w('j7a4-15', 'excellent', '/ˈeksələnt/', 'adj.', '优秀的；极好的', 'She is an excellent student.', '品质与状态', '她是个优秀学生。', {
            phrases: [{en:'an excellent student', zh:'优秀学生'}, {en:'excellent work', zh:'出色的工作'}],
            
            extraExamples: [
              {en:'She is an excellent student.', zh:'她是个优秀学生。'},
              {en:'Your English is excellent.', zh:'你的英语很棒。'},
            ],
          }),
          w('j7a4-16', 'instrument', '/ˈɪnstrəmənt/', 'n.', '器械；工具；乐器', 'A piano is a musical instrument.', '社会与环境', '钢琴是乐器。', {
            phrases: [{en:'a musical instrument', zh:'乐器'}, {en:'play an instrument', zh:'演奏乐器'}],
            
            extraExamples: [
              {en:'A piano is a musical instrument.', zh:'钢琴是乐器。'},
              {en:'Can you play any instrument?', zh:'你会演奏乐器吗？'},
            ],
          }),
          w('j7a4-17', 'singer', '/ˈsɪŋə(r)/', 'n.', '歌手', 'She wants to be a singer.', '社会与环境', '她想当歌手。', {
            phrases: [{en:'a famous singer', zh:'著名歌手'}, {en:'want to be a singer', zh:'想当歌手'}],
            
            extraExamples: [
              {en:'She is a famous singer.', zh:'她是著名歌手。'},
              {en:'I want to be a singer.', zh:'我想当歌手。'},
            ],
          }),
          w('j7a4-18', 'future', '/ˈfjuːtʃə(r)/', 'n.', '将来；未来', 'I want to be a doctor in the future.', '认知与学术', '我将来想当医生。', {
            phrases: [{en:'in the future', zh:'在将来'}, {en:'in the near future', zh:'在不久的将来'}],
            
            extraExamples: [
              {en:'I want to be a doctor in the future.', zh:'我将来想当医生。'},
              {en:'What do you want to do in the future?', zh:'你将来想做什么？'},
            ],
          }),
          w('j7a4-19', 'term', '/tɜːm/', 'n.', '学期', 'This term we have a new teacher.', '认知与学术', '这学期我们有位新老师。', {
            phrases: [{en:'this term', zh:'这学期'}, {en:'next term', zh:'下学期'}],
            
            extraExamples: [
              {en:'This term we have a new English teacher.', zh:'这学期我们有位新英语老师。'},
              {en:'I will study hard next term.', zh:'下学期我要努力学习。'},
            ],
          }),
          w('j7a4-20', 'problem', '/ˈprɒbləm/', 'n.', '难题；困难', 'We can solve the problem.', '认知与学术', '我们能解决这个问题。', {
            phrases: [{en:'solve a problem', zh:'解决问题'}, {en:'no problem', zh:'没问题'}],
            
            extraExamples: [
              {en:'We can solve the problem.', zh:'我们能解决这个问题。'},
              {en:'No problem!', zh:'没问题！'},
            ],
          }),
          w('j7a4-21', 'magic', '/ˈmædʒɪk/', 'n.', '魔法 adj. 有魔力的', 'The story is full of magic.', '认知与学术', '这个故事充满魔法。', {
            phrases: [{en:'full of magic', zh:'充满魔法'}, {en:'a magic show', zh:'魔术表演'}],
            
            extraExamples: [
              {en:'The story is full of magic.', zh:'这个故事充满魔法。'},
              {en:'Do you believe in magic?', zh:'你相信魔法吗？'},
            ],
          }),
          w('j7a4-22', 'life', '/laɪf/', 'n.', '生活；生命', 'School life is happy.', '社会与环境', '校园生活很快乐。', {
            phrases: [{en:'school life', zh:'校园生活'}, {en:'everyday life', zh:'日常生活'}],
            
            extraExamples: [
              {en:'School life is interesting.', zh:'校园生活很有趣。'},
              {en:'There are many forms of life on Earth.', zh:'地球上有多种生命形式。'},
            ],
          }),
          w('j7a4-23', 'scientist', '/ˈsaɪəntɪst/', 'n.', '科学家', 'I want to be a scientist.', '社会与环境', '我想当科学家。', {
            phrases: [{en:'a famous scientist', zh:'著名科学家'}, {en:'want to be a scientist', zh:'想当科学家'}],
            
            extraExamples: [
              {en:'I want to be a scientist.', zh:'我想当科学家。'},
              {en:'Einstein was a great scientist.', zh:'爱因斯坦是伟大的科学家。'},
            ],
          }),
          w('j7a4-24', 'Canada', '/ˈkænədə/', 'n.', '加拿大', 'He comes from Canada.', '社会与环境', '他来自加拿大。', {
            phrases: [{en:'from Canada', zh:'来自加拿大'}, {en:'in Canada', zh:'在加拿大'}],
            
            extraExamples: [
              {en:'He comes from Canada.', zh:'他来自加拿大。'},
              {en:'Canada is a big country.', zh:'加拿大是个大国。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 5 · Fun Clubs',
        words: [
          w('j7a5-1', 'club', '/klʌb/', 'n.', '俱乐部；社团', 'I join the art club.', '社会与环境', '我加入了美术社。', {
            phrases: [{en:'join a club', zh:'加入社团'}, {en:'the art club', zh:'美术社'}],
            
            extraExamples: [
              {en:'I want to join the music club.', zh:'我想加入音乐社。'},
              {en:'There are many clubs in our school.', zh:'我们学校有很多社团。'},
            ],
          }),
          w('j7a5-2', 'join', '/dʒɔɪn/', 'v.', '参加；加入', 'Come and join us!', '行为与动作', '来加入我们吧！', {
            phrases: [{en:'join the club', zh:'加入社团'}, {en:'join us', zh:'加入我们'}],
            
            extraExamples: [
              {en:'Come and join us!', zh:'来加入我们吧！'},
              {en:'He joined the army last year.', zh:'他去年参军了。'},
            ],
          }),
          w('j7a5-3', 'choose', '/tʃuːz/', 'v.', '选择；挑选', 'You can choose a club you like.', '行为与动作', '你可以选喜欢的社团。', {
            phrases: [{en:'choose sth.', zh:'选择某物'}, {en:'choose to do sth.', zh:'选择做某事'}],
            
            extraExamples: [
              {en:'You can choose a book you like.', zh:'你可以选一本喜欢的书。'},
              {en:'Choose the best answer.', zh:'选择最佳答案。'},
            ],
          }),
          w('j7a5-4', 'drama', '/ˈdrɑːmə/', 'n.', '戏剧；戏剧表演', 'We act in a drama club.', '认知与学术', '我们在戏剧社演出。', {
            phrases: [{en:'a drama club', zh:'戏剧社'}, {en:'a TV drama', zh:'电视剧'}],
            
            extraExamples: [
              {en:'We act in a drama club.', zh:'我们在戏剧社演出。'},
              {en:'I like watching TV dramas.', zh:'我喜欢看电视剧。'},
            ],
          }),
          w('j7a5-5', 'feeling', '/ˈfiːlɪŋ/', 'n.', '感觉；情感', 'Read with feeling.', '情感与性格', '带着感情朗读。', {
            phrases: [{en:'a feeling of...', zh:'一种……的感觉'}, {en:'with feeling', zh:'带着感情'}],
            
            extraExamples: [
              {en:'I have a feeling of happiness.', zh:'我有一种幸福感。'},
              {en:'Read the poem with feeling.', zh:'带着感情读这首诗。'},
            ],
          }),
          w('j7a5-6', 'news', '/njuːz/', 'n.', '消息；新闻', 'I watch the news every day.', '认知与学术', '我每天看新闻。', {
            phrases: [{en:'watch the news', zh:'看新闻'}, {en:'a piece of news', zh:'一条消息'}],
            
            extraExamples: [
              {en:'I watch the news every evening.', zh:'我每天晚上看新闻。'},
              {en:'Good news! You won the prize.', zh:'好消息！你获奖了。'},
            ],
          }),
          w('j7a5-7', 'musical', '/ˈmjuːzɪkl/', 'adj.', '音乐的；有音乐天赋的', 'She has musical talent.', '品质与状态', '她有音乐天赋。', {
            phrases: [{en:'musical talent', zh:'音乐天赋'}, {en:'a musical instrument', zh:'乐器'}],
            
            extraExamples: [
              {en:'She has musical talent.', zh:'她有音乐天赋。'},
              {en:'He comes from a musical family.', zh:'他出身音乐世家。'},
            ],
          }),
          w('j7a5-8', 'exactly', '/ɪɡˈzæktli/', 'adv.', '正是如此；准确地', 'Exactly! You are right.', '认知与学术', '正是！你说得对。', {
            phrases: [{en:'exactly right', zh:'完全正确'}, {en:'not exactly', zh:'不完全是'}],
            
            extraExamples: [
              {en:'Exactly! You are right.', zh:'正是！你说得对。'},
              {en:'Tell me exactly what happened.', zh:'告诉我到底发生了什么。'},
            ],
          }),
          w('j7a5-9', 'drum', '/drʌm/', 'n.', '鼓', 'He plays the drum.', '社会与环境', '他打鼓。', {
            phrases: [{en:'play the drum', zh:'打鼓'}, {en:'a drum player', zh:'鼓手'}],
            
            extraExamples: [
              {en:'He plays the drum in the band.', zh:'他在乐队里打鼓。'},
              {en:'I heard the beat of a drum.', zh:'我听到了鼓声。'},
            ],
          }),
          w('j7a5-10', 'ability', '/əˈbɪləti/', 'n.', '能力；才能', 'Music develops your ability.', '认知与学术', '音乐培养你的能力。', {
            phrases: [{en:'the ability to do sth.', zh:'做某事的能力'}, {en:'reading ability', zh:'阅读能力'}],
            
            extraExamples: [
              {en:'He has the ability to learn fast.', zh:'他有快速学习的能力。'},
              {en:'Music develops your ability.', zh:'音乐培养你的能力。'},
            ],
          }),
          w('j7a5-11', 'paint', '/peɪnt/', 'v.', '用颜料画；刷油漆', 'She paints a picture.', '行为与动作', '她画一幅画。', {
            phrases: [{en:'paint a picture', zh:'画一幅画'}, {en:'paint the wall', zh:'刷墙'}],
            
            extraExamples: [
              {en:'She paints a picture every weekend.', zh:'她每个周末画一幅画。'},
              {en:'We painted the wall blue.', zh:'我们把墙刷成了蓝色。'},
            ],
          }),
          w('j7a5-12', 'climb', '/klaɪm/', 'v.', '攀登；爬', 'They climb the hill.', '行为与动作', '他们爬山。', {
            phrases: [{en:'climb the hill/mountain', zh:'爬山'}, {en:'climb up', zh:'爬上'}],
            
            extraExamples: [
              {en:'They climb the hill every spring.', zh:'他们每年春天爬山。'},
              {en:'The boy climbed the tree.', zh:'男孩爬上了树。'},
            ],
          }),
          w('j7a5-13', 'more', '/mɔː(r)/', 'adj.', '更多的 adv. 更', 'I need more time.', '认知与学术', '我需要更多时间。', {
            phrases: [{en:'more and more', zh:'越来越多'}, {en:'more than', zh:'超过'}],
            
            extraExamples: [
              {en:'I need more time.', zh:'我需要更多时间。'},
              {en:'More and more people like reading.', zh:'越来越多的人喜欢阅读。'},
            ],
          }),
          w('j7a5-14', 'act', '/ækt/', 'v.', '扮演；行动 n. 一幕', 'She acts well in the play.', '行为与动作', '她在剧中演得很好。', {
            phrases: [{en:'act well', zh:'演得好'}, {en:'act as', zh:'充当'}],
            
            extraExamples: [
              {en:'She acts well in the play.', zh:'她在剧中演得很好。'},
              {en:'We should act at once.', zh:'我们应该立刻行动。'},
            ],
          }),
          w('j7a5-15', 'at home', '/æt həʊm/', 'phr.', '在家里', 'I stay at home on Sunday.', '社会与环境', '我周日在家。', {
            phrases: [{en:'stay at home', zh:'待在家里'}, {en:'at home in...', zh:'对……很熟悉'}],
            
            extraExamples: [
              {en:'I stay at home on Sunday.', zh:'我周日待在家里。'},
              {en:'Is anyone at home?', zh:'有人在家吗？'},
            ],
          }),
          w('j7a5-16', 'interested', '/ˈɪntrəstɪd/', 'adj.', '感兴趣的', 'I am interested in science.', '情感与性格', '我对科学感兴趣。', {
            phrases: [{en:'be interested in...', zh:'对……感兴趣'}, {en:'an interested look', zh:'感兴趣的表情'}],
            
            extraExamples: [
              {en:'I am interested in science.', zh:'我对科学感兴趣。'},
              {en:'She is interested in music.', zh:'她对音乐感兴趣。'},
            ],
          }),
          w('j7a5-17', 'nature', '/ˈneɪtʃə(r)/', 'n.', '自然界；大自然', 'We learn about nature.', '社会与环境', '我们了解大自然。', {
            phrases: [{en:'nature and nurture', zh:'先天与后天'}, {en:'in nature', zh:'在自然界中'}],
            
            extraExamples: [
              {en:'We should protect nature.', zh:'我们应该保护大自然。'},
              {en:'I like walking in nature.', zh:'我喜欢在大自然中散步。'},
            ],
          }),
          w('j7a5-18', 'beef', '/biːf/', 'n.', '牛肉', 'I like beef noodles.', '社会与环境', '我喜欢牛肉面。', {
            phrases: [{en:'beef noodles', zh:'牛肉面'}, {en:'a piece of beef', zh:'一块牛肉'}],
            
            extraExamples: [
              {en:'I like beef noodles.', zh:'我喜欢牛肉面。'},
              {en:'He doesn\u2019t like beef.', zh:'他不喜欢吃牛肉。'},
            ],
          }),
          w('j7a5-19', 'soon', '/suːn/', 'adv.', '不久；很快', 'See you soon.', '认知与学术', '很快见。', {
            phrases: [{en:'see you soon', zh:'很快见'}, {en:'as soon as possible', zh:'尽快'}],
            
            extraExamples: [
              {en:'See you soon!', zh:'很快见！'},
              {en:'I will be back soon.', zh:'我很快就回来。'},
            ],
          }),
          w('j7a5-20', 'than', '/ðæn/', 'conj.', '比', 'He is taller than me.', '认知与学术', '他比我高。', {
            phrases: [{en:'taller than', zh:'比……高'}, {en:'more than', zh:'超过'}],
            
            extraExamples: [
              {en:'He is taller than me.', zh:'他比我高。'},
              {en:'This book is more interesting than that one.', zh:'这本书比那本有趣。'},
            ],
          }),
          w('j7a5-21', 'mind', '/maɪnd/', 'n.', '头脑；心思 v. 介意', 'Books open your mind.', '认知与学术', '书籍开拓你的思维。', {
            phrases: [{en:'open one\u2019s mind', zh:'开阔思维'}, {en:'never mind', zh:'没关系'}],
            
            extraExamples: [
              {en:'Books open your mind.', zh:'书籍开拓你的思维。'},
              {en:'Would you mind opening the door?', zh:'你介意开门吗？'},
            ],
          }),
          w('j7a5-22', 'fall', '/fɔːl/', 'v.', '进入；掉落；跌倒 n. 秋天', 'I fall in love with reading.', '行为与动作', '我爱上了阅读。', {
            phrases: [{en:'fall in love with...', zh:'爱上……'}, {en:'fall down', zh:'摔倒'}],
            
            extraExamples: [
              {en:'I fall in love with reading.', zh:'我爱上了阅读。'},
              {en:'The leaves fall in autumn.', zh:'秋天树叶落下。'},
            ],
          }),
          w('j7a5-23', 'collect', '/kəˈlekt/', 'v.', '收集；采集', 'I collect stamps.', '行为与动作', '我集邮。', {
            phrases: [{en:'collect stamps', zh:'集邮'}, {en:'collect coins', zh:'收集硬币'}],
            
            extraExamples: [
              {en:'I collect stamps.', zh:'我集邮。'},
              {en:'She collects shells.', zh:'她收集贝壳。'},
            ],
          }),
          w('j7a5-24', 'insect', '/ˈɪnsekt/', 'n.', '昆虫', 'A bee is an insect.', '社会与环境', '蜜蜂是昆虫。', {
            phrases: [{en:'a harmful insect', zh:'害虫'}, {en:'insect bites', zh:'虫咬'}],
            
            extraExamples: [
              {en:'A bee is an insect.', zh:'蜜蜂是昆虫。'},
              {en:'There are many insects in the forest.', zh:'森林里有很多昆虫。'},
            ],
          }),
          w('j7a5-25', 'discover', '/dɪˈskʌvə(r)/', 'v.', '发现；发觉', 'We discover new things.', '行为与动作', '我们发现新事物。', {
            phrases: [{en:'discover new things', zh:'发现新事物'}, {en:'discover the truth', zh:'发现真相'}],
            
            extraExamples: [
              {en:'We discover new things every day.', zh:'我们每天都有新发现。'},
              {en:'Scientists discovered a new star.', zh:'科学家发现了一颗新星。'},
            ],
          }),
          w('j7a5-26', 'wildlife', '/ˈwaɪldlaɪf/', 'n.', '野生动物；野生生物', 'We protect wildlife.', '社会与环境', '我们保护野生动物。', {
            phrases: [{en:'protect wildlife', zh:'保护野生动物'}, {en:'wildlife protection', zh:'野生动物保护'}],
            
            extraExamples: [
              {en:'We should protect wildlife.', zh:'我们应该保护野生动物。'},
              {en:'There is a wildlife park near here.', zh:'附近有个野生动物园。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 6 · A Day in the Life',
        words: [
          w('j7a6-1', 'shower', '/ˈʃaʊə(r)/', 'n.', '淋浴；淋浴器 v. 洗淋浴', 'I take a shower in the morning.', '行为与动作', '我早上洗淋浴。', {
            phrases: [{en:'take a shower', zh:'洗淋浴'}, {en:'have a shower', zh:'洗淋浴'}],
            
            extraExamples: [
              {en:'I take a shower every morning.', zh:'我每天早上洗淋浴。'},
              {en:'It takes a long time to have a shower.', zh:'洗淋浴要花很长时间。'},
            ],
          }),
          w('j7a6-2', 'get dressed', '/ɡet drest/', 'phr.', '穿衣服', 'I get dressed quickly.', '行为与动作', '我很快穿好衣服。', {
            phrases: [{en:'get dressed quickly', zh:'很快穿好衣服'}, {en:'get dressed for...', zh:'为……穿好衣服'}],
            
            extraExamples: [
              {en:'I get dressed quickly in the morning.', zh:'我早上很快穿好衣服。'},
              {en:'Get dressed and come down.', zh:'穿好衣服下来。'},
            ],
          }),
          w('j7a6-3', 'brush', '/brʌʃ/', 'v.', '刷 n. 刷子；画笔', 'Brush your teeth every day.', '行为与动作', '每天刷牙。', {
            phrases: [{en:'brush one\u2019s teeth', zh:'刷牙'}, {en:'brush hair', zh:'梳头发'}],
            
            extraExamples: [
              {en:'Brush your teeth twice a day.', zh:'每天刷两次牙。'},
              {en:'I brush my hair every morning.', zh:'我每天早上梳头。'},
            ],
          }),
          w('j7a6-4', 'tooth', '/tuːθ/', 'n.', '牙齿（复数 teeth）', 'I brush my teeth twice a day.', '社会与环境', '我一天刷两次牙。', {
            phrases: [{en:'brush one\u2019s teeth', zh:'刷牙'}, {en:'a sweet tooth', zh:'爱吃甜食'}],
            
            extraExamples: [
              {en:'I brush my teeth twice a day.', zh:'我一天刷两次牙。'},
              {en:'The baby has a new tooth.', zh:'宝宝长了一颗新牙。'},
            ],
          }),
          w('j7a6-5', 'duty', '/ˈdjuːti/', 'n.', '值班；职责', 'I am on duty today.', '认知与学术', '我今天值日。', {
            phrases: [{en:'on duty', zh:'值日/值班'}, {en:'off duty', zh:'下班'}],
            
            extraExamples: [
              {en:'I am on duty today.', zh:'我今天值日。'},
              {en:'It is my duty to help you.', zh:'帮助你是我的职责。'},
            ],
          }),
          w('j7a6-6', 'usually', '/ˈjuːʒuəli/', 'adv.', '通常地；一般地', 'I usually walk to school.', '认知与学术', '我通常走路上学。', {
            phrases: [{en:'usually do sth.', zh:'通常做某事'}, {en:'as usual', zh:'像往常一样'}],
            
            extraExamples: [
              {en:'I usually walk to school.', zh:'我通常走路上学。'},
              {en:'He usually gets up at six.', zh:'他通常六点起床。'},
            ],
          }),
          w('j7a6-7', 'get up', '/ɡet ʌp/', 'phr.', '起床；站起', 'I get up at six.', '行为与动作', '我六点起床。', {
            phrases: [{en:'get up early/late', zh:'起得早/晚'}, {en:'get up at six', zh:'六点起床'}],
            
            extraExamples: [
              {en:'I get up at six every day.', zh:'我每天六点起床。'},
              {en:'Get up! It\u2019s seven o\u2019clock.', zh:'起床！七点了。'},
            ],
          }),
          w('j7a6-8', 'reporter', '/rɪˈpɔːtə(r)/', 'n.', '记者', 'The reporter asks questions.', '社会与环境', '记者提问。', {
            phrases: [{en:'a news reporter', zh:'新闻记者'}, {en:'a TV reporter', zh:'电视台记者'}],
            
            extraExamples: [
              {en:'The reporter asks questions.', zh:'记者提问。'},
              {en:'She wants to be a reporter.', zh:'她想当记者。'},
            ],
          }),
          w('j7a6-9', 'around', '/əˈraʊnd/', 'prep.', '大约；环绕；到处', 'I get up around six.', '认知与学术', '我大约六点起床。', {
            phrases: [{en:'around six', zh:'大约六点'}, {en:'look around', zh:'环顾四周'}],
            
            extraExamples: [
              {en:'I get up around six.', zh:'我大约六点起床。'},
              {en:'There are many trees around the house.', zh:'房子周围有很多树。'},
            ],
          }),
          w('j7a6-10', 'homework', '/ˈhəʊmwɜːk/', 'n.', '家庭作业', 'I do my homework after dinner.', '认知与学术', '我晚饭后做作业。', {
            phrases: [{en:'do one\u2019s homework', zh:'做作业'}, {en:'a lot of homework', zh:'很多作业'}],
            
            extraExamples: [
              {en:'I do my homework after dinner.', zh:'我晚饭后做作业。'},
              {en:'We have a lot of homework today.', zh:'我们今天有很多作业。'},
            ],
          }),
          w('j7a6-11', 'go to bed', '/ɡəʊ tuː bed/', 'phr.', '上床睡觉', 'I go to bed at ten.', '行为与动作', '我十点睡觉。', {
            phrases: [{en:'go to bed at ten', zh:'十点睡觉'}, {en:'go to bed early', zh:'早睡'}],
            
            extraExamples: [
              {en:'I go to bed at ten every night.', zh:'我每晚十点睡觉。'},
              {en:'Go to bed early. You need sleep.', zh:'早点睡吧，你需要休息。'},
            ],
          }),
          w('j7a6-12', 'saying', '/ˈseɪɪŋ/', 'n.', '谚语；格言', 'As the saying goes, time is money.', '认知与学术', '常言道，时间就是金钱。', {
            phrases: [{en:'as the saying goes', zh:'常言道'}, {en:'a famous saying', zh:'一句名言'}],
            
            extraExamples: [
              {en:'As the saying goes, time is money.', zh:'常言道，时间就是金钱。'},
              {en:'There is a saying: practice makes perfect.', zh:'有句谚语：熟能生巧。'},
            ],
          }),
          w('j7a6-13', 'rise', '/raɪz/', 'v.', '起床；升起；增长', 'The sun rises in the east.', '行为与动作', '太阳从东方升起。', {
            phrases: [{en:'the sun rises', zh:'太阳升起'}, {en:'rise early', zh:'早起'}],
            
            extraExamples: [
              {en:'The sun rises in the east.', zh:'太阳从东方升起。'},
              {en:'The river rises after the rain.', zh:'雨后河水上涨。'},
            ],
          }),
          w('j7a6-14', 'stay', '/steɪ/', 'v.', '停留；待', 'I stay at home on Sunday.', '行为与动作', '我周日待在家里。', {
            phrases: [{en:'stay at home', zh:'待在家里'}, {en:'stay up late', zh:'熬夜'}],
            
            extraExamples: [
              {en:'I stay at home on Sunday.', zh:'我周日待在家里。'},
              {en:'Stay here until I come back.', zh:'待在这儿直到我回来。'},
            ],
          }),
          w('j7a6-15', 'routine', '/ruːˈtiːn/', 'n.', '常规；惯例', 'Morning exercise is my routine.', '认知与学术', '晨练是我的惯例。', {
            phrases: [{en:'daily routine', zh:'日常惯例'}, {en:'a routine check', zh:'例行检查'}],
            
            extraExamples: [
              {en:'Morning exercise is my routine.', zh:'晨练是我的惯例。'},
              {en:'Make exercise part of your daily routine.', zh:'让锻炼成为你日常的一部分。'},
            ],
          }),
          w('j7a6-16', 'restaurant', '/ˈrestrɒnt/', 'n.', '餐馆；餐厅', 'We eat at a restaurant.', '社会与环境', '我们在餐馆吃饭。', {
            phrases: [{en:'at a restaurant', zh:'在餐馆'}, {en:'a Chinese restaurant', zh:'中餐馆'}],
            
            extraExamples: [
              {en:'We eat at a restaurant on Sunday.', zh:'我们周日在餐馆吃饭。'},
              {en:'There is a new restaurant near here.', zh:'附近有家新餐馆。'},
            ],
          }),
          w('j7a6-17', 'housework', '/ˈhaʊswɜːk/', 'n.', '家务劳动', 'I help with the housework.', '行为与动作', '我帮忙做家务。', {
            phrases: [{en:'do housework', zh:'做家务'}, {en:'help with the housework', zh:'帮忙做家务'}],
            
            extraExamples: [
              {en:'I help with the housework.', zh:'我帮忙做家务。'},
              {en:'My mother does housework every day.', zh:'我妈妈每天做家务。'},
            ],
          }),
          w('j7a6-18', 'while', '/waɪl/', 'conj.', '当……的时候 n. 一段时间', 'I read while I wait.', '认知与学术', '我边等边读。', {
            phrases: [{en:'while I wait', zh:'我等待时'}, {en:'after a while', zh:'过了一会儿'}],
            
            extraExamples: [
              {en:'I read while I wait.', zh:'我边等边读。'},
              {en:'After a while, he came back.', zh:'过了一会儿，他回来了。'},
            ],
          }),
          w('j7a6-19', 'weekend', '/ˌwiːkˈend/', 'n.', '周末', 'I play sports at weekends.', '认知与学术', '我周末做运动。', {
            phrases: [{en:'at weekends', zh:'在周末'}, {en:'on the weekend', zh:'在周末'}],
            
            extraExamples: [
              {en:'I play sports at weekends.', zh:'我周末做运动。'},
              {en:'What do you do on the weekend?', zh:'你周末做什么？'},
            ],
          }),
          w('j7a6-20', 'daily', '/ˈdeɪli/', 'adj.', '每日的；日常的', 'Exercise is part of my daily life.', '品质与状态', '锻炼是我日常生活的一部分。', {
            phrases: [{en:'daily life', zh:'日常生活'}, {en:'daily exercise', zh:'日常锻炼'}],
            
            extraExamples: [
              {en:'Exercise is part of my daily life.', zh:'锻炼是我日常生活的一部分。'},
              {en:'Reading English newspapers is my daily habit.', zh:'读英文报是我每天的习惯。'},
            ],
          }),
          w('j7a6-21', 'only', '/ˈəʊnli/', 'adv.', '只；仅', 'It is only ten minutes\u2019 walk.', '认知与学术', '走路只要十分钟。', {
            phrases: [{en:'only ten minutes', zh:'只要十分钟'}, {en:'not only... but also...', zh:'不但……而且……'}],
            
            extraExamples: [
              {en:'It is only ten minutes\u2019 walk.', zh:'走路只要十分钟。'},
              {en:'I only have one pen.', zh:'我只有一支笔。'},
            ],
          }),
          w('j7a6-22', 'break', '/breɪk/', 'n.', '休息；间断 v. 打破', 'We have a break between lessons.', '行为与动作', '课间我们休息。', {
            phrases: [{en:'have a break', zh:'休息一下'}, {en:'take a break', zh:'休息一下'}],
            
            extraExamples: [
              {en:'We have a break between lessons.', zh:'课间我们休息。'},
              {en:'Let\u2019s take a break.', zh:'我们休息一下吧。'},
            ],
          }),
          w('j7a6-23', 'finish', '/ˈfɪnɪʃ/', 'v.', '结束；完成', 'Afternoon classes finish at 2:15.', '行为与动作', '下午课 2:15 结束。', {
            phrases: [{en:'finish doing sth.', zh:'完成做某事'}, {en:'finish homework', zh:'完成作业'}],
            
            extraExamples: [
              {en:'Afternoon classes finish at 2:15.', zh:'下午课 2:15 结束。'},
              {en:'I finished my homework at nine.', zh:'我九点完成了作业。'},
            ],
          }),
          w('j7a6-24', 'hockey', '/ˈhɒki/', 'n.', '曲棍球', 'We play ice hockey.', '社会与环境', '我们打冰球。', {
            phrases: [{en:'play hockey', zh:'打曲棍球'}, {en:'ice hockey', zh:'冰球'}],
            
            extraExamples: [
              {en:'We play ice hockey in winter.', zh:'我们冬天打冰球。'},
              {en:'He likes playing hockey.', zh:'他喜欢打曲棍球。'},
            ],
          }),
          w('j7a6-25', 'already', '/ɔːlˈredi/', 'adv.', '已经；早已', 'I have already finished.', '认知与学术', '我已经完成了。', {
            phrases: [{en:'have already done', zh:'已经做了'}, {en:'already finished', zh:'已经完成'}],
            
            extraExamples: [
              {en:'I have already finished my homework.', zh:'我已经完成作业了。'},
              {en:'He has already left.', zh:'他已经走了。'},
            ],
          }),
          w('j7a6-26', 'dark', '/dɑːk/', 'adj.', '昏暗的；深色的 n. 黑暗', 'It gets dark early in winter.', '品质与状态', '冬天天黑得早。', {
            phrases: [{en:'get dark', zh:'天黑'}, {en:'dark blue', zh:'深蓝色'}],
            
            extraExamples: [
              {en:'It gets dark early in winter.', zh:'冬天天黑得早。'},
              {en:'The room is too dark.', zh:'房间太暗了。'},
            ],
          }),
          w('j7a6-27', 'outside', '/ˌaʊtˈsaɪd/', 'adv.', '在外面 prep. 在……外面', 'We play outside.', '社会与环境', '我们在外面玩。', {
            phrases: [{en:'play outside', zh:'在外面玩'}, {en:'outside the classroom', zh:'在教室外面'}],
            
            extraExamples: [
              {en:'We play outside after school.', zh:'我们放学后在外面玩。'},
              {en:'It is cold outside.', zh:'外面很冷。'},
            ],
          }),
          w('j7a6-28', 'part', '/pɑːt/', 'n.', '部分', 'Reading is part of my day.', '认知与学术', '阅读是我一天的一部分。', {
            phrases: [{en:'part of...', zh:'……的一部分'}, {en:'take part in...', zh:'参加……'}],
            
            extraExamples: [
              {en:'Reading is part of my day.', zh:'阅读是我一天的一部分。'},
              {en:'I take part in the sports meeting.', zh:'我参加运动会。'},
            ],
          }),
          w('j7a6-29', 'prepare', '/prɪˈpeə(r)/', 'v.', '把……预备好；准备', 'I prepare my schoolbag.', '行为与动作', '我收拾书包。', {
            phrases: [{en:'prepare for...', zh:'为……做准备'}, {en:'prepare sth.', zh:'准备某物'}],
            
            extraExamples: [
              {en:'I prepare my schoolbag every night.', zh:'我每晚收拾书包。'},
              {en:'We are preparing for the exam.', zh:'我们正在为考试做准备。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 7 · Happy Birthday!',
        words: [
          w('j7a7-1', 'celebrate', '/ˈselɪbreɪt/', 'v.', '庆祝；庆贺', 'We celebrate her birthday.', '行为与动作', '我们庆祝她的生日。', {
            phrases: [{en:'celebrate sth.', zh:'庆祝某事'}, {en:'celebrate a birthday', zh:'庆祝生日'}],
            
            extraExamples: [
              {en:'We celebrate her birthday.', zh:'我们庆祝她的生日。'},
              {en:'People celebrate the Spring Festival.', zh:'人们庆祝春节。'},
            ],
          }),
          w('j7a7-2', 'surprise', '/səˈpraɪz/', 'n.', '惊奇 v. 使感到意外', 'We have a surprise party.', '情感与性格', '我们办了个惊喜聚会。', {
            phrases: [{en:'a surprise party', zh:'惊喜聚会'}, {en:'to one\u2019s surprise', zh:'令某人惊讶的是'}],
            
            extraExamples: [
              {en:'We have a surprise party for her.', zh:'我们为她办了个惊喜聚会。'},
              {en:'To my surprise, he passed the exam.', zh:'令我惊讶的是，他通过了考试。'},
            ],
          }),
          w('j7a7-3', 'something', '/ˈsʌmθɪŋ/', 'pron.', '某事；某物', 'I have something for you.', '认知与学术', '我有东西给你。', {
            phrases: [{en:'something to eat', zh:'一些吃的'}, {en:'something important', zh:'重要的事'}],
            
            extraExamples: [
              {en:'I have something for you.', zh:'我有东西给你。'},
              {en:'Would you like something to drink?', zh:'你想喝点什么吗？'},
            ],
          }),
          w('j7a7-4', 'sale', '/seɪl/', 'n.', '出售；销售', 'The shop has a sale today.', '认知与学术', '商店今天促销。', {
            phrases: [{en:'on sale', zh:'打折出售'}, {en:'for sale', zh:'待售'}],
            
            extraExamples: [
              {en:'The shop has a sale today.', zh:'商店今天促销。'},
              {en:'These books are on sale.', zh:'这些书在打折。'},
            ],
          }),
          w('j7a7-5', 'kilo', '/ˈkiːləʊ/', 'n.', '千克；公斤', 'I buy two kilos of apples.', '社会与环境', '我买两公斤苹果。', {
            phrases: [{en:'a kilo of...', zh:'一公斤……'}, {en:'two kilos of apples', zh:'两公斤苹果'}],
            
            extraExamples: [
              {en:'I buy two kilos of apples.', zh:'我买两公斤苹果。'},
              {en:'How many kilos do you want?', zh:'你要几公斤？'},
            ],
          }),
          w('j7a7-6', 'yogurt', '/ˈjɒɡət/', 'n.', '酸奶', 'I drink yogurt every morning.', '社会与环境', '我每天早上喝酸奶。', {
            phrases: [{en:'a cup of yogurt', zh:'一杯酸奶'}, {en:'drink yogurt', zh:'喝酸奶'}],
            
            extraExamples: [
              {en:'I drink yogurt every morning.', zh:'我每天早上喝酸奶。'},
              {en:'She likes strawberry yogurt.', zh:'她喜欢草莓酸奶。'},
            ],
          }),
          w('j7a7-7', 'total', '/ˈtəʊtl/', 'n.', '总数 adj. 总的', 'The total is fifty yuan.', '认知与学术', '一共五十元。', {
            phrases: [{en:'in total', zh:'总共'}, {en:'the total is...', zh:'总数是……'}],
            
            extraExamples: [
              {en:'The total is fifty yuan.', zh:'一共五十元。'},
              {en:'In total, there are 50 students.', zh:'总共有50名学生。'},
            ],
          }),
          w('j7a7-8', 'price', '/praɪs/', 'n.', '价格', 'The price is low.', '认知与学术', '价格很低。', {
            phrases: [{en:'the price of...', zh:'……的价格'}, {en:'a low/high price', zh:'低价/高价'}],
            
            extraExamples: [
              {en:'The price is low.', zh:'价格很低。'},
              {en:'What is the price of this book?', zh:'这本书多少钱？'},
            ],
          }),
          w('j7a7-9', 'balloon', '/bəˈluːn/', 'n.', '气球', 'The balloons are red.', '社会与环境', '气球是红色的。', {
            phrases: [{en:'a red balloon', zh:'红气球'}, {en:'blow up a balloon', zh:'吹气球'}],
            
            extraExamples: [
              {en:'The balloons are red.', zh:'气球是红色的。'},
              {en:'There are many balloons at the party.', zh:'聚会上有很多气球。'},
            ],
          }),
          w('j7a7-10', 'chocolate', '/ˈtʃɒklət/', 'n.', '巧克力', 'I get a box of chocolate.', '社会与环境', '我得到一盒巧克力。', {
            phrases: [{en:'a bar of chocolate', zh:'一条巧克力'}, {en:'a box of chocolate', zh:'一盒巧克力'}],
            
            extraExamples: [
              {en:'I get a box of chocolate on my birthday.', zh:'我生日时得到一盒巧克力。'},
              {en:'Do you like chocolate?', zh:'你喜欢巧克力吗？'},
            ],
          }),
          w('j7a7-11', 'pizza', '/ˈpiːtsə/', 'n.', '比萨饼', 'We order a pizza.', '社会与环境', '我们点了比萨。', {
            phrases: [{en:'order a pizza', zh:'点比萨'}, {en:'a cheese pizza', zh:'芝士比萨'}],
            
            extraExamples: [
              {en:'We order a pizza for dinner.', zh:'我们晚餐点了比萨。'},
              {en:'I like pizza with cheese.', zh:'我喜欢芝士比萨。'},
            ],
          }),
          w('j7a7-12', 'list', '/lɪst/', 'n.', '名单；清单 v. 列表', 'Make a shopping list.', '认知与学术', '列一张购物清单。', {
            phrases: [{en:'a shopping list', zh:'购物清单'}, {en:'make a list', zh:'列清单'}],
            
            extraExamples: [
              {en:'Make a shopping list before you go.', zh:'去之前列个购物清单。'},
              {en:'Your name is on the list.', zh:'你的名字在名单上。'},
            ],
          }),
          w('j7a7-13', 'own', '/əʊn/', 'adj.', '自己的；本人的', 'I have my own room.', '品质与状态', '我有自己的房间。', {
            phrases: [{en:'one\u2019s own room', zh:'自己的房间'}, {en:'on one\u2019s own', zh:'独自'}],
            
            extraExamples: [
              {en:'I have my own room.', zh:'我有自己的房间。'},
              {en:'She lives on her own.', zh:'她独自生活。'},
            ],
          }),
          w('j7a7-14', 'example', '/ɪɡˈzɑːmpl/', 'n.', '例子；范例', 'For example, we plant a tree.', '认知与学术', '比如，我们种一棵树。', {
            phrases: [{en:'for example', zh:'例如'}, {en:'set an example', zh:'树立榜样'}],
            
            extraExamples: [
              {en:'For example, we plant a tree.', zh:'比如，我们种一棵树。'},
              {en:'He set an example for us.', zh:'他为我们树立了榜样。'},
            ],
          }),
          w('j7a7-15', 'language', '/ˈlæŋɡwɪdʒ/', 'n.', '语言', 'English is a useful language.', '认知与学术', '英语是有用的语言。', {
            phrases: [{en:'a foreign language', zh:'外语'}, {en:'the Chinese language', zh:'汉语'}],
            
            extraExamples: [
              {en:'English is a useful language.', zh:'英语是有用的语言。'},
              {en:'How many languages do you speak?', zh:'你会说几种语言？'},
            ],
          }),
          w('j7a7-16', 'international', '/ˌɪntəˈnæʃnəl/', 'adj.', '国际的', 'It is an international school.', '社会与环境', '这是所国际学校。', {
            phrases: [{en:'an international school', zh:'国际学校'}, {en:'international trade', zh:'国际贸易'}],
            
            extraExamples: [
              {en:'It is an international school.', zh:'这是所国际学校。'},
              {en:'English is an international language.', zh:'英语是国际语言。'},
            ],
          }),
          w('j7a7-17', 'mark', '/mɑːk/', 'v.', '做记号；打分 n. 记号', 'Mark the new words.', '行为与动作', '把生词标出来。', {
            phrases: [{en:'mark the new words', zh:'把生词标出来'}, {en:'get good marks', zh:'取得好成绩'}],
            
            extraExamples: [
              {en:'Mark the new words in the text.', zh:'把文中的生词标出来。'},
              {en:'She got good marks in the exam.', zh:'她考试取得了好成绩。'},
            ],
          }),
          w('j7a7-18', 'date', '/deɪt/', 'n.', '日期；日子', 'What is the date today?', '认知与学术', '今天几号？', {
            phrases: [{en:'What is the date today?', zh:'今天几号？'}, {en:'out of date', zh:'过时的'}],
            
            extraExamples: [
              {en:'What is the date today?', zh:'今天几号？'},
              {en:'The date of the party is October 1st.', zh:'聚会日期是10月1日。'},
            ],
          }),
          w('j7a7-19', 'national', '/ˈnæʃnəl/', 'adj.', '国家的；民族的', 'National Day is in October.', '社会与环境', '国庆节在十月。', {
            phrases: [{en:'National Day', zh:'国庆节'}, {en:'a national holiday', zh:'国定假日'}],
            
            extraExamples: [
              {en:'National Day is in October.', zh:'国庆节在十月。'},
              {en:'This is a national flag.', zh:'这是一面国旗。'},
            ],
          }),
          w('j7a7-20', 'found', '/faʊnd/', 'v.', '创建；创立', 'The school was founded in 1990.', '行为与动作', '这所学校建于1990年。', {
            phrases: [{en:'found a school', zh:'创办学校'}, {en:'be founded in...', zh:'建于……'}],
            
            extraExamples: [
              {en:'The school was founded in 1990.', zh:'这所学校建于1990年。'},
              {en:'The company was founded in 2000.', zh:'这家公司创立于2000年。'},
            ],
          }),
          w('j7a7-21', 'meaningful', '/ˈmiːnɪŋfl/', 'adj.', '重要的；有意义的', 'It is a meaningful day.', '情感与性格', '这是有意义的一天。', {
            phrases: [{en:'a meaningful day', zh:'有意义的一天'}, {en:'a meaningful talk', zh:'一次有意义的谈话'}],
            
            extraExamples: [
              {en:'It is a meaningful day for me.', zh:'对我来说这是有意义的一天。'},
              {en:'We had a meaningful talk.', zh:'我们进行了一次有意义的谈话。'},
            ],
          }),
          w('j7a7-22', 'symbol', '/ˈsɪmbl/', 'n.', '象征；符号', 'Noodles are a symbol of long life.', '认知与学术', '面条是长寿的象征。', {
            phrases: [{en:'a symbol of...', zh:'……的象征'}, {en:'a national symbol', zh:'国家象征'}],
            
            extraExamples: [
              {en:'Noodles are a symbol of long life.', zh:'面条是长寿的象征。'},
              {en:'The dove is a symbol of peace.', zh:'鸽子是和平的象征。'},
            ],
          }),
          w('j7a7-23', 'village', '/ˈvɪlɪdʒ/', 'n.', '村庄；村镇', 'He lives in a small village.', '社会与环境', '他住在小村庄里。', {
            phrases: [{en:'a small village', zh:'小村庄'}, {en:'village life', zh:'乡村生活'}],
            
            extraExamples: [
              {en:'He lives in a small village.', zh:'他住在小村庄里。'},
              {en:'There is a river in the village.', zh:'村子里有一条河。'},
            ],
          }),
          w('j7a7-24', 'grow', '/ɡrəʊ/', 'v.', '成长；长大；增长', 'I grow with my family.', '行为与动作', '我和家人一起成长。', {
            phrases: [{en:'grow up', zh:'长大'}, {en:'grow flowers', zh:'种花'}],
            
            extraExamples: [
              {en:'I grow with my family.', zh:'我和家人一起成长。'},
              {en:'What do you want to be when you grow up?', zh:'你长大后想做什么？'},
            ],
          }),
          w('j7a7-25', 'blow', '/bləʊ/', 'v.', '吹；刮', 'Blow out the candles.', '行为与动作', '吹灭蜡烛。', {
            phrases: [{en:'blow out the candles', zh:'吹灭蜡烛'}, {en:'blow bubbles', zh:'吹泡泡'}],
            
            extraExamples: [
              {en:'Blow out the candles.', zh:'吹灭蜡烛。'},
              {en:'The wind is blowing hard.', zh:'风刮得很大。'},
            ],
          }),
          w('j7a7-26', 'enjoy', '/ɪnˈdʒɔɪ/', 'v.', '享受……的乐趣；喜欢', 'I enjoy reading.', '情感与性格', '我喜欢阅读。', {
            phrases: [{en:'enjoy doing sth.', zh:'喜欢做某事'}, {en:'enjoy oneself', zh:'玩得开心'}],
            
            extraExamples: [
              {en:'I enjoy reading books.', zh:'我喜欢读书。'},
              {en:'Did you enjoy yourself at the party?', zh:'你在聚会上玩得开心吗？'},
            ],
          }),
          w('j7a7-27', 'height', '/haɪt/', 'n.', '身高；高度', 'They mark my height.', '认知与学术', '他们量我的身高。', {
            phrases: [{en:'one\u2019s height', zh:'某人的身高'}, {en:'the height of...', zh:'……的高度'}],
            
            extraExamples: [
              {en:'They mark my height every year.', zh:'他们每年给我量身高。'},
              {en:'What is the height of the tree?', zh:'这棵树有多高？'},
            ],
          }),
          w('j7a7-28', 'later', '/ˈleɪtə(r)/', 'adv.', '以后；后来', 'See you later.', '认知与学术', '回头见。', {
            phrases: [{en:'see you later', zh:'回头见'}, {en:'sooner or later', zh:'迟早'}],
            
            extraExamples: [
              {en:'See you later!', zh:'回头见！'},
              {en:'I will tell you later.', zh:'我稍后告诉你。'},
            ],
          }),
        ],
      },
    ],
  },
  {
    id: 'junior-7b',
    name: '人教版初中英语七年级下册（新版）',
    units: [
      {
        title: 'Unit 1 · Animal Friends',
        words: [
          w('j7b1-1', 'fox', '/fɒks/', 'n.', '狐狸', 'The fox is clever.', '社会与环境', '狐狸很聪明。', {
            phrases: [{en:'a clever fox', zh:'聪明的狐狸'}, {en:'an old fox', zh:'老狐狸'}],
            
            extraExamples: [
              {en:'The fox is clever.', zh:'狐狸很聪明。'},
              {en:'A fox lives in the forest.', zh:'狐狸住在森林里。'},
            ],
          }),
          w('j7b1-2', 'giraffe', '/dʒəˈrɑːf/', 'n.', '长颈鹿', 'The giraffe has a long neck.', '社会与环境', '长颈鹿脖子很长。', {
            phrases: [{en:'a long neck', zh:'长脖子'}, {en:'a tall giraffe', zh:'高高的长颈鹿'}],
            
            extraExamples: [
              {en:'The giraffe has a long neck.', zh:'长颈鹿脖子很长。'},
              {en:'A giraffe is the tallest animal.', zh:'长颈鹿是最高的动物。'},
            ],
          }),
          w('j7b1-3', 'eagle', '/ˈiːɡl/', 'n.', '鹰；雕', 'The eagle flies high.', '社会与环境', '鹰飞得很高。', {
            phrases: [{en:'an eagle flies high', zh:'鹰飞得高'}, {en:'a bald eagle', zh:'白头鹰'}],
            
            extraExamples: [
              {en:'The eagle flies high in the sky.', zh:'鹰在高空飞翔。'},
              {en:'An eagle has sharp eyes.', zh:'鹰的眼睛很锐利。'},
            ],
          }),
          w('j7b1-4', 'wolf', '/wʊlf/', 'n.', '狼（复数 wolves）', 'Wolves live in groups.', '社会与环境', '狼成群生活。', {
            phrases: [{en:'a pack of wolves', zh:'一群狼'}, {en:'cry wolf', zh:'发假警报'}],
            
            extraExamples: [
              {en:'Wolves live in groups.', zh:'狼成群生活。'},
              {en:'A wolf is a wild animal.', zh:'狼是野生动物。'},
            ],
          }),
          w('j7b1-5', 'penguin', '/ˈpeŋɡwɪn/', 'n.', '企鹅', 'Penguins live in the south.', '社会与环境', '企鹅生活在南方。', {
            phrases: [{en:'penguins live in the South Pole', zh:'企鹅生活在南极'}, {en:'a penguin egg', zh:'企鹅蛋'}],
            
            extraExamples: [
              {en:'Penguins live in the South Pole.', zh:'企鹅生活在南极。'},
              {en:'Penguins can swim but cannot fly.', zh:'企鹅会游泳但不会飞。'},
            ],
          }),
          w('j7b1-6', 'care', '/keə(r)/', 'v.', '关心；在乎 n. 照顾', 'We care about animals.', '情感与性格', '我们关心动物。', {
            phrases: [{en:'care about...', zh:'关心……'}, {en:'take care of...', zh:'照顾……'}],
            
            extraExamples: [
              {en:'We care about animals.', zh:'我们关心动物。'},
              {en:'Take care of your sister.', zh:'照顾好你妹妹。'},
            ],
          }),
          w('j7b1-7', 'sandwich', '/ˈsænwɪtʃ/', 'n.', '三明治', 'I have a sandwich for lunch.', '社会与环境', '我午饭吃三明治。', {
            phrases: [{en:'a ham sandwich', zh:'火腿三明治'}, {en:'make a sandwich', zh:'做三明治'}],
            
            extraExamples: [
              {en:'I have a sandwich for lunch.', zh:'我午饭吃三明治。'},
              {en:'She made a cheese sandwich.', zh:'她做了个芝士三明治。'},
            ],
          }),
          w('j7b1-8', 'snake', '/sneɪk/', 'n.', '蛇', 'The snake is long.', '社会与环境', '这条蛇很长。', {
            phrases: [{en:'a long snake', zh:'一条长蛇'}, {en:'snake bites', zh:'蛇咬'}],
            
            extraExamples: [
              {en:'The snake is long.', zh:'这条蛇很长。'},
              {en:'Some snakes are dangerous.', zh:'有些蛇很危险。'},
            ],
          }),
          w('j7b1-9', 'scary', '/ˈskeəri/', 'adj.', '吓人的；恐怖的', 'The movie is scary.', '情感与性格', '这部电影很吓人。', {
            phrases: [{en:'a scary movie', zh:'恐怖电影'}, {en:'a scary story', zh:'恐怖故事'}],
            
            extraExamples: [
              {en:'The movie is scary.', zh:'这部电影很吓人。'},
              {en:'That is a scary story.', zh:'那是个恐怖故事。'},
            ],
          }),
          w('j7b1-10', 'shark', '/ʃɑːk/', 'n.', '鲨鱼', 'The shark swims fast.', '社会与环境', '鲨鱼游得很快。', {
            phrases: [{en:'a big shark', zh:'大鲨鱼'}, {en:'shark attacks', zh:'鲨鱼袭击'}],
            
            extraExamples: [
              {en:'The shark swims fast.', zh:'鲨鱼游得很快。'},
              {en:'There are many sharks in the sea.', zh:'海里有很多鲨鱼。'},
            ],
          }),
          w('j7b1-11', 'whale', '/weɪl/', 'n.', '鲸', 'The whale is huge.', '社会与环境', '鲸鱼很大。', {
            phrases: [{en:'a blue whale', zh:'蓝鲸'}, {en:'whale watching', zh:'观鲸'}],
            
            extraExamples: [
              {en:'The whale is huge.', zh:'鲸鱼很大。'},
              {en:'A blue whale is the largest animal.', zh:'蓝鲸是最大的动物。'},
            ],
          }),
          w('j7b1-12', 'huge', '/hjuːdʒ/', 'adj.', '巨大的', 'The elephant is huge.', '品质与状态', '大象很巨大。', {
            phrases: [{en:'a huge elephant', zh:'巨大的大象'}, {en:'a huge success', zh:'巨大的成功'}],
            
            extraExamples: [
              {en:'The elephant is huge.', zh:'大象很巨大。'},
              {en:'That is a huge house.', zh:'那是一座巨大的房子。'},
            ],
          }),
          w('j7b1-13', 'dangerous', '/ˈdeɪndʒərəs/', 'adj.', '危险的', 'It is dangerous to swim here.', '品质与状态', '在这里游泳很危险。', {
            phrases: [{en:'a dangerous animal', zh:'危险的动物'}, {en:'It is dangerous to do sth.', zh:'做某事很危险'}],
            
            extraExamples: [
              {en:'It is dangerous to swim here.', zh:'在这里游泳很危险。'},
              {en:'Tigers are dangerous animals.', zh:'老虎是危险的动物。'},
            ],
          }),
          w('j7b1-14', 'save', '/seɪv/', 'v.', '救；储蓄；保存', 'We must save animals.', '行为与动作', '我们必须拯救动物。', {
            phrases: [{en:'save animals', zh:'拯救动物'}, {en:'save money', zh:'省钱'}],
            
            extraExamples: [
              {en:'We must save animals.', zh:'我们必须拯救动物。'},
              {en:'Save water, please.', zh:'请节约用水。'},
            ],
          }),
          w('j7b1-15', 'trunk', '/trʌŋk/', 'n.', '象鼻；树干', 'The elephant uses its trunk.', '社会与环境', '大象用象鼻。', {
            phrases: [{en:'an elephant trunk', zh:'象鼻'}, {en:'the trunk of a tree', zh:'树干'}],
            
            extraExamples: [
              {en:'The elephant uses its trunk to drink.', zh:'大象用鼻子喝水。'},
              {en:'The trunk of the tree is thick.', zh:'树干很粗。'},
            ],
          }),
          w('j7b1-16', 'carry', '/ˈkæri/', 'v.', '拿；提；搬运', 'He carries a big bag.', '行为与动作', '他提着一个大包。', {
            phrases: [{en:'carry a bag', zh:'提包'}, {en:'carry sth. with you', zh:'随身带着某物'}],
            
            extraExamples: [
              {en:'He carries a big bag.', zh:'他提着一个大包。'},
              {en:'She carries a book in her hand.', zh:'她手里拿着一本书。'},
            ],
          }),
          w('j7b1-17', 'danger', '/ˈdeɪndʒə(r)/', 'n.', '危险', 'Some animals are in danger.', '认知与学术', '一些动物处于危险中。', {
            phrases: [{en:'in danger', zh:'处于危险中'}, {en:'out of danger', zh:'脱离危险'}],
            
            extraExamples: [
              {en:'Some animals are in danger.', zh:'一些动物处于危险中。'},
              {en:'His life is in danger.', zh:'他的生命有危险。'},
            ],
          }),
          w('j7b1-18', 'forest', '/ˈfɒrɪst/', 'n.', '森林', 'Tigers live in the forest.', '社会与环境', '老虎生活在森林里。', {
            phrases: [{en:'in the forest', zh:'在森林里'}, {en:'a thick forest', zh:'茂密的森林'}],
            
            extraExamples: [
              {en:'Tigers live in the forest.', zh:'老虎生活在森林里。'},
              {en:'There are many trees in the forest.', zh:'森林里有很多树。'},
            ],
          }),
          w('j7b1-19', 'in danger', '/ɪn ˈdeɪndʒə(r)/', 'phr.', '处于危险中', 'Pandas are in danger.', '认知与学术', '熊猫处于危险中。', {
            phrases: [{en:'be in danger', zh:'处于危险中'}, {en:'animals in danger', zh:'濒危动物'}],
            
            extraExamples: [
              {en:'Pandas are in danger.', zh:'熊猫处于危险中。'},
              {en:'Many wild animals are in danger.', zh:'许多野生动物濒临危险。'},
            ],
          }),
          w('j7b1-20', 'South Pole', '/ˌsaʊθ ˈpəʊl/', 'n.', '南极', 'Penguins live at the South Pole.', '社会与环境', '企鹅生活在南极。', {
            phrases: [{en:'the South Pole', zh:'南极'}, {en:'at the South Pole', zh:'在南极'}],
            
            extraExamples: [
              {en:'Penguins live at the South Pole.', zh:'企鹅生活在南极。'},
              {en:'It is very cold at the South Pole.', zh:'南极非常冷。'},
            ],
          }),
          w('j7b1-21', 'fur', '/fɜː(r)/', 'n.', '（动物的）软毛；毛皮', 'The cat has soft fur.', '社会与环境', '猫的毛很软。', {
            phrases: [{en:'soft fur', zh:'软毛'}, {en:'a fur coat', zh:'皮大衣'}],
            
            extraExamples: [
              {en:'The cat has soft fur.', zh:'猫的毛很软。'},
              {en:'The dog has thick fur.', zh:'狗的毛很厚。'},
            ],
          }),
          w('j7b1-22', 'tail', '/teɪl/', 'n.', '尾巴', 'The dog wags its tail.', '社会与环境', '狗摇尾巴。', {
            phrases: [{en:'wag its tail', zh:'摇尾巴'}, {en:'a long tail', zh:'长尾巴'}],
            
            extraExamples: [
              {en:'The dog wags its tail.', zh:'狗摇尾巴。'},
              {en:'The cat has a long tail.', zh:'猫有长尾巴。'},
            ],
          }),
          w('j7b1-23', 'neck', '/nek/', 'n.', '脖子；颈', 'The giraffe has a long neck.', '社会与环境', '长颈鹿脖子很长。', {
            phrases: [{en:'a long neck', zh:'长脖子'}, {en:'neck and neck', zh:'并驾齐驱'}],
            
            extraExamples: [
              {en:'The giraffe has a long neck.', zh:'长颈鹿脖子很长。'},
              {en:'He put his arm around her neck.', zh:'他搂住她的脖子。'},
            ],
          }),
          w('j7b1-24', 'pick', '/pɪk/', 'v.', '采；摘；挑选', 'Pick up the rubbish.', '行为与动作', '把垃圾捡起来。', {
            phrases: [{en:'pick apples', zh:'摘苹果'}, {en:'pick a book', zh:'选一本书'}],
            
            extraExamples: [
              {en:'We pick apples in autumn.', zh:'我们秋天摘苹果。'},
              {en:'Pick a card from the deck.', zh:'从牌堆里抽一张牌。'},
            ],
          }),
          w('j7b1-25', 'pick up', '/pɪk ʌp/', 'phr.', '捡起；接（人）', 'Pick up the book.', '行为与动作', '把书捡起来。', {
            phrases: [{en:'pick up the book', zh:'捡起书'}, {en:'pick up sb.', zh:'接某人'}],
            
            extraExamples: [
              {en:'Pick up the book.', zh:'把书捡起来。'},
              {en:'I will pick you up at the station.', zh:'我会去车站接你。'},
            ],
          }),
          w('j7b1-26', 'main', '/meɪn/', 'adj.', '主要的', 'The main food is bamboo.', '品质与状态', '主要食物是竹子。', {
            phrases: [{en:'the main food', zh:'主要食物'}, {en:'the main idea', zh:'主旨'}],
            
            extraExamples: [
              {en:'The main food is bamboo.', zh:'主要食物是竹子。'},
              {en:'What is the main idea of the passage?', zh:'这篇文章的主旨是什么？'},
            ],
          }),
          w('j7b1-27', 'called', '/kɔːld/', 'adj.', '叫做；名为', 'The dog is called Lucky.', '认知与学术', '这只狗叫幸运。', {
            phrases: [{en:'be called...', zh:'叫做……'}, {en:'a boy called Tom', zh:'一个叫汤姆的男孩'}],
            
            extraExamples: [
              {en:'The dog is called Lucky.', zh:'这只狗叫幸运。'},
              {en:'There is a boy called Tom.', zh:'有个叫汤姆的男孩。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 2 · No Rules, No Order',
        words: [
          w('j7b2-1', 'rule', '/ruːl/', 'n.', '规则；规章', 'We must follow the rules.', '社会与环境', '我们必须遵守规则。', {
            phrases: [{en:'follow the rules', zh:'遵守规则'}, {en:'break the rules', zh:'违反规则'}],
            
            extraExamples: [
              {en:'We must follow the school rules.', zh:'我们必须遵守校规。'},
              {en:'Everyone should obey the rules.', zh:'每个人都应该遵守规则。'},
            ],
          }),
          w('j7b2-2', 'order', '/ˈɔːdə(r)/', 'n.', '秩序 v. 命令', 'Keep the order in class.', '社会与环境', '保持课堂秩序。', {
            phrases: [{en:'keep order', zh:'维持秩序'}, {en:'in order', zh:'整齐'}],
            
            extraExamples: [
              {en:'Keep the order in class.', zh:'保持课堂秩序。'},
              {en:'The books are in order.', zh:'书排列整齐。'},
            ],
          }),
          w('j7b2-3', 'follow', '/ˈfɒləʊ/', 'v.', '遵循；跟随', 'Follow me, please.', '行为与动作', '请跟我来。', {
            phrases: [{en:'follow me', zh:'跟我来'}, {en:'follow the rules', zh:'遵守规则'}],
            
            extraExamples: [
              {en:'Follow me, please.', zh:'请跟我来。'},
              {en:'You should follow the teacher\u2019s advice.', zh:'你应该听从老师的建议。'},
            ],
          }),
          w('j7b2-4', 'arrive', '/əˈraɪv/', 'v.', '到达', 'We arrive at school at eight.', '行为与动作', '我们八点到校。', {
            phrases: [{en:'arrive at school', zh:'到达学校'}, {en:'arrive in Beijing', zh:'到达北京'}],
            
            extraExamples: [
              {en:'We arrive at school at eight.', zh:'我们八点到校。'},
              {en:'What time do you arrive home?', zh:'你几点到家？'},
            ],
          }),
          w('j7b2-5', 'hallway', '/ˈhɔːlweɪ/', 'n.', '走廊；过道', 'Don\u2019t run in the hallway.', '社会与环境', '不要在走廊里跑。', {
            phrases: [{en:'in the hallway', zh:'在走廊里'}, {en:'walk down the hallway', zh:'沿走廊走'}],
            
            extraExamples: [
              {en:'Don\u2019t run in the hallway.', zh:'不要在走廊里跑。'},
              {en:'There is a locker in the hallway.', zh:'走廊里有个储物柜。'},
            ],
          }),
          w('j7b2-6', 'uniform', '/ˈjuːnɪfɔːm/', 'n.', '制服', 'Students wear uniforms.', '社会与环境', '学生穿校服。', {
            phrases: [{en:'school uniform', zh:'校服'}, {en:'wear a uniform', zh:'穿制服'}],
            
            extraExamples: [
              {en:'Students wear uniforms on Monday.', zh:'学生周一穿校服。'},
              {en:'The police officer wears a uniform.', zh:'警察穿着制服。'},
            ],
          }),
          w('j7b2-7', 'litter', '/ˈlɪtə(r)/', 'v.', '乱扔 n. 垃圾', 'Don\u2019t litter.', '行为与动作', '不要乱扔垃圾。', {
            phrases: [{en:'don\u2019t litter', zh:'不要乱扔垃圾'}, {en:'pick up litter', zh:'捡垃圾'}],
            
            extraExamples: [
              {en:'Don\u2019t litter in the park.', zh:'不要在公园里乱扔垃圾。'},
              {en:'Pick up the litter, please.', zh:'请把垃圾捡起来。'},
            ],
          }),
          w('j7b2-8', 'polite', '/pəˈlaɪt/', 'adj.', '有礼貌的', 'Be polite to others.', '情感与性格', '对人要有礼貌。', {
            phrases: [{en:'be polite to others', zh:'对人有礼貌'}, {en:'a polite boy', zh:'有礼貌的男孩'}],
            
            extraExamples: [
              {en:'Be polite to others.', zh:'对人要有礼貌。'},
              {en:'He is a polite boy.', zh:'他是个有礼貌的男孩。'},
            ],
          }),
          w('j7b2-9', 'respect', '/rɪˈspekt/', 'v.', '尊敬 n. 尊重', 'We respect our teachers.', '行为与动作', '我们尊敬老师。', {
            phrases: [{en:'respect teachers', zh:'尊敬老师'}, {en:'show respect for...', zh:'对……表示尊重'}],
            
            extraExamples: [
              {en:'We should respect our teachers.', zh:'我们应该尊敬老师。'},
              {en:'Respect old people.', zh:'尊重老人。'},
            ],
          }),
          w('j7b2-10', 'jacket', '/ˈdʒækɪt/', 'n.', '夹克衫', 'He wears a blue jacket.', '社会与环境', '他穿着蓝夹克。', {
            phrases: [{en:'a blue jacket', zh:'蓝色夹克'}, {en:'put on your jacket', zh:'穿上夹克'}],
            
            extraExamples: [
              {en:'He wears a blue jacket.', zh:'他穿着蓝色夹克。'},
              {en:'Put on your jacket. It\u2019s cold.', zh:'穿上夹克，天很冷。'},
            ],
          }),
          w('j7b2-11', 'lend', '/lend/', 'v.', '借给；借出', 'Can you lend me a pen?', '行为与动作', '能借我支笔吗？', {
            phrases: [{en:'lend sb. sth.', zh:'把某物借给某人'}, {en:'lend sth. to sb.', zh:'把某物借给某人'}],
            
            extraExamples: [
              {en:'Can you lend me a pen?', zh:'能借我支笔吗？'},
              {en:'I lent my bike to Tom.', zh:'我把自行车借给了汤姆。'},
            ],
          }),
          w('j7b2-12', 'snack', '/snæk/', 'n.', '点心；小吃', 'I eat a snack after school.', '社会与环境', '放学后我吃点心。', {
            phrases: [{en:'a healthy snack', zh:'健康小吃'}, {en:'have a snack', zh:'吃点心'}],
            
            extraExamples: [
              {en:'I eat a snack after school.', zh:'放学后我吃点心。'},
              {en:'Fruit is a healthy snack.', zh:'水果是健康的小吃。'},
            ],
          }),
          w('j7b2-13', 'queue', '/kjuː/', 'n.', '队；行列 v. 排队', 'Please stand in a queue.', '社会与环境', '请排队。', {
            phrases: [{en:'stand in a queue', zh:'排队站着'}, {en:'jump the queue', zh:'插队'}],
            
            extraExamples: [
              {en:'Please stand in a queue.', zh:'请排队。'},
              {en:'We queued for the bus.', zh:'我们排队等公交车。'},
            ],
          }),
          w('j7b2-14', 'leave', '/liːv/', 'v.', '离开；留下', 'Don\u2019t leave your bag here.', '行为与动作', '别把包留在这里。', {
            phrases: [{en:'leave home', zh:'离开家'}, {en:'leave sth. somewhere', zh:'把某物留在某处'}],
            
            extraExamples: [
              {en:'Don\u2019t leave your bag here.', zh:'别把包留在这里。'},
              {en:'What time do you leave home?', zh:'你几点离开家？'},
            ],
          }),
          w('j7b2-15', 'absent', '/ˈæbsənt/', 'adj.', '缺席的；不在的', 'He is absent today.', '品质与状态', '他今天缺席。', {
            phrases: [{en:'be absent from...', zh:'缺席……'}, {en:'an absent student', zh:'缺席的学生'}],
            
            extraExamples: [
              {en:'He is absent today.', zh:'他今天缺席。'},
              {en:'Why were you absent from class?', zh:'你为什么缺课？'},
            ],
          }),
          w('j7b2-16', 'quietly', '/ˈkwaɪətli/', 'adv.', '轻声地；安静地', 'Please read quietly.', '认知与学术', '请轻声朗读。', {
            phrases: [{en:'read quietly', zh:'轻声读'}, {en:'sit quietly', zh:'安静地坐着'}],
            
            extraExamples: [
              {en:'Please read quietly.', zh:'请轻声朗读。'},
              {en:'He sat quietly in the corner.', zh:'他安静地坐在角落里。'},
            ],
          }),
          w('j7b2-17', 'noise', '/nɔɪz/', 'n.', '声音；噪声', 'Don\u2019t make noise.', '社会与环境', '不要吵闹。', {
            phrases: [{en:'make noise', zh:'吵闹'}, {en:'too much noise', zh:'太吵'}],
            
            extraExamples: [
              {en:'Don\u2019t make noise in the library.', zh:'图书馆里不要吵闹。'},
              {en:'The noise is too loud.', zh:'噪音太大了。'},
            ],
          }),
          w('j7b2-18', 'relax', '/rɪˈlæks/', 'v.', '放松；休息', 'We relax after class.', '行为与动作', '我们课后放松。', {
            phrases: [{en:'relax oneself', zh:'放松自己'}, {en:'relax after class', zh:'课后放松'}],
            
            extraExamples: [
              {en:'We relax after class.', zh:'我们课后放松。'},
              {en:'Listen to music to relax.', zh:'听音乐放松一下。'},
            ],
          }),
          w('j7b2-19', 'advice', '/ədˈvaɪs/', 'n.', '建议；意见', 'She gives me good advice.', '认知与学术', '她给我好建议。', {
            phrases: [{en:'give advice', zh:'给出建议'}, {en:'a piece of advice', zh:'一条建议'}],
            
            extraExamples: [
              {en:'She gives me good advice.', zh:'她给我好建议。'},
              {en:'Can you give me some advice?', zh:'你能给我一些建议吗？'},
            ],
          }),
          w('j7b2-20', 'lend sb sth', '/lend/', 'phr.', '把某物借给某人', 'Lend me your book.', '行为与动作', '把你的书借给我。', {
            phrases: [{en:'lend me your book', zh:'把你的书借给我'}, {en:'lend me a hand', zh:'帮我一把'}],
            
            extraExamples: [
              {en:'Lend me your book, please.', zh:'请把你的书借给我。'},
              {en:'Can you lend me a hand?', zh:'你能帮我一下吗？'},
            ],
          }),
          w('j7b2-21', 'on time', '/ɒn taɪm/', 'phr.', '准时', 'Arrive on time.', '认知与学术', '准时到达。', {
            phrases: [{en:'arrive on time', zh:'准时到达'}, {en:'be on time', zh:'准时'}],
            
            extraExamples: [
              {en:'Arrive on time, please.', zh:'请准时到达。'},
              {en:'The train arrived on time.', zh:'火车准时到达。'},
            ],
          }),
          w('j7b2-22', 'in line', '/ɪn laɪn/', 'phr.', '成一排', 'Stand in line.', '社会与环境', '站成一排。', {
            phrases: [{en:'stand in line', zh:'站成一排'}, {en:'wait in line', zh:'排队等候'}],
            
            extraExamples: [
              {en:'Stand in line, please.', zh:'请站成一排。'},
              {en:'We waited in line for tickets.', zh:'我们排队等票。'},
            ],
          }),
          w('j7b2-23', 'break the rule', '/breɪk ðə ruːl/', 'phr.', '违反规则', 'Don\u2019t break the rules.', '行为与动作', '不要违反规则。', {
            phrases: [{en:'break the rules', zh:'违反规则'}, {en:'break a rule', zh:'违反一条规则'}],
            
            extraExamples: [
              {en:'Don\u2019t break the rules.', zh:'不要违反规则。'},
              {en:'Anyone who breaks the rules will be punished.', zh:'违反规则的人会受到惩罚。'},
            ],
          }),
          w('j7b2-24', 'skateboarding', '/ˈskeɪtbɔːdɪŋ/', 'n.', '滑板运动', 'Skateboarding is not allowed here.', '社会与环境', '这里不许滑板。', {
            phrases: [{en:'go skateboarding', zh:'去滑板'}, {en:'a skateboarding park', zh:'滑板公园'}],
            
            extraExamples: [
              {en:'Skateboarding is not allowed here.', zh:'这里不许滑板。'},
              {en:'He goes skateboarding every weekend.', zh:'他每个周末去滑板。'},
            ],
          }),
          w('j7b2-25', 'allow', '/əˈlaʊ/', 'v.', '允许；准许', 'Smoking is not allowed.', '行为与动作', '不许吸烟。', {
            phrases: [{en:'be allowed to do sth.', zh:'被允许做某事'}, {en:'allow smoking', zh:'允许吸烟'}],
            
            extraExamples: [
              {en:'Smoking is not allowed here.', zh:'这里不许吸烟。'},
              {en:'We are allowed to play sports after class.', zh:'我们课后可以做运动。'},
            ],
          }),
          w('j7b2-26', 'salute', '/səˈluːt/', 'v.', '敬礼；致敬', 'We salute the flag.', '行为与动作', '我们向国旗敬礼。', {
            phrases: [{en:'salute the flag', zh:'向国旗敬礼'}, {en:'salute to...', zh:'向……致敬'}],
            
            extraExamples: [
              {en:'We salute the flag every Monday.', zh:'我们每周一向国旗敬礼。'},
              {en:'He saluted the soldiers.', zh:'他向士兵们敬礼。'},
            ],
          }),
          w('j7b2-27', 'uniform', '/ˈjuːnɪfɔːm/', 'n.', '制服；校服', 'We must wear school uniforms.', '社会与环境', '我们必须穿校服。', {
            phrases: [{en:'school uniform', zh:'校服'}, {en:'wear uniforms', zh:'穿校服'}],
            
            extraExamples: [
              {en:'We must wear school uniforms.', zh:'我们必须穿校服。'},
              {en:'Our school uniforms are blue and white.', zh:'我们的校服是蓝白色的。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 3 · Keep Fit',
        words: [
          w('j7b3-1', 'fit', '/fɪt/', 'adj.', '健康的；健壮的 v. 适合', 'He keeps fit by running.', '品质与状态', '他靠跑步保持健康。', {
            phrases: [{en:'keep fit', zh:'保持健康'}, {en:'fit sb.', zh:'适合某人'}],
            
            extraExamples: [
              {en:'He keeps fit by running.', zh:'他靠跑步保持健康。'},
              {en:'This shirt fits you well.', zh:'这件衬衫你穿很合身。'},
            ],
          }),
          w('j7b3-2', 'baseball', '/ˈbeɪsbɔːl/', 'n.', '棒球（运动）', 'We play baseball.', '社会与环境', '我们打棒球。', {
            phrases: [{en:'play baseball', zh:'打棒球'}, {en:'a baseball game', zh:'棒球比赛'}],
            
            extraExamples: [
              {en:'We play baseball after school.', zh:'我们放学后打棒球。'},
              {en:'Baseball is popular in America.', zh:'棒球在美国很流行。'},
            ],
          }),
          w('j7b3-3', 'rope', '/rəʊp/', 'n.', '绳子；粗绳', 'Jump rope is good exercise.', '社会与环境', '跳绳是很好的运动。', {
            phrases: [{en:'jump rope', zh:'跳绳'}, {en:'a piece of rope', zh:'一根绳子'}],
            
            extraExamples: [
              {en:'Jump rope is good exercise.', zh:'跳绳是很好的运动。'},
              {en:'He tied the box with a rope.', zh:'他用绳子把盒子捆起来。'},
            ],
          }),
          w('j7b3-4', 'racket', '/ˈrækɪt/', 'n.', '球拍', 'She has a new tennis racket.', '社会与环境', '她有个新网球拍。', {
            phrases: [{en:'a tennis racket', zh:'网球拍'}, {en:'a badminton racket', zh:'羽毛球拍'}],
            
            extraExamples: [
              {en:'She has a new tennis racket.', zh:'她有个新网球拍。'},
              {en:'I need a new badminton racket.', zh:'我需要一个新羽毛球拍。'},
            ],
          }),
          w('j7b3-5', 'hardly', '/ˈhɑːdli/', 'adv.', '几乎不', 'I hardly ever watch TV.', '认知与学术', '我几乎不看电视。', {
            phrases: [{en:'hardly ever', zh:'几乎从不'}, {en:'hardly any', zh:'几乎没有'}],
            
            extraExamples: [
              {en:'I hardly ever watch TV.', zh:'我几乎不看电视。'},
              {en:'He can hardly believe it.', zh:'他几乎不敢相信。'},
            ],
          }),
          w('j7b3-6', 'once', '/wʌns/', 'adv.', '一次；曾经', 'I play basketball once a week.', '认知与学术', '我一周打一次篮球。', {
            phrases: [{en:'once a week', zh:'一周一次'}, {en:'at once', zh:'立刻'}],
            
            extraExamples: [
              {en:'I play basketball once a week.', zh:'我一周打一次篮球。'},
              {en:'I once lived in Beijing.', zh:'我曾经住在北京。'},
            ],
          }),
          w('j7b3-7', 'twice', '/twaɪs/', 'adv.', '两次；两倍', 'Brush teeth twice a day.', '认知与学术', '一天刷两次牙。', {
            phrases: [{en:'twice a day', zh:'一天两次'}, {en:'twice a week', zh:'一周两次'}],
            
            extraExamples: [
              {en:'Brush your teeth twice a day.', zh:'一天刷两次牙。'},
              {en:'I exercise twice a week.', zh:'我一周锻炼两次。'},
            ],
          }),
          w('j7b3-8', 'mine', '/maɪn/', 'pron.', '我的（所有物）', 'This book is mine.', '认知与学术', '这本书是我的。', {
            phrases: [{en:'a friend of mine', zh:'我的一个朋友'}, {en:'This book is mine.', zh:'这本书是我的。'}],
            
            extraExamples: [
              {en:'This book is mine.', zh:'这本书是我的。'},
              {en:'He is a friend of mine.', zh:'他是我的一个朋友。'},
            ],
          }),
          w('j7b3-9', 'hers', '/hɜːz/', 'pron.', '她的（所有物）', 'The bag is hers.', '认知与学术', '这个包是她的。', {
            phrases: [{en:'The bag is hers.', zh:'包是她的'}, {en:'a friend of hers', zh:'她的一个朋友'}],
            
            extraExamples: [
              {en:'The bag is hers.', zh:'这个包是她的。'},
              {en:'This pen is hers.', zh:'这支笔是她的。'},
            ],
          }),
          w('j7b3-10', 'perfect', '/ˈpɜːfɪkt/', 'adj.', '完美的；极好的', 'The weather is perfect.', '品质与状态', '天气完美。', {
            phrases: [{en:'perfect weather', zh:'完美的天气'}, {en:'a perfect day', zh:'完美的一天'}],
            
            extraExamples: [
              {en:'The weather is perfect today.', zh:'今天天气完美。'},
              {en:'Nobody is perfect.', zh:'没有人是完美的。'},
            ],
          }),
          w('j7b3-11', 'seldom', '/ˈseldəm/', 'adv.', '很少；不常', 'I seldom eat fast food.', '认知与学术', '我很少吃快餐。', {
            phrases: [{en:'seldom eat fast food', zh:'很少吃快餐'}, {en:'seldom go out', zh:'很少出门'}],
            
            extraExamples: [
              {en:'I seldom eat fast food.', zh:'我很少吃快餐。'},
              {en:'She seldom watches TV.', zh:'她很少看电视。'},
            ],
          }),
          w('j7b3-12', 'badminton', '/ˈbædmɪntən/', 'n.', '羽毛球运动', 'We play badminton.', '社会与环境', '我们打羽毛球。', {
            phrases: [{en:'play badminton', zh:'打羽毛球'}, {en:'a badminton match', zh:'羽毛球比赛'}],
            
            extraExamples: [
              {en:'We play badminton on weekends.', zh:'我们周末打羽毛球。'},
              {en:'Badminton is my favourite sport.', zh:'羽毛球是我最喜欢的运动。'},
            ],
          }),
          w('j7b3-13', 'volleyball', '/ˈvɒlibɔːl/', 'n.', '排球（运动）', 'They watch a volleyball match.', '社会与环境', '他们看排球比赛。', {
            phrases: [{en:'play volleyball', zh:'打排球'}, {en:'a volleyball match', zh:'排球比赛'}],
            
            extraExamples: [
              {en:'They watch a volleyball match.', zh:'他们看排球比赛。'},
              {en:'We play volleyball after school.', zh:'我们放学后打排球。'},
            ],
          }),
          w('j7b3-14', 'jog', '/dʒɒɡ/', 'v.', '慢跑', 'He jogs every morning.', '行为与动作', '他每天早上慢跑。', {
            phrases: [{en:'jog every morning', zh:'每天早上慢跑'}, {en:'go jogging', zh:'去慢跑'}],
            
            extraExamples: [
              {en:'He jogs every morning.', zh:'他每天早上慢跑。'},
              {en:'I go jogging in the park.', zh:'我去公园慢跑。'},
            ],
          }),
          w('j7b3-15', 'belong', '/bɪˈlɒŋ/', 'v.', '属于', 'This book belongs to me.', '行为与动作', '这本书是我的。', {
            phrases: [{en:'belong to sb.', zh:'属于某人'}, {en:'belong here', zh:'属于这里'}],
            
            extraExamples: [
              {en:'This book belongs to me.', zh:'这本书是我的。'},
              {en:'Who does this bag belong to?', zh:'这个包是谁的？'},
            ],
          }),
          w('j7b3-16', 'sleepy', '/ˈsliːpi/', 'adj.', '困倦的；想睡的', 'I feel sleepy.', '情感与性格', '我觉得困。', {
            phrases: [{en:'feel sleepy', zh:'觉得困'}, {en:'a sleepy child', zh:'犯困的孩子'}],
            
            extraExamples: [
              {en:'I feel sleepy in class.', zh:'我上课觉得困。'},
              {en:'The baby looks sleepy.', zh:'宝宝看起来困了。'},
            ],
          }),
          w('j7b3-17', 'encourage', '/ɪnˈkʌrɪdʒ/', 'v.', '鼓励；激励', 'She encourages me.', '行为与动作', '她鼓励我。', {
            phrases: [{en:'encourage sb. to do sth.', zh:'鼓励某人做某事'}, {en:'encourage me', zh:'鼓励我'}],
            
            extraExamples: [
              {en:'She encourages me to study hard.', zh:'她鼓励我努力学习。'},
              {en:'My teacher encourages me.', zh:'我的老师鼓励我。'},
            ],
          }),
          w('j7b3-18', 'succeed', '/səkˈsiːd/', 'v.', '成功；达到目标', 'Work hard and you will succeed.', '行为与动作', '努力就会成功。', {
            phrases: [{en:'succeed in doing sth.', zh:'成功做某事'}, {en:'work hard and succeed', zh:'努力并成功'}],
            
            extraExamples: [
              {en:'Work hard and you will succeed.', zh:'努力就会成功。'},
              {en:'He succeeded in passing the exam.', zh:'他成功通过了考试。'},
            ],
          }),
          w('j7b3-19', 'progress', '/ˈprəʊɡres/', 'n.', '进步；进展', 'You have made great progress.', '认知与学术', '你进步很大。', {
            phrases: [{en:'make progress', zh:'取得进步'}, {en:'great progress', zh:'很大进步'}],
            
            extraExamples: [
              {en:'You have made great progress.', zh:'你进步很大。'},
              {en:'She is making progress in English.', zh:'她英语在进步。'},
            ],
          }),
          w('j7b3-20', 'team', '/tiːm/', 'n.', '队；组', 'Our team wins.', '社会与环境', '我们队赢了。', {
            phrases: [{en:'our team', zh:'我们队'}, {en:'a team of...', zh:'一队……'}],
            
            extraExamples: [
              {en:'Our team wins the game.', zh:'我们队赢了比赛。'},
              {en:'He is on the basketball team.', zh:'他是篮球队的。'},
            ],
          }),
          w('j7b3-21', 'exercise', '/ˈeksəsaɪz/', 'n.', '锻炼；练习 v. 锻炼', 'Take more exercise.', '行为与动作', '多锻炼。', {
            phrases: [{en:'take exercise', zh:'锻炼'}, {en:'do morning exercises', zh:'做早操'}],
            
            extraExamples: [
              {en:'Take more exercise.', zh:'多锻炼。'},
              {en:'You should exercise every day.', zh:'你应该每天锻炼。'},
            ],
          }),
          w('j7b3-22', 'healthy', '/ˈhelθi/', 'adj.', '健康的', 'Eat healthy food.', '品质与状态', '吃健康食物。', {
            phrases: [{en:'healthy food', zh:'健康食物'}, {en:'keep healthy', zh:'保持健康'}],
            
            extraExamples: [
              {en:'Eat healthy food.', zh:'吃健康食物。'},
              {en:'Exercise keeps you healthy.', zh:'锻炼让你健康。'},
            ],
          }),
          w('j7b3-23', 'illness', '/ˈɪlnəs/', 'n.', '疾病', 'Exercise prevents illness.', '认知与学术', '锻炼预防疾病。', {
            phrases: [{en:'prevent illness', zh:'预防疾病'}, {en:'a serious illness', zh:'重病'}],
            
            extraExamples: [
              {en:'Exercise prevents illness.', zh:'锻炼预防疾病。'},
              {en:'He stayed home because of illness.', zh:'他因病在家。'},
            ],
          }),
          w('j7b3-24', 'weak', '/wiːk/', 'adj.', '虚弱的；弱的', 'He felt weak after illness.', '品质与状态', '他病后觉得虚弱。', {
            phrases: [{en:'feel weak', zh:'觉得虚弱'}, {en:'a weak heart', zh:'心脏弱'}],
            
            extraExamples: [
              {en:'He felt weak after illness.', zh:'他病后觉得虚弱。'},
              {en:'Her legs feel weak.', zh:'她腿发软。'},
            ],
          }),
          w('j7b3-25', 'energetic', '/ˌenəˈdʒetɪk/', 'adj.', '精力充沛的', 'He is an energetic boy.', '品质与状态', '他是个精力充沛的男孩。', {
            phrases: [{en:'an energetic boy', zh:'精力充沛的男孩'}, {en:'feel energetic', zh:'感到精力充沛'}],
            
            extraExamples: [
              {en:'He is an energetic boy.', zh:'他是个精力充沛的男孩。'},
              {en:'I feel energetic after exercise.', zh:'锻炼后我感到精力充沛。'},
            ],
          }),
          w('j7b3-26', 'build up', '/bɪld ʌp/', 'phr.', '增强；建立', 'Exercise builds up your body.', '行为与动作', '锻炼增强体质。', {
            phrases: [{en:'build up your body', zh:'增强体质'}, {en:'build up confidence', zh:'建立信心'}],
            
            extraExamples: [
              {en:'Exercise builds up your body.', zh:'锻炼增强体质。'},
              {en:'Reading builds up your confidence.', zh:'阅读建立你的信心。'},
            ],
          }),
          w('j7b3-27', 'keep fit', '/kiːp fɪt/', 'phr.', '保持健康', 'Run every day to keep fit.', '行为与动作', '每天跑步保持健康。', {
            phrases: [{en:'run to keep fit', zh:'跑步保持健康'}, {en:'keep fit and healthy', zh:'保持健康'}],
            
            extraExamples: [
              {en:'Run every day to keep fit.', zh:'每天跑步保持健康。'},
              {en:'She swims to keep fit.', zh:'她游泳保持健康。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 4 · Eat Well',
        words: [
          w('j7b4-1', 'watermelon', '/ˈwɔːtəmelən/', 'n.', '西瓜', 'The watermelon is sweet.', '社会与环境', '西瓜很甜。', {
            phrases: [{en:'a slice of watermelon', zh:'一块西瓜'}, {en:'watermelon juice', zh:'西瓜汁'}],
            
            extraExamples: [
              {en:'The watermelon is sweet.', zh:'西瓜很甜。'},
              {en:'I like watermelon in summer.', zh:'我夏天喜欢吃西瓜。'},
            ],
          }),
          w('j7b4-2', 'cabbage', '/ˈkæbɪdʒ/', 'n.', '卷心菜；甘蓝', 'I like cabbage.', '社会与环境', '我喜欢卷心菜。', {
            phrases: [{en:'Chinese cabbage', zh:'大白菜'}, {en:'cabbage soup', zh:'卷心菜汤'}],
            
            extraExamples: [
              {en:'I like cabbage salad.', zh:'我喜欢卷心菜沙拉。'},
              {en:'Cabbage is a healthy vegetable.', zh:'卷心菜是健康蔬菜。'},
            ],
          }),
          w('j7b4-3', 'cookie', '/ˈkʊki/', 'n.', '曲奇饼；小甜饼', 'She bakes cookies.', '社会与环境', '她烤饼干。', {
            phrases: [{en:'bake cookies', zh:'烤饼干'}, {en:'a chocolate cookie', zh:'巧克力曲奇'}],
            
            extraExamples: [
              {en:'She bakes cookies for us.', zh:'她给我们烤饼干。'},
              {en:'I want a chocolate cookie.', zh:'我想要一块巧克力曲奇。'},
            ],
          }),
          w('j7b4-4', 'onion', '/ˈʌnjən/', 'n.', '洋葱；葱头', 'Onions make me cry.', '社会与环境', '洋葱让我流泪。', {
            phrases: [{en:'chop onions', zh:'切洋葱'}, {en:'onion soup', zh:'洋葱汤'}],
            
            extraExamples: [
              {en:'Onions make me cry.', zh:'洋葱让我流泪。'},
              {en:'I don\u2019t like raw onions.', zh:'我不喜欢生洋葱。'},
            ],
          }),
          w('j7b4-5', 'dumpling', '/ˈdʌmplɪŋ/', 'n.', '饺子', 'We eat dumplings at Spring Festival.', '社会与环境', '春节我们吃饺子。', {
            phrases: [{en:'make dumplings', zh:'包饺子'}, {en:'boiled dumplings', zh:'水饺'}],
            
            extraExamples: [
              {en:'We eat dumplings at Spring Festival.', zh:'春节我们吃饺子。'},
              {en:'Mom is making dumplings.', zh:'妈妈在包饺子。'},
            ],
          }),
          w('j7b4-6', 'coffee', '/ˈkɒfi/', 'n.', '咖啡', 'He drinks coffee.', '社会与环境', '他喝咖啡。', {
            phrases: [{en:'a cup of coffee', zh:'一杯咖啡'}, {en:'black coffee', zh:'黑咖啡'}],
            
            extraExamples: [
              {en:'He drinks coffee every morning.', zh:'他每天早上喝咖啡。'},
              {en:'Would you like a cup of coffee?', zh:'你想喝杯咖啡吗？'},
            ],
          }),
          w('j7b4-7', 'salad', '/ˈsæləd/', 'n.', '沙拉；色拉', 'I have a vegetable salad.', '社会与环境', '我吃蔬菜沙拉。', {
            phrases: [{en:'a vegetable salad', zh:'蔬菜沙拉'}, {en:'fruit salad', zh:'水果沙拉'}],
            
            extraExamples: [
              {en:'I have a vegetable salad for lunch.', zh:'我午餐吃蔬菜沙拉。'},
              {en:'Fruit salad is sweet.', zh:'水果沙拉很甜。'},
            ],
          }),
          w('j7b4-8', 'taste', '/teɪst/', 'v.', '尝起来 n. 味道', 'The soup tastes good.', '行为与动作', '这汤味道不错。', {
            phrases: [{en:'taste good', zh:'尝起来不错'}, {en:'taste like...', zh:'尝起来像……'}],
            
            extraExamples: [
              {en:'The soup tastes good.', zh:'这汤味道不错。'},
              {en:'The cake tastes like chocolate.', zh:'这蛋糕尝起来像巧克力。'},
            ],
          }),
          w('j7b4-9', 'dish', '/dɪʃ/', 'n.', '一道菜；盘', 'This is my favourite dish.', '社会与环境', '这是我最喜欢的菜。', {
            phrases: [{en:'my favourite dish', zh:'我最喜欢的菜'}, {en:'wash the dishes', zh:'洗碗'}],
            
            extraExamples: [
              {en:'This is my favourite dish.', zh:'这是我最喜欢的菜。'},
              {en:'Please wash the dishes after dinner.', zh:'晚饭后请洗碗。'},
            ],
          }),
          w('j7b4-10', 'meal', '/miːl/', 'n.', '一餐；早（午、晚）餐', 'We have three meals a day.', '社会与环境', '我们一天吃三顿饭。', {
            phrases: [{en:'three meals a day', zh:'一天三顿饭'}, {en:'have a meal', zh:'吃饭'}],
            
            extraExamples: [
              {en:'We have three meals a day.', zh:'我们一天吃三顿饭。'},
              {en:'Breakfast is the most important meal.', zh:'早餐是最重要的一餐。'},
            ],
          }),
          w('j7b4-11', 'pork', '/pɔːk/', 'n.', '猪肉', 'I like pork.', '社会与环境', '我喜欢猪肉。', {
            phrases: [{en:'pork chops', zh:'猪排'}, {en:'pork and cabbage', zh:'猪肉白菜'}],
            
            extraExamples: [
              {en:'I like pork dumplings.', zh:'我喜欢猪肉饺子。'},
              {en:'Pork is popular in China.', zh:'猪肉在中国很受欢迎。'},
            ],
          }),
          w('j7b4-12', 'strawberry', '/ˈstrɔːbəri/', 'n.', '草莓', 'The strawberry is red.', '社会与环境', '草莓是红色的。', {
            phrases: [{en:'strawberry juice', zh:'草莓汁'}, {en:'a bowl of strawberries', zh:'一碗草莓'}],
            
            extraExamples: [
              {en:'The strawberry is red and sweet.', zh:'草莓又红又甜。'},
              {en:'I like strawberry ice cream.', zh:'我喜欢草莓冰淇淋。'},
            ],
          }),
          w('j7b4-13', 'menu', '/ˈmenjuː/', 'n.', '菜单', 'Let\u2019s look at the menu.', '认知与学术', '我们看看菜单。', {
            phrases: [{en:'look at the menu', zh:'看菜单'}, {en:'on the menu', zh:'菜单上有'}],
            
            extraExamples: [
              {en:'Let\u2019s look at the menu.', zh:'我们看看菜单。'},
              {en:'What\u2019s on the menu today?', zh:'今天菜单上有什么？'},
            ],
          }),
          w('j7b4-14', 'customer', '/ˈkʌstəmə(r)/', 'n.', '顾客', 'The customer is happy.', '社会与环境', '顾客很满意。', {
            phrases: [{en:'a happy customer', zh:'满意的顾客'}, {en:'customer service', zh:'客户服务'}],
            
            extraExamples: [
              {en:'The customer is happy.', zh:'顾客很满意。'},
              {en:'We should serve every customer well.', zh:'我们应该服务好每一位顾客。'},
            ],
          }),
          w('j7b4-15', 'sugar', '/ˈʃʊɡə(r)/', 'n.', '糖', 'Don\u2019t eat too much sugar.', '社会与环境', '别吃太多糖。', {
            phrases: [{en:'too much sugar', zh:'太多糖'}, {en:'a spoon of sugar', zh:'一勺糖'}],
            
            extraExamples: [
              {en:'Don\u2019t eat too much sugar.', zh:'别吃太多糖。'},
              {en:'Do you take sugar in your tea?', zh:'你茶里放糖吗？'},
            ],
          }),
          w('j7b4-16', 'habit', '/ˈhæbɪt/', 'n.', '习惯', 'Eating well is a good habit.', '认知与学术', '吃得好是好习惯。', {
            phrases: [{en:'a good habit', zh:'好习惯'}, {en:'develop a habit', zh:'养成习惯'}],
            
            extraExamples: [
              {en:'Eating well is a good habit.', zh:'吃得好是好习惯。'},
              {en:'Reading every day is a good habit.', zh:'每天读书是好习惯。'},
            ],
          }),
          w('j7b4-17', 'weight', '/weɪt/', 'n.', '体重；重量', 'He is watching his weight.', '认知与学术', '他在注意体重。', {
            phrases: [{en:'watch one\u2019s weight', zh:'注意体重'}, {en:'lose weight', zh:'减肥'}],
            
            extraExamples: [
              {en:'He is watching his weight.', zh:'他在注意体重。'},
              {en:'She wants to lose weight.', zh:'她想减肥。'},
            ],
          }),
          w('j7b4-18', 'balanced', '/ˈbælənst/', 'adj.', '均衡的；平衡的', 'Eat a balanced diet.', '品质与状态', '饮食要均衡。', {
            phrases: [{en:'a balanced diet', zh:'均衡饮食'}, {en:'balanced meals', zh:'均衡的餐食'}],
            
            extraExamples: [
              {en:'Eat a balanced diet.', zh:'饮食要均衡。'},
              {en:'A balanced diet keeps you healthy.', zh:'均衡饮食让你健康。'},
            ],
          }),
          w('j7b4-19', 'energy', '/ˈenədʒi/', 'n.', '能量；精力', 'Food gives us energy.', '认知与学术', '食物给我们能量。', {
            phrases: [{en:'give us energy', zh:'给我们能量'}, {en:'full of energy', zh:'精力充沛'}],
            
            extraExamples: [
              {en:'Food gives us energy.', zh:'食物给我们能量。'},
              {en:'He is full of energy.', zh:'他精力充沛。'},
            ],
          }),
          w('j7b4-20', 'thirsty', '/ˈθɜːsti/', 'adj.', '渴的', 'I am thirsty.', '品质与状态', '我渴了。', {
            phrases: [{en:'be thirsty', zh:'口渴'}, {en:'feel thirsty', zh:'觉得渴'}],
            
            extraExamples: [
              {en:'I am thirsty. Can I have some water?', zh:'我渴了，能喝点水吗？'},
              {en:'The boy feels thirsty after running.', zh:'男孩跑步后觉得渴。'},
            ],
          }),
          w('j7b4-21', 'vegetable', '/ˈvedʒtəbl/', 'n.', '蔬菜', 'Eat more vegetables.', '社会与环境', '多吃蔬菜。', {
            phrases: [{en:'green vegetables', zh:'绿色蔬菜'}, {en:'eat more vegetables', zh:'多吃蔬菜'}],
            
            extraExamples: [
              {en:'Eat more vegetables every day.', zh:'每天多吃蔬菜。'},
              {en:'Carrots are my favourite vegetable.', zh:'胡萝卜是我最喜欢的蔬菜。'},
            ],
          }),
          w('j7b4-22', 'fried', '/fraɪd/', 'adj.', '油炸的', 'Fried food is not healthy.', '品质与状态', '油炸食品不健康。', {
            phrases: [{en:'fried food', zh:'油炸食品'}, {en:'fried chicken', zh:'炸鸡'}],
            
            extraExamples: [
              {en:'Fried food is not healthy.', zh:'油炸食品不健康。'},
              {en:'I don\u2019t like fried chicken.', zh:'我不喜欢炸鸡。'},
            ],
          }),
          w('j7b4-23', 'spicy', '/ˈspaɪsi/', 'adj.', '辣的', 'I like spicy food.', '品质与状态', '我喜欢辣的食物。', {
            phrases: [{en:'spicy food', zh:'辣的食物'}, {en:'too spicy', zh:'太辣'}],
            
            extraExamples: [
              {en:'I like spicy food.', zh:'我喜欢辣的食物。'},
              {en:'This dish is too spicy for me.', zh:'这道菜对我来说太辣了。'},
            ],
          }),
          w('j7b4-24', 'balanced diet', '/ˈbælənst ˈdaɪət/', 'n.', '均衡饮食', 'Keep a balanced diet.', '认知与学术', '保持均衡饮食。', {
            phrases: [{en:'keep a balanced diet', zh:'保持均衡饮食'}, {en:'a healthy balanced diet', zh:'健康的均衡饮食'}],
            
            extraExamples: [
              {en:'Keep a balanced diet.', zh:'保持均衡饮食。'},
              {en:'A balanced diet is important.', zh:'均衡饮食很重要。'},
            ],
          }),
          w('j7b4-25', 'order', '/ˈɔːdə(r)/', 'v.', '点餐；订购 n. 订单', 'Order the fish, please.', '行为与动作', '请点鱼。', {
            phrases: [{en:'order food', zh:'点餐'}, {en:'order a meal', zh:'点一份餐'}],
            
            extraExamples: [
              {en:'Order the fish, please.', zh:'请点鱼。'},
              {en:'May I take your order?', zh:'您可以点菜了吗？'},
            ],
          }),
          w('j7b4-26', 'bill', '/bɪl/', 'n.', '账单', 'Pay the bill, please.', '认知与学术', '请付账单。', {
            phrases: [{en:'pay the bill', zh:'付账单'}, {en:'the bill, please', zh:'请结账'}],
            
            extraExamples: [
              {en:'Pay the bill, please.', zh:'请付账单。'},
              {en:'Can I have the bill?', zh:'请把账单给我好吗？'},
            ],
          }),
          w('j7b4-27', 'special', '/ˈspeʃl/', 'n.', '特色菜 adj. 特别的', 'Today\u2019s special is fish.', '社会与环境', '今天的特色菜是鱼。', {
            phrases: [{en:'today\u2019s special', zh:'今日特色菜'}, {en:'a special meal', zh:'特别的一餐'}],
            
            extraExamples: [
              {en:'Today\u2019s special is fish.', zh:'今天的特色菜是鱼。'},
              {en:'What\u2019s the special today?', zh:'今天特色菜是什么？'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 5 · Here and Now',
        words: [
          w('j7b5-1', 'ride', '/raɪd/', 'v.', '骑 n. 旅程', 'I ride a bike to school.', '行为与动作', '我骑车上学。', {
            phrases: [{en:'ride a bike', zh:'骑自行车'}, {en:'have a ride', zh:'搭个车'}],
            
            extraExamples: [
              {en:'I ride a bike to school.', zh:'我骑车上学。'},
              {en:'Can I ride your bike?', zh:'我能骑你的自行车吗？'},
            ],
          }),
          w('j7b5-2', 'moment', '/ˈməʊmənt/', 'n.', '时刻；片刻', 'At the moment, I am reading.', '认知与学术', '此刻我在读书。', {
            phrases: [{en:'at the moment', zh:'此刻'}, {en:'wait a moment', zh:'等一下'}],
            
            extraExamples: [
              {en:'At the moment, I am reading.', zh:'此刻我在读书。'},
              {en:'Wait a moment, please.', zh:'请稍等一下。'},
            ],
          }),
          w('j7b5-3', 'dragon', '/ˈdræɡən/', 'n.', '龙', 'The dragon is a symbol of China.', '社会与环境', '龙是中国的象征。', {
            phrases: [{en:'dragon boat', zh:'龙舟'}, {en:'a symbol of China', zh:'中国的象征'}],
            
            extraExamples: [
              {en:'The dragon is a symbol of China.', zh:'龙是中国的象征。'},
              {en:'We watch dragon boat races.', zh:'我们看龙舟赛。'},
            ],
          }),
          w('j7b5-4', 'festival', '/ˈfestɪvl/', 'n.', '节日', 'The Spring Festival is coming.', '社会与环境', '春节要到了。', {
            phrases: [{en:'the Spring Festival', zh:'春节'}, {en:'a traditional festival', zh:'传统节日'}],
            
            extraExamples: [
              {en:'The Spring Festival is coming.', zh:'春节要到了。'},
              {en:'The Mid-Autumn Festival is important.', zh:'中秋节很重要。'},
            ],
          }),
          w('j7b5-5', 'hold', '/həʊld/', 'v.', '拿着；抓住；举办', 'Hold my hand.', '行为与动作', '抓住我的手。', {
            phrases: [{en:'hold my hand', zh:'抓住我的手'}, {en:'hold a meeting', zh:'举办会议'}],
            
            extraExamples: [
              {en:'Hold my hand, please.', zh:'请抓住我的手。'},
              {en:'They hold a sports meeting every year.', zh:'他们每年举办运动会。'},
            ],
          }),
          w('j7b5-6', 'voice', '/vɔɪs/', 'n.', '嗓音；声音', 'She has a sweet voice.', '社会与环境', '她声音很甜。', {
            phrases: [{en:'a sweet voice', zh:'甜美的嗓音'}, {en:'in a low voice', zh:'低声地'}],
            
            extraExamples: [
              {en:'She has a sweet voice.', zh:'她声音很甜。'},
              {en:'He spoke in a low voice.', zh:'他低声说话。'},
            ],
          }),
          w('j7b5-7', 'race', '/reɪs/', 'n.', '比赛；竞赛 v. 赛跑', 'He wins the race.', '行为与动作', '他赢得比赛。', {
            phrases: [{en:'win the race', zh:'赢得比赛'}, {en:'a race against...', zh:'与……赛跑'}],
            
            extraExamples: [
              {en:'He wins the race.', zh:'他赢得比赛。'},
              {en:'We watch a 100-metre race.', zh:'我们看百米赛跑。'},
            ],
          }),
          w('j7b5-8', 'message', '/ˈmesɪdʒ/', 'n.', '消息；信息', 'Can I take a message?', '认知与学术', '我可以捎个口信吗？', {
            phrases: [{en:'take a message', zh:'捎口信'}, {en:'send a message', zh:'发消息'}],
            
            extraExamples: [
              {en:'Can I take a message?', zh:'我可以捎个口信吗？'},
              {en:'I sent her a message.', zh:'我给她发了消息。'},
            ],
          }),
          w('j7b5-9', 'kick', '/kɪk/', 'v.', '踢；踹', 'He kicks the ball.', '行为与动作', '他踢球。', {
            phrases: [{en:'kick the ball', zh:'踢球'}, {en:'kick a goal', zh:'踢进一球'}],
            
            extraExamples: [
              {en:'He kicks the ball hard.', zh:'他用力踢球。'},
              {en:'Don\u2019t kick the chair.', zh:'别踢椅子。'},
            ],
          }),
          w('j7b5-10', 'online', '/ˌɒnˈlaɪn/', 'adj.', '在线的', 'We talk online.', '认知与学术', '我们在线聊天。', {
            phrases: [{en:'talk online', zh:'在线聊天'}, {en:'go online', zh:'上网'}],
            
            extraExamples: [
              {en:'We talk online every day.', zh:'我们每天在线聊天。'},
              {en:'I shop online.', zh:'我在网上购物。'},
            ],
          }),
          w('j7b5-11', 'sight', '/saɪt/', 'n.', '名胜；风景；视力', 'The sights are beautiful.', '社会与环境', '风景很美。', {
            phrases: [{en:'the sights', zh:'名胜'}, {en:'see the sights', zh:'观光'}],
            
            extraExamples: [
              {en:'The sights are beautiful.', zh:'风景很美。'},
              {en:'We went to see the sights of Beijing.', zh:'我们去看北京的名胜。'},
            ],
          }),
          w('j7b5-12', 'exam', '/ɪɡˈzæm/', 'n.', '考试', 'We have an exam on Monday.', '认知与学术', '我们周一考试。', {
            phrases: [{en:'have an exam', zh:'考试'}, {en:'pass the exam', zh:'通过考试'}],
            
            extraExamples: [
              {en:'We have an exam on Monday.', zh:'我们周一考试。'},
              {en:'I passed the English exam.', zh:'我通过了英语考试。'},
            ],
          }),
          w('j7b5-13', 'hope', '/həʊp/', 'v.', '希望 n. 希望', 'I hope to see you soon.', '情感与性格', '我希望很快见到你。', {
            phrases: [{en:'hope to do sth.', zh:'希望做某事'}, {en:'I hope so', zh:'我希望如此'}],
            
            extraExamples: [
              {en:'I hope to see you soon.', zh:'我希望很快见到你。'},
              {en:'I hope you are well.', zh:'希望你一切都好。'},
            ],
          }),
          w('j7b5-14', 'forward', '/ˈfɔːwəd/', 'adv.', '向前', 'I look forward to the holiday.', '认知与学术', '我期盼假期。', {
            phrases: [{en:'look forward to', zh:'期盼'}, {en:'move forward', zh:'向前走'}],
            
            extraExamples: [
              {en:'I look forward to the holiday.', zh:'我期盼假期。'},
              {en:'I look forward to hearing from you.', zh:'期待你的回信。'},
            ],
          }),
          w('j7b5-15', 'happen', '/ˈhæpən/', 'v.', '发生', 'What happened?', '行为与动作', '发生什么事了？', {
            phrases: [{en:'what happened', zh:'发生什么了'}, {en:'happen to sb.', zh:'某人发生了某事'}],
            
            extraExamples: [
              {en:'What happened to you?', zh:'你怎么了？'},
              {en:'Accidents can happen.', zh:'意外可能发生。'},
            ],
          }),
          w('j7b5-16', 'rush', '/rʌʃ/', 'v.', '冲；奔 n. 匆忙', 'Don\u2019t rush.', '行为与动作', '别着急。', {
            phrases: [{en:'don\u2019t rush', zh:'别着急'}, {en:'rush hour', zh:'高峰时间'}],
            
            extraExamples: [
              {en:'Don\u2019t rush. We have time.', zh:'别着急，我们有时间。'},
              {en:'He rushed to school.', zh:'他冲去学校。'},
            ],
          }),
          w('j7b5-17', 'shine', '/ʃaɪn/', 'v.', '发光；照耀', 'The sun shines brightly.', '行为与动作', '阳光灿烂。', {
            phrases: [{en:'the sun shines', zh:'阳光照耀'}, {en:'shine brightly', zh:'明亮地照耀'}],
            
            extraExamples: [
              {en:'The sun shines brightly today.', zh:'今天阳光灿烂。'},
              {en:'Her eyes shine with joy.', zh:'她的眼睛闪着喜悦。'},
            ],
          }),
          w('j7b5-18', 'market', '/ˈmɑːkɪt/', 'n.', '市场', 'We buy fruit at the market.', '社会与环境', '我们在市场买水果。', {
            phrases: [{en:'at the market', zh:'在市场'}, {en:'a street market', zh:'街边市场'}],
            
            extraExamples: [
              {en:'We buy fruit at the market.', zh:'我们在市场买水果。'},
              {en:'The market is busy in the morning.', zh:'市场早上很热闹。'},
            ],
          }),
          w('j7b5-19', 'subway', '/ˈsʌbweɪ/', 'n.', '地铁', 'I take the subway.', '社会与环境', '我坐地铁。', {
            phrases: [{en:'take the subway', zh:'坐地铁'}, {en:'by subway', zh:'乘地铁'}],
            
            extraExamples: [
              {en:'I take the subway to school.', zh:'我坐地铁上学。'},
              {en:'The subway is fast.', zh:'地铁很快。'},
            ],
          }),
          w('j7b5-20', 'sunshine', '/ˈsʌnʃaɪn/', 'n.', '阳光', 'The sunshine is warm.', '社会与环境', '阳光很温暖。', {
            phrases: [{en:'warm sunshine', zh:'温暖的阳光'}, {en:'in the sunshine', zh:'在阳光下'}],
            
            extraExamples: [
              {en:'The sunshine is warm.', zh:'阳光很温暖。'},
              {en:'We sit in the sunshine.', zh:'我们坐在阳光下。'},
            ],
          }),
          w('j7b5-21', 'dragon boat', '/ˈdræɡən bəʊt/', 'n.', '龙舟', 'We watch dragon boat races.', '社会与环境', '我们看龙舟赛。', {
            phrases: [{en:'dragon boat race', zh:'龙舟赛'}, {en:'watch dragon boat races', zh:'看龙舟赛'}],
            
            extraExamples: [
              {en:'We watch dragon boat races.', zh:'我们看龙舟赛。'},
              {en:'The dragon boat is colourful.', zh:'龙舟色彩鲜艳。'},
            ],
          }),
          w('j7b5-22', 'at the moment', '/æt ðə ˈməʊmənt/', 'phr.', '此刻；现在', 'At the moment, I am busy.', '认知与学术', '此刻我很忙。', {
            phrases: [{en:'at the moment', zh:'此刻'}, {en:'busy at the moment', zh:'现在很忙'}],
            
            extraExamples: [
              {en:'At the moment, I am busy.', zh:'此刻我很忙。'},
              {en:'She is reading at the moment.', zh:'她此刻正在读书。'},
            ],
          }),
          w('j7b5-23', 'right now', '/raɪt naʊ/', 'phr.', '现在；马上', 'I am busy right now.', '认知与学术', '我现在很忙。', {
            phrases: [{en:'busy right now', zh:'现在很忙'}, {en:'do it right now', zh:'马上做'}],
            
            extraExamples: [
              {en:'I am busy right now.', zh:'我现在很忙。'},
              {en:'Do it right now!', zh:'马上做！'},
            ],
          }),
          w('j7b5-24', 'call', '/kɔːl/', 'v.', '打电话 n. 通话', 'Call me later.', '行为与动作', '稍后打给我。', {
            phrases: [{en:'call me later', zh:'稍后打给我'}, {en:'make a phone call', zh:'打电话'}],
            
            extraExamples: [
              {en:'Call me later, please.', zh:'请稍后打给我。'},
              {en:'I will call you tomorrow.', zh:'我明天给你打电话。'},
            ],
          }),
          w('j7b5-25', 'photo', '/ˈfəʊtəʊ/', 'n.', '照片', 'Take a photo of me.', '社会与环境', '给我拍张照。', {
            phrases: [{en:'take a photo', zh:'拍照'}, {en:'a photo of...', zh:'一张……的照片'}],
            
            extraExamples: [
              {en:'Take a photo of me, please.', zh:'请给我拍张照。'},
              {en:'This is a photo of my family.', zh:'这是我家的一张照片。'},
            ],
          }),
          w('j7b5-26', 'festival', '/ˈfestɪvl/', 'n.', '节日', 'The Mid-Autumn Festival is nice.', '社会与环境', '中秋节很美。', {
            phrases: [{en:'the Mid-Autumn Festival', zh:'中秋节'}, {en:'a traditional festival', zh:'传统节日'}],
            
            extraExamples: [
              {en:'The Mid-Autumn Festival is nice.', zh:'中秋节很美。'},
              {en:'We eat mooncakes at the festival.', zh:'我们在节日吃月饼。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 6 · Rain or Shine',
        words: [
          w('j7b6-1', 'affect', '/əˈfekt/', 'v.', '影响', 'Weather affects our mood.', '行为与动作', '天气影响我们的心情。', {
            phrases: [{en:'affect our mood', zh:'影响我们的心情'}, {en:'be affected by', zh:'受……影响'}],
            
            extraExamples: [
              {en:'Weather affects our mood.', zh:'天气影响我们的心情。'},
              {en:'The rain affected our plan.', zh:'下雨影响了我们的计划。'},
            ],
          }),
          w('j7b6-2', 'dry', '/draɪ/', 'adj.', '干的；干旱的 v. 弄干', 'The weather is dry.', '品质与状态', '天气干燥。', {
            phrases: [{en:'dry weather', zh:'干燥的天气'}, {en:'dry your hands', zh:'擦干手'}],
            
            extraExamples: [
              {en:'The weather is dry today.', zh:'今天天气干燥。'},
              {en:'Dry your hands with a towel.', zh:'用毛巾擦干手。'},
            ],
          }),
          w('j7b6-3', 'lightning', '/ˈlaɪtnɪŋ/', 'n.', '闪电', 'The lightning is bright.', '社会与环境', '闪电很亮。', {
            phrases: [{en:'a flash of lightning', zh:'一道闪电'}, {en:'lightning and thunder', zh:'雷电'}],
            
            extraExamples: [
              {en:'The lightning is bright.', zh:'闪电很亮。'},
              {en:'Lightning comes before thunder.', zh:'闪电先于雷声。'},
            ],
          }),
          w('j7b6-4', 'stormy', '/ˈstɔːmi/', 'adj.', '有暴风雨的', 'It is a stormy night.', '品质与状态', '这是个暴风雨之夜。', {
            phrases: [{en:'a stormy night', zh:'暴风雨之夜'}, {en:'stormy weather', zh:'暴风雨天气'}],
            
            extraExamples: [
              {en:'It is a stormy night.', zh:'这是个暴风雨之夜。'},
              {en:'The sky is stormy.', zh:'天空乌云密布。'},
            ],
          }),
          w('j7b6-5', 'north', '/nɔːθ/', 'n.', '北；北方 adj. 北方的', 'The wind comes from the north.', '社会与环境', '风从北方来。', {
            phrases: [{en:'in the north', zh:'在北方'}, {en:'North China', zh:'华北'}],
            
            extraExamples: [
              {en:'The wind comes from the north.', zh:'风从北方来。'},
              {en:'Beijing is in the north of China.', zh:'北京在中国北方。'},
            ],
          }),
          w('j7b6-6', 'temperature', '/ˈtemprətʃə(r)/', 'n.', '温度；气温', 'The temperature is high today.', '认知与学术', '今天温度高。', {
            phrases: [{en:'the temperature is high', zh:'温度高'}, {en:'take one\u2019s temperature', zh:'量体温'}],
            
            extraExamples: [
              {en:'The temperature is high today.', zh:'今天温度高。'},
              {en:'The temperature drops at night.', zh:'晚上气温下降。'},
            ],
          }),
          w('j7b6-7', 'snowman', '/ˈsnəʊmæn/', 'n.', '雪人', 'We make a snowman.', '社会与环境', '我们堆雪人。', {
            phrases: [{en:'make a snowman', zh:'堆雪人'}, {en:'build a snowman', zh:'堆雪人'}],
            
            extraExamples: [
              {en:'We make a snowman in winter.', zh:'我们冬天堆雪人。'},
              {en:'The snowman is tall.', zh:'这个雪人很高。'},
            ],
          }),
          w('j7b6-8', 'snowy', '/ˈsnəʊi/', 'adj.', '下雪的；雪白的', 'It is a snowy day.', '品质与状态', '这是个下雪天。', {
            phrases: [{en:'a snowy day', zh:'下雪天'}, {en:'snowy weather', zh:'下雪天气'}],
            
            extraExamples: [
              {en:'It is a snowy day.', zh:'这是个下雪天。'},
              {en:'The countryside looks snowy.', zh:'乡村一片雪白。'},
            ],
          }),
          w('j7b6-9', 'freezing', '/ˈfriːzɪŋ/', 'adj.', '极冷的；冰冻的', 'It is freezing outside.', '品质与状态', '外面极冷。', {
            phrases: [{en:'freezing cold', zh:'极冷'}, {en:'freezing point', zh:'冰点'}],
            
            extraExamples: [
              {en:'It is freezing outside.', zh:'外面极冷。'},
              {en:'The water is freezing.', zh:'水冷得刺骨。'},
            ],
          }),
          w('j7b6-10', 'tourist', '/ˈtʊərɪst/', 'n.', '旅行者；观光客', 'Many tourists visit the place.', '社会与环境', '很多游客来这里。', {
            phrases: [{en:'a tourist spot', zh:'旅游景点'}, {en:'many tourists', zh:'很多游客'}],
            
            extraExamples: [
              {en:'Many tourists visit the place.', zh:'很多游客来这里。'},
              {en:'The city is full of tourists.', zh:'这座城市到处是游客。'},
            ],
          }),
          w('j7b6-11', 'cloud', '/klaʊd/', 'n.', '云；云彩', 'The cloud is white.', '社会与环境', '云是白色的。', {
            phrases: [{en:'a white cloud', zh:'一朵白云'}, {en:'dark clouds', zh:'乌云'}],
            
            extraExamples: [
              {en:'The cloud is white.', zh:'云是白色的。'},
              {en:'Dark clouds are coming.', zh:'乌云来了。'},
            ],
          }),
          w('j7b6-12', 'magical', '/ˈmædʒɪkl/', 'adj.', '魔法的；神奇的', 'The view is magical.', '品质与状态', '景色很神奇。', {
            phrases: [{en:'a magical view', zh:'神奇的景色'}, {en:'a magical place', zh:'神奇的地方'}],
            
            extraExamples: [
              {en:'The view is magical.', zh:'景色很神奇。'},
              {en:'It is a magical moment.', zh:'这是个神奇的时刻。'},
            ],
          }),
          w('j7b6-13', 'although', '/ɔːlˈðəʊ/', 'conj.', '虽然；尽管', 'Although it rains, we go out.', '认知与学术', '尽管下雨，我们还是出去。', {
            phrases: [{en:'although it rains', zh:'尽管下雨'}, {en:'although...,...', zh:'虽然……但是……'}],
            
            extraExamples: [
              {en:'Although it rains, we go out.', zh:'尽管下雨，我们还是出去。'},
              {en:'Although he is young, he knows a lot.', zh:'他虽然小，但懂得很多。'},
            ],
          }),
          w('j7b6-14', 'experience', '/ɪkˈspɪəriəns/', 'n.', '经历；经验 v. 经历', 'It is a great experience.', '认知与学术', '这是很棒的经历。', {
            phrases: [{en:'a great experience', zh:'很棒的经历'}, {en:'learn from experience', zh:'从经验中学习'}],
            
            extraExamples: [
              {en:'It is a great experience.', zh:'这是很棒的经历。'},
              {en:'He has much teaching experience.', zh:'他有丰富的教学经验。'},
            ],
          }),
          w('j7b6-15', 'through', '/θruː/', 'prep.', '穿过；凭借', 'We walk through the forest.', '行为与动作', '我们穿过森林。', {
            phrases: [{en:'walk through', zh:'穿过'}, {en:'through the window', zh:'透过窗户'}],
            
            extraExamples: [
              {en:'We walk through the forest.', zh:'我们穿过森林。'},
              {en:'The sun shines through the window.', zh:'阳光透过窗户照进来。'},
            ],
          }),
          w('j7b6-16', 'glad', '/ɡlæd/', 'adj.', '高兴的', 'I am glad to see you.', '情感与性格', '见到你我很高兴。', {
            phrases: [{en:'be glad to do', zh:'高兴做某事'}, {en:'I am glad to...', zh:'我很高兴……'}],
            
            extraExamples: [
              {en:'I am glad to see you.', zh:'见到你我很高兴。'},
              {en:'She is glad about the news.', zh:'她对这个消息很高兴。'},
            ],
          }),
          w('j7b6-17', 'fog', '/fɒɡ/', 'n.', '雾', 'The fog is thick.', '社会与环境', '雾很浓。', {
            phrases: [{en:'thick fog', zh:'浓雾'}, {en:'in the fog', zh:'在雾中'}],
            
            extraExamples: [
              {en:'The fog is thick today.', zh:'今天雾很浓。'},
              {en:'Driving in fog is dangerous.', zh:'雾中开车很危险。'},
            ],
          }),
          w('j7b6-18', 'wet', '/wet/', 'adj.', '湿的', 'The ground is wet.', '品质与状态', '地面是湿的。', {
            phrases: [{en:'wet ground', zh:'湿地面'}, {en:'get wet', zh:'淋湿'}],
            
            extraExamples: [
              {en:'The ground is wet after rain.', zh:'雨后地面是湿的。'},
              {en:'You will get wet without an umbrella.', zh:'没伞你会淋湿。'},
            ],
          }),
          w('j7b6-19', 'mountain', '/ˈmaʊntən/', 'n.', '山；高山', 'We climb the mountain.', '社会与环境', '我们爬山。', {
            phrases: [{en:'climb a mountain', zh:'爬山'}, {en:'a high mountain', zh:'高山'}],
            
            extraExamples: [
              {en:'We climb the mountain on Sunday.', zh:'我们周日爬山。'},
              {en:'The mountain is covered with snow.', zh:'山上覆盖着雪。'},
            ],
          }),
          w('j7b6-20', 'storm', '/stɔːm/', 'n.', '暴风雨；暴风雪', 'The storm is coming.', '社会与环境', '暴风雨要来了。', {
            phrases: [{en:'a storm is coming', zh:'暴风雨要来了'}, {en:'a heavy storm', zh:'一场大暴风雨'}],
            
            extraExamples: [
              {en:'The storm is coming.', zh:'暴风雨要来了。'},
              {en:'The storm damaged many houses.', zh:'暴风雨毁坏了很多房屋。'},
            ],
          }),
          w('j7b6-21', 'rainy', '/ˈreɪni/', 'adj.', '下雨的', 'It is a rainy day.', '品质与状态', '这是个下雨天。', {
            phrases: [{en:'a rainy day', zh:'下雨天'}, {en:'rainy weather', zh:'下雨天气'}],
            
            extraExamples: [
              {en:'It is a rainy day.', zh:'这是个下雨天。'},
              {en:'I like reading on rainy days.', zh:'我喜欢下雨天读书。'},
            ],
          }),
          w('j7b6-22', 'sunny', '/ˈsʌni/', 'adj.', '晴朗的；阳光充足的', 'It is sunny today.', '品质与状态', '今天晴天。', {
            phrases: [{en:'a sunny day', zh:'晴天'}, {en:'sunny weather', zh:'晴朗天气'}],
            
            extraExamples: [
              {en:'It is sunny today.', zh:'今天晴天。'},
              {en:'We go out on sunny days.', zh:'我们晴天出去。'},
            ],
          }),
          w('j7b6-23', 'windy', '/ˈwɪndi/', 'adj.', '多风的', 'It is windy outside.', '品质与状态', '外面风大。', {
            phrases: [{en:'a windy day', zh:'大风天'}, {en:'windy weather', zh:'多风天气'}],
            
            extraExamples: [
              {en:'It is windy outside.', zh:'外面风大。'},
              {en:'The tree falls on a windy night.', zh:'树在大风夜倒下。'},
            ],
          }),
          w('j7b6-24', 'cloudy', '/ˈklaʊdi/', 'adj.', '多云的；阴天的', 'It is cloudy.', '品质与状态', '阴天。', {
            phrases: [{en:'a cloudy day', zh:'阴天'}, {en:'cloudy sky', zh:'多云的天空'}],
            
            extraExamples: [
              {en:'It is cloudy today.', zh:'今天阴天。'},
              {en:'The sky is cloudy.', zh:'天空多云。'},
            ],
          }),
          w('j7b6-25', 'thunder', '/ˈθʌndə(r)/', 'n.', '雷；雷声', 'The thunder is loud.', '社会与环境', '雷声很大。', {
            phrases: [{en:'the thunder is loud', zh:'雷声很大'}, {en:'thunder and lightning', zh:'雷电'}],
            
            extraExamples: [
              {en:'The thunder is loud.', zh:'雷声很大。'},
              {en:'I am afraid of thunder.', zh:'我怕打雷。'},
            ],
          }),
          w('j7b6-26', 'umbrella', '/ʌmˈbrelə/', 'n.', '雨伞', 'Take an umbrella.', '社会与环境', '带把伞。', {
            phrases: [{en:'take an umbrella', zh:'带伞'}, {en:'open an umbrella', zh:'撑伞'}],
            
            extraExamples: [
              {en:'Take an umbrella. It may rain.', zh:'带把伞，可能下雨。'},
              {en:'I forgot my umbrella.', zh:'我忘了带伞。'},
            ],
          }),
          w('j7b6-27', 'temperature', '/ˈtemprətʃə(r)/', 'n.', '温度', 'The temperature drops.', '认知与学术', '气温下降。', {
            phrases: [{en:'the temperature drops', zh:'气温下降'}, {en:'the temperature rises', zh:'气温上升'}],
            
            extraExamples: [
              {en:'The temperature drops at night.', zh:'晚上气温下降。'},
              {en:'The temperature is 20 degrees.', zh:'气温是20度。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 7 · A Day to Remember',
        words: [
          w('j7b7-1', 'museum', '/mjuˈziːəm/', 'n.', '博物馆', 'We visit the museum.', '社会与环境', '我们参观博物馆。', {
            phrases: [{en:'visit the museum', zh:'参观博物馆'}, {en:'a history museum', zh:'历史博物馆'}],
            
            extraExamples: [
              {en:'We visit the museum on Sunday.', zh:'我们周日参观博物馆。'},
              {en:'The museum is free on Mondays.', zh:'博物馆周一免费。'},
            ],
          }),
          w('j7b7-2', 'exhibition', '/ˌeksɪˈbɪʃn/', 'n.', '展览', 'There is an art exhibition.', '社会与环境', '有个艺术展。', {
            phrases: [{en:'an art exhibition', zh:'艺术展'}, {en:'on exhibition', zh:'展出中'}],
            
            extraExamples: [
              {en:'There is an art exhibition.', zh:'有个艺术展。'},
              {en:'We went to the photo exhibition.', zh:'我们去看了摄影展。'},
            ],
          }),
          w('j7b7-3', 'direction', '/dəˈrekʃn/', 'n.', '方向；方位', 'Go in this direction.', '认知与学术', '往这个方向走。', {
            phrases: [{en:'in this direction', zh:'往这个方向'}, {en:'in the direction of', zh:'朝……方向'}],
            
            extraExamples: [
              {en:'Go in this direction.', zh:'往这个方向走。'},
              {en:'He drove in the wrong direction.', zh:'他开错方向了。'},
            ],
          }),
          w('j7b7-4', 'terrible', '/ˈterəbl/', 'adj.', '糟糕的；可怕的', 'The weather is terrible.', '情感与性格', '天气很糟糕。', {
            phrases: [{en:'terrible weather', zh:'糟糕的天气'}, {en:'a terrible accident', zh:'可怕的事故'}],
            
            extraExamples: [
              {en:'The weather is terrible today.', zh:'今天天气很糟糕。'},
              {en:'I had a terrible night.', zh:'我昨晚睡得很糟。'},
            ],
          }),
          w('j7b7-5', 'trip', '/trɪp/', 'n.', '旅行 v. 绊倒', 'We go on a school trip.', '行为与动作', '我们参加学校旅行。', {
            phrases: [{en:'a school trip', zh:'学校旅行'}, {en:'go on a trip', zh:'去旅行'}],
            
            extraExamples: [
              {en:'We go on a school trip.', zh:'我们参加学校旅行。'},
              {en:'The trip was fun.', zh:'这次旅行很有趣。'},
            ],
          }),
          w('j7b7-6', 'plant', '/plɑːnt/', 'n.', '植物；工厂 v. 种植', 'We plant trees.', '社会与环境', '我们种树。', {
            phrases: [{en:'plant trees', zh:'种树'}, {en:'a green plant', zh:'绿色植物'}],
            
            extraExamples: [
              {en:'We plant trees in spring.', zh:'我们春天种树。'},
              {en:'This plant needs water.', zh:'这株植物需要浇水。'},
            ],
          }),
          w('j7b7-7', 'remove', '/rɪˈmuːv/', 'v.', '移开；拿走', 'Remove the waste.', '行为与动作', '把废弃物拿走。', {
            phrases: [{en:'remove the waste', zh:'移走垃圾'}, {en:'remove sth. from...', zh:'把……从……移走'}],
            
            extraExamples: [
              {en:'Remove the waste, please.', zh:'请把垃圾拿走。'},
              {en:'He removed his coat.', zh:'他脱下外套。'},
            ],
          }),
          w('j7b7-8', 'waste', '/weɪst/', 'n.', '废弃物 v. 浪费', 'Don\u2019t waste food.', '行为与动作', '不要浪费食物。', {
            phrases: [{en:'waste food', zh:'浪费食物'}, {en:'a waste of time', zh:'浪费时间'}],
            
            extraExamples: [
              {en:'Don\u2019t waste food.', zh:'不要浪费食物。'},
              {en:'It is a waste of time.', zh:'这是浪费时间。'},
            ],
          }),
          w('j7b7-9', 'machine', '/məˈʃiːn/', 'n.', '机器', 'The machine works well.', '社会与环境', '机器运转良好。', {
            phrases: [{en:'the machine works', zh:'机器运转'}, {en:'a washing machine', zh:'洗衣机'}],
            
            extraExamples: [
              {en:'The machine works well.', zh:'机器运转良好。'},
              {en:'This machine is easy to use.', zh:'这台机器很好用。'},
            ],
          }),
          w('j7b7-10', 'step', '/step/', 'n.', '步骤；脚步 v. 走', 'Follow these steps.', '认知与学术', '按这些步骤做。', {
            phrases: [{en:'follow the steps', zh:'按步骤做'}, {en:'step by step', zh:'一步一步地'}],
            
            extraExamples: [
              {en:'Follow these steps.', zh:'按这些步骤做。'},
              {en:'He took a step forward.', zh:'他向前迈了一步。'},
            ],
          }),
          w('j7b7-11', 'realize', '/ˈriːəlaɪz/', 'v.', '认识到；实现', 'I realize my dream.', '认知与学术', '我实现了梦想。', {
            phrases: [{en:'realize one\u2019s dream', zh:'实现梦想'}, {en:'realize the importance', zh:'认识到重要性'}],
            
            extraExamples: [
              {en:'I realize my dream at last.', zh:'我终于实现了梦想。'},
              {en:'He realized his mistake.', zh:'他认识到自己的错误。'},
            ],
          }),
          w('j7b7-12', 'factory', '/ˈfæktri/', 'n.', '工厂', 'He works in a factory.', '社会与环境', '他在工厂工作。', {
            phrases: [{en:'in a factory', zh:'在工厂'}, {en:'a car factory', zh:'汽车厂'}],
            
            extraExamples: [
              {en:'He works in a factory.', zh:'他在工厂工作。'},
              {en:'The factory makes bikes.', zh:'这家工厂制造自行车。'},
            ],
          }),
          w('j7b7-13', 'actor', '/ˈæktə(r)/', 'n.', '演员', 'The actor is famous.', '社会与环境', '这位演员很有名。', {
            phrases: [{en:'a famous actor', zh:'名演员'}, {en:'a film actor', zh:'电影演员'}],
            
            extraExamples: [
              {en:'The actor is famous.', zh:'这位演员很有名。'},
              {en:'He wants to be an actor.', zh:'他想当演员。'},
            ],
          }),
          w('j7b7-14', 'along', '/əˈlɒŋ/', 'prep.', '沿着；顺着', 'Walk along the road.', '行为与动作', '沿着路走。', {
            phrases: [{en:'walk along', zh:'沿着……走'}, {en:'along the river', zh:'沿着河'}],
            
            extraExamples: [
              {en:'Walk along the road.', zh:'沿着路走。'},
              {en:'There are trees along the river.', zh:'沿河有树。'},
            ],
          }),
          w('j7b7-15', 'road', '/rəʊd/', 'n.', '道路；公路', 'The road is long.', '社会与环境', '这条路很长。', {
            phrases: [{en:'on the road', zh:'在路上'}, {en:'a busy road', zh:'繁忙的路'}],
            
            extraExamples: [
              {en:'The road is long.', zh:'这条路很长。'},
              {en:'Don\u2019t play on the road.', zh:'不要在路上玩。'},
            ],
          }),
          w('j7b7-16', 'create', '/kriˈeɪt/', 'v.', '创造；创作', 'We create a new plan.', '行为与动作', '我们制定新计划。', {
            phrases: [{en:'create a plan', zh:'制定计划'}, {en:'create a new world', zh:'创造新世界'}],
            
            extraExamples: [
              {en:'We create a new plan.', zh:'我们制定新计划。'},
              {en:'God created the world.', zh:'上帝创造了世界。'},
            ],
          }),
          w('j7b7-17', 'record', '/rɪˈkɔːd/', 'v.', '记录 n. 记录', 'Record the words.', '行为与动作', '把单词记下来。', {
            phrases: [{en:'record the words', zh:'记下单词'}, {en:'keep a record', zh:'做记录'}],
            
            extraExamples: [
              {en:'Record the new words.', zh:'把新单词记下来。'},
              {en:'He broke the record.', zh:'他打破了纪录。'},
            ],
          }),
          w('j7b7-18', 'skill', '/skɪl/', 'n.', '技能；技巧', 'Reading is a useful skill.', '认知与学术', '阅读是有用的技能。', {
            phrases: [{en:'a useful skill', zh:'有用的技能'}, {en:'communication skills', zh:'沟通技巧'}],
            
            extraExamples: [
              {en:'Reading is a useful skill.', zh:'阅读是有用的技能。'},
              {en:'He has many skills.', zh:'他有很多技能。'},
            ],
          }),
          w('j7b7-19', 'explore', '/ɪkˈsplɔː(r)/', 'v.', '探索', 'We explore the forest.', '行为与动作', '我们探索森林。', {
            phrases: [{en:'explore the forest', zh:'探索森林'}, {en:'explore the world', zh:'探索世界'}],
            
            extraExamples: [
              {en:'We explore the forest.', zh:'我们探索森林。'},
              {en:'Children love to explore.', zh:'孩子们喜欢探索。'},
            ],
          }),
          w('j7b7-20', 'diary', '/ˈdaɪəri/', 'n.', '日记；日记本', 'I keep a diary.', '认知与学术', '我写日记。', {
            phrases: [{en:'keep a diary', zh:'写日记'}, {en:'a diary entry', zh:'一篇日记'}],
            
            extraExamples: [
              {en:'I keep a diary every day.', zh:'我每天写日记。'},
              {en:'She writes in her diary.', zh:'她在日记本里写东西。'},
            ],
          }),
          w('j7b7-21', 'painting', '/ˈpeɪntɪŋ/', 'n.', '绘画；油画', 'The painting is beautiful.', '社会与环境', '这幅画很美。', {
            phrases: [{en:'a beautiful painting', zh:'美丽的画'}, {en:'an oil painting', zh:'油画'}],
            
            extraExamples: [
              {en:'The painting is beautiful.', zh:'这幅画很美。'},
              {en:'There are many paintings in the museum.', zh:'博物馆里有很多画。'},
            ],
          }),
          w('j7b7-22', 'painter', '/ˈpeɪntə(r)/', 'n.', '画家', 'He is a famous painter.', '社会与环境', '他是位名画家。', {
            phrases: [{en:'a famous painter', zh:'名画家'}, {en:'a landscape painter', zh:'山水画家'}],
            
            extraExamples: [
              {en:'He is a famous painter.', zh:'他是位名画家。'},
              {en:'The painter draws well.', zh:'这位画家画得好。'},
            ],
          }),
          w('j7b7-23', 'show', '/ʃəʊ/', 'v.', '展示；演出 n. 展览', 'Show me your photo.', '行为与动作', '给我看看你的照片。', {
            phrases: [{en:'show me...', zh:'给我看……'}, {en:'a TV show', zh:'电视节目'}],
            
            extraExamples: [
              {en:'Show me your photo.', zh:'给我看看你的照片。'},
              {en:'There is a flower show.', zh:'有个花展。'},
            ],
          }),
          w('j7b7-24', 'visit', '/ˈvɪzɪt/', 'v.', '参观；拜访', 'We visit the museum.', '行为与动作', '我们参观博物馆。', {
            phrases: [{en:'visit the museum', zh:'参观博物馆'}, {en:'visit a friend', zh:'拜访朋友'}],
            
            extraExamples: [
              {en:'We visit the museum.', zh:'我们参观博物馆。'},
              {en:'She visits her grandma every week.', zh:'她每周去看奶奶。'},
            ],
          }),
          w('j7b7-25', 'wonderful', '/ˈwʌndəfl/', 'adj.', '精彩的；绝妙的', 'It is a wonderful day.', '品质与状态', '这是美好的一天。', {
            phrases: [{en:'a wonderful day', zh:'美好的一天'}, {en:'wonderful news', zh:'好消息'}],
            
            extraExamples: [
              {en:'It is a wonderful day.', zh:'这是美好的一天。'},
              {en:'We had a wonderful time.', zh:'我们玩得很开心。'},
            ],
          }),
          w('j7b7-26', 'remember', '/rɪˈmembə(r)/', 'v.', '记得；记住', 'Remember the day.', '认知与学术', '记住这一天。', {
            phrases: [{en:'remember the day', zh:'记住这一天'}, {en:'remember to do', zh:'记得做某事'}],
            
            extraExamples: [
              {en:'Remember the day.', zh:'记住这一天。'},
              {en:'Remember to close the door.', zh:'记得关门。'},
            ],
          }),
          w('j7b7-27', 'interesting', '/ˈɪntrəstɪŋ/', 'adj.', '有趣的', 'The trip is interesting.', '品质与状态', '这次旅行很有趣。', {
            phrases: [{en:'an interesting book', zh:'有趣的书'}, {en:'it is interesting', zh:'这很有趣'}],
            
            extraExamples: [
              {en:'The trip is interesting.', zh:'这次旅行很有趣。'},
              {en:'This is an interesting story.', zh:'这是个有趣的故事。'},
            ],
          }),
        ],
      },
    ],
  },
  {
    id: 'junior-8a',
    name: '人教版初中英语八年级上册（新版）',
    units: [
      {
        title: 'Unit 1 · Happy Holiday',
        words: [
          w('j8a1-1', 'ancient', '/ˈeɪnʃənt/', 'adj.', '古代的；古老的', 'We visit ancient buildings.', '社会与环境', '我们参观古建筑。', {
            phrases: [{en:'ancient buildings', zh:'古建筑'}, {en:'ancient China', zh:'古代中国'}],
            
            extraExamples: [
              {en:'We visit ancient buildings.', zh:'我们参观古建筑。'},
              {en:'This is an ancient city.', zh:'这是一座古城。'},
            ],
          }),
          w('j8a1-2', 'camp', '/kæmp/', 'n.', '度假营；营地 v. 露营', 'Summer camp is fun.', '社会与环境', '夏令营很有趣。', {
            phrases: [{en:'summer camp', zh:'夏令营'}, {en:'go camping', zh:'去露营'}],
            
            extraExamples: [
              {en:'Summer camp is fun.', zh:'夏令营很有趣。'},
              {en:'We camp by the lake.', zh:'我们在湖边露营。'},
            ],
          }),
          w('j8a1-3', 'landscape', '/ˈlændskeɪp/', 'n.', '风景；景色', 'The landscape is beautiful.', '社会与环境', '风景很美。', {
            phrases: [{en:'beautiful landscape', zh:'美丽的风景'}, {en:'mountain landscape', zh:'山景'}],
            
            extraExamples: [
              {en:'The landscape is beautiful.', zh:'风景很美。'},
              {en:'The landscape changes with seasons.', zh:'风景随季节变化。'},
            ],
          }),
          w('j8a1-4', 'strange', '/streɪndʒ/', 'adj.', '奇怪的；陌生的', 'I heard a strange sound.', '品质与状态', '我听到奇怪的声音。', {
            phrases: [{en:'a strange sound', zh:'奇怪的声音'}, {en:'strange people', zh:'陌生人'}],
            
            extraExamples: [
              {en:'I heard a strange sound.', zh:'我听到奇怪的声音。'},
              {en:'He is a strange man.', zh:'他是个奇怪的人。'},
            ],
          }),
          w('j8a1-5', 'vacation', '/vəˈkeɪʃn/', 'n.', '假期；度假', 'We go on vacation in summer.', '社会与环境', '我们夏天去度假。', {
            phrases: [{en:'on vacation', zh:'在度假'}, {en:'summer vacation', zh:'暑假'}],
            
            extraExamples: [
              {en:'We go on vacation in summer.', zh:'我们夏天去度假。'},
              {en:'Where are you going for vacation?', zh:'你要去哪里度假？'},
            ],
          }),
          w('j8a1-6', 'fantastic', '/fænˈtæstɪk/', 'adj.', '极好的；吸引人的', 'The trip is fantastic.', '品质与状态', '这次旅行棒极了。', {
            phrases: [{en:'a fantastic trip', zh:'棒极了的旅行'}, {en:'fantastic news', zh:'好消息'}],
            
            extraExamples: [
              {en:'The trip is fantastic.', zh:'这次旅行棒极了。'},
              {en:'We had a fantastic time.', zh:'我们玩得很开心。'},
            ],
          }),
          w('j8a1-7', 'town', '/taʊn/', 'n.', '镇；商业区', 'We stay in an old town.', '社会与环境', '我们住在古镇。', {
            phrases: [{en:'an old town', zh:'古镇'}, {en:'in town', zh:'在城里'}],
            
            extraExamples: [
              {en:'We stay in an old town.', zh:'我们住在古镇。'},
              {en:'The town is small but beautiful.', zh:'这个小镇很小但很美。'},
            ],
          }),
          w('j8a1-8', 'breath', '/breθ/', 'n.', '呼吸的空气；一口气', 'The view takes my breath away.', '认知与学术', '这景色让我惊叹。', {
            phrases: [{en:'take one\u2019s breath away', zh:'令人惊叹'}, {en:'out of breath', zh:'上气不接下气'}],
            
            extraExamples: [
              {en:'The view takes my breath away.', zh:'这景色让我惊叹。'},
              {en:'Take a deep breath.', zh:'深呼吸。'},
            ],
          }),
          w('j8a1-9', 'especially', '/ɪˈspeʃəli/', 'adv.', '尤其；特别', 'I like fruit, especially apples.', '认知与学术', '我喜欢水果，尤其是苹果。', {
            phrases: [{en:'especially apples', zh:'尤其是苹果'}, {en:'especially good', zh:'特别好'}],
            
            extraExamples: [
              {en:'I like fruit, especially apples.', zh:'我喜欢水果，尤其是苹果。'},
              {en:'The book is especially interesting.', zh:'这本书特别有趣。'},
            ],
          }),
          w('j8a1-10', 'anywhere', '/ˈeniweə(r)/', 'adv.', '在任何地方', 'I can\u2019t find it anywhere.', '认知与学术', '我到处都找不到。', {
            phrases: [{en:'not...anywhere', zh:'哪里都不'}, {en:'anywhere else', zh:'别的地方'}],
            
            extraExamples: [
              {en:'I can\u2019t find it anywhere.', zh:'我到处都找不到。'},
              {en:'Sit anywhere you like.', zh:'随便坐。'},
            ],
          }),
          w('j8a1-11', 'nothing', '/ˈnʌθɪŋ/', 'pron.', '没有东西', 'There is nothing in the box.', '认知与学术', '盒子里什么都没有。', {
            phrases: [{en:'nothing in the box', zh:'盒子里什么都没有'}, {en:'nothing special', zh:'没什么特别的'}],
            
            extraExamples: [
              {en:'There is nothing in the box.', zh:'盒子里什么都没有。'},
              {en:'Nothing is impossible.', zh:'没有什么是不可能的。'},
            ],
          }),
          w('j8a1-12', 'guide', '/ɡaɪd/', 'n.', '导游；指南 v. 指导', 'The guide shows us around.', '社会与环境', '导游带我们参观。', {
            phrases: [{en:'a tour guide', zh:'导游'}, {en:'a travel guide', zh:'旅行指南'}],
            
            extraExamples: [
              {en:'The guide shows us around.', zh:'导游带我们参观。'},
              {en:'This book guides you around the city.', zh:'这本书带你逛这座城市。'},
            ],
          }),
          w('j8a1-13', 'scenery', '/ˈsiːnəri/', 'n.', '风景；景色', 'The scenery is amazing.', '社会与环境', '景色令人惊叹。', {
            phrases: [{en:'beautiful scenery', zh:'美丽的风景'}, {en:'natural scenery', zh:'自然风光'}],
            
            extraExamples: [
              {en:'The scenery is amazing.', zh:'景色令人惊叹。'},
              {en:'The scenery here is beautiful.', zh:'这里的风景很美。'},
            ],
          }),
          w('j8a1-14', 'silk', '/sɪlk/', 'n.', '丝绸；丝', 'She wears a silk scarf.', '社会与环境', '她戴着丝巾。', {
            phrases: [{en:'a silk scarf', zh:'丝巾'}, {en:'silk clothes', zh:'丝绸衣服'}],
            
            extraExamples: [
              {en:'She wears a silk scarf.', zh:'她戴着丝巾。'},
              {en:'Silk is soft and smooth.', zh:'丝绸柔软光滑。'},
            ],
          }),
          w('j8a1-15', 'scarf', '/skɑːf/', 'n.', '围巾；披巾', 'The scarf is warm.', '社会与环境', '围巾很暖和。', {
            phrases: [{en:'a warm scarf', zh:'暖和的围巾'}, {en:'wear a scarf', zh:'戴围巾'}],
            
            extraExamples: [
              {en:'The scarf is warm.', zh:'围巾很暖和。'},
              {en:'She wears a red scarf.', zh:'她戴着红围巾。'},
            ],
          }),
          w('j8a1-16', 'ready', '/ˈredi/', 'adj.', '准备好的', 'Are you ready?', '品质与状态', '你准备好了吗？', {
            phrases: [{en:'be ready for', zh:'为……做好准备'}, {en:'get ready', zh:'准备好'}],
            
            extraExamples: [
              {en:'Are you ready?', zh:'你准备好了吗？'},
              {en:'I am ready for the trip.', zh:'我准备好旅行了。'},
            ],
          }),
          w('j8a1-17', 'somewhere', '/ˈsʌmweə(r)/', 'adv.', '在某处；到某处', 'Let\u2019s go somewhere quiet.', '认知与学术', '我们去个安静的地方吧。', {
            phrases: [{en:'somewhere quiet', zh:'安静的地方'}, {en:'somewhere else', zh:'别的地方'}],
            
            extraExamples: [
              {en:'Let\u2019s go somewhere quiet.', zh:'我们去个安静的地方吧。'},
              {en:'I want to go somewhere warm.', zh:'我想去个暖和的地方。'},
            ],
          }),
          w('j8a1-18', 'myself', '/maɪˈself/', 'pron.', '我自己', 'I did it by myself.', '认知与学术', '我自己做的。', {
            phrases: [{en:'by myself', zh:'我独自地'}, {en:'enjoy myself', zh:'玩得开心'}],
            
            extraExamples: [
              {en:'I did it by myself.', zh:'我自己做的。'},
              {en:'I enjoyed myself at the party.', zh:'我在派对上玩得很开心。'},
            ],
          }),
          w('j8a1-19', 'hotel', '/həʊˈtel/', 'n.', '旅馆；旅社', 'We stay in a hotel.', '社会与环境', '我们住旅馆。', {
            phrases: [{en:'stay in a hotel', zh:'住旅馆'}, {en:'a five-star hotel', zh:'五星级酒店'}],
            
            extraExamples: [
              {en:'We stay in a hotel.', zh:'我们住旅馆。'},
              {en:'The hotel is near the station.', zh:'旅馆在车站附近。'},
            ],
          }),
          w('j8a1-20', 'comfortable', '/ˈkʌmftəbl/', 'adj.', '舒服的；舒适的', 'The bed is comfortable.', '品质与状态', '床很舒服。', {
            phrases: [{en:'a comfortable bed', zh:'舒服的床'}, {en:'feel comfortable', zh:'觉得舒服'}],
            
            extraExamples: [
              {en:'The bed is comfortable.', zh:'床很舒服。'},
              {en:'The sofa is very comfortable.', zh:'这沙发很舒服。'},
            ],
          }),
          w('j8a1-21', 'bored', '/bɔːd/', 'adj.', '厌倦的；烦闷的', 'I feel bored at home.', '情感与性格', '我在家觉得无聊。', {
            phrases: [{en:'feel bored', zh:'觉得无聊'}, {en:'be bored with', zh:'对……感到厌倦'}],
            
            extraExamples: [
              {en:'I feel bored at home.', zh:'我在家觉得无聊。'},
              {en:'The movie is boring.', zh:'这部电影很无聊。'},
            ],
          }),
          w('j8a1-22', 'sky', '/skaɪ/', 'n.', '天；天空', 'The sky is blue.', '社会与环境', '天空是蓝色的。', {
            phrases: [{en:'a blue sky', zh:'蓝天'}, {en:'in the sky', zh:'在天空中'}],
            
            extraExamples: [
              {en:'The sky is blue.', zh:'天空是蓝色的。'},
              {en:'There are stars in the sky.', zh:'天上有星星。'},
            ],
          }),
          w('j8a1-23', 'rainbow', '/ˈreɪnbəʊ/', 'n.', '虹；彩虹', 'A rainbow appears after rain.', '社会与环境', '雨后出现彩虹。', {
            phrases: [{en:'a rainbow appears', zh:'彩虹出现'}, {en:'rainbow colours', zh:'彩虹色'}],
            
            extraExamples: [
              {en:'A rainbow appears after rain.', zh:'雨后出现彩虹。'},
              {en:'The rainbow is beautiful.', zh:'彩虹很美。'},
            ],
          }),
          w('j8a1-24', 'excited', '/ɪkˈsaɪtɪd/', 'adj.', '兴奋的；激动的', 'We are excited about the trip.', '情感与性格', '我们对旅行感到兴奋。', {
            phrases: [{en:'be excited about', zh:'对……感到兴奋'}, {en:'excited children', zh:'兴奋的孩子们'}],
            
            extraExamples: [
              {en:'We are excited about the trip.', zh:'我们对旅行感到兴奋。'},
              {en:'The news is exciting.', zh:'这个消息令人兴奋。'},
            ],
          }),
          w('j8a1-25', 'camp', '/kæmp/', 'v.', '露营 n. 营地', 'We camp by the lake.', '行为与动作', '我们在湖边露营。', {
            phrases: [{en:'camp by the lake', zh:'在湖边露营'}, {en:'go camping', zh:'去露营'}],
            
            extraExamples: [
              {en:'We camp by the lake.', zh:'我们在湖边露营。'},
              {en:'They camped in the mountain.', zh:'他们在山里露营。'},
            ],
          }),
          w('j8a1-26', 'national park', '/ˈnæʃnəl pɑːk/', 'n.', '国家公园', 'We visit a national park.', '社会与环境', '我们参观国家公园。', {
            phrases: [{en:'visit a national park', zh:'参观国家公园'}, {en:'Yosemite National Park', zh:'优胜美地国家公园'}],
            
            extraExamples: [
              {en:'We visit a national park.', zh:'我们参观国家公园。'},
              {en:'The national park is very big.', zh:'这个国家公园很大。'},
            ],
          }),
          w('j8a1-27', 'photo', '/ˈfəʊtəʊ/', 'n.', '照片', 'Take a photo of the view.', '社会与环境', '给风景拍张照。', {
            phrases: [{en:'take a photo', zh:'拍照'}, {en:'a photo of...', zh:'一张……的照片'}],
            
            extraExamples: [
              {en:'Take a photo of the view.', zh:'给风景拍张照。'},
              {en:'This is a photo of my family.', zh:'这是我家的一张照片。'},
            ],
          }),
          w('j8a1-28', 'ticket', '/ˈtɪkɪt/', 'n.', '票；入场券', 'Buy the tickets online.', '社会与环境', '网上买票。', {
            phrases: [{en:'buy a ticket', zh:'买票'}, {en:'a train ticket', zh:'火车票'}],
            
            extraExamples: [
              {en:'Buy the tickets online.', zh:'网上买票。'},
              {en:'I have two tickets for the movie.', zh:'我有两张电影票。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 2 · Home Sweet Home',
        words: [
          w('j8a2-1', 'pack', '/pæk/', 'v.', '打包；收拾', 'I pack my bag for the trip.', '行为与动作', '我收拾行李准备旅行。', {
            phrases: [{en:'pack my bag', zh:'收拾行李'}, {en:'pack up', zh:'打包好'}],
            
            extraExamples: [
              {en:'I pack my bag for the trip.', zh:'我收拾行李准备旅行。'},
              {en:'She packed her clothes.', zh:'她收拾好了衣服。'},
            ],
          }),
          w('j8a2-2', 'bathroom', '/ˈbɑːθruːm/', 'n.', '浴室；洗手间', 'The bathroom is clean.', '社会与环境', '浴室很干净。', {
            phrases: [{en:'the bathroom is clean', zh:'浴室很干净'}, {en:'go to the bathroom', zh:'去洗手间'}],
            
            extraExamples: [
              {en:'The bathroom is clean.', zh:'浴室很干净。'},
              {en:'Where is the bathroom?', zh:'洗手间在哪里？'},
            ],
          }),
          w('j8a2-3', 'sort', '/sɔːt/', 'v.', '把……分类；整理', 'Sort your books.', '行为与动作', '整理你的书。', {
            phrases: [{en:'sort your books', zh:'整理你的书'}, {en:'sort out', zh:'整理好'}],
            
            extraExamples: [
              {en:'Sort your books on the shelf.', zh:'把你的书整理到架子上。'},
              {en:'We sort the rubbish.', zh:'我们给垃圾分类。'},
            ],
          }),
          w('j8a2-4', 'bedroom', '/ˈbedruːm/', 'n.', '卧室', 'My bedroom is small.', '社会与环境', '我的卧室很小。', {
            phrases: [{en:'my bedroom', zh:'我的卧室'}, {en:'a big bedroom', zh:'大卧室'}],
            
            extraExamples: [
              {en:'My bedroom is small.', zh:'我的卧室很小。'},
              {en:'There is a bed in the bedroom.', zh:'卧室里有一张床。'},
            ],
          }),
          w('j8a2-5', 'balcony', '/ˈbælkəni/', 'n.', '阳台', 'There are flowers on the balcony.', '社会与环境', '阳台上有花。', {
            phrases: [{en:'on the balcony', zh:'在阳台上'}, {en:'a balcony with flowers', zh:'有花的阳台'}],
            
            extraExamples: [
              {en:'There are flowers on the balcony.', zh:'阳台上有花。'},
              {en:'We have breakfast on the balcony.', zh:'我们在阳台上吃早餐。'},
            ],
          }),
          w('j8a2-6', 'invite', '/ɪnˈvaɪt/', 'v.', '邀请', 'I invite my friend home.', '行为与动作', '我邀请朋友来家。', {
            phrases: [{en:'invite sb. to...', zh:'邀请某人去……'}, {en:'invite friends home', zh:'邀请朋友来家'}],
            
            extraExamples: [
              {en:'I invite my friend home.', zh:'我邀请朋友来家。'},
              {en:'She invited me to her party.', zh:'她邀请我参加她的派对。'},
            ],
          }),
          w('j8a2-7', 'arrive', '/əˈraɪv/', 'v.', '到达', 'We arrive home at six.', '行为与动作', '我们六点到家。', {
            phrases: [{en:'arrive home', zh:'到家'}, {en:'arrive in/at', zh:'到达某地'}],
            
            extraExamples: [
              {en:'We arrive home at six.', zh:'我们六点到家。'},
              {en:'What time do you arrive?', zh:'你几点到？'},
            ],
          }),
          w('j8a2-8', 'yet', '/jet/', 'adv.', '还；尚（用于否定/疑问）', 'He has not come yet.', '认知与学术', '他还没来。', {
            phrases: [{en:'not...yet', zh:'还没……'}, {en:'have you...yet?', zh:'你已经……了吗？'}],
            
            extraExamples: [
              {en:'He has not come yet.', zh:'他还没来。'},
              {en:'Have you finished yet?', zh:'你做完了吗？'},
            ],
          }),
          w('j8a2-9', 'add', '/æd/', 'v.', '添加；加', 'Add some sugar.', '行为与动作', '加点糖。', {
            phrases: [{en:'add some sugar', zh:'加点糖'}, {en:'add...to...', zh:'把……加到……'}],
            
            extraExamples: [
              {en:'Add some sugar to my tea.', zh:'给我的茶加点糖。'},
              {en:'Please add my name to the list.', zh:'请把我的名字加到名单上。'},
            ],
          }),
          w('j8a2-10', 'biscuit', '/ˈbɪskɪt/', 'n.', '饼干', 'I have a biscuit.', '社会与环境', '我吃块饼干。', {
            phrases: [{en:'a chocolate biscuit', zh:'巧克力饼干'}, {en:'have a biscuit', zh:'吃块饼干'}],
            
            extraExamples: [
              {en:'I have a biscuit with tea.', zh:'我喝茶吃块饼干。'},
              {en:'The dog likes biscuits.', zh:'狗喜欢吃饼干。'},
            ],
          }),
          w('j8a2-11', 'borrow', '/ˈbɒrəʊ/', 'v.', '借；借入', 'Can I borrow your pen?', '行为与动作', '能借你的笔吗？', {
            phrases: [{en:'borrow sth. from sb.', zh:'向某人借某物'}, {en:'borrow a book', zh:'借书'}],
            
            extraExamples: [
              {en:'Can I borrow your pen?', zh:'能借你的笔吗？'},
              {en:'I borrow books from the library.', zh:'我从图书馆借书。'},
            ],
          }),
          w('j8a2-12', 'plan', '/plæn/', 'n.', '计划 v. 计划', 'We make a plan.', '认知与学术', '我们制定计划。', {
            phrases: [{en:'make a plan', zh:'制定计划'}, {en:'plan to do sth.', zh:'计划做某事'}],
            
            extraExamples: [
              {en:'We make a plan for the trip.', zh:'我们制定旅行计划。'},
              {en:'I plan to visit my grandma.', zh:'我计划去看奶奶。'},
            ],
          }),
          w('j8a2-13', 'treasure', '/ˈtreʒə(r)/', 'n.', '宝物；财富 v. 珍视', 'The house is our treasure.', '社会与环境', '这个家是我们的珍宝。', {
            phrases: [{en:'national treasure', zh:'国宝'}, {en:'treasure time', zh:'珍惜时间'}],
            
            extraExamples: [
              {en:'The house is our treasure.', zh:'这个家是我们的珍宝。'},
              {en:'The museum has many treasures.', zh:'博物馆里有很多珍宝。'},
            ],
          }),
          w('j8a2-14', 'hunt', '/hʌnt/', 'v.', '搜寻；狩猎', 'We hunt for the key.', '行为与动作', '我们找钥匙。', {
            phrases: [{en:'hunt for', zh:'寻找'}, {en:'go hunting', zh:'去打猎'}],
            
            extraExamples: [
              {en:'We hunt for the key everywhere.', zh:'我们到处找钥匙。'},
              {en:'Cats hunt mice.', zh:'猫捉老鼠。'},
            ],
          }),
          w('j8a2-15', 'lift', '/lɪft/', 'v.', '举起；抬起 n. 电梯', 'Lift the box.', '行为与动作', '把箱子抬起来。', {
            phrases: [{en:'lift the box', zh:'抬起箱子'}, {en:'take the lift', zh:'乘电梯'}],
            
            extraExamples: [
              {en:'Lift the box onto the table.', zh:'把箱子搬到桌子上。'},
              {en:'Take the lift to the 5th floor.', zh:'乘电梯到5楼。'},
            ],
          }),
          w('j8a2-16', 'until', '/ənˈtɪl/', 'prep.', '直到……为止', 'Wait until I come back.', '认知与学术', '等到我回来。', {
            phrases: [{en:'wait until', zh:'等到……'}, {en:'not...until', zh:'直到……才'}],
            
            extraExamples: [
              {en:'Wait until I come back.', zh:'等到我回来。'},
              {en:'I didn\u2019t go to bed until 11.', zh:'我直到11点才睡觉。'},
            ],
          }),
          w('j8a2-17', 'rubbish', '/ˈrʌbɪʃ/', 'n.', '垃圾', 'Take out the rubbish.', '社会与环境', '把垃圾拿出去。', {
            phrases: [{en:'take out the rubbish', zh:'倒垃圾'}, {en:'a rubbish bin', zh:'垃圾桶'}],
            
            extraExamples: [
              {en:'Take out the rubbish, please.', zh:'请把垃圾拿出去。'},
              {en:'Don\u2019t throw rubbish on the ground.', zh:'别把垃圾扔在地上。'},
            ],
          }),
          w('j8a2-18', 'journey', '/ˈdʒɜːni/', 'n.', '旅程；旅行', 'The journey is long.', '社会与环境', '旅程很长。', {
            phrases: [{en:'a long journey', zh:'漫长的旅程'}, {en:'go on a journey', zh:'去旅行'}],
            
            extraExamples: [
              {en:'The journey is long.', zh:'旅程很长。'},
              {en:'Have a safe journey!', zh:'一路平安！'},
            ],
          }),
          w('j8a2-19', 'luggage', '/ˈlʌɡɪdʒ/', 'n.', '行李', 'My luggage is heavy.', '社会与环境', '我的行李很重。', {
            phrases: [{en:'heavy luggage', zh:'重行李'}, {en:'a piece of luggage', zh:'一件行李'}],
            
            extraExamples: [
              {en:'My luggage is heavy.', zh:'我的行李很重。'},
              {en:'We check our luggage at the airport.', zh:'我们在机场托运行李。'},
            ],
          }),
          w('j8a2-20', 'familiar', '/fəˈmɪliə(r)/', 'adj.', '熟悉的', 'The house looks familiar.', '品质与状态', '这房子看起来很熟悉。', {
            phrases: [{en:'be familiar with', zh:'熟悉……'}, {en:'a familiar face', zh:'熟悉的面孔'}],
            
            extraExamples: [
              {en:'The house looks familiar.', zh:'这房子看起来很熟悉。'},
              {en:'I am familiar with this book.', zh:'我熟悉这本书。'},
            ],
          }),
          w('j8a2-21', 'fridge', '/frɪdʒ/', 'n.', '冰箱', 'Put the milk in the fridge.', '社会与环境', '把牛奶放进冰箱。', {
            phrases: [{en:'in the fridge', zh:'在冰箱里'}, {en:'open the fridge', zh:'开冰箱'}],
            
            extraExamples: [
              {en:'Put the milk in the fridge.', zh:'把牛奶放进冰箱。'},
              {en:'There is some food in the fridge.', zh:'冰箱里有一些食物。'},
            ],
          }),
          w('j8a2-22', 'shelf', '/ʃelf/', 'n.', '架子；搁板', 'The books are on the shelf.', '社会与环境', '书在架子上。', {
            phrases: [{en:'on the shelf', zh:'在架子上'}, {en:'a book shelf', zh:'书架'}],
            
            extraExamples: [
              {en:'The books are on the shelf.', zh:'书在架子上。'},
              {en:'Put the cup on the shelf.', zh:'把杯子放在架子上。'},
            ],
          }),
          w('j8a2-23', 'sofa', '/ˈsəʊfə/', 'n.', '沙发', 'Sit on the sofa.', '社会与环境', '坐在沙发上。', {
            phrases: [{en:'sit on the sofa', zh:'坐在沙发上'}, {en:'a comfortable sofa', zh:'舒服的沙发'}],
            
            extraExamples: [
              {en:'Sit on the sofa, please.', zh:'请坐在沙发上。'},
              {en:'The cat is sleeping on the sofa.', zh:'猫在沙发上睡觉。'},
            ],
          }),
          w('j8a2-24', 'cupboard', '/ˈkʌbəd/', 'n.', '橱柜；碗柜', 'The cups are in the cupboard.', '社会与环境', '杯子在橱柜里。', {
            phrases: [{en:'in the cupboard', zh:'在橱柜里'}, {en:'a kitchen cupboard', zh:'厨房橱柜'}],
            
            extraExamples: [
              {en:'The cups are in the cupboard.', zh:'杯子在橱柜里。'},
              {en:'Open the cupboard, please.', zh:'请打开橱柜。'},
            ],
          }),
          w('j8a2-25', 'move', '/muːv/', 'v.', '搬家；移动', 'We move to a new house.', '行为与动作', '我们搬到新家。', {
            phrases: [{en:'move to a new house', zh:'搬到新家'}, {en:'move around', zh:'四处走动'}],
            
            extraExamples: [
              {en:'We move to a new house.', zh:'我们搬到新家。'},
              {en:'Don\u2019t move. Stay still.', zh:'别动，站着别动。'},
            ],
          }),
          w('j8a2-26', 'neighbour', '/ˈneɪbə(r)/', 'n.', '邻居', 'Our neighbour is kind.', '社会与环境', '我们的邻居很善良。', {
            phrases: [{en:'our neighbour', zh:'我们的邻居'}, {en:'next-door neighbour', zh:'隔壁邻居'}],
            
            extraExamples: [
              {en:'Our neighbour is kind.', zh:'我们的邻居很善良。'},
              {en:'The neighbours are friendly.', zh:'邻居们很友好。'},
            ],
          }),
          w('j8a2-27', 'quiet', '/ˈkwaɪət/', 'adj.', '安静的', 'The house is quiet.', '品质与状态', '房子很安静。', {
            phrases: [{en:'a quiet house', zh:'安静的房子'}, {en:'keep quiet', zh:'保持安静'}],
            
            extraExamples: [
              {en:'The house is quiet.', zh:'房子很安静。'},
              {en:'Please keep quiet in the library.', zh:'在图书馆请保持安静。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 3 · Same or Different?',
        words: [
          w('j8a3-1', 'mirror', '/ˈmɪrə(r)/', 'n.', '镜子', 'A friend is like a mirror.', '社会与环境', '朋友就像一面镜子。', {
            phrases: [{en:'look in the mirror', zh:'照镜子'}, {en:'a mirror of...', zh:'……的真实写照'}],
            
            extraExamples: [
              {en:'She looked at herself in the mirror.', zh:'她照了照镜子。'},
              {en:'The novel is a mirror of society.', zh:'这部小说是社会的真实写照。'},
            ],
          }),
          w('j8a3-2', 'interest', '/ˈɪntrəst/', 'n.', '兴趣 v. 使感兴趣', 'She has many interests.', '认知与学术', '她有很多兴趣。', {
            phrases: [{en:'have an interest in...', zh:'对……有兴趣'}, {en:'a place of interest', zh:'名胜古迹'}],
            
            extraExamples: [
              {en:'He shows an interest in science.', zh:'他对科学表现出兴趣。'},
              {en:'Beijing has many places of interest.', zh:'北京有很多名胜古迹。'},
            ],
          }),
          w('j8a3-3', 'novel', '/ˈnɒvl/', 'n.', '小说', 'I read a novel.', '认知与学术', '我读小说。', {
            phrases: [{en:'a historical novel', zh:'历史小说'}, {en:'a best-selling novel', zh:'畅销小说'}],
            
            extraExamples: [
              {en:'She is writing a novel.', zh:'她在写一部小说。'},
              {en:'I read a love novel last night.', zh:'我昨晚读了一部爱情小说。'},
            ],
          }),
          w('j8a3-4', 'difference', '/ˈdɪfrəns/', 'n.', '差异；不同', 'We can make a difference.', '认知与学术', '我们能带来改变。', {
            phrases: [{en:'make a difference', zh:'有影响，起作用'}, {en:'the difference between A and B', zh:'A和B之间的差异'}],
            
            extraExamples: [
              {en:'There is no difference between them.', zh:'它们之间没有区别。'},
              {en:'One person can make a difference.', zh:'一个人也能带来改变。'},
            ],
          }),
          w('j8a3-5', 'sense', '/sens/', 'n.', '感觉；理解力', 'He has a sense of humour.', '情感与性格', '他有幽默感。', {
            phrases: [{en:'a sense of humour/direction', zh:'幽默感/方向感'}, {en:'make sense', zh:'有道理，讲得通'}],
            
            extraExamples: [
              {en:'This sentence does not make sense.', zh:'这句话讲不通。'},
              {en:'She has a good sense of direction.', zh:'她方向感很好。'},
            ],
          }),
          w('j8a3-6', 'humour', '/ˈhjuːmə(r)/', 'n.', '幽默；幽默感', 'I like her humour.', '情感与性格', '我喜欢她的幽默。', {
            phrases: [{en:'a sense of humour', zh:'幽默感'}, {en:'British humour', zh:'英式幽默'}],
            
            extraExamples: [
              {en:'He has a great sense of humour.', zh:'他很有幽默感。'},
              {en:'I like her dry humour.', zh:'我喜欢她那种冷幽默。'},
            ],
          }),
          w('j8a3-7', 'less', '/les/', 'adj.', '较少的；更少的', 'I have less money than you.', '认知与学术', '我的钱比你少。', {
            phrases: [{en:'less than...', zh:'少于……'}, {en:'more or less', zh:'或多或少'}],
            
            extraExamples: [
              {en:'There is less water in the bottle.', zh:'瓶子里水更少了。'},
              {en:'More or less, we agree.', zh:'我们大致同意。'},
            ],
          }),
          w('j8a3-8', 'opinion', '/əˈpɪnjən/', 'n.', '看法；意见', 'In my opinion, you are right.', '认知与学术', '在我看来你是对的。', {
            phrases: [{en:'in my opinion', zh:'在我看来'}, {en:'give one’s opinion on...', zh:'就……发表意见'}],
            
            extraExamples: [
              {en:'What is your opinion about this plan?', zh:'你对这个计划怎么看？'},
              {en:'Public opinion supports the change.', zh:'公众舆论支持这一改变。'},
            ],
          }),
          w('j8a3-9', 'honest', '/ˈɒnɪst/', 'adj.', '坦诚的；诚实的', 'He is an honest boy.', '情感与性格', '他是个诚实的男孩。', {
            phrases: [{en:'to be honest', zh:'说实话'}, {en:'an honest person', zh:'诚实的人'}],
            
            extraExamples: [
              {en:'To be honest, I don’t like it.', zh:'说实话，我不喜欢。'},
              {en:'She gave an honest answer.', zh:'她给了诚实的回答。'},
            ],
          }),
          w('j8a3-10', 'direct', '/dəˈrekt/', 'adj.', '率直的；直接的', 'She gave a direct answer.', '品质与状态', '她给了直接的回答。', {
            phrases: [{en:'a direct flight', zh:'直飞航班'}, {en:'direct sb. to...', zh:'给某人指路去……'}],
            
            extraExamples: [
              {en:'There is a direct flight to Beijing.', zh:'有直飞北京的航班。'},
              {en:'Can you direct me to the station?', zh:'你能告诉我去车站怎么走吗？'},
            ],
          }),
          w('j8a3-11', 'similarity', '/ˌsɪməˈlærəti/', 'n.', '相似之处', 'There are many similarities.', '认知与学术', '有很多相似之处。', {
            phrases: [{en:'similarity between A and B', zh:'A与B的相似之处'}, {en:'striking similarity', zh:'惊人的相似'}],
            
            extraExamples: [
              {en:'There are many similarities between the two brothers.', zh:'兄弟俩有很多相似之处。'},
              {en:'The similarity is surprising.', zh:'这种相似令人惊讶。'},
            ],
          }),
          w('j8a3-12', 'friendship', '/ˈfrendʃɪp/', 'n.', '友谊；友情', 'Our friendship is important.', '情感与性格', '我们的友谊很重要。', {
            phrases: [{en:'a close friendship', zh:'亲密的友谊'}, {en:'build a friendship', zh:'建立友谊'}],
            
            extraExamples: [
              {en:'Their friendship has lasted ten years.', zh:'他们的友谊持续了十年。'},
              {en:'True friendship is priceless.', zh:'真正的友谊无价。'},
            ],
          }),
          w('j8a3-13', 'metre', '/ˈmiːtə(r)/', 'n.', '米；公尺', 'The room is five metres long.', '认知与学术', '房间五米长。', {
            phrases: [{en:'a metre tall/high', zh:'一米高'}, {en:'square metre', zh:'平方米'}],
            
            extraExamples: [
              {en:'The tree is ten metres tall.', zh:'这棵树十米高。'},
              {en:'The pool is 25 metres long.', zh:'泳池长25米。'},
            ],
          }),
          w('j8a3-14', 'prince', '/prɪns/', 'n.', '王子', 'The prince is kind.', '社会与环境', '王子很善良。', {
            phrases: [{en:'Prince Charming', zh:'白马王子'}, {en:'the Prince of Wales', zh:'威尔士亲王'}],
            
            extraExamples: [
              {en:'The prince married a common girl.', zh:'王子娶了一个平民女孩。'},
              {en:'The story is about a young prince.', zh:'这个故事讲的是一位年轻王子。'},
            ],
          }),
          w('j8a3-15', 'character', '/ˈkærəktə(r)/', 'n.', '人物；个性', 'The main character is brave.', '社会与环境', '主角很勇敢。', {
            phrases: [{en:'the main character', zh:'主角'}, {en:'a person of good character', zh:'品格高尚的人'}],
            
            extraExamples: [
              {en:'Who is your favorite character in the book?', zh:'书里你最喜欢哪个人物？'},
              {en:'He has a strong character.', zh:'他性格坚强。'},
            ],
          }),
          w('j8a3-16', 'exchange', '/ɪksˈtʃeɪndʒ/', 'v.', '交换；交流', 'We exchange gifts.', '行为与动作', '我们交换礼物。', {
            phrases: [{en:'exchange A for B', zh:'用A换B'}, {en:'exchange ideas/opinions', zh:'交流想法/意见'}],
            
            extraExamples: [
              {en:'We exchanged phone numbers.', zh:'我们交换了电话号码。'},
              {en:'I exchanged my book for his pen.', zh:'我用我的书换了他的笔。'},
            ],
          }),
          w('j8a3-17', 'accident', '/ˈæksɪdənt/', 'n.', '意外；事故', 'He had a car accident.', '社会与环境', '他出了车祸。', {
            phrases: [{en:'by accident', zh:'偶然，意外地'}, {en:'a car/traffic accident', zh:'车祸/交通事故'}],
            
            extraExamples: [
              {en:'I met her by accident.', zh:'我偶然遇见了她。'},
              {en:'The accident happened at night.', zh:'事故发生在夜里。'},
            ],
          }),
          w('j8a3-18', 'expect', '/ɪkˈspekt/', 'v.', '预料；期待', 'I expect to see you.', '情感与性格', '我期待见到你。', {
            phrases: [{en:'expect to do sth.', zh:'期待做某事'}, {en:'as expected', zh:'不出所料'}],
            
            extraExamples: [
              {en:'I expect to finish work early today.', zh:'我期待今天早点下班。'},
              {en:'As expected, he won the game.', zh:'不出所料，他赢了。'},
            ],
          }),
          w('j8a3-19', 'silver', '/ˈsɪlvə(r)/', 'n.', '银 adj. 银色的', 'She has a silver ring.', '社会与环境', '她有枚银戒指。', {
            phrases: [{en:'silver medal', zh:'银牌'}, {en:'a silver spoon', zh:'银勺子'}],
            
            extraExamples: [
              {en:'She won a silver medal.', zh:'她获得了银牌。'},
              {en:'The ring is made of silver.', zh:'这枚戒指是银制的。'},
            ],
          }),
          w('j8a3-20', 'situation', '/ˌsɪtʃuˈeɪʃn/', 'n.', '情况；状况', 'The situation is getting better.', '认知与学术', '情况在好转。', {
            phrases: [{en:'the current situation', zh:'当前局势'}, {en:'in a difficult situation', zh:'处境困难'}],
            
            extraExamples: [
              {en:'The situation is under control.', zh:'局势已得到控制。'},
              {en:'We are in a similar situation.', zh:'我们处境相似。'},
            ],
          }),
          w('j8a3-21', 'reach', '/riːtʃ/', 'v.', '伸手；到达', 'Reach for the book.', '行为与动作', '伸手去拿书。', {
            phrases: [{en:'reach for...', zh:'伸手去拿……'}, {en:'reach an agreement', zh:'达成协议'}],
            
            extraExamples: [
              {en:'The train reached Beijing at noon.', zh:'火车中午到达北京。'},
              {en:'She reached out and took my hand.', zh:'她伸手握住我的手。'},
            ],
          }),
          w('j8a3-22', 'touch', '/tʌtʃ/', 'v.', '触动；触碰', 'Don\u2019t touch the glass.', '行为与动作', '别碰玻璃。', {
            phrases: [{en:'keep in touch (with)', zh:'（与……）保持联系'}, {en:'touch screen', zh:'触摸屏'}],
            
            extraExamples: [
              {en:'Don’t touch the paint—it’s wet.', zh:'别碰油漆，没干。'},
              {en:'Let’s keep in touch.', zh:'我们保持联系。'},
            ],
          }),
          w('j8a3-23', 'talented', '/ˈtæləntɪd/', 'adj.', '有天赋的', 'She is a talented singer.', '品质与状态', '她是个有天赋的歌手。', {
            phrases: [{en:'a talented musician/player', zh:'有天赋的音乐家/选手'}, {en:'be talented in...', zh:'在……方面有天赋'}],
            
            extraExamples: [
              {en:'He is a talented young writer.', zh:'他是个有天赋的年轻作家。'},
              {en:'She is talented in music.', zh:'她在音乐方面有天赋。'},
            ],
          }),
          w('j8a3-24', 'both', '/bəʊθ/', 'pron.', '两者都', 'Both of us like reading.', '认知与学术', '我们俩都喜欢阅读。', {
            phrases: [{en:'both A and B', zh:'A和B都'}, {en:'both of us/them', zh:'我们/他们俩都'}],
            
            extraExamples: [
              {en:'Both Tom and Jerry are here.', zh:'汤姆和杰瑞都在。'},
              {en:'Both of the answers are right.', zh:'两个答案都对。'},
            ],
          }),
          w('j8a3-25', 'care about', '/keə əˈbaʊt/', 'phr.', '关心；在乎', 'I care about my friends.', '情感与性格', '我关心我的朋友。', {
            phrases: [{en:'care about sb./sth.', zh:'关心某人/某事'}, {en:'care for sb.', zh:'照顾某人'}],
            
            extraExamples: [
              {en:'She cares about the environment.', zh:'她关心环境。'},
              {en:'I don’t care about money.', zh:'我不在乎钱。'},
            ],
          }),
          w('j8a3-26', 'be different from', '/bi ˈdɪfrənt frɒm/', 'phr.', '与……不同', 'He is different from me.', '认知与学术', '他和我不同。', {
            phrases: [{en:'be different from...', zh:'与……不同'}, {en:'make a difference', zh:'有影响'}],
            
            extraExamples: [
              {en:'City life is different from country life.', zh:'城市生活和乡村生活不同。'},
              {en:'His opinion is different from mine.', zh:'他的意见和我的不同。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 4 · Amazing Plants and Animals',
        words: [
          w('j8a4-1', 'moss', '/mɒs/', 'n.', '苔藓', 'Moss grows on the stone.', '社会与环境', '石头上长着苔藓。', {
            phrases: [{en:'moss grows on...', zh:'苔藓长在……上'}, {en:'moss-covered stone', zh:'长满苔藓的石头'}],
            
            extraExamples: [
              {en:'The old tree is covered with moss.', zh:'老树上长满了苔藓。'},
              {en:'Moss needs a wet place to grow.', zh:'苔藓需要潮湿的地方生长。'},
            ],
          }),
          w('j8a4-2', 'redwood', '/ˈredwʊd/', 'n.', '红杉；红木', 'The redwood is very tall.', '社会与环境', '红杉非常高。', {
            phrases: [{en:'a redwood tree', zh:'一棵红杉'}, {en:'redwood forest', zh:'红杉林'}],
            
            extraExamples: [
              {en:'Redwoods can live for thousands of years.', zh:'红杉可以活几千年。'},
              {en:'We walked through a redwood forest.', zh:'我们穿过一片红杉林。'},
            ],
          }),
          w('j8a4-3', 'cheetah', '/ˈtʃiːtə/', 'n.', '猎豹', 'The cheetah runs fast.', '社会与环境', '猎豹跑得快。', {
            phrases: [{en:'a cheetah can run...', zh:'猎豹能跑……'}, {en:'cheetah spots', zh:'猎豹的斑点'}],
            
            extraExamples: [
              {en:'The cheetah is the fastest land animal.', zh:'猎豹是陆地上跑得最快的动物。'},
              {en:'A cheetah can run 100 km per hour.', zh:'猎豹时速可达100公里。'},
            ],
          }),
          w('j8a4-4', 'bamboo', '/ˌbæmˈbuː/', 'n.', '竹；竹子', 'Pandas eat bamboo.', '社会与环境', '熊猫吃竹子。', {
            phrases: [{en:'bamboo shoot', zh:'竹笋'}, {en:'bamboo forest', zh:'竹林'}],
            
            extraExamples: [
              {en:'There is a bamboo forest behind the house.', zh:'房子后面有一片竹林。'},
              {en:'Bamboo is used to make many things.', zh:'竹子可以用来做很多东西。'},
            ],
          }),
          w('j8a4-5', 'popular', '/ˈpɒpjələ(r)/', 'adj.', '受欢迎的；流行的', 'This plant is popular.', '品质与状态', '这种植物很受欢迎。', {
            phrases: [{en:'be popular with...', zh:'受……欢迎'}, {en:'a popular song/star', zh:'流行歌曲/明星'}],
            
            extraExamples: [
              {en:'This song is popular with young people.', zh:'这首歌很受年轻人欢迎。'},
              {en:'Football is a popular sport.', zh:'足球是一项流行运动。'},
            ],
          }),
          w('j8a4-6', 'tool', '/tuːl/', 'n.', '工具；手段', 'A knife is a useful tool.', '社会与环境', '刀是有用的工具。', {
            phrases: [{en:'a useful tool', zh:'有用的工具'}, {en:'toolbox', zh:'工具箱'}],
            
            extraExamples: [
              {en:'A hammer is a basic tool.', zh:'锤子是基本工具。'},
              {en:'Language is a tool for communication.', zh:'语言是交流的工具。'},
            ],
          }),
          w('j8a4-7', 'actually', '/ˈæktʃuəli/', 'adv.', '实际上；居然', 'Actually, I agree.', '认知与学术', '其实我同意。', {
            phrases: [{en:'actually, ...', zh:'其实，……'}, {en:'actually do sth.', zh:'实际上做某事'}],
            
            extraExamples: [
              {en:'Actually, I don’t know him.', zh:'其实我不认识他。'},
              {en:'He actually finished first.', zh:'他居然第一个完成了。'},
            ],
          }),
          w('j8a4-8', 'shoot', '/ʃuːt/', 'n.', '幼苗；嫩芽 v. 射击', 'The shoot comes up in spring.', '社会与环境', '春天嫩芽冒出来。', {
            phrases: [{en:'bamboo shoots', zh:'竹笋'}, {en:'shoot at...', zh:'向……射击'}],
            
            extraExamples: [
              {en:'The new shoots come out in spring.', zh:'春天新芽冒出来。'},
              {en:'He shot at the bird but missed.', zh:'他向鸟射击但没打中。'},
            ],
          }),
          w('j8a4-9', 'appear', '/əˈpɪə(r)/', 'v.', '出现；看来', 'The sun appears.', '行为与动作', '太阳出来了。', {
            phrases: [{en:'appear to do sth.', zh:'似乎做某事'}, {en:'it appears that...', zh:'看来……'}],
            
            extraExamples: [
              {en:'A rainbow appeared in the sky.', zh:'天空中出现了彩虹。'},
              {en:'He appears tired.', zh:'他看起来很累。'},
            ],
          }),
          w('j8a4-10', 'land', '/lænd/', 'n.', '陆地 v. 降落', 'The plane lands at noon.', '社会与环境', '飞机中午降落。', {
            phrases: [{en:'by land', zh:'由陆路'}, {en:'land on...', zh:'降落在……'}],
            
            extraExamples: [
              {en:'The plane landed safely.', zh:'飞机安全降落。'},
              {en:'We traveled by land.', zh:'我们走陆路旅行。'},
            ],
          }),
          w('j8a4-11', 'African', '/ˈæfrɪkən/', 'adj.', '非洲的 n. 非洲人', 'The elephant is African.', '社会与环境', '这头大象来自非洲。', {
            phrases: [{en:'African elephants', zh:'非洲象'}, {en:'African culture', zh:'非洲文化'}],
            
            extraExamples: [
              {en:'African elephants are large.', zh:'非洲象体型很大。'},
              {en:'She is an African student.', zh:'她是一位非洲学生。'},
            ],
          }),
          w('j8a4-12', 'rose', '/rəʊz/', 'n.', '玫瑰；蔷薇', 'The rose smells sweet.', '社会与环境', '玫瑰很香。', {
            phrases: [{en:'a red rose', zh:'红玫瑰'}, {en:'rose garden', zh:'玫瑰园'}],
            
            extraExamples: [
              {en:'He gave her a bunch of roses.', zh:'他送她一束玫瑰。'},
              {en:'The rose is the national flower of England.', zh:'玫瑰是英国国花。'},
            ],
          }),
          w('j8a4-13', 'lotus', '/ˈləʊtəs/', 'n.', '莲花', 'The lotus grows in water.', '社会与环境', '莲花长在水里。', {
            phrases: [{en:'lotus root', zh:'莲藕'}, {en:'lotus flower', zh:'莲花'}],
            
            extraExamples: [
              {en:'The lotus grows in muddy water.', zh:'莲花出淤泥而不染。'},
              {en:'Lotus root is a common food.', zh:'莲藕是常见食物。'},
            ],
          }),
          w('j8a4-14', 'butterfly', '/ˈbʌtəflaɪ/', 'n.', '蝴蝶', 'A butterfly flies by.', '社会与环境', '一只蝴蝶飞过。', {
            phrases: [{en:'butterfly wings', zh:'蝴蝶翅膀'}, {en:'have butterflies in one’s stomach', zh:'心里七上八下'}],
            
            extraExamples: [
              {en:'A butterfly landed on the flower.', zh:'一只蝴蝶落在花上。'},
              {en:'She has a butterfly tattoo.', zh:'她有个蝴蝶纹身。'},
            ],
          }),
          w('j8a4-15', 'wing', '/wɪŋ/', 'n.', '翅膀；翼', 'The bird spreads its wings.', '社会与环境', '鸟展开翅膀。', {
            phrases: [{en:'spread one’s wings', zh:'展翅'}, {en:'left/right wing', zh:'左翼/右翼'}],
            
            extraExamples: [
              {en:'The bird flapped its wings.', zh:'鸟拍打着翅膀。'},
              {en:'The plane has two wings.', zh:'飞机有两个机翼。'},
            ],
          }),
          w('j8a4-16', 'frog', '/frɒɡ/', 'n.', '蛙；青蛙', 'The frog jumps.', '社会与环境', '青蛙跳。', {
            phrases: [{en:'a frog in the pond', zh:'池塘里的青蛙'}, {en:'frog legs', zh:'蛙腿'}],
            
            extraExamples: [
              {en:'Frogs live near water.', zh:'青蛙生活在水边。'},
              {en:'The frog jumped into the pond.', zh:'青蛙跳进了池塘。'},
            ],
          }),
          w('j8a4-17', 'weigh', '/weɪ/', 'v.', '有……重；称重', 'It weighs two kilos.', '认知与学术', '它重两公斤。', {
            phrases: [{en:'weigh 50 kilos', zh:'重50公斤'}, {en:'weigh the fruit', zh:'称水果'}],
            
            extraExamples: [
              {en:'How much do you weigh?', zh:'你体重多少？'},
              {en:'The baby weighs three kilos.', zh:'宝宝重三公斤。'},
            ],
          }),
          w('j8a4-18', 'ginkgo', '/ˈɡɪŋkɡəʊ/', 'n.', '银杏', 'The ginkgo is an old tree.', '社会与环境', '银杏是古老的树。', {
            phrases: [{en:'ginkgo tree', zh:'银杏树'}, {en:'ginkgo leaves', zh:'银杏叶'}],
            
            extraExamples: [
              {en:'The ginkgo tree is very old.', zh:'银杏树非常古老。'},
              {en:'Ginkgo leaves turn yellow in autumn.', zh:'秋天银杏叶变黄。'},
            ],
          }),
          w('j8a4-19', 'province', '/ˈprɒvɪns/', 'n.', '省份', 'Sichuan is a province.', '社会与环境', '四川是一个省。', {
            phrases: [{en:'a southern province', zh:'南方省份'}, {en:'province capital', zh:'省会'}],
            
            extraExamples: [
              {en:'Hunan is a province in China.', zh:'湖南是中国的一个省。'},
              {en:'The village is in Yunnan Province.', zh:'这个村子在云南省。'},
            ],
          }),
          w('j8a4-20', 'earth', '/ɜːθ/', 'n.', '地球；世界', 'We live on the earth.', '社会与环境', '我们生活在地球上。', {
            phrases: [{en:'on earth', zh:'究竟；在世界上'}, {en:'the earth’s surface', zh:'地球表面'}],
            
            extraExamples: [
              {en:'The earth goes around the sun.', zh:'地球绕着太阳转。'},
              {en:'What on earth are you doing?', zh:'你到底在干什么？'},
            ],
          }),
          w('j8a4-21', 'imagine', '/ɪˈmædʒɪn/', 'v.', '想象；猜想', 'Imagine a big forest.', '认知与学术', '想象一片大森林。', {
            phrases: [{en:'imagine doing sth.', zh:'想象做某事'}, {en:'imagine that...', zh:'想象……'}],
            
            extraExamples: [
              {en:'Imagine you are on a beach.', zh:'想象你在海滩上。'},
              {en:'I can imagine the scene.', zh:'我能想象那个场景。'},
            ],
          }),
          w('j8a4-22', 'honey', '/ˈhʌni/', 'n.', '蜂蜜', 'Bees make honey.', '社会与环境', '蜜蜂酿蜜。', {
            phrases: [{en:'honey bee', zh:'蜜蜂'}, {en:'honey and milk', zh:'蜂蜜和牛奶'}],
            
            extraExamples: [
              {en:'Honey is sweet.', zh:'蜂蜜很甜。'},
              {en:'She puts honey in her tea.', zh:'她在茶里加蜂蜜。'},
            ],
          }),
          w('j8a4-23', 'disappointed', '/ˌdɪsəˈpɔɪntɪd/', 'adj.', '失望的；沮丧的', 'I feel disappointed.', '情感与性格', '我感到失望。', {
            phrases: [{en:'be disappointed with/in...', zh:'对……失望'}, {en:'be disappointed to do sth.', zh:'做某事感到失望'}],
            
            extraExamples: [
              {en:'I was disappointed with the result.', zh:'我对结果感到失望。'},
              {en:'She looked disappointed.', zh:'她看起来很失望。'},
            ],
          }),
          w('j8a4-24', 'communicate', '/kəˈmjuːnɪkeɪt/', 'v.', '交流；沟通', 'Bees communicate by dancing.', '行为与动作', '蜜蜂通过跳舞交流。', {
            phrases: [{en:'communicate with sb.', zh:'与某人交流'}, {en:'communicate sth. to sb.', zh:'把某事传达给某人'}],
            
            extraExamples: [
              {en:'We communicate by email.', zh:'我们通过邮件交流。'},
              {en:'Dogs communicate by barking.', zh:'狗通过吠叫交流。'},
            ],
          }),
          w('j8a4-25', 'protect', '/prəˈtekt/', 'v.', '保护；防护', 'We protect animals.', '行为与动作', '我们保护动物。', {
            phrases: [{en:'protect sb. from/against...', zh:'保护某人免受……'}, {en:'protect the environment', zh:'保护环境'}],
            
            extraExamples: [
              {en:'We should protect wild animals.', zh:'我们应该保护野生动物。'},
              {en:'Sunglasses protect your eyes.', zh:'太阳镜保护眼睛。'},
            ],
          }),
          w('j8a4-26', 'ant', '/ænt/', 'n.', '蚂蚁', 'An ant is small.', '社会与环境', '蚂蚁很小。', {
            phrases: [{en:'ant colony', zh:'蚁群'}, {en:'worker ant', zh:'工蚁'}],
            
            extraExamples: [
              {en:'Ants live together in groups.', zh:'蚂蚁群居。'},
              {en:'An ant can carry many times its weight.', zh:'蚂蚁能搬动比自己重很多倍的东西。'},
            ],
          }),
          w('j8a4-27', 'mushroom', '/ˈmʌʃruːm/', 'n.', '蘑菇', 'We picked mushrooms.', '社会与环境', '我们采了蘑菇。', {
            phrases: [{en:'pick mushrooms', zh:'采蘑菇'}, {en:'mushroom soup', zh:'蘑菇汤'}],
            
            extraExamples: [
              {en:'Some mushrooms are poisonous.', zh:'有些蘑菇有毒。'},
              {en:'We had mushroom soup for lunch.', zh:'我们午饭喝了蘑菇汤。'},
            ],
          }),
          w('j8a4-28', 'climate', '/ˈklaɪmət/', 'n.', '气候', 'The climate is warm.', '社会与环境', '气候温暖。', {
            phrases: [{en:'warm/cold climate', zh:'温暖/寒冷的气候'}, {en:'climate change', zh:'气候变化'}],
            
            extraExamples: [
              {en:'The climate here is mild.', zh:'这里气候温和。'},
              {en:'Climate change is a big problem.', zh:'气候变化是个大问题。'},
            ],
          }),
          w('j8a4-29', 'ocean', '/ˈəʊʃn/', 'n.', '大海；海洋', 'The ocean is deep.', '社会与环境', '海洋很深。', {
            phrases: [{en:'the Pacific Ocean', zh:'太平洋'}, {en:'ocean life', zh:'海洋生物'}],
            
            extraExamples: [
              {en:'The ocean covers most of the earth.', zh:'海洋覆盖地球大部分。'},
              {en:'We swam in the ocean.', zh:'我们在海里游泳。'},
            ],
          }),
          w('j8a4-30', 'tiny', '/ˈtaɪni/', 'adj.', '极小的；微小的', 'The ant is tiny.', '品质与状态', '蚂蚁极小。', {
            phrases: [{en:'a tiny bit', zh:'一点点'}, {en:'tiny particles', zh:'微小颗粒'}],
            
            extraExamples: [
              {en:'The baby’s fingers are tiny.', zh:'宝宝的手指很小。'},
              {en:'There is a tiny hole in the wall.', zh:'墙上有个小洞。'},
            ],
          }),
          w('j8a4-31', 'lively', '/ˈlaɪvli/', 'adj.', '生机勃勃的', 'The garden is lively.', '品质与状态', '花园生机勃勃。', {
            phrases: [{en:'a lively city', zh:'充满活力的城市'}, {en:'lively music', zh:'欢快的音乐'}],
            
            extraExamples: [
              {en:'The market is lively in the morning.', zh:'早晨市场很热闹。'},
              {en:'She gave a lively speech.', zh:'她做了生动的演讲。'},
            ],
          }),
          w('j8a4-32', 'bee', '/biː/', 'n.', '蜜蜂', 'A bee is on the flower.', '社会与环境', '蜜蜂在花上。', {
            phrases: [{en:'worker bee', zh:'工蜂'}, {en:'as busy as a bee', zh:'忙得团团转'}],
            
            extraExamples: [
              {en:'Bees make honey.', zh:'蜜蜂酿蜜。'},
              {en:'A bee flew into the room.', zh:'一只蜜蜂飞进了房间。'},
            ],
          }),
        ],
      },
      {
        title: 'Unit 5 · What a Delicious Meal!',
        words: [
          w('j8a5-1', 'pepper', '/ˈpepə(r)/', 'n.', '胡椒粉；菜椒', 'Add some pepper.', '社会与环境', '加点胡椒粉。'),
          w('j8a5-2', 'mix', '/mɪks/', 'v.', '混合；调配', 'Mix the flour and water.', '行为与动作', '把面粉和水混合。'),
          w('j8a5-3', 'bake', '/beɪk/', 'v.', '烘焙', 'Bake the cake for 30 minutes.', '行为与动作', '把蛋糕烤30分钟。'),
          w('j8a5-4', 'oven', '/ˈʌvn/', 'n.', '烤箱；烤炉', 'Put it in the oven.', '社会与环境', '把它放进烤箱。'),
          w('j8a5-5', 'flour', '/ˈflaʊə(r)/', 'n.', '面粉', 'We need some flour.', '社会与环境', '我们需要些面粉。'),
          w('j8a5-6', 'boil', '/bɔɪl/', 'v.', '煮沸；烧开', 'Boil the water first.', '行为与动作', '先把水烧开。'),
          w('j8a5-7', 'butter', '/ˈbʌtə(r)/', 'n.', '黄油', 'Spread butter on the bread.', '社会与环境', '在面包上抹黄油。'),
          w('j8a5-8', 'cheese', '/tʃiːz/', 'n.', '奶酪；干酪', 'I like cheese.', '社会与环境', '我喜欢奶酪。'),
          w('j8a5-9', 'tablespoon', '/ˈteɪblspuːn/', 'n.', '一汤匙；汤匙', 'Add two tablespoons of sugar.', '社会与环境', '加两汤匙糖。'),
          w('j8a5-10', 'mash', '/mæʃ/', 'v.', '捣烂；捣碎', 'Mash the potatoes.', '行为与动作', '把土豆捣成泥。'),
          w('j8a5-11', 'stir-fry', '/ˈstɜː fraɪ/', 'v.', '翻炒；炒', 'Stir-fry the vegetables.', '行为与动作', '翻炒蔬菜。'),
          w('j8a5-12', 'bowl', '/bəʊl/', 'n.', '碗；钵', 'The soup is in a bowl.', '社会与环境', '汤在碗里。'),
          w('j8a5-13', 'heat', '/hiːt/', 'v.', '加热 n. 热', 'Heat the oil.', '行为与动作', '把油加热。'),
          w('j8a5-14', 'oil', '/ɔɪl/', 'n.', '食用油；油', 'The pan is hot with oil.', '社会与环境', '锅里热油。'),
          w('j8a5-15', 'pan', '/pæn/', 'n.', '平底锅；烤盘', 'Fry it in the pan.', '社会与环境', '在平底锅里煎。'),
          w('j8a5-16', 'simple', '/ˈsɪmpl/', 'adj.', '简单的；朴素的', 'The recipe is simple.', '品质与状态', '这个做法很简单。'),
          w('j8a5-17', 'ingredient', '/ɪnˈɡriːdiənt/', 'n.', '食材；成分', 'Buy fresh ingredients.', '社会与环境', '买新鲜食材。'),
          w('j8a5-18', 'recipe', '/ˈresəpi/', 'n.', '食谱；烹饪法', 'Follow the recipe.', '认知与学术', '按食谱做。'),
          w('j8a5-19', 'knife', '/naɪf/', 'n.', '刀；刀具', 'Cut it with a knife.', '社会与环境', '用刀切。'),
          w('j8a5-20', 'spoon', '/spuːn/', 'n.', '勺子；匙', 'Eat soup with a spoon.', '社会与环境', '用勺子喝汤。'),
          w('j8a5-21', 'chopstick', '/ˈtʃɒpstɪk/', 'n.', '筷子', 'Chinese use chopsticks.', '社会与环境', '中国人用筷子。'),
          w('j8a5-22', 'delicious', '/dɪˈlɪʃəs/', 'adj.', '美味的；可口的', 'The dish is delicious.', '品质与状态', '这道菜很美味。'),
          w('j8a5-23', 'taste', '/teɪst/', 'v.', '尝 n. 味道', 'Taste the soup.', '行为与动作', '尝尝汤。'),
          w('j8a5-24', 'sweet', '/swiːt/', 'adj.', '甜的；可爱的', 'The cake is sweet.', '品质与状态', '蛋糕很甜。'),
          w('j8a5-25', 'salty', '/ˈsɔːlti/', 'adj.', '咸的', 'The soup is too salty.', '品质与状态', '汤太咸了。'),
          w('j8a5-26', 'sour', '/ˈsaʊə(r)/', 'adj.', '酸的', 'The lemon is sour.', '品质与状态', '柠檬是酸的。'),
        ],
      },
      {
        title: 'Unit 6 · New Adventures',
        words: [
          w('j8a6-1', 'adventure', '/ədˈventʃə(r)/', 'n.', '冒险；奇遇', 'It is a great adventure.', '社会与环境', '这是一次大冒险。'),
          w('j8a6-2', 'explore', '/ɪkˈsplɔː(r)/', 'v.', '探索；探险', 'We explore the cave.', '行为与动作', '我们探索洞穴。'),
          w('j8a6-3', 'journey', '/ˈdʒɜːni/', 'n.', '旅程；旅行', 'The journey begins.', '社会与环境', '旅程开始了。'),
          w('j8a6-4', 'wild', '/waɪld/', 'adj.', '野生的；野外的', 'Wild animals live in the forest.', '社会与环境', '野生动物生活在森林里。'),
          w('j8a6-5', 'risk', '/rɪsk/', 'n.', '风险；危险 v. 冒险', 'Don\u2019t take risks.', '认知与学术', '不要冒险。'),
          w('j8a6-6', 'courage', '/ˈkʌrɪdʒ/', 'n.', '勇气；胆量', 'He has great courage.', '情感与性格', '他很有勇气。'),
          w('j8a6-7', 'brave', '/breɪv/', 'adj.', '勇敢的', 'The brave boy saves the cat.', '情感与性格', '勇敢的男孩救了猫。'),
          w('j8a6-8', 'decision', '/dɪˈsɪʒn/', 'n.', '决定；抉择', 'It is a hard decision.', '认知与学术', '这是个艰难的决定。'),
          w('j8a6-9', 'choose', '/tʃuːz/', 'v.', '选择；挑选', 'Choose the right path.', '行为与动作', '选对路。'),
          w('j8a6-10', 'path', '/pɑːθ/', 'n.', '小路；途径', 'The path leads to the village.', '社会与环境', '小路通向村庄。'),
          w('j8a6-11', 'map', '/mæp/', 'n.', '地图', 'Read the map.', '认知与学术', '看地图。'),
          w('j8a6-12', 'compass', '/ˈkʌmpəs/', 'n.', '指南针；罗盘', 'Use a compass in the forest.', '社会与环境', '在森林里用指南针。'),
          w('j8a6-13', 'tent', '/tent/', 'n.', '帐篷', 'We put up a tent.', '社会与环境', '我们搭帐篷。'),
          w('j8a6-14', 'torch', '/tɔːtʃ/', 'n.', '手电筒；火把', 'Take a torch at night.', '社会与环境', '晚上带手电筒。'),
          w('j8a6-15', 'supply', '/səˈplaɪ/', 'n.', '供应；补给 v. 供应', 'We need fresh supplies.', '社会与环境', '我们需要新鲜补给。'),
          w('j8a6-16', 'rock', '/rɒk/', 'n.', '岩石；礁石', 'The rocks are steep.', '社会与环境', '岩石很陡。'),
          w('j8a6-17', 'stream', '/striːm/', 'n.', '小溪；溪流', 'A stream runs through the woods.', '社会与环境', '一条小溪流过树林。'),
          w('j8a6-18', 'valley', '/ˈvæli/', 'n.', '山谷；溪谷', 'The valley is green.', '社会与环境', '山谷一片翠绿。'),
          w('j8a6-19', 'challenge', '/ˈtʃælɪndʒ/', 'n.', '挑战 v. 向……挑战', 'It is a big challenge.', '认知与学术', '这是个大挑战。'),
          w('j8a6-20', 'overcome', '/ˌəʊvəˈkʌm/', 'v.', '克服；战胜', 'We overcome difficulties.', '行为与动作', '我们克服困难。'),
          w('j8a6-21', 'goal', '/ɡəʊl/', 'n.', '目标；球门', 'Work towards your goal.', '认知与学术', '朝目标努力。'),
          w('j8a6-22', 'confident', '/ˈkɒnfɪdənt/', 'adj.', '自信的；有把握的', 'She is confident of success.', '情感与性格', '她对成功有信心。'),
          w('j8a6-23', 'proud', '/praʊd/', 'adj.', '自豪的；骄傲的', 'I am proud of you.', '情感与性格', '我为你自豪。'),
          w('j8a6-24', 'succeed', '/səkˈsiːd/', 'v.', '成功', 'Hard work leads to success.', '行为与动作', '努力带来成功。'),
        ],
      },
      {
        title: 'Unit 7 · The World of Science',
        words: [
          w('j8a7-1', 'science', '/ˈsaɪəns/', 'n.', '科学', 'Science is interesting.', '认知与学术', '科学很有趣。'),
          w('j8a7-2', 'research', '/rɪˈsɜːtʃ/', 'n.', '研究；调查', 'Do some research.', '认知与学术', '做些研究。'),
          w('j8a7-3', 'experiment', '/ɪkˈsperɪmənt/', 'n.', '实验；试验', 'We do an experiment.', '认知与学术', '我们做实验。'),
          w('j8a7-4', 'invent', '/ɪnˈvent/', 'v.', '发明；创造', 'He invented a new machine.', '行为与动作', '他发明了新机器。'),
          w('j8a7-5', 'invention', '/ɪnˈvenʃn/', 'n.', '发明；发明物', 'It is a great invention.', '认知与学术', '这是个伟大的发明。'),
          w('j8a7-6', 'engineer', '/ˌendʒɪˈnɪə(r)/', 'n.', '工程师', 'He is an engineer.', '社会与环境', '他是工程师。'),
          w('j8a7-7', 'technology', '/tekˈnɒlədʒi/', 'n.', '科技；工艺', 'Technology changes our life.', '认知与学术', '科技改变我们的生活。'),
          w('j8a7-8', 'robot', '/ˈrəʊbɒt/', 'n.', '机器人', 'The robot can talk.', '社会与环境', '机器人会说话。'),
          w('j8a7-9', 'computer', '/kəmˈpjuːtə(r)/', 'n.', '计算机；电脑', 'I use a computer.', '社会与环境', '我用电脑。'),
          w('j8a7-10', 'Internet', '/ˈɪntənet/', 'n.', '互联网', 'We search on the Internet.', '认知与学术', '我们在网上搜索。'),
          w('j8a7-11', 'machine', '/məˈʃiːn/', 'n.', '机器', 'The machine runs fast.', '社会与环境', '机器运转很快。'),
          w('j8a7-12', 'electric', '/ɪˈlektrɪk/', 'adj.', '电的；用电的', 'It is an electric bike.', '品质与状态', '这是辆电动车。'),
          w('j8a7-13', 'energy', '/ˈenədʒi/', 'n.', '能量；能源', 'Solar energy is clean.', '认知与学术', '太阳能是清洁能源。'),
          w('j8a7-14', 'space', '/speɪs/', 'n.', '太空；空间', 'They travel in space.', '社会与环境', '他们在太空旅行。'),
          w('j8a7-15', 'astronaut', '/ˈæstrənɔːt/', 'n.', '宇航员', 'The astronaut walks in space.', '社会与环境', '宇航员在太空行走。'),
          w('j8a7-16', 'star', '/stɑː(r)/', 'n.', '星；恒星', 'The stars are bright.', '社会与环境', '星星很亮。'),
          w('j8a7-17', 'moon', '/muːn/', 'n.', '月球；月亮', 'The moon is round.', '社会与环境', '月亮是圆的。'),
          w('j8a7-18', 'earth', '/ɜːθ/', 'n.', '地球', 'The earth goes around the sun.', '社会与环境', '地球绕着太阳转。'),
          w('j8a7-19', 'universe', '/ˈjuːnɪvɜːs/', 'n.', '宇宙', 'The universe is huge.', '社会与环境', '宇宙很大。'),
          w('j8a7-20', 'discover', '/dɪˈskʌvə(r)/', 'v.', '发现', 'Scientists discover new stars.', '行为与动作', '科学家发现新恒星。'),
          w('j8a7-21', 'prove', '/pruːv/', 'v.', '证明；证实', 'Prove your idea.', '行为与动作', '证明你的想法。'),
          w('j8a7-22', 'theory', '/ˈθɪəri/', 'n.', '理论；学说', 'It is a scientific theory.', '认知与学术', '这是科学理论。'),
          w('j8a7-23', 'data', '/ˈdeɪtə/', 'n.', '数据；资料', 'Collect the data.', '认知与学术', '收集数据。'),
          w('j8a7-24', 'test', '/test/', 'v.', '测试 n. 测试', 'Test the new machine.', '行为与动作', '测试新机器。'),
        ],
      },
      {
        title: 'Unit 8 · Once upon a Time',
        words: [
          w('j8a8-1', 'fairy', '/ˈfeəri/', 'n.', '仙女；小精灵', 'The fairy helps the girl.', '社会与环境', '仙女帮助女孩。'),
          w('j8a8-2', 'tale', '/teɪl/', 'n.', '故事；传说', 'It is a fairy tale.', '认知与学术', '这是个童话。'),
          w('j8a8-3', 'princess', '/ˌprɪnˈses/', 'n.', '公主', 'The princess is beautiful.', '社会与环境', '公主很美。'),
          w('j8a8-4', 'prince', '/prɪns/', 'n.', '王子', 'The prince saves the princess.', '社会与环境', '王子救了公主。'),
          w('j8a8-5', 'king', '/kɪŋ/', 'n.', '国王', 'The king lives in a castle.', '社会与环境', '国王住在城堡里。'),
          w('j8a8-6', 'queen', '/kwiːn/', 'n.', '女王；王后', 'The queen is kind.', '社会与环境', '王后很善良。'),
          w('j8a8-7', 'castle', '/ˈkɑːsl/', 'n.', '城堡', 'The castle is old.', '社会与环境', '城堡很古老。'),
          w('j8a8-8', 'magic', '/ˈmædʒɪk/', 'n.', '魔法 adj. 神奇的', 'The magic lamp grants wishes.', '认知与学术', '神灯能实现愿望。'),
          w('j8a8-9', 'wizard', '/ˈwɪzəd/', 'n.', '男巫；术士', 'The wizard casts a spell.', '社会与环境', '巫师念咒语。'),
          w('j8a8-10', 'witch', '/wɪtʃ/', 'n.', '女巫', 'The witch is ugly.', '社会与环境', '女巫很丑。'),
          w('j8a8-11', 'forest', '/ˈfɒrɪst/', 'n.', '森林', 'They get lost in the forest.', '社会与环境', '他们在森林里迷路了。'),
          w('j8a8-12', 'gold', '/ɡəʊld/', 'n.', '黄金 adj. 金色的', 'The cup is made of gold.', '社会与环境', '杯子是金的。'),
          w('j8a8-13', 'silver', '/ˈsɪlvə(r)/', 'n.', '银 adj. 银色的', 'She wears a silver crown.', '社会与环境', '她戴着银王冠。'),
          w('j8a8-14', 'brave', '/breɪv/', 'adj.', '勇敢的', 'The brave knight fights the dragon.', '情感与性格', '勇敢的骑士与龙搏斗。'),
          w('j8a8-15', 'knight', '/naɪt/', 'n.', '骑士', 'The knight protects the king.', '社会与环境', '骑士保护国王。'),
          w('j8a8-16', 'fight', '/faɪt/', 'v.', '打架；战斗 n. 战斗', 'They fight the monster.', '行为与动作', '他们与怪物搏斗。'),
          w('j8a8-17', 'monster', '/ˈmɒnstə(r)/', 'n.', '怪物；怪兽', 'The monster is scary.', '社会与环境', '怪物很可怕。'),
          w('j8a8-18', 'dream', '/driːm/', 'n.', '梦；梦想 v. 做梦', 'I had a strange dream.', '认知与学术', '我做了个奇怪的梦。'),
          w('j8a8-19', 'sleep', '/sliːp/', 'v.', '睡觉 n. 睡眠', 'Sleep well tonight.', '行为与动作', '今晚睡个好觉。'),
          w('j8a8-20', 'wake', '/weɪk/', 'v.', '醒来；唤醒', 'Wake up, please.', '行为与动作', '请醒来。'),
          w('j8a8-21', 'happy', '/ˈhæpi/', 'adj.', '快乐的；幸福的', 'They live happily ever after.', '情感与性格', '他们从此幸福地生活。'),
          w('j8a8-22', 'sad', '/sæd/', 'adj.', '悲伤的', 'She feels sad.', '情感与性格', '她感到悲伤。'),
          w('j8a8-23', 'once upon a time', '/wʌns əˈpɒn ə taɪm/', 'phr.', '从前', 'Once upon a time, there was a king.', '认知与学术', '从前有一位国王。'),
          w('j8a8-24', 'finally', '/ˈfaɪnəli/', 'adv.', '最终；终于', 'Finally, they found the way home.', '认知与学术', '最终他们找到了回家的路。'),
        ],
      },
    ],
  },
  {
    id: 'junior-8b',
    name: '人教版初中英语八年级下册（新版）',
    units: [
      {
        title: 'Unit 1 · Time to Relax',
        words: [
          w('j8b1-1', 'calligraphy', '/kəˈlɪɡrəfi/', 'n.', '书法；笔迹', 'I practise calligraphy.', '认知与学术', '我练习书法。'),
          w('j8b1-2', 'ski', '/skiː/', 'v.', '滑雪', 'We ski in winter.', '行为与动作', '我们冬天滑雪。'),
          w('j8b1-3', 'program', '/ˈprəʊɡræm/', 'n.', '程序；节目 v. 编程', 'He wrote a small program.', '认知与学术', '他写了个小程序。'),
          w('j8b1-4', 'express', '/ɪkˈspres/', 'v.', '表达；表示', 'Express your ideas clearly.', '行为与动作', '清楚表达你的想法。'),
          w('j8b1-5', 'instructor', '/ɪnˈstrʌktə(r)/', 'n.', '教练；指导者', 'The instructor helps us.', '社会与环境', '教练帮助我们。'),
          w('j8b1-6', 'scared', '/skeəd/', 'adj.', '害怕的；惊慌的', 'She is scared of dogs.', '情感与性格', '她怕狗。'),
          w('j8b1-7', 'fear', '/fɪə(r)/', 'n./v.', '害怕；担忧', 'Don\u2019t fear the challenge.', '情感与性格', '不要害怕挑战。'),
          w('j8b1-8', 'poem', '/ˈpəʊɪm/', 'n.', '诗', 'He wrote a poem.', '认知与学术', '他写了首诗。'),
          w('j8b1-9', 'ink', '/ɪŋk/', 'n.', '墨水', 'The pen needs ink.', '社会与环境', '钢笔需要墨水。'),
          w('j8b1-10', 'manage', '/ˈmænɪdʒ/', 'v.', '完成；管理', 'I can manage it myself.', '行为与动作', '我自己能搞定。'),
          w('j8b1-11', 'push', '/pʊʃ/', 'v.', '督促；推', 'Don\u2019t push me.', '行为与动作', '别催我。'),
          w('j8b1-12', 'myself', '/maɪˈself/', 'pron.', '我自己', 'I did it by myself.', '认知与学术', '我自己做的。'),
          w('j8b1-13', 'chat', '/tʃæt/', 'v./n.', '闲聊', 'We chat online.', '行为与动作', '我们网上聊天。'),
          w('j8b1-14', 'outing', '/ˈaʊtɪŋ/', 'n.', '远足；出游', 'We go on an outing.', '社会与环境', '我们去远足。'),
          w('j8b1-15', 'reduce', '/rɪˈdjuːs/', 'v.', '减少', 'Reduce your stress.', '行为与动作', '减轻你的压力。'),
          w('j8b1-16', 'stress', '/stres/', 'n.', '精神压力；紧张', 'He is under stress.', '情感与性格', '他压力很大。'),
          w('j8b1-17', 'yoga', '/ˈjəʊɡə/', 'n.', '瑜伽', 'Yoga helps me relax.', '社会与环境', '瑜伽帮我放松。'),
          w('j8b1-18', 'object', '/ˈɒbdʒɪkt/', 'n.', '物品；宾语', 'What\u2019s that object?', '社会与环境', '那个物品是什么？'),
          w('j8b1-19', 'achievement', '/əˈtʃiːvmənt/', 'n.', '成就', 'It is a great achievement.', '品质与状态', '这是个伟大成就。'),
          w('j8b1-20', 'suggestion', '/səˈdʒestʃən/', 'n.', '建议；提议', 'Thank you for your suggestion.', '认知与学术', '谢谢你的建议。'),
          w('j8b1-21', 'relax', '/rɪˈlæks/', 'v.', '放松；休息', 'Listen to music to relax.', '行为与动作', '听音乐放松。'),
          w('j8b1-22', 'hobby', '/ˈhɒbi/', 'n.', '业余爱好', 'My hobby is painting.', '社会与环境', '我的爱好是画画。'),
          w('j8b1-23', 'weekend', '/ˌwiːkˈend/', 'n.', '周末', 'We often go hiking on weekends.', '社会与环境', '我们周末常去远足。'),
          w('j8b1-24', 'outdoor', '/ˈaʊtdɔː(r)/', 'adj.', '户外的；室外的', 'Outdoor activities are fun.', '社会与环境', '户外活动很有趣。'),
          w('j8b1-25', 'paint', '/peɪnt/', 'v.', '绘画；涂色 n. 油漆', 'She paints beautiful pictures.', '行为与动作', '她画美丽的画。'),
          w('j8b1-26', 'collect', '/kəˈlekt/', 'v.', '收集；采集', 'He collects stamps.', '行为与动作', '他集邮。'),
        ],
      },
      {
        title: 'Unit 2 · Stay Healthy',
        words: [
          w('j8b2-1', 'ourselves', '/ˌaʊəˈselvz/', 'pron.', '我们自己', 'We enjoyed ourselves.', '认知与学术', '我们玩得很开心。'),
          w('j8b2-2', 'sore', '/sɔː(r)/', 'adj.', '疼痛的；酸痛的', 'My throat is sore.', '品质与状态', '我喉咙痛。'),
          w('j8b2-3', 'throat', '/θrəʊt/', 'n.', '喉咙', 'I have a sore throat.', '社会与环境', '我喉咙痛。'),
          w('j8b2-4', 'stomachache', '/ˈstʌməkeɪk/', 'n.', '胃痛；腹痛', 'I have a stomachache.', '社会与环境', '我胃痛。'),
          w('j8b2-5', 'headache', '/ˈhedeɪk/', 'n.', '头痛', 'She has a bad headache.', '社会与环境', '她头痛得厉害。'),
          w('j8b2-6', 'fever', '/ˈfiːvə(r)/', 'n.', '发烧', 'He has a fever.', '社会与环境', '他发烧了。'),
          w('j8b2-7', 'avoid', '/əˈvɔɪd/', 'v.', '避免；防止', 'Avoid eating too much sugar.', '行为与动作', '避免吃太多糖。'),
          w('j8b2-8', 'X-ray', '/ˈeks reɪ/', 'n.', 'X光照片；X射线', 'The doctor took an X-ray.', '社会与环境', '医生拍了X光。'),
          w('j8b2-9', 'careless', '/ˈkeələs/', 'adj.', '粗心的', 'A careless driver had an accident.', '品质与状态', '粗心的司机出了事故。'),
          w('j8b2-10', 'cough', '/kɒf/', 'n./v.', '咳嗽', 'I cough day and night.', '行为与动作', '我日夜咳嗽。'),
          w('j8b2-11', 'suffer', '/ˈsʌfə(r)/', 'v.', '受苦；遭受', 'He suffers from a bad cold.', '行为与动作', '他患重感冒。'),
          w('j8b2-12', 'flu', '/fluː/', 'n.', '流行性感冒', 'Many people have the flu.', '社会与环境', '很多人得了流感。'),
          w('j8b2-13', 'medicine', '/ˈmedsn/', 'n.', '药；医学', 'Take the medicine three times a day.', '社会与环境', '一天吃三次药。'),
          w('j8b2-14', 'mask', '/mɑːsk/', 'n.', '口罩；面具', 'Wear a mask in the crowd.', '社会与环境', '在人群中戴口罩。'),
          w('j8b2-15', 'virus', '/ˈvaɪrəs/', 'n.', '病毒', 'The virus spreads fast.', '社会与环境', '病毒传播很快。'),
          w('j8b2-16', 'patient', '/ˈpeɪʃnt/', 'n.', '病人 adj. 有耐心的', 'The patient is getting better.', '社会与环境', '病人在好转。'),
          w('j8b2-17', 'illness', '/ˈɪlnəs/', 'n.', '疾病', 'Rest helps fight illness.', '社会与环境', '休息有助于对抗疾病。'),
          w('j8b2-18', 'pain', '/peɪn/', 'n.', '疼痛；痛苦', 'He feels no pain now.', '情感与性格', '他现在不痛了。'),
          w('j8b2-19', 'safety', '/ˈseɪfti/', 'n.', '安全', 'Safety comes first.', '社会与环境', '安全第一。'),
          w('j8b2-20', 'harmful', '/ˈhɑːmfl/', 'adj.', '有害的', 'Smoking is harmful.', '品质与状态', '吸烟有害。'),
          w('j8b2-21', 'exercise', '/ˈeksəsaɪz/', 'v./n.', '锻炼；练习', 'Exercise every day.', '行为与动作', '每天锻炼。'),
          w('j8b2-22', 'vegetable', '/ˈvedʒtəbl/', 'n.', '蔬菜', 'Eat more vegetables.', '社会与环境', '多吃蔬菜。'),
          w('j8b2-23', 'fruit', '/fruːt/', 'n.', '水果', 'Fruit is good for you.', '社会与环境', '水果对你有益。'),
          w('j8b2-24', 'toothache', '/ˈtuːθeɪk/', 'n.', '牙痛', 'I have a toothache.', '社会与环境', '我牙痛。'),
          w('j8b2-25', 'dentist', '/ˈdentɪst/', 'n.', '牙医', 'See the dentist twice a year.', '社会与环境', '每年看两次牙医。'),
          w('j8b2-26', 'energy', '/ˈenədʒi/', 'n.', '精力；能量', 'Sleep gives you energy.', '认知与学术', '睡眠给你精力。'),
        ],
      },
      {
        title: 'Unit 3 · Growing Up',
        words: [
          w('j8b3-1', 'emotion', '/ɪˈməʊʃn/', 'n.', '情感；情绪', 'Learn to control your emotions.', '情感与性格', '学会控制情绪。'),
          w('j8b3-2', 'upset', '/ʌpˈset/', 'adj.', '难过的；沮丧的', 'She feels upset about the news.', '情感与性格', '她为消息难过。'),
          w('j8b3-3', 'lonely', '/ˈləʊnli/', 'adj.', '孤独的；寂寞的', 'He lives alone but never feels lonely.', '情感与性格', '他独居但不孤独。'),
          w('j8b3-4', 'alone', '/əˈləʊn/', 'adv.', '独自；单独', 'She lives alone.', '认知与学术', '她一个人住。'),
          w('j8b3-5', 'control', '/kənˈtrəʊl/', 'v./n.', '控制', 'Control your temper.', '行为与动作', '控制你的脾气。'),
          w('j8b3-6', 'anger', '/ˈæŋɡə(r)/', 'n.', '怒火；愤怒', 'He could not hide his anger.', '情感与性格', '他掩饰不住怒火。'),
          w('j8b3-7', 'advise', '/ədˈvaɪz/', 'v.', '建议；劝告', 'The doctor advised rest.', '行为与动作', '医生建议休息。'),
          w('j8b3-8', 'forgive', '/fəˈɡɪv/', 'v.', '原谅；宽恕', 'Please forgive me.', '行为与动作', '请原谅我。'),
          w('j8b3-9', 'fault', '/fɔːlt/', 'n.', '过错；责任', 'It is not your fault.', '认知与学术', '这不是你的错。'),
          w('j8b3-10', 'pressure', '/ˈpreʃə(r)/', 'n.', '压力', 'He is under a lot of pressure.', '情感与性格', '他压力很大。'),
          w('j8b3-11', 'purpose', '/ˈpɜːpəs/', 'n.', '目的；意图', 'What is your purpose?', '认知与学术', '你的目的是什么？'),
          w('j8b3-12', 'apologize', '/əˈpɒlədʒaɪz/', 'v.', '道歉', 'He apologized to her.', '行为与动作', '他向她道歉。'),
          w('j8b3-13', 'shut', '/ʃʌt/', 'v.', '关闭；合上', 'Shut the door, please.', '行为与动作', '请关门。'),
          w('j8b3-14', 'plenty', '/ˈplenti/', 'pron.', '充足；大量', 'There is plenty of time.', '认知与学术', '时间很充足。'),
          w('j8b3-15', 'low', '/ləʊ/', 'adj.', '沮丧的；低的', 'She is in low spirits.', '情感与性格', '她情绪低落。'),
          w('j8b3-16', 'enter', '/ˈentə(r)/', 'v.', '进入', 'Please enter the room.', '行为与动作', '请进房间。'),
          w('j8b3-17', 'decision', '/dɪˈsɪʒn/', 'n.', '决定', 'It was a hard decision.', '认知与学术', '这是个艰难的决定。'),
          w('j8b3-18', 'proud', '/praʊd/', 'adj.', '骄傲的；自豪的', 'I am proud of you.', '情感与性格', '我为你骄傲。'),
          w('j8b3-19', 'solution', '/səˈluːʃn/', 'n.', '解决办法', 'We found a solution.', '认知与学术', '我们找到了解决办法。'),
          w('j8b3-20', 'normal', '/ˈnɔːml/', 'adj.', '正常的；普通的', 'It is normal to feel nervous.', '品质与状态', '紧张是正常的。'),
          w('j8b3-21', 'teenager', '/ˈtiːneɪdʒə(r)/', 'n.', '青少年', 'Teenagers need more sleep.', '社会与环境', '青少年需要更多睡眠。'),
          w('j8b3-22', 'grow up', '/ɡrəʊ ʌp/', 'phr.', '长大；成长', 'I want to be a doctor when I grow up.', '行为与动作', '我长大后想当医生。'),
          w('j8b3-23', 'share', '/ʃeə(r)/', 'v.', '分享；共用', 'Share your problems with friends.', '行为与动作', '和朋友分享烦恼。'),
          w('j8b3-24', 'nervous', '/ˈnɜːvəs/', 'adj.', '紧张的；焦虑的', 'I feel nervous before exams.', '情感与性格', '考试前我很紧张。'),
          w('j8b3-25', 'understanding', '/ˌʌndəˈstændɪŋ/', 'adj.', '善解人意的', 'She is an understanding teacher.', '品质与状态', '她是位善解人意的老师。'),
        ],
      },
      {
        title: 'Unit 4 · The Wonders of Nature',
        words: [
          w('j8b4-1', 'wonder', '/ˈwʌndə(r)/', 'n.', '奇观 v. 想知道', 'The Grand Canyon is a wonder.', '社会与环境', '大峡谷是个奇观。'),
          w('j8b4-2', 'surface', '/ˈsɜːfɪs/', 'n.', '表面；表层', 'The surface is cold.', '社会与环境', '表面很冷。'),
          w('j8b4-3', 'depth', '/depθ/', 'n.', '深度；纵深', 'What is the depth?', '认知与学术', '深度是多少？'),
          w('j8b4-4', 'dive', '/daɪv/', 'v.', '潜水；跳水；俯冲', 'They dive into the sea.', '行为与动作', '他们潜入海中。'),
          w('j8b4-5', 'research', '/rɪˈsɜːtʃ/', 'v./n.', '研究；调查', 'They do research on plants.', '认知与学术', '他们研究植物。'),
          w('j8b4-6', 'unusual', '/ʌnˈjuːʒuəl/', 'adj.', '特别的；不寻常的', 'It is an unusual plant.', '品质与状态', '这是种不寻常的植物。'),
          w('j8b4-7', 'bottom', '/ˈbɒtəm/', 'n.', '底部；最下部', 'The coin is at the bottom.', '社会与环境', '硬币在底部。'),
          w('j8b4-8', 'waterfall', '/ˈwɔːtəfɔːl/', 'n.', '瀑布', 'The waterfall is amazing.', '社会与环境', '瀑布很壮观。'),
          w('j8b4-9', 'desert', '/ˈdezət/', 'n.', '沙漠；荒原', 'The desert is dry.', '社会与环境', '沙漠很干燥。'),
          w('j8b4-10', 'mile', '/maɪl/', 'n.', '英里', 'It is miles away.', '认知与学术', '离这里很远。'),
          w('j8b4-11', 'climber', '/ˈklaɪmə(r)/', 'n.', '攀登者；登山者', 'The climber reached the top.', '社会与环境', '登山者登顶了。'),
          w('j8b4-12', 'distance', '/ˈdɪstəns/', 'n.', '距离；遥远', 'The distance is long.', '认知与学术', '距离很远。'),
          w('j8b4-13', 'survive', '/səˈvaɪv/', 'v.', '生存；艰难度过', 'They survived the storm.', '行为与动作', '他们在暴风雨中幸存。'),
          w('j8b4-14', 'condition', '/kənˈdɪʃn/', 'n.', '状态；境况', 'The road conditions are bad.', '认知与学术', '路况很差。'),
          w('j8b4-15', 'degree', '/dɪˈɡriː/', 'n.', '度；程度', 'The water is 90 degrees.', '认知与学术', '水温90度。'),
          w('j8b4-16', 'cliff', '/klɪf/', 'n.', '悬崖；峭壁', 'The cliff is steep.', '社会与环境', '悬崖很陡。'),
          w('j8b4-17', 'determined', '/dɪˈtɜːmɪnd/', 'adj.', '有决心的；坚决的', 'She is determined to succeed.', '情感与性格', '她决心成功。'),
          w('j8b4-18', 'risk', '/rɪsk/', 'v.', '冒风险 n. 危险', 'Don\u2019t risk your life.', '行为与动作', '别冒生命危险。'),
          w('j8b4-19', 'curiosity', '/ˌkjʊəriˈɒsəti/', 'n.', '好奇心；求知欲', 'Out of curiosity, he opened it.', '情感与性格', '出于好奇他打开了它。'),
          w('j8b4-20', 'natural', '/ˈnætʃrəl/', 'adj.', '自然的；天然的', 'It is a natural wonder.', '社会与环境', '这是自然奇观。'),
          w('j8b4-21', 'mountain', '/ˈmaʊntən/', 'n.', '山；山岳', 'The mountain is high.', '社会与环境', '这座山很高。'),
          w('j8b4-22', 'river', '/ˈrɪvə(r)/', 'n.', '河；江', 'The river runs to the sea.', '社会与环境', '这条河流向大海。'),
          w('j8b4-23', 'forest', '/ˈfɒrɪst/', 'n.', '森林', 'The forest is thick.', '社会与环境', '森林很茂密。'),
          w('j8b4-24', 'sky', '/skaɪ/', 'n.', '天空', 'The sky is clear.', '社会与环境', '天空晴朗。'),
          w('j8b4-25', 'ground', '/ɡraʊnd/', 'n.', '地面', 'The ground is wet.', '社会与环境', '地面是湿的。'),
        ],
      },
      {
        title: 'Unit 5 · Nature\u2019s Temper',
        words: [
          w('j8b5-1', 'temper', '/ˈtempə(r)/', 'n.', '脾气；怒气', 'Don\u2019t lose your temper.', '情感与性格', '别发脾气。'),
          w('j8b5-2', 'earthquake', '/ˈɜːθkweɪk/', 'n.', '地震', 'An earthquake hit the city.', '社会与环境', '地震袭击了城市。'),
          w('j8b5-3', 'typhoon', '/taɪˈfuːn/', 'n.', '台风', 'The typhoon is coming.', '社会与环境', '台风要来了。'),
          w('j8b5-4', 'wildfire', '/ˈwaɪldfaɪə(r)/', 'n.', '野火', 'The wildfire spreads fast.', '社会与环境', '野火蔓延很快。'),
          w('j8b5-5', 'snowstorm', '/ˈsnəʊstɔːm/', 'n.', '暴风雪', 'The snowstorm closed the roads.', '社会与环境', '暴风雪封闭了道路。'),
          w('j8b5-6', 'flood', '/flʌd/', 'n.', '洪水；水灾 v. 淹没', 'The flood damaged many houses.', '社会与环境', '洪水毁了许多房屋。'),
          w('j8b5-7', 'drought', '/draʊt/', 'n.', '旱灾；干旱', 'The drought lasted months.', '社会与环境', '干旱持续了数月。'),
          w('j8b5-8', 'wave', '/weɪv/', 'n.', '波浪 v. 挥手', 'A big wave hit the boat.', '社会与环境', '一个大浪打在船上。'),
          w('j8b5-9', 'disaster', '/dɪˈzɑːstə(r)/', 'n.', '灾难；灾祸', 'It was a terrible disaster.', '社会与环境', '那是场可怕的灾难。'),
          w('j8b5-10', 'warn', '/wɔːn/', 'v.', '警告；提醒', 'They warn people to leave.', '行为与动作', '他们警告人们离开。'),
          w('j8b5-11', 'shake', '/ʃeɪk/', 'v.', '摇动；震动', 'The ground shook.', '行为与动作', '地面震动。'),
          w('j8b5-12', 'hit', '/hɪt/', 'v.', '打击；袭击 n. 击', 'The storm hit at night.', '行为与动作', '风暴在夜间来袭。'),
          w('j8b5-13', 'asleep', '/əˈsliːp/', 'adj.', '睡着的', 'He was fast asleep.', '品质与状态', '他睡得很熟。'),
          w('j8b5-14', 'suddenly', '/ˈsʌdənli/', 'adv.', '突然（地）', 'Suddenly, the lights went out.', '认知与学术', '突然灯灭了。'),
          w('j8b5-15', 'window', '/ˈwɪndəʊ/', 'n.', '窗；窗户', 'Open the window.', '社会与环境', '打开窗户。'),
          w('j8b5-16', 'rescue', '/ˈreskjuː/', 'n./v.', '救援；营救', 'They rescued the child.', '行为与动作', '他们救了那个孩子。'),
          w('j8b5-17', 'refuse', '/rɪˈfjuːz/', 'v.', '拒绝；不愿', 'He refused to leave.', '行为与动作', '他拒绝离开。'),
          w('j8b5-18', 'worst', '/wɜːst/', 'adj.', '最坏的；最糟的', 'That was the worst storm.', '品质与状态', '那是最严重的风暴。'),
          w('j8b5-19', 'unlucky', '/ʌnˈlʌki/', 'adj.', '不幸的', 'He was unlucky in the flood.', '品质与状态', '他在洪水中遭遇不幸。'),
          w('j8b5-20', 'firefighter', '/ˈfaɪəfaɪtə(r)/', 'n.', '消防队员', 'The firefighters arrived quickly.', '社会与环境', '消防员很快赶到。'),
          w('j8b5-21', 'protect', '/prəˈtekt/', 'v.', '保护', 'Protect yourself from storms.', '行为与动作', '保护自己免受风暴伤害。'),
          w('j8b5-22', 'safe', '/seɪf/', 'adj.', '安全的', 'Stay in a safe place.', '品质与状态', '待在安全的地方。'),
          w('j8b5-23', 'break down', '/breɪk daʊn/', 'phr.', '出故障；垮掉', 'The bridge broke down in the flood.', '行为与动作', '桥在洪水中垮了。'),
          w('j8b5-24', 'calm', '/kɑːm/', 'adj.', '冷静的', 'Stay calm in danger.', '情感与性格', '危险时保持冷静。'),
          w('j8b5-25', 'helpful', '/ˈhelpfl/', 'adj.', '有帮助的；乐于助人的', 'The firefighters are helpful.', '品质与状态', '消防员很乐于助人。'),
        ],
      },
      {
        title: 'Unit 6 · Crossing Cultures',
        words: [
          w('j8b6-1', 'unsafe', '/ʌnˈseɪf/', 'adj.', '不安全的；危险的', 'The old bridge is unsafe.', '品质与状态', '旧桥不安全。'),
          w('j8b6-2', 'improper', '/ɪmˈprɒpə(r)/', 'adj.', '不合适的；不得体的', 'It is improper to be late.', '品质与状态', '迟到是不得体的。'),
          w('j8b6-3', 'informal', '/ɪnˈfɔːml/', 'adj.', '非正式的', 'It was an informal dinner.', '品质与状态', '那是个非正式晚宴。'),
          w('j8b6-4', 'jeans', '/dʒiːnz/', 'n.', '牛仔裤', 'He wears jeans.', '社会与环境', '他穿着牛仔裤。'),
          w('j8b6-5', 'marry', '/ˈmæri/', 'v.', '结婚；娶；嫁', 'They married last year.', '行为与动作', '他们去年结婚了。'),
          w('j8b6-6', 'congratulate', '/kənˈɡrætʃuleɪt/', 'v.', '祝贺', 'I congratulate you on your success.', '行为与动作', '我祝贺你成功。'),
          w('j8b6-7', 'Asian', '/ˈeɪʃn/', 'adj.', '亚洲的 n. 亚洲人', 'It is an Asian festival.', '社会与环境', '这是个亚洲节日。'),
          w('j8b6-8', 'tradition', '/trəˈdɪʃn/', 'n.', '传统', 'It is a long tradition.', '社会与环境', '这是悠久的传统。'),
          w('j8b6-9', 'firstly', '/ˈfɜːstli/', 'adv.', '第一；首先', 'Firstly, open the door.', '认知与学术', '首先，打开门。'),
          w('j8b6-10', 'correctly', '/kəˈrektli/', 'adv.', '正确地；得体地', 'Answer the question correctly.', '认知与学术', '正确回答问题。'),
          w('j8b6-11', 'receive', '/rɪˈsiːv/', 'v.', '收到；接到', 'I received a gift.', '行为与动作', '我收到一份礼物。'),
          w('j8b6-12', 'main', '/meɪn/', 'adj.', '主要的', 'What is the main idea?', '认知与学术', '主旨是什么？'),
          w('j8b6-13', 'false', '/fɔːls/', 'adj.', '错误的；不真实的', 'The answer is false.', '品质与状态', '这个答案是错的。'),
          w('j8b6-14', 'impression', '/ɪmˈpreʃn/', 'n.', '印象', 'She made a good impression.', '认知与学术', '她留下了好印象。'),
          w('j8b6-15', 'polite', '/pəˈlaɪt/', 'adj.', '有礼貌的', 'Be polite to guests.', '品质与状态', '对客人要有礼貌。'),
          w('j8b6-16', 'greet', '/ɡriːt/', 'v.', '问候；打招呼', 'He greeted me with a smile.', '行为与动作', '他微笑着跟我打招呼。'),
          w('j8b6-17', 'custom', '/ˈkʌstəm/', 'n.', '风俗；习俗', 'Each country has its customs.', '社会与环境', '每个国家有自己的风俗。'),
          w('j8b6-18', 'bow', '/baʊ/', 'v.', '鞠躬 n. 弓', 'They bow to each other.', '行为与动作', '他们互相鞠躬。'),
          w('j8b6-19', 'chopstick', '/ˈtʃɒpstɪk/', 'n.', '筷子', 'Chinese people use chopsticks.', '社会与环境', '中国人用筷子。'),
          w('j8b6-20', 'lunchtime', '/ˈlʌntʃtaɪm/', 'n.', '午餐时间', 'We meet at lunchtime.', '社会与环境', '我们午餐时间见面。'),
          w('j8b6-21', 'western', '/ˈwestən/', 'adj.', '西方的', 'Western table manners are different.', '社会与环境', '西方餐桌礼仪不同。'),
          w('j8b6-22', 'manners', '/ˈmænəz/', 'n.', '礼貌；规矩', 'Good manners are important.', '品质与状态', '有礼貌很重要。'),
          w('j8b6-23', 'kiss', '/kɪs/', 'v./n.', '亲吻', 'They kiss on the cheek to greet.', '行为与动作', '他们贴面亲吻致意。'),
          w('j8b6-24', 'custom', '/ˈkʌstəm/', 'n.', '风俗；习俗', 'It is a local custom.', '社会与环境', '这是当地风俗。'),
          w('j8b6-25', 'foreign', '/ˈfɒrən/', 'adj.', '外国的；外交的', 'He speaks a foreign language.', '社会与环境', '他会说外语。'),
        ],
      },
      {
        title: 'Unit 7 · A Good Read',
        words: [
          w('j8b7-1', 'reader', '/ˈriːdə(r)/', 'n.', '读者；读物', 'He is a fast reader.', '社会与环境', '他读书很快。'),
          w('j8b7-2', 'librarian', '/laɪˈbreəriən/', 'n.', '图书管理员', 'The librarian helps us.', '社会与环境', '图书管理员帮助我们。'),
          w('j8b7-3', 'consider', '/kənˈsɪdə(r)/', 'v.', '考虑；认为', 'Consider my advice.', '行为与动作', '考虑我的建议。'),
          w('j8b7-4', 'enemy', '/ˈenəmi/', 'n.', '敌人', 'They are not enemies.', '社会与环境', '他们不是敌人。'),
          w('j8b7-5', 'naughty', '/ˈnɔːti/', 'adj.', '淘气的', 'The naughty boy broke the cup.', '品质与状态', '淘气的男孩打碎了杯子。'),
          w('j8b7-6', 'gentle', '/ˈdʒentl/', 'adj.', '温柔的；温和的', 'She has a gentle voice.', '品质与状态', '她声音温柔。'),
          w('j8b7-7', 'defeat', '/dɪˈfiːt/', 'v.', '击败；战胜 n. 失败', 'We defeated the other team.', '行为与动作', '我们击败了另一队。'),
          w('j8b7-8', 'recommendation', '/ˌrekəmenˈdeɪʃn/', 'n.', '推荐；提议', 'Thank you for your recommendation.', '认知与学术', '谢谢你的推荐。'),
          w('j8b7-9', 'basic', '/ˈbeɪsɪk/', 'adj.', '基本的；初步的', 'These are basic rules.', '认知与学术', '这些是基本规则。'),
          w('j8b7-10', 'doubt', '/daʊt/', 'v./n.', '怀疑；疑惑', 'I doubt the story is true.', '认知与学术', '我怀疑故事的真实性。'),
          w('j8b7-11', 'destroy', '/dɪˈstrɔɪ/', 'v.', '破坏；摧毁', 'The fire destroyed the house.', '行为与动作', '大火摧毁了房子。'),
          w('j8b7-12', 'introduction', '/ˌɪntrəˈdʌkʃn/', 'n.', '介绍；序言', 'Read the introduction first.', '认知与学术', '先读序言。'),
          w('j8b7-13', 'summary', '/ˈsʌməri/', 'n.', '总结；概要', 'Write a short summary.', '认知与学术', '写个简短总结。'),
          w('j8b7-14', 'spoiled', '/spɔɪld/', 'adj.', '宠坏的；娇惯的', 'The spoiled child cries a lot.', '品质与状态', '那个被宠坏的孩子常哭。'),
          w('j8b7-15', 'selfish', '/ˈselfɪʃ/', 'adj.', '自私的', 'Don\u2019t be selfish.', '品质与状态', '别自私。'),
          w('j8b7-16', 'hidden', '/ˈhɪdn/', 'adj.', '隐藏的；秘密的', 'There is a hidden door.', '品质与状态', '有一扇暗门。'),
          w('j8b7-17', 'prove', '/pruːv/', 'v.', '证明；证实', 'Can you prove it?', '行为与动作', '你能证明吗？'),
          w('j8b7-18', 'society', '/səˈsaɪəti/', 'n.', '社会；社团', 'We live in a modern society.', '社会与环境', '我们生活在现代社会。'),
          w('j8b7-19', 'literary', '/ˈlɪtərəri/', 'adj.', '文学的', 'It is a literary magazine.', '社会与环境', '这是本文学杂志。'),
          w('j8b7-20', 'treasure', '/ˈtreʒə(r)/', 'n.', '珍宝；财富', 'The book is a treasure.', '社会与环境', '这本书是珍宝。'),
          w('j8b7-21', 'story', '/ˈstɔːri/', 'n.', '故事', 'It is a moving story.', '认知与学术', '这是个感人的故事。'),
          w('j8b7-22', 'character', '/ˈkærəktə(r)/', 'n.', '人物；角色', 'The main character is brave.', '社会与环境', '主角很勇敢。'),
          w('j8b7-23', 'chapter', '/ˈtʃæptə(r)/', 'n.', '章；回', 'Read the first chapter.', '认知与学术', '读第一章。'),
          w('j8b7-24', 'borrow', '/ˈbɒrəʊ/', 'v.', '借入；借用', 'Borrow books from the library.', '行为与动作', '从图书馆借书。'),
          w('j8b7-25', 'return', '/rɪˈtɜːn/', 'v.', '归还；返回', 'Return books on time.', '行为与动作', '按时还书。'),
        ],
      },
      {
        title: 'Unit 8 · Community Service',
        words: [
          w('j8b8-1', 'visitor', '/ˈvɪzɪtə(r)/', 'n.', '参观者；来访者', 'Visitors are welcome.', '社会与环境', '欢迎参观者。'),
          w('j8b8-2', 'elderly', '/ˈeldəli/', 'adj.', '年纪较大的；上了年纪的', 'We help the elderly.', '社会与环境', '我们帮助老人。'),
          w('j8b8-3', 'organization', '/ˌɔːɡənaɪˈzeɪʃn/', 'n.', '组织；团体；机构', 'It is a charity organization.', '社会与环境', '这是个慈善组织。'),
          w('j8b8-4', 'provide', '/prəˈvaɪd/', 'v.', '提供；给予', 'They provide food for the poor.', '行为与动作', '他们为穷人提供食物。'),
          w('j8b8-5', 'donation', '/dəʊˈneɪʃn/', 'n.', '捐赠物；捐赠', 'Thank you for your donation.', '社会与环境', '感谢你的捐赠。'),
          w('j8b8-6', 'shelter', '/ˈʃeltə(r)/', 'n.', '庇护所；居所', 'The shelter helps homeless people.', '社会与环境', '庇护所帮助无家可归者。'),
          w('j8b8-7', 'youth', '/juːθ/', 'n.', '青年；青年时期', 'The club is for youth.', '社会与环境', '这个俱乐部面向青年。'),
          w('j8b8-8', 'active', '/ˈæktɪv/', 'adj.', '活跃的；积极的', 'He is active in class.', '品质与状态', '他在课堂上很积极。'),
          w('j8b8-9', 'charity', '/ˈtʃærəti/', 'n.', '慈善机构；慈善事业', 'She works for charity.', '社会与环境', '她为慈善工作。'),
          w('j8b8-10', 'gentleman', '/ˈdʒentlmən/', 'n.', '先生；君子', 'He is a true gentleman.', '社会与环境', '他是位真正的君子。'),
          w('j8b8-11', 'adult', '/ˈædʌlt/', 'n.', '成年人 adj. 成年的', 'Adults must set an example.', '社会与环境', '成年人要做榜样。'),
          w('j8b8-12', 'missing', '/ˈmɪsɪŋ/', 'adj.', '失踪的；丢失的', 'The missing child was found.', '品质与状态', '失踪的孩子找到了。'),
          w('j8b8-13', 'teamwork', '/ˈtiːmwɜːk/', 'n.', '团队合作', 'Teamwork is important.', '认知与学术', '团队合作很重要。'),
          w('j8b8-14', 'value', '/ˈvæljuː/', 'n.', '价值；重要作用', 'I value our friendship.', '认知与学术', '我珍视我们的友谊。'),
          w('j8b8-15', 'voluntary', '/ˈvɒləntri/', 'adj.', '自愿的；无偿的', 'It is voluntary work.', '品质与状态', '这是志愿工作。'),
          w('j8b8-16', 'willing', '/ˈwɪlɪŋ/', 'adj.', '乐意的；愿意的', 'She is willing to help.', '情感与性格', '她乐意帮忙。'),
          w('j8b8-17', 'donate', '/dəʊˈneɪt/', 'v.', '捐赠；赠送', 'They donated blood.', '行为与动作', '他们献了血。'),
          w('j8b8-18', 'effort', '/ˈefət/', 'n.', '努力；艰难的尝试', 'Make an effort to help.', '行为与动作', '努力去帮忙。'),
          w('j8b8-19', 'talent', '/ˈtælənt/', 'n.', '才能；天赋；天才', 'He has a talent for music.', '品质与状态', '他有音乐天赋。'),
          w('j8b8-20', 'advertisement', '/ədˈvɜːtɪsmənt/', 'n.', '广告；启事', 'I saw an advertisement online.', '社会与环境', '我在网上看到一则广告。'),
          w('j8b8-21', 'help', '/help/', 'v./n.', '帮助', 'We help clean the park.', '行为与动作', '我们帮忙打扫公园。'),
          w('j8b8-22', 'volunteer', '/ˌvɒlənˈtɪə(r)/', 'n.', '志愿者 v. 自愿做', 'She works as a volunteer.', '社会与环境', '她做志愿者。'),
          w('j8b8-23', 'community', '/kəˈmjuːnəti/', 'n.', '社区；社团', 'Our community is friendly.', '社会与环境', '我们社区很友好。'),
          w('j8b8-24', 'clean up', '/kliːn ʌp/', 'phr.', '打扫干净', 'Clean up the beach.', '行为与动作', '把海滩打扫干净。'),
          w('j8b8-25', 'meaningful', '/ˈmiːnɪŋfl/', 'adj.', '有意义的', 'It is a meaningful activity.', '品质与状态', '这是有意义的活动。'),
        ],
      },
    ],
  },
  {
    id: 'junior-9a',
    name: '人教版初中英语九年级上册（新版）',
    units: [
      {
        title: 'Unit 1 · The Changing World',
        words: [
          w('j9a1-1', 'rough', '/rʌf/', 'adj.', '崎岖的；粗糙的', 'The car bumped along the rough road.', '品质与状态', '汽车在崎岖路上颠簸。'),
          w('j9a1-2', 'sandstorm', '/ˈsændstɔːm/', 'n.', '沙尘暴', 'A sandstorm hit the north.', '社会与环境', '沙尘暴袭击了北方。'),
          w('j9a1-3', 'shortage', '/ˈʃɔːtɪdʒ/', 'n.', '短缺；不足', 'There is a food shortage.', '社会与环境', '食物短缺。'),
          w('j9a1-4', 'lack', '/læk/', 'n./v.', '缺乏；没有', 'The project lacks money.', '认知与学术', '这个项目缺钱。'),
          w('j9a1-5', 'bush', '/bʊʃ/', 'n.', '灌木', 'A bird hides in the bush.', '社会与环境', '一只鸟藏在灌木里。'),
          w('j9a1-6', 'root', '/ruːt/', 'n.', '根；根源', 'The root of the plant is long.', '社会与环境', '植物的根很长。'),
          w('j9a1-7', 'soil', '/sɔɪl/', 'n.', '土壤', 'The soil is rich.', '社会与环境', '土壤很肥沃。'),
          w('j9a1-8', 'government', '/ˈɡʌvənmənt/', 'n.', '政府', 'The government built new roads.', '社会与环境', '政府修建了新路。'),
          w('j9a1-9', 'support', '/səˈpɔːt/', 'n./v.', '支持；帮助', 'Thank you for your support.', '行为与动作', '感谢你的支持。'),
          w('j9a1-10', 'corn', '/kɔːn/', 'n.', '玉米；谷物', 'The farmers grow corn.', '社会与环境', '农民种玉米。'),
          w('j9a1-11', 'greenhouse', '/ˈɡriːnhaʊs/', 'n.', '温室', 'Vegetables grow in the greenhouse.', '社会与环境', '蔬菜在温室里生长。'),
          w('j9a1-12', 'highway', '/ˈhaɪweɪ/', 'n.', '公路；高速公路', 'The highway is wide.', '社会与环境', '这条公路很宽。'),
          w('j9a1-13', 'railway', '/ˈreɪlweɪ/', 'n.', '铁路', 'A new railway was built.', '社会与环境', '修了一条新铁路。'),
          w('j9a1-14', 'attraction', '/əˈtrækʃn/', 'n.', '向往的地方；吸引力', 'The castle is a famous attraction.', '社会与环境', '这座城堡是著名景点。'),
          w('j9a1-15', 'product', '/ˈprɒdʌkt/', 'n.', '产品', 'The product sells well.', '社会与环境', '这个产品卖得好。'),
          w('j9a1-16', 'housing', '/ˈhaʊzɪŋ/', 'n.', '住房；住宅', 'Housing prices are rising.', '社会与环境', '房价在上涨。'),
          w('j9a1-17', 'digital', '/ˈdɪdʒɪtl/', 'adj.', '数字的；数码的', 'We live in a digital age.', '品质与状态', '我们生活在数字时代。'),
          w('j9a1-18', 'tunnel', '/ˈtʌnl/', 'n.', '隧道；地下通道', 'The tunnel goes through the mountain.', '社会与环境', '隧道穿过大山。'),
          w('j9a1-19', 'link', '/lɪŋk/', 'n.', '联系 v. 连接', 'The bridge links the two cities.', '行为与动作', '桥连接两座城市。'),
          w('j9a1-20', 'convenient', '/kənˈviːniənt/', 'adj.', '方便的；便利的', 'Online shopping is convenient.', '品质与状态', '网购很方便。'),
          w('j9a1-21', 'change', '/tʃeɪndʒ/', 'v./n.', '改变；变化', 'The city has changed a lot.', '行为与动作', '这座城市变化很大。'),
          w('j9a1-22', 'develop', '/dɪˈveləp/', 'v.', '发展；开发', 'The area develops fast.', '行为与动作', '这个地区发展很快。'),
          w('j9a1-23', 'rich', '/rɪtʃ/', 'adj.', '富有的；丰富的', 'The country is rich in oil.', '品质与状态', '这个国家石油丰富。'),
          w('j9a1-24', 'poor', '/pɔː(r)/', 'adj.', '贫穷的；差的', 'The poor village got a new road.', '品质与状态', '贫穷的村庄通了新路。'),
          w('j9a1-25', 'pollution', '/pəˈluːʃn/', 'n.', '污染', 'Air pollution is a problem.', '社会与环境', '空气污染是个问题。'),
        ],
      },
      {
        title: 'Unit 2 · Inspiring People',
        words: [
          w('j9a2-1', 'inspiring', '/ɪnˈspaɪərɪŋ/', 'adj.', '鼓舞人心的；激励的', 'The speech is inspiring.', '情感与性格', '这场演讲鼓舞人心。'),
          w('j9a2-2', 'admire', '/ədˈmaɪə(r)/', 'v.', '钦佩；赞赏', 'I admire her courage.', '情感与性格', '我钦佩她的勇气。'),
          w('j9a2-3', 'historian', '/hɪˈstɔːriən/', 'n.', '历史学家', 'The historian wrote a book.', '社会与环境', '这位历史学家写了本书。'),
          w('j9a2-4', 'researcher', '/rɪˈsɜːtʃə(r)/', 'n.', '研究人员', 'The researcher studies genes.', '社会与环境', '这位研究员研究基因。'),
          w('j9a2-5', 'chemist', '/ˈkemɪst/', 'n.', '化学家', 'The chemist works in a lab.', '社会与环境', '这位化学家在实验室工作。'),
          w('j9a2-6', 'chemistry', '/ˈkemɪstri/', 'n.', '化学', 'Chemistry is my favorite subject.', '认知与学术', '化学是我最喜欢的科目。'),
          w('j9a2-7', 'physicist', '/ˈfɪzɪsɪst/', 'n.', '物理学家', 'Einstein was a great physicist.', '社会与环境', '爱因斯坦是伟大的物理学家。'),
          w('j9a2-8', 'physics', '/ˈfɪzɪks/', 'n.', '物理；物理学', 'Physics is difficult but interesting.', '认知与学术', '物理难但有趣。'),
          w('j9a2-9', 'hunger', '/ˈhʌŋɡə(r)/', 'n.', '饥饿', 'Hunger is still a problem.', '社会与环境', '饥饿仍是个问题。'),
          w('j9a2-10', 'pioneer', '/ˌpaɪəˈnɪə(r)/', 'n.', '先驱；先锋', 'He was a pioneer in medicine.', '社会与环境', '他是医学先驱。'),
          w('j9a2-11', 'inventor', '/ɪnˈventə(r)/', 'n.', '发明家', 'Edison was a great inventor.', '社会与环境', '爱迪生是伟大的发明家。'),
          w('j9a2-12', 'spirit', '/ˈspɪrɪt/', 'n.', '精神；心灵', 'They have a fighting spirit.', '情感与性格', '他们有战斗精神。'),
          w('j9a2-13', 'brave', '/breɪv/', 'adj.', '勇敢的；无畏的', 'The brave fireman saved the child.', '品质与状态', '勇敢的消防员救了孩子。'),
          w('j9a2-14', 'necessary', '/ˈnesəsəri/', 'adj.', '必要的；必需的', 'Sleep is necessary for health.', '认知与学术', '睡眠对健康是必要的。'),
          w('j9a2-15', 'western', '/ˈwestən/', 'adj.', '西方的；西部的', 'It is a western custom.', '社会与环境', '这是西方习俗。'),
          w('j9a2-16', 'childhood', '/ˈtʃaɪldhʊd/', 'n.', '童年', 'He had a happy childhood.', '社会与环境', '他有个快乐的童年。'),
          w('j9a2-17', 'dynasty', '/ˈdɪnəsti/', 'n.', '朝代；王朝', 'The Tang Dynasty was great.', '社会与环境', '唐朝很辉煌。'),
          w('j9a2-18', 'scientific', '/ˌsaɪənˈtɪfɪk/', 'adj.', '科学的', 'We need scientific evidence.', '认知与学术', '我们需要科学证据。'),
          w('j9a2-19', 'biologist', '/baɪˈɒlədʒɪst/', 'n.', '生物学家', 'The biologist studies plants.', '社会与环境', '这位生物学家研究植物。'),
          w('j9a2-20', 'forever', '/fərˈevə(r)/', 'adv.', '永远', 'I will remember you forever.', '认知与学术', '我会永远记得你。'),
          w('j9a2-21', 'hero', '/ˈhɪərəʊ/', 'n.', '英雄；男主角', 'The firefighter is a hero.', '社会与环境', '消防员是英雄。'),
          w('j9a2-22', 'achieve', '/əˈtʃiːv/', 'v.', '达到；实现', 'Achieve your dream.', '行为与动作', '实现你的梦想。'),
          w('j9a2-23', 'fame', '/feɪm/', 'n.', '名声；名望', 'He gained fame at a young age.', '社会与环境', '他年少成名。'),
          w('j9a2-24', 'prize', '/praɪz/', 'n.', '奖；奖金', 'She won the first prize.', '社会与环境', '她获一等奖。'),
          w('j9a2-25', 'devote', '/dɪˈvəʊt/', 'v.', '献身；致力于', 'He devoted his life to science.', '行为与动作', '他毕生致力于科学。'),
        ],
      },
      {
        title: 'Unit 3 · Smart Learning',
        words: [
          w('j9a3-1', 'learner', '/ˈlɜːnə(r)/', 'n.', '学习者', 'He is a fast learner.', '社会与环境', '他学东西很快。'),
          w('j9a3-2', 'flashcard', '/ˈflæʃkɑːd/', 'n.', '抽认卡；卡片', 'Use flashcards to remember words.', '认知与学术', '用抽认卡记单词。'),
          w('j9a3-3', 'project', '/ˈprɒdʒekt/', 'n.', '计划；项目', 'We are doing a science project.', '认知与学术', '我们在做科学项目。'),
          w('j9a3-4', 'website', '/ˈwebsaɪt/', 'n.', '网站', 'The website is useful.', '社会与环境', '这个网站很有用。'),
          w('j9a3-5', 'experiment', '/ɪkˈsperɪmənt/', 'n.', '实验；试验', 'We did an experiment in class.', '认知与学术', '我们在课上做了实验。'),
          w('j9a3-6', 'dictionary', '/ˈdɪkʃənri/', 'n.', '词典；字典', 'Look it up in the dictionary.', '认知与学术', '查词典。'),
          w('j9a3-7', 'aloud', '/əˈlaʊd/', 'adv.', '出声地；大声地', 'Read the text aloud.', '行为与动作', '大声读课文。'),
          w('j9a3-8', 'conversation', '/ˌkɒnvəˈseɪʃn/', 'n.', '交谈；对话', 'We had a long conversation.', '行为与动作', '我们聊了很久。'),
          w('j9a3-9', 'speed', '/spiːd/', 'n.', '速度', 'He reads at a high speed.', '认知与学术', '他阅读速度很快。'),
          w('j9a3-10', 'brain', '/breɪn/', 'n.', '大脑', 'The brain is amazing.', '社会与环境', '大脑很神奇。'),
          w('j9a3-11', 'ability', '/əˈbɪləti/', 'n.', '能力；才能', 'She has the ability to lead.', '品质与状态', '她有领导才能。'),
          w('j9a3-12', 'create', '/kriˈeɪt/', 'v.', '创造；创建', 'Create your own story.', '行为与动作', '创作你自己的故事。'),
          w('j9a3-13', 'material', '/məˈtɪəriəl/', 'n.', '材料；资料', 'Read the learning material.', '认知与学术', '阅读学习资料。'),
          w('j9a3-14', 'review', '/rɪˈvjuː/', 'v./n.', '复习；回顾', 'Review the notes after class.', '行为与动作', '课后复习笔记。'),
          w('j9a3-15', 'note', '/nəʊt/', 'n.', '笔记 v. 注意', 'Take notes in class.', '认知与学术', '课上做笔记。'),
          w('j9a3-16', 'pattern', '/ˈpætn/', 'n.', '模式；规律', 'Find the pattern.', '认知与学术', '找出规律。'),
          w('j9a3-17', 'repeat', '/rɪˈpiːt/', 'v.', '重复', 'Repeat after me.', '行为与动作', '跟我重复。'),
          w('j9a3-18', 'knowledge', '/ˈnɒlɪdʒ/', 'n.', '知识；学问', 'Knowledge is power.', '认知与学术', '知识就是力量。'),
          w('j9a3-19', 'active', '/ˈæktɪv/', 'adj.', '活跃的；积极的', 'Be active in class.', '品质与状态', '课上要积极。'),
          w('j9a3-20', 'connect', '/kəˈnekt/', 'v.', '连接；联系', 'Connect new words to a story.', '行为与动作', '把新词和故事联系起来。'),
          w('j9a3-21', 'practice', '/ˈpræktɪs/', 'v./n.', '练习', 'Practice speaking every day.', '行为与动作', '每天练习说。'),
          w('j9a3-22', 'mistake', '/mɪˈsteɪk/', 'n.', '错误', 'Learn from your mistakes.', '认知与学术', '从错误中学习。'),
          w('j9a3-23', 'note', '/nəʊt/', 'n.', '笔记；便条', 'Review your notes.', '认知与学术', '复习你的笔记。'),
          w('j9a3-24', 'focus', '/ˈfəʊkəs/', 'v./n.', '集中（注意力）', 'Focus on your study.', '行为与动作', '集中注意力学习。'),
          w('j9a3-25', 'ability', '/əˈbɪləti/', 'n.', '能力', 'Reading ability grows with practice.', '品质与状态', '阅读能力随练习增长。'),
        ],
      },
      {
        title: 'Unit 4 · Our Memory',
        words: [
          w('j9a4-1', 'position', '/pəˈzɪʃn/', 'n.', '位置；地方 v. 安置', 'The chair is in a good position.', '社会与环境', '椅子位置很好。'),
          w('j9a4-2', 'sadness', '/ˈsædnəs/', 'n.', '悲伤', 'There was sadness in her voice.', '情感与性格', '她声音里带着悲伤。'),
          w('j9a4-3', 'lecture', '/ˈlektʃə(r)/', 'n.', '讲座；讲课', 'We attended a lecture.', '社会与环境', '我们听了一场讲座。'),
          w('j9a4-4', 'react', '/riˈækt/', 'v.', '作出反应；回应', 'How did he react?', '行为与动作', '他作何反应？'),
          w('j9a4-5', 'brain', '/breɪn/', 'n.', '脑；智力', 'Use your brain.', '认知与学术', '动动脑筋。'),
          w('j9a4-6', 'chain', '/tʃeɪn/', 'n.', '链条；一连串', 'A chain of events happened.', '社会与环境', '一连串事件发生了。'),
          w('j9a4-7', 'stable', '/ˈsteɪbl/', 'adj.', '稳定的；稳固的', 'The table is stable.', '品质与状态', '桌子很稳。'),
          w('j9a4-8', 'retell', '/ˌriːˈtel/', 'v.', '复述', 'Retell the story in your own words.', '行为与动作', '用自己的话复述故事。'),
          w('j9a4-9', 'memorize', '/ˈmeməraɪz/', 'v.', '记住；记忆', 'Memorize the new words.', '行为与动作', '记住这些新词。'),
          w('j9a4-10', 'recall', '/rɪˈkɔːl/', 'v.', '回忆起；回想起', 'I can\u2019t recall his name.', '认知与学术', '我想不起他的名字。'),
          w('j9a4-11', 'tick', '/tɪk/', 'v.', '给…打钩 n. 钩号', 'Tick the correct answer.', '行为与动作', '在正确答案上打钩。'),
          w('j9a4-12', 'grandson', '/ˈɡrænsʌn/', 'n.', '孙子；外孙', 'Her grandson is five.', '社会与环境', '她的孙子五岁。'),
          w('j9a4-13', 'memory', '/ˈmeməri/', 'n.', '记忆；回忆', 'I have happy memories of school.', '认知与学术', '我对学校有快乐回忆。'),
          w('j9a4-14', 'remind', '/rɪˈmaɪnd/', 'v.', '提醒；使想起', 'Remind me to call him.', '行为与动作', '提醒我给他打电话。'),
          w('j9a4-15', 'forget', '/fəˈɡet/', 'v.', '忘记', 'Don\u2019t forget your key.', '行为与动作', '别忘了带钥匙。'),
          w('j9a4-16', 'imagine', '/ɪˈmædʒɪn/', 'v.', '想象', 'Imagine a quiet beach.', '认知与学术', '想象一片安静的海滩。'),
          w('j9a4-17', 'mind', '/maɪnd/', 'n.', '头脑；思维 v. 介意', 'Keep it in mind.', '认知与学术', '把它记在心里。'),
          w('j9a4-18', 'lose', '/luːz/', 'v.', '失去；丢失', 'Don\u2019t lose hope.', '行为与动作', '别失去希望。'),
          w('j9a4-19', 'link', '/lɪŋk/', 'n.', '联系 v. 连接', 'The link helps memory.', '认知与学术', '这种联系有助记忆。'),
          w('j9a4-20', 'childhood', '/ˈtʃaɪldhʊd/', 'n.', '童年', 'Childhood memories are sweet.', '社会与环境', '童年回忆是甜蜜的。'),
          w('j9a4-21', 'remember', '/rɪˈmembə(r)/', 'v.', '记得；记住', 'Remember the important days.', '认知与学术', '记住重要的日子。'),
          w('j9a4-22', 'forget', '/fəˈɡet/', 'v.', '忘记', 'I forgot her name.', '行为与动作', '我忘了她的名字。'),
          w('j9a4-23', 'memory', '/ˈmeməri/', 'n.', '记忆；回忆', 'She has a good memory.', '认知与学术', '她记忆力很好。'),
          w('j9a4-24', 'note', '/nəʊt/', 'n.', '笔记；便条', 'Make notes to help memory.', '认知与学术', '做笔记帮助记忆。'),
          w('j9a4-25', 'mind', '/maɪnd/', 'n.', '头脑；思维', 'An idea came to my mind.', '认知与学术', '我想到一个主意。'),
        ],
      },
      {
        title: 'Unit 5 · Power of Ideas',
        words: [
          w('j9a5-1', 'invent', '/ɪnˈvent/', 'v.', '发明；创造；编造', 'Who invented the phone?', '行为与动作', '谁发明了电话？'),
          w('j9a5-2', 'invention', '/ɪnˈvenʃn/', 'n.', '发明；创造', 'The invention changed the world.', '认知与学术', '这项发明改变了世界。'),
          w('j9a5-3', 'inventor', '/ɪnˈventə(r)/', 'n.', '发明家；发明者', 'Edison was a great inventor.', '社会与环境', '爱迪生是伟大发明家。'),
          w('j9a5-4', 'produce', '/prəˈdjuːs/', 'v.', '生产；制造', 'The factory produces cars.', '行为与动作', '这家工厂生产汽车。'),
          w('j9a5-5', 'product', '/ˈprɒdʌkt/', 'n.', '产品；制品', 'The product sells well.', '社会与环境', '这个产品卖得好。'),
          w('j9a5-6', 'suppose', '/səˈpəʊz/', 'v.', '认为；推断；假设', 'I suppose he is right.', '认知与学术', '我认为他是对的。'),
          w('j9a5-7', 'melt', '/melt/', 'v.', '（使）融化；逐渐消失', 'The ice melts in the sun.', '行为与动作', '冰在阳光下融化。'),
          w('j9a5-8', 'super', '/ˈsuːpə(r)/', 'adj.', '超级的；顶好的', 'It is a super idea.', '品质与状态', '这是个超棒的主意。'),
          w('j9a5-9', 'itself', '/ɪtˈself/', 'pron.', '它自己；它本身', 'The cat cleans itself.', '认知与学术', '猫自己清洁自己。'),
          w('j9a5-10', 'create', '/kriˈeɪt/', 'v.', '创造；创作', 'Create something new.', '行为与动作', '创造新事物。'),
          w('j9a5-11', 'creative', '/kriˈeɪtɪv/', 'adj.', '有创造力的；创造性的', 'She has a creative mind.', '品质与状态', '她有创造性头脑。'),
          w('j9a5-12', 'rapidly', '/ˈræpɪdli/', 'adv.', '迅速地；快速地', 'Technology develops rapidly.', '认知与学术', '技术发展迅速。'),
          w('j9a5-13', 'afford', '/əˈfɔːd/', 'v.', '买得起；能做', 'I can\u2019t afford a new car.', '行为与动作', '我买不起新车。'),
          w('j9a5-14', 'company', '/ˈkʌmpəni/', 'n.', '公司；剧团', 'He works in a big company.', '社会与环境', '他在大公司工作。'),
          w('j9a5-15', 'sticky', '/ˈstɪki/', 'adj.', '黏的；闷热的', 'The glue is sticky.', '品质与状态', '胶水很黏。'),
          w('j9a5-16', 'print', '/prɪnt/', 'v.', '打印；印刷', 'Print the document.', '行为与动作', '打印这份文件。'),
          w('j9a5-17', 'printer', '/ˈprɪntə(r)/', 'n.', '打印机；印刷工', 'The printer is out of paper.', '社会与环境', '打印机没纸了。'),
          w('j9a5-18', 'printing', '/ˈprɪntɪŋ/', 'n.', '印刷；印刷术', 'Printing changed the world.', '认知与学术', '印刷术改变了世界。'),
          w('j9a5-19', 'discovery', '/dɪˈskʌvəri/', 'n.', '发现；发觉', 'It was a great discovery.', '认知与学术', '那是个伟大发现。'),
          w('j9a5-20', 'thought', '/θɔːt/', 'n.', '想法；思想', 'That is a good thought.', '认知与学术', '那是个好想法。'),
          w('j9a5-21', 'idea', '/aɪˈdɪə/', 'n.', '主意；想法', 'It is a brilliant idea.', '认知与学术', '这是个绝妙的主意。'),
          w('j9a5-22', 'think', '/θɪŋk/', 'v.', '想；认为', 'Think before you act.', '认知与学术', '三思而后行。'),
          w('j9a5-23', 'brain', '/breɪn/', 'n.', '大脑；头脑', 'Use your brain.', '认知与学术', '动动脑筋。'),
          w('j9a5-24', 'change', '/tʃeɪndʒ/', 'v.', '改变', 'Ideas can change the world.', '行为与动作', '思想能改变世界。'),
          w('j9a5-25', 'future', '/ˈfjuːtʃə(r)/', 'n.', '未来', 'Ideas shape the future.', '认知与学术', '思想塑造未来。'),
        ],
      },
      {
        title: 'Unit 6 · Beyond Earth',
        words: [
          w('j9a6-1', 'earth', '/ɜːθ/', 'n.', '地球；土地', 'The earth goes around the sun.', '社会与环境', '地球绕着太阳转。'),
          w('j9a6-2', 'moon', '/muːn/', 'n.', '月球；月亮', 'The moon is bright tonight.', '社会与环境', '今晚月亮很亮。'),
          w('j9a6-3', 'planet', '/ˈplænɪt/', 'n.', '行星', 'Mars is a planet.', '社会与环境', '火星是一颗行星。'),
          w('j9a6-4', 'star', '/stɑː(r)/', 'n.', '星；恒星', 'Stars shine at night.', '社会与环境', '星星在夜晚闪耀。'),
          w('j9a6-5', 'space', '/speɪs/', 'n.', '太空；空间', 'Travel in space is amazing.', '社会与环境', '太空旅行很奇妙。'),
          w('j9a6-6', 'rocket', '/ˈrɒkɪt/', 'n.', '火箭', 'The rocket launched into space.', '社会与环境', '火箭发射升空。'),
          w('j9a6-7', 'astronaut', '/ˈæstrənɔːt/', 'n.', '宇航员', 'The astronaut walked in space.', '社会与环境', '宇航员在太空行走。'),
          w('j9a6-8', 'universe', '/ˈjuːnɪvɜːs/', 'n.', '宇宙', 'The universe is huge.', '社会与环境', '宇宙浩瀚。'),
          w('j9a6-9', 'galaxy', '/ˈɡæləksi/', 'n.', '星系；银河', 'Our galaxy is the Milky Way.', '社会与环境', '我们的星系是银河系。'),
          w('j9a6-10', 'solar', '/ˈsəʊlə(r)/', 'adj.', '太阳的；太阳系的', 'The solar system has eight planets.', '社会与环境', '太阳系有八颗行星。'),
          w('j9a6-11', 'system', '/ˈsɪstəm/', 'n.', '系统；体系', 'The solar system is our home.', '认知与学术', '太阳系是我们的家园。'),
          w('j9a6-12', 'launch', '/lɔːntʃ/', 'v.', '发射；发起', 'They launched a satellite.', '行为与动作', '他们发射了卫星。'),
          w('j9a6-13', 'orbit', '/ˈɔːbɪt/', 'n.', '轨道 v. 绕轨道运行', 'The satellite is in orbit.', '社会与环境', '卫星在轨道上。'),
          w('j9a6-14', 'surface', '/ˈsɜːfɪs/', 'n.', '表面；外表', 'The moon surface is rough.', '社会与环境', '月球表面崎岖。'),
          w('j9a6-15', 'explore', '/ɪkˈsplɔː(r)/', 'v.', '探索；探险', 'We explore the unknown.', '行为与动作', '我们探索未知。'),
          w('j9a6-16', 'research', '/rɪˈsɜːtʃ/', 'n./v.', '研究；调查', 'They do space research.', '认知与学术', '他们做太空研究。'),
          w('j9a6-17', 'discover', '/dɪˈskʌvə(r)/', 'v.', '发现；找到', 'Astronomers discovered a new star.', '行为与动作', '天文学家发现了新星。'),
          w('j9a6-18', 'light', '/laɪt/', 'n.', '光；光线', 'The sun gives us light.', '社会与环境', '太阳给我们光。'),
          w('j9a6-19', 'future', '/ˈfjuːtʃə(r)/', 'n.', '未来；将来', 'The future of space is bright.', '认知与学术', '太空的未来是光明的。'),
          w('j9a6-20', 'possible', '/ˈpɒsəbl/', 'adj.', '可能的', 'It is possible to travel to Mars.', '品质与状态', '去火星旅行是可能的。'),
          w('j9a6-21', 'scientist', '/ˈsaɪəntɪst/', 'n.', '科学家', 'Scientists study the universe.', '社会与环境', '科学家研究宇宙。'),
          w('j9a6-22', 'sky', '/skaɪ/', 'n.', '天空', 'The sky is full of stars.', '社会与环境', '天空繁星满天。'),
          w('j9a6-23', 'moon', '/muːn/', 'n.', '月亮', 'The moon goes around the earth.', '社会与环境', '月亮绕地球转。'),
          w('j9a6-24', 'star', '/stɑː(r)/', 'n.', '星星', 'We can see many stars.', '社会与环境', '我们能看到很多星星。'),
          w('j9a6-25', 'future', '/ˈfjuːtʃə(r)/', 'n.', '未来', 'Space travel is the future.', '认知与学术', '太空旅行是未来。'),
        ],
      },
      {
        title: 'Unit 7 · Feel the Rhythm',
        words: [
          w('j9a7-1', 'rhythm', '/ˈrɪðəm/', 'n.', '节奏；韵律', 'The music has a strong rhythm.', '社会与环境', '这音乐节奏很强。'),
          w('j9a7-2', 'music', '/ˈmjuːzɪk/', 'n.', '音乐', 'I love pop music.', '社会与环境', '我喜欢流行音乐。'),
          w('j9a7-3', 'song', '/sɒŋ/', 'n.', '歌曲', 'She sang a beautiful song.', '社会与环境', '她唱了首动听的歌。'),
          w('j9a7-4', 'dance', '/dɑːns/', 'v./n.', '跳舞；舞蹈', 'They danced to the music.', '行为与动作', '他们随音乐起舞。'),
          w('j9a7-5', 'band', '/bænd/', 'n.', '乐队；带子', 'The band plays well.', '社会与环境', '这个乐队演奏得好。'),
          w('j9a7-6', 'guitar', '/ɡɪˈtɑː(r)/', 'n.', '吉他', 'He plays the guitar.', '社会与环境', '他弹吉他。'),
          w('j9a7-7', 'piano', '/piˈænəʊ/', 'n.', '钢琴', 'She practices the piano.', '社会与环境', '她练钢琴。'),
          w('j9a7-8', 'drum', '/drʌm/', 'n.', '鼓', 'He plays the drums.', '社会与环境', '他打鼓。'),
          w('j9a7-9', 'concert', '/ˈkɒnsət/', 'n.', '音乐会；演奏会', 'We went to a concert.', '社会与环境', '我们去听了音乐会。'),
          w('j9a7-10', 'instrument', '/ˈɪnstrəmənt/', 'n.', '乐器；仪器', 'A guitar is a musical instrument.', '社会与环境', '吉他是乐器。'),
          w('j9a7-11', 'melody', '/ˈmelədi/', 'n.', '旋律；曲调', 'The melody is lovely.', '社会与环境', '旋律很动听。'),
          w('j9a7-12', 'beat', '/biːt/', 'n.', '节拍；跳动', 'Tap your foot to the beat.', '认知与学术', '跟着节拍踮脚。'),
          w('j9a7-13', 'pop', '/pɒp/', 'adj.', '流行的 n. 流行音乐', 'Pop music is popular.', '社会与环境', '流行音乐很受欢迎。'),
          w('j9a7-14', 'folk', '/fəʊk/', 'adj.', '民间的；民俗的', 'Folk music tells old stories.', '社会与环境', '民间音乐讲述古老故事。'),
          w('j9a7-15', 'classic', '/ˈklæsɪk/', 'adj.', '经典的 n. 名著', 'Classic music lasts forever.', '社会与环境', '经典音乐永恒。'),
          w('j9a7-16', 'perform', '/pəˈfɔːm/', 'v.', '表演；演出；执行', 'They perform on stage.', '行为与动作', '他们在舞台上表演。'),
          w('j9a7-17', 'stage', '/steɪdʒ/', 'n.', '舞台；阶段', 'She walked onto the stage.', '社会与环境', '她走上舞台。'),
          w('j9a7-18', 'audience', '/ˈɔːdiəns/', 'n.', '观众；听众', 'The audience clapped loudly.', '社会与环境', '观众热烈鼓掌。'),
          w('j9a7-19', 'clap', '/klæp/', 'v.', '鼓掌；拍手', 'The crowd clapped for the song.', '行为与动作', '观众为歌曲鼓掌。'),
          w('j9a7-20', 'joy', '/dʒɔɪ/', 'n.', '欢乐；喜悦', 'Music brings joy to people.', '情感与性格', '音乐给人带来欢乐。'),
          w('j9a7-21', 'song', '/sɒŋ/', 'n.', '歌曲', 'I love this song.', '社会与环境', '我喜欢这首歌。'),
          w('j9a7-22', 'sing', '/sɪŋ/', 'v.', '唱歌', 'She sings beautifully.', '行为与动作', '她唱歌很好听。'),
          w('j9a7-23', 'listen', '/ˈlɪsn/', 'v.', '听', 'Listen to the music.', '行为与动作', '听音乐。'),
          w('j9a7-24', 'feel', '/fiːl/', 'v.', '感觉；觉得', 'I feel happy when I hear music.', '情感与性格', '听到音乐我感到快乐。'),
          w('j9a7-25', 'talent', '/ˈtælənt/', 'n.', '天赋；才能', 'He has a talent for music.', '品质与状态', '他有音乐天赋。'),
        ],
      },
      {
        title: 'Unit 8 · More than a Game',
        words: [
          w('j9a8-1', 'game', '/ɡeɪm/', 'n.', '游戏；比赛', 'We won the game.', '社会与环境', '我们赢了比赛。'),
          w('j9a8-2', 'team', '/tiːm/', 'n.', '队；团队', 'Our team played well.', '社会与环境', '我们队打得好。'),
          w('j9a8-3', 'player', '/ˈpleɪə(r)/', 'n.', '运动员；选手', 'He is a good player.', '社会与环境', '他是个好选手。'),
          w('j9a8-4', 'score', '/skɔː(r)/', 'n.', '得分；分数 v. 得分', 'The score is 2 to 1.', '认知与学术', '比分是2比1。'),
          w('j9a8-5', 'win', '/wɪn/', 'v.', '赢；获胜', 'We won the match.', '行为与动作', '我们赢了比赛。'),
          w('j9a8-6', 'lose', '/luːz/', 'v.', '输；失去', 'They lost the game.', '行为与动作', '他们输了比赛。'),
          w('j9a8-7', 'coach', '/kəʊtʃ/', 'n.', '教练；长途汽车', 'The coach trains the team.', '社会与环境', '教练训练队伍。'),
          w('j9a8-8', 'match', '/mætʃ/', 'n.', '比赛；火柴', 'The match was exciting.', '社会与环境', '比赛很精彩。'),
          w('j9a8-9', 'sport', '/spɔːt/', 'n.', '运动；体育', 'Sport keeps us healthy.', '社会与环境', '运动让我们健康。'),
          w('j9a8-10', 'race', '/reɪs/', 'n.', '赛跑；种族 v. 参赛', 'He won the race.', '社会与环境', '他赢了赛跑。'),
          w('j9a8-11', 'run', '/rʌn/', 'v.', '跑；奔跑', 'She runs every morning.', '行为与动作', '她每天早上跑步。'),
          w('j9a8-12', 'jump', '/dʒʌmp/', 'v.', '跳；跳跃', 'He jumped high.', '行为与动作', '他跳得很高。'),
          w('j9a8-13', 'train', '/treɪn/', 'v.', '训练；培训 n. 火车', 'They train hard every day.', '行为与动作', '他们每天刻苦训练。'),
          w('j9a8-14', 'practice', '/ˈpræktɪs/', 'n.', '练习；实践', 'Practice makes perfect.', '认知与学术', '熟能生巧。'),
          w('j9a8-15', 'fair', '/feə(r)/', 'adj.', '公平的；合理的', 'It was a fair game.', '品质与状态', '比赛很公平。'),
          w('j9a8-16', 'win-win', '/ˌwɪnˈwɪn/', 'adj.', '双赢的', 'It is a win-win result.', '品质与状态', '这是个双赢结果。'),
          w('j9a8-17', 'spirit', '/ˈspɪrɪt/', 'n.', '精神；意志', 'Sport teaches team spirit.', '情感与性格', '运动培养团队精神。'),
          w('j9a8-18', 'goal', '/ɡəʊl/', 'n.', '目标；进球', 'He scored a goal.', '认知与学术', '他进了一球。'),
          w('j9a8-19', 'medal', '/ˈmedl/', 'n.', '奖章；奖牌', 'She won a gold medal.', '社会与环境', '她赢得了金牌。'),
          w('j9a8-20', 'cheer', '/tʃɪə(r)/', 'v./n.', '欢呼；喝彩', 'The fans cheered loudly.', '行为与动作', '球迷们大声欢呼。'),
          w('j9a8-21', 'teamwork', '/ˈtiːmwɜːk/', 'n.', '团队合作', 'Teamwork wins games.', '社会与环境', '团队合作赢得比赛。'),
          w('j9a8-22', 'fair', '/feə(r)/', 'adj.', '公平的', 'We want a fair game.', '品质与状态', '我们要公平的比赛。'),
          w('j9a8-23', 'coach', '/kəʊtʃ/', 'n.', '教练', 'The coach encourages us.', '社会与环境', '教练鼓励我们。'),
          w('j9a8-24', 'winner', '/ˈwɪnə(r)/', 'n.', '获胜者', 'The winner got a medal.', '社会与环境', '获胜者获得奖牌。'),
          w('j9a8-25', 'practice', '/ˈpræktɪs/', 'n.', '练习', 'Practice makes perfect.', '认知与学术', '熟能生巧。'),
        ],
      },
    ],
  },
  {
    id: 'junior-9b',
    name: '人教版初中英语九年级下册（新版）',
    units: [
      {
        title: 'Unit 1 · Let\u2019s Celebrate!',
        words: [
          w('j9b1-1', 'lantern', '/ˈlæntən/', 'n.', '灯笼；提灯', 'Red lanterns hang in the street.', '社会与环境', '街上挂着红灯笼。'),
          w('j9b1-2', 'eve', '/iːv/', 'n.', '前夜；前夕', 'We stay up on New Year\u2019s Eve.', '社会与环境', '除夕夜我们守岁。'),
          w('j9b1-3', 'tomb', '/tuːm/', 'n.', '坟墓；冢', 'People visit tombs in spring.', '社会与环境', '人们在春天扫墓。'),
          w('j9b1-4', 'parade', '/pəˈreɪd/', 'n.', '游行；阅兵', 'The parade was colourful.', '社会与环境', '游行五彩缤纷。'),
          w('j9b1-5', 'ancestor', '/ˈænsestə(r)/', 'n.', '祖宗；祖先', 'We honour our ancestors.', '社会与环境', '我们纪念祖先。'),
          w('j9b1-6', 'costume', '/ˈkɒstjuːm/', 'n.', '戏装；服装', 'She wore a colourful costume.', '社会与环境', '她穿着彩色戏装。'),
          w('j9b1-7', 'row', '/rəʊ/', 'v.', '划（船）n. 一排', 'They rowed the boat.', '行为与动作', '他们划了船。'),
          w('j9b1-8', 'princess', '/ˌprɪnˈses/', 'n.', '公主', 'The princess was kind.', '社会与环境', '公主很善良。'),
          w('j9b1-9', 'pale', '/peɪl/', 'adj.', '苍白的；白皙的', 'She looked pale.', '品质与状态', '她脸色苍白。'),
          w('j9b1-10', 'policeman', '/pəˈliːsmən/', 'n.', '（男）警察', 'The policeman helped us.', '社会与环境', '警察帮助了我们。'),
          w('j9b1-11', 'shame', '/ʃeɪm/', 'n.', '让人遗憾的事；羞愧', 'What a shame!', '情感与性格', '真遗憾！'),
          w('j9b1-12', 'president', '/ˈprezɪdənt/', 'n.', '总统；主席；董事长', 'The president gave a speech.', '社会与环境', '总统发表了演讲。'),
          w('j9b1-13', 'regret', '/rɪˈɡret/', 'v./n.', '遗憾；懊悔', 'I regret my mistake.', '情感与性格', '我后悔犯了错。'),
          w('j9b1-14', 'sofa', '/ˈsəʊfə/', 'n.', '长沙发', 'The cat is on the sofa.', '社会与环境', '猫在沙发上。'),
          w('j9b1-15', 'complex', '/ˈkɒmpleks/', 'adj.', '复杂的', 'The rules are complex.', '品质与状态', '规则很复杂。'),
          w('j9b1-16', 'lunar', '/ˈluːnə(r)/', 'adj.', '月亮的；农历的', 'The lunar calendar has festivals.', '社会与环境', '农历有节日。'),
          w('j9b1-17', 'mooncake', '/ˈmuːnkeɪk/', 'n.', '月饼', 'We eat mooncakes.', '社会与环境', '我们吃月饼。'),
          w('j9b1-18', 'steal', '/stiːl/', 'v.', '偷；窃取', 'Someone stole my bike.', '行为与动作', '有人偷了我的自行车。'),
          w('j9b1-19', 'gather', '/ˈɡæðə(r)/', 'v.', '聚集；集合', 'Family gather at dinner.', '行为与动作', '家人聚在一起吃饭。'),
          w('j9b1-20', 'midnight', '/ˈmɪdnaɪt/', 'n.', '午夜；子夜', 'The clock struck midnight.', '社会与环境', '钟敲响了午夜十二点。'),
          w('j9b1-21', 'festival', '/ˈfestɪvl/', 'n.', '节日', 'The Spring Festival is coming.', '社会与环境', '春节快到了。'),
          w('j9b1-22', 'celebrate', '/ˈselɪbreɪt/', 'v.', '庆祝', 'We celebrate the New Year.', '行为与动作', '我们庆祝新年。'),
          w('j9b1-23', 'dumpling', '/ˈdʌmplɪŋ/', 'n.', '饺子', 'We eat dumplings.', '社会与环境', '我们吃饺子。'),
          w('j9b1-24', 'firework', '/ˈfaɪəwɜːk/', 'n.', '烟花；烟火', 'Fireworks lit the sky.', '社会与环境', '烟花点亮天空。'),
          w('j9b1-25', 'traditional', '/trəˈdɪʃənl/', 'adj.', '传统的', 'It is a traditional custom.', '社会与环境', '这是传统习俗。'),
        ],
      },
      {
        title: 'Unit 2 · A Look into the Past',
        words: [
          w('j9b2-1', 'site', '/saɪt/', 'n.', '场所；地方', 'It is an old historical site.', '社会与环境', '这是一处古迹。'),
          w('j9b2-2', 'artefact', '/ˈɑːtɪfækt/', 'n.', '人工制品；文物', 'The museum has many artefacts.', '社会与环境', '博物馆有很多文物。'),
          w('j9b2-3', 'horn', '/hɔːn/', 'n.', '（动物的）角；号角', 'The bull has big horns.', '社会与环境', '公牛有大角。'),
          w('j9b2-4', 'Egyptian', '/ɪˈdʒɪpʃn/', 'adj.', '埃及的 n. 埃及人', 'Egyptian pyramids are famous.', '社会与环境', '埃及金字塔很有名。'),
          w('j9b2-5', 'empress', '/ˈemprəs/', 'n.', '女皇；皇后', 'The empress ruled wisely.', '社会与环境', '女皇英明治国。'),
          w('j9b2-6', 'queen', '/kwiːn/', 'n.', '女王；王后', 'The queen lived in a palace.', '社会与环境', '女王住在宫殿里。'),
          w('j9b2-7', 'mummy', '/ˈmʌmi/', 'n.', '木乃伊；妈妈', 'The mummy is in the museum.', '社会与环境', '木乃伊在博物馆里。'),
          w('j9b2-8', 'archaeologist', '/ˌɑːkiˈɒlədʒɪst/', 'n.', '考古学家', 'The archaeologist dug carefully.', '社会与环境', '考古学家小心挖掘。'),
          w('j9b2-9', 'wealthy', '/ˈwelθi/', 'adj.', '富有的；富裕的', 'He was a wealthy man.', '品质与状态', '他是个富人。'),
          w('j9b2-10', 'clothing', '/ˈkləʊðɪŋ/', 'n.', '衣物；服装', 'Warm clothing is needed.', '社会与环境', '需要保暖衣物。'),
          w('j9b2-11', 'cotton', '/ˈkɒtn/', 'n.', '棉；棉花', 'The shirt is made of cotton.', '社会与环境', '这件衬衫是棉的。'),
          w('j9b2-12', 'pound', '/paʊnd/', 'n.', '磅；镑', 'It weighs one pound.', '社会与环境', '它重一磅。'),
          w('j9b2-13', 'ash', '/æʃ/', 'n.', '灰烬；废墟', 'The fire left ash.', '社会与环境', '大火留下灰烬。'),
          w('j9b2-14', 'unlikely', '/ʌnˈlaɪkli/', 'adj.', '不大可能的', 'It is unlikely to rain.', '品质与状态', '不太可能下雨。'),
          w('j9b2-15', 'jade', '/dʒeɪd/', 'n.', '玉；翡翠', 'She wore a jade ring.', '社会与环境', '她戴着玉戒指。'),
          w('j9b2-16', 'wealth', '/welθ/', 'n.', '财产；财富', 'Health is better than wealth.', '社会与环境', '健康胜过财富。'),
          w('j9b2-17', 'trade', '/treɪd/', 'n.', '贸易；买卖', 'Trade brings countries together.', '社会与环境', '贸易让各国相连。'),
          w('j9b2-18', 'repair', '/rɪˈpeə(r)/', 'v./n.', '修理；修补', 'He repaired the old clock.', '行为与动作', '他修了旧钟。'),
          w('j9b2-19', 'gate', '/ɡeɪt/', 'n.', '门；大门', 'The gate is closed.', '社会与环境', '大门关着。'),
          w('j9b2-20', 'aware', '/əˈweə(r)/', 'adj.', '知道的；意识到的', 'Be aware of the danger.', '认知与学术', '要意识到危险。'),
          w('j9b2-21', 'ancient', '/ˈeɪnʃənt/', 'adj.', '古代的；古老的', 'It is an ancient city.', '社会与环境', '这是座古城。'),
          w('j9b2-22', 'history', '/ˈhɪstri/', 'n.', '历史', 'We study Chinese history.', '认知与学术', '我们学中国历史。'),
          w('j9b2-23', 'king', '/kɪŋ/', 'n.', '国王', 'The king lived in the palace.', '社会与环境', '国王住在宫殿里。'),
          w('j9b2-24', 'dynasty', '/ˈdɪnəsti/', 'n.', '朝代；王朝', 'The Ming Dynasty lasted long.', '社会与环境', '明朝延续很久。'),
          w('j9b2-25', 'discover', '/dɪˈskʌvə(r)/', 'v.', '发现', 'They discovered an old tomb.', '行为与动作', '他们发现了一座古墓。'),
        ],
      },
      {
        title: 'Unit 3 · A Taste of Art',
        words: [
          w('j9b3-1', 'shrimp', '/ʃrɪmp/', 'n.', '虾', 'We had shrimp for dinner.', '社会与环境', '我们晚饭吃了虾。'),
          w('j9b3-2', 'burst', '/bɜːst/', 'v.', '冲；（使）破裂', 'The balloon burst.', '行为与动作', '气球爆了。'),
          w('j9b3-3', 'brushstroke', '/ˈbrʌʃstrəʊk/', 'n.', '一笔；一画', 'Each brushstroke is careful.', '社会与环境', '每一笔都很用心。'),
          w('j9b3-4', 'lifelike', '/ˈlaɪflaɪk/', 'adj.', '生动的；逼真的', 'The painting is lifelike.', '品质与状态', '这幅画很逼真。'),
          w('j9b3-5', 'combine', '/kəmˈbaɪn/', 'v.', '（使）结合；组合', 'Combine work and rest.', '行为与动作', '劳逸结合。'),
          w('j9b3-6', 'opposite', '/ˈɒpəzɪt/', 'adj.', '相反的 n. 反面', 'They walked in opposite ways.', '品质与状态','他们朝相反方向走。'),
          w('j9b3-7', 'scene', '/siːn/', 'n.', '景色；情景', 'The scene is beautiful.', '社会与环境','景色很美。'),
          w('j9b3-8', 'empty', '/ˈempti/', 'adj.', '空的 v. 倒空', 'The room is empty.', '品质与状态','房间是空的。'),
          w('j9b3-9', 'beauty', '/ˈbjuːti/', 'n.', '美人；美丽', 'Nature has great beauty.', '社会与环境','大自然有大美。'),
          w('j9b3-10', 'sculptor', '/ˈskʌlptə(r)/', 'n.', '雕塑家', 'The sculptor made a statue.', '社会与环境','雕塑家做了雕像。'),
          w('j9b3-11', 'skin', '/skɪn/', 'n.', '皮肤；皮', 'Babies have soft skin.', '社会与环境','婴儿皮肤柔软。'),
          w('j9b3-12', 'lab', '/læb/', 'n.', '实验室', 'We work in the lab.', '社会与环境','我们在实验室工作。'),
          w('j9b3-13', 'diet', '/ˈdaɪət/', 'n.', '节食；规定饮食', 'A balanced diet is important.', '行为与动作','均衡饮食很重要。'),
          w('j9b3-14', 'knock', '/nɒk/', 'v.', '敲门；敲击', 'Someone knocked at the door.', '行为与动作','有人敲门。'),
          w('j9b3-15', 'model', '/ˈmɒdl/', 'n.', '模特；模型 v. 模拟', 'The model looks real.', '社会与环境','模型看起来很真。'),
          w('j9b3-16', 'porcelain', '/ˈpɔːsəlɪn/', 'n.', '瓷器', 'Chinese porcelain is famous.', '社会与环境','中国瓷器很有名。'),
          w('j9b3-17', 'rare', '/reə(r)/', 'adj.', '稀有的；罕见的', 'It is a rare bird.', '品质与状态','这是一种稀有鸟。'),
          w('j9b3-18', 'artistic', '/ɑːˈtɪstɪk/', 'adj.', '美术的；艺术的', 'She has artistic talent.', '品质与状态','她有艺术天赋。'),
          w('j9b3-19', 'recreate', '/ˌriːkriˈeɪt/', 'v.', '使再现；重现', 'The movie recreates history.', '行为与动作','电影重现了历史。'),
          w('j9b3-20', 'pity', '/ˈpɪti/', 'n.', '遗憾；同情', 'What a pity!', '情感与性格','真遗憾！'),
          w('j9b3-21', 'painting', '/ˈpeɪntɪŋ/', 'n.', '绘画；油画', 'The painting is on show.', '社会与环境', '这幅画在展出。'),
          w('j9b3-22', 'artist', '/ˈɑːtɪst/', 'n.', '艺术家；画家', 'The artist drew a picture.', '社会与环境', '画家画了幅画。'),
          w('j9b3-23', 'draw', '/drɔː/', 'v.', '画；绘制', 'She draws well.', '行为与动作', '她画得好。'),
          w('j9b3-24', 'paint', '/peɪnt/', 'v.', '绘画；涂色', 'He paints the wall blue.', '行为与动作', '他把墙涂成蓝色。'),
          w('j9b3-25', 'beautiful', '/ˈbjuːtɪfl/', 'adj.', '美丽的', 'The picture is beautiful.', '品质与状态', '这幅画很美。'),
        ],
      },
      {
        title: 'Unit 4 · Reduce, Reuse, Recycle',
        words: [
          w('j9b4-1', 'reuse', '/ˌriːˈjuːz/', 'v.', '再次使用；重复使用', 'Reuse the bottle.', '行为与动作', '重复使用这个瓶子。'),
          w('j9b4-2', 'recycle', '/ˌriːˈsaɪkl/', 'v.', '回收利用', 'We recycle paper.', '行为与动作', '我们回收纸张。'),
          w('j9b4-3', 'pollution', '/pəˈluːʃn/', 'n.', '污染；污染物', 'Air pollution is bad.', '社会与环境', '空气污染很糟。'),
          w('j9b4-4', 'chemical', '/ˈkemɪkl/', 'n.', '化学品 adj. 化学的', 'Keep chemicals away.', '社会与环境', '把化学品放远。'),
          w('j9b4-5', 'smog', '/smɒɡ/', 'n.', '烟雾', 'Smog covers the city.', '社会与环境', '烟雾笼罩城市。'),
          w('j9b4-6', 'global', '/ˈɡləʊbl/', 'adj.', '全球的；全世界的', 'Global warming is a problem.', '社会与环境', '全球变暖是个问题。'),
          w('j9b4-7', 'pollute', '/pəˈluːt/', 'v.', '污染；弄脏', 'Don\u2019t pollute the river.', '行为与动作', '别污染河流。'),
          w('j9b4-8', 'disposal', '/dɪˈspəʊzl/', 'n.', '处理；清理', 'Waste disposal is important.', '社会与环境', '废物处理很重要。'),
          w('j9b4-9', 'package', '/ˈpækɪdʒ/', 'n.', '包裹 v. 包装', 'The package is heavy.', '社会与环境', '包裹很重。'),
          w('j9b4-10', 'environmental', '/ɪnˌvaɪrənˈmentl/', 'adj.', '自然环境的；生态环境的', 'We need environmental protection.', '社会与环境', '我们需要环保。'),
          w('j9b4-11', 'disturb', '/dɪˈstɜːb/', 'v.', '打扰；使焦虑', 'Don\u2019t disturb me.', '行为与动作', '别打扰我。'),
          w('j9b4-12', 'trap', '/træp/', 'v.', '设陷阱 n. 陷阱', 'The fox was trapped.', '行为与动作', '狐狸中了陷阱。'),
          w('j9b4-13', 'lamp', '/læmp/', 'n.', '台灯；灯', 'The lamp is on.', '社会与环境', '灯开着。'),
          w('j9b4-14', 'bother', '/ˈbɒðə(r)/', 'v.', '使烦恼；费心', 'Sorry to bother you.', '行为与动作', '抱歉打扰你。'),
          w('j9b4-15', 'loss', '/lɒs/', 'n.', '丧失；丢失；亏损', 'The loss is great.', '社会与环境', '损失很大。'),
          w('j9b4-16', 'guardian', '/ˈɡɑːdiən/', 'n.', '保护者；守卫者', 'He is the guardian of nature.', '社会与环境', '他是自然守护者。'),
          w('j9b4-17', 'ban', '/bæn/', 'n.', '禁令 v. 禁止', 'There is a ban on plastic.', '社会与环境', '塑料被禁了。'),
          w('j9b4-18', 'riverbank', '/ˈrɪvəbæŋk/', 'n.', '河岸；河堤', 'We walked along the riverbank.', '社会与环境', '我们沿河岸走。'),
          w('j9b4-19', 'steady', '/ˈstedi/', 'adj.', '稳定的；持续的', 'The economy is steady.', '品质与状态', '经济稳定。'),
          w('j9b4-20', 'generation', '/ˌdʒenəˈreɪʃn/', 'n.', '一代人；同代人', 'The next generation will care.', '社会与环境', '下一代会关心。'),
          w('j9b4-21', 'protect', '/prəˈtekt/', 'v.', '保护', 'Protect the environment.', '行为与动作', '保护环境。'),
          w('j9b4-22', 'save', '/seɪv/', 'v.', '拯救；节约；储蓄', 'Save water and energy.', '行为与动作', '节约用水用电。'),
          w('j9b4-23', 'waste', '/weɪst/', 'n.', '浪费；废物 v. 浪费', 'Don\u2019t waste food.', '行为与动作', '别浪费食物。'),
          w('j9b4-24', 'earth', '/ɜːθ/', 'n.', '地球；土地', 'We live on the earth.', '社会与环境', '我们生活在地球上。'),
          w('j9b4-25', 'nature', '/ˈneɪtʃə(r)/', 'n.', '自然；大自然', 'Love nature.', '社会与环境', '热爱大自然。'),
        ],
      },
      {
        title: 'Unit 5 · Open to New Beginnings',
        words: [
          w('j9b5-1', 'graduation', '/ˌɡrædʒuˈeɪʃn/', 'n.', '毕业', 'Graduation is coming.', '社会与环境', '毕业临近了。'),
          w('j9b5-2', 'vote', '/vəʊt/', 'v./n.', '投票；选举', 'We voted for the plan.', '行为与动作', '我们投票支持计划。'),
          w('j9b5-3', 'leader', '/ˈliːdə(r)/', 'n.', '领导者；领袖', 'She is a great leader.', '社会与环境', '她是位好领导。'),
          w('j9b5-4', 'presentation', '/ˌpreznˈteɪʃn/', 'n.', '演出；介绍；展示', 'His presentation was good.', '认知与学术', '他的展示很好。'),
          w('j9b5-5', 'lifelong', '/ˈlaɪflɒŋ/', 'adj.', '终身的；毕生的', 'Learning is lifelong.', '品质与状态', '学习是终身的。'),
          w('j9b5-6', 'projector', '/prəˈdʒektə(r)/', 'n.', '放映机；投影仪', 'The projector shows slides.', '社会与环境', '投影仪放幻灯片。'),
          w('j9b5-7', 'vocational', '/vəʊˈkeɪʃənl/', 'adj.', '职业的；职业技术的', 'He took a vocational course.', '社会与环境', '他上了职业课程。'),
          w('j9b5-8', 'whatever', '/wɒtˈevə(r)/', 'pron.', '任何；无论什么', 'Do whatever you like.', '认知与学术', '做你喜欢的事。'),
          w('j9b5-9', 'path', '/pɑːθ/', 'n.', '路线；道路；小路', 'Choose your own path.', '社会与环境', '选你自己的路。'),
          w('j9b5-10', 'mainly', '/ˈmeɪnli/', 'adv.', '主要地；首要地', 'It is mainly about hope.', '认知与学术', '它主要讲希望。'),
          w('j9b5-11', 'silent', '/ˈsaɪlənt/', 'adj.', '不说话的；沉默的', 'He kept silent.', '品质与状态', '他保持沉默。'),
          w('j9b5-12', 'pronounce', '/prəˈnaʊns/', 'v.', '发（音）；读（音）', 'How do you pronounce it?', '行为与动作', '这个怎么发音？'),
          w('j9b5-13', 'abroad', '/əˈbrɔːd/', 'adv.', '在国外；到国外', 'He plans to study abroad.', '社会与环境', '他计划出国留学。'),
          w('j9b5-14', 'graduate', '/ˈɡrædʒueɪt/', 'v.', '毕业 n. 毕业生', 'She graduated last year.', '行为与动作', '她去年毕业了。'),
          w('j9b5-15', 'continuous', '/kənˈtɪnjuəs/', 'adj.', '持续的；连续的', 'Continuous practice helps.', '品质与状态', '持续练习有帮助。'),
          w('j9b5-16', 'madam', '/ˈmædəm/', 'n.', '女士；夫人', 'Can I help you, madam?', '社会与环境', '女士，需要帮忙吗？'),
          w('j9b5-17', 'translate', '/trænzˈleɪt/', 'v.', '翻译', 'Translate the sentence.', '行为与动作', '翻译这个句子。'),
          w('j9b5-18', 'part-time', '/ˌpɑːt ˈtaɪm/', 'adj.', '兼职的', 'She has a part-time job.', '社会与环境', '她有份兼职。'),
          w('j9b5-19', 'senior', '/ˈsiːniə(r)/', 'adj.', '高级别的；年长的', 'He is a senior student.', '社会与环境', '他是高年级学生。'),
          w('j9b5-20', 'grateful', '/ˈɡreɪtfl/', 'adj.', '感激的；感谢的', 'I am grateful for your help.', '情感与性格', '我感激你的帮助。'),
          w('j9b5-21', 'future', '/ˈfjuːtʃə(r)/', 'n.', '未来；将来', 'The future is in your hands.', '认知与学术', '未来掌握在你手中。'),
          w('j9b5-22', 'dream', '/driːm/', 'n.', '梦想；梦', 'Follow your dream.', '认知与学术', '追随你的梦想。'),
          w('j9b5-23', 'hope', '/həʊp/', 'v./n.', '希望', 'Hope for the best.', '情感与性格', '抱最大希望。'),
          w('j9b5-24', 'success', '/səkˈses/', 'n.', '成功', 'Hard work leads to success.', '品质与状态', '努力带来成功。'),
          w('j9b5-25', 'confident', '/ˈkɒnfɪdənt/', 'adj.', '自信的', 'Be confident about the future.', '情感与性格', '对未来充满信心。'),
        ],
      },
    ],
  },
];

function buildJuniorBooks(): VocabBook[] {
  return JUNIOR_BOOKS.map((b) => ({
    id: b.id,
    name: b.name,
    stage: '初中英语',
    builtin: true,
    desc: '人教版（新版）同步教材',
    units: b.units.map((u, ui) => ({
      id: `${b.id}-u${ui + 1}`,
      title: u.title,
      words: u.words,
    })),
    wordCount: b.units.reduce((s, u) => s + u.words.length, 0),
  }));
}

// ===== 组装全部词书 =====
const CET6_UNITS = buildCet6Units();
const JUNIOR_LIST = buildJuniorBooks();

const PRIMARY_BOOK: VocabBook = {
  id: 'primary',
  name: '人教版小学英语·三年级上册',
  stage: '小学英语',
  builtin: true,
  desc: '人教版PEP（2024新版）三年级上册真实教材词表',
  wordCount: PRIMARY_WORDS.length,
  units: [
    { id: 'primary-u1', title: 'Unit 1 Making friends 交朋友', words: PRIMARY_WORDS.slice(0, 20) },
    { id: 'primary-u2', title: 'Unit 2 Different families 家庭', words: PRIMARY_WORDS.slice(20, 28) },
    { id: 'primary-u3', title: 'Unit 3 Amazing animals 动物', words: PRIMARY_WORDS.slice(28, 42) },
    { id: 'primary-u4', title: 'Unit 4 Plants around us 植物', words: PRIMARY_WORDS.slice(42, 58) },
    { id: 'primary-u5', title: 'Unit 5 The colourful world 颜色', words: PRIMARY_WORDS.slice(58, 67) },
    { id: 'primary-u6', title: 'Unit 6 Useful numbers 数字', words: PRIMARY_WORDS.slice(67) },
  ],
};

const PRIMARYB_BOOK: VocabBook = {
  id: 'primary-g3b', name: '人教PEP小学英语·三年级下册（2025新版）', stage: '小学英语', builtin: true,
  desc: '人教PEP 2025新版三年级下册，按 6 个真实单元导入（114 词）', wordCount: 114,
  units: [
    { id: 'g3b-u1', title: 'Unit 1 Meeting new people 认识新朋友', words: [
      w('g3b-1', 'where', '/weə(r)/', 'adv.', '哪里；到哪里', 'Where are you from?', '认知与学术', '你来自哪里？'),
      w('g3b-2', 'from', '/frɒm/', 'prep.', '（表示来源）来自', 'I\u2019m from the UK.', '行为与动作', '我来自英国。'),
      w('g3b-3', 'about', '/əˈbaʊt/', 'prep.', '关于；大约', 'What about you?', '认知与学术', '你呢？'),
      w('g3b-4', 'today', '/təˈdeɪ/', 'n./adv.', '今天', 'We have two new friends today.', '认知与学术', '我们今天有两位新朋友。'),
      w('g3b-5', 'teacher', '/ˈtiːtʃə(r)/', 'n.', '教师', 'Miss White is my English teacher.', '社会与环境', '怀特老师是我的英语老师。'),
      w('g3b-6', 'student', '/ˈstjuːdnt/', 'n.', '学生', 'Students from Canada and the USA.', '社会与环境', '来自加拿大和美国的学生们。'),
      w('g3b-7', 'after', '/ˈɑːftə(r)/', 'prep.', '在……后面', 'After you!', '行为与动作', '您先请！'),
      w('g3b-8', 'who', '/huː/', 'pron.', '谁；什么人', 'Who\u2019s that girl?', '认知与学术', '那个女孩是谁？'),
      w('g3b-9', 'girl', '/ɡɜːl/', 'n.', '女孩', 'The girl is my neighbour.', '社会与环境', '那个女孩是我的邻居。'),
      w('g3b-10', 'neighbour', '/ˈneɪbə(r)/', 'n.', '邻居', 'That\u2019s our new neighbour, Amy.', '社会与环境', '那是我们的新邻居，埃米。'),
      w('g3b-11', 'boy', '/bɔɪ/', 'n.', '男孩', 'Who\u2019s that boy? That\u2019s Mike.', '社会与环境', '那个男孩是谁？那是迈克。'),
      w('g3b-12', 'woman', '/ˈwʊmən/', 'n.', '成年女子；妇女', 'The woman is my neighbour.', '社会与环境', '那位女士是我的邻居。'),
      w('g3b-13', 'man', '/mæn/', 'n.', '成年男子；男人', 'Who\u2019s that man? That\u2019s my father.', '社会与环境', '那个男人是谁？那是我爸爸。'),
      w('g3b-14', 'Mr', '/ˈmɪstə(r)/', 'n.', '先生', 'That\u2019s my new neighbour, Mr Lin.', '社会与环境', '那是我的新邻居，林先生。'),
      w('g3b-15', 'classmate', '/ˈklɑːsmeɪt/', 'n.', '同班同学', 'Mike is my classmate.', '社会与环境', '迈克是我的同班同学。'),
      w('g3b-16', 'he', '/hiː/', 'pron.', '他', 'He is from Canada.', '认知与学术', '他来自加拿大。'),
      w('g3b-17', 'also', '/ˈɔːlsəʊ/', 'adv.', '也', 'He is also my neighbour.', '认知与学术', '他也是我的邻居。'),
      w('g3b-18', 'English', '/ˈɪŋɡlɪʃ/', 'adj./n.', '英语的；英语', 'Miss White is my English teacher.', '认知与学术', '怀特老师是我的英语老师。'),
      w('g3b-19', 'she', '/ʃiː/', 'pron.', '她', 'She is very nice.', '认知与学术', '她人很好。'),
      w('g3b-20', 'very', '/ˈveri/', 'adv.', '很；非常', 'She is very nice.', '认知与学术', '她人非常好。'),
      w('g3b-21', 'UK', '/ˌjuː ˈkeɪ/', 'n.', '英国', 'I\u2019m from the UK.', '社会与环境', '我来自英国。'),
      w('g3b-22', 'China', '/ˈtʃaɪnə/', 'n.', '中国', 'Welcome to China!', '社会与环境', '欢迎来到中国！'),
      w('g3b-23', 'Canada', '/ˈkænədə/', 'n.', '加拿大', 'Hi! I\u2019m Mike. I\u2019m from Canada.', '社会与环境', '你好！我是迈克，来自加拿大。'),
      w('g3b-24', 'USA', '/ˌjuː es ˈeɪ/', 'n.', '美国', 'I\u2019m Mary. I\u2019m from the USA.', '社会与环境', '我是玛丽，来自美国。'),
    ]},
    { id: 'g3b-u2', title: 'Unit 2 Expressing yourself 表达自己', words: [
      w('g3b-25', 'has', '/hæz/', 'v.', '具有（have 的第三人称单数）', 'It has a long tail and big ears.', '行为与动作', '它有长尾巴和大耳朵。'),
      w('g3b-26', 'long', '/lɒŋ/', 'adj.', '（长度）长的', 'It has a long body and short legs.', '品质与状态', '它有长身体和短腿。'),
      w('g3b-27', 'body', '/ˈbɒdi/', 'n.', '身体', 'It has a long body.', '认知与学术', '它有长身体。'),
      w('g3b-28', 'short', '/ʃɔːt/', 'adj.', '短的；矮的', 'It has a long body and short legs.', '品质与状态', '它有长身体和短腿。'),
      w('g3b-29', 'leg', '/leɡ/', 'n.', '腿', 'It has short legs.', '认知与学术', '它有短腿。'),
      w('g3b-30', 'right', '/raɪt/', 'adj.', '准确的；对的', 'Yes, that\u2019s right.', '品质与状态', '是的，那是对的。'),
      w('g3b-31', 'fat', '/fæt/', 'adj.', '肥胖的', 'He\u2019s old and fat.', '品质与状态', '他又老又胖。'),
      w('g3b-32', 'thin', '/θɪn/', 'adj.', '瘦的', 'It\u2019s thin. It has a long body.', '品质与状态', '它很瘦，有长身体。'),
      w('g3b-33', 'slow', '/sləʊ/', 'adj.', '缓慢的', 'And he\u2019s also very slow.', '品质与状态', '他也很慢。'),
      w('g3b-34', 'love', '/lʌv/', 'v.', '喜爱；爱', 'But I love him.', '情感与性格', '但是我很爱他。'),
      w('g3b-35', 'tail', '/teɪl/', 'n.', '尾巴', 'His tail is long.', '认知与学术', '它的尾巴很长。'),
      w('g3b-36', 'her', '/hɜː(r)/', 'pron.', '她；她的', 'I often make her gifts.', '认知与学术', '我经常给她做礼物。'),
      w('g3b-37', 'gift', '/ɡɪft/', 'n.', '礼物', 'I often make her gifts.', '社会与环境', '我经常给她做礼物。'),
      w('g3b-38', 'picture', '/ˈpɪktʃə(r)/', 'n.', '图画', 'Draw a picture.', '社会与环境', '画一幅画。'),
      w('g3b-39', 'card', '/kɑːd/', 'n.', '贺卡；卡片', 'Let\u2019s make a card.', '社会与环境', '我们做一张贺卡吧。'),
      w('g3b-40', 'sing', '/sɪŋ/', 'v.', '唱（歌）', 'Sing a song.', '行为与动作', '唱一首歌。'),
      w('g3b-41', 'dance', '/dɑːns/', 'v.', '跳舞', 'Let\u2019s sing and dance.', '行为与动作', '我们唱歌跳舞吧。'),
      w('g3b-42', 'talk', '/tɔːk/', 'v.', '说话；谈话', 'We talk.', '行为与动作', '我们说话。'),
      w('g3b-43', 'face', '/feɪs/', 'n.', '脸', 'My cat has a big face.', '认知与学术', '我的猫有一张大脸。'),
      w('g3b-44', 'all', '/ɔːl/', 'pron./adj.', '所有；全部', 'We all like to smile.', '认知与学术', '我们都喜欢微笑。'),
      w('g3b-45', 'song', '/sɒŋ/', 'n.', '歌；歌曲', 'Sing a song.', '社会与环境', '唱一首歌。'),
      w('g3b-46', 'or', '/ɔː(r)/', 'conj.', '或；还是', 'We draw pictures or make cards.', '认知与学术', '我们画画或者做卡片。'),
      w('g3b-47', 'so', '/səʊ/', 'adv.', '这么；那么', 'A smile can say so much!', '品质与状态', '一个微笑能表达那么多！'),
      w('g3b-48', 'much', '/mʌtʃ/', 'adv./pron.', '许多；大量', 'A smile can say so much!', '品质与状态', '一个微笑能表达那么多！'),
    ]},
    { id: 'g3b-u3', title: 'Unit 3 Learning better 更好地学习', words: [
      w('g3b-49', 'eraser', '/ɪˈreɪzə(r)/', 'n.', '橡皮', 'Can I use your eraser?', '社会与环境', '我能用一下你的橡皮吗？'),
      w('g3b-50', 'find', '/faɪnd/', 'v.', '找到；找回', 'I can\u2019t find my ruler.', '行为与动作', '我找不到我的直尺了。'),
      w('g3b-51', 'ruler', '/ˈruːlə(r)/', 'n.', '直尺', 'Can I use your ruler?', '社会与环境', '我能用一下你的直尺吗？'),
      w('g3b-52', 'pen', '/pen/', 'n.', '钢笔', 'Put the pen in your pencil box.', '社会与环境', '把钢笔放进铅笔盒。'),
      w('g3b-53', 'pencil', '/ˈpensl/', 'n.', '铅笔', 'Write with your pencil.', '社会与环境', '用你的铅笔写字。'),
      w('g3b-54', 'book', '/bʊk/', 'n.', '书', 'Read your book.', '社会与环境', '读你的书。'),
      w('g3b-55', 'bag', '/bæɡ/', 'n.', '包；袋', 'Put everything in your bag.', '社会与环境', '把所有东西放进包里。'),
      w('g3b-56', 'paper', '/ˈpeɪpə(r)/', 'n.', '纸', 'Write on your paper.', '社会与环境', '在纸上写字。'),
      w('g3b-57', 'these', '/ðiːz/', 'pron.', '这些', 'What are these? They\u2019re grapes.', '认知与学术', '这些是什么？是葡萄。'),
      w('g3b-58', 'see', '/siː/', 'v.', '看见', 'I see with my eyes.', '行为与动作', '我用眼睛看。'),
      w('g3b-59', 'smell', '/smel/', 'v.', '闻', 'I smell with my nose.', '行为与动作', '我用鼻子闻。'),
      w('g3b-60', 'taste', '/teɪst/', 'v.', '尝', 'I taste with my tongue.', '行为与动作', '我用舌头尝。'),
      w('g3b-61', 'hear', '/hɪə(r)/', 'v.', '听见', 'I hear with my ears.', '行为与动作', '我用耳朵听。'),
      w('g3b-62', 'touch', '/tʌtʃ/', 'v.', '触摸', 'I touch the grass.', '行为与动作', '我触摸草地。'),
      w('g3b-63', 'nose', '/nəʊz/', 'n.', '鼻子', 'I smell with my nose.', '认知与学术', '我用鼻子闻。'),
      w('g3b-64', 'tongue', '/tʌŋ/', 'n.', '舌头', 'I taste with my tongue.', '认知与学术', '我用舌头尝。'),
      w('g3b-65', 'class', '/klɑːs/', 'n.', '课；班级', 'I see and hear in class.', '认知与学术', '我在课堂上看和听。'),
      w('g3b-66', 'computer', '/kəmˈpjuːtə(r)/', 'n.', '计算机', 'I can use computers to learn.', '社会与环境', '我能用电脑学习。'),
      w('g3b-67', 'learn', '/lɜːn/', 'v.', '学；学习', 'What helps us learn?', '行为与动作', '什么帮助我们学习？'),
    ]},
    { id: 'g3b-u4', title: 'Unit 4 Healthy food 健康食物', words: [
      w('g3b-68', 'breakfast', '/ˈbrekfəst/', 'n.', '早餐', 'Breakfast time!', '行为与动作', '早餐时间！'),
      w('g3b-69', 'time', '/taɪm/', 'n.', '时间', 'Breakfast time!', '认知与学术', '早餐时间！'),
      w('g3b-70', 'bread', '/bred/', 'n.', '面包', 'I\u2019d like some bread and eggs.', '社会与环境', '我想吃面包和鸡蛋。'),
      w('g3b-71', 'egg', '/eɡ/', 'n.', '鸡蛋', 'I\u2019d like some bread and eggs.', '社会与环境', '我想吃面包和鸡蛋。'),
      w('g3b-72', 'milk', '/mɪlk/', 'n.', '奶', 'Have some milk too.', '社会与环境', '也喝点牛奶吧。'),
      w('g3b-73', 'noodle', '/ˈnuːdl/', 'n.', '面条（常用复数）', 'I\u2019d like some juice and noodles.', '社会与环境', '我想要果汁和面条。'),
      w('g3b-74', 'juice', '/dʒuːs/', 'n.', '果汁', 'I\u2019d like some juice and noodles.', '社会与环境', '我想要果汁和面条。'),
      w('g3b-75', 'rice', '/raɪs/', 'n.', '大米', 'Would you like some rice and meat?', '社会与环境', '你要米饭和肉吗？'),
      w('g3b-76', 'meat', '/miːt/', 'n.', '肉', 'Would you like some rice and meat?', '社会与环境', '你要米饭和肉吗？'),
      w('g3b-77', 'vegetable', '/ˈvedʒtəbl/', 'n.', '蔬菜', 'Have some vegetables too.', '社会与环境', '也吃点蔬菜吧。'),
      w('g3b-78', 'healthy', '/ˈhelθi/', 'adj.', '健康的', 'I love healthy food.', '品质与状态', '我喜欢健康食品。'),
      w('g3b-79', 'plate', '/pleɪt/', 'n.', '盘子', 'This is my healthy plate.', '社会与环境', '这是我的健康餐盘。'),
      w('g3b-80', 'soup', '/suːp/', 'n.', '汤', 'We need soup and milk.', '社会与环境', '我们需要汤和牛奶。'),
      w('g3b-81', 'fruit', '/fruːt/', 'n.', '水果', 'I love vegetables and fruit.', '社会与环境', '我喜爱蔬菜和水果。'),
      w('g3b-82', 'colourful', '/ˈkʌləfl/', 'adj.', '五彩缤纷的', 'Fruit and vegetables are colourful.', '品质与状态', '水果蔬菜色彩丰富。'),
      w('g3b-83', 'candy', '/ˈkændi/', 'n.', '糖果', 'Candy and cake are yummy.', '社会与环境', '糖果蛋糕很好吃。'),
      w('g3b-84', 'yummy', '/ˈjʌmi/', 'adj.', '很好吃的', 'Candy and cake are yummy.', '品质与状态', '糖果蛋糕很好吃。'),
    ]},
    { id: 'g3b-u5', title: 'Unit 5 Old toys 旧玩具', words: [
      w('g3b-85', 'boat', '/bəʊt/', 'n.', '小船', 'This boat is cool.', '社会与环境', '这只船很酷。'),
      w('g3b-86', 'cool', '/kuːl/', 'adj.', '酷的', 'This boat is cool.', '品质与状态', '这只船很酷。'),
      w('g3b-87', 'keep', '/kiːp/', 'v.', '保有；留着', 'You can keep it.', '行为与动作', '你可以留着它。'),
      w('g3b-88', 'at', '/æt/', 'prep.', '在（某处）', 'Do you have old things at home?', '行为与动作', '你家里有旧东西吗？'),
      w('g3b-89', 'home', '/həʊm/', 'n.', '家', 'Do you have old things at home?', '社会与环境', '你家里有旧东西吗？'),
      w('g3b-90', 'ball', '/bɔːl/', 'n.', '球', 'I have a ball.', '社会与环境', '我有一个球。'),
      w('g3b-91', 'doll', '/dɒl/', 'n.', '玩偶', 'Put your old dolls on the shelf.', '社会与环境', '把旧娃娃放在架子上。'),
      w('g3b-92', 'car', '/kɑː(r)/', 'n.', '小汽车', 'I have a car.', '社会与环境', '我有一辆小汽车。'),
      w('g3b-93', 'on', '/ɒn/', 'prep.', '在……上', 'Is it on the shelf?', '行为与动作', '在架子上吗？'),
      w('g3b-94', 'shelf', '/ʃelf/', 'n.', '架子', 'Is it on the shelf?', '社会与环境', '在架子上吗？'),
      w('g3b-95', 'in', '/ɪn/', 'prep.', '在……内', 'It\u2019s in the box.', '行为与动作', '在盒子里。'),
      w('g3b-96', 'box', '/bɒks/', 'n.', '盒子', 'Put your old things in a box.', '社会与环境', '把旧东西放进盒子。'),
      w('g3b-97', 'cap', '/kæp/', 'n.', '帽子', 'And this old cap too.', '社会与环境', '还有这顶旧帽子。'),
      w('g3b-98', 'map', '/mæp/', 'n.', '地图', 'Put your old map on the wall.', '社会与环境', '把旧地图贴在墙上。'),
      w('g3b-99', 'under', '/ˈʌndə(r)/', 'prep.', '在……下面', 'Put your boat under the bed.', '行为与动作', '把你的船放在床下。'),
      w('g3b-100', 'still', '/stɪl/', 'adv.', '还是；仍然', 'They are still good.', '品质与状态', '它们仍然很好用。'),
      w('g3b-101', 'put', '/pʊt/', 'v.', '放；安置', 'Put your old things in a box.', '行为与动作', '把旧东西放进盒子。'),
    ]},
    { id: 'g3b-u6', title: 'Unit 6 Numbers in life 生活中的数字', words: [
      w('g3b-102', 'eleven', '/ɪˈlevn/', 'num.', '十一', 'A football team has eleven players.', '认知与学术', '足球队有十一名队员。'),
      w('g3b-103', 'twelve', '/twelv/', 'num.', '十二', 'It\u2019s twelve yuan.', '认知与学术', '十二元。'),
      w('g3b-104', 'thirteen', '/ˌθɜːˈtiːn/', 'num.', '十三', 'Three for thirteen yuan.', '认知与学术', '十三元三个。'),
      w('g3b-105', 'fourteen', '/ˌfɔːˈtiːn/', 'num.', '十四', 'There are fourteen on the bus.', '认知与学术', '车上有十四个人。'),
      w('g3b-106', 'fifteen', '/ˌfɪfˈtiːn/', 'num.', '十五', 'I pay fifteen yuan for five books.', '认知与学术', '我付十五元买五本书。'),
      w('g3b-107', 'sixteen', '/ˌsɪksˈtiːn/', 'num.', '十六', 'Three for sixteen yuan?', '认知与学术', '十六元三个怎么样？'),
      w('g3b-108', 'seventeen', '/ˌsevnˈtiːn/', 'num.', '十七', 'Three for seventeen yuan.', '认知与学术', '十七元三个。'),
      w('g3b-109', 'eighteen', '/ˌeɪˈtiːn/', 'num.', '十八', 'Buy three for eighteen yuan.', '认知与学术', '十八元买三个。'),
      w('g3b-110', 'nineteen', '/ˌnaɪnˈtiːn/', 'num.', '十九', 'Nineteen minutes.', '认知与学术', '十九分钟。'),
      w('g3b-111', 'twenty', '/ˈtwenti/', 'num.', '二十', 'It\u2019s twenty yuan.', '认知与学术', '二十元。'),
      w('g3b-112', 'piggy bank', '/ˈpɪɡi bæŋk/', 'n.', '猪形储钱罐', 'I put them in my piggy bank.', '社会与环境', '我把它们放进储钱罐。'),
      w('g3b-113', 'pay', '/peɪ/', 'v.', '付费', 'I pay fifteen yuan for five books.', '行为与动作', '我付十五元买五本书。'),
      w('g3b-114', 'back', '/bæk/', 'adv.', '回到原处', 'I put two yuan back.', '行为与动作', '我把两元钱放回去。'),
    ]},
  ],
};

// ===== 小学英语：一年级、二年级、四~六年级（人教版PEP真实基础词，完整单元词表由定时任务逐步导入） =====
const GRADE1_BOOK: VocabBook = {
  id: 'primary-g1', name: '人教版小学英语·一年级上册', stage: '小学英语', builtin: true,
  desc: '人教版新起点·一年级上册真实教材词表', wordCount: 58,
  units: [
    { id: 'g1-u1', title: 'Unit 1 School 学校', words: [
      w('g1-1', 'book', '/bʊk/', 'n.', '书', 'This is a book.', '认知与学术', '这是一本书。'),
      w('g1-2', 'ruler', '/ˈruːlə/', 'n.', '尺子', 'My ruler is long.', '认知与学术', '我的尺子很长。'),
      w('g1-3', 'pencil', '/ˈpensl/', 'n.', '铅笔', 'I have a pencil.', '认知与学术', '我有一支铅笔。'),
      w('g1-4', 'eraser', '/ɪˈreɪzə/', 'n.', '橡皮', 'Use the eraser.', '认知与学术', '用橡皮。'),
      w('g1-5', 'pencil case', '/ˈpensl keɪs/', 'n.', '铅笔盒', 'It is in the pencil case.', '认知与学术', '它在铅笔盒里。'),
      w('g1-6', 'schoolbag', '/ˈskuːlbæɡ/', 'n.', '书包', 'My schoolbag is heavy.', '认知与学术', '我的书包很重。'),
      w('g1-7', 'teacher', '/ˈtiːtʃə/', 'n.', '老师', 'My teacher is kind.', '社会与环境', '我的老师很和蔼。'),
      w('g1-8', 'school', '/skuːl/', 'n.', '学校', 'I go to school.', '社会与环境', '我去上学。'),
    ]},
    { id: 'g1-u2', title: 'Unit 2 My body 我的身体', words: [
      w('g1-9', 'eye', '/aɪ/', 'n.', '眼睛', 'I have two eyes.', '认知与学术', '我有两只眼睛。'),
      w('g1-10', 'hand', '/hænd/', 'n.', '手', 'Wash your hands.', '认知与学术', '洗手。'),
      w('g1-11', 'ear', '/ɪə/', 'n.', '耳朵', 'I have two ears.', '认知与学术', '我有两只耳朵。'),
      w('g1-12', 'mouth', '/maʊθ/', 'n.', '嘴', 'Open your mouth.', '认知与学术', '张开嘴。'),
      w('g1-13', 'nose', '/nəʊz/', 'n.', '鼻子', 'I have a nose.', '认知与学术', '我有一个鼻子。'),
      w('g1-14', 'foot', '/fʊt/', 'n.', '脚', 'I hurt my foot.', '认知与学术', '我伤了脚。'),
      w('g1-15', 'face', '/feɪs/', 'n.', '脸', 'Touch your face.', '认知与学术', '摸摸脸。'),
      w('g1-16', 'leg', '/leɡ/', 'n.', '腿', 'My leg is long.', '认知与学术', '我的腿很长。'),
      w('g1-17', 'arm', '/ɑːm/', 'n.', '胳膊', 'Raise your arm.', '认知与学术', '举起胳膊。'),
    ]},
    { id: 'g1-u3', title: 'Unit 3 Animals 动物', words: [
      w('g1-18', 'cat', '/kæt/', 'n.', '猫', 'The cat is cute.', '社会与环境', '猫很可爱。'),
      w('g1-19', 'dog', '/dɒɡ/', 'n.', '狗', 'The dog runs.', '社会与环境', '狗在跑。'),
      w('g1-20', 'bird', '/bɜːd/', 'n.', '鸟', 'A bird can fly.', '社会与环境', '鸟会飞。'),
      w('g1-21', 'rabbit', '/ˈræbɪt/', 'n.', '兔子', 'The rabbit is white.', '社会与环境', '兔子是白色的。'),
      w('g1-22', 'duck', '/dʌk/', 'n.', '鸭子', 'The duck swims.', '社会与环境', '鸭子在游泳。'),
      w('g1-23', 'monkey', '/ˈmʌŋki/', 'n.', '猴子', 'The monkey jumps.', '社会与环境', '猴子在跳。'),
      w('g1-24', 'tiger', '/ˈtaɪɡə/', 'n.', '老虎', 'The tiger is big.', '社会与环境', '老虎很大。'),
      w('g1-25', 'panda', '/ˈpændə/', 'n.', '熊猫', 'The panda is fat.', '社会与环境', '熊猫很胖。'),
      w('g1-26', 'elephant', '/ˈelɪfənt/', 'n.', '大象', 'The elephant is tall.', '社会与环境', '大象很高。'),
      w('g1-27', 'fish', '/fɪʃ/', 'n.', '鱼', 'Fish live in water.', '社会与环境', '鱼生活在水中。'),
    ]},
    { id: 'g1-u4', title: 'Unit 4 Numbers 数字', words: [
      w('g1-28', 'one', '/wʌn/', 'num.', '一', 'I have one book.', '认知与学术', '我有一本书。'),
      w('g1-29', 'two', '/tuː/', 'num.', '二', 'I have two hands.', '认知与学术', '我有两只手。'),
      w('g1-30', 'three', '/θriː/', 'num.', '三', 'There are three cats.', '认知与学术', '有三只猫。'),
      w('g1-31', 'four', '/fɔː/', 'num.', '四', 'I have four pens.', '认知与学术', '我有四支笔。'),
      w('g1-32', 'five', '/faɪv/', 'num.', '五', 'Count to five.', '认知与学术', '数到五。'),
      w('g1-33', 'six', '/sɪks/', 'num.', '六', 'I am six years old.', '认知与学术', '我六岁。'),
      w('g1-34', 'seven', '/ˈsevn/', 'num.', '七', 'There are seven days.', '认知与学术', '有七天。'),
      w('g1-35', 'eight', '/eɪt/', 'num.', '八', 'I have eight toys.', '认知与学术', '我有八个玩具。'),
      w('g1-36', 'nine', '/naɪn/', 'num.', '九', 'Nine is my number.', '认知与学术', '九是我的数字。'),
      w('g1-37', 'ten', '/ten/', 'num.', '十', 'Count to ten.', '认知与学术', '数到十。'),
    ]},
    { id: 'g1-u5', title: 'Unit 5 My family 我的家庭', words: [
      w('g1-38', 'father', '/ˈfɑːðə/', 'n.', '爸爸', 'My father is tall.', '社会与环境', '我爸爸很高。'),
      w('g1-39', 'mother', '/ˈmʌðə/', 'n.', '妈妈', 'My mother is kind.', '社会与环境', '我妈妈很和蔼。'),
      w('g1-40', 'brother', '/ˈbrʌðə/', 'n.', '哥哥；弟弟', 'I have a brother.', '社会与环境', '我有一个哥哥。'),
      w('g1-41', 'sister', '/ˈsɪstə/', 'n.', '姐姐；妹妹', 'My sister is cute.', '社会与环境', '我妹妹很可爱。'),
      w('g1-42', 'family', '/ˈfæməli/', 'n.', '家庭', 'I love my family.', '社会与环境', '我爱我的家庭。'),
      w('g1-43', 'grandpa', '/ˈɡrænpɑː/', 'n.', '爷爷；外公', 'Grandpa is old.', '社会与环境', '爷爷年纪大了。'),
      w('g1-44', 'grandma', '/ˈɡrænmɑː/', 'n.', '奶奶；外婆', 'Grandma cooks well.', '社会与环境', '奶奶做饭好吃。'),
    ]},
    { id: 'g1-u6', title: 'Unit 6 Colours & Food 颜色与食物', words: [
      w('g1-45', 'red', '/red/', 'adj.', '红色的', 'The apple is red.', '品质与状态', '苹果是红色的。'),
      w('g1-46', 'yellow', '/ˈjeləʊ/', 'adj.', '黄色的', 'The banana is yellow.', '品质与状态', '香蕉是黄色的。'),
      w('g1-47', 'blue', '/bluː/', 'adj.', '蓝色的', 'The sky is blue.', '品质与状态', '天空是蓝色的。'),
      w('g1-48', 'green', '/ɡriːn/', 'adj.', '绿色的', 'The grass is green.', '品质与状态', '草是绿色的。'),
      w('g1-49', 'black', '/blæk/', 'adj.', '黑色的', 'I have a black cat.', '品质与状态', '我有一只黑猫。'),
      w('g1-50', 'white', '/waɪt/', 'adj.', '白色的', 'The rabbit is white.', '品质与状态', '兔子是白色的。'),
      w('g1-51', 'orange', '/ˈɒrɪndʒ/', 'n./adj.', '橙子；橙色的', 'I like oranges.', '认知与学术', '我喜欢橙子。'),
      w('g1-52', 'apple', '/ˈæpl/', 'n.', '苹果', 'I eat an apple.', '认知与学术', '我吃一个苹果。'),
      w('g1-53', 'banana', '/bəˈnɑːnə/', 'n.', '香蕉', 'The monkey likes bananas.', '认知与学术', '猴子喜欢香蕉。'),
      w('g1-54', 'pear', '/peə/', 'n.', '梨', 'The pear is sweet.', '认知与学术', '梨很甜。'),
      w('g1-55', 'peach', '/piːtʃ/', 'n.', '桃子', 'I like peaches.', '认知与学术', '我喜欢桃子。'),
      w('g1-56', 'milk', '/mɪlk/', 'n.', '牛奶', 'I drink milk.', '认知与学术', '我喝牛奶。'),
      w('g1-57', 'bread', '/bred/', 'n.', '面包', 'I eat bread.', '认知与学术', '我吃面包。'),
      w('g1-58', 'egg', '/eɡ/', 'n.', '鸡蛋', 'I have an egg.', '认知与学术', '我有一个鸡蛋。'),
    ]},
  ],
};

const GRADE1B_BOOK: VocabBook = {
  id: 'primary-g1b', name: '人教版小学英语·一年级下册', stage: '小学英语', builtin: true,
  desc: '人教版新起点·一年级下册真实教材词表（79 词，6 单元）', wordCount: 79,
  units: [
    { id: 'g1b-u1', title: 'Unit 1 Classroom 教室', words: [
      w('g1b-1', 'classroom', '/ˈklɑːsruːm/', 'n.', '教室', 'This is our classroom.', '社会与环境', '这是我们的教室。'),
      w('g1b-2', 'door', '/dɔː/', 'n.', '门', 'Open the door.', '社会与环境', '开门。'),
      w('g1b-3', 'window', '/ˈwɪndəʊ/', 'n.', '窗', 'Close the window.', '社会与环境', '关窗。'),
      w('g1b-4', 'blackboard', '/ˈblækbɔːd/', 'n.', '黑板', 'The blackboard is black.', '社会与环境', '黑板是黑色的。'),
      w('g1b-5', 'wall', '/wɔːl/', 'n.', '墙壁', 'The picture is on the wall.', '社会与环境', '画在墙上。'),
      w('g1b-6', 'desk', '/desk/', 'n.', '书桌', 'My book is on the desk.', '社会与环境', '我的书在桌上。'),
      w('g1b-7', 'chair', '/tʃeə/', 'n.', '椅子', 'Sit on the chair.', '社会与环境', '坐在椅子上。'),
      w('g1b-8', 'boy', '/bɔɪ/', 'n.', '男孩', 'The boy is my friend.', '社会与环境', '男孩是我的朋友。'),
      w('g1b-9', 'girl', '/ɡɜːl/', 'n.', '女孩', 'The girl can sing.', '社会与环境', '女孩会唱歌。'),
      w('g1b-10', 'in', '/ɪn/', 'prep.', '在……里', 'The pen is in the box.', '行为与动作', '钢笔在盒子里。'),
      w('g1b-11', 'on', '/ɒn/', 'prep.', '在……之上', 'The cat is on the bed.', '行为与动作', '猫在床上。'),
      w('g1b-12', 'under', '/ˈʌndə/', 'prep.', '在……之下', 'The ball is under the desk.', '行为与动作', '球在桌下。'),
      w('g1b-13', 'where', '/weə/', 'adv.', '在哪里', 'Where is my book?', '认知与学术', '我的书在哪里？'),
    ]},
    { id: 'g1b-u2', title: 'Unit 2 Room 房间', words: [
      w('g1b-14', 'room', '/ruːm/', 'n.', '房间', 'My room is clean.', '社会与环境', '我的房间很干净。'),
      w('g1b-15', 'closet', '/ˈklɒzɪt/', 'n.', '壁橱', 'The clothes are in the closet.', '社会与环境', '衣服在壁橱里。'),
      w('g1b-16', 'telephone', '/ˈtelɪfəʊn/', 'n.', '电话', 'The telephone rings.', '社会与环境', '电话响了。'),
      w('g1b-17', 'computer', '/kəmˈpjuːtə/', 'n.', '计算机；电脑', 'I play on the computer.', '社会与环境', '我玩电脑。'),
      w('g1b-18', 'TV', '/ˌtiː ˈviː/', 'n.', '电视', 'We watch TV.', '社会与环境', '我们看电视。'),
      w('g1b-19', 'bed', '/bed/', 'n.', '床', 'The bed is soft.', '社会与环境', '床很软。'),
      w('g1b-20', 'picture', '/ˈpɪktʃə/', 'n.', '图画', 'The picture is beautiful.', '社会与环境', '图画很美。'),
      w('g1b-21', 'table', '/ˈteɪbl/', 'n.', '桌子', 'The cup is on the table.', '社会与环境', '杯子在桌子上。'),
      w('g1b-22', 'lamp', '/læmp/', 'n.', '灯', 'The lamp is bright.', '社会与环境', '灯很亮。'),
      w('g1b-23', 'armchair', '/ˈɑːmtʃeə/', 'n.', '扶手椅', 'Sit in the armchair.', '社会与环境', '坐在扶手椅上。'),
      w('g1b-24', 'behind', '/bɪˈhaɪnd/', 'prep.', '在……之后', 'The cat is behind the door.', '行为与动作', '猫在门后。'),
      w('g1b-25', 'next to', '/nekst tuː/', 'phrase.', '在……旁边', 'I sit next to Tom.', '行为与动作', '我坐在汤姆旁边。'),
    ]},
    { id: 'g1b-u3', title: 'Unit 3 Toys 玩具', words: [
      w('g1b-26', 'toy', '/tɔɪ/', 'n.', '玩具', 'I have a toy car.', '社会与环境', '我有一辆玩具车。'),
      w('g1b-27', 'plane', '/pleɪn/', 'n.', '飞机', 'The plane flies high.', '社会与环境', '飞机飞得高。'),
      w('g1b-28', 'boat', '/bəʊt/', 'n.', '小船', 'The boat is on the water.', '社会与环境', '船在水上。'),
      w('g1b-29', 'train', '/treɪn/', 'n.', '火车', 'The train is fast.', '社会与环境', '火车很快。'),
      w('g1b-30', 'ball', '/bɔːl/', 'n.', '球', 'Pass the ball.', '社会与环境', '传球。'),
      w('g1b-31', 'teddy bear', '/ˈtedi beə/', 'n.', '玩具熊', 'I like my teddy bear.', '社会与环境', '我喜欢我的玩具熊。'),
      w('g1b-32', 'bus', '/bʌs/', 'n.', '公共汽车', 'We go by bus.', '社会与环境', '我们坐公交车去。'),
      w('g1b-33', 'car', '/kɑː/', 'n.', '小汽车', 'The car is red.', '社会与环境', '车是红色的。'),
      w('g1b-34', 'doll', '/dɒl/', 'n.', '洋娃娃', 'The doll is lovely.', '社会与环境', '洋娃娃很可爱。'),
      w('g1b-35', 'pinwheel', '/ˈpɪnwiːl/', 'n.', '纸风车', 'The pinwheel turns.', '社会与环境', '纸风车转动。'),
      w('g1b-36', 'box', '/bɒks/', 'n.', '盒子', 'Put the toys in the box.', '社会与环境', '把玩具放进盒子。'),
    ]},
    { id: 'g1b-u4', title: 'Unit 4 Shapes and Numbers 形状与数字', words: [
      w('g1b-37', 'shape', '/ʃeɪp/', 'n.', '图形', 'What shape is it?', '认知与学术', '它是什么形状？'),
      w('g1b-38', 'circle', '/ˈsɜːkl/', 'n.', '圆形', 'The sun is a circle.', '认知与学术', '太阳是圆的。'),
      w('g1b-39', 'triangle', '/ˈtraɪæŋɡl/', 'n.', '三角形', 'This is a triangle.', '认知与学术', '这是三角形。'),
      w('g1b-40', 'rectangle', '/ˈrektæŋɡl/', 'n.', '长方形', 'The door is a rectangle.', '认知与学术', '门是长方形。'),
      w('g1b-41', 'square', '/skweə/', 'n.', '正方形', 'The box is a square.', '认知与学术', '盒子是正方形。'),
      w('g1b-42', 'eleven', '/ɪˈlevn/', 'num.', '十一', 'I am eleven.', '认知与学术', '我十一岁。'),
      w('g1b-43', 'twelve', '/twelv/', 'num.', '十二', 'There are twelve months.', '认知与学术', '一年有十二个月。'),
      w('g1b-44', 'thirteen', '/ˌθɜːˈtiːn/', 'num.', '十三', 'I have thirteen books.', '认知与学术', '我有十三本书。'),
      w('g1b-45', 'fourteen', '/ˌfɔːˈtiːn/', 'num.', '十四', 'Fourteen students are here.', '认知与学术', '这里有十四个学生。'),
      w('g1b-46', 'fifteen', '/ˌfɪfˈtiːn/', 'num.', '十五', 'Fifteen birds fly.', '认知与学术', '十五只鸟在飞。'),
      w('g1b-47', 'sixteen', '/ˌsɪksˈtiːn/', 'num.', '十六', 'I count to sixteen.', '认知与学术', '我数到十六。'),
      w('g1b-48', 'seventeen', '/ˌsevnˈtiːn/', 'num.', '十七', 'Seventeen stars.', '认知与学术', '十七颗星星。'),
      w('g1b-49', 'eighteen', '/ˌeɪˈtiːn/', 'num.', '十八', 'Eighteen is my number.', '认知与学术', '十八是我的号码。'),
      w('g1b-50', 'nineteen', '/ˌnaɪnˈtiːn/', 'num.', '十九', 'Nineteen plus one is twenty.', '认知与学术', '十九加一是二十。'),
      w('g1b-51', 'twenty', '/ˈtwenti/', 'num.', '二十', 'There are twenty desks.', '认知与学术', '有二十张书桌。'),
    ]},
    { id: 'g1b-u5', title: 'Unit 5 Clothes 衣服', words: [
      w('g1b-52', 'clothes', '/kləʊðz/', 'n.', '衣服', 'My clothes are new.', '社会与环境', '我的衣服是新的。'),
      w('g1b-53', 'T-shirt', '/ˈtiː ʃɜːt/', 'n.', 'T恤衫', 'I wear a T-shirt.', '社会与环境', '我穿 T 恤。'),
      w('g1b-54', 'pants', '/pænts/', 'n.', '裤子', 'The pants are blue.', '社会与环境', '裤子是蓝色的。'),
      w('g1b-55', 'shorts', '/ʃɔːts/', 'n.', '短裤', 'He wears shorts.', '社会与环境', '他穿短裤。'),
      w('g1b-56', 'jacket', '/ˈdʒækɪt/', 'n.', '夹克', 'Put on your jacket.', '社会与环境', '穿上夹克。'),
      w('g1b-57', 'sweater', '/ˈswetə/', 'n.', '毛衣', 'The sweater is warm.', '社会与环境', '毛衣很暖和。'),
      w('g1b-58', 'skirt', '/skɜːt/', 'n.', '裙子', 'She likes her skirt.', '社会与环境', '她喜欢她的裙子。'),
      w('g1b-59', 'dress', '/dres/', 'n.', '连衣裙', 'The dress is pretty.', '社会与环境', '连衣裙很漂亮。'),
      w('g1b-60', 'shoe', '/ʃuː/', 'n.', '鞋子', 'My shoe is black.', '社会与环境', '我的鞋是黑色的。'),
      w('g1b-61', 'sock', '/sɒk/', 'n.', '袜子', 'I have a red sock.', '社会与环境', '我有一只红袜子。'),
    ]},
    { id: 'g1b-u6', title: 'Unit 6 Food and Drink 食物和饮料', words: [
      w('g1b-62', 'food', '/fuːd/', 'n.', '食物', 'I like Chinese food.', '社会与环境', '我喜欢中国食物。'),
      w('g1b-63', 'drink', '/drɪŋk/', 'n.', '饮料', 'I want a drink.', '社会与环境', '我想喝点东西。'),
      w('g1b-64', 'rice', '/raɪs/', 'n.', '米饭', 'We eat rice.', '社会与环境', '我们吃米饭。'),
      w('g1b-65', 'noodle', '/ˈnuːdl/', 'n.', '面条', 'I like noodles.', '社会与环境', '我喜欢面条。'),
      w('g1b-66', 'jiaozi', '/ˈdʒjaʊtsi/', 'n.', '饺子', 'We eat jiaozi at the festival.', '社会与环境', '节日我们吃饺子。'),
      w('g1b-67', 'tofu', '/ˈtəʊfuː/', 'n.', '豆腐', 'Tofu is healthy.', '社会与环境', '豆腐很健康。'),
      w('g1b-68', 'vegetable', '/ˈvedʒtəbl/', 'n.', '蔬菜', 'Eat more vegetables.', '社会与环境', '多吃蔬菜。'),
      w('g1b-69', 'meat', '/miːt/', 'n.', '肉', 'The meat is delicious.', '社会与环境', '肉很好吃。'),
      w('g1b-70', 'fish', '/fɪʃ/', 'n.', '鱼', 'The fish is fresh.', '社会与环境', '鱼很新鲜。'),
      w('g1b-71', 'chicken', '/ˈtʃɪkɪn/', 'n.', '鸡肉', 'I like chicken.', '社会与环境', '我喜欢鸡肉。'),
      w('g1b-72', 'bread', '/bred/', 'n.', '面包', 'She has some bread.', '社会与环境', '她有些面包。'),
      w('g1b-73', 'milk', '/mɪlk/', 'n.', '牛奶', 'Drink some milk.', '社会与环境', '喝点牛奶。'),
      w('g1b-74', 'ice cream', '/ˌaɪs ˈkriːm/', 'n.', '冰淇淋', 'The ice cream is cold.', '社会与环境', '冰激凌很凉。'),
      w('g1b-75', 'juice', '/dʒuːs/', 'n.', '果汁', 'I like apple juice.', '社会与环境', '我喜欢苹果汁。'),
      w('g1b-76', 'egg', '/eɡ/', 'n.', '鸡蛋', 'I have an egg for breakfast.', '社会与环境', '我早餐吃一个鸡蛋。'),
      w('g1b-77', 'salad', '/ˈsæləd/', 'n.', '色拉', 'The salad is good.', '社会与环境', '沙拉很好吃。'),
      w('g1b-78', 'hamburger', '/ˈhæmbɜːɡə/', 'n.', '汉堡包', 'He eats a hamburger.', '社会与环境', '他吃一个汉堡。'),
      w('g1b-79', 'cake', '/keɪk/', 'n.', '蛋糕', 'The cake is sweet.', '社会与环境', '蛋糕很甜。'),
    ]},
  ],
};

const GRADE2_BOOK: VocabBook = {
  id: 'primary-g2', name: '人教版小学英语·二年级上册', stage: '小学英语', builtin: true,
  desc: '人教版新起点·二年级上册真实教材词表', wordCount: 44,
  units: [
    { id: 'g2-u1', title: 'Unit 1 Family 家庭', words: [
      w('g2-1', 'family', '/ˈfæməli/', 'n.', '家庭', 'My family is big.', '社会与环境', '我的家庭很大。'),
      w('g2-2', 'grandpa', '/ˈɡrænpɑː/', 'n.', '爷爷；外公', 'Grandpa is kind.', '社会与环境', '爷爷很和蔼。'),
      w('g2-3', 'grandma', '/ˈɡrænmɑː/', 'n.', '奶奶；外婆', 'Grandma is cooking.', '社会与环境', '奶奶在做饭。'),
      w('g2-4', 'dad', '/dæd/', 'n.', '爸爸', 'My dad can drive.', '社会与环境', '我爸爸会开车。'),
      w('g2-5', 'mom', '/mɒm/', 'n.', '妈妈', 'My mom is pretty.', '社会与环境', '我妈妈很漂亮。'),
      w('g2-6', 'sister', '/ˈsɪstə/', 'n.', '姐妹', 'My sister sings well.', '社会与环境', '我妹妹唱得好。'),
      w('g2-7', 'brother', '/ˈbrʌðə/', 'n.', '兄弟', 'My brother is tall.', '社会与环境', '我哥哥很高。'),
      w('g2-8', 'policeman', '/pəˈliːsmən/', 'n.', '警察', 'He is a policeman.', '社会与环境', '他是一名警察。'),
      w('g2-9', 'doctor', '/ˈdɒktə/', 'n.', '医生', 'The doctor is busy.', '社会与环境', '医生很忙。'),
      w('g2-10', 'teacher', '/ˈtiːtʃə/', 'n.', '老师', 'The teacher teaches us.', '社会与环境', '老师教我们。'),
      w('g2-11', 'engineer', '/ˌendʒɪˈnɪə/', 'n.', '工程师', 'My uncle is an engineer.', '社会与环境', '我叔叔是工程师。'),
    ]},
    { id: 'g2-u2', title: 'Unit 2 Friends 同学朋友', words: [
      w('g2-12', 'classmate', '/ˈklɑːsmeɪt/', 'n.', '同学', 'She is my classmate.', '社会与环境', '她是我的同学。'),
      w('g2-13', 'friend', '/frend/', 'n.', '朋友', 'He is my best friend.', '情感与性格', '他是我最好的朋友。'),
      w('g2-14', 'big', '/bɪɡ/', 'adj.', '大的', 'The elephant is big.', '品质与状态', '大象很大。'),
      w('g2-15', 'thin', '/θɪn/', 'adj.', '瘦的', 'He is thin.', '品质与状态', '他很瘦。'),
      w('g2-16', 'pretty', '/ˈprɪti/', 'adj.', '漂亮的', 'She is pretty.', '品质与状态', '她很漂亮。'),
      w('g2-17', 'tall', '/tɔːl/', 'adj.', '高的', 'My father is tall.', '品质与状态', '我爸爸很高。'),
      w('g2-18', 'short', '/ʃɔːt/', 'adj.', '矮的', 'The boy is short.', '品质与状态', '这个男孩很矮。'),
    ]},
    { id: 'g2-u3', title: 'Unit 3 Places 地点', words: [
      w('g2-19', 'park', '/pɑːk/', 'n.', '公园', 'We play in the park.', '社会与环境', '我们在公园玩。'),
      w('g2-20', 'hill', '/hɪl/', 'n.', '小山', 'There is a hill.', '社会与环境', '有一座小山。'),
      w('g2-21', 'lake', '/leɪk/', 'n.', '湖', 'Fish live in the lake.', '社会与环境', '鱼生活在湖里。'),
      w('g2-22', 'river', '/ˈrɪvə/', 'n.', '河流', 'The river is long.', '社会与环境', '这条河很长。'),
      w('g2-23', 'zoo', '/zuː/', 'n.', '动物园', 'We go to the zoo.', '社会与环境', '我们去动物园。'),
      w('g2-24', 'farm', '/fɑːm/', 'n.', '农场', 'He lives on a farm.', '社会与环境', '他住在农场。'),
    ]},
    { id: 'g2-u4', title: 'Unit 4 Seasons 季节', words: [
      w('g2-25', 'spring', '/sprɪŋ/', 'n.', '春天', 'Spring is warm.', '社会与环境', '春天很温暖。'),
      w('g2-26', 'summer', '/ˈsʌmə/', 'n.', '夏天', 'Summer is hot.', '社会与环境', '夏天很热。'),
      w('g2-27', 'autumn', '/ˈɔːtəm/', 'n.', '秋天', 'Autumn is cool.', '社会与环境', '秋天很凉爽。'),
      w('g2-28', 'winter', '/ˈwɪntə/', 'n.', '冬天', 'Winter is cold.', '社会与环境', '冬天很冷。'),
      w('g2-29', 'hot', '/hɒt/', 'adj.', '炎热的', 'The day is hot.', '品质与状态', '天很热。'),
      w('g2-30', 'warm', '/wɔːm/', 'adj.', '温暖的', 'Spring is warm.', '品质与状态', '春天很温暖。'),
      w('g2-31', 'cool', '/kuːl/', 'adj.', '凉爽的', 'Autumn is cool.', '品质与状态', '秋天凉爽。'),
      w('g2-32', 'cold', '/kəʊld/', 'adj.', '寒冷的', 'It is cold today.', '品质与状态', '今天很冷。'),
      w('g2-33', 'season', '/ˈsiːzn/', 'n.', '季节', 'There are four seasons.', '认知与学术', '有四个季节。'),
    ]},
    { id: 'g2-u5', title: 'Unit 5 Clothes 衣服', words: [
      w('g2-34', 'shirt', '/ʃɜːt/', 'n.', '衬衫', 'I wear a shirt.', '认知与学术', '我穿一件衬衫。'),
      w('g2-35', 'T-shirt', '/ˈtiːʃɜːt/', 'n.', 'T恤衫', 'He wears a T-shirt.', '认知与学术', '他穿一件T恤。'),
      w('g2-36', 'skirt', '/skɜːt/', 'n.', '短裙', 'She likes the skirt.', '认知与学术', '她喜欢这条短裙。'),
      w('g2-37', 'dress', '/dres/', 'n.', '连衣裙', 'The dress is white.', '认知与学术', '这条连衣裙是白色的。'),
      w('g2-38', 'socks', '/sɒks/', 'n.', '短袜', 'I have white socks.', '认知与学术', '我有白色短袜。'),
      w('g2-39', 'shorts', '/ʃɔːts/', 'n.', '短裤', 'He wears shorts.', '认知与学术', '他穿短裤。'),
      w('g2-40', 'jacket', '/ˈdʒækɪt/', 'n.', '夹克衫', 'Put on your jacket.', '认知与学术', '穿上夹克。'),
    ]},
  ],
};

const GRADE2B_BOOK: VocabBook = {
  id: 'primary-g2b', name: '人教版小学英语·二年级下册', stage: '小学英语', builtin: true,
  desc: '人教版新起点·二年级下册真实教材词表（103 词，6 单元）', wordCount: 103,
  units: [
    { id: 'g2b-u1', title: 'Unit 1 Seasons 季节', words: [
      w('g2b-1', 'season', '/ˈsiːzn/', 'n.', '季节', 'There are four seasons in a year.', '认知与学术', '一年有四个季节。'),
      w('g2b-2', 'spring', '/sprɪŋ/', 'n.', '春天', 'Spring is green.', '社会与环境', '春天是绿色的。'),
      w('g2b-3', 'summer', '/ˈsʌmə/', 'n.', '夏天', 'Summer is hot.', '社会与环境', '夏天很热。'),
      w('g2b-4', 'fall', '/fɔːl/', 'n.', '秋天（美式）', 'Fall is golden.', '社会与环境', '秋天是金色的。'),
      w('g2b-5', 'winter', '/ˈwɪntə/', 'n.', '冬天', 'Winter is cold.', '社会与环境', '冬天很冷。'),
      w('g2b-6', 'bright', '/braɪt/', 'adj.', '明亮的', 'The sun is bright.', '品质与状态', '阳光很明亮。'),
      w('g2b-7', 'golden', '/ˈɡəʊldən/', 'adj.', '金色的', 'The leaves are golden.', '品质与状态', '叶子是金色的。'),
      w('g2b-8', 'plant', '/plɑːnt/', 'v.', '种植', 'We plant trees in spring.', '行为与动作', '我们春天种树。'),
      w('g2b-9', 'swim', '/swɪm/', 'v.', '游泳', 'I can swim in summer.', '行为与动作', '夏天我会游泳。'),
      w('g2b-10', 'climb', '/klaɪm/', 'v.', '攀登；爬', 'We climb hills in fall.', '行为与动作', '秋天我们爬山。'),
      w('g2b-11', 'make', '/meɪk/', 'v.', '做；制造', 'We make a snowman.', '行为与动作', '我们堆雪人。'),
      w('g2b-12', 'snowman', '/ˈsnəʊmæn/', 'n.', '雪人', 'The snowman is white.', '社会与环境', '雪人是白色的。'),
      w('g2b-13', 'fly', '/flaɪ/', 'v.', '放（风筝）；飞', 'We fly kites in spring.', '行为与动作', '春天我们放风筝。'),
      w('g2b-14', 'kite', '/kaɪt/', 'n.', '风筝', 'The kite is high.', '社会与环境', '风筝飞得很高。'),
      w('g2b-15', 'sleep', '/sliːp/', 'v.', '睡觉', 'Bears sleep in winter.', '行为与动作', '熊在冬天冬眠。'),
    ]},
    { id: 'g2b-u2', title: 'Unit 2 Weather 天气', words: [
      w('g2b-16', 'weather', '/ˈweðə/', 'n.', '天气', 'How is the weather?', '社会与环境', '天气怎么样？'),
      w('g2b-17', 'sunny', '/ˈsʌni/', 'adj.', '晴朗的', 'It is sunny today.', '社会与环境', '今天晴朗。'),
      w('g2b-18', 'cloudy', '/ˈklaʊdi/', 'adj.', '多云的', 'It is cloudy.', '社会与环境', '今天多云。'),
      w('g2b-19', 'rainy', '/ˈreɪni/', 'adj.', '下雨的', 'It is a rainy day.', '社会与环境', '今天是雨天。'),
      w('g2b-20', 'windy', '/ˈwɪndi/', 'adj.', '有风的', 'It is windy.', '社会与环境', '今天有风。'),
      w('g2b-21', 'snowy', '/ˈsnəʊi/', 'adj.', '下雪的', 'It is snowy.', '社会与环境', '今天下雪。'),
      w('g2b-22', 'cold', '/kəʊld/', 'adj.', '冷的', 'It is cold outside.', '品质与状态', '外面很冷。'),
      w('g2b-23', 'cool', '/kuːl/', 'adj.', '凉爽的', 'It is cool in fall.', '品质与状态', '秋天很凉爽。'),
      w('g2b-24', 'warm', '/wɔːm/', 'adj.', '温暖的', 'It is warm in spring.', '品质与状态', '春天很温暖。'),
      w('g2b-25', 'hot', '/hɒt/', 'adj.', '热的', 'It is hot in summer.', '品质与状态', '夏天很热。'),
      w('g2b-26', 'Harbin', '/hɑːˈbɪn/', 'n.', '哈尔滨', 'Harbin is cold in winter.', '社会与环境', '哈尔滨冬天很冷。'),
      w('g2b-27', 'Shenzhen', '/ˌʃenˈdʒen/', 'n.', '深圳', 'Shenzhen is warm.', '社会与环境', '深圳很温暖。'),
      w('g2b-28', 'Shanghai', '/ˌʃæŋˈhaɪ/', 'n.', '上海', 'I live in Shanghai.', '社会与环境', '我住在上海。'),
      w('g2b-29', 'day', '/deɪ/', 'n.', '天；日子', 'Have a nice day.', '认知与学术', '祝你今天愉快。'),
      w('g2b-30', 'scarf', '/skɑːf/', 'n.', '围巾', 'I wear a scarf.', '社会与环境', '我戴围巾。'),
      w('g2b-31', 'sunglasses', '/ˈsʌnɡlɑːsɪz/', 'n.', '太阳镜', 'I wear sunglasses.', '社会与环境', '我戴太阳镜。'),
      w('g2b-32', 'coat', '/kəʊt/', 'n.', '外套；大衣', 'Put on your coat.', '社会与环境', '穿上外套。'),
      w('g2b-33', 'like', '/laɪk/', 'prep.', '像；怎样', 'What is the weather like?', '行为与动作', '天气怎么样？'),
      w('g2b-34', 'today', '/təˈdeɪ/', 'adv.', '今天', 'Today is sunny.', '认知与学术', '今天晴朗。'),
      w('g2b-35', 'raincoat', '/ˈreɪnkəʊt/', 'n.', '雨衣', 'I have a raincoat.', '社会与环境', '我有一件雨衣。'),
      w('g2b-36', 'umbrella', '/ʌmˈbrelə/', 'n.', '雨伞', 'Take an umbrella.', '社会与环境', '带把伞。'),
    ]},
    { id: 'g2b-u3', title: 'Unit 3 Sports 运动', words: [
      w('g2b-37', 'PE', '/ˌpiː ˈiː/', 'n.', '体育', 'We have PE today.', '认知与学术', '我们今天有体育课。'),
      w('g2b-38', 'class', '/klɑːs/', 'n.', '课；班级', 'PE class is fun.', '认知与学术', '体育课很有趣。'),
      w('g2b-39', 'can', '/kæn/', 'modal.', '能；会', 'I can jump.', '行为与动作', '我会跳。'),
      w('g2b-40', 'throw', '/θrəʊ/', 'v.', '投；掷', 'Throw the ball.', '行为与动作', '扔球。'),
      w('g2b-41', 'jump', '/dʒʌmp/', 'v.', '跳', 'I can jump high.', '行为与动作', '我能跳得高。'),
      w('g2b-42', 'catch', '/kætʃ/', 'v.', '接住', 'Catch the ball.', '行为与动作', '接球。'),
      w('g2b-43', 'walk', '/wɔːk/', 'v.', '走', 'Walk like a duck.', '行为与动作', '像鸭子一样走。'),
      w('g2b-44', 'run', '/rʌn/', 'v.', '跑', 'Run fast.', '行为与动作', '快跑。'),
      w('g2b-45', 'kick', '/kɪk/', 'v.', '踢', 'Kick the ball.', '行为与动作', '踢球。'),
      w('g2b-46', 'bounce', '/baʊns/', 'v.', '拍（球）', 'Bounce the ball.', '行为与动作', '拍球。'),
      w('g2b-47', 'very well', '/ˈveri wel/', 'phrase.', '非常好', 'I can swim very well.', '品质与状态', '我游泳游得很好。'),
      w('g2b-48', 'play', '/pleɪ/', 'v.', '玩；打（球）', 'Let us play football.', '行为与动作', '我们踢足球吧。'),
      w('g2b-49', 'pingpong', '/ˈpɪŋpɒŋ/', 'n.', '乒乓球', 'We play pingpong.', '认知与学术', '我们打乒乓球。'),
      w('g2b-50', 'rope', '/rəʊp/', 'n.', '绳', 'I can jump rope.', '社会与环境', '我会跳绳。'),
      w('g2b-51', 'football', '/ˈfʊtbɔːl/', 'n.', '足球', 'He plays football.', '认知与学术', '他踢足球。'),
      w('g2b-52', 'swing', '/swɪŋ/', 'n.', '秋千', 'Play on the swing.', '社会与环境', '荡秋千。'),
      w('g2b-53', 'jungle gym', '/ˈdʒʌŋɡl dʒɪm/', 'n.', '格子爬梯', 'Climb the jungle gym.', '社会与环境', '爬格子架。'),
      w('g2b-54', 'seesaw', '/ˈsiːsɔː/', 'n.', '跷跷板', 'Play on the seesaw.', '社会与环境', '玩跷跷板。'),
      w('g2b-55', 'slide', '/slaɪd/', 'n.', '滑梯', 'Play on the slide.', '社会与环境', '滑滑梯。'),
      w('g2b-56', 'line up', '/laɪn ʌp/', 'phrase.', '排队', 'Line up, please.', '行为与动作', '请排队。'),
      w('g2b-57', 'at ease', '/ət iːz/', 'phrase.', '稍息', 'Stand at ease.', '行为与动作', '稍息。'),
      w('g2b-58', 'attention', '/əˈtenʃn/', 'n.', '立正', 'Attention!', '行为与动作', '立正！'),
      w('g2b-59', 'count off', '/kaʊnt ɒf/', 'phrase.', '报数', 'Count off, please.', '行为与动作', '请报数。'),
      w('g2b-60', 'turn left', '/tɜːn left/', 'phrase.', '向左转', 'Turn left.', '行为与动作', '向左转。'),
      w('g2b-61', 'turn right', '/tɜːn raɪt/', 'phrase.', '向右转', 'Turn right.', '行为与动作', '向右转。'),
    ]},
    { id: 'g2b-u4', title: 'Unit 4 Time 时间', words: [
      w('g2b-62', 'time', '/taɪm/', 'n.', '时间', 'What time is it?', '认知与学术', '几点了？'),
      w('g2b-63', 'breakfast', '/ˈbrekfəst/', 'n.', '早餐', 'I have breakfast at seven.', '行为与动作', '我七点吃早餐。'),
      w('g2b-64', 'lunch', '/lʌntʃ/', 'n.', '午餐', 'I have lunch at twelve.', '行为与动作', '我十二点吃午餐。'),
      w('g2b-65', 'supper', '/ˈsʌpə/', 'n.', '晚餐', 'I have supper at six.', '行为与动作', '我六点吃晚餐。'),
      w('g2b-66', 'minute', '/ˈmɪnɪt/', 'n.', '分钟', 'Wait a minute.', '认知与学术', '等一分钟。'),
      w('g2b-67', 'plus', '/plʌs/', 'prep.', '加上', 'Two plus three is five.', '认知与学术', '二加三等于五。'),
      w('g2b-68', 'half', '/hɑːf/', 'n.', '一半', 'It is half past six.', '认知与学术', '现在六点半。'),
      w('g2b-69', 'hour', '/ˈaʊə/', 'n.', '小时', 'One hour is sixty minutes.', '认知与学术', '一小时是六十分钟。'),
      w('g2b-70', 'thirty', '/ˈθɜːti/', 'num.', '三十', 'It is seven thirty.', '认知与学术', '现在七点半。'),
      w('g2b-71', 'forty', '/ˈfɔːti/', 'num.', '四十', 'There are forty students.', '认知与学术', '有四十个学生。'),
      w('g2b-72', 'fifty', '/ˈfɪfti/', 'num.', '五十', 'I have fifty books.', '认知与学术', '我有五十本书。'),
      w('g2b-73', 'sixty', '/ˈsɪksti/', 'num.', '六十', 'Sixty minutes is an hour.', '认知与学术', '六十分钟是一小时。'),
      w('g2b-74', 'second', '/ˈsekənd/', 'n.', '秒', 'One minute has sixty seconds.', '认知与学术', '一分钟有六十秒。'),
    ]},
    { id: 'g2b-u5', title: 'Unit 5 My Day 我的一天', words: [
      w('g2b-75', 'get up', '/ɡet ʌp/', 'phrase.', '起床', 'I get up at seven.', '行为与动作', '我七点起床。'),
      w('g2b-76', 'wash', '/wɒʃ/', 'v.', '洗', 'I wash my face.', '行为与动作', '我洗脸。'),
      w('g2b-77', 'brush', '/brʌʃ/', 'v.', '刷', 'I brush my teeth.', '行为与动作', '我刷牙。'),
      w('g2b-78', 'teeth', '/tiːθ/', 'n.', '牙齿（tooth 的复数）', 'I clean my teeth.', '行为与动作', '我清洁牙齿。'),
      w('g2b-79', 'watch', '/wɒtʃ/', 'v.', '看', 'I watch TV.', '行为与动作', '我看电视。'),
      w('g2b-80', 'go to bed', '/ɡəʊ tə bed/', 'phrase.', '上床睡觉', 'I go to bed at nine.', '行为与动作', '我九点睡觉。'),
      w('g2b-81', 'when', '/wen/', 'adv.', '什么时候', 'When do you get up?', '认知与学术', '你什么时候起床？'),
      w('g2b-82', 'every day', '/ˈevri deɪ/', 'phrase.', '每天', 'I read every day.', '认知与学术', '我每天读书。'),
      w('g2b-83', 'at', '/æt/', 'prep.', '在（某时间点）', 'I get up at seven.', '行为与动作', '我七点起床。'),
    ]},
    { id: 'g2b-u6', title: 'Unit 6 My Week 我的一周', words: [
      w('g2b-84', 'week', '/wiːk/', 'n.', '星期；周', 'There are seven days in a week.', '认知与学术', '一周有七天。'),
      w('g2b-85', 'Monday', '/ˈmʌndeɪ/', 'n.', '星期一', 'Today is Monday.', '认知与学术', '今天是星期一。'),
      w('g2b-86', 'Tuesday', '/ˈtjuːzdeɪ/', 'n.', '星期二', 'Tuesday comes after Monday.', '认知与学术', '星期二在星期一之后。'),
      w('g2b-87', 'Wednesday', '/ˈwenzdeɪ/', 'n.', '星期三', 'We have music on Wednesday.', '认知与学术', '我们星期三有音乐课。'),
      w('g2b-88', 'Thursday', '/ˈθɜːzdeɪ/', 'n.', '星期四', 'Thursday is a weekday.', '认知与学术', '星期四是工作日。'),
      w('g2b-89', 'Friday', '/ˈfraɪdeɪ/', 'n.', '星期五', 'Friday is my favourite day.', '认知与学术', '星期五是我最喜欢的一天。'),
      w('g2b-90', 'Saturday', '/ˈsætədeɪ/', 'n.', '星期六', 'We play on Saturday.', '认知与学术', '我们星期六玩。'),
      w('g2b-91', 'Sunday', '/ˈsʌndeɪ/', 'n.', '星期日', 'Sunday is a weekend day.', '认知与学术', '星期日是周末。'),
      w('g2b-92', 'Weekday', '/ˈwiːkdeɪ/', 'n.', '工作日', 'I go to school on weekdays.', '认知与学术', '我工作日上学。'),
      w('g2b-93', 'weekend', '/ˌwiːkˈend/', 'n.', '周末', 'I have fun on the weekend.', '认知与学术', '我周末玩得开心。'),
      w('g2b-94', 'want', '/wɒnt/', 'v.', '想；想要', 'I want a new book.', '行为与动作', '我想要一本新书。'),
      w('g2b-95', 'Chinese', '/ˌtʃaɪˈniːz/', 'n.', '语文；中文', 'We have Chinese on Monday.', '认知与学术', '我们星期一有语文课。'),
      w('g2b-96', 'music', '/ˈmjuːzɪk/', 'n.', '音乐', 'I like music class.', '认知与学术', '我喜欢音乐课。'),
      w('g2b-97', 'math', '/mæθ/', 'n.', '数学', 'Math is fun.', '认知与学术', '数学很有趣。'),
      w('g2b-98', 'art', '/ɑːt/', 'n.', '美术', 'I like art.', '认知与学术', '我喜欢美术。'),
      w('g2b-99', 'on', '/ɒn/', 'prep.', '在（某天）', 'We have PE on Friday.', '行为与动作', '我们星期五有体育课。'),
      w('g2b-100', 'am', '/ˌeɪ ˈem/', 'abbr.', '上午', 'I get up at 7 am.', '认知与学术', '我早上七点起床。'),
      w('g2b-101', 'pm', '/ˌpiː ˈem/', 'abbr.', '下午', 'I go to bed at 9 pm.', '认知与学术', '我晚上九点睡觉。'),
      w('g2b-102', 'year', '/jɪə/', 'n.', '年', 'There are twelve months in a year.', '认知与学术', '一年有十二个月。'),
      w('g2b-103', 'month', '/mʌnθ/', 'n.', '月', 'This month is October.', '认知与学术', '这个月是十月。'),
    ]},
  ],
};

const GRADE4_BOOK: VocabBook = {
  id: 'primary-g4', name: '人教版小学英语·四年级上册', stage: '小学英语', builtin: true,
  desc: '人教PEP(2024新版)·四年级上册真实教材词表', wordCount: 46,
  units: [
    { id: 'g4-u1', title: 'Unit 1 My classroom 我的教室', words: [
      w('g4-1', 'classroom', '/ˈklɑːsruːm/', 'n.', '教室', 'Our classroom is clean.', '社会与环境', '我们的教室很干净。'),
      w('g4-2', 'window', '/ˈwɪndəʊ/', 'n.', '窗户', 'Open the window.', '认知与学术', '打开窗户。'),
      w('g4-3', 'blackboard', '/ˈblækbɔːd/', 'n.', '黑板', 'The blackboard is black.', '认知与学术', '黑板是黑色的。'),
      w('g4-4', 'light', '/laɪt/', 'n.', '电灯', 'Turn on the light.', '认知与学术', '开灯。'),
      w('g4-5', 'picture', '/ˈpɪktʃə/', 'n.', '图画', 'The picture is beautiful.', '认知与学术', '这幅图画很漂亮。'),
      w('g4-6', 'door', '/dɔː/', 'n.', '门', 'Close the door.', '认知与学术', '关上门。'),
      w('g4-7', 'computer', '/kəmˈpjuːtə/', 'n.', '计算机', 'The computer is new.', '认知与学术', '这台电脑是新的。'),
      w('g4-8', 'wall', '/wɔːl/', 'n.', '墙壁', 'The wall is white.', '社会与环境', '墙是白色的。'),
      w('g4-9', 'floor', '/flɔː/', 'n.', '地板', 'Sweep the floor.', '行为与动作', '扫地。'),
      w('g4-10', 'schoolbag', '/ˈskuːlbæɡ/', 'n.', '书包', 'My schoolbag is heavy.', '认知与学术', '我的书包很重。'),
      w('g4-11', 'notebook', '/ˈnəʊtbʊk/', 'n.', '笔记本', 'Write in the notebook.', '认知与学术', '在笔记本里写。'),
      w('g4-12', 'storybook', '/ˈstɔːribʊk/', 'n.', '故事书', 'I read a storybook.', '认知与学术', '我读一本故事书。'),
      w('g4-13', 'candy', '/ˈkændi/', 'n.', '糖果', 'The candy is sweet.', '认知与学术', '糖果很甜。'),
      w('g4-14', 'toy', '/tɔɪ/', 'n.', '玩具', 'He plays with a toy.', '认知与学术', '他玩玩具。'),
    ]},
    { id: 'g4-u2', title: 'Unit 2 Friends 我的朋友', words: [
      w('g4-15', 'strong', '/strɒŋ/', 'adj.', '强壮的', 'He is very strong.', '品质与状态', '他很强壮。'),
      w('g4-16', 'friendly', '/ˈfrendli/', 'adj.', '友好的', 'She is friendly.', '品质与状态', '她很友好。'),
      w('g4-17', 'quiet', '/ˈkwaɪət/', 'adj.', '安静的', 'Be quiet, please.', '品质与状态', '请安静。'),
      w('g4-18', 'glasses', '/ˈɡlɑːsɪz/', 'n.', '眼镜', 'He wears glasses.', '认知与学术', '他戴眼镜。'),
      w('g4-19', 'hair', '/heə/', 'n.', '头发', 'Her hair is long.', '认知与学术', '她的头发很长。'),
      w('g4-20', 'shoe', '/ʃuː/', 'n.', '鞋', 'My shoe is black.', '认知与学术', '我的鞋是黑色的。'),
      w('g4-21', 'tall', '/tɔːl/', 'adj.', '高的', 'He is tall and thin.', '品质与状态', '他又高又瘦。'),
      w('g4-22', 'thin', '/θɪn/', 'adj.', '瘦的', 'She is thin.', '品质与状态', '她很瘦。'),
    ]},
    { id: 'g4-u3', title: 'Unit 3 Food 食物', words: [
      w('g4-23', 'rice', '/raɪs/', 'n.', '米饭', 'I eat rice every day.', '认知与学术', '我每天吃米饭。'),
      w('g4-24', 'fish', '/fɪʃ/', 'n.', '鱼', 'The fish is delicious.', '认知与学术', '鱼很美味。'),
      w('g4-25', 'noodles', '/ˈnuːdlz/', 'n.', '面条', 'I like noodles.', '认知与学术', '我喜欢面条。'),
      w('g4-26', 'beef', '/biːf/', 'n.', '牛肉', 'Beef is healthy.', '认知与学术', '牛肉很健康。'),
      w('g4-27', 'vegetable', '/ˈvedʒtəbl/', 'n.', '蔬菜', 'Eat more vegetables.', '认知与学术', '多吃蔬菜。'),
      w('g4-28', 'soup', '/suːp/', 'n.', '汤', 'The soup is hot.', '认知与学术', '汤很烫。'),
      w('g4-29', 'chopsticks', '/ˈtʃɒpstɪks/', 'n.', '筷子', 'We use chopsticks.', '认知与学术', '我们用筷子。'),
      w('g4-30', 'bowl', '/bəʊl/', 'n.', '碗', 'Pass me the bowl.', '认知与学术', '把碗递给我。'),
      w('g4-31', 'fork', '/fɔːk/', 'n.', '叉子', 'Use the fork.', '认知与学术', '用叉子。'),
      w('g4-32', 'knife', '/naɪf/', 'n.', '刀', 'The knife is sharp.', '认知与学术', '刀很锋利。'),
      w('g4-33', 'dinner', '/ˈdɪnə/', 'n.', '晚餐', 'We have dinner at home.', '认知与学术', '我们在家吃晚饭。'),
    ]},
    { id: 'g4-u4', title: 'Unit 4 Family & Jobs 家庭与职业', words: [
      w('g4-34', 'family', '/ˈfæməli/', 'n.', '家庭', 'I love my family.', '社会与环境', '我爱我的家庭。'),
      w('g4-35', 'parents', '/ˈpeərənts/', 'n.', '父母', 'My parents are kind.', '社会与环境', '我父母很和蔼。'),
      w('g4-36', 'uncle', '/ˈʌŋkl/', 'n.', '叔叔；舅舅', 'My uncle is a doctor.', '社会与环境', '我叔叔是医生。'),
      w('g4-37', 'aunt', '/ɑːnt/', 'n.', '姑姑；阿姨', 'My aunt is a nurse.', '社会与环境', '我姑姑是护士。'),
      w('g4-38', 'baby', '/ˈbeɪbi/', 'n.', '婴儿', 'The baby is crying.', '社会与环境', '婴儿在哭。'),
      w('g4-39', 'doctor', '/ˈdɒktə/', 'n.', '医生', 'The doctor helps people.', '社会与环境', '医生帮助人们。'),
      w('g4-40', 'farmer', '/ˈfɑːmə/', 'n.', '农民', 'The farmer grows rice.', '社会与环境', '农民种水稻。'),
      w('g4-41', 'nurse', '/nɜːs/', 'n.', '护士', 'The nurse is busy.', '社会与环境', '护士很忙。'),
      w('g4-42', 'worker', '/ˈwɜːkə/', 'n.', '工人', 'He is a worker.', '社会与环境', '他是一名工人。'),
      w('g4-43', 'driver', '/ˈdraɪvə/', 'n.', '司机', 'The driver drives a bus.', '社会与环境', '司机开公交车。'),
      w('g4-44', 'cook', '/kʊk/', 'n./v.', '厨师；烹饪', 'The cook makes food.', '社会与环境', '厨师做饭。'),
    ]},
    { id: 'g4-u5', title: 'Unit 5 Helping at home 家务劳动', words: [
      w('g4-45', 'busy', '/ˈbɪzi/', 'adj.', '忙碌的', 'My mother is busy.', '品质与状态', '我妈妈很忙。'),
      w('g4-46', 'clean', '/kliːn/', 'adj./v.', '干净的；打扫', 'We clean the room.', '行为与动作', '我们打扫房间。'),
    ]},
  ],
};

const GRADE4B_BOOK: VocabBook = {
  id: 'primary-g4b', name: '人教PEP小学英语·四年级下册（2026新版）', stage: '小学英语', builtin: true,
  desc: '人教PEP新版四年级下册，按教材页码分 6 个真实单元导入（112 词）', wordCount: 112,
  units: [
    { id: 'g4b-u1', title: 'Unit 1 Class rules 班级规则', words: [
      w('g4b-1', 'sorry', '/ˈsɒri/', 'adj.', '对不起', 'Sorry, I am late.', '情感与性格', '对不起，我迟到了。'),
      w('g4b-2', 'late', '/leɪt/', 'adj.', '迟到的', 'I am late for class.', '品质与状态', '我上课迟到了。'),
      w('g4b-3', 'class', '/klɑːs/', 'n.', '课；班级', 'Class begins at eight.', '认知与学术', '八点开始上课。'),
      w('g4b-4', 'hurry up', '/ˈhʌri ʌp/', 'phrase.', '快点', 'Hurry up, please.', '行为与动作', '请快点。'),
      w('g4b-5', 'ready', '/ˈredi/', 'adj.', '准备好的', 'I am ready.', '品质与状态', '我准备好了。'),
      w('g4b-6', 'rule', '/ruːl/', 'n.', '规则', 'We follow the rules.', '社会与环境', '我们遵守规则。'),
      w('g4b-7', 'classroom', '/ˈklɑːsruːm/', 'n.', '教室', 'Our classroom is tidy.', '社会与环境', '我们的教室很整洁。'),
      w('g4b-8', 'turn off', '/tɜːn ɒf/', 'phrase.', '关掉', 'Turn off the light.', '行为与动作', '关灯。'),
      w('g4b-9', 'light', '/laɪt/', 'n.', '灯；光', 'The light is on.', '社会与环境', '灯亮着。'),
      w('g4b-10', 'blackboard', '/ˈblækbɔːd/', 'n.', '黑板', 'Look at the blackboard.', '社会与环境', '看黑板。'),
      w('g4b-11', 'desk', '/desk/', 'n.', '书桌', 'My desk is clean.', '社会与环境', '我的书桌很干净。'),
      w('g4b-12', 'chair', '/tʃeə(r)/', 'n.', '椅子', 'Sit on the chair.', '社会与环境', '坐在椅子上。'),
      w('g4b-13', 'tidy', '/ˈtaɪdi/', 'adj./v.', '整洁的；整理', 'Tidy your desk.', '品质与状态', '整理你的书桌。'),
      w('g4b-14', 'music', '/ˈmjuːzɪk/', 'n.', '音乐', 'I like music.', '认知与学术', '我喜欢音乐。'),
      w('g4b-15', 'wall', '/wɔːl/', 'n.', '墙', 'The wall is white.', '社会与环境', '墙是白色的。'),
      w('g4b-16', 'door', '/dɔː(r)/', 'n.', '门', 'Close the door.', '社会与环境', '关上门。'),
      w('g4b-17', 'window', '/ˈwɪndəʊ/', 'n.', '窗', 'Open the window.', '社会与环境', '打开窗户。'),
      w('g4b-18', 'fan', '/fæn/', 'n.', '风扇', 'The fan is on.', '社会与环境', '风扇开着。'),
      w('g4b-19', 'when', '/wen/', 'adv.', '当……时', 'When do you read?', '认知与学术', '你什么时候读书？'),
      w('g4b-20', 'understand', '/ˌʌndəˈstænd/', 'v.', '理解', 'I understand the rule.', '行为与动作', '我理解这条规则。'),
      w('g4b-21', 'newspaper', '/ˈnjuːzpeɪpə(r)/', 'n.', '报纸', 'Hand out the newspapers.', '社会与环境', '分发报纸。'),
      w('g4b-22', 'hand out', '/hænd aʊt/', 'phrase.', '分发', 'Hand out the books.', '行为与动作', '分发书本。'),
      w('g4b-23', 'workbook', '/ˈwɜːkbʊk/', 'n.', '练习册', 'Open your workbook.', '社会与环境', '打开练习册。'),
    ]},
    { id: 'g4b-u2', title: 'Unit 2 Safety at home 居家安全', words: [
      w('g4b-24', 'watch', '/wɒtʃ/', 'v.', '看', 'Watch your step.', '行为与动作', '注意脚下。'),
      w('g4b-25', 'TV', '/ˌtiː ˈviː/', 'n.', '电视', 'I watch TV after dinner.', '社会与环境', '我晚饭后看电视。'),
      w('g4b-26', 'homework', '/ˈhəʊmwɜːk/', 'n.', '家庭作业', 'I do my homework first.', '认知与学术', '我先做作业。'),
      w('g4b-27', 'first', '/fɜːst/', 'adv.', '首先', 'Wash your hands first.', '行为与动作', '先洗手。'),
      w('g4b-28', 'wet', '/wet/', 'adj.', '湿的', 'The floor is wet.', '品质与状态', '地板是湿的。'),
      w('g4b-29', 'run', '/rʌn/', 'v.', '跑', 'Do not run in the house.', '行为与动作', '不要在屋里跑。'),
      w('g4b-30', 'house', '/haʊs/', 'n.', '房子', 'Our house is safe.', '社会与环境', '我们的房子很安全。'),
      w('g4b-31', 'safe', '/seɪf/', 'adj.', '安全的', 'Stay safe at home.', '品质与状态', '在家注意安全。'),
      w('g4b-32', 'word', '/wɜːd/', 'n.', '单词', 'Read every word.', '认知与学术', '读每个单词。'),
      w('g4b-33', 'wash', '/wɒʃ/', 'v.', '洗', 'Wash the dishes.', '行为与动作', '洗碗。'),
      w('g4b-34', 'helpful', '/ˈhelpfl/', 'adj.', '有帮助的', 'She is helpful at home.', '品质与状态', '她在家很能干。'),
      w('g4b-35', 'loud', '/laʊd/', 'adj.', '吵闹的', 'Do not be loud.', '品质与状态', '不要大声喧哗。'),
      w('g4b-36', 'sleep', '/sliːp/', 'v.', '睡觉', 'The baby sleeps.', '行为与动作', '宝宝在睡觉。'),
      w('g4b-37', 'bedroom', '/ˈbedruːm/', 'n.', '卧室', 'This is my bedroom.', '社会与环境', '这是我的卧室。'),
      w('g4b-38', 'kitchen', '/ˈkɪtʃɪn/', 'n.', '厨房', 'Mum is in the kitchen.', '社会与环境', '妈妈在厨房。'),
      w('g4b-39', 'living room', '/ˈlɪvɪŋ ruːm/', 'n.', '客厅', 'We sit in the living room.', '社会与环境', '我们坐在客厅。'),
      w('g4b-40', 'study', '/ˈstʌdi/', 'n.', '书房', 'Dad reads in the study.', '社会与环境', '爸爸在书房看书。'),
      w('g4b-41', 'bathroom', '/ˈbɑːθruːm/', 'n.', '浴室', 'The bathroom is clean.', '社会与环境', '浴室很干净。'),
      w('g4b-42', 'work', '/wɜːk/', 'v.', '工作', 'Mum works hard.', '行为与动作', '妈妈工作很努力。'),
      w('g4b-43', 'think', '/θɪŋk/', 'v.', '想；思考', 'Think before you act.', '行为与动作', '三思而后行。'),
      w('g4b-44', 'hard', '/hɑːd/', 'adv.', '努力地', 'He studies hard.', '行为与动作', '他学习很努力。'),
      w('g4b-45', 'follow', '/ˈfɒləʊ/', 'v.', '遵循', 'Follow me, please.', '行为与动作', '请跟我来。'),
      w('g4b-46', 'feel', '/fiːl/', 'v.', '觉得', 'I feel safe at home.', '情感与性格', '在家我觉得安全。'),
    ]},
    { id: 'g4b-u3', title: 'Unit 3 My day 我的一天', words: [
      w('g4b-47', 'over', '/ˈəʊvə(r)/', 'adj.', '结束的', 'School is over.', '品质与状态', '放学了。'),
      w('g4b-48', 'kid', '/kɪd/', 'n.', '小孩', 'The kids go home.', '社会与环境', '孩子们回家。'),
      w('g4b-49', 'dinner', '/ˈdɪnə(r)/', 'n.', '正餐', 'We have dinner at six.', '行为与动作', '我们六点吃晚饭。'),
      w('g4b-50', 'art', '/ɑːt/', 'n.', '美术', 'We have art today.', '认知与学术', '我们今天有美术课。'),
      w('g4b-51', 'lunch', '/lʌntʃ/', 'n.', '午餐', 'Lunch is ready.', '行为与动作', '午饭好了。'),
      w('g4b-52', 'maths', '/mæθs/', 'n.', '数学', 'I like maths.', '认知与学术', '我喜欢数学。'),
      w('g4b-53', 'get up', '/ɡet ʌp/', 'phrase.', '起床', 'I get up at seven.', '行为与动作', '我七点起床。'),
      w('g4b-54', 'go to school', '/ɡəʊ tə skuːl/', 'phrase.', '上学', 'I go to school by bus.', '行为与动作', '我坐公交上学。'),
      w('g4b-55', 'go home', '/ɡəʊ həʊm/', 'phrase.', '回家', 'I go home at four.', '行为与动作', '我四点回家。'),
      w('g4b-56', 'go to bed', '/ɡəʊ tə bed/', 'phrase.', '上床睡觉', 'I go to bed at nine.', '行为与动作', '我九点睡觉。'),
      w('g4b-57', 'clock', '/klɒk/', 'n.', '时钟', 'The clock is on the wall.', '社会与环境', '钟在墙上。'),
      w('g4b-58', 'minute', '/ˈmɪnɪt/', 'n.', '分钟', 'Wait one minute.', '认知与学术', '等一分钟。'),
      w('g4b-59', 'want', '/wɒnt/', 'v.', '想要', 'I want some water.', '行为与动作', '我想要点水。'),
      w('g4b-60', 'just', '/dʒʌst/', 'adv.', '只是', 'Just a minute.', '认知与学术', '稍等一下。'),
    ]},
    { id: 'g4b-u4', title: 'Unit 4 Shopping 购物', words: [
      w('g4b-61', 'clothes', '/kləʊðz/', 'n.', '衣服', 'I buy new clothes.', '社会与环境', '我买新衣服。'),
      w('g4b-62', 'pair', '/peə(r)/', 'n.', '一条；一副', 'A pair of shoes.', '社会与环境', '一双鞋。'),
      w('g4b-63', 'those', '/ðəʊz/', 'pron.', '那些', 'Those shoes are nice.', '认知与学术', '那些鞋很漂亮。'),
      w('g4b-64', 'trousers', '/ˈtraʊzəz/', 'n.', '裤子', 'These trousers are long.', '社会与环境', '这条裤子很长。'),
      w('g4b-65', 'shorts', '/ʃɔːts/', 'n.', '短裤', 'The shorts are cheap.', '社会与环境', '这条短裤很便宜。'),
      w('g4b-66', 'skirt', '/skɜːt/', 'n.', '裙子', 'The skirt is beautiful.', '社会与环境', '这条裙子很漂亮。'),
      w('g4b-67', 'jacket', '/ˈdʒækɪt/', 'n.', '夹克', 'This jacket is large.', '社会与环境', '这件夹克是大号的。'),
      w('g4b-68', 'shoe', '/ʃuː/', 'n.', '鞋', 'My shoes are new.', '社会与环境', '我的鞋是新的。'),
      w('g4b-69', 'hat', '/hæt/', 'n.', '帽子', 'Try on this hat.', '社会与环境', '试试这顶帽子。'),
      w('g4b-70', 'beautiful', '/ˈbjuːtɪfl/', 'adj.', '美丽的', 'The hat is beautiful.', '品质与状态', '这顶帽子很漂亮。'),
      w('g4b-71', 'sunglasses', '/ˈsʌnɡlɑːsɪz/', 'n.', '太阳镜', 'The sunglasses are cool.', '社会与环境', '这副太阳镜很酷。'),
      w('g4b-72', 'dear', '/dɪə(r)/', 'adj.', '亲爱的', 'My dear friend.', '情感与性格', '我亲爱的朋友。'),
      w('g4b-73', 'expensive', '/ɪkˈspensɪv/', 'adj.', '昂贵的', 'This jacket is expensive.', '品质与状态', '这件夹克很贵。'),
      w('g4b-74', 'take', '/teɪk/', 'v.', '买下', 'I will take it.', '行为与动作', '我买下了。'),
      w('g4b-75', 'cheap', '/tʃiːp/', 'adj.', '便宜的', 'It is cheap.', '品质与状态', '它很便宜。'),
      w('g4b-76', 'any', '/ˈeni/', 'adj.', '任何的', 'Do you have any hats?', '认知与学术', '你有帽子吗？'),
      w('g4b-77', 'large', '/lɑːdʒ/', 'adj.', '大型号的', 'Do you have a large size?', '品质与状态', '你有大号的吗？'),
      w('g4b-78', 'list', '/lɪst/', 'n.', '清单', 'Here is the list.', '认知与学术', '这是清单。'),
      w('g4b-79', 'try on', '/traɪ ɒn/', 'phrase.', '试穿', 'Try on the shoes.', '行为与动作', '试穿鞋子。'),
      w('g4b-80', 'size', '/saɪz/', 'n.', '尺码', 'What size do you wear?', '认知与学术', '你穿多大号？'),
      w('g4b-81', 'free', '/friː/', 'adj.', '免费的', 'The gift is free.', '品质与状态', '礼物是免费的。'),
    ]},
    { id: 'g4b-u5', title: 'Unit 5 Farms and us 农场与我们', words: [
      w('g4b-82', 'horse', '/hɔːs/', 'n.', '马', 'The horse runs fast.', '社会与环境', '马跑得很快。'),
      w('g4b-83', 'cow', '/kaʊ/', 'n.', '奶牛', 'The cow is black and white.', '社会与环境', '奶牛是黑白花色的。'),
      w('g4b-84', 'sheep', '/ʃiːp/', 'n.', '绵羊', 'The sheep is white.', '社会与环境', '绵羊是白色的。'),
      w('g4b-85', 'pig', '/pɪɡ/', 'n.', '猪', 'The pig is fat.', '社会与环境', '猪很肥。'),
      w('g4b-86', 'chicken', '/ˈtʃɪkɪn/', 'n.', '鸡；鸡肉', 'The chicken is small.', '社会与环境', '鸡很小。'),
      w('g4b-87', 'tomato', '/təˈmɑːtəʊ/', 'n.', '西红柿', 'I pick a tomato.', '社会与环境', '我摘了一个西红柿。'),
      w('g4b-88', 'bee', '/biː/', 'n.', '蜜蜂', 'A bee is on the flower.', '社会与环境', '花上有一只蜜蜂。'),
      w('g4b-89', 'mouse', '/maʊs/', 'n.', '老鼠', 'The mouse is small.', '社会与环境', '老鼠很小。'),
      w('g4b-90', 'carrot', '/ˈkærət/', 'n.', '胡萝卜', 'The rabbit eats a carrot.', '社会与环境', '兔子吃胡萝卜。'),
      w('g4b-91', 'potato', '/pəˈteɪtəʊ/', 'n.', '土豆', 'I dig up a potato.', '社会与环境', '我挖出一个土豆。'),
      w('g4b-92', 'green bean', '/ɡriːn biːn/', 'n.', '四季豆', 'Green beans are long.', '社会与环境', '四季豆很长。'),
      w('g4b-93', 'can', '/kæn/', 'n.', '金属罐', 'A can of milk.', '社会与环境', '一罐牛奶。'),
      w('g4b-94', 'a box of', '/ə bɒks ɒv/', 'phrase.', '一盒', 'A box of carrots.', '社会与环境', '一盒胡萝卜。'),
    ]},
    { id: 'g4b-u6', title: 'Unit 6 At the table 在餐桌旁', words: [
      w('g4b-95', 'pass', '/pɑːs/', 'v.', '递', 'Pass me the spoon.', '行为与动作', '把勺子递给我。'),
      w('g4b-96', 'feed', '/fiːd/', 'v.', '饲养；喂', 'Feed the sheep.', '行为与动作', '喂羊。'),
      w('g4b-97', 'pick', '/pɪk/', 'v.', '摘', 'Pick the tomatoes.', '行为与动作', '摘西红柿。'),
      w('g4b-98', 'milk', '/mɪlk/', 'v.', '挤奶', 'Milk the cow.', '行为与动作', '挤牛奶。'),
      w('g4b-99', 'fork', '/fɔːk/', 'n.', '餐叉', 'Use the fork.', '社会与环境', '用餐叉。'),
      w('g4b-100', 'knife', '/naɪf/', 'n.', '刀', 'Use the knife.', '社会与环境', '用餐刀。'),
      w('g4b-101', 'chopstick', '/ˈtʃɒpstɪk/', 'n.', '筷子', 'I use chopsticks.', '社会与环境', '我用筷子。'),
      w('g4b-102', 'clear the table', '/klɪə ðə ˈteɪbl/', 'phrase.', '收拾餐桌', 'Let us clear the table.', '行为与动作', '我们收拾餐桌吧。'),
      w('g4b-103', 'food', '/fuːd/', 'n.', '食物', 'The food is ready.', '社会与环境', '食物好了。'),
      w('g4b-104', 'waste', '/weɪst/', 'v.', '浪费', 'Do not waste food.', '行为与动作', '不要浪费食物。'),
      w('g4b-105', 'delicious', '/dɪˈlɪʃəs/', 'adj.', '美味的', 'The soup is delicious.', '品质与状态', '汤很美味。'),
      w('g4b-106', 'set the table', '/set ðə ˈteɪbl/', 'phrase.', '摆放餐具', 'Set the table, please.', '行为与动作', '请摆好餐具。'),
      w('g4b-107', 'spoon', '/spuːn/', 'n.', '勺', 'Eat with a spoon.', '社会与环境', '用勺子吃。'),
      w('g4b-108', 'bowl', '/bəʊl/', 'n.', '碗', 'The bowl is big.', '社会与环境', '碗很大。'),
      w('g4b-109', 'herself', '/hɜːˈself/', 'pron.', '她自己', 'She makes it herself.', '认知与学术', '她自己做的。'),
      w('g4b-110', 'salad', '/ˈsæləd/', 'n.', '沙拉', 'The salad is fresh.', '社会与环境', '沙拉很新鲜。'),
      w('g4b-111', 'supermarket', '/ˈsuːpəmɑːkɪt/', 'n.', '超市', 'We buy food at the supermarket.', '社会与环境', '我们在超市买食物。'),
      w('g4b-112', 'week', '/wiːk/', 'n.', '周', 'See you next week.', '认知与学术', '下周见。'),
    ]},
  ],
};

const GRADE5_BOOK: VocabBook = {
  id: 'primary-g5', name: '人教PEP小学英语·五年级上册（2025新版）', stage: '小学英语', builtin: true,
  desc: '人教PEP 2025新版五年级上册，按 6 个真实单元导入（118 词，含课标二级词）', wordCount: 118,
  units: [
    {
      id: 'g5-u1', title: 'Unit 1 · What\u2019s he like?', words: [
        w('g5-u1-1', 'team', '/tiːm/', 'n.', '（游戏或运动的）队；（一起工作的）组，班', 'Our team won the game.', '社会与环境', '我们队赢了比赛。'),
        w('g5-u1-2', 'player', '/ˈpleɪə(r)/', 'n.', '运动员；参赛选手', 'He is a good player.', '社会与环境', '他是一个好运动员。'),
        w('g5-u1-3', 'him', '/hɪm/', 'pron.', '他', 'I like him.', '社会与环境', '我喜欢他。'),
        w('g5-u1-4', 'lovely', '/ˈlʌvli/', 'adj.', '美丽的；优美的', 'What a lovely cat!', '品质与状态', '多么可爱的小猫！'),
        w('g5-u1-5', 'clever', '/ˈklevə(r)/', 'adj.', '聪明的；聪颖的', 'She is clever.', '品质与状态', '她很聪明。'),
        w('g5-u1-6', 'young', '/jʌŋ/', 'adj.', '幼小的；年轻的', 'He is young.', '品质与状态', '他很年轻。'),
        w('g5-u1-7', 'hard-working', '/ˌhɑːd ˈwɜːkɪŋ/', 'adj.', '工作努力的；辛勤的', 'My brother is hard-working.', '品质与状态', '我哥哥很勤奋。'),
        w('g5-u1-8', 'science', '/ˈsaɪəns/', 'n.', '科学；自然科学', 'We have science today.', '认知与学术', '我们今天有科学课。'),
        w('g5-u1-9', 'robot', '/ˈrəʊbɒt/', 'n.', '机器人', 'I can make a robot.', '社会与环境', '我会做机器人。'),
        w('g5-u1-10', 'jump', '/dʒʌmp/', 'v.', '跳；跃', 'The rabbit can jump.', '行为与动作', '兔子会跳。'),
        w('g5-u1-11', 'rope', '/rəʊp/', 'n.', '绳；粗绳', 'This is a long rope.', '社会与环境', '这是一根长绳。'),
        w('g5-u1-12', 'piano', '/piˈænəʊ/', 'n.', '钢琴', 'She plays the piano.', '认知与学术', '她弹钢琴。'),
        w('g5-u1-13', 'chess', '/tʃes/', 'n.', '国际象棋', 'We play chess at home.', '认知与学术', '我们在家下棋。'),
        w('g5-u1-14', 'front', '/frʌnt/', 'n.', '前部', 'He sits in front of me.', '社会与环境', '他坐在我前面。'),
        w('g5-u1-15', 'easy', '/ˈiːzi/', 'adj.', '容易的；轻易的', 'This question is easy.', '品质与状态', '这道题很简单。'),
        w('g5-u1-16', 'star', '/stɑː/', 'n.', '歌唱（或表演）明星', 'He is a football star.', '社会与环境', '他是足球明星。'),
        w('g5-u1-17', 'wonderful', '/ˈwʌndəfl/', 'adj.', '精彩的；绝妙的', 'The show is wonderful.', '品质与状态', '演出很精彩。'),
        w('g5-u1-18', 'Australia', '/ɒˈstreɪliə/', 'n.', '澳大利亚', 'Kangaroos live in Australia.', '社会与环境', '袋鼠生活在澳大利亚。'),
      ],
    },
    {
      id: 'g5-u2', title: 'Unit 2 · What\u2019s the matter?', words: [
        w('g5-u2-1', 'sad', '/sæd/', 'adj.', '悲哀的；难过的', 'I feel sad today.', '情感与性格', '我今天很难过。'),
        w('g5-u2-2', 'matter', '/ˈmætə(r)/', 'n.', '事情；问题', 'What\u2019s the matter?', '认知与学术', '怎么了？'),
        w('g5-u2-3', 'project', '/ˈprɒdʒekt/', 'n.', '项目；方案', 'Our school project is about animals.', '认知与学术', '我们的学校项目关于动物。'),
        w('g5-u2-4', 'centre', '/ˈsentə(r)/', 'n.', '中心', 'There is a shopping centre.', '社会与环境', '有一个购物中心。'),
        w('g5-u2-5', 'agree', '/əˈɡriː/', 'v.', '同意；赞成', 'I agree with you.', '行为与动作', '我同意你。'),
        w('g5-u2-6', 'finish', '/ˈfɪnɪʃ/', 'v.', '完成；做好', 'Please finish your homework.', '行为与动作', '请完成作业。'),
        w('g5-u2-7', 'worried', '/ˈwʌrid/', 'adj.', '担心的；担忧的', 'She is worried about the test.', '情感与性格', '她担心考试。'),
        w('g5-u2-8', 'both', '/bəʊθ/', 'pron.', '两者', 'Both of them are students.', '社会与环境', '他们俩都是学生。'),
        w('g5-u2-9', 'excited', '/ɪkˈsaɪtɪd/', 'adj.', '激动的；兴奋的', 'We are excited about the trip.', '情感与性格', '我们对旅行很兴奋。'),
        w('g5-u2-10', 'wrong', '/rɒŋ/', 'adj.', '错误的', 'Your answer is wrong.', '品质与状态', '你的答案是错的。'),
        w('g5-u2-11', 'angry', '/ˈæŋɡri/', 'adj.', '愤怒的；生气的', 'He is angry with me.', '情感与性格', '他生我的气。'),
        w('g5-u2-12', 'afraid', '/əˈfreɪd/', 'adj.', '担心；害怕', 'I am afraid of dogs.', '情感与性格', '我怕狗。'),
        w('g5-u2-13', 'parent', '/ˈpeərənt/', 'n.', '父亲；母亲', 'My parents love me.', '社会与环境', '我父母爱我。'),
        w('g5-u2-14', 'ask', '/ɑːsk/', 'v.', '问；询问', 'May I ask a question?', '行为与动作', '我可以问一个问题吗？'),
        w('g5-u2-15', 'move', '/muːv/', 'v.', '搬家；移动', 'We will move to a new house.', '行为与动作', '我们要搬到新房子。'),
        w('g5-u2-16', 'yours', '/jɔːz/', 'pron.', '您的（书信结尾签名前）', 'Is this book yours?', '社会与环境', '这本书是你的吗？'),
      ],
    },
    {
      id: 'g5-u3', title: 'Unit 3 · What do you have on Wednesdays?', words: [
        w('g5-u3-1', 'Wednesday', '/ˈwenzdeɪ/', 'n.', '星期三', 'Today is Wednesday.', '认知与学术', '今天是星期三。'),
        w('g5-u3-2', 'subject', '/ˈsʌbdʒɪkt/', 'n.', '科目；学科', 'English is my favourite subject.', '认知与学术', '英语是我最喜欢的科目。'),
        w('g5-u3-3', 'Monday', '/ˈmʌndeɪ/', 'n.', '星期一', 'We have PE on Monday.', '认知与学术', '我们星期一有体育课。'),
        w('g5-u3-4', 'Tuesday', '/ˈtjuːzdeɪ/', 'n.', '星期二', 'I play football on Tuesday.', '认知与学术', '我星期二踢足球。'),
        w('g5-u3-5', 'Friday', '/ˈfraɪdeɪ/', 'n.', '星期五', 'The party is on Friday.', '认知与学术', '聚会星期五举行。'),
        w('g5-u3-6', 'because', '/bɪˈkɒz/', 'conj.', '因为', 'I like music because it is fun.', '认知与学术', '我喜欢音乐因为它有趣。'),
        w('g5-u3-7', 'Thursday', '/ˈθɜːzdeɪ/', 'n.', '星期四', 'She has art on Thursday.', '认知与学术', '她星期四有美术课。'),
        w('g5-u3-8', 'start', '/stɑːt/', 'v.', '开始', 'School starts at eight.', '行为与动作', '学校八点开始上课。'),
        w('g5-u3-9', 'usually', '/ˈjuːʒuəli/', 'adv.', '通常地；经常地', 'I usually get up at seven.', '行为与动作', '我通常七点起床。'),
        w('g5-u3-10', 'weekend', '/ˌwiːkˈend/', 'n.', '周末', 'We go hiking at the weekend.', '认知与学术', '我们周末去远足。'),
        w('g5-u3-11', 'sometimes', '/ˈsʌmtaɪmz/', 'adv.', '有时；间或', 'Sometimes I read books.', '行为与动作', '有时我读书。'),
        w('g5-u3-12', 'Saturday', '/ˈsætədeɪ/', 'n.', '星期六', 'We visit grandma on Saturday.', '认知与学术', '我们星期六去看奶奶。'),
        w('g5-u3-13', 'Sunday', '/ˈsʌndeɪ/', 'n.', '星期日', 'Sunday is my favourite day.', '认知与学术', '星期日是我最喜欢的一天。'),
        w('g5-u3-14', 'lesson', '/ˈlesn/', 'n.', '课；一节课', 'We have four lessons in the morning.', '认知与学术', '我们上午有四节课。'),
        w('g5-u3-15', 'evening', '/ˈiːvnɪŋ/', 'n.', '晚上；傍晚', 'I do homework in the evening.', '认知与学术', '我晚上做作业。'),
        w('g5-u3-16', 'answer', '/ˈɑːnsə/', 'n./v.', '答复；回答', 'Please answer the question.', '行为与动作', '请回答问题。'),
        w('g5-u3-17', 'ping-pong', '/ˈpɪŋ pɒŋ/', 'n.', '乒乓球', 'We play ping-pong after school.', '认知与学术', '放学后我们打乒乓球。'),
        w('g5-u3-18', 'night', '/naɪt/', 'n.', '夜；夜晚', 'Good night, Mum.', '认知与学术', '晚安，妈妈。'),
        w('g5-u3-19', 'visit', '/ˈvɪzɪt/', 'v.', '看望；拜访；参观', 'We visit the museum.', '行为与动作', '我们参观博物馆。'),
        w('g5-u3-20', 'grandparent', '/ˈɡrænpeərənt/', 'n.', '祖父；祖母；外祖父；外祖母', 'My grandparents live with us.', '社会与环境', '我的祖父母和我们住在一起。'),
      ],
    },
    {
      id: 'g5-u4', title: 'Unit 4 · How can we all stay healthy?', words: [
        w('g5-u4-1', 'stay', '/steɪ/', 'v.', '待；保持；继续是', 'Stay at home today.', '行为与动作', '今天待在家里。'),
        w('g5-u4-2', 'should', '/ʃʊd/', 'modal.', '（建议）该，可以', 'You should drink more water.', '行为与动作', '你应该多喝水。'),
        w('g5-u4-3', 'flu', '/fluː/', 'n.', '流行性感冒；流感', 'He has the flu.', '行为与动作', '他得了流感。'),
        w('g5-u4-4', 'else', '/els/', 'adv.', '其他的；别的', 'What else do you want?', '认知与学术', '你还想要别的吗？'),
        w('g5-u4-5', 'exercise', '/ˈeksəsaɪz/', 'n./v.', '锻炼；训练；操练', 'Exercise is good for us.', '行为与动作', '锻炼对我们有好处。'),
        w('g5-u4-6', 'enough', '/ɪˈnʌf/', 'adj./adv.', '足够的；充足的', 'We have enough time.', '品质与状态', '我们有足够的时间。'),
        w('g5-u4-7', 'if', '/ɪf/', 'conj.', '如果；假若；倘若', 'If it rains, we stay home.', '认知与学术', '如果下雨，我们就待在家里。'),
        w('g5-u4-8', 'habit', '/ˈhæbɪt/', 'n.', '习惯', 'Reading is a good habit.', '行为与动作', '阅读是好习惯。'),
        w('g5-u4-9', 'show', '/ʃəʊ/', 'n.', '（电视或广播）节目', 'I watch a TV show.', '认知与学术', '我看电视节目。'),
        w('g5-u4-10', 'phone', '/fəʊn/', 'n.', '电话；电话机', 'Mum is on the phone.', '社会与环境', '妈妈在打电话。'),
        w('g5-u4-11', 'then', '/ðen/', 'adv.', '那么；因此；既然如此', 'Then we go to school.', '行为与动作', '然后我们去上学。'),
        w('g5-u4-12', 'rest', '/rest/', 'n./v.', '休息；放松', 'Take a rest, please.', '行为与动作', '请休息一下。'),
        w('g5-u4-13', 'take care of', '/teɪk keə əv/', 'phrase.', '爱护；照顾', 'Take care of yourself.', '行为与动作', '照顾好自己。'),
        w('g5-u4-14', 'check', '/tʃek/', 'v.', '查看；查明', 'Check your answers.', '行为与动作', '检查你的答案。'),
        w('g5-u4-15', 'less', '/les/', 'adv.', '（与不可数名词连用）较少的，更少的', 'Eat less candy.', '行为与动作', '少吃糖。'),
        w('g5-u4-16', 'brush', '/brʌʃ/', 'v.', '（用刷子）刷净，刷亮', 'Brush your teeth.', '行为与动作', '刷牙。'),
        w('g5-u4-17', 'tooth', '/tuːθ/', 'n.', '牙；齿', 'I have a bad tooth.', '行为与动作', '我有一颗坏牙。'),
        w('g5-u4-18', 'twice', '/twaɪs/', 'adv.', '两次；两遍', 'Brush your teeth twice a day.', '行为与动作', '每天刷牙两次。'),
        w('g5-u4-19', 'hour', '/ˈaʊə(r)/', 'n.', '小时', 'An hour has sixty minutes.', '认知与学术', '一小时有六十分钟。'),
        w('g5-u4-20', 'free', '/friː/', 'adj.', '空闲的', 'I am free this afternoon.', '品质与状态', '我今天下午有空。'),
      ],
    },
    {
      id: 'g5-u5', title: 'Unit 5 · What would you like to eat?', words: [
        w('g5-u5-1', 'hungry', '/ˈhʌŋɡri/', 'adj.', '感到饿的', 'I am hungry now.', '情感与性格', '我现在饿了。'),
        w('g5-u5-2', 'beef', '/biːf/', 'n.', '牛肉', 'I\u2019d like some beef.', '社会与环境', '我想吃牛肉。'),
        w('g5-u5-3', 'ice cream', '/ˌaɪs ˈkriːm/', 'n.', '（一份）冰激凌', 'The ice cream is sweet.', '社会与环境', '冰激凌很甜。'),
        w('g5-u5-4', 'little', '/ˈlɪtl/', 'adj.', '少许；一点', 'There is a little milk.', '品质与状态', '有一点牛奶。'),
        w('g5-u5-5', 'dumpling', '/ˈdʌmplɪŋ/', 'n.', '饺子；汤圆', 'I love dumplings.', '社会与环境', '我爱吃饺子。'),
        w('g5-u5-6', 'tea', '/tiː/', 'n.', '茶叶；茶；茶水', 'She drinks tea.', '社会与环境', '她喝茶。'),
        w('g5-u5-7', 'hamburger', '/ˈhæmbɜːɡə(r)/', 'n.', '汉堡包；汉堡牛肉饼', 'He eats a hamburger.', '社会与环境', '他吃一个汉堡。'),
        w('g5-u5-8', 'Mrs', '/ˈmɪsɪz/', 'n.', '（用于女子姓氏前）太太，夫人', 'Mrs Wang is our teacher.', '社会与环境', '王老师是我们的老师。'),
        w('g5-u5-9', 'coconut', '/ˈkəʊkənʌt/', 'n.', '椰子', 'The coconut comes from Hainan.', '社会与环境', '椰子来自海南。'),
        w('g5-u5-10', 'interesting', '/ˈɪntrəstɪŋ/', 'adj.', '有趣的；有吸引力的', 'The story is interesting.', '品质与状态', '这个故事很有趣。'),
        w('g5-u5-11', 'seed', '/siːd/', 'n.', '种子；籽', 'The seed grows into a plant.', '社会与环境', '种子长成植物。'),
        w('g5-u5-12', 'pull', '/pʊl/', 'v.', '拔出；抽出', 'Pull the door, please.', '行为与动作', '请拉门。'),
        w('g5-u5-13', 'pull up', '/pʊl ʌp/', 'phrase.', '拔出', 'Pull up the weeds.', '行为与动作', '拔掉杂草。'),
        w('g5-u5-14', 'stem', '/stem/', 'n.', '（花草的）茎；梗，柄', 'The flower has a long stem.', '社会与环境', '花有长长的茎。'),
        w('g5-u5-15', 'root', '/ruːt/', 'n.', '根；根茎', 'The root is under the soil.', '社会与环境', '根在土壤下面。'),
        w('g5-u5-16', 'lotus', '/ˈləʊtəs/', 'n.', '莲属植物', 'The lotus is beautiful.', '社会与环境', '莲花很美。'),
        w('g5-u5-17', 'lake', '/leɪk/', 'n.', '湖；湖泊', 'There is a lake in the park.', '社会与环境', '公园里有一个湖。'),
        w('g5-u5-18', 'world', '/wɜːld/', 'n.', '世界；地球；天下', 'We live in the world.', '社会与环境', '我们生活在这个世界上。'),
        w('g5-u5-19', 'round', '/raʊnd/', 'adj.', '圆形的；环形的；球形的', 'The moon is round.', '品质与状态', '月亮是圆的。'),
        w('g5-u5-20', 'different', '/ˈdɪfrənt/', 'adj.', '不同的；有区别的', 'We have different hobbies.', '品质与状态', '我们有不同的爱好。'),
        w('g5-u5-21', 'way', '/weɪ/', 'n.', '方法；手段；途径；方式', 'There is another way.', '认知与学术', '还有另一种方法。'),
      ],
    },
    {
      id: 'g5-u6', title: 'Unit 6 · In a nature park', words: [
        w('g5-u6-1', 'river', '/ˈrɪvə(r)/', 'n.', '河；江', 'The river is long.', '社会与环境', '这条河很长。'),
        w('g5-u6-2', 'nature', '/ˈneɪtʃə(r)/', 'n.', '自然界；大自然', 'We love nature.', '社会与环境', '我们热爱大自然。'),
        w('g5-u6-3', 'waterfall', '/ˈwɔːtəfɔːl/', 'n.', '瀑布', 'The waterfall is high.', '社会与环境', '瀑布很高。'),
        w('g5-u6-4', 'forest', '/ˈfɒrɪst/', 'n.', '森林；林区', 'Many animals live in the forest.', '社会与环境', '许多动物生活在森林里。'),
        w('g5-u6-5', 'famous', '/ˈfeɪməs/', 'adj.', '著名的；出名的', 'Beijing is a famous city.', '品质与状态', '北京是著名的城市。'),
        w('g5-u6-6', 'mountain', '/ˈmaʊntən/', 'n.', '高山；山岳', 'The mountain is very tall.', '社会与环境', '这座山很高。'),
        w('g5-u6-7', 'wind', '/wɪnd/', 'n.', '风；气流', 'The wind is strong today.', '社会与环境', '今天风很大。'),
        w('g5-u6-8', 'trip', '/trɪp/', 'n.', '（短程往返的）旅行，旅游，出行', 'Have a nice trip!', '行为与动作', '旅途愉快！'),
        w('g5-u6-9', 'dangerous', '/ˈdeɪndʒərəs/', 'adj.', '有危险的；不安全的', 'It is dangerous to swim here.', '品质与状态', '在这里游泳很危险。'),
        w('g5-u6-10', 'heavy', '/ˈhevi/', 'adj.', '程度大的；严重的', 'It will be heavy rain.', '社会与环境', '将有大雨。'),
        w('g5-u6-11', 'hotel', '/həʊˈtel/', 'n.', '旅馆；旅社', 'We stay at a hotel.', '社会与环境', '我们住旅馆。'),
        w('g5-u6-12', 'close', '/kləʊz/', 'v.', '关；关闭；闭上', 'Close the window, please.', '行为与动作', '请关窗。'),
        w('g5-u6-13', 'umbrella', '/ʌmˈbrelə/', 'n.', '伞；雨伞', 'Take an umbrella with you.', '社会与环境', '带上雨伞。'),
        w('g5-u6-14', 'raincoat', '/ˈreɪnkəʊt/', 'n.', '雨衣', 'Put on your raincoat.', '社会与环境', '穿上你的雨衣。'),
        w('g5-u6-15', 'worry', '/ˈwʌri/', 'v.', '担心；担忧；发愁', 'Don\u2019t worry.', '情感与性格', '别担心。'),
        w('g5-u6-16', 'fine', '/faɪn/', 'adj.', '晴朗的', 'The weather is fine.', '社会与环境', '天气很好。'),
        w('g5-u6-17', 'fog', '/fɒɡ/', 'n.', '雾', 'There is heavy fog today.', '社会与环境', '今天有大雾。'),
        w('g5-u6-18', 'flood', '/flʌd/', 'n.', '洪水；水灾', 'The flood is terrible.', '社会与环境', '洪水很可怕。'),
        w('g5-u6-19', 'fire', '/ˈfaɪə(r)/', 'n.', '火；火灾', 'Fire is dangerous.', '社会与环境', '火很危险。'),
        w('g5-u6-20', 'know', '/nəʊ/', 'v.', '知道；了解', 'I know the answer.', '认知与学术', '我知道答案。'),
        w('g5-u6-21', 'before', '/bɪˈfɔː(r)/', 'prep.', '在……之前', 'Wash your hands before dinner.', '认知与学术', '饭前洗手。'),
        w('g5-u6-22', 'go hiking', '/ɡəʊ ˈhaɪkɪŋ/', 'phrase.', '徒步旅行', 'We go hiking on Sundays.', '行为与动作', '我们星期天去远足。'),
        w('g5-u6-23', 'bring', '/brɪŋ/', 'v.', '带来；取来', 'Bring your book tomorrow.', '行为与动作', '明天带上你的书。'),
      ],
    },
  ],
};

const GRADE5B_BOOK: VocabBook = {
  id: 'primary-g5b', name: '人教PEP小学英语·五年级下册', stage: '小学英语', builtin: true,
  desc: '人教PEP（三年级起点）五年级下册，按教材附录分 6 个真实单元导入（132 词）', wordCount: 132,
  units: [
    { id: 'g5b-u1', title: 'Unit 1 My day 我的一天', words: [
      w('g5b-1', 'when', '/wen/', 'adv.', '什么时候', 'When do you get up?', '认知与学术', '你什么时候起床？'),
      w('g5b-2', 'after', '/ˈɑːftə(r)/', 'prep.', '在……之后', 'I read after dinner.', '认知与学术', '我晚饭后读书。'),
      w('g5b-3', 'start', '/stɑːt/', 'v.', '开始', 'Class starts at eight.', '行为与动作', '八点开始上课。'),
      w('g5b-4', 'usually', '/ˈjuːʒuəli/', 'adv.', '通常', 'I usually walk home.', '认知与学术', '我通常走路回家。'),
      w('g5b-5', 'late', '/leɪt/', 'adj.', '晚的；迟的', 'That is too late.', '品质与状态', '那太晚了。'),
      w('g5b-6', 'a.m.', '/ˌeɪ ˈem/', 'n.', '午前；上午', 'At 7 a.m.', '认知与学术', '在上午七点。'),
      w('g5b-7', 'p.m.', '/ˌpiː ˈem/', 'n.', '午后；下午', 'At 4 p.m.', '认知与学术', '在下午四点。'),
      w('g5b-8', 'why', '/waɪ/', 'adv.', '为什么', 'Why are you late?', '认知与学术', '你为什么迟到？'),
      w('g5b-9', 'shop', '/ʃɒp/', 'v./n.', '购物；商店', 'I shop on Saturday.', '行为与动作', '我星期六购物。'),
      w('g5b-10', 'work', '/wɜːk/', 'v.', '工作', 'My mum works at night.', '行为与动作', '我妈妈晚上工作。'),
      w('g5b-11', 'last', '/lɑːst/', 'adj.', '上一个的', 'Last night I read.', '认知与学术', '昨晚我读书了。'),
      w('g5b-12', 'sound', '/saʊnd/', 'v.', '听起来', 'That sounds fun.', '行为与动作', '那听起来很有趣。'),
      w('g5b-13', 'also', '/ˈɔːlsəʊ/', 'adv.', '也；还', 'I also like music.', '认知与学术', '我也喜欢音乐。'),
      w('g5b-14', 'busy', '/ˈbɪzi/', 'adj.', '忙碌的', 'It is a busy day.', '品质与状态', '这是忙碌的一天。'),
      w('g5b-15', 'need', '/niːd/', 'v.', '需要', 'You need a rest.', '行为与动作', '你需要休息。'),
      w('g5b-16', 'win', '/wɪn/', 'v.', '获胜', 'We win the game.', '行为与动作', '我们赢了比赛。'),
      w('g5b-17', 'exercise', '/ˈeksəsaɪz/', 'n./v.', '活动；锻炼', 'Exercise is good for you.', '行为与动作', '锻炼对你有好处。'),
      w('g5b-18', 'take', '/teɪk/', 'v.', '学习；上（课）', 'I take a maths class.', '行为与动作', '我上数学课。'),
      w('g5b-19', 'dance', '/dɑːns/', 'v./n.', '跳舞', 'She can dance well.', '行为与动作', '她舞跳得好。'),
      w('g5b-20', 'walk', '/wɔːk/', 'v./n.', '走路；散步', 'We walk to school.', '行为与动作', '我们走路去上学。'),
      w('g5b-21', 'get up', '/ɡet ʌp/', 'phrase.', '起床', 'I get up at seven.', '行为与动作', '我七点起床。'),
      w('g5b-22', 'do morning exercises', '/duː ˈmɔːnɪŋ ˈeksəsaɪzɪz/', 'phrase.', '做早操', 'We do morning exercises.', '行为与动作', '我们做早操。'),
      w('g5b-23', 'eat breakfast', '/iːt ˈbrekfəst/', 'phrase.', '吃早饭', 'I eat breakfast at home.', '行为与动作', '我在家吃早饭。'),
      w('g5b-24', 'have...class', '/hæv klɑːs/', 'phrase.', '上……课', 'We have an art class.', '行为与动作', '我们上美术课。'),
      w('g5b-25', 'play sports', '/pleɪ spɔːts/', 'phrase.', '进行体育运动', 'They play sports at four.', '行为与动作', '他们四点做运动。'),
      w('g5b-26', 'eat dinner', '/iːt ˈdɪnə(r)/', 'phrase.', '吃晚饭', 'We eat dinner at six.', '行为与动作', '我们六点吃晚饭。'),
      w('g5b-27', 'clean my room', '/kliːn maɪ ruːm/', 'phrase.', '打扫房间', 'I clean my room on Sunday.', '行为与动作', '我星期天打扫房间。'),
      w('g5b-28', 'go for a walk', '/ɡəʊ fɔː(r) ə wɔːk/', 'phrase.', '散步', 'Let us go for a walk.', '行为与动作', '我们去散步吧。'),
      w('g5b-29', 'go shopping', '/ɡəʊ ˈʃɒpɪŋ/', 'phrase.', '购物', 'I go shopping with Mum.', '行为与动作', '我和妈妈去购物。'),
      w('g5b-30', 'take a dancing class', '/teɪk ə ˈdɑːnsɪŋ klɑːs/', 'phrase.', '上舞蹈课', 'She takes a dancing class.', '行为与动作', '她上舞蹈课。'),
    ]},
    { id: 'g5b-u2', title: 'Unit 2 My favourite season 我最喜欢的季节', words: [
      w('g5b-31', 'spring', '/sprɪŋ/', 'n.', '春天', 'Spring is warm.', '社会与环境', '春天很温暖。'),
      w('g5b-32', 'summer', '/ˈsʌmə(r)/', 'n.', '夏天', 'Summer is hot.', '社会与环境', '夏天很炎热。'),
      w('g5b-33', 'autumn', '/ˈɔːtəm/', 'n.', '秋天', 'Autumn is golden.', '社会与环境', '秋天是金色的。'),
      w('g5b-34', 'winter', '/ˈwɪntə(r)/', 'n.', '冬天', 'Winter is white.', '社会与环境', '冬天是白色的。'),
      w('g5b-35', 'season', '/ˈsiːzn/', 'n.', '季节', 'There are four seasons.', '社会与环境', '有四个季节。'),
      w('g5b-36', 'picnic', '/ˈpɪknɪk/', 'n.', '野餐', 'We have a picnic.', '社会与环境', '我们去野餐。'),
      w('g5b-37', 'pick', '/pɪk/', 'v.', '摘；采集', 'Pick the apples.', '行为与动作', '摘苹果。'),
      w('g5b-38', 'snowman', '/ˈsnəʊmæn/', 'n.', '雪人', 'We make a snowman.', '社会与环境', '我们堆雪人。'),
      w('g5b-39', 'go on a picnic', '/ɡəʊ ɒn ə ˈpɪknɪk/', 'phrase.', '去野餐', 'Let us go on a picnic.', '行为与动作', '我们去野餐吧。'),
      w('g5b-40', 'go swimming', '/ɡəʊ ˈswɪmɪŋ/', 'phrase.', '去游泳', 'I go swimming in summer.', '行为与动作', '我夏天去游泳。'),
      w('g5b-41', 'pick apples', '/pɪk ˈæplz/', 'phrase.', '摘苹果', 'We pick apples in autumn.', '行为与动作', '我们秋天摘苹果。'),
      w('g5b-42', 'make a snowman', '/meɪk ə ˈsnəʊmæn/', 'phrase.', '堆雪人', 'We make a snowman in winter.', '行为与动作', '我们冬天堆雪人。'),
      w('g5b-43', 'which', '/wɪtʃ/', 'pron.', '哪一个', 'Which season do you like?', '认知与学术', '你喜欢哪个季节？'),
      w('g5b-44', 'best', '/best/', 'adv.', '最', 'I like spring best.', '认知与学术', '我最喜欢春天。'),
      w('g5b-45', 'because', '/bɪˈkɒz/', 'conj.', '因为', 'Because I can swim.', '认知与学术', '因为我能游泳。'),
      w('g5b-46', 'snow', '/snəʊ/', 'n./v.', '雪；下雪', 'The snow is white.', '社会与环境', '雪是白色的。'),
      w('g5b-47', 'vacation', '/vəˈkeɪʃn/', 'n.', '假期', 'Summer vacation is long.', '社会与环境', '暑假很长。'),
      w('g5b-48', 'lovely', '/ˈlʌvli/', 'adj.', '可爱的', 'What a lovely day!', '品质与状态', '多么美好的一天！'),
      w('g5b-49', 'paint', '/peɪnt/', 'v.', '用颜料绘画', 'We paint the seasons.', '行为与动作', '我们画四季。'),
      w('g5b-50', 'leaf', '/liːf/', 'n.', '叶子（复数 leaves）', 'The leaves fall.', '社会与环境', '树叶落下。'),
      w('g5b-51', 'pink', '/pɪŋk/', 'adj./n.', '粉色的；粉色', 'I like pink flowers.', '品质与状态', '我喜欢粉色的花。'),
      w('g5b-52', 'fall', '/fɔːl/', 'v./n.', '落下；【美】秋天', 'Leaves fall in autumn.', '社会与环境', '秋天树叶落下。'),
    ]},
    { id: 'g5b-u3', title: 'Unit 3 My school calendar 我的校历', words: [
      w('g5b-53', 'January', '/ˈdʒænjuəri/', 'n.', '一月', 'It is cold in January.', '社会与环境', '一月很冷。'),
      w('g5b-54', 'February', '/ˈfebruəri/', 'n.', '二月', 'February is short.', '社会与环境', '二月很短。'),
      w('g5b-55', 'March', '/mɑːtʃ/', 'n.', '三月', 'Tree Planting Day is in March.', '社会与环境', '植树节在三月。'),
      w('g5b-56', 'April', '/ˈeɪprəl/', 'n.', '四月', 'The party is in April.', '社会与环境', '派对在四月。'),
      w('g5b-57', 'May', '/meɪ/', 'n.', '五月', 'Mother\'s Day is in May.', '社会与环境', '母亲节在五月。'),
      w('g5b-58', 'June', '/dʒuːn/', 'n.', '六月', 'Children\'s Day is in June.', '社会与环境', '儿童节在六月。'),
      w('g5b-59', 'July', '/dʒuˈlaɪ/', 'n.', '七月', 'July is hot.', '社会与环境', '七月很热。'),
      w('g5b-60', 'August', '/ˈɔːɡəst/', 'n.', '八月', 'August is in summer.', '社会与环境', '八月在夏天。'),
      w('g5b-61', 'September', '/sepˈtembə(r)/', 'n.', '九月', 'Teachers\' Day is in September.', '社会与环境', '教师节在九月。'),
      w('g5b-62', 'October', '/ɒkˈtəʊbə(r)/', 'n.', '十月', 'National Day is in October.', '社会与环境', '国庆节在十月。'),
      w('g5b-63', 'November', '/nəʊˈvembə(r)/', 'n.', '十一月', 'Thanksgiving is in November.', '社会与环境', '感恩节在十一月。'),
      w('g5b-64', 'December', '/dɪˈsembə(r)/', 'n.', '十二月', 'Christmas is in December.', '社会与环境', '圣诞节在十二月。'),
      w('g5b-65', 'few', '/fjuː/', 'adj.', '不多；很少', 'Few people know it.', '品质与状态', '很少有人知道。'),
      w('g5b-66', 'a few', '/ə fjuː/', 'phrase.', '一些', 'We have a few fun things.', '认知与学术', '我们有一些有趣的事。'),
      w('g5b-67', 'thing', '/θɪŋ/', 'n.', '事情', 'Many things happen in spring.', '认知与学术', '春天发生很多事。'),
      w('g5b-68', 'meet', '/miːt/', 'v./n.', '集会；开会', 'The sports meet is in April.', '社会与环境', '运动会在四月。'),
      w('g5b-69', 'sports meet', '/spɔːts miːt/', 'phrase.', '运动会', 'When is the sports meet?', '社会与环境', '运动会在什么时候？'),
      w('g5b-70', 'trip', '/trɪp/', 'n.', '旅行', 'The school trip is in May.', '社会与环境', '学校旅行在五月。'),
      w('g5b-71', 'year', '/jɪə(r)/', 'n.', '年', 'Happy New Year!', '认知与学术', '新年快乐！'),
      w('g5b-72', 'contest', '/ˈkɒntest/', 'n.', '比赛；竞赛', 'The singing contest is in June.', '社会与环境', '歌唱比赛在六月。'),
    ]},
    { id: 'g5b-u4', title: 'Unit 4 When is the art show? 艺术节在什么时候？', words: [
      w('g5b-73', 'first', '/fɜːst/', 'num.', '第一（1st）', 'It is on the first day.', '认知与学术', '在第一天。'),
      w('g5b-74', 'second', '/ˈsekənd/', 'num.', '第二（2nd）', 'The second month is February.', '认知与学术', '第二个月是二月。'),
      w('g5b-75', 'third', '/θɜːd/', 'num.', '第三（3rd）', 'March is the third month.', '认知与学术', '三月是第三个月。'),
      w('g5b-76', 'fourth', '/fɔːθ/', 'num.', '第四（4th）', 'April is the fourth month.', '认知与学术', '四月是第四个月。'),
      w('g5b-77', 'fifth', '/fɪfθ/', 'num.', '第五（5th）', 'May is the fifth month.', '认知与学术', '五月是第五个月。'),
      w('g5b-78', 'twelfth', '/twelfθ/', 'num.', '第十二（12th）', 'The twelfth floor.', '认知与学术', '第十二层。'),
      w('g5b-79', 'twentieth', '/ˈtwentiəθ/', 'num.', '第二十（20th）', 'On the twentieth day.', '认知与学术', '在第二十天。'),
      w('g5b-80', 'twenty-first', '/ˌtwenti ˈfɜːst/', 'num.', '第二十一（21st）', 'On May the twenty-first.', '认知与学术', '在五月二十一日。'),
      w('g5b-81', 'twenty-third', '/ˌtwenti ˈθɜːd/', 'num.', '第二十三（23rd）', 'On the twenty-third of March.', '认知与学术', '在三月二十三日。'),
      w('g5b-82', 'thirtieth', '/ˈθɜːtiəθ/', 'num.', '第三十（30th）', 'On the thirtieth day.', '认知与学术', '在第三十天。'),
      w('g5b-83', 'special', '/ˈspeʃl/', 'adj.', '特殊的', 'It is a special day.', '品质与状态', '这是特别的一天。'),
      w('g5b-84', 'festival', '/ˈfestɪvl/', 'n.', '节日', 'The reading festival is fun.', '社会与环境', '读书节很有趣。'),
      w('g5b-85', 'kitten', '/ˈkɪtn/', 'n.', '小猫', 'The kitten is small.', '社会与环境', '小猫很小。'),
      w('g5b-86', 'diary', '/ˈdaɪəri/', 'n.', '日记', 'I write in my diary.', '认知与学术', '我写日记。'),
      w('g5b-87', 'still', '/stɪl/', 'adv.', '仍然', 'It is still small.', '认知与学术', '它仍然很小。'),
      w('g5b-88', 'noise', '/nɔɪz/', 'n.', '声音；响声', 'The kitten makes noises.', '社会与环境', '小猫发出声音。'),
      w('g5b-89', 'fur', '/fɜː(r)/', 'n.', '浓密的软毛', 'Its fur is white.', '社会与环境', '它的毛是白色的。'),
      w('g5b-90', 'open', '/ˈəʊpən/', 'adj./v.', '开着的；打开', 'Its eyes are open.', '品质与状态', '它的眼睛睁开了。'),
      w('g5b-91', 'walk', '/wɔːk/', 'v./n.', '行走', 'The kitten can walk.', '行为与动作', '小猫会走路了。'),
      w('g5b-92', 'show', '/ʃəʊ/', 'n.', '展览', 'The art show is in May.', '社会与环境', '艺术节在五月。'),
    ]},
    { id: 'g5b-u5', title: 'Unit 5 Whose dog is it? 这是谁的狗？', words: [
      w('g5b-93', 'mine', '/maɪn/', 'pron.', '我的', 'The dog is mine.', '认知与学术', '这只狗是我的。'),
      w('g5b-94', 'yours', '/jɔːz/', 'pron.', '你的；你们的', 'Is this bag yours?', '认知与学术', '这个包是你的吗？'),
      w('g5b-95', 'his', '/hɪz/', 'pron.', '他的', 'The ball is his.', '认知与学术', '球是他的。'),
      w('g5b-96', 'hers', '/hɜːz/', 'pron.', '她的', 'The pen is hers.', '认知与学术', '钢笔是她的。'),
      w('g5b-97', 'ours', '/ˈaʊəz/', 'pron.', '我们的', 'The room is ours.', '认知与学术', '房间是我们的。'),
      w('g5b-98', 'theirs', '/ðeəz/', 'pron.', '他们的', 'The toys are theirs.', '认知与学术', '玩具是他们的。'),
      w('g5b-99', 'climbing', '/ˈklaɪmɪŋ/', 'v.', '（正在）攀登', 'The cat is climbing.', '行为与动作', '猫正在爬。'),
      w('g5b-100', 'eating', '/ˈiːtɪŋ/', 'v.', '（正在）吃', 'The dog is eating.', '行为与动作', '狗正在吃东西。'),
      w('g5b-101', 'playing', '/ˈpleɪɪŋ/', 'v.', '（正在）玩耍', 'They are playing.', '行为与动作', '他们正在玩耍。'),
      w('g5b-102', 'jumping', '/ˈdʒʌmpɪŋ/', 'v.', '（正在）跳', 'The rabbit is jumping.', '行为与动作', '兔子正在跳。'),
      w('g5b-103', 'drinking', '/ˈdrɪŋkɪŋ/', 'v.', '（正在）喝', 'It is drinking water.', '行为与动作', '它正在喝水。'),
      w('g5b-104', 'sleeping', '/ˈsliːpɪŋ/', 'v.', '（正在）睡觉', 'The dog is sleeping.', '行为与动作', '狗正在睡觉。'),
      w('g5b-105', 'each', '/iːtʃ/', 'pron.', '每一；各个', 'Each dog is cute.', '认知与学术', '每只狗都很可爱。'),
      w('g5b-106', 'each other', '/iːtʃ ˈʌðə(r)/', 'phrase.', '相互', 'They play with each other.', '认知与学术', '他们一起玩耍。'),
      w('g5b-107', 'excited', '/ɪkˈsaɪtɪd/', 'adj.', '兴奋的；激动的', 'I am so excited.', '情感与性格', '我非常兴奋。'),
      w('g5b-108', 'like', '/laɪk/', 'prep.', '像……那样', 'Swim like a fish.', '认知与学术', '像鱼一样游泳。'),
      w('g5b-109', 'these', '/ðiːz/', 'pron.', '这些', 'These dogs are ours.', '认知与学术', '这些狗是我们的。'),
      w('g5b-110', 'those', '/ðəʊz/', 'pron.', '那些', 'Are those pictures theirs?', '认知与学术', '那些画是他们的吗？'),
    ]},
    { id: 'g5b-u6', title: 'Unit 6 Work quietly! 安静学习！', words: [
      w('g5b-111', 'doing morning exercises', '/ˈduːɪŋ ˈmɔːnɪŋ ˈeksəsaɪzɪz/', 'phrase.', '（正在）做早操', 'They are doing morning exercises.', '行为与动作', '他们正在做早操。'),
      w('g5b-112', 'having...class', '/ˈhævɪŋ klɑːs/', 'phrase.', '（正在）上……课', 'We are having an English class.', '行为与动作', '我们正在上英语课。'),
      w('g5b-113', 'eating lunch', '/ˈiːtɪŋ lʌntʃ/', 'phrase.', '（正在）吃午饭', 'They are eating lunch.', '行为与动作', '他们正在吃午饭。'),
      w('g5b-114', 'reading a book', '/ˈriːdɪŋ ə bʊk/', 'phrase.', '（正在）看书', 'She is reading a book.', '行为与动作', '她正在看书。'),
      w('g5b-115', 'listening to music', '/ˈlɪsnɪŋ tə ˈmjuːzɪk/', 'phrase.', '（正在）听音乐', 'He is listening to music.', '行为与动作', '他正在听音乐。'),
      w('g5b-116', 'keep', '/kiːp/', 'v.', '保持某种状态', 'Keep your desk clean.', '行为与动作', '保持课桌整洁。'),
      w('g5b-117', 'keep to the right', '/kiːp tə ðə raɪt/', 'phrase.', '靠右', 'Please keep to the right.', '行为与动作', '请靠右行。'),
      w('g5b-118', 'keep your desk clean', '/kiːp jɔː(r) desk kliːn/', 'phrase.', '保持课桌干净', 'Keep your desk clean, please.', '行为与动作', '请保持课桌整洁。'),
      w('g5b-119', 'talk quietly', '/tɔːk ˈkwaɪətli/', 'phrase.', '小声讲话', 'Talk quietly in the library.', '行为与动作', '在图书馆小声说话。'),
      w('g5b-120', 'take turns', '/teɪk tɜːnz/', 'phrase.', '按顺序来', 'Please take turns.', '行为与动作', '请按顺序来。'),
      w('g5b-121', 'turn', '/tɜːn/', 'n.', '顺序', 'It is your turn.', '认知与学术', '轮到你了。'),
      w('g5b-122', 'bamboo', '/bæmˈbuː/', 'n.', '竹子', 'Pandas eat bamboo.', '社会与环境', '熊猫吃竹子。'),
      w('g5b-123', 'its', '/ɪts/', 'pron.', '它的', 'The dog wags its tail.', '认知与学术', '狗摇尾巴。'),
      w('g5b-124', 'show', '/ʃəʊ/', 'v.', '给人看', 'I can show you the book.', '行为与动作', '我可以给你看这本书。'),
      w('g5b-125', 'say', '/seɪ/', 'v.', '说；讲', 'What does it say?', '行为与动作', '上面写了什么？'),
      w('g5b-126', 'sure', '/ʃʊə(r)/', 'adv.', '当然', 'Sure, I can help.', '情感与性格', '当然，我可以帮忙。'),
      w('g5b-127', 'exhibition', '/ˌeksɪˈbɪʃn/', 'n.', '展览', 'The art exhibition is here.', '社会与环境', '艺术展在这里。'),
      w('g5b-128', 'else', '/els/', 'adv.', '另外；其他', 'Anything else?', '认知与学术', '还有别的吗？'),
      w('g5b-129', 'teach', '/tiːtʃ/', 'v.', '教', 'She teaches English.', '行为与动作', '她教英语。'),
      w('g5b-130', 'anything', '/ˈeniθɪŋ/', 'pron.', '任何事物', 'Do you see anything?', '认知与学术', '你看到什么了吗？'),
      w('g5b-131', 'Canadian', '/kəˈneɪdiən/', 'adj.', '加拿大的', 'The Canadian robot is kind.', '社会与环境', '加拿大机器人很友好。'),
      w('g5b-132', 'Spanish', '/ˈspænɪʃ/', 'adj.', '西班牙的', 'The Spanish robot can sing.', '社会与环境', '西班牙机器人会唱歌。'),
    ]},
  ],
};

const GRADE6_BOOK: VocabBook = {
  id: 'primary-g6', name: '人教PEP小学英语·六年级上册（2026新版）', stage: '小学英语', builtin: true,
  desc: '人教PEP 2026新版六年级上册，按 6 个真实单元导入（146 词，含课标二级词）', wordCount: 146,
  units: [
    {
      id: 'g6-u1', title: 'Unit 1 · Amazing landmarks', words: [
        w('g6-u1-1', 'was', '/wəz/', 'v.', '（be 的第一和第三人称单数过去式）', 'I was at home yesterday.', '行为与动作', '我昨天在家。'),
        w('g6-u1-2', 'climb', '/klaɪm/', 'v.', '攀登；爬', 'We climb the mountain.', '行为与动作', '我们爬山。'),
        w('g6-u1-3', 'kilometre', '/ˈkɪləmiːtə(r)/', 'n.', '（=km）千米；公里', 'It is three kilometres away.', '认知与学术', '有三公里远。'),
        w('g6-u1-4', 'gingerbread house', '/ˈdʒɪndʒəbred haʊs/', 'n.', '姜饼屋', 'We made a gingerbread house.', '社会与环境', '我们做了一个姜饼屋。'),
        w('g6-u1-5', 'send', '/send/', 'v.', '邮寄；发送', 'I will send you a picture.', '行为与动作', '我会给你发一张照片。'),
        w('g6-u1-6', 'go', '/ɡəʊ/', 'v.', '（过去式 went）去；走', 'We go to school by bus.', '行为与动作', '我们坐公交上学。'),
        w('g6-u1-7', 'thousand', '/ˈθaʊznd/', 'num.', '一千', 'There are a thousand trees.', '认知与学术', '有一千棵树。'),
        w('g6-u1-8', 'clay', '/kleɪ/', 'n.', '黏土；陶土', 'The clay is soft.', '社会与环境', '黏土很软。'),
        w('g6-u1-9', 'see', '/siː/', 'v.', '（过去式 saw）看见', 'I see a bird.', '行为与动作', '我看见一只鸟。'),
        w('g6-u1-10', 'village', '/ˈvɪlɪdʒ/', 'n.', '村庄；村镇', 'They live in a village.', '社会与环境', '他们住在一个村庄。'),
        w('g6-u1-11', 'eat', '/iːt/', 'v.', '（过去式 ate）吃', 'We eat breakfast at seven.', '行为与动作', '我们七点吃早餐。'),
        w('g6-u1-12', 'dry', '/draɪ/', 'adj.', '干的', 'The clothes are dry.', '品质与状态', '衣服是干的。'),
        w('g6-u1-13', 'take', '/teɪk/', 'v.', '（过去式 took）做（某个动作；和名词连用）', 'Take this bag with you.', '行为与动作', '带上这个包。'),
        w('g6-u1-14', 'view', '/vjuː/', 'n.', '景色', 'The view is beautiful.', '社会与环境', '景色很美。'),
        w('g6-u1-15', 'inspiring', '/ɪnˈspaɪərɪŋ/', 'adj.', '鼓舞人心的', 'The story is inspiring.', '情感与性格', '这个故事鼓舞人心。'),
        w('g6-u1-16', 'bamboo', '/ˌbæmˈbuː/', 'n.', '竹；竹子', 'Pandas eat bamboo.', '社会与环境', '熊猫吃竹子。'),
        w('g6-u1-17', 'pumpkin', '/ˈpʌmpkɪn/', 'n.', '南瓜', 'This is a big pumpkin.', '社会与环境', '这是一个大南瓜。'),
        w('g6-u1-18', 'restaurant', '/ˈrestərɒnt/', 'n.', '餐馆；餐厅', 'We eat at the restaurant.', '社会与环境', '我们在餐馆吃饭。'),
        w('g6-u1-19', 'airport', '/ˈeəpɔːt/', 'n.', '机场', 'The airport is far.', '社会与环境', '机场很远。'),
        w('g6-u1-20', 'New Zealand', '/ˌnjuː ˈziːlənd/', 'n.', '新西兰', 'My uncle lives in New Zealand.', '社会与环境', '我叔叔住在新西兰。'),
        w('g6-u1-21', 'Paris', '/ˈpærɪs/', 'n.', '巴黎', 'Paris is a famous city.', '社会与环境', '巴黎是著名的城市。'),
        w('g6-u1-22', 'Eiffel Tower', '/ˈaɪfəl ˈtaʊə/', 'n.', '埃菲尔铁塔', 'The Eiffel Tower is tall.', '社会与环境', '埃菲尔铁塔很高。'),
        w('g6-u1-23', 'Terracotta Warriors', '/ˌterəˈkɒtə ˈwɒriəz/', 'n.', '兵马俑', 'The Terracotta Warriors are in Xi\u2019an.', '社会与环境', '兵马俑在西安。'),
        w('g6-u1-24', 'Jinggangshan Revolution Museum', '/ˌrevəˈluːʃn mjuˈziːəm/', 'n.', '井冈山革命博物馆', 'We visited the Jinggangshan Revolution Museum.', '社会与环境', '我们参观了井冈山革命博物馆。'),
        w('g6-u1-25', 'the Red Army', '/ðə red ˈɑːmi/', 'n.', '红军', 'The Red Army was brave.', '社会与环境', '红军很勇敢。'),
      ],
    },
    {
      id: 'g6-u2', title: 'Unit 2 · Getting together', words: [
        w('g6-u2-1', 'paste', '/peɪst/', 'v.', '粘贴', 'Please paste the paper.', '行为与动作', '请粘贴纸张。'),
        w('g6-u2-2', 'dress', '/dres/', 'v.', '穿衣服', 'I dress quickly.', '行为与动作', '我快速穿好衣服。'),
        w('g6-u2-3', 'gala', '/ˈɡɑːlə/', 'n.', '演出；庆典', 'We watched the Spring Festival Gala.', '社会与环境', '我们看了春节联欢晚会。'),
        w('g6-u2-4', 'count down', '/kaʊnt daʊn/', 'phrase.', '倒计时', 'We count down to the new year.', '行为与动作', '我们倒计时迎接新年。'),
        w('g6-u2-5', 'marathon', '/ˈmærəθɒn/', 'n.', '马拉松赛跑', 'He runs a marathon.', '行为与动作', '他跑马拉松。'),
        w('g6-u2-6', 'as', '/æz/', 'prep.', '作为', 'She works as a teacher.', '社会与环境', '她当老师。'),
        w('g6-u2-7', 'race', '/reɪs/', 'n.', '赛跑；速度竞赛', 'We had a running race.', '行为与动作', '我们进行了一场赛跑。'),
        w('g6-u2-8', 'run', '/rʌn/', 'v.', '（过去式 ran）跑；奔跑', 'I run to school.', '行为与动作', '我跑去学校。'),
        w('g6-u2-9', 'cheer', '/tʃɪə(r)/', 'v.', '欢呼；加油', 'We cheer for our team.', '行为与动作', '我们为我们队加油。'),
        w('g6-u2-10', 'book fair', '/bʊk feə(r)/', 'n.', '书市', 'We go to the book fair.', '社会与环境', '我们去书市。'),
        w('g6-u2-11', 'writer', '/ˈraɪtə(r)/', 'n.', '作家；作者', 'He is a famous writer.', '社会与环境', '他是著名作家。'),
        w('g6-u2-12', 'read', '/riːd/', 'v.', '（过去式 read）阅读', 'I read books every day.', '行为与动作', '我每天读书。'),
        w('g6-u2-13', 'make', '/meɪk/', 'v.', '（过去式 made）做；使出现', 'We make cards.', '行为与动作', '我们做卡片。'),
        w('g6-u2-14', 'sing', '/sɪŋ/', 'v.', '（过去式 sang）唱（歌）；演唱', 'She sings well.', '行为与动作', '她唱得好。'),
        w('g6-u2-15', 'wear', '/weə(r)/', 'v.', '（过去式 wore）穿；戴', 'I wear a red coat.', '行为与动作', '我穿红色外套。'),
        w('g6-u2-16', 'yesterday', '/ˈjestədeɪ/', 'adv.', '昨天', 'I was busy yesterday.', '认知与学术', '我昨天很忙。'),
        w('g6-u2-17', 'notice', '/ˈnəʊtɪs/', 'n.', '通知', 'I see the notice.', '认知与学术', '我看到通知。'),
        w('g6-u2-18', 'wake', '/weɪk/', 'v.', '（过去式 woke）醒；醒来', 'I wake up at six.', '行为与动作', '我六点醒来。'),
        w('g6-u2-19', 'later', '/ˈleɪtə(r)/', 'adv.', '随后；后来', 'See you later.', '认知与学术', '回头见。'),
        w('g6-u2-20', 'judge', '/dʒʌdʒ/', 'n.', '裁判', 'The judge is fair.', '社会与环境', '裁判很公正。'),
        w('g6-u2-21', 'begin', '/bɪˈɡɪn/', 'v.', '（过去式 began）开始', 'The show begins at eight.', '行为与动作', '演出八点开始。'),
        w('g6-u2-22', 'win', '/wɪn/', 'v.', '（过去式 won）获胜', 'We can win the game.', '行为与动作', '我们能赢比赛。'),
        w('g6-u2-23', 'winner', '/ˈwɪnə(r)/', 'n.', '获胜的人（或队）；成功者', 'She is the winner.', '社会与环境', '她是获胜者。'),
        w('g6-u2-24', 'ever', '/ˈevə(r)/', 'adv.', '（加强语气）以往任何时候', 'This is the best game ever.', '品质与状态', '这是有史以来最好的比赛。'),
        w('g6-u2-25', 'exciting', '/ɪkˈsaɪtɪŋ/', 'adj.', '令人激动的', 'The match is exciting.', '情感与性格', '比赛很令人激动。'),
      ],
    },
    {
      id: 'g6-u3', title: 'Unit 3 · Healthy life', words: [
        w('g6-u3-1', 'cold', '/kəʊld/', 'n.', '感冒', 'I have a cold.', '行为与动作', '我感冒了。'),
        w('g6-u3-2', 'ill', '/ɪl/', 'adj.', '不舒服；有病', 'He feels ill.', '行为与动作', '他感觉不舒服。'),
        w('g6-u3-3', 'head', '/hed/', 'n.', '头；头部', 'My head hurts.', '行为与动作', '我头疼。'),
        w('g6-u3-4', 'runny nose', '/ˈrʌni nəʊz/', 'phrase.', '流鼻涕', 'I have a runny nose.', '行为与动作', '我流鼻涕。'),
        w('g6-u3-5', 'soon', '/suːn/', 'adv.', '很快；马上', 'He will be well soon.', '认知与学术', '他很快就会好。'),
        w('g6-u3-6', 'fever', '/ˈfiːvə(r)/', 'n.', '发烧；发热', 'She has a fever.', '行为与动作', '她发烧了。'),
        w('g6-u3-7', 'cough', '/kɒf/', 'n./v.', '咳嗽', 'He has a cough.', '行为与动作', '他咳嗽。'),
        w('g6-u3-8', 'discuss', '/dɪˈskʌs/', 'v.', '讨论；商量', 'We discuss the problem.', '行为与动作', '我们讨论这个问题。'),
        w('g6-u3-9', 'diet', '/ˈdaɪət/', 'n.', '日常饮食', 'Eat a healthy diet.', '行为与动作', '保持健康饮食。'),
        w('g6-u3-10', 'stay up', '/steɪ ʌp/', 'phrase.', '熬夜', 'Don\u2019t stay up late.', '行为与动作', '别熬夜。'),
        w('g6-u3-11', 'cry', '/kraɪ/', 'v.', '哭；哭泣', 'The baby cries.', '行为与动作', '婴儿哭了。'),
        w('g6-u3-12', 'another', '/əˈnʌðə(r)/', 'adj.', '另一；不同的（人或事物）', 'I want another apple.', '品质与状态', '我还想要一个苹果。'),
        w('g6-u3-13', 'call', '/kɔːl/', 'v.', '（给……）打电话', 'I will call you.', '行为与动作', '我会给你打电话。'),
        w('g6-u3-14', 'email', '/ˈiːmeɪl/', 'n.', '电子邮件', 'Send me an email.', '认知与学术', '给我发邮件。'),
        w('g6-u3-15', 'unhappy', '/ʌnˈhæpi/', 'adj.', '不快乐的；难过的', 'She is unhappy.', '情感与性格', '她不开心。'),
        w('g6-u3-16', 'glass', '/ɡlɑːs/', 'n.', '一杯（的量）；玻璃', 'A glass of water, please.', '社会与环境', '请来一杯水。'),
        w('g6-u3-17', 'may', '/meɪ/', 'modal.', '也许；可能', 'May I come in?', '行为与动作', '我可以进来吗？'),
        w('g6-u3-18', 'add', '/æd/', 'v.', '补充说；增加', 'Add some water.', '行为与动作', '加些水。'),
        w('g6-u3-19', 'video', '/ˈvɪdiəʊ/', 'n.', '视频；录像', 'We watch a video.', '认知与学术', '我们看视频。'),
        w('g6-u3-20', 'better', '/ˈbetə(r)/', 'adj.', '（病情）好转的；更好的', 'I feel better now.', '行为与动作', '我现在感觉好些了。'),
      ],
    },
    {
      id: 'g6-u4', title: 'Unit 4 · Managing money well', words: [
        w('g6-u4-1', 'money', '/ˈmʌni/', 'n.', '钱', 'I have some money.', '社会与环境', '我有一些钱。'),
        w('g6-u4-2', 'pocket money', '/ˈpɒkɪt ˈmʌni/', 'n.', '零花钱', 'I save my pocket money.', '社会与环境', '我攒零花钱。'),
        w('g6-u4-3', 'schoolbag', '/ˈskuːlbæɡ/', 'n.', '书包', 'My schoolbag is heavy.', '社会与环境', '我的书包很重。'),
        w('g6-u4-4', 'goods', '/ɡʊdz/', 'n.', '商品', 'The store sells goods.', '社会与环境', '商店卖商品。'),
        w('g6-u4-5', 'drink', '/drɪŋk/', 'n.', '饮料', 'I want a cold drink.', '社会与环境', '我想要冷饮。'),
        w('g6-u4-6', 'service', '/ˈsɜːvɪs/', 'n.', '服务', 'The service is good.', '社会与环境', '服务很好。'),
        w('g6-u4-7', 'haircut', '/ˈheəkʌt/', 'n.', '理发；发型', 'I need a haircut.', '行为与动作', '我需要理发。'),
        w('g6-u4-8', 'microscope', '/ˈmaɪkrəskəʊp/', 'n.', '显微镜', 'We look at cells with a microscope.', '认知与学术', '我们用显微镜看细胞。'),
        w('g6-u4-9', 'lucky', '/ˈlʌki/', 'adj.', '幸运的', 'You are lucky.', '品质与状态', '你很幸运。'),
        w('g6-u4-10', 'save up', '/seɪv ʌp/', 'phrase.', '攒钱；储蓄', 'I save up for a bike.', '行为与动作', '我攒钱买自行车。'),
        w('g6-u4-11', 'sale', '/seɪl/', 'n.', '特价销售；出售', 'The shoes are on sale.', '社会与环境', '鞋子在特价。'),
        w('g6-u4-12', 'ticket', '/ˈtɪkɪt/', 'n.', '票', 'I have a bus ticket.', '社会与环境', '我有一张车票。'),
        w('g6-u4-13', 'manage', '/ˈmænɪdʒ/', 'v.', '管理', 'She manages the money.', '行为与动作', '她管理钱。'),
        w('g6-u4-14', 'difficult', '/ˈdɪfɪkəlt/', 'adj.', '困难的', 'This question is difficult.', '品质与状态', '这个问题很难。'),
        w('g6-u4-15', 'sell', '/sel/', 'v.', '出售；售卖', 'We sell old books.', '行为与动作', '我们卖旧书。'),
        w('g6-u4-16', 'jar', '/dʒɑː(r)/', 'n.', '罐子', 'There is a jar of jam.', '社会与环境', '有一罐果酱。'),
        w('g6-u4-17', 'half', '/hɑːf/', 'n.', '一半', 'I ate half of the cake.', '品质与状态', '我吃了半个蛋糕。'),
        w('g6-u4-18', 'for example', '/ɪɡˈzɑːmpl/', 'phrase.', '例如', 'For example, apples are fruit.', '认知与学术', '例如，苹果是水果。'),
      ],
    },
    {
      id: 'g6-u5', title: 'Unit 5 · Exploring space', words: [
        w('g6-u5-1', 'planet', '/ˈplænɪt/', 'n.', '行星', 'Mars is a planet.', '认知与学术', '火星是行星。'),
        w('g6-u5-2', 'earth', '/ɜːθ/', 'n.', '地球', 'We live on the Earth.', '社会与环境', '我们生活在地球上。'),
        w('g6-u5-3', 'sky', '/skaɪ/', 'n.', '天；天空', 'The sky is blue.', '社会与环境', '天空是蓝的。'),
        w('g6-u5-4', 'daytime', '/ˈdeɪtaɪm/', 'n.', '白天', 'It is hot in the daytime.', '认知与学术', '白天很热。'),
        w('g6-u5-5', 'cloud', '/klaʊd/', 'n.', '云', 'The cloud is white.', '社会与环境', '云是白的。'),
        w('g6-u5-6', 'moon', '/muːn/', 'n.', '月球；月亮；卫星', 'The moon is bright.', '社会与环境', '月亮很亮。'),
        w('g6-u5-7', 'star', '/stɑː(r)/', 'n.', '恒星；星', 'I see a star.', '社会与环境', '我看到一颗星星。'),
        w('g6-u5-8', 'space', '/speɪs/', 'n.', '太空；空间', 'The rocket goes into space.', '认知与学术', '火箭进入太空。'),
        w('g6-u5-9', 'outer space', '/ˈaʊtə speɪs/', 'n.', '外层空间；外太空', 'Astronauts work in outer space.', '认知与学术', '宇航员在外太空工作。'),
        w('g6-u5-10', 'space station', '/speɪs ˈsteɪʃn/', 'n.', '空间站', 'They live on a space station.', '认知与学术', '他们住在空间站。'),
        w('g6-u5-11', 'ocean', '/ˈəʊʃn/', 'n.', '大海；海洋', 'The ocean is big.', '社会与环境', '海洋很大。'),
        w('g6-u5-12', 'marble', '/ˈmɑːbl/', 'n.', '（玻璃）弹子', 'The Earth looks like a marble.', '社会与环境', '地球看起来像一颗玻璃弹珠。'),
        w('g6-u5-13', 'satellite', '/ˈsætəlaɪt/', 'n.', '人造卫星', 'China sends up a satellite.', '认知与学术', '中国发射卫星。'),
        w('g6-u5-14', 'soil', '/sɔɪl/', 'n.', '土壤', 'Plants grow in the soil.', '社会与环境', '植物在土壤里生长。'),
        w('g6-u5-15', 'alien', '/ˈeɪliən/', 'n.', '外星生物', 'Are there aliens?', '认知与学术', '有外星人吗？'),
        w('g6-u5-16', 'sunrise', '/ˈsʌnraɪz/', 'n.', '日出', 'We watch the sunrise.', '社会与环境', '我们看日出。'),
        w('g6-u5-17', 'rover', '/ˈrəʊvə(r)/', 'n.', '探测器', 'China put a rover on Mars.', '认知与学术', '中国把探测器送上火星。'),
        w('g6-u5-18', 'into', '/ˈɪntə/', 'prep.', '朝；进入', 'The cat runs into the room.', '行为与动作', '猫跑进房间。'),
        w('g6-u5-19', 'telescope', '/ˈtelɪskəʊp/', 'n.', '望远镜', 'We look at stars with a telescope.', '认知与学术', '我们用望远镜看星星。'),
        w('g6-u5-20', 'astronaut', '/ˈæstrənɔːt/', 'n.', '宇航员；航天员', 'She wants to be an astronaut.', '社会与环境', '她想当宇航员。'),
        w('g6-u5-21', 'spaceship', '/ˈspeɪsʃɪp/', 'n.', '宇宙飞船', 'The spaceship is fast.', '认知与学术', '宇宙飞船很快。'),
        w('g6-u5-22', 'month', '/mʌnθ/', 'n.', '月；月份', 'There are twelve months in a year.', '认知与学术', '一年有十二个月。'),
        w('g6-u5-23', 'taikonaut', '/ˈtaɪkənɔːt/', 'n.', '中国航天员', 'The taikonauts work in space.', '社会与环境', '中国航天员在太空工作。'),
        w('g6-u5-24', 'cloth', '/klɒθ/', 'n.', '（一块）布；织物', 'I clean with a cloth.', '社会与环境', '我用布擦拭。'),
        w('g6-u5-25', 'toothpaste', '/ˈtuːθpeɪst/', 'n.', '牙膏', 'I need some toothpaste.', '社会与环境', '我需要牙膏。'),
        w('g6-u5-26', 'question', '/ˈkwestʃən/', 'n.', '问题', 'I have a question.', '认知与学术', '我有一个问题。'),
        w('g6-u5-27', 'sunset', '/ˈsʌnset/', 'n.', '日落', 'The sunset is beautiful.', '社会与环境', '日落很美。'),
        w('g6-u5-28', 'time', '/taɪm/', 'n.', '次；回', 'I read books three times a week.', '认知与学术', '我每周读三次书。'),
        w('g6-u5-29', 'Mars', '/mɑːz/', 'n.', '火星', 'Is there water on Mars?', '认知与学术', '火星上有水吗？'),
      ],
    },
    {
      id: 'g6-u6', title: 'Unit 6 · Energy, nature and us', words: [
        w('g6-u6-1', 'power', '/ˈpaʊə(r)/', 'n.', '能；能量', 'The sun gives us power.', '社会与环境', '太阳给我们能量。'),
        w('g6-u6-2', 'electricity', '/ɪˌlekˈtrɪsəti/', 'n.', '电', 'We use electricity at home.', '认知与学术', '我们家里用电。'),
        w('g6-u6-3', 'solar', '/ˈsəʊlə(r)/', 'adj.', '太阳的', 'Solar energy is clean.', '社会与环境', '太阳能是清洁的。'),
        w('g6-u6-4', 'type', '/taɪp/', 'n.', '类型；种类', 'What type of book is this?', '品质与状态', '这是什么类型的书？'),
        w('g6-u6-5', 'energy', '/ˈenədʒi/', 'n.', '能源', 'We need energy to run.', '社会与环境', '我们跑步需要能量。'),
        w('g6-u6-6', 'source', '/sɔːs/', 'n.', '来源', 'The sun is a source of energy.', '认知与学术', '太阳是能量来源。'),
        w('g6-u6-7', 'light', '/laɪt/', 'v.', '照亮', 'The sun lights the room.', '社会与环境', '太阳照亮房间。'),
        w('g6-u6-8', 'heat', '/hiːt/', 'v.', '加热；（使）变暖；热量', 'The fire heats the room.', '社会与环境', '火使房间变暖。'),
        w('g6-u6-9', 'cool', '/kuːl/', 'v.', '（使）变凉，冷却', 'The fan cools the air.', '社会与环境', '风扇使空气变凉。'),
        w('g6-u6-10', 'run', '/rʌn/', 'v.', '使运行', 'The machine runs fast.', '行为与动作', '机器运转很快。'),
        w('g6-u6-11', 'resource', '/rɪˈsɔːs/', 'n.', '资源', 'Water is a resource.', '社会与环境', '水是资源。'),
        w('g6-u6-12', 'run out', '/rʌn aʊt/', 'phrase.', '用完', 'Our water will run out.', '社会与环境', '我们的水会用完。'),
        w('g6-u6-13', 'few', '/fjuː/', 'adj.', '不多；很少', 'There are few birds.', '品质与状态', '几乎没有鸟。'),
        w('g6-u6-14', 'change', '/tʃeɪndʒ/', 'v.', '（使）不同；改变', 'We can change our habits.', '行为与动作', '我们能改变习惯。'),
        w('g6-u6-15', 'quick', '/kwɪk/', 'adj.', '迅速的；快的', 'He is quick.', '品质与状态', '他很快。'),
        w('g6-u6-16', 'shower', '/ˈʃaʊə(r)/', 'n.', '淋浴', 'I take a shower in the morning.', '行为与动作', '我早上洗澡。'),
        w('g6-u6-17', 'unplug', '/ʌnˈplʌɡ/', 'v.', '拔掉……的电源插头', 'Unplug the computer.', '行为与动作', '拔掉电脑电源。'),
        w('g6-u6-18', 'difference', '/ˈdɪfrəns/', 'n.', '差别；不同（之处）', 'The difference is small.', '品质与状态', '差别很小。'),
        w('g6-u6-19', 'reduce', '/rɪˈdjuːs/', 'v.', '减少', 'We should reduce waste.', '行为与动作', '我们应该减少浪费。'),
        w('g6-u6-20', 'air conditioner', '/ˈeə kənˈdɪʃənə(r)/', 'n.', '空调机', 'Turn on the air conditioner.', '社会与环境', '打开空调。'),
        w('g6-u6-21', 'drive', '/draɪv/', 'v.', '驾驶；开车', 'My father drives to work.', '行为与动作', '我爸爸开车上班。'),
        w('g6-u6-22', 'reuse', '/ˌriːˈjuːz/', 'v.', '再次使用；重复使用', 'We can reuse bottles.', '行为与动作', '我们能重复使用瓶子。'),
        w('g6-u6-23', 'own', '/əʊn/', 'adj.', '自己的', 'I have my own room.', '品质与状态', '我有自己的房间。'),
        w('g6-u6-24', 'market', '/ˈmɑːkɪt/', 'n.', '集市；市场', 'We buy vegetables at the market.', '社会与环境', '我们在市场买菜。'),
        w('g6-u6-25', 'bottle', '/ˈbɒtl/', 'n.', '瓶子', 'The bottle is empty.', '社会与环境', '瓶子是空的。'),
        w('g6-u6-26', 'top', '/tɒp/', 'n.', '（位置、级别或程度）最高的', 'The top of the mountain is high.', '品质与状态', '山顶很高。'),
        w('g6-u6-27', 'useful', '/ˈjuːsfl/', 'adj.', '有用的；有益的', 'This tool is useful.', '品质与状态', '这个工具很有用。'),
        w('g6-u6-28', 'dirty', '/ˈdɜːti/', 'adj.', '脏的', 'The water is dirty.', '品质与状态', '水是脏的。'),
        w('g6-u6-29', 'side', '/saɪd/', 'n.', '一面；一边', 'Sit on this side.', '社会与环境', '坐这一边。'),
      ],
    },
  ],
};

const GRADE6B_BOOK: VocabBook = {
  id: 'primary-g6b', name: '人教PEP小学英语·六年级下册', stage: '小学英语', builtin: true,
  desc: '人教PEP六年级下册，4 个教学单元（How tall are you? / Last weekend / Where did you go? / Then and now），78 词', wordCount: 78,
  units: [
    {
      id: 'g6b-u1', title: 'Unit 1 · How tall are you?', words: [
        w('g6b-u1-1', 'younger', '/ˈjʌŋɡə(r)/', 'adj.', '（young 的比较级）更年轻的', 'She is younger than me.', '品质与状态', '她比我年轻。'),
        w('g6b-u1-2', 'older', '/ˈəʊldə(r)/', 'adj.', '（old 的比较级）更年长的', 'My brother is older.', '品质与状态', '我哥哥更大。'),
        w('g6b-u1-3', 'taller', '/ˈtɔːlə(r)/', 'adj.', '（tall 的比较级）更高的', 'He is taller than Tom.', '品质与状态', '他比汤姆高。'),
        w('g6b-u1-4', 'shorter', '/ˈʃɔːtə(r)/', 'adj.', '（short 的比较级）更矮的；更短的', 'This ruler is shorter.', '品质与状态', '这把尺子更短。'),
        w('g6b-u1-5', 'longer', '/ˈlɒŋɡə(r)/', 'adj.', '（long 的比较级）更长的', 'The river is longer.', '品质与状态', '这条河更长。'),
        w('g6b-u1-6', 'thinner', '/ˈθɪnə(r)/', 'adj.', '（thin 的比较级）更瘦的', 'She is thinner now.', '品质与状态', '她现在更瘦了。'),
        w('g6b-u1-7', 'heavier', '/ˈheviə(r)/', 'adj.', '（heavy 的比较级）更重的', 'The box is heavier.', '品质与状态', '这个箱子更重。'),
        w('g6b-u1-8', 'bigger', '/ˈbɪɡə(r)/', 'adj.', '（big 的比较级）更大的', 'This apple is bigger.', '品质与状态', '这个苹果更大。'),
        w('g6b-u1-9', 'smaller', '/ˈsmɔːlə(r)/', 'adj.', '（small 的比较级）更小的', 'My bag is smaller.', '品质与状态', '我的包更小。'),
        w('g6b-u1-10', 'stronger', '/ˈstrɒŋɡə(r)/', 'adj.', '（strong 的比较级）更强壮的', 'He is stronger than before.', '品质与状态', '他比以前更强壮。'),
        w('g6b-u1-11', 'dinosaur', '/ˈdaɪnəsɔː(r)/', 'n.', '恐龙', 'The dinosaur is huge.', '社会与环境', '恐龙很大。'),
        w('g6b-u1-12', 'hall', '/hɔːl/', 'n.', '大厅；礼堂', 'We meet in the hall.', '社会与环境', '我们在大厅集合。'),
        w('g6b-u1-13', 'metre', '/ˈmiːtə(r)/', 'n.', '（=meter）米', 'It is two metres tall.', '认知与学术', '它有两米高。'),
        w('g6b-u1-14', 'than', '/ðæn/', 'conj.', '比', 'You are taller than me.', '认知与学术', '你比我高。'),
        w('g6b-u1-15', 'both', '/bəʊθ/', 'pron.', '两个都', 'Both of us like English.', '认知与学术', '我们俩都喜欢英语。'),
        w('g6b-u1-16', 'kilogram', '/ˈkɪləɡræm/', 'n.', '（=kg）千克；公斤', 'It weighs 50 kilograms.', '认知与学术', '它重 50 公斤。'),
        w('g6b-u1-17', 'countryside', '/ˈkʌntrisaɪd/', 'n.', '乡村；农村', 'We live in the countryside.', '社会与环境', '我们住在乡下。'),
        w('g6b-u1-18', 'lower', '/ˈləʊə(r)/', 'adj.', '（low 的比较级）更低的', 'The sun is lower now.', '品质与状态', '太阳更低了。'),
        w('g6b-u1-19', 'shadow', '/ˈʃædəʊ/', 'n.', '影子；阴影', 'My shadow is long.', '社会与环境', '我的影子很长。'),
        w('g6b-u1-20', 'smarter', '/ˈsmɑːtə(r)/', 'adj.', '（smart 的比较级）更聪明的', 'He is smarter than me.', '情感与性格', '他比我聪明。'),
        w('g6b-u1-21', 'become', '/bɪˈkʌm/', 'v.', '（过去式 became）开始变得；变成', 'It becomes warm in spring.', '行为与动作', '春天天气变暖。'),
      ],
    },
    {
      id: 'g6b-u2', title: 'Unit 2 · Last weekend', words: [
        w('g6b-u2-1', 'cleaned', '/kliːnd/', 'v.', '（clean 的过去式）打扫', 'I cleaned my room.', '行为与动作', '我打扫了房间。'),
        w('g6b-u2-2', 'stayed', '/steɪd/', 'v.', '（stay 的过去式）停留；待', 'I stayed at home.', '行为与动作', '我待在家里。'),
        w('g6b-u2-3', 'washed', '/wɒʃt/', 'v.', '（wash 的过去式）洗', 'She washed her clothes.', '行为与动作', '她洗了衣服。'),
        w('g6b-u2-4', 'watched', '/wɒtʃt/', 'v.', '（watch 的过去式）看；观看', 'We watched TV.', '行为与动作', '我们看了电视。'),
        w('g6b-u2-5', 'had a cold', '/hæd ə kəʊld/', 'phrase.', '（have a cold 的过去式）感冒', 'He had a cold last week.', '行为与动作', '他上周感冒了。'),
        w('g6b-u2-6', 'slept', '/slept/', 'v.', '（sleep 的过去式）睡觉', 'I slept well.', '行为与动作', '我睡得很好。'),
        w('g6b-u2-7', 'read', '/red/', 'v.', '（read 的过去式，读 /red/）阅读', 'I read a book yesterday.', '行为与动作', '我昨天读了一本书。'),
        w('g6b-u2-8', 'saw', '/sɔː/', 'v.', '（see 的过去式）看见', 'I saw a film.', '行为与动作', '我看了一场电影。'),
        w('g6b-u2-9', 'last', '/lɑːst/', 'adj.', '最近过去的；上一个的', 'I saw him last week.', '认知与学术', '我上周见到他。'),
        w('g6b-u2-10', 'yesterday', '/ˈjestədeɪ/', 'adv.', '昨天', 'I was busy yesterday.', '认知与学术', '我昨天很忙。'),
        w('g6b-u2-11', 'before', '/bɪˈfɔː(r)/', 'adv.', '以前；过去', 'He had no hair before.', '认知与学术', '他以前没有头发。'),
        w('g6b-u2-12', 'drank', '/dræŋk/', 'v.', '（drink 的过去式）喝', 'I drank some tea.', '行为与动作', '我喝了些茶。'),
        w('g6b-u2-13', 'show', '/ʃəʊ/', 'n.', '演出；节目', 'We watched a TV show.', '认知与学术', '我们看了个电视节目。'),
        w('g6b-u2-14', 'magazine', '/ˌmæɡəˈziːn/', 'n.', '杂志', 'I read a magazine.', '认知与学术', '我读了一本杂志。'),
        w('g6b-u2-15', 'film', '/fɪlm/', 'n.', '电影', 'The film is interesting.', '认知与学术', '这部电影很有趣。'),
        w('g6b-u2-16', 'saw a film', '/sɔː ə fɪlm/', 'phrase.', '看电影', 'I saw a film last night.', '行为与动作', '我昨晚看了电影。'),
        w('g6b-u2-17', 'went fishing', '/went ˈfɪʃɪŋ/', 'phrase.', '去钓鱼', 'We went fishing.', '行为与动作', '我们去钓鱼了。'),
        w('g6b-u2-18', 'fixed', '/fɪkst/', 'v.', '（fix 的过去式）修理；修补', 'He fixed the chair.', '行为与动作', '他修好了椅子。'),
        w('g6b-u2-19', 'broken', '/ˈbrəʊkən/', 'adj.', '破损的；坏掉的', 'The cup is broken.', '品质与状态', '杯子破了。'),
        w('g6b-u2-20', 'louder', '/ˈlaʊdə(r)/', 'adj.', '（loud 的比较级）更大声的', 'Please speak louder.', '品质与状态', '请说大声点。'),
      ],
    },
    {
      id: 'g6b-u3', title: 'Unit 3 · Where did you go?', words: [
        w('g6b-u3-1', 'went', '/went/', 'v.', '（go 的过去式）去', 'I went to Sanya.', '行为与动作', '我去了三亚。'),
        w('g6b-u3-2', 'camp', '/kæmp/', 'n./v.', '野营；营地', 'We set up a camp.', '行为与动作', '我们搭起营地。'),
        w('g6b-u3-3', 'went camping', '/went ˈkæmpɪŋ/', 'phrase.', '去野营', 'We went camping last summer.', '行为与动作', '去年夏天我们去野营。'),
        w('g6b-u3-4', 'fish', '/fɪʃ/', 'v./n.', '钓鱼；鱼', 'I like to fish.', '行为与动作', '我喜欢钓鱼。'),
        w('g6b-u3-5', 'went fishing', '/went ˈfɪʃɪŋ/', 'phrase.', '去钓鱼', 'He went fishing by the lake.', '行为与动作', '他去湖边钓鱼了。'),
        w('g6b-u3-6', 'rode', '/rəʊd/', 'v.', '（ride 的过去式）骑', 'I rode a horse.', '行为与动作', '我骑了马。'),
        w('g6b-u3-7', 'hurt', '/hɜːt/', 'v.', '（hurt 的过去式）（使）受伤；疼痛', 'I hurt my foot.', '行为与动作', '我弄伤了脚。'),
        w('g6b-u3-8', 'ate', '/eɪt/', 'v.', '（eat 的过去式）吃', 'We ate fresh food.', '行为与动作', '我们吃了新鲜食物。'),
        w('g6b-u3-9', 'took pictures', '/tʊk ˈpɪktʃəz/', 'phrase.', '照相；拍照', 'I took pictures of the park.', '行为与动作', '我拍了公园的照片。'),
        w('g6b-u3-10', 'bought', '/bɔːt/', 'v.', '（buy 的过去式）买', 'She bought a gift.', '行为与动作', '她买了一份礼物。'),
        w('g6b-u3-11', 'gift', '/ɡɪft/', 'n.', '礼物', 'This is a birthday gift.', '社会与环境', '这是生日礼物。'),
        w('g6b-u3-12', 'Labour Day', '/ˈleɪbə deɪ/', 'n.', '劳动节', 'We had a holiday on Labour Day.', '社会与环境', '劳动节我们放假。'),
        w('g6b-u3-13', 'mule', '/mjuːl/', 'n.', '骡子', 'He rode a mule.', '社会与环境', '他骑了骡子。'),
        w('g6b-u3-14', 'Turpan', '/tʊəˈpɑːn/', 'n.', '吐鲁番', 'Turpan is in Xinjiang.', '社会与环境', '吐鲁番在新疆。'),
        w('g6b-u3-15', 'could', '/kʊd/', 'modal.', '（can 的过去式）能；会', 'I could swim at five.', '行为与动作', '我五岁就会游泳。'),
        w('g6b-u3-16', 'till', '/tɪl/', 'prep.', '直到', 'We waited till six.', '认知与学术', '我们等到六点。'),
        w('g6b-u3-17', 'beach', '/biːtʃ/', 'n.', '海滩；沙滩', 'We played on the beach.', '社会与环境', '我们在沙滩上玩。'),
        w('g6b-u3-18', 'basket', '/ˈbɑːskɪt/', 'n.', '篮；筐', 'There is a basket of fruit.', '社会与环境', '有一篮子水果。'),
        w('g6b-u3-19', 'part', '/pɑːt/', 'n.', '部分', 'Which part do you like?', '认知与学术', '你喜欢哪一部分？'),
        w('g6b-u3-20', 'licked', '/lɪkt/', 'v.', '（lick 的过去式）舔', 'The dog licked my hand.', '行为与动作', '狗舔了我的手。'),
        w('g6b-u3-21', 'laughed', '/lɑːft/', 'v.', '（laugh 的过去式）笑', 'We laughed happily.', '行为与动作', '我们开心地笑了。'),
      ],
    },
    {
      id: 'g6b-u4', title: 'Unit 4 · Then and now', words: [
        w('g6b-u4-1', 'dining hall', '/ˈdaɪnɪŋ hɔːl/', 'n.', '餐厅；食堂', 'We eat in the dining hall.', '社会与环境', '我们在食堂吃饭。'),
        w('g6b-u4-2', 'grass', '/ɡrɑːs/', 'n.', '草坪；草', 'Don\u2019t walk on the grass.', '社会与环境', '不要踩草坪。'),
        w('g6b-u4-3', 'gym', '/dʒɪm/', 'n.', '体育馆；健身房', 'We play basketball in the gym.', '社会与环境', '我们在体育馆打篮球。'),
        w('g6b-u4-4', 'ago', '/əˈɡəʊ/', 'adv.', '以前', 'I lived here five years ago.', '认知与学术', '我五年前住在这里。'),
        w('g6b-u4-5', 'cycling', '/ˈsaɪklɪŋ/', 'n.', '骑自行车运动', 'I like cycling.', '行为与动作', '我喜欢骑自行车。'),
        w('g6b-u4-6', 'go cycling', '/ɡəʊ ˈsaɪklɪŋ/', 'phrase.', '去骑自行车', 'We go cycling on Sundays.', '行为与动作', '我们周日骑车。'),
        w('g6b-u4-7', 'ice-skate', '/ˈaɪs skeɪt/', 'v.', '滑冰', 'They can ice-skate.', '行为与动作', '他们会滑冰。'),
        w('g6b-u4-8', 'badminton', '/ˈbædmɪntən/', 'n.', '羽毛球运动', 'We play badminton.', '行为与动作', '我们打羽毛球。'),
        w('g6b-u4-9', 'was', '/wəz/', 'v.', '（am/is 的过去式）是', 'I was short then.', '行为与动作', '我那时很矮。'),
        w('g6b-u4-10', 'were', '/wɜː(r)/', 'v.', '（are 的过去式）是', 'They were young.', '行为与动作', '他们那时很年轻。'),
        w('g6b-u4-11', 'no', '/nəʊ/', 'adj.', '没有的；全无的', 'There was no library.', '品质与状态', '（那时）没有图书馆。'),
        w('g6b-u4-12', 'internet', '/ˈɪntənet/', 'n.', '互联网', 'We look it up on the internet.', '认知与学术', '我们在网上查。'),
        w('g6b-u4-13', 'computer', '/kəmˈpjuːtə(r)/', 'n.', '计算机；电脑', 'We use computers at school.', '认知与学术', '我们在学校用电脑。'),
        w('g6b-u4-14', 'active', '/ˈæktɪv/', 'adj.', '积极的；活跃的', 'He is active in class.', '情感与性格', '他在课堂上很积极。'),
        w('g6b-u4-15', 'race', '/reɪs/', 'n.', '赛跑', 'He won the race.', '行为与动作', '他赢了赛跑。'),
        w('g6b-u4-16', 'nothing', '/ˈnʌθɪŋ/', 'pron.', '没有什么；没有一件东西', 'There is nothing in the box.', '品质与状态', '盒子里什么都没有。'),
      ],
    },
  ],
};

export const VOCAB_BOOKS: VocabBook[] = [
  GRADE1_BOOK,
  GRADE1B_BOOK,
  GRADE2_BOOK,
  GRADE2B_BOOK,
  PRIMARY_BOOK,
  PRIMARYB_BOOK,
  GRADE4_BOOK,
  GRADE4B_BOOK,
  GRADE5_BOOK,
  GRADE5B_BOOK,
  GRADE6_BOOK,
  GRADE6B_BOOK,
  ...JUNIOR_LIST,
  // 高中
  {
    id: 'senior-eb',
    name: '外研版高中英语必修第一册（2019）',
    stage: '高中英语',
    wordCount: SENIOR_WORDS.length,
    builtin: true,
    desc: '高中课标教材',
    units: [
      { id: 'senior-eb-u1', title: 'Unit 1 · 高中核心词汇', words: SENIOR_WORDS.slice(0, 9) },
      { id: 'senior-eb-u2', title: 'Unit 2 · 高中核心词汇', words: SENIOR_WORDS.slice(9) },
    ],
  },
  {
    id: 'senior-hk',
    name: '人教版高中英语必修第一册（2019）',
    stage: '高中英语',
    wordCount: 280,
    builtin: true,
    desc: '人教社2019高中课标教材，Welcome Unit + Unit1-5 完整词表',
    units: [
      {
        id: 'senior-hk-u0',
        title: 'Welcome Unit · 高中初印象',
        words: [
          w('s1u0-1', 'exchange', '/ɪksˈtʃeɪndʒ/', 'n./vt.', '交换；交流', 'We had an exchange student.', '行为与动作', '我们有个交换生。', {
            phrases: [{en: 'in exchange for', zh: '作为交换'}, {en: 'exchange student', zh: '交换生'}],
            }),
          w('s1u0-2', 'lecture', '/ˈlektʃə(r)/', 'n.', '讲座；讲课', 'The lecture was interesting.', '认知与学术', '讲座很有趣。', {
            phrases: [{en: 'give a lecture', zh: '讲课；演讲'}, {en: 'attend a lecture', zh: '听讲座'}],
            }),
          w('s1u0-3', 'registration', '/ˌredʒɪˈstreɪʃn/', 'n.', '登记；注册', 'Registration is on Monday.', '认知与学术', '周一注册。', {
            phrases: [{en: 'registration form', zh: '登记表'}, {en: 'online registration', zh: '网上注册'}],
            }),
          w('s1u0-4', 'register', '/ˈredʒɪstə(r)/', 'v.', '登记；注册', 'Register before Friday.', '行为与动作', '周五前注册。', {
            phrases: [{en: 'register for', zh: '报名参加'}, {en: 'register a company', zh: '注册公司'}],
            }),
          w('s1u0-5', 'female', '/ˈfiːmeɪl/', 'adj./n.', '女性的；雌性的', 'She is a female doctor.', '社会与环境', '她是女医生。', {
            phrases: [{en: 'female student', zh: '女学生'}, {en: 'female bird', zh: '雌鸟'}],
            }),
          w('s1u0-6', 'male', '/meɪl/', 'adj./n.', '男性的；雄性的', 'The male bird is colorful.', '社会与环境', '雄鸟色彩鲜艳。', {
            phrases: [{en: 'male student', zh: '男学生'}, {en: 'male nurse', zh: '男护士'}],
            }),
          w('s1u0-7', 'nationality', '/ˌnæʃəˈnæləti/', 'n.', '国籍；民族', 'What is your nationality?', '社会与环境', '你是什么国籍？', {
            phrases: [{en: 'dual nationality', zh: '双重国籍'}, {en: 'minority nationality', zh: '少数民族'}],
            }),
          w('s1u0-8', 'nation', '/ˈneɪʃn/', 'n.', '国家；民族', 'The whole nation celebrated.', '社会与环境', '举国欢庆。', {
            phrases: [{en: 'the whole nation', zh: '举国'}, {en: 'developed nation', zh: '发达国家'}],
            }),
          w('s1u0-9', 'design', '/dɪˈzaɪn/', 'v./n.', '设计；筹划', 'She designs websites.', '行为与动作', '她设计网站。', {
            phrases: [{en: 'design a plan', zh: '制定计划'}, {en: 'fashion design', zh: '时装设计'}],
            }),
          w('s1u0-10', 'campus', '/ˈkæmpəs/', 'n.', '校园；校区', 'The campus is beautiful.', '社会与环境', '校园很美。', {
            phrases: [{en: 'on campus', zh: '在校园里'}, {en: 'campus life', zh: '校园生活'}],
            }),
          w('s1u0-11', 'formal', '/ˈfɔːml/', 'adj.', '正式的；正规的', 'Wear formal clothes.', '品质与状态', '穿正装。', {
            phrases: [{en: 'formal education', zh: '正规教育'}, {en: 'formal dinner', zh: '正式晚宴'}],
            }),
          w('s1u0-12', 'anxious', '/ˈæŋkʃəs/', 'adj.', '焦虑的；不安的', 'She feels anxious.', '情感与性格', '她感到焦虑。', {
            phrases: [{en: 'be anxious about', zh: '为……担心'}, {en: 'be anxious to do', zh: '渴望做'}],
            }),
          w('s1u0-13', 'annoyed', '/əˈnɔɪd/', 'adj.', '恼怒的；生气的', 'He was annoyed at the delay.', '情感与性格', '他因延误生气。', {
            phrases: [{en: 'be annoyed with sb', zh: '对某人生气'}, {en: 'be annoyed at sth', zh: '对某事生气'}],
            }),
          w('s1u0-14', 'frightened', '/ˈfraɪtnd/', 'adj.', '惊吓的；害怕的', 'The frightened child cried.', '情感与性格', '受惊的孩子哭了。', {
            phrases: [{en: 'be frightened of', zh: '害怕……'}, {en: 'be frightened to do', zh: '不敢做'}],
            }),
          w('s1u0-15', 'senior', '/ˈsiːniə(r)/', 'adj./n.', '级别高的；较年长的', 'He is a senior student.', '社会与环境', '他是高年级学生。', {
            phrases: [{en: 'senior high school', zh: '高中'}, {en: 'be senior to', zh: '比……年长/职位高'}],
            }),
          w('s1u0-16', 'outgoing', '/ˈaʊtɡəʊɪŋ/', 'adj.', '爱交际的；外向的', 'She is outgoing.', '情感与性格', '她很外向。', {
            phrases: [{en: 'outgoing personality', zh: '外向性格'}, {en: 'outgoing people', zh: '外向的人'}],
            }),
          w('s1u0-17', 'impression', '/ɪmˈpreʃn/', 'n.', '印象；感想', 'First impressions matter.', '认知与学术', '第一印象很重要。', {
            phrases: [{en: 'leave an impression', zh: '留下印象'}, {en: 'first impression', zh: '第一印象'}],
            }),
          w('s1u0-18', 'impress', '/ɪmˈpres/', 'vt.', '使钦佩；留下印象', 'Her speech impressed me.', '行为与动作', '她的演讲打动了我。', {
            phrases: [{en: 'impress sb with sth', zh: '用……打动某人'}, {en: 'be impressed by', zh: '被……打动'}],
            }),
          w('s1u0-19', 'guy', '/ɡaɪ/', 'n.', '小伙子；家伙', 'That guy is my friend.', '社会与环境', '那家伙是我朋友。', {
            phrases: [{en: 'a nice guy', zh: '好人'}, {en: 'you guys', zh: '你们大家'}],
            }),
          w('s1u0-20', 'concentrate', '/ˈkɒnsntreɪt/', 'v.', '集中注意力', 'Concentrate on your work.', '行为与动作', '专心工作。', {
            phrases: [{en: 'concentrate on', zh: '专注于'}, {en: 'concentrate one\'s mind', zh: '集中思想'}],
            }),
          w('s1u0-21', 'experiment', '/ɪkˈsperɪmənt/', 'n.', '实验；试验', 'The experiment worked.', '认知与学术', '实验成功了。', {
            phrases: [{en: 'do an experiment', zh: '做实验'}, {en: 'scientific experiment', zh: '科学实验'}],
            }),
          w('s1u0-22', 'awkward', '/ˈɔːkwəd/', 'adj.', '令人尴尬的；难对付的', 'An awkward silence followed.', '情感与性格', '一阵尴尬的沉默。', {
            phrases: [{en: 'awkward silence', zh: '尴尬的沉默'}, {en: 'awkward situation', zh: '尴尬的局面'}],
            }),
          w('s1u0-23', 'junior', '/ˈdʒuːniə(r)/', 'adj./n.', '地位低下的；青少年', 'He is junior to me.', '社会与环境', '他职位比我低。', {
            phrases: [{en: 'junior high school', zh: '初中'}, {en: 'be junior to', zh: '比……年少/职位低'}],
            }),
          w('s1u0-24', 'explore', '/ɪkˈsplɔː(r)/', 'v.', '探索；勘探', 'Explore the new city.', '行为与动作', '探索新城市。', {
            phrases: [{en: 'explore the world', zh: '探索世界'}, {en: 'explore possibilities', zh: '探索可能性'}],
            }),
          w('s1u0-25', 'confident', '/ˈkɒnfɪdənt/', 'adj.', '自信的；有把握的', 'She is confident.', '情感与性格', '她很自信。', {
            phrases: [{en: 'be confident about', zh: '对……有信心'}, {en: 'confident smile', zh: '自信的微笑'}],
            }),
          w('s1u0-26', 'confidence', '/ˈkɒnfɪdəns/', 'n.', '信心；信任', 'He has confidence in himself.', '品质与状态', '他有自信。', {
            phrases: [{en: 'have confidence in', zh: '信任'}, {en: 'with confidence', zh: '自信地'}],
            }),
          w('s1u0-27', 'forward', '/ˈfɔːwəd/', 'adv./adj.', '向前；前进', 'Step forward.', '行为与动作', '向前一步。', {
            phrases: [{en: 'look forward to', zh: '期待'}, {en: 'put forward', zh: '提出'}],
            }),
          w('s1u0-28', 'flash', '/flæʃ/', 'n./v.', '闪光；使闪耀', 'A flash of lightning.', '社会与环境', '一道闪电。', {
            phrases: [{en: 'a flash of', zh: '一闪'}, {en: 'flash back', zh: '闪回'}],
            }),
          w('s1u0-29', 'organize', '/ˈɔːɡənaɪz/', 'v.', '组织；筹备', 'Organize your time.', '行为与动作', '安排好时间。', {
            phrases: [{en: 'organize an activity', zh: '组织活动'}, {en: 'organize information', zh: '整理信息'}],
            }),
          w('s1u0-30', 'organization', '/ˌɔːɡənaɪˈzeɪʃn/', 'n.', '组织；团体；机构', 'It is a charity organization.', '社会与环境', '这是慈善机构。', {
            phrases: [{en: 'charity organization', zh: '慈善机构'}, {en: 'international organization', zh: '国际组织'}],
            }),
          w('s1u0-31', 'goal', '/ɡəʊl/', 'n.', '目标；球门', 'Set a clear goal.', '认知与学术', '设定明确目标。', {
            phrases: [{en: 'achieve a goal', zh: '实现目标'}, {en: 'score a goal', zh: '进球'}],
            }),
          w('s1u0-32', 'strategy', '/ˈstrætədʒi/', 'n.', '策略；策划', 'A good strategy wins.', '认知与学术', '好策略致胜。', {
            phrases: [{en: 'marketing strategy', zh: '营销策略'}, {en: 'develop a strategy', zh: '制定策略'}],
            }),
          w('s1u0-33', 'partner', '/ˈpɑːtnə(r)/', 'n.', '同伴；配偶；合伙人', 'Practice with a partner.', '社会与环境', '和同伴一起练习。', {
            phrases: [{en: 'business partner', zh: '商业伙伴'}, {en: 'dance partner', zh: '舞伴'}],
            }),
          w('s1u0-34', 'improve', '/ɪmˈpruːv/', 'v.', '改进；改善', 'Improve your English.', '行为与动作', '提高英语。', {
            phrases: [{en: 'improve on', zh: '对……加以改进'}, {en: 'improve oneself', zh: '提高自我'}],
            }),
          w('s1u0-35', 'curious', '/ˈkjʊəriəs/', 'adj.', '好奇的；求知欲强的', 'Children are curious.', '情感与性格', '孩子们好奇心强。', {
            phrases: [{en: 'be curious about', zh: '对……好奇'}, {en: 'curious to know', zh: '很想知道'}],
            }),
          w('s1u0-36', 'company', '/ˈkʌmpəni/', 'n.', '公司；陪伴', 'She works in a big company.', '社会与环境', '她在大公司工作。', {
            phrases: [{en: 'keep sb company', zh: '陪伴某人'}, {en: 'limited company', zh: '有限公司'}],
            }),
          w('s1u0-37', 'personality', '/ˌpɜːsəˈnæləti/', 'n.', '性格；个性', 'She has a warm personality.', '情感与性格', '她性格温暖。', {
            phrases: [{en: 'strong personality', zh: '坚强的个性'}, {en: 'personality trait', zh: '性格特质'}],
            }),
          w('s1u0-38', 'style', '/staɪl/', 'n.', '方式；作风；风格', 'Her style is unique.', '认知与学术', '她风格独特。', {
            phrases: [{en: 'lifestyle', zh: '生活方式'}, {en: 'in style', zh: '时髦地'}],
            }),
          w('s1u0-39', 'revise', '/rɪˈvaɪz/', 'v.', '修改；复习', 'Revise for the exam.', '行为与动作', '复习备考。', {
            phrases: [{en: 'revise for', zh: '复习备考'}, {en: 'revise a plan', zh: '修改计划'}],
            }),
        ],
      },
      {
        id: 'senior-hk-u1',
        title: 'Unit 1 · Teenage Life',
        words: [
          w('s1u1-1', 'teenager', '/ˈtiːneɪdʒə(r)/', 'n.', '（13至19岁之间的）青少年', 'Teenagers need sleep.', '社会与环境', '青少年需要睡眠。', {
            phrases: [{en: 'teenager years', zh: '青少年时期'}, {en: 'teenage life', zh: '青少年生活'}],
            }),
          w('s1u1-2', 'ballet', '/ˈbæleɪ/', 'n.', '芭蕾舞；芭蕾舞剧', 'She studies ballet.', '社会与环境', '她学芭蕾。', {
            phrases: [{en: 'ballet dancer', zh: '芭蕾舞演员'}, {en: 'ballet shoe', zh: '芭蕾舞鞋'}],
            }),
          w('s1u1-3', 'volunteer', '/ˌvɒlənˈtɪə(r)/', 'n.', '志愿者', 'She works as a volunteer.', '社会与环境', '她做志愿者。', {
            phrases: [{en: 'volunteer work', zh: '志愿者工作'}, {en: 'volunteer to do', zh: '自愿做'}],
            }),
          w('s1u1-4', 'debate', '/dɪˈbeɪt/', 'n./v.', '辩论；争论', 'They debated the plan.', '行为与动作', '他们就计划辩论。', {
            phrases: [{en: 'debate on sth', zh: '就某事辩论'}, {en: 'under debate', zh: '在辩论中'}],
            }),
          w('s1u1-5', 'prefer', '/prɪˈfɜː(r)/', 'vt.', '较喜欢', 'I prefer tea to coffee.', '情感与性格', '比起咖啡我更喜欢茶。', {
            phrases: [{en: 'prefer A to B', zh: '喜欢A胜过B'}, {en: 'prefer to do', zh: '更愿意做'}],
            }),
          w('s1u1-6', 'content', '/ˈkɒntent/', 'n.', '内容；目录；主题', 'The book has good content.', '认知与学术', '这本书内容很好。', {
            phrases: [{en: 'the content of', zh: '……的内容'}, {en: 'main content', zh: '主要内容'}],
            }),
          w('s1u1-7', 'movement', '/ˈmuːvmənt/', 'n.', '动作；运动；活动', 'The movement is slow.', '行为与动作', '动作很慢。', {
            phrases: [{en: 'slow movement', zh: '缓慢的动作'}, {en: 'civil rights movement', zh: '民权运动'}],
            }),
          w('s1u1-8', 'greenhouse', '/ˈɡriːnhaʊs/', 'n.', '温室；暖房', 'Plants grow in the greenhouse.', '社会与环境', '植物在温室生长。', {
            phrases: [{en: 'greenhouse effect', zh: '温室效应'}, {en: 'greenhouse gas', zh: '温室气体'}],
            }),
          w('s1u1-9', 'suitable', '/ˈsuːtəbl/', 'adj.', '合适的；适用的', 'This book is suitable for kids.', '品质与状态', '这本书适合孩子。', {
            phrases: [{en: 'be suitable for', zh: '适合'}, {en: 'suitable time', zh: '合适的时间'}],
            }),
          w('s1u1-10', 'actually', '/ˈæktʃuəli/', 'adv.', '事实上；的确', 'Actually, I agree.', '认知与学术', '事实上我同意。', {
            phrases: [{en: 'actually speaking', zh: '实际上'}, {en: 'actually true', zh: '确实如此'}],
            }),
          w('s1u1-11', 'challenge', '/ˈtʃælɪndʒ/', 'n./vt.', '挑战；向……挑战', 'Life is full of challenges.', '认知与学术', '生活充满挑战。', {
            phrases: [{en: 'face a challenge', zh: '面对挑战'}, {en: 'challenge sb to do', zh: '挑战某人做'}],
            }),
          w('s1u1-12', 'title', '/ˈtaɪtl/', 'n.', '标题；职称；头衔', 'The title is clear.', '认知与学术', '标题很清楚。', {
            phrases: [{en: 'book title', zh: '书名'}, {en: 'job title', zh: '职位头衔'}],
            }),
          w('s1u1-13', 'topic', '/ˈtɒpɪk/', 'n.', '话题；标题', 'The topic is interesting.', '认知与学术', '话题很有趣。', {
            phrases: [{en: 'hot topic', zh: '热门话题'}, {en: 'main topic', zh: '主题'}],
            }),
          w('s1u1-14', 'freshman', '/ˈfreʃmən/', 'n.', '大学一年级新生', 'He is a college freshman.', '社会与环境', '他是大一新生。', {
            phrases: [{en: 'college freshman', zh: '大一新生'}, {en: 'freshman year', zh: '一年级'}],
            }),
          w('s1u1-15', 'confusing', '/kənˈfjuːzɪŋ/', 'adj.', '难以理解的；不清楚的', 'The instructions are confusing.', '品质与状态', '说明令人困惑。', {
            phrases: [{en: 'confusing information', zh: '令人困惑的信息'}, {en: 'confusing situation', zh: '混乱的局面'}],
            }),
          w('s1u1-16', 'confuse', '/kənˈfjuːz/', 'vt.', '使糊涂；使迷惑', 'You confused me.', '行为与动作', '你把我弄糊涂了。', {
            phrases: [{en: 'confuse A with B', zh: '把A和B混淆'}, {en: 'get confused', zh: '感到困惑'}],
            }),
          w('s1u1-17', 'confused', '/kənˈfjuːzd/', 'adj.', '糊涂的；迷惑的', 'I felt confused.', '情感与性格', '我感到困惑。', {
            phrases: [{en: 'be confused about', zh: '对……感到困惑'}, {en: 'confused look', zh: '困惑的表情'}],
            }),
          w('s1u1-18', 'fluent', '/ˈfluːənt/', 'adj.', '流利的；熟练的', 'She speaks fluent English.', '品质与状态', '她英语流利。', {
            phrases: [{en: 'fluent in', zh: '流利使用'}, {en: 'fluent speaker', zh: '说话流利的人'}],
            }),
          w('s1u1-19', 'graduate', '/ˈɡrædʒueɪt/', 'v./n.', '毕业；毕业生', 'He graduated from college.', '行为与动作', '他大学毕业了。', {
            phrases: [{en: 'graduate from', zh: '毕业于'}, {en: 'high school graduate', zh: '高中毕业生'}],
            }),
          w('s1u1-20', 'recommend', '/ˌrekəˈmend/', 'vt.', '建议；推荐；介绍', 'I recommend this book.', '行为与动作', '我推荐这本书。', {
            phrases: [{en: 'recommend sth to sb', zh: '向某人推荐'}, {en: 'recommend doing', zh: '建议做'}],
            }),
          w('s1u1-21', 'advanced', '/ədˈvɑːnst/', 'adj.', '高级的；先进的', 'It is an advanced course.', '品质与状态', '这是高级课程。', {
            phrases: [{en: 'advanced technology', zh: '先进技术'}, {en: 'advanced level', zh: '高级水平'}],
            }),
          w('s1u1-22', 'advance', '/ədˈvɑːns/', 'n./v.', '前进；发展', 'Technology advances fast.', '行为与动作', '科技进步很快。', {
            phrases: [{en: 'in advance', zh: '提前'}, {en: 'advance in', zh: '在……方面进步'}],
            }),
          w('s1u1-23', 'literature', '/ˈlɪtrətʃə(r)/', 'n.', '文学；文学作品', 'She loves English literature.', '认知与学术', '她喜欢英国文学。', {
            phrases: [{en: 'English literature', zh: '英国文学'}, {en: 'classical literature', zh: '古典文学'}],
            }),
          w('s1u1-24', 'extra-curricular', '/ˌekstrəkəˈrɪkjələ(r)/', 'adj.', '课外的；课程以外的', 'Extra-curricular activities are fun.', '社会与环境', '课外活动有趣。', {
            phrases: [{en: 'extra-curricular activities', zh: '课外活动'}, {en: 'extra-curricular reading', zh: '课外阅读'}],
            }),
          w('s1u1-25', 'extra', '/ˈekstrə/', 'adj.', '额外的；附加的', 'Do extra work.', '认知与学术', '做额外工作。', {
            phrases: [{en: 'extra time', zh: '额外时间'}, {en: 'extra money', zh: '外快'}],
            }),
          w('s1u1-26', 'obviously', '/ˈɒbviəsli/', 'adv.', '显然；明显地', 'Obviously, he is wrong.', '认知与学术', '显然他错了。', {
            phrases: [{en: 'obviously true', zh: '显然正确'}, {en: 'obviously wrong', zh: '明显错误'}],
            }),
          w('s1u1-27', 'quit', '/kwɪt/', 'v.', '停止；戒掉；离开', 'Quit smoking.', '行为与动作', '戒烟。', {
            phrases: [{en: 'quit doing', zh: '停止做'}, {en: 'quit school', zh: '退学'}],
            }),
          w('s1u1-28', 'responsible', '/rɪˈspɒnsəbl/', 'adj.', '负责的；有责任的', 'He is responsible for it.', '品质与状态', '他对此负责。', {
            phrases: [{en: 'be responsible for', zh: '对……负责'}, {en: 'responsible person', zh: '负责任的人'}],
            }),
          w('s1u1-29', 'responsibility', '/rɪˌspɒnsəˈbɪləti/', 'n.', '责任；义务', 'It is my responsibility.', '认知与学术', '这是我的责任。', {
            phrases: [{en: 'take responsibility for', zh: '对……负责'}, {en: 'sense of responsibility', zh: '责任感'}],
            }),
          w('s1u1-30', 'solution', '/səˈluːʃn/', 'n.', '解决办法；答案', 'We need a solution.', '认知与学术', '我们需要解决办法。', {
            phrases: [{en: 'solution to', zh: '……的解决办法'}, {en: 'find a solution', zh: '找到解决办法'}],
            }),
          w('s1u1-31', 'schedule', '/ˈʃedjuːl/', 'n./v.', '日程安排；安排', 'The schedule is full.', '认知与学术', '日程排满了。', {
            phrases: [{en: 'on schedule', zh: '按时'}, {en: 'ahead of schedule', zh: '提前'}],
            }),
          w('s1u1-32', 'editor', '/ˈedɪtə(r)/', 'n.', '主编；编辑；编者', 'She is a newspaper editor.', '社会与环境', '她是报社编辑。', {
            phrases: [{en: 'chief editor', zh: '主编'}, {en: 'newspaper editor', zh: '报社编辑'}],
            }),
          w('s1u1-33', 'plate', '/pleɪt/', 'n.', '盘子；碟子', 'He ate a plate of pasta.', '社会与环境', '他吃了一盘意面。', {
            phrases: [{en: 'a plate of', zh: '一盘'}, {en: 'dinner plate', zh: '餐盘'}],
            }),
          w('s1u1-34', 'adventure', '/ədˈventʃə(r)/', 'n.', '冒险；奇遇', 'Life is an adventure.', '社会与环境', '生活是一场冒险。', {
            phrases: [{en: 'have an adventure', zh: '去冒险'}, {en: 'sense of adventure', zh: '冒险精神'}],
            }),
          w('s1u1-35', 'youth', '/juːθ/', 'n.', '青年时期；青春', 'In youth, we learn fast.', '社会与环境', '年轻时学得快。', {
            phrases: [{en: 'in youth', zh: '在年轻时'}, {en: 'youth culture', zh: '青年文化'}],
            }),
          w('s1u1-36', 'survival', '/səˈvaɪvl/', 'n.', '生存；幸存', 'Survival is hard in the wild.', '认知与学术', '野外生存艰难。', {
            phrases: [{en: 'survival of the fittest', zh: '适者生存'}, {en: 'survival skills', zh: '生存技能'}],
            }),
          w('s1u1-37', 'expert', '/ˈekspɜːt/', 'n./adj.', '专家；熟练的', 'She is an expert in math.', '社会与环境', '她是数学专家。', {
            phrases: [{en: 'expert in', zh: '……方面的专家'}, {en: 'expert advice', zh: '专家建议'}],
            }),
          w('s1u1-38', 'behaviour', '/bɪˈheɪvjə(r)/', 'n.', '行为；举止', 'Good behaviour matters.', '行为与动作', '良好举止很重要。', {
            phrases: [{en: 'good behaviour', zh: '良好行为'}, {en: 'bad behaviour', zh: '不良行为'}],
            }),
          w('s1u1-39', 'generation', '/ˌdʒenəˈreɪʃn/', 'n.', '一代人', 'Each generation is different.', '社会与环境', '每代人都不同。', {
            phrases: [{en: 'the younger generation', zh: '年轻一代'}, {en: 'generation gap', zh: '代沟'}],
            }),
          w('s1u1-40', 'attract', '/əˈtrækt/', 'vt.', '吸引；引起注意', 'The show attracts many people.', '行为与动作', '演出吸引很多人。', {
            phrases: [{en: 'attract attention', zh: '引起注意'}, {en: 'be attracted to', zh: '被……吸引'}],
            }),
          w('s1u1-41', 'focus', '/ˈfəʊkəs/', 'v./n.', '集中；焦点', 'Focus on the road.', '行为与动作', '注意看路。', {
            phrases: [{en: 'focus on', zh: '专注于'}, {en: 'main focus', zh: '主要焦点'}],
            }),
          w('s1u1-42', 'addicted', '/əˈdɪktɪd/', 'adj.', '有瘾的；入迷的', 'He is addicted to games.', '情感与性格', '他沉迷游戏。', {
            phrases: [{en: 'be addicted to', zh: '沉迷于'}, {en: 'addicted to drugs', zh: '吸毒成瘾'}],
            }),
          w('s1u1-43', 'addict', '/ˈædɪkt/', 'n.', '对……入迷的人；瘾君子', 'He is a TV addict.', '社会与环境', '他是个电视迷。', {
            phrases: [{en: 'drug addict', zh: '吸毒者'}, {en: 'work addict', zh: '工作狂'}],
            }),
          w('s1u1-44', 'adult', '/ˈædʌlt/', 'n./adj.', '成年人；成年的', 'Ask an adult for help.', '社会与环境', '向成年人求助。', {
            phrases: [{en: 'young adult', zh: '年轻人'}, {en: 'adult education', zh: '成人教育'}],
            }),
        ],
      },
      {
        id: 'senior-hk-u2',
        title: 'Unit 2 · Travelling Around',
        words: [
          w('s1u2-1', 'castle', '/ˈkɑːsl/', 'n.', '城堡；堡垒', 'The castle is old.', '社会与环境', '城堡很古老。', { phrases: [['ancient castle', '古城堡'], ['castle in the air', '空中楼阁，白日梦']],  extraExamples: [['The old castle stands on a hill.', '那座古老的城堡矗立在山上。'], ['The fairy tale tells of a magic castle.', '童话讲的是一座魔法城堡。']] }),
          w('s1u2-2', 'apply', '/əˈplaɪ/', 'v.', '申请；应用', 'She applied for the job.', '行为与动作', '她申请了这份工作。', { phrases: [['apply for', '申请'], ['apply A to B', '把 A 应用于 B']],  extraExamples: [['He applied to three universities.', '他申请了三所大学。'], ['Apply the cream to the affected area.', '把药膏涂在患处。']] }),
          w('s1u2-3', 'visa', '/ˈviːzə/', 'n.', '签证', 'I need a visa.', '社会与环境', '我需要签证。', { phrases: [['tourist visa', '旅游签证'], ['apply for a visa', '申请签证']],  extraExamples: [['My visa expires next month.', '我的签证下个月到期。'], ['You need a work visa for this job.', '做这份工作你需要工作签证。']] }),
          w('s1u2-4', 'rent', '/rent/', 'v.', '租用 n. 租金', 'We rent a flat.', '行为与动作', '我们租了公寓。', { phrases: [['rent out', '出租'], ['for rent', '供出租']],  extraExamples: [['They rent a house near the school.', '他们在学校附近租了房子。'], ['The monthly rent is 3000 yuan.', '月租金是 3000 元。']] }),
          w('s1u2-5', 'pack', '/pæk/', 'v.', '收拾（行李）n. 纸包', 'Pack your bags.', '行为与动作', '收拾行李。', { phrases: [['pack up', '收拾行李；停止工作'], ['a pack of', '一包/一群……']],  extraExamples: [['She packed her suitcase quickly.', '她快速收拾好了行李箱。'], ['He bought a pack of cigarettes.', '他买了一包烟。']] }),
          w('s1u2-6', 'amazing', '/əˈmeɪzɪŋ/', 'adj.', '令人惊奇的', 'The view is amazing.', '情感与性格', '景色令人惊叹。', { phrases: [['amazing news', '惊人消息'], ['It is amazing that...', '令人惊奇的是……']],  extraExamples: [['The food was amazing.', '食物太好吃了。'], ["It's amazing how much she's grown.", '她长了这么多，真令人惊讶。']] }),
          w('s1u2-7', 'arrangement', '/əˈreɪndʒmənt/', 'n.', '安排；筹备', 'The arrangement is fine.', '认知与学术', '安排妥当。', { phrases: [['make arrangements for', '为……做安排'], ['arrangement with sb.', '与某人的约定']],  extraExamples: [['We made arrangements for the wedding.', '我们为婚礼做了安排。'], ['The arrangement of the furniture took hours.', '布置家具花了好几个小时。']] }),
          w('s1u2-8', 'source', '/sɔːs/', 'n.', '来源；出处', 'The source is reliable.', '认知与学术', '来源可靠。', { phrases: [['source of income', '收入来源'], ['energy source', '能源']],  extraExamples: [['Citrus fruits are a good source of vitamin C.', '柑橘类水果是维生素 C 的良好来源。'], ['The news comes from a reliable source.', '这消息来源可靠。']] }),
          w('s1u2-9', 'narrow', '/ˈnærəʊ/', 'adj.', '狭窄的', 'The road is narrow.', '品质与状态', '路很窄。', { phrases: [['a narrow escape', '九死一生'], ['narrow down', '缩小（范围）']],  extraExamples: [['The bridge is too narrow for two cars.', '这座桥太窄，两辆车并排过不去。'], ['She narrowed her eyes in the dark.', '她在黑暗中眯起了眼睛。']] }),
          w('s1u2-10', 'flat', '/flæt/', 'adj.', '平坦的 n. 公寓', 'We live in a flat.', '社会与环境', '我们住在公寓里。', { phrases: [['fall flat', '完全失败'], ['flat tire', '爆胎']],  extraExamples: [['People used to think the earth was flat.', '人们过去认为地球是平的。'], ['They moved into a new flat last week.', '他们上周搬进了新公寓。']] }),
          w('s1u2-11', 'powerful', '/ˈpaʊəfl/', 'adj.', '强有力的；有权势的', 'He is a powerful man.', '品质与状态', '他是个有权势的人。', { phrases: [['powerful country', '强国'], ['powerful effect', '强大效果']],  extraExamples: [['The car has a powerful engine.', '这辆车发动机很强劲。'], ['He is one of the most powerful men in the world.', '他是世界上最有权势的人之一。']] }),
          w('s1u2-12', 'emperor', '/ˈempərə(r)/', 'n.', '皇帝', 'The emperor lived in a palace.', '社会与环境', '皇帝住在宫殿里。', { phrases: [['the Roman Emperor', '罗马皇帝'], ['Emperor Qinshihuang', '秦始皇']],  extraExamples: [['The emperor ordered a new palace.', '皇帝下令建一座新宫殿。'], ['Napoleon was a famous emperor.', '拿破仑是著名的皇帝。']] }),
          w('s1u2-13', 'official', '/əˈfɪʃl/', 'adj.', '官方的 n. 官员', 'The official meeting is today.', '社会与环境', '官方会议在今天。', { phrases: [['official language', '官方语言'], ['government official', '政府官员']],  extraExamples: [['The official announcement will be made tomorrow.', '官方公告明天发布。'], ['A government official visited the school.', '一位政府官员参观了学校。']] }),
          w('s1u2-14', 'recognize', '/ˈrekəɡnaɪz/', 'vt.', '辨别出；承认；认可', 'I recognized her.', '行为与动作', '我认出了她。', { phrases: [['recognize...as...', '认出……是……'], ['recognize the importance of', '认识到……的重要性']],  extraExamples: [['I recognized him from the photo.', '我从照片上认出了他。'], ['His services were recognized by the government.', '他的贡献得到了政府的表彰。']] }),
          w('s1u2-15', 'flight', '/flaɪt/', 'n.', '航班；航程', 'The flight is delayed.', '社会与环境', '航班延误了。', { phrases: [['flight number', '航班号'], ['take a flight', '乘飞机']],  extraExamples: [['Our flight was cancelled due to bad weather.', '由于天气不好，我们的航班取消了。'], ['The flight from Beijing to Shanghai takes two hours.', '从北京到上海的航班需要两小时。']] }),
          w('s1u2-16', 'unique', '/juˈniːk/', 'adj.', '唯一的；独特的', 'Each person is unique.', '品质与状态', '每个人都是独特的。', { phrases: [['unique opportunity', '独特机会'], ['unique to...', '为……所独有']],  extraExamples: [['Each fingerprint is unique.', '每个指纹都是独一无二的。'], ['The custom is unique to this region.', '这个习俗是这个地区特有的。']] }),
          w('s1u2-17', 'destination', '/ˌdestɪˈneɪʃn/', 'n.', '目的地；终点', 'We reached the destination.', '社会与环境', '我们到达了目的地。', { phrases: [['final destination', '最终目的地'], ['tourist destination', '旅游目的地']],  extraExamples: [['Paris is a popular tourist destination.', '巴黎是热门旅游目的地。'], ['We finally arrived at our destination.', '我们终于到达了目的地。']] }),
          w('s1u2-18', 'admire', '/ədˈmaɪə(r)/', 'vt.', '钦佩；赞赏', 'I admire her courage.', '情感与性格', '我钦佩她的勇气。', { phrases: [['admire sb. for sth.', '因……钦佩某人'], ['admire the view', '欣赏景色']],  extraExamples: [['I admire her for her bravery.', '我钦佩她的勇敢。'], ['We stopped to admire the sunset.', '我们停下来欣赏日落。']] }),
          w('s1u2-19', 'architecture', '/ˈɑːkɪtektʃə(r)/', 'n.', '建筑设计；建筑学', 'The architecture is beautiful.', '社会与环境', '建筑很美。', { phrases: [['modern architecture', '现代建筑'], ['Gothic architecture', '哥特式建筑']],  extraExamples: [['The city is famous for its modern architecture.', '这座城市以现代建筑闻名。'], ['He studied architecture in college.', '他在大学学建筑学。']] }),
          w('s1u2-20', 'contact', '/ˈkɒntækt/', 'v./n.', '联络；联系', 'Contact me later.', '行为与动作', '稍后联系我。', { phrases: [['keep in contact with', '与……保持联系'], ['eye contact', '眼神交流']],  extraExamples: [["I'll contact you by email.", '我会用邮件联系你。'], ['Keep eye contact during the interview.', '面试时保持眼神交流。']] }),
          w('s1u2-21', 'travel', '/ˈtrævl/', 'v./n.', '旅行', 'I love to travel.', '行为与动作', '我热爱旅行。', { phrases: [['travel agency', '旅行社'], ['travel around the world', '环游世界']],  extraExamples: [['She loves to travel alone.', '她喜欢独自旅行。'], ['Travel broadens the mind.', '旅行开阔思维。']] }),
          w('s1u2-22', 'trip', '/trɪp/', 'n.', '旅行；行程', 'We had a nice trip.', '社会与环境', '我们旅途愉快。', { phrases: [['business trip', '出差'], ['day trip', '一日游']],  extraExamples: [['We went on a trip to the mountains.', '我们去山里旅行了。'], ['The school trip was cancelled.', '学校组织的旅行取消了。']] }),
          w('s1u2-23', 'visit', '/ˈvɪzɪt/', 'v./n.', '参观；拜访', 'We visited the museum.', '行为与动作', '我们参观了博物馆。', { phrases: [['pay a visit to', '拜访……'], ['visit a museum', '参观博物馆']],  extraExamples: [['We visited my grandparents last weekend.', '上周末我们去看望了祖父母。'], ['Thanks for your visit.', '感谢你的来访。']] }),
          w('s1u2-24', 'scenery', '/ˈsiːnəri/', 'n.', '风景；景色', 'The scenery is beautiful.', '社会与环境', '风景很美。', { phrases: [['beautiful scenery', '美丽风景'], ['mountain scenery', '山景']],  extraExamples: [['The scenery along the coast is breathtaking.', '沿海的风景令人惊叹。'], ['They stopped to admire the mountain scenery.', '他们停下来欣赏山景。']] }),
          w('s1u2-25', 'journey', '/ˈdʒɜːni/', 'n.', '旅程；旅行', 'The journey was long.', '社会与环境', '旅程很长。', { phrases: [['a long journey', '长途旅行'], ['begin a journey', '启程']],  extraExamples: [['The journey takes about three hours.', '旅程大约需要三小时。'], ['Life is a journey, not a destination.', '生活是一段旅程，而不是终点。']] }),
        ],
      },
      {
        id: 'senior-hk-u3',
        title: 'Unit 3 · Sports and Fitness',
        words: [
          w('s1u3-1', 'fitness', '/ˈfɪtnəs/', 'n.', '健康；适合', 'Fitness is important.', '品质与状态', '健康很重要。', { phrases: [['physical fitness', '身体素质'], ['fitness center', '健身中心']],  extraExamples: [['He has a high level of fitness.', '他身体素质很好。'], ['Yoga improves fitness and flexibility.', '瑜伽提高体能和柔韧性。']] }),
          w('s1u3-2', 'stadium', '/ˈsteɪdiəm/', 'n.', '体育场；运动场', 'The stadium is full.', '社会与环境', '体育场满座。', { phrases: [['a football stadium', '足球场'], ['an Olympic stadium', '奥林匹克体育场']],  extraExamples: [['The new stadium holds 60,000 people.', '新体育场能容纳六万人。'], ['The stadium was built for the Olympics.', '这座体育场是为奥运会建的。']] }),
          w('s1u3-3', 'event', '/ɪˈvent/', 'n.', '比赛项目；大事', 'The event was a success.', '社会与环境', '活动很成功。', { phrases: [['sports event', '体育赛事'], ['current events', '时事']],  extraExamples: [['The next event is the 100-meter race.', '下一个项目是百米赛跑。'], ['The discovery was a major event in science.', '这一发现是科学界的大事。']] }),
          w('s1u3-4', 'host', '/həʊst/', 'vt.', '主办 n. 主人', 'China hosted the games.', '行为与动作', '中国主办了比赛。', { phrases: [['host a city', '主办城市'], ['a host of', '许多，一大群']],  extraExamples: [['Beijing hosted the 2008 Olympics.', '北京主办了 2008 年奥运会。'], ['A host of fans waited outside.', '一大群歌迷在外面等。']] }),
          w('s1u3-5', 'track', '/træk/', 'n.', '跑道；轨道 v. 追踪', 'The track is fast.', '社会与环境', '跑道很快。', { phrases: [['track and field', '田径'], ['keep track of', '记录，掌握……的线索']],  extraExamples: [['She ran five laps on the track.', '她在跑道上跑了五圈。'], ['It is hard to keep track of all the bills.', '记下所有账单很难。']] }),
          w('s1u3-6', 'gym', '/dʒɪm/', 'n.', '健身房；体育馆', 'I work out at the gym.', '社会与环境', '我在健身房锻炼。', { phrases: [['go to the gym', '去健身房'], ['gym class', '体育课']],  extraExamples: [['Membership at the gym costs 500 yuan a month.', '健身房会员每月 500 元。'], ['We have gym class twice a week.', '我们一周两次体育课。']] }),
          w('s1u3-7', 'sweat', '/swet/', 'v.', '出汗 n. 汗水', 'He sweats a lot.', '行为与动作', '他出很多汗。', { phrases: [['no sweat', '没问题，不费力'], ['sweat blood', '累死累活地干']],  extraExamples: [['He sweats heavily in summer.', '他夏天出很多汗。'], ['The sweat rolled down his face.', '汗水顺着他的脸流下来。']] }),
          w('s1u3-8', 'legend', '/ˈledʒənd/', 'n.', '传奇人物；传说', 'He is a sports legend.', '社会与环境', '他是体育传奇。', { phrases: [['a living legend', '活着的传奇'], ['the legend of...', '……的传说']],  extraExamples: [['Babe Ruth is a baseball legend.', '贝比·鲁斯是棒球传奇。'], ['The legend says the lake is bottomless.', '传说这个湖深不见底。']] }),
          w('s1u3-9', 'athlete', '/ˈæθliːt/', 'n.', '运动员', 'The athlete won gold.', '社会与环境', '运动员获金牌。', { phrases: [['a professional athlete', '职业运动员'], ['athlete\'s foot', '脚气']],  extraExamples: [['The athlete trained six hours a day.', '这位运动员每天训练六小时。'], ['She is a natural athlete.', '她天生就是运动员。']] }),
          w('s1u3-10', 'master', '/ˈmɑːstə(r)/', 'n.', '主人 vt. 精通', 'She mastered the skill.', '行为与动作', '她精通了这项技能。', { phrases: [['master a skill', '精通一门技能'], ['master\'s degree', '硕士学位']],  extraExamples: [['It takes years to master a language.', '精通一门语言需要多年。'], ['He is the master of the house.', '他是一家之主。']] }),
          w('s1u3-11', 'honour', '/ˈɒnə(r)/', 'n.', '荣誉；尊敬', 'It is an honour.', '情感与性格', '这是荣誉。', { phrases: [['in honour of', '为纪念……'], ['have the honour to do', '很荣幸做……']],  extraExamples: [['We held a dinner in honour of the guests.', '我们设宴招待客人。'], ['It is an honour to meet you.', '很荣幸见到您。']] }),
          w('s1u3-12', 'glory', '/ˈɡlɔːri/', 'n.', '荣誉；光荣', 'They fight for glory.', '情感与性格', '他们为荣誉而战。', { phrases: [['win glory for', '为……赢得荣誉'], ['glory days', '辉煌岁月']],  extraExamples: [['He covered himself in glory.', '他赢得了满身荣誉。'], ['The team returned home in a blaze of glory.', '这支队伍荣归故里。']] }),
          w('s1u3-13', 'medal', '/ˈmedl/', 'n.', '奖章；勋章', 'She won a gold medal.', '社会与环境', '她获金牌。', { phrases: [['gold/silver/bronze medal', '金/银/铜牌'], ['win a medal', '赢得奖牌']],  extraExamples: [['She won a gold medal in swimming.', '她在游泳项目中获得金牌。'], ['He was awarded a medal for bravery.', '他因勇敢被授予勋章。']] }),
          w('s1u3-14', 'champion', '/ˈtʃæmpiən/', 'n.', '冠军', 'He is the champion.', '社会与环境', '他是冠军。', { phrases: [['the world champion', '世界冠军'], ['defending champion', '卫冕冠军']],  extraExamples: [['She became the world champion at 19.', '她 19 岁成为世界冠军。'], ['The champion defended his title successfully.', '冠军成功卫冕。']] }),
          w('s1u3-15', 'determination', '/dɪˌtɜːmɪˈneɪʃn/', 'n.', '决心；决定', 'Determination leads to success.', '品质与状态', '决心带来成功。', { phrases: [['with determination', '毅然地'], ['strength and determination', '力量与决心']],  extraExamples: [['Her determination to succeed inspired us all.', '她成功的决心激励了我们所有人。'], ['He fought the illness with courage and determination.', '他以勇气和决心对抗疾病。']] }),
          w('s1u3-16', 'injure', '/ˈɪndʒə(r)/', 'vt.', '使受伤；损害', 'He injured his knee.', '行为与动作', '他伤了膝盖。', { phrases: [['injure oneself', '伤到自己'], ['seriously injured', '受重伤']],  extraExamples: [['He injured his back while lifting the box.', '他搬箱子时伤了背。'], ['Three people were seriously injured in the crash.', '撞车事故中有三人重伤。']] }),
          w('s1u3-17', 'captain', '/ˈkæptɪn/', 'n.', '队长；船长', 'He is the team captain.', '社会与环境', '他是队长。', { phrases: [['the captain of the team', '队长'], ['sea captain', '船长']],  extraExamples: [['The captain led the team to victory.', '队长带领队伍取得胜利。'], ['The captain ordered the crew to abandon ship.', '船长命令船员弃船。']] }),
          w('s1u3-18', 'graceful', '/ˈɡreɪsfl/', 'adj.', '优美的；优雅的', 'Her dance is graceful.', '品质与状态', '她的舞姿优美。', { phrases: [['graceful movement', '优雅的动作'], ['a graceful dancer', '舞姿优雅的舞者']],  extraExamples: [['The swan made a graceful dive into the water.', '天鹅优雅地潜入水中。'], ['She gave a graceful speech at the ceremony.', '她在典礼上作了优雅的演讲。']] }),
          w('s1u3-19', 'strength', '/streŋθ/', 'n.', '力量；体力', 'He has great strength.', '品质与状态', '他力气很大。', { phrases: [['strength and courage', '力量与勇气'], ['the strength of...', '……的强度/优点']],  extraExamples: [['He pushed the door with all his strength.', '他用尽全力推门。'], ['Union is strength.', '团结就是力量。']] }),
          w('s1u3-20', 'failure', '/ˈfeɪljə(r)/', 'n.', '失败', 'Failure is the mother of success.', '认知与学术', '失败是成功之母。', { phrases: [['end in failure', '以失败告终'], ['failure to do sth.', '未能做某事']],  extraExamples: [['The attempt ended in failure.', '这次尝试以失败告终。'], ['His failure to pass the exam surprised everyone.', '他考试没及格让所有人吃惊。']] }),
          w('s1u3-21', 'sport', '/spɔːt/', 'n.', '运动', 'Sports keep us fit.', '社会与环境', '运动保持健康。', { phrases: [['do sports', '做运动'], ['water sports', '水上运动']],  extraExamples: [['My favorite sport is basketball.', '我最喜欢的运动是篮球。'], ['School sports day is next Friday.', '学校运动会在下周五。']] }),
          w('s1u3-22', 'exercise', '/ˈeksəsaɪz/', 'v./n.', '锻炼', 'Exercise every day.', '行为与动作', '每天锻炼。', { phrases: [['do exercise', '做运动'], ['take exercise', '锻炼身体']],  extraExamples: [['You should exercise more.', '你应该多锻炼。'], ['Stretching exercises help prevent injury.', '伸展运动有助于防止受伤。']] }),
          w('s1u3-23', 'team', '/tiːm/', 'n.', '队；团队', 'Our team won.', '社会与环境', '我们队赢了。', { phrases: [['team spirit', '团队精神'], ['a team of', '一队……']],  extraExamples: [['Our team has won three games in a row.', '我们队连赢三场。'], ['A team of scientists explored the forest.', '一队科学家考察了森林。']] }),
          w('s1u3-24', 'win', '/wɪn/', 'v.', '获胜', 'We won the game.', '行为与动作', '我们赢了比赛。', { phrases: [['win a prize', '获奖'], ['win over', '说服，争取过来']],  extraExamples: [['She won first prize in the contest.', '她在比赛中获一等奖。'], ['We hope to win the contract.', '我们希望赢得这份合同。']] }),
          w('s1u3-25', 'practice', '/ˈpræktɪs/', 'n.', '练习', 'Practice makes perfect.', '认知与学术', '熟能生巧。', { phrases: [['in practice', '实际上'], ['put into practice', '付诸实践']],  extraExamples: [['She does an hour\'s piano practice every day.', '她每天练一小时钢琴。'], ['The idea sounds good but will it work in practice?', '这个主意听起来不错，但实际行得通吗？']] }),
        ],
      },
      {
        id: 'senior-hk-u4',
        title: 'Unit 4 · Natural Disasters',
        words: [
          w('s1u4-1', 'disaster', '/dɪˈzɑːstə(r)/', 'n.', '灾难；灾害', 'The earthquake was a disaster.', '社会与环境', '这场地震是灾难。', { phrases: [['natural disaster', '自然灾害'], ['a disaster for...', '对……来说是灾难']],  extraExamples: [['The flood was the worst disaster in decades.', '这场洪水是几十年来最严重的灾害。'], ['Losing the contract was a disaster for the company.', '丢了合同对公司来说是场灾难。']] }),
          w('s1u4-2', 'volcano', '/vɒlˈkeɪnəʊ/', 'n.', '火山', 'The volcano erupted.', '社会与环境', '火山喷发了。', { phrases: [['an active volcano', '活火山'], ['an extinct volcano', '死火山']],  extraExamples: [['The volcano has been dormant for 100 years.', '这座火山已休眠 100 年。'], ['Lava flowed down the side of the volcano.', '岩浆从火山侧面流下。']] }),
          w('s1u4-3', 'tornado', '/tɔːˈneɪdəʊ/', 'n.', '龙卷风；旋风', 'The tornado destroyed houses.', '社会与环境', '龙卷风摧毁了房屋。', { phrases: [['a tornado warning', '龙卷风预警'], ['tornado alley', '龙卷风走廊（美国中部）']],  extraExamples: [['The tornado tore the roof off the house.', '龙卷风掀掉了房子的屋顶。'], ['They hid in the basement during the tornado.', '龙卷风时他们躲在地下室。']] }),
          w('s1u4-4', 'drought', '/draʊt/', 'n.', '旱灾；久旱', 'The drought ruined crops.', '社会与环境', '旱灾毁了庄稼。', { phrases: [['a severe drought', '严重干旱'], ['drought-stricken area', '干旱受灾地区']],  extraExamples: [['The region has been suffering from drought for years.', '这个地区已连续几年干旱。'], ['Crops failed due to the prolonged drought.', '由于长期干旱，庄稼歉收。']] }),
          w('s1u4-5', 'landslide', '/ˈlændslaɪd/', 'n.', '滑坡；山崩', 'The road was blocked by a landslide.', '社会与环境', '路被滑坡堵了。', { phrases: [['a landslide victory', '压倒性胜利'], ['trigger a landslide', '引发滑坡']],  extraExamples: [['Heavy rain triggered a landslide.', '大雨引发了滑坡。'], ['The party won by a landslide.', '该党以压倒性优势获胜。']] }),
          w('s1u4-6', 'slide', '/slaɪd/', 'v.', '滑行 n. 幻灯片', 'The kids slid on the ice.', '行为与动作', '孩子们在冰上滑。', { phrases: [['slide into', '不知不觉陷入'], ['show slides', '放幻灯片']],  extraExamples: [['The book slid off the desk.', '书从桌上滑落。'], ['We had a slide show of our holiday photos.', '我们放映了假期照片的幻灯片。']] }),
          w('s1u4-7', 'tsunami', '/tsuːˈnɑːmi/', 'n.', '海啸', 'The tsunami hit the coast.', '社会与环境', '海啸袭击海岸。', { phrases: [['a tsunami warning', '海啸预警'], ['tsunami waves', '海啸波']],  extraExamples: [['The 2004 tsunami killed over 200,000 people.', '2004 年海啸造成 20 多万人死亡。'], ['People fled inland to escape the tsunami.', '人们向内陆逃离去躲避海啸。']] }),
          w('s1u4-8', 'flood', '/flʌd/', 'n.', '洪水 v. 淹没', 'The flood covered the town.', '社会与环境', '洪水淹没小镇。', { phrases: [['in flood', '洪水泛滥'], ['flood in', '大量涌入']],  extraExamples: [['The river flooded the village after the storm.', '暴风雨后河水淹没了村庄。'], ['Applications flooded in after the ad.', '广告发布后申请信如雪片般飞来。']] }),
          w('s1u4-9', 'survive', '/səˈvaɪv/', 'v.', '幸存；艰难度过', 'He survived the accident.', '行为与动作', '他在事故中幸存。', { phrases: [['survive on', '靠……维持生活'], ['survive the crisis', '度过危机']],  extraExamples: [['Only two passengers survived the crash.', '只有两名乘客在坠机中生还。'], ['She survived on very little money.', '她靠极少的钱艰难度日。']] }),
          w('s1u4-10', 'rescue', '/ˈreskjuː/', 'n./vt.', '营救；救援', 'The rescue team arrived.', '行为与动作', '救援队到了。', { phrases: [['rescue team', '救援队'], ['come to one\'s rescue', '前来营救某人']],  extraExamples: [['Rescue workers pulled the boy from the ruins.', '救援人员把男孩从废墟中拉出来。'], ['A rescue boat saved the drowning sailor.', '救援船救起了溺水的水手。']] }),
          w('s1u4-11', 'damage', '/ˈdæmɪdʒ/', 'vt./n.', '损害；破坏', 'The storm damaged the roof.', '行为与动作', '风暴损坏了屋顶。', { phrases: [['do damage to', '对……造成损害'], ['serious damage', '严重损害']],  extraExamples: [['The accident caused serious damage to the car.', '事故对汽车造成了严重损坏。'], ['Smoking damages your health.', '吸烟损害健康。']] }),
          w('s1u4-12', 'destroy', '/dɪˈstrɔɪ/', 'vt.', '摧毁；毁灭', 'The fire destroyed the forest.', '行为与动作', '大火毁了森林。', { phrases: [['destroy the environment', '破坏环境'], ['completely destroy', '彻底摧毁']],  extraExamples: [['The earthquake destroyed the whole city.', '地震摧毁了整座城市。'], ['Nothing could destroy their friendship.', '什么也破坏不了他们的友谊。']] }),
          w('s1u4-13', 'evacuate', '/ɪˈvækjueɪt/', 'v.', '疏散；撤离', 'People were evacuated.', '行为与动作', '人们被疏散了。', { phrases: [['evacuate an area', '疏散一个地区'], ['evacuate to safety', '撤离到安全地带']],  extraExamples: [['Residents were evacuated before the hurricane hit.', '飓风登陆前居民被疏散。'], ['The building was evacuated after the fire alarm.', '火警响后大楼内人员全部撤离。']] }),
          w('s1u4-14', 'calm', '/kɑːm/', 'adj.', '镇静的 v. 使平静', 'Stay calm in danger.', '情感与性格', '危险中保持冷静。', { phrases: [['calm down', '冷静下来'], ['keep calm', '保持冷静']],  extraExamples: [['She took a deep breath to stay calm.', '她深吸一口气保持冷静。'], ['The sea calmed down after the storm.', '暴风雨后海面平静下来。']] }),
          w('s1u4-15', 'aid', '/eɪd/', 'n./v.', '援助；帮助', 'They sent aid to victims.', '行为与动作', '他们给灾民送援助。', { phrases: [['first aid', '急救'], ['in aid of', '为了帮助……']],  extraExamples: [['The government sent emergency aid to the flooded area.', '政府向洪灾地区运送紧急援助。'], ['He went to the aid of the injured man.', '他跑去帮助受伤的人。']] }),
          w('s1u4-16', 'affect', '/əˈfekt/', 'vt.', '影响；侵袭', 'The storm affected many people.', '行为与动作', '风暴影响了很多人。', { phrases: [['be affected by', '受……影响'], ['affect one\'s health', '影响健康']],  extraExamples: [['The weather affects my mood.', '天气影响我的心情。'], ['The disease affects the lungs.', '这种病侵袭肺部。']] }),
          w('s1u4-17', 'shelter', '/ˈʃeltə(r)/', 'n.', '避难处 v. 躲避', 'They found shelter.', '社会与环境', '他们找到了避难处。', { phrases: [['take shelter', '躲避'], ['a shelter from the rain', '避雨处']],  extraExamples: [['We took shelter under a tree.', '我们在树下躲雨。'], ['The Red Cross set up shelters for the homeless.', '红十字会为无家可归者设立避难所。']] }),
          w('s1u4-18', 'crack', '/kræk/', 'n.', '裂缝 v. 破裂', 'The cup cracked.', '品质与状态', '杯子裂了。', { phrases: [['crack down on', '严厉打击'], ['a crack in...', '……上的裂缝']],  extraExamples: [['The glass cracked when I poured hot water in.', '我倒热水时杯子裂了。'], ['Police cracked down on drunk driving.', '警方严厉打击酒驾。']] }),
          w('s1u4-19', 'crash', '/kræʃ/', 'v./n.', '碰撞；撞击', 'The car crashed into a tree.', '行为与动作', '车撞到树上。', { phrases: [['crash into', '撞上'], ['a car crash', '车祸']],  extraExamples: [['The plane crashed into the mountain.', '飞机撞上了山。'], ['He heard a loud crash outside.', '他听到外面一声巨响。']] }),
          w('s1u4-20', 'effort', '/ˈefət/', 'n.', '努力；尽力', 'Their efforts saved lives.', '行为与动作', '他们的努力救了命。', { phrases: [['make an effort', '努力'], ['spare no effort', '不遗余力']],  extraExamples: [['He made an effort to arrive on time.', '他努力准时到达。'], ['All our efforts were in vain.', '我们所有的努力都白费了。']] }),
          w('s1u4-21', 'earthquake', '/ˈɜːθkweɪk/', 'n.', '地震', 'The earthquake was strong.', '社会与环境', '地震很强烈。', { phrases: [['a strong earthquake', '强烈地震'], ['earthquake-proof', '防震的']],  extraExamples: [['The earthquake measured 6.5 on the Richter scale.', '这次地震里氏 6.5 级。'], ['Many buildings collapsed in the earthquake.', '许多建筑在地震中倒塌。']] }),
          w('s1u4-22', 'storm', '/stɔːm/', 'n.', '暴风雨', 'The storm destroyed houses.', '社会与环境', '暴风雨毁了房屋。', { phrases: [['a thunder storm', '雷暴'], ['weather the storm', '度过难关']],  extraExamples: [['The storm knocked down many trees.', '暴风雨刮倒了许多树。'], ['They stayed indoors during the storm.', '暴风雨期间他们待在室内。']] }),
          w('s1u4-23', 'save', '/seɪv/', 'v.', '拯救；节约', 'They saved many lives.', '行为与动作', '他们救了很多人。', { phrases: [['save one\'s life', '救某人的命'], ['save money', '省钱']],  extraExamples: [['The doctor saved the child\'s life.', '医生救了孩子的命。'], ['We should save water.', '我们应该节约用水。']] }),
          w('s1u4-24', 'help', '/help/', 'v./n.', '帮助', 'Help people in need.', '行为与动作', '帮助有需要的人。', { phrases: [['help oneself to', '随便吃/用'], ['help out', '帮忙做事']],  extraExamples: [['Can you help me carry this box?', '你能帮我搬这个箱子吗？'], ['Thank you for your help.', '感谢你的帮助。']] }),
          w('s1u4-25', 'danger', '/ˈdeɪndʒə(r)/', 'n.', '危险', 'Stay away from danger.', '社会与环境', '远离危险。', { phrases: [['in danger', '处于危险中'], ['out of danger', '脱离危险']],  extraExamples: [['The bridge is in danger of collapsing.', '这座桥有坍塌的危险。'], ['The patient is now out of danger.', '病人现在已脱离危险。']] }),
        ],
      },
      {
        id: 'senior-hk-u5',
        title: 'Unit 5 · Languages Around the World',
        words: [
          w('s1u5-1', 'billion', '/ˈbɪljən/', 'n.', '十亿', 'There are billions of people.', '认知与学术', '有数十亿人。', { phrases: [['billions of', '数十亿，无数'], ['one billion', '十亿']],  extraExamples: [['The company is worth billions.', '这家公司价值数十亿。'], ['There are billions of stars in the sky.', '天空中有数十亿颗星星。']] }),
          w('s1u5-2', 'native', '/ˈneɪtɪv/', 'adj.', '本地的 n. 本地人', 'English is not my native language.', '社会与环境', '英语不是我的母语。', { phrases: [['native language', '母语'], ['a native of...', '……本地人']],  extraExamples: [['She is a native of Beijing.', '她是北京本地人。'], ['Native speakers find grammar easy.', '母语者觉得语法很容易。']] }),
          w('s1u5-3', 'attitude', '/ˈætɪtjuːd/', 'n.', '态度；看法', 'Her attitude is positive.', '情感与性格', '她态度积极。', { phrases: [['attitude towards/to', '对……的态度'], ['take an attitude', '采取态度']],  extraExamples: [['He has a bad attitude towards work.', '他工作态度不好。'], ['Attitude is everything.', '态度决定一切。']] }),
          w('s1u5-4', 'appreciate', '/əˈpriːʃieɪt/', 'vt.', '欣赏；感激；领会', 'I appreciate your help.', '情感与性格', '我感激你的帮助。', { phrases: [['appreciate one\'s help', '感激某人的帮助'], ['I would appreciate it if...', '如果……我将不胜感激']],  extraExamples: [['I really appreciate your support.', '我非常感谢你的支持。'], ['You can\'t appreciate English poetry in translation.', '翻译过来的英文诗体会不到韵味。']] }),
          w('s1u5-5', 'reference', '/ˈrefrəns/', 'n.', '参考；提及', 'Keep this for reference.', '认知与学术', '留作参考。', { phrases: [['for reference', '供参考'], ['with reference to', '关于……']],  extraExamples: [['Keep the manual for future reference.', '把手册留着以后参考。'], ['The book is full of references to ancient China.', '这本书多处提到古代中国。']] }),
          w('s1u5-6', 'specific', '/spəˈsɪfɪk/', 'adj.', '特定的；具体的', 'Give a specific example.', '认知与学术', '举个具体例子。', { phrases: [['specific to...', '为……所特有'], ['specific details', '具体细节']],  extraExamples: [['Is there a specific type you want?', '你有特别想要的款式吗？'], ['The disease is specific to tropical regions.', '这种病是热带地区特有的。']] }),
          w('s1u5-7', 'refer', '/rɪˈfɜː(r)/', 'v.', '提到；参考；查阅', 'Refer to the dictionary.', '行为与动作', '查字典。', { phrases: [['refer to', '参考；提到'], ['refer to...as...', '把……称作……']],  extraExamples: [['You may refer to your notes during the test.', '考试时可以看笔记。'], ['He referred to his past experience.', '他提到了过去的经历。']] }),
          w('s1u5-8', 'struggle', '/ˈstrʌgl/', 'n./vi.', '斗争；奋斗；搏斗', 'She struggled with the task.', '行为与动作', '她努力完成任务。', { phrases: [['struggle with', '与……斗争'], ['struggle to do', '努力做……']],  extraExamples: [['He struggled to control his temper.', '他努力控制脾气。'], ['The struggle for independence was long.', '争取独立的斗争漫长而艰苦。']] }),
          w('s1u5-9', 'system', '/ˈsɪstəm/', 'n.', '体系；制度；系统', 'The system works well.', '社会与环境', '系统运转良好。', { phrases: [['the education system', '教育制度'], ['system software', '系统软件']],  extraExamples: [['Our digestive system is complex.', '我们的消化系统很复杂。'], ['The new system saves a lot of time.', '新系统节省了大量时间。']] }),
          w('s1u5-10', 'tongue', '/tʌŋ/', 'n.', '舌头；语言', 'Chinese is her mother tongue.', '社会与环境', '汉语是她的母语。', { phrases: [['mother tongue', '母语'], ['hold one\'s tongue', '保持沉默']],  extraExamples: [['The dog licks its tongue.', '狗舔着舌头。'], ['English is not his mother tongue.', '英语不是他的母语。']] }),
          w('s1u5-11', 'despite', '/dɪˈspaɪt/', 'prep.', '即使；尽管', 'Despite the rain, we went out.', '认知与学术', '尽管下雨，我们还是出去了。', { phrases: [['despite the fact that...', '尽管……'], ['despite oneself', '不由自主地']],  extraExamples: [['Despite the cold, he went out without a coat.', '尽管很冷，他没穿外套就出去了。'], ['She passed the exam despite her illness.', '尽管生病，她还是通过了考试。']] }),
          w('s1u5-12', 'semester', '/sɪˈmestə(r)/', 'n.', '学期', 'The new semester starts.', '社会与环境', '新学期开始了。', { phrases: [['the fall semester', '秋季学期'], ['the spring semester', '春季学期']],  extraExamples: [['The spring semester begins in February.', '春季学期二月开始。'], ['I have five classes this semester.', '这学期我有五门课。']] }),
          w('s1u5-13', 'factor', '/ˈfæktə(r)/', 'n.', '因素；要素', 'Cost is an important factor.', '认知与学术', '成本是重要因素。', { phrases: [['a key factor', '关键因素'], ['factor in', '把……因素包括在内']],  extraExamples: [['Price is an important factor in buying a car.', '价格是买车时的重要因素。'], ['Human error was a major factor in the accident.', '人为失误是事故的主要原因。']] }),
          w('s1u5-14', 'gap', '/ɡæp/', 'n.', '间隔；差距；缺口', 'There is a gap between them.', '社会与环境', '他们之间有差距。', { phrases: [['generation gap', '代沟'], ['bridge the gap', '弥合差距']],  extraExamples: [['There is a big gap between rich and poor.', '贫富差距很大。'], ['Fill in the gaps in the text.', '填出文章中的空白。']] }),
          w('s1u5-15', 'carve', '/kɑːv/', 'v.', '雕刻', 'The statue is carved from stone.', '行为与动作', '雕像由石头雕成。', { phrases: [['carve...from...', '用……雕刻……'], ['carve out a career', '闯出一番事业']],  extraExamples: [['The statue was carved out of marble.', '这座雕像是用大理石雕的。'], ['He carved his name on the tree.', '他把名字刻在树上。']] }),
          w('s1u5-16', 'demand', '/dɪˈmɑːnd/', 'n./v.', '要求；需求', 'There is a high demand.', '社会与环境', '需求很高。', { phrases: [['in demand', '有需求'], ['demand for...', '对……的需求']],  extraExamples: [['There is a high demand for smartphones.', '智能手机需求很大。'], ['The workers demanded higher pay.', '工人们要求更高工资。']] }),
          w('s1u5-17', 'dynasty', '/ˈdɪnəsti/', 'n.', '王朝；朝代', 'The Tang Dynasty was great.', '社会与环境', '唐朝很伟大。', { phrases: [['the Tang Dynasty', '唐朝'], ['during the Ming Dynasty', '明代']],  extraExamples: [['The Qing Dynasty lasted nearly 300 years.', '清朝延续了近 300 年。'], ['The dynasty came to an end in 1912.', '这个王朝 1912 年终结。']] }),
          w('s1u5-18', 'vocabulary', '/vəˈkæbjələri/', 'n.', '词汇', 'Build your vocabulary.', '认知与学术', '积累词汇。', { phrases: [['build one\'s vocabulary', '积累词汇'], ['a wide vocabulary', '词汇量大']],  extraExamples: [['Reading helps improve your vocabulary.', '阅读有助于扩大词汇量。'], ['The word is not in my vocabulary.', '这个词我没学过。']] }),
          w('s1u5-19', 'variety', '/vəˈraɪəti/', 'n.', '多样化；种类', 'The shop has a variety of goods.', '社会与环境', '商店商品种类多。', { phrases: [['a variety of', '各种各样的'], ['variety show', '综艺节目']],  extraExamples: [['The shop sells a variety of fruits.', '这家店卖各种各样的水果。'], ['We need more variety in our diet.', '我们的饮食需要更多样化。']] }),
          w('s1u5-20', 'description', '/dɪˈskrɪpʃn/', 'n.', '描写；形容', 'The description is clear.', '认知与学术', '描述很清楚。', { phrases: [['a detailed description', '详细描述'], ['beyond description', '难以形容']],  extraExamples: [['The scenery is beautiful beyond description.', '景色美得难以形容。'], ['Police gave a description of the thief.', '警察描述了小偷的样子。']] }),
          w('s1u5-21', 'language', '/ˈlæŋɡwɪdʒ/', 'n.', '语言', 'English is a global language.', '社会与环境', '英语是全球语言。', { phrases: [['body language', '肢体语言'], ['foreign language', '外语']],  extraExamples: [['English is the most widely used language.', '英语是使用最广泛的语言。'], ['She speaks three languages.', '她会说三种语言。']] }),
          w('s1u5-22', 'Chinese', '/ˌtʃaɪˈniːz/', 'n.', '汉语；中国人 adj. 中国的', 'Chinese is her mother tongue.', '社会与环境', '汉语是她的母语。', { phrases: [['Chinese character', '汉字'], ['Chinese food', '中餐']],  extraExamples: [['Chinese is spoken by over a billion people.', '汉语有十亿多人使用。'], ['I like Chinese food.', '我喜欢中餐。']] }),
          w('s1u5-23', 'speak', '/spiːk/', 'v.', '说；讲', 'Speak English every day.', '行为与动作', '每天说英语。', { phrases: [['speak English', '说英语'], ['speak up', '大声说']],  extraExamples: [['Can you speak French?', '你会说法语吗？'], ['He spoke at the meeting.', '他在会上发了言。']] }),
          w('s1u5-24', 'write', '/raɪt/', 'v.', '写；书写', 'Write a short passage.', '行为与动作', '写一篇短文。', { phrases: [['write down', '写下'], ['write to sb.', '给某人写信']],  extraExamples: [['Write your name on the paper.', '把名字写在纸上。'], ['She writes for a magazine.', '她为一家杂志撰稿。']] }),
          w('s1u5-25', 'read', '/riːd/', 'v.', '读；阅读', 'Read more books.', '行为与动作', '多读书。', { phrases: [['read books', '读书'], ['read aloud', '朗读']],  extraExamples: [['I read a book every week.', '我每周读一本书。'], ['She read the letter carefully.', '她仔细读了信。']] }),
        ],
      },
    ],
  },
  {
    id: 'senior-hk2',
    name: '人教版高中英语必修第二册（2019）',
    stage: '高中英语',
    wordCount: 60,
    builtin: true,
    desc: '人教社2019高中课标教材',
    units: [
      {
        id: 'senior-hk2-u1',
        title: 'Unit 1 · Cultural Heritage',
        words: [
          w('s2u1-1', 'heritage', '/ˈherɪtɪdʒ/', 'n.', '遗产；传统', 'We protect our cultural heritage.', '社会与环境', '我们保护文化遗产。', { phrases: [['cultural heritage', '文化遗产'], ['world heritage site', '世界遗产地']],  extraExamples: [['The Great Wall is part of our national heritage.', '长城是我们民族遗产的一部分。'], ['We must preserve our cultural heritage for future generations.', '我们必须为后代保护文化遗产。']] }),
          w('s2u1-2', 'temple', '/ˈtempl/', 'n.', '庙；寺', 'The temple is old.', '社会与环境', '寺庙很古老。', { phrases: [['Buddhist temple', '佛寺'], ['temple fair', '庙会']],  extraExamples: [['The temple was built 1,000 years ago.', '这座寺庙建于一千年前。'], ['We visited a famous temple in Kyoto.', '我们参观了京都一座有名的寺庙。']] }),
          w('s2u1-3', 'relic', '/ˈrelɪk/', 'n.', '遗物；遗迹', 'The relic is valuable.', '社会与环境', '遗迹很珍贵。', { phrases: [['ancient relic', '古代遗物'], ['cultural relics', '文物']],  extraExamples: [['The museum displays many ancient relics.', '博物馆展出许多古代文物。'], ['The relics are protected by law.', '这些文物受法律保护。']] }),
          w('s2u1-4', 'mount', '/maʊnt/', 'n.', '山峰 v. 爬上', 'They climbed the mount.', '社会与环境', '他们爬上了山。', { phrases: [['Mount Tai', '泰山'], ['mount up', '增加，积累']],  extraExamples: [['They set up camp at the foot of the mount.', '他们在山脚下扎营。'], ['The death toll mounted quickly.', '死亡人数迅速增加。']] }),
          w('s2u1-5', 'former', '/ˈfɔːmə(r)/', 'adj.', '以前的；前者的', 'The former plan was better.', '品质与状态', '以前的计划更好。', { phrases: [['the former...the latter...', '前者……后者……'], ['former president', '前总统']],  extraExamples: [['The former option is cheaper.', '前一个选项更便宜。'], ['He is a former teacher.', '他以前是老师。']] }),
          w('s2u1-6', 'preserve', '/prɪˈzɜːv/', 'vt.', '保存；保护', 'We preserve old buildings.', '行为与动作', '我们保护老建筑。', { phrases: [['preserve...from...', '保护……免受……'], ['well-preserved', '保存完好的']],  extraExamples: [['The old castle is well preserved.', '这座古堡保存完好。'], ['Salt helps preserve food.', '盐有助于保存食物。']] }),
          w('s2u1-7', 'promote', '/prəˈməʊt/', 'vt.', '促进；提升；推销', 'The campaign promotes health.', '行为与动作', '活动促进健康。', { phrases: [['promote...to...', '把……提升为……'], ['promote sales', '促销']],  extraExamples: [['She was promoted to manager.', '她被提升为经理。'], ['The band is promoting their new album.', '乐队在宣传新专辑。']] }),
          w('s2u1-8', 'balance', '/ˈbæləns/', 'n.', '平衡 v. 使平衡', 'Keep a balance in life.', '品质与状态', '生活保持平衡。', { phrases: [['keep a balance', '保持平衡'], ['lose one\'s balance', '失去平衡']],  extraExamples: [['Try to balance work and rest.', '努力平衡工作和休息。'], ['The balance of nature is important.', '生态平衡很重要。']] }),
          w('s2u1-9', 'dam', '/dæm/', 'n.', '水坝；拦河坝', 'The dam holds back water.', '社会与环境', '水坝拦着水。', { phrases: [['build a dam', '建水坝'], ['the Three Gorges Dam', '三峡大坝']],  extraExamples: [['The dam supplies electricity to the city.', '这座水坝为城市供电。'], ['The river was dammed to create a lake.', '这条河被筑坝拦成了湖。']] }),
          w('s2u1-10', 'proposal', '/prəˈpəʊzl/', 'n.', '提议；建议', 'The proposal was accepted.', '认知与学术', '建议被采纳了。', { phrases: [['put forward a proposal', '提出建议'], ['marriage proposal', '求婚']],  extraExamples: [['The proposal was rejected by the committee.', '这项建议被委员会否决了。'], ['He made a proposal at the meeting.', '他在会上提了个建议。']] }),
          w('s2u1-11', 'protest', '/ˈprəʊtest/', 'n./v.', '抗议；反对', 'They protested the plan.', '行为与动作', '他们抗议这项计划。', { phrases: [['protest against', '抗议……'], ['hold a protest', '举行抗议']],  extraExamples: [['Hundreds of people protested against the war.', '数百人抗议战争。'], ['The protest was peaceful.', '抗议是和平的。']] }),
          w('s2u1-12', 'likely', '/ˈlaɪkli/', 'adj.', '可能的', 'It is likely to rain.', '品质与状态', '可能要下雨。', { phrases: [['be likely to do', '可能做……'], ['as likely as not', '很可能']],  extraExamples: [['It is likely that he will be late.', '他可能会迟到。'], ['The likely cause is poor maintenance.', '可能的原因是维护不当。']] }),
          w('s2u1-13', 'committee', '/kəˈmɪti/', 'n.', '委员会', 'The committee met today.', '社会与环境', '委员会今天开会。', { phrases: [['standing committee', '常务委员会'], ['committee member', '委员']],  extraExamples: [['The committee will make a decision next week.', '委员会下周做决定。'], ['She is on the finance committee.', '她在财务委员会任职。']] }),
          w('s2u1-14', 'establish', '/ɪˈstæblɪʃ/', 'vt.', '建立；创立', 'They established a school.', '行为与动作', '他们建了一所学校。', { phrases: [['establish a company', '创立公司'], ['establish good relations', '建立良好关系']],  extraExamples: [['The company was established in 1990.', '这家公司成立于 1990 年。'], ['It is established that he is innocent.', '已经证实他是无辜的。']] }),
          w('s2u1-15', 'limit', '/ˈlɪmɪt/', 'n./v.', '限度；限制', 'There is a limit to time.', '认知与学术', '时间有限。', { phrases: [['there is a limit to...', '……是有限的'], ['limit...to...', '把……限制在……']],  extraExamples: [['There is a limit to how much I can help.', '我能帮的有限。'], ['Limit your speech to ten minutes.', '把发言限制在十分钟。']] }),
          w('s2u1-16', 'prevent', '/prɪˈvent/', 'vt.', '阻止；阻碍', 'Rain prevented the game.', '行为与动作', '雨阻止了比赛。', { phrases: [['prevent...from...', '阻止……做……'], ['prevent disease', '预防疾病']],  extraExamples: [['The rain prevented us from going out.', '下雨使我们不能外出。'], ['Wash your hands to prevent illness.', '洗手预防疾病。']] }),
          w('s2u1-17', 'contribution', '/ˌkɒntrɪˈbjuːʃn/', 'n.', '贡献；捐赠', 'His contribution is great.', '社会与环境', '他的贡献很大。', { phrases: [['make a contribution to', '对……做出贡献'], ['financial contribution', '捐款']],  extraExamples: [['He made a great contribution to science.', '他对科学做出了巨大贡献。'], ['All contributions are welcome.', '欢迎踊跃捐款。']] }),
          w('s2u1-18', 'department', '/dɪˈpɑːtmənt/', 'n.', '部；司；科', 'She works in the sales department.', '社会与环境', '她在销售部工作。', { phrases: [['department store', '百货商店'], ['the sales department', '销售部']],  extraExamples: [['He works in the HR department.', '他在人力资源部工作。'], ['The English department is on the third floor.', '英语系在三楼。']] }),
          w('s2u1-19', 'fund', '/fʌnd/', 'n.', '基金；专款', 'The fund helps the poor.', '社会与环境', '基金帮助穷人。', { phrases: [['raise funds', '筹集资金'], ['a fund for...', '……基金']],  extraExamples: [['The school set up a scholarship fund.', '学校设立了奖学金基金。'], ['The project is funded by the government.', '该项目由政府资助。']] }),
          w('s2u1-20', 'investigate', '/ɪnˈvestɪɡeɪt/', 'v.', '调查；研究', 'Police investigated the case.', '行为与动作', '警方调查了案件。', { phrases: [['investigate a case', '调查案件'], ['investigate into...', '对……进行调查']],  extraExamples: [['Police are investigating the accident.', '警方正在调查这起事故。'], ['Scientists investigated the cause of disease.', '科学家研究了病因。']] }),
          w('s2u1-21', 'protect', '/prəˈtekt/', 'v.', '保护', 'Protect cultural heritage.', '行为与动作', '保护文化遗产。', { phrases: [['protect...from...', '保护……免受……'], ['protect the environment', '保护环境']],  extraExamples: [['We should protect endangered animals.', '我们应该保护濒危动物。'], ['Wear a hat to protect your face from the sun.', '戴帽子保护脸防晒。']] }),
          w('s2u1-22', 'history', '/ˈhɪstri/', 'n.', '历史', 'We study world history.', '认知与学术', '我们学世界历史。', { phrases: [['in history', '历史上'], ['ancient history', '古代史']],  extraExamples: [['It was the worst storm in history.', '这是历史上最严重的风暴。'], ['She has a degree in history.', '她有历史学位。']] }),
          w('s2u1-23', 'culture', '/ˈkʌltʃə(r)/', 'n.', '文化', 'Chinese culture is rich.', '社会与环境', '中国文化博大精深。', { phrases: [['traditional culture', '传统文化'], ['popular culture', '流行文化']],  extraExamples: [['I love learning about different cultures.', '我喜欢了解不同文化。'], ['Tokyo is a cultural center.', '东京是文化中心。']] }),
          w('s2u1-24', 'old', '/əʊld/', 'adj.', '古老的；旧的', 'The old temple stands tall.', '品质与状态', '古寺高耸。', { phrases: [['old-fashioned', '过时的'], ['the old days', '过去的日子']],  extraExamples: [['This book is over 100 years old.', '这本书有一百多年历史了。'], ['He is my elder brother.', '他是我哥哥。']] }),
          w('s2u1-25', 'save', '/seɪv/', 'v.', '拯救；保存', 'Save the old building.', '行为与动作', '保护这座老建筑。', { phrases: [['save...from...', '把……从……中救出来'], ['save money', '存钱']],  extraExamples: [['The doctor saved his life.', '医生救了他的命。'], ['We should save water.', '我们应该节约用水。']] }),
          w('s2u1-26', 'craftsman', '/ˈkrɑːftsmən/', 'n.', '工匠；手艺人', 'The craftsman restored the temple.', '社会与环境', '工匠修复了寺庙。', { phrases: [['skilled craftsman', '熟练工匠'], ['master craftsman', '大师傅']],  extraExamples: [['The craftsman made the table by hand.', '这张桌子是工匠手工做的。'], ['It takes years to become a master craftsman.', '成为手艺大师需要多年时间。']] }),
          w('s2u1-27', 'creative', '/kriˈeɪtɪv/', 'adj.', '有创造力的', 'He has a creative mind.', '品质与状态', '他很有创造力。', { phrases: [['creative thinking', '创造性思维'], ['creative work', '创造性工作']],  extraExamples: [['The writer has a creative imagination.', '这位作家想象力丰富。'], ['You need to be creative in this job.', '这份工作需要创造力。']] }),
          w('s2u1-28', 'gallery', '/ˈɡæləri/', 'n.', '画廊；美术馆', 'The gallery shows old paintings.', '社会与环境', '画廊展出古画。', { phrases: [['art gallery', '美术馆'], ['the National Gallery', '国家美术馆']],  extraExamples: [['We visited a photography gallery.', '我们参观了一个摄影展。'], ['The gallery is open on weekends.', '美术馆周末开放。']] }),
          w('s2u1-29', 'church', '/tʃɜːtʃ/', 'n.', '教堂；礼拜堂', 'The church is famous.', '社会与环境', '这座教堂很有名。', { phrases: [['go to church', '做礼拜'], ['church service', '礼拜仪式']],  extraExamples: [['They go to church every Sunday.', '他们每周日做礼拜。'], ['The church was built in the 12th century.', '这座教堂建于 12 世纪。']] }),
          w('s2u1-30', 'passage', '/ˈpæsɪdʒ/', 'n.', '通道；段落', 'The passage leads to the gate.', '社会与环境', '通道通向大门。', { phrases: [['a narrow passage', '狭窄通道'], ['read a passage', '读一段文章']],  extraExamples: [['The passage is too narrow for cars.', '这条通道太窄，车过不去。'], ['Read the following passage and answer the questions.', '阅读下面的短文并回答问题。']] }),
          w('s2u1-31', 'figure', '/ˈfɪɡə(r)/', 'n.', '数字；人物；身材', 'The statue shows a famous figure.', '社会与环境', '雕像塑的是名人。', { phrases: [['a key figure', '关键人物'], ['keep one\'s figure', '保持身材']],  extraExamples: [['The figure in the painting is unknown.', '画中人物身份不明。'], ['Have you figured out the answer?', '你算出答案了吗？']] }),
          w('s2u1-32', 'site', '/saɪt/', 'n.', '地点；遗址；场所', 'The historical site is protected.', '社会与环境', '历史遗址受保护。', { phrases: [['historical site', '历史遗址'], ['on site', '在现场']],  extraExamples: [['The construction site is closed to visitors.', '工地禁止入内。'], ['This is the site of the ancient city.', '这里是古城遗址。']] }),
          w('s2u1-33', 'ruin', '/ˈruːɪn/', 'n.', '废墟 v. 毁坏', 'The ruins attract visitors.', '社会与环境', '废墟吸引游客。', { phrases: [['in ruins', '成为废墟'], ['the ruins of...', '……的废墟']],  extraExamples: [['The earthquake left the city in ruins.', '地震使这座城市成为废墟。'], ['Smoking ruined his health.', '抽烟毁了他的健康。']] }),
          w('s2u1-34', 'document', '/ˈdɒkjumənt/', 'v./n.', '记录；文件', 'They documented the relic.', '行为与动作', '他们记录了遗迹。', { phrases: [['official document', '官方文件'], ['document the process', '记录过程']],  extraExamples: [['Please sign this document.', '请签这份文件。'], ['The film documents life in the 1950s.', '这部影片记录了 50 年代的生活。']] }),
          w('s2u1-35', 'photograph', '/ˈfəʊtəɡrɑːf/', 'n.', '照片 v. 拍照', 'Take photographs of the temple.', '社会与环境', '给寺庙拍照。', { phrases: [['take a photograph', '拍照'], ['aerial photograph', '航拍照片']],  extraExamples: [['He took a photograph of the temple.', '他拍了一张寺庙的照片。'], ['She photographed the wildlife.', '她拍摄野生动物。']] }),
          w('s2u1-36', 'issue', '/ˈɪʃuː/', 'n.', '问题；议题 v. 发行', 'Air pollution is a big issue.', '认知与学术', '空气污染是大问题。', { phrases: [['a big issue', '大问题'], ['the latest issue', '最新一期']],  extraExamples: [['Climate change is a global issue.', '气候变化是全球性问题。'], ['The magazine comes out monthly.', '这本杂志每月出一期。']] }),
          w('s2u1-37', 'opinion', '/əˈpɪnjən/', 'n.', '意见；看法', 'In my opinion, it is worth saving.', '认知与学术', '在我看来值得保护。', { phrases: [['in my opinion', '在我看来'], ['public opinion', '舆论']],  extraExamples: [['What is your opinion on the plan?', '你对这个计划怎么看？'], ['Public opinion has changed.', '舆论已经变了。']] }),
          w('s2u1-38', 'process', '/ˈprəʊses/', 'n.', '过程；流程 v. 加工', 'The restoration process takes years.', '认知与学术', '修复过程需要多年。', { phrases: [['in the process of', '在……过程中'], ['the learning process', '学习过程']],  extraExamples: [['Learning a language is a long process.', '学语言是个漫长的过程。'], ['The data is being processed.', '数据正在处理中。']] }),
          w('s2u1-39', 'project', '/ˈprɒdʒekt/', 'n.', '项目；工程', 'The project saved the temple.', '社会与环境', '该工程挽救了寺庙。', { phrases: [['a research project', '研究项目'], ['project manager', '项目经理']],  extraExamples: [['The project will be completed next year.', '这个项目明年完工。'], ['We are working on a new project.', '我们在做一个新项目。']] }),
          w('s2u1-40', 'destroy', '/dɪˈstrɔɪ/', 'vt.', '摧毁；破坏', 'The flood destroyed the wall.', '行为与动作', '洪水冲毁了城墙。', { phrases: [['destroy the environment', '破坏环境'], ['destroy oneself', '自我毁灭']],  extraExamples: [['The fire destroyed the forest.', '大火烧毁了森林。'], ['Smoking destroyed his health.', '抽烟毁了他的健康。']] }),
          w('s2u1-41', 'remove', '/rɪˈmuːv/', 'v.', '移除；搬走', 'They removed the stones carefully.', '行为与动作', '他们小心移走石头。', { phrases: [['remove...from...', '把……从……移走'], ['remove a stain', '去污']],  extraExamples: [['Please remove your shoes before entering.', '进门前请脱鞋。'], ['The stain was removed easily.', '污渍很容易就洗掉了。']] }),
          w('s2u1-42', 'downtown', '/ˌdaʊnˈtaʊn/', 'adj./adv.', '市中心', 'The museum is downtown.', '社会与环境', '博物馆在市中心。', { phrases: [['downtown area', '市中心区域'], ['go downtown', '去市中心']],  extraExamples: [['I work downtown.', '我在市中心上班。'], ['There are many shops downtown.', '市中心有很多商店。']] }),
          w('s2u1-43', 'district', '/ˈdɪstrɪkt/', 'n.', '区域；行政区', 'The old district is beautiful.', '社会与环境', '老城区很美。', { phrases: [['the business district', '商业区'], ['the district of...', '……区']],  extraExamples: [['She lives in the business district.', '她住在商业区。'], ['The school district has 20 schools.', '这个学区有 20 所学校。']] }),
          w('s2u1-44', 'butterfly', '/ˈbʌtəflaɪ/', 'n.', '蝴蝶', 'Butterflies live in the garden.', '社会与环境', '蝴蝶在花园里。', { phrases: [['butterflies in one\'s stomach', '紧张得发抖'], ['a butterfly effect', '蝴蝶效应']],  extraExamples: [['A butterfly landed on the flower.', '一只蝴蝶落在花上。'], ['She had butterflies before the speech.', '演讲前她紧张得不行。']] }),
        ],
      },
      {
        id: 'senior-hk2-u2',
        title: 'Unit 2 · Wildlife Protection',
        words: [
          w('s2u2-1', 'poster', '/ˈpəʊstə(r)/', 'n.', '海报', 'The poster is colourful.', '社会与环境', '海报色彩鲜艳。', { phrases: [['put up a poster', '贴海报'], ['poster design', '海报设计']],  extraExamples: [['They put up posters around the school.', '他们在学校周围贴海报。'], ['The poster advertises a new movie.', '这张海报宣传一部新电影。']] }),
          w('s2u2-2', 'illegal', '/ɪˈliːɡl/', 'adj.', '不合法的；非法的', 'It is illegal to hunt.', '品质与状态', '打猎是非法的。', { phrases: [['it is illegal to do', '做……是违法的'], ['illegal hunting', '非法捕猎']],  extraExamples: [['It is illegal to drive without a license.', '无证驾驶是违法的。'], ['Illegal parking is common here.', '这里违规停车很常见。']] }),
          w('s2u2-3', 'hunt', '/hʌnt/', 'v.', '打猎；搜寻', 'They hunted for food.', '行为与动作', '他们猎取食物。', { phrases: [['hunt for', '搜寻……'], ['hunt animals', '捕猎动物']],  extraExamples: [['They hunted deer in the forest.', '他们在森林里猎鹿。'], ['Police are hunting for the missing child.', '警方正在搜寻失踪的孩子。']] }),
          w('s2u2-4', 'species', '/ˈspiːʃiːz/', 'n.', '物种', 'Many species are endangered.', '社会与环境', '许多物种濒危。', { phrases: [['endangered species', '濒危物种'], ['a species of', '一种……']],  extraExamples: [['There are over 8 million species on Earth.', '地球上有 800 多万种物种。'], ['This species of bird is very rare.', '这种鸟非常稀有。']] }),
          w('s2u2-5', 'shark', '/ʃɑːk/', 'n.', '鲨鱼', 'The shark swims fast.', '社会与环境', '鲨鱼游得快。', { phrases: [['shark fin', '鱼翅'], ['great white shark', '大白鲨']],  extraExamples: [['Sharks are at the top of the food chain.', '鲨鱼在食物链顶端。'], ['Many sharks are killed for their fins.', '许多鲨鱼因鱼翅被猎杀。']] }),
          w('s2u2-6', 'extinct', '/ɪkˈstɪŋkt/', 'adj.', '已灭绝的', 'The dinosaur is extinct.', '品质与状态', '恐龙已灭绝。', { phrases: [['become extinct', '灭绝'], ['extinct volcano', '死火山']],  extraExamples: [['Many animals have become extinct.', '许多动物已经灭绝。'], ['The dodo has been extinct for centuries.', '渡渡鸟已经灭绝几个世纪了。']] }),
          w('s2u2-7', 'habitat', '/ˈhæbɪtæt/', 'n.', '栖息地', 'Forest is their habitat.', '社会与环境', '森林是它们的栖息地。', { phrases: [['natural habitat', '自然栖息地'], ['destroy a habitat', '破坏栖息地']],  extraExamples: [['The forest is the tiger\'s natural habitat.', '森林是老虎的自然栖息地。'], ['Many animals are losing their habitats.', '许多动物正在失去栖息地。']] }),
          w('s2u2-8', 'aware', '/əˈweə(r)/', 'adj.', '知道的；意识到的', 'Be aware of the danger.', '认知与学术', '意识到危险。', { phrases: [['be aware of', '意识到……'], ['become aware that', '意识到……']],  extraExamples: [['Everyone should be aware of the problem.', '每个人都应该意识到这个问题。'], ['She became aware that someone was following her.', '她意识到有人在跟踪她。']] }),
          w('s2u2-9', 'endanger', '/ɪnˈdeɪndʒə(r)/', 'v.', '使遭受危险；危害', 'Pollution endangers fish.', '行为与动作', '污染危害鱼类。', { phrases: [['endanger one\'s life', '危及生命'], ['endangered species', '濒危物种']],  extraExamples: [['Smoking endangers your health.', '吸烟危害健康。'], ['The oil spill endangered many birds.', '石油泄漏危及许多鸟类。']] }),
          w('s2u2-10', 'average', '/ˈævərɪdʒ/', 'n.', '平均数 adj. 平均的', 'The average is high.', '认知与学术', '平均数很高。', { phrases: [['on average', '平均来看'], ['the average of...', '……的平均数']],  extraExamples: [['On average, men are taller than women.', '平均来看，男人比女人高。'], ['The average temperature is 20°C.', '平均气温是 20 摄氏度。']] }),
          w('s2u2-11', 'concern', '/kənˈsɜːn/', 'v.', '涉及；使担忧', 'The news concerns everyone.', '情感与性格', '这消息关系到每个人。', { phrases: [['be concerned about', '担心……'], ['as far as...is concerned', '就……而言']],  extraExamples: [['Parents are concerned about their children\'s health.', '父母担心孩子的健康。'], ['The problem concerns everyone.', '这个问题关系到每个人。']] }),
          w('s2u2-12', 'adapt', '/əˈdæpt/', 'v.', '适应；使适合', 'Animals adapt to nature.', '行为与动作', '动物适应自然。', { phrases: [['adapt to', '适应……'], ['adapt oneself to', '使自己适应……']],  extraExamples: [['It takes time to adapt to a new environment.', '适应新环境需要时间。'], ['Animals can adapt to changes.', '动物能适应变化。']] }),
          w('s2u2-13', 'measure', '/ˈmeʒə(r)/', 'n.', '措施 v. 测量', 'We took measures.', '认知与学术', '我们采取了措施。', { phrases: [['take measures', '采取措施'], ['measure...by...', '用……衡量……']],  extraExamples: [['We must take measures to protect animals.', '我们必须采取措施保护动物。'], ['Measure the room before buying a carpet.', '买地毯前先量房间。']] }),
          w('s2u2-14', 'authority', '/ɔːˈθɒrəti/', 'n.', '官方；权威', 'The authority made rules.', '社会与环境', '官方制定了规则。', { phrases: [['the authorities', '当局'], ['have authority over', '对……有权威']],  extraExamples: [['The local authority built a new park.', '地方当局建了一个新公园。'], ['She is an authority on wildlife protection.', '她是野生动物保护方面的权威。']] }),
          w('s2u2-15', 'pressure', '/ˈpreʃə(r)/', 'n.', '压力；要求', 'He works under pressure.', '情感与性格', '他在压力下工作。', { phrases: [['under pressure', '在压力下'], ['put pressure on', '对……施加压力']],  extraExamples: [['He is under a lot of pressure at work.', '他工作压力很大。'], ['Don\'t put pressure on yourself.', '不要给自己太大压力。']] }),
          w('s2u2-16', 'reserve', '/rɪˈzɜːv/', 'n.', '保护区 v. 预订', 'The reserve protects animals.', '社会与环境', '保护区保护动物。', { phrases: [['nature reserve', '自然保护区'], ['reserve a table', '预订桌子']],  extraExamples: [['The nature reserve is home to many rare birds.', '这个自然保护区是许多珍稀鸟类的家园。'], ['I reserved a room for tonight.', '我预订了今晚的房间。']] }),
          w('s2u2-17', 'observe', '/əbˈzɜːv/', 'vt.', '观察；遵守', 'Scientists observe birds.', '行为与动作', '科学家观察鸟类。', { phrases: [['observe sb do sth', '观察某人做某事'], ['observe the rules', '遵守规则']],  extraExamples: [['Scientists observe the behavior of animals.', '科学家观察动物的行为。'], ['Everyone must observe the traffic rules.', '每个人都必须遵守交通规则。']] }),
          w('s2u2-18', 'remind', '/rɪˈmaɪnd/', 'vt.', '提醒；使想起', 'Remind me to call.', '行为与动作', '提醒我打电话。', { phrases: [['remind sb of sth', '使某人想起某事'], ['remind sb to do', '提醒某人做……']],  extraExamples: [['Please remind me to call her.', '请提醒我给她打电话。'], ['This song reminds me of my childhood.', '这首歌让我想起童年。']] }),
          w('s2u2-19', 'shoot', '/ʃuːt/', 'v.', '射杀；发射', 'Don\u2019t shoot animals.', '行为与动作', '不要射杀动物。', { phrases: [['shoot at', '向……射击'], ['shoot a photo', '拍照']],  extraExamples: [['The hunter shot a deer.', '猎人射了一只鹿。'], ['He took out his camera and shot a photo.', '他拿出相机拍了一张照。']] }),
          w('s2u2-20', 'threaten', '/ˈθretn/', 'vt.', '威胁；危及', 'Pollution threatens wildlife.', '行为与动作', '污染威胁野生动物。', { phrases: [['threaten to do', '威胁要做……'], ['threaten sb with', '用……威胁某人']],  extraExamples: [['Climate change threatens many species.', '气候变化威胁着许多物种。'], ['The robber threatened him with a knife.', '抢劫犯用刀威胁他。']] }),
          w('s2u2-21', 'animal', '/ˈænɪml/', 'n.', '动物', 'Wild animals need protection.', '社会与环境', '野生动物需要保护。', { phrases: [['wild animals', '野生动物'], ['animal kingdom', '动物界']],  extraExamples: [['Dogs are loyal animals.', '狗是忠诚的动物。'], ['The zoo has many kinds of animals.', '动物园里有很多种动物。']] }),
          w('s2u2-22', 'plant', '/plɑːnt/', 'n.', '植物 v. 种植', 'Plants and animals live together.', '社会与环境', '动植物共生。', { phrases: [['plant trees', '植树'], ['green plants', '绿色植物']],  extraExamples: [['Plants need sunlight and water.', '植物需要阳光和水。'], ['We planted trees in the spring.', '我们春天种了树。']] }),
          w('s2u2-23', 'nature', '/ˈneɪtʃə(r)/', 'n.', '自然', 'Protect nature.', '社会与环境', '保护自然。', { phrases: [['in nature', '在自然界中'], ['by nature', '天生地']],  extraExamples: [['We should protect nature.', '我们应该保护自然。'], ['The park is full of beautiful nature.', '这个公园充满了美丽的自然风光。']] }),
          w('s2u2-24', 'danger', '/ˈdeɪndʒə(r)/', 'n.', '危险', 'Many animals are in danger.', '社会与环境', '许多动物处境危险。', { phrases: [['in danger', '处于危险中'], ['out of danger', '脱离危险']],  extraExamples: [['The bridge is in danger of falling down.', '这座桥有倒塌的危险。'], ['His life is in danger.', '他的生命有危险。']] }),
          w('s2u2-25', 'save', '/seɪv/', 'v.', '拯救；节约', 'Save endangered animals.', '行为与动作', '拯救濒危动物。', { phrases: [['save...from...', '把……从……中救出'], ['save water', '节约用水']],  extraExamples: [['We must save the animals from extinction.', '我们必须拯救这些动物免于灭绝。'], ['Save electricity by turning off lights.', '关灯省电。']] }),
          w('s2u2-26', 'fin', '/fɪn/', 'n.', '（鱼的）鳍', 'Shark fin trade must stop.', '社会与环境', '鱼翅贸易必须停止。', { phrases: [['shark fin', '鱼翅'], ['tail fin', '尾鳍']],  extraExamples: [['A fish uses its fins to swim.', '鱼用鳍游泳。'], ['Shark fin soup is expensive.', '鱼翅汤很贵。']] }),
          w('s2u2-27', 'whale', '/weɪl/', 'n.', '鲸', 'Whales are the largest animals.', '社会与环境', '鲸是最大的动物。', { phrases: [['blue whale', '蓝鲸'], ['a whale of a...', '极大的……']],  extraExamples: [['The blue whale is the largest animal on Earth.', '蓝鲸是地球上最大的动物。'], ['Whales breathe air.', '鲸鱼呼吸空气。']] }),
          w('s2u2-28', 'antelope', '/ˈæntɪləʊp/', 'n.', '羚羊', 'Tibetan antelopes are protected.', '社会与环境', '藏羚羊受保护。', { phrases: [['Tibetan antelope', '藏羚羊'], ['antelope horn', '羚羊角']],  extraExamples: [['Antelopes can run very fast.', '羚羊能跑得很快。'], ['Tibetan antelopes live in Qinghai-Tibet Plateau.', '藏羚羊生活在青藏高原。']] }),
          w('s2u2-29', 'deer', '/dɪə(r)/', 'n.', '鹿', 'Deer live in the forest.', '社会与环境', '鹿生活在森林里。', { phrases: [['a herd of deer', '一群鹿'], ['red deer', '马鹿']],  extraExamples: [['We saw a deer in the woods.', '我们在树林里看到一只鹿。'], ['Male deer have antlers.', '雄鹿有角。']] }),
          w('s2u2-30', 'kangaroo', '/ˌkæŋɡəˈruː/', 'n.', '袋鼠', 'Kangaroos live in Australia.', '社会与环境', '袋鼠生活在澳洲。', { phrases: [['kangaroo care', '袋鼠式护理'], ['baby kangaroo', '小袋鼠']],  extraExamples: [['Kangaroos carry their babies in a pouch.', '袋鼠用育儿袋带宝宝。'], ['Kangaroos can jump very far.', '袋鼠能跳得很远。']] }),
          w('s2u2-31', 'dolphin', '/ˈdɒlfɪn/', 'n.', '海豚', 'Dolphins are very intelligent.', '社会与环境', '海豚很聪明。', { phrases: [['dolphin show', '海豚表演'], ['dolphin trainer', '海豚训练师']],  extraExamples: [['Dolphins are very smart animals.', '海豚是很聪明的动物。'], ['We watched the dolphin show at the aquarium.', '我们在水族馆看了海豚表演。']] }),
          w('s2u2-32', 'ivory', '/ˈaɪvəri/', 'n.', '象牙', 'Ivory trade is illegal.', '社会与环境', '象牙贸易非法。', { phrases: [['ivory trade', '象牙贸易'], ['ivory tower', '象牙塔']],  extraExamples: [['Ivory is very expensive.', '象牙非常昂贵。'], ['Many elephants are killed for their ivory.', '许多大象因象牙被猎杀。']] }),
          w('s2u2-33', 'extinction', '/ɪkˈstɪŋkʃn/', 'n.', '灭绝；绝种', 'Many species face extinction.', '社会与环境', '许多物种面临灭绝。', { phrases: [['face extinction', '面临灭绝'], ['on the edge of extinction', '濒临灭绝']],  extraExamples: [['Many animals are on the edge of extinction.', '许多动物濒临灭绝。'], ['Pollution has led to the extinction of many species.', '污染导致许多物种灭绝。']] }),
          w('s2u2-34', 'endangered', '/ɪnˈdeɪndʒəd/', 'adj.', '濒危的', 'Pandas are no longer endangered.', '品质与状态', '大熊猫不再濒危。', { phrases: [['endangered species', '濒危物种'], ['endangered animals', '濒危动物']],  extraExamples: [['Pandas are endangered animals.', '熊猫是濒危动物。'], ['Many endangered species are protected by law.', '许多濒危物种受法律保护。']] }),
          w('s2u2-35', 'hunter', '/ˈhʌntə(r)/', 'n.', '猎人', 'The hunter set a trap.', '社会与环境', '猎人设了陷阱。', { phrases: [['a hunter-gatherer', '狩猎采集者'], ['bounty hunter', '赏金猎人']],  extraExamples: [['The hunter shot a rabbit.', '猎人射了一只兔子。'], ['Illegal hunters kill elephants for ivory.', '非法猎人猎杀大象取象牙。']] }),
          w('s2u2-36', 'illegally', '/ɪˈliːɡəli/', 'adv.', '非法地', 'They hunted illegally.', '行为与动作', '他们非法捕猎。', { phrases: [['hunt illegally', '非法捕猎'], ['sell illegally', '非法出售']],  extraExamples: [['They were arrested for hunting illegally.', '他们因非法捕猎被捕。'], ['The goods were imported illegally.', '这些货物是非法进口的。']] }),
          w('s2u2-37', 'immediately', '/ɪˈmiːdiətli/', 'adv.', '立刻；马上', 'Report it immediately.', '行为与动作', '立刻报告。', { phrases: [['immediately after', '紧接着……'], ['reply immediately', '立即回复']],  extraExamples: [['Please call me immediately.', '请马上给我打电话。'], ['He came immediately after work.', '他下班马上就来了。']] }),
          w('s2u2-38', 'alarming', '/əˈlɑːmɪŋ/', 'adj.', '令人担忧的；惊人的', 'The news is alarming.', '情感与性格', '这消息令人担忧。', { phrases: [['alarming news', '令人担忧的消息'], ['alarming rate', '惊人的速度']],  extraExamples: [['The report shows alarming statistics.', '报告显示了惊人的统计数据。'], ['The speed of deforestation is alarming.', '森林砍伐的速度令人担忧。']] }),
          w('s2u2-39', 'skin', '/skɪn/', 'n.', '皮；皮肤', 'The tiger has striped skin.', '社会与环境', '老虎有条纹皮。', { phrases: [['skin and bones', '瘦得皮包骨'], ['by the skin of one\'s teeth', '勉强']],  extraExamples: [['She has smooth skin.', '她皮肤光滑。'], ['Many animals are killed for their skin.', '许多动物因皮毛被猎杀。']] }),
          w('s2u2-40', 'goods', '/ɡʊdz/', 'n.', '商品；货物', 'The shop sells animal goods.', '社会与环境', '商店卖动物制品。', { phrases: [['consumer goods', '消费品'], ['deliver goods', '送货']],  extraExamples: [['The shop sells all kinds of goods.', '这家商店卖各种商品。'], ['These goods are made in China.', '这些商品是中国制造的。']] }),
          w('s2u2-41', 'net', '/net/', 'n.', '网 adj. 净得的', 'They caught fish in a net.', '社会与环境', '他们用网捕鱼。', { phrases: [['fishing net', '渔网'], ['net weight', '净重']],  extraExamples: [['They caught fish with a net.', '他们用网捕鱼。'], ['The net weight is 500 grams.', '净重 500 克。']] }),
          w('s2u2-42', 'neighbourhood', '/ˈneɪbəhʊd/', 'n.', '街区；临近地区', 'There is a park in the neighbourhood.', '社会与环境', '附近有个公园。', { phrases: [['in the neighbourhood', '在附近'], ['neighbourhood watch', '社区联防']],  extraExamples: [['There is a good restaurant in the neighbourhood.', '附近有一家好餐厅。'], ['Our neighbourhood is very quiet.', '我们的街区很安静。']] }),
          w('s2u2-43', 'due', '/djuː/', 'adj.', '由于；因为；到期的', 'The trip is due next week.', '认知与学术', '旅行下周到期。', { phrases: [['due to', '由于……'], ['be due to do', '预计做……']],  extraExamples: [['The game was put off due to rain.', '比赛因雨推迟。'], ['The train is due at 3 pm.', '火车预计下午 3 点到。']] }),
          w('s2u2-44', 'threat', '/θret/', 'n.', '威胁；恐吓', 'Pollution is a threat to wildlife.', '社会与环境', '污染威胁野生动物。', { phrases: [['a threat to', '对……的威胁'], ['under threat', '受到威胁']],  extraExamples: [['Pollution is a threat to our health.', '污染威胁我们的健康。'], ['The bird\'s habitat is under threat.', '这种鸟的栖息地受到威胁。']] }),
        ],
      },
      {
        id: 'senior-hk2-u3',
        title: 'Unit 3 · The Internet',
        words: [
          w('s2u3-1', 'blog', '/blɒɡ/', 'n.', '博客 v. 写博客', 'She writes a blog.', '社会与环境', '她写博客。'),
          w('s2u3-2', 'engine', '/ˈendʒɪn/', 'n.', '引擎；发动机', 'The engine works well.', '社会与环境', '引擎运转良好。'),
          w('s2u3-3', 'chat', '/tʃæt/', 'v./n.', '聊天；闲聊', 'We chatted online.', '行为与动作', '我们在线聊天。'),
          w('s2u3-4', 'identity', '/aɪˈdentəti/', 'n.', '身份；个性', 'Please show your identity.', '社会与环境', '请出示你的身份。'),
          w('s2u3-5', 'convenient', '/kənˈviːniənt/', 'adj.', '方便的；近便的', 'Online shopping is convenient.', '品质与状态', '网购很方便。'),
          w('s2u3-6', 'cash', '/kæʃ/', 'n.', '现金；金钱', 'Pay in cash.', '社会与环境', '付现金。'),
          w('s2u3-7', 'update', '/ˌʌpˈdeɪt/', 'v./n.', '更新', 'Update the app.', '行为与动作', '更新应用。'),
          w('s2u3-8', 'database', '/ˈdeɪtəbeɪs/', 'n.', '数据库；资料库', 'The database is large.', '社会与环境', '数据库很大。'),
          w('s2u3-9', 'software', '/ˈsɒftweə(r)/', 'n.', '软件', 'The software is free.', '社会与环境', '这个软件免费。'),
          w('s2u3-10', 'network', '/ˈnetwɜːk/', 'n.', '网络；人际网', 'The network is fast.', '社会与环境', '网络很快。'),
          w('s2u3-11', 'surf', '/sɜːf/', 'v.', '浏览；冲浪', 'He surfs the Internet.', '行为与动作', '他上网浏览。'),
          w('s2u3-12', 'benefit', '/ˈbenɪfɪt/', 'n.', '益处 v. 使受益', 'Exercise benefits health.', '社会与环境', '锻炼有益健康。'),
          w('s2u3-13', 'distance', '/ˈdɪstəns/', 'n.', '距离', 'The distance is long.', '社会与环境', '距离很远。'),
          w('s2u3-14', 'inspire', '/ɪnˈspaɪə(r)/', 'vt.', '鼓舞；激励', 'Her story inspires me.', '情感与性格', '她的故事激励我。'),
          w('s2u3-15', 'access', '/ˈækses/', 'n.', '通道；机会 v. 获取', 'Have access to the Internet.', '社会与环境', '能上网。'),
          w('s2u3-16', 'charity', '/ˈtʃærəti/', 'n.', '慈善；慈善机构', 'She works for charity.', '社会与环境', '她为慈善工作。'),
          w('s2u3-17', 'tough', '/tʌf/', 'adj.', '艰难的；严厉的', 'It was a tough task.', '品质与状态', '这是项艰难的任务。'),
          w('s2u3-18', 'province', '/ˈprɒvɪns/', 'n.', '省', 'He lives in another province.', '社会与环境', '他住在另一个省。'),
          w('s2u3-19', 'conference', '/ˈkɒnfərəns/', 'n.', '会议；研讨会', 'The conference was useful.', '社会与环境', '会议很有用。'),
          w('s2u3-20', 'battery', '/ˈbætri/', 'n.', '电池', 'The battery is low.', '社会与环境', '电池快没电了。'),
          w('s2u3-21', 'internet', '/ˈɪntənet/', 'n.', '互联网', 'The internet connects the world.', '社会与环境', '互联网连接世界。'),
          w('s2u3-22', 'online', '/ˌɒnˈlaɪn/', 'adj.', '在线的', 'Online learning is popular.', '社会与环境', '在线学习很流行。'),
          w('s2u3-23', 'phone', '/fəʊn/', 'n.', '电话；手机', 'The phone rings.', '社会与环境', '电话响了。'),
          w('s2u3-24', 'computer', '/kəmˈpjuːtə(r)/', 'n.', '电脑', 'I use a computer to study.', '社会与环境', '我用电脑学习。'),
          w('s2u3-25', 'information', '/ˌɪnfəˈmeɪʃn/', 'n.', '信息；资料', 'Find information online.', '认知与学术', '在网上找信息。'),
          w('s2u3-26', 'blogger', '/ˈblɒɡə(r)/', 'n.', '博主；写博客的人', 'The blogger writes about travel.', '社会与环境', '这位博主写旅行内容。'),
          w('s2u3-27', 'identity', '/aɪˈdentəti/', 'n.', '身份；本身', 'Please show your identity card.', '社会与环境', '请出示身份证。'),
          w('s2u3-28', 'convenient', '/kənˈviːniənt/', 'adj.', '方便的；便利的', 'Online shopping is convenient.', '品质与状态', '网购很方便。'),
          w('s2u3-29', 'update', '/ˌʌpˈdeɪt/', 'v./n.', '更新；最新信息', 'Update the app regularly.', '行为与动作', '定期更新应用。'),
          w('s2u3-30', 'download', '/ˌdaʊnˈləʊd/', 'v.', '下载', 'Download the file for free.', '行为与动作', '免费下载这个文件。'),
          w('s2u3-31', 'upload', '/ˌʌpˈləʊd/', 'v.', '上传', 'Upload your photo to the cloud.', '行为与动作', '把照片上传到云端。'),
          w('s2u3-32', 'network', '/ˈnetwɜːk/', 'n.', '网络；关系网', 'The network is fast here.', '社会与环境', '这里网络很快。'),
          w('s2u3-33', 'benefit', '/ˈbenɪfɪt/', 'n./v.', '益处；使受益', 'The internet benefits us all.', '社会与环境', '互联网惠及大家。'),
          w('s2u3-34', 'distance', '/ˈdɪstəns/', 'n.', '距离；远方', 'The internet reduces distance.', '社会与环境', '互联网缩短距离。'),
          w('s2u3-35', 'inspire', '/ɪnˈspaɪə(r)/', 'v.', '激励；启发', 'Her story inspires many people.', '情感与性格', '她的故事激励很多人。'),
          w('s2u3-36', 'access', '/ˈækses/', 'n./v.', '使用权；访问', 'Have access to free Wi-Fi.', '社会与环境', '能使用免费 Wi-Fi。'),
          w('s2u3-37', 'charity', '/ˈtʃærəti/', 'n.', '慈善；慈善机构', 'She donates to charity online.', '社会与环境', '她在线捐款给慈善机构。'),
          w('s2u3-38', 'tough', '/tʌf/', 'adj.', '艰难的；强硬的', 'It was a tough decision.', '品质与状态', '那是个艰难的决定。'),
          w('s2u3-39', 'province', '/ˈprɒvɪns/', 'n.', '省；省份', 'He works in another province.', '社会与环境', '他在外省工作。'),
          w('s2u3-40', 'conference', '/ˈkɒnfərəns/', 'n.', '会议；研讨会', 'The online conference went well.', '社会与环境', '线上会议很顺利。'),
          w('s2u3-41', 'battery', '/ˈbætri/', 'n.', '电池', 'The battery is running low.', '社会与环境', '电池快没电了。'),
          w('s2u3-42', 'plus', '/plʌs/', 'prep./adj.', '加上；有利的', 'Plus, it is free.', '认知与学术', '而且它是免费的。'),
          w('s2u3-43', 'function', '/ˈfʌŋkʃn/', 'n./v.', '功能；运转', 'The app has many functions.', '认知与学术', '这个应用功能很多。'),
          w('s2u3-44', 'file', '/faɪl/', 'n.', '文件；文件夹', 'Save the file to your drive.', '社会与环境', '把文件存到磁盘。'),
        ],
      },
      {
        id: 'senior-hk2-u4',
        title: 'Unit 4 · History and Traditions',
        words: [
          w('s2u4-1', 'Confucius', '/kənˈfjuːʃəs/', 'n.', '孔子', 'Confucius was a great thinker.', '社会与环境', '孔子是伟大的思想家。'),
          w('s2u4-2', 'mansion', '/ˈmænʃn/', 'n.', '公馆；宅第', 'The old mansion is famous.', '社会与环境', '这座老宅很有名。'),
          w('s2u4-3', 'cemetery', '/ˈsemətri/', 'n.', '墓地；公墓', 'They visited the cemetery.', '社会与环境', '他们去了公墓。'),
          w('s2u4-4', 'philosophy', '/fəˈlɒsəfi/', 'n.', '哲学；人生哲学', 'He studies philosophy.', '认知与学术', '他学哲学。'),
          w('s2u4-5', 'descendant', '/dɪˈsendənt/', 'n.', '后裔；后代', 'He is a descendant of poets.', '社会与环境', '他是诗人后代。'),
          w('s2u4-6', 'individual', '/ˌɪndɪˈvɪdʒuəl/', 'n.', '个人 adj. 个别的', 'Each individual matters.', '社会与环境', '每个人都重要。'),
          w('s2u4-7', 'heel', '/hiːl/', 'n.', '足跟；后跟', 'He has a blister on his heel.', '社会与环境', '他脚后跟起泡。'),
          w('s2u4-8', 'kingdom', '/ˈkɪŋdəm/', 'n.', '王国；领域', 'The kingdom was united.', '社会与环境', '王国统一了。'),
          w('s2u4-9', 'chief', '/tʃiːf/', 'adj.', '主要的 n. 首领', 'The chief reason is money.', '品质与状态', '主要原因是钱。'),
          w('s2u4-10', 'puzzle', '/ˈpʌzl/', 'n.', '谜；难题 v. 使困惑', 'The puzzle is hard.', '认知与学术', '这个谜很难。'),
          w('s2u4-11', 'nearby', '/ˌnɪəˈbaɪ/', 'adj.', '附近的 adv. 在附近', 'He lives nearby.', '社会与环境', '他住在附近。'),
          w('s2u4-12', 'belong', '/bɪˈlɒŋ/', 'vi.', '属于；应在', 'This book belongs to me.', '社会与环境', '这本书是我的。'),
          w('s2u4-13', 'join', '/dʒɔɪn/', 'v.', '连接；加入', 'Join the two parts.', '行为与动作', '把两部分连起来。'),
          w('s2u4-14', 'wealth', '/welθ/', 'n.', '财富；丰富', 'Health is better than wealth.', '社会与环境', '健康胜过财富。'),
          w('s2u4-15', 'achievement', '/əˈtʃiːvmənt/', 'n.', '成就；成绩', 'The achievement is great.', '品质与状态', '成就很大。'),
          w('s2u4-16', 'courtyard', '/ˈkɔːtjɑːd/', 'n.', '庭院；院子', 'They sat in the courtyard.', '社会与环境', '他们坐在院子里。'),
          w('s2u4-17', 'poet', '/ˈpəʊɪt/', 'n.', '诗人', 'The poet wrote many poems.', '社会与环境', '这位诗人写了很多诗。'),
          w('s2u4-18', 'ancient', '/ˈeɪnʃənt/', 'adj.', '古代的；古老的', 'They visited ancient ruins.', '社会与环境', '他们参观了古迹。'),
          w('s2u4-19', 'tradition', '/trəˈdɪʃn/', 'n.', '传统；风俗', 'It is a local tradition.', '社会与环境', '这是地方传统。'),
          w('s2u4-20', 'location', '/ləʊˈkeɪʃn/', 'n.', '位置；地点', 'The location is perfect.', '社会与环境', '位置很完美。'),
          w('s2u4-21', 'old', '/əʊld/', 'adj.', '古老的', 'Old traditions matter.', '品质与状态', '古老传统很重要。'),
          w('s2u4-22', 'history', '/ˈhɪstri/', 'n.', '历史', 'Learn from history.', '认知与学术', '以史为鉴。'),
          w('s2u4-23', 'culture', '/ˈkʌltʃə(r)/', 'n.', '文化', 'Traditions shape culture.', '社会与环境', '传统塑造文化。'),
          w('s2u4-24', 'festival', '/ˈfestɪvl/', 'n.', '节日', 'Festivals bring people together.', '社会与环境', '节日让人们相聚。'),
          w('s2u4-25', 'people', '/ˈpiːpl/', 'n.', '人们；人民', 'People celebrate together.', '社会与环境', '人们一起庆祝。'),
          w('s2u4-26', 'philosophy', '/fəˈlɒsəfi/', 'n.', '哲学；人生观', 'She studies ancient philosophy.', '认知与学术', '她研究古代哲学。'),
          w('s2u4-27', 'descendant', '/dɪˈsendənt/', 'n.', '后裔；后代', 'He is a descendant of Confucius.', '社会与环境', '他是孔子的后裔。'),
          w('s2u4-28', 'individual', '/ˌɪndɪˈvɪdʒuəl/', 'adj./n.', '单独的；个人', 'Each individual has rights.', '社会与环境', '每个人都有权利。'),
          w('s2u4-29', 'chief', '/tʃiːf/', 'adj./n.', '最重要的；首领', 'The chief reason is money.', '认知与学术', '主要原因是钱。'),
          w('s2u4-30', 'nearby', '/ˌnɪəˈbaɪ/', 'adj./adv.', '附近的；在附近', 'There is a cafe nearby.', '社会与环境', '附近有家咖啡馆。'),
          w('s2u4-31', 'conquer', '/ˈkɒŋkə(r)/', 'v.', '占领；征服', 'The army conquered the city.', '行为与动作', '军队占领了这座城市。'),
          w('s2u4-32', 'amount', '/əˈmaʊnt/', 'n.', '金额；数量', 'A large amount of money.', '认知与学术', '一大笔钱。'),
          w('s2u4-33', 'gallery', '/ˈɡæləri/', 'n.', '展览馆；画廊', 'We visited the art gallery.', '社会与环境', '我们参观了艺术画廊。'),
          w('s2u4-34', 'ensure', '/ɪnˈʃʊə(r)/', 'v.', '保证；确保', 'Ensure the door is locked.', '行为与动作', '确保门锁好。'),
          w('s2u4-35', 'position', '/pəˈzɪʃn/', 'n.', '位置；职位', 'He took up a new position.', '社会与环境', '他担任了新职位。'),
          w('s2u4-36', 'currency', '/ˈkʌrənsi/', 'n.', '通货；货币', 'The local currency is the euro.', '社会与环境', '当地货币是欧元。'),
          w('s2u4-37', 'military', '/ˈmɪlətri/', 'adj.', '军事的；军用的', 'Military spending increased.', '社会与环境', '军事开支增加了。'),
          w('s2u4-38', 'defence', '/dɪˈfens/', 'n.', '防御；保卫', 'National defence is important.', '社会与环境', '国防很重要。'),
          w('s2u4-39', 'charge', '/tʃɑːdʒ/', 'v./n.', '收费；指控；充电', 'He was charged with theft.', '行为与动作', '他被指控盗窃。'),
          w('s2u4-40', 'feast', '/fiːst/', 'n.', '盛宴；节日', 'They prepared a wedding feast.', '社会与环境', '他们准备了婚宴。'),
          w('s2u4-41', 'custom', '/ˈkʌstəm/', 'n.', '风俗；习惯', 'It is a local custom.', '社会与环境', '这是当地风俗。'),
          w('s2u4-42', 'emigrant', '/ˈemɪɡrənt/', 'n.', '移民；移居国外者', 'Many emigrants left Europe.', '社会与环境', '许多移民离开了欧洲。'),
          w('s2u4-43', 'voyage', '/ˈvɔɪɪdʒ/', 'n.', '航行；航海', 'The voyage took months.', '行为与动作', '航行花了几个月。'),
          w('s2u4-44', 'explore', '/ɪkˈsplɔː(r)/', 'v.', '探索；探险', 'They explored the ancient ruins.', '行为与动作', '他们探索了古代遗址。'),
        ],
      },
      {
        id: 'senior-hk2-u5',
        title: 'Unit 5 · Music',
        words: [
          w('s2u5-1', 'classical', '/ˈklæsɪkl/', 'adj.', '古典的；经典的', 'She likes classical music.', '品质与状态', '她喜欢古典音乐。'),
          w('s2u5-2', 'hip-hop', '/ˈhɪp hɒp/', 'n.', '嘻哈音乐', 'Hip-hop is popular.', '社会与环境', '嘻哈音乐很流行。'),
          w('s2u5-3', 'techno', '/ˈteknəʊ/', 'n.', '电子音乐', 'Techno has fast beats.', '社会与环境', '电子音乐节拍快。'),
          w('s2u5-4', 'energy', '/ˈenədʒi/', 'n.', '能量；精力', 'He is full of energy.', '品质与状态', '他精力充沛。'),
          w('s2u5-5', 'soul', '/səʊl/', 'n.', '灵魂；心灵', 'She put her soul into music.', '情感与性格', '她全身心投入音乐。'),
          w('s2u5-6', 'musician', '/mjuˈzɪʃn/', 'n.', '音乐家', 'The musician plays piano.', '社会与环境', '这位音乐家弹钢琴。'),
          w('s2u5-7', 'pretend', '/prɪˈtend/', 'v.', '假装；假扮', 'He pretended to be ill.', '行为与动作', '他假装生病。'),
          w('s2u5-8', 'attach', '/əˈtætʃ/', 'v.', '系上；附加；连接', 'Attach the label to the bag.', '行为与动作', '把标签系到包上。'),
          w('s2u5-9', 'form', '/fɔːm/', 'v.', '组成；形成 n. 形式', 'They formed a band.', '行为与动作', '他们组建了乐队。'),
          w('s2u5-10', 'fame', '/feɪm/', 'n.', '名声；名望', 'The singer rose to fame.', '社会与环境', '这位歌手成名了。'),
          w('s2u5-11', 'ordinary', '/ˈɔːdnri/', 'adj.', '普通的；平凡的', 'He is just an ordinary man.', '品质与状态', '他只是个普通人。'),
          w('s2u5-12', 'enable', '/ɪˈneɪbl/', 'vt.', '使能够；使可能', 'Money enables him to travel.', '行为与动作', '钱让他能旅行。'),
          w('s2u5-13', 'prove', '/pruːv/', 'v.', '证明；展现', 'Prove your point.', '行为与动作', '证明你的观点。'),
          w('s2u5-14', 'award', '/əˈwɔːd/', 'n.', '奖品 v. 授予', 'She won an award.', '社会与环境', '她获奖了。'),
          w('s2u5-15', 'composer', '/kəmˈpəʊzə(r)/', 'n.', '作曲家', 'The composer wrote the song.', '社会与环境', '作曲家写了这首歌。'),
          w('s2u5-16', 'relief', '/rɪˈliːf/', 'n.', '减轻；宽慰', 'It is a great relief.', '情感与性格', '这是很大的宽慰。'),
          w('s2u5-17', 'cure', '/kjʊə(r)/', 'v.', '治愈 n. 药物', 'The medicine cured him.', '行为与动作', '药治好了他。'),
          w('s2u5-18', 'previous', '/ˈpriːviəs/', 'adj.', '先前的；以往的', 'He met her on the previous day.', '认知与学术', '他前一天见过她。'),
          w('s2u5-19', 'unemployed', '/ˌʌnɪmˈplɔɪd/', 'adj.', '失业的', 'He was unemployed last year.', '社会与环境', '他去年失业了。'),
          w('s2u5-20', 'band', '/bænd/', 'n.', '乐队；带子', 'The band played well.', '社会与环境', '乐队演奏得很好。'),
          w('s2u5-21', 'music', '/ˈmjuːzɪk/', 'n.', '音乐', 'I love music.', '社会与环境', '我热爱音乐。'),
          w('s2u5-22', 'song', '/sɒŋ/', 'n.', '歌曲', 'This song is beautiful.', '社会与环境', '这首歌很美。'),
          w('s2u5-23', 'play', '/pleɪ/', 'v.', '演奏；玩', 'He plays the piano.', '行为与动作', '他弹钢琴。'),
          w('s2u5-24', 'sing', '/sɪŋ/', 'v.', '唱歌', 'She sings well.', '行为与动作', '她唱歌好听。'),
          w('s2u5-25', 'feel', '/fiːl/', 'v.', '感觉', 'Music makes me feel happy.', '情感与性格', '音乐让我快乐。'),
        ],
      },
    ],
  },
  {
    id: 'senior-hk3',
    name: '人教版高中英语必修第三册（2019）',
    stage: '高中英语',
    wordCount: 215,
    builtin: true,
    desc: '人教社2019高中课标教材',
    units: [
      {
        id: 'senior-hk3-u1',
        title: 'Unit 1 · Festivals and Celebrations',
        words: [
          w('s3u1-1', 'lantern', '/ˈlæntən/', 'n.', '灯笼；提灯', 'The lantern is red.', '社会与环境', '灯笼是红色的。', { phrases: [['lantern festival', '元宵节'], ['paper lantern', '纸灯笼']],  extraExamples: [['The children carried red lanterns in the parade.', '孩子们游行时举着红灯笼。'], ['She hung a lantern on the porch.', '她在门廊挂了一盏提灯。']] }),
          w('s3u1-2', 'carnival', '/ˈkɑːnɪvl/', 'n.', '狂欢节；嘉年华', 'Carnival is colourful.', '社会与环境', '嘉年华色彩缤纷。', { phrases: [['Carnival season', '狂欢节季'], ['Rio Carnival', '里约狂欢节']],  extraExamples: [['Rio hosts the biggest carnival in Brazil.', '里约举办巴西最大的狂欢节。'], ['The carnival attracts thousands of tourists.', '嘉年华吸引成千上万游客。']] }),
          w('s3u1-3', 'costume', '/ˈkɒstjuːm/', 'n.', '（某地或某历史时期的）服装；戏装', 'She wore a costume.', '社会与环境', '她穿了戏装。', { phrases: [['in costume', '穿着戏装'], ['national costume', '民族服装']],  extraExamples: [['Everyone came to the party in costume.', '大家都穿着戏装来参加派对。'], ['The actors wore period costumes.', '演员们穿着古装。']] }),
          w('s3u1-4', 'riddle', '/ˈrɪdl/', 'n.', '谜语；神秘事件', 'He solved the riddle.', '认知与学术', '他解开了谜语。', { phrases: [['solve a riddle', '解谜'], ['ask a riddle', '出谜语']],  extraExamples: [['Could you solve the riddle?', '你能猜出这个谜语吗？'], ['The ancient stone is still a riddle to scientists.', '这块古石对科学家仍是个谜。']] }),
          w('s3u1-5', 'evil', '/ˈiːvl/', 'adj.', '邪恶的；有害的 n. 邪恶；罪恶', 'Good will conquer evil.', '情感与性格', '善良终将战胜邪恶。', { phrases: [['evil spirit', '恶鬼'], ['speak evil of', '说……坏话']],  extraExamples: [['He chose to fight evil.', '他选择与邪恶作斗争。'], ['Drinking too much alcohol is evil for the heart.', '酗酒对心脏有害。']] }),
          w('s3u1-6', 'march', '/mɑːtʃ/', 'vi.&n.', '行进；前进；示威游行', 'They marched in the street.', '行为与动作', '他们在街上游行。', { phrases: [['march on', '继续前进'], ['march past', '游行通过（阅兵）']],  extraExamples: [['The soldiers marched for three hours.', '士兵们行进了三个小时。'], ['Hundreds marched to protest the law.', '数百人游行抗议这项法律。']] }),
          w('s3u1-7', 'congratulation', '/kənˌɡrætʃuˈleɪʃn/', 'n.', '祝贺；恭喜', 'Congratulations on your success!', '情感与性格', '祝贺你成功！', { phrases: [['congratulations on (doing) sth.', '祝贺（做）某事'], ['offer congratulations', '表示祝贺']],  extraExamples: [['Congratulations on passing the exam!', '恭喜你通过考试！'], ['We sent our congratulations by email.', '我们用邮件道了贺。']] }),
          w('s3u1-8', 'congratulate', '/kənˈɡrætʃuleɪt/', 'vt.', '向（某人）道贺；（因某事）为自己感到自豪', 'I congratulate you on your promotion.', '行为与动作', '我祝贺你升职。', { phrases: [['congratulate sb. on (doing) sth.', '为某事祝贺某人'], ['congratulate oneself on', '为自己感到庆幸']],  extraExamples: [['I congratulated her on winning the prize.', '我祝贺她获奖。'], ['He congratulated himself on the good decision.', '他为自己做对的决定感到庆幸。']] }),
          w('s3u1-9', 'ceremony', '/ˈserəməni/', 'n.', '典礼；仪式', 'The opening ceremony was great.', '社会与环境', '开幕式很盛大。', { phrases: [['opening/closing ceremony', '开幕/闭幕式'], ['wedding ceremony', '婚礼']],  extraExamples: [['The opening ceremony began at eight.', '开幕式八点开始。'], ['A graduation ceremony is held each June.', '每年六月举行毕业典礼。']] }),
          w('s3u1-10', 'range', '/reɪndʒ/', 'n.', '一系列；范围 v. 包括；（在一定范围内）变化', 'The range is wide.', '认知与学术', '范围很广。', { phrases: [['a wide range of', '广泛的一系列'], ['range from...to...', '从……到……不等']],  extraExamples: [['The shop sells a wide range of books.', '这家店卖各种书籍。'], ['Prices range from ten to fifty dollars.', '价格从十到五十美元不等。']] }),
          w('s3u1-11', 'origin', '/ˈɒrɪdʒɪn/', 'n.', '起源；起因', 'The origin is unknown.', '认知与学术', '起源不明。', { phrases: [['the origin of...', '……的起源'], ['country of origin', '原产国']],  extraExamples: [['What is the origin of the word?', '这个词的起源是什么？'], ['The origin of life is a mystery.', '生命起源是个谜。']] }),
          w('s3u1-12', 'figure', '/ˈfɪɡə(r)/', 'n.', '人物；数字；身材', 'A famous figure came.', '社会与环境', '一位名人来了。', { phrases: [['a key figure', '关键人物'], ['figure out', '弄明白；算出']],  extraExamples: [['He is a leading figure in the industry.', '他是业内领军人物。'], ['I can\'t figure out this math problem.', '我算不出这道数学题。']] }),
          w('s3u1-13', 'beauty', '/ˈbjuːti/', 'n.', '美丽；美人', 'She was a great beauty.', '品质与状态', '她是个大美人。', { phrases: [['natural beauty', '自然之美'], ['the beauty of...', '……的妙处']],  extraExamples: [['The beauty of the lake attracts visitors.', '湖的美景吸引游客。'], ['She was known as a local beauty.', '她是当地有名的美人。']] }),
          w('s3u1-14', 'harvest', '/ˈhɑːvɪst/', 'n.', '收割；收获季节；收成 v. 收割', 'The harvest is good this year.', '社会与环境', '今年收成好。', { phrases: [['good harvest', '丰收'], ['harvest time', '收获时节']],  extraExamples: [['Farmers gathered for the autumn harvest.', '农民们聚在一起秋收。'], ['They harvest grapes in September.', '他们九月采摘葡萄。']] }),
          w('s3u1-15', 'celebration', '/ˌselɪˈbreɪʃn/', 'n.', '庆典；庆祝会；庆祝', 'They held a celebration.', '社会与环境', '他们举办了庆典。', { phrases: [['hold a celebration', '举办庆典'], ['in celebration of', '为庆祝……']],  extraExamples: [['A big celebration was held for the team.', '为这支队伍举办了盛大庆祝。'], ['The parade was a celebration of freedom.', '游行是对自由的庆祝。']] }),
          w('s3u1-16', 'agriculture', '/ˈæɡrɪkʌltʃə(r)/', 'n.', '农业；农艺', 'Agriculture is important.', '社会与环境', '农业很重要。', { phrases: [['modern agriculture', '现代农业'], ['agricultural products', '农产品']],  extraExamples: [['Agriculture feeds the whole country.', '农业养活全国。'], ['Technology has changed agriculture greatly.', '科技极大改变了农业。']] }),
          w('s3u1-17', 'crop', '/krɒp/', 'n.', '庄稼；作物；收成', 'The crops grow well.', '社会与环境', '庄稼长得好。', { phrases: [['farm crops', '农作物'], ['crop failure', '歉收']],  extraExamples: [['The farmers were worried about the crop.', '农民担心收成。'], ['Rice is the main crop here.', '水稻是这里的主要作物。']] }),
          w('s3u1-18', 'gather', '/ˈɡæðə(r)/', 'v.', '聚集；集合；收集', 'Family gathered for dinner.', '行为与动作', '家人聚在一起吃饭。', { phrases: [['gather together', '聚在一起'], ['gather information', '收集信息']],  extraExamples: [['A crowd gathered around the singer.', '人群围在歌手周围。'], ['We gathered leaves for compost.', '我们收集树叶做堆肥。']] }),
          w('s3u1-19', 'grateful', '/ˈɡreɪtfl/', 'adj.', '感激的；表示感谢的', 'I am grateful for your help.', '情感与性格', '我感激你的帮助。', { phrases: [['be grateful to sb. for sth.', '为某事感激某人'], ['a grateful letter', '感谢信']],  extraExamples: [['I am grateful to you for your support.', '我感激你的支持。'], ['She gave a grateful smile.', '她感激地笑了笑。']] }),
          w('s3u1-20', 'feature', '/ˈfiːtʃə(r)/', 'n.', '特色；特征 v. 以……为特色', 'The car has many new features.', '品质与状态', '这车有很多新特色。', { phrases: [['a key feature', '主要特征'], ['feature film', '故事片；正片']],  senses: [{ pos: 'n.', zh: '特色；特征；面貌' }, { pos: 'v.', zh: '以……为特色；由……主演' }], forms: [{ label: '复数', value: 'features' }, { label: '过去式', value: 'featured' }, { label: '派生词', value: 'featureless adj. 无特色的' }], extraExamples: [['The phone\'s main feature is its camera.', '这部手机的主要特色是摄像头。'], ['The exhibition features local artists.', '展览以本地艺术家为特色。']] }),
          w('s3u1-21', 'decorate', '/ˈdekəreɪt/', 'v.', '装饰；装潢', 'They decorated the room.', '行为与动作', '他们装饰了房间。', { phrases: [['decorate...with...', '用……装饰……'], ['decorate a Christmas tree', '装饰圣诞树']],  senses: [{ pos: 'v.', zh: '装饰；装潢；布置' }, { pos: 'v.', zh: '授给（某人）勋章' }], forms: [{ label: '过去式', value: 'decorated' }, { label: '派生词', value: 'decoration n. 装饰；装饰品' }, { label: '派生词', value: 'decorative adj. 装饰性的' }], extraExamples: [['We decorated the hall with balloons.', '我们用气球装饰大厅。'], ['The house was decorated for the festival.', '房子为节日布置一新。']] }),
          w('s3u1-22', 'church', '/tʃɜːtʃ/', 'n.', '教堂；礼拜堂', 'They go to church on Sunday.', '社会与环境', '他们星期天去教堂。', { phrases: [['go to church', '做礼拜'], ['church service', '礼拜仪式']],  extraExamples: [['The old church stands on the hill.', '老教堂坐落在山上。'], ['They married in the village church.', '他们在村里教堂结婚。']] }),
          w('s3u1-23', 'significant', '/sɪɡˈnɪfɪkənt/', 'adj.', '重要的；显著的', 'This is a significant discovery.', '认知与学术', '这是个重要发现。', { phrases: [['a significant difference', '显著差异'], ['significant progress', '重大进展']],  extraExamples: [['There was a significant rise in sales.', '销售额显著上升。'], ['This is a significant moment in history.', '这是历史上的重要时刻。']] }),
          w('s3u1-24', 'typical', '/ˈtɪpɪkl/', 'adj.', '典型的；有代表性的', 'This is a typical English breakfast.', '认知与学术', '这是典型的英式早餐。', { phrases: [['be typical of', '是……的典型'], ['a typical day', '平常的一天']],  extraExamples: [['This cold day is typical of winter here.', '这种冷天是这里冬天的典型。'], ['It was just a typical Monday.', '那只是普通的星期一。']] }),
          w('s3u1-25', 'commercial', '/kəˈmɜːʃl/', 'adj.', '商业的；贸易的 n. 商业广告', 'The movie was a commercial success.', '社会与环境', '这部电影商业上很成功。', { phrases: [['commercial success', '商业成功'], ['a TV commercial', '电视广告']],  extraExamples: [['The film was a commercial hit.', '这部电影票房大卖。'], ['A commercial interrupted the programme.', '一条广告打断了节目。']] }),
          w('s3u1-26', 'medium', '/ˈmiːdiəm/', 'n.', '媒介；手段 adj. 中等的', 'TV is a popular medium.', '社会与环境', '电视是流行媒介。', { phrases: [['by means of the medium', '通过媒介'], ['medium size', '中等尺寸']],  extraExamples: [['The Internet is a new medium.', '互联网是新媒介。'], ['Choose the medium size.', '选中号。']] }),
          w('s3u1-27', 'media', '/ˈmiːdiə/', 'n.', '大众传播媒介；新闻媒体', 'The media reported the event.', '社会与环境', '媒体报道了此事。', { phrases: [['mass media', '大众传媒'], ['social media', '社交媒体']],  extraExamples: [['The media has a huge influence.', '媒体影响巨大。'], ['She works in the media industry.', '她在传媒行业工作。']] }),
          w('s3u1-28', 'reflect', '/rɪˈflekt/', 'v.', '显示；反映；反射', 'The lake reflects the sky.', '行为与动作', '湖面倒映着天空。', { phrases: [['reflect on', '反思；思考'], ['reflect light/heat', '反射光/热']],  senses: [{ pos: 'v.', zh: '反射（光/热/影像）' }, { pos: 'v.', zh: '反映；显示；深思（on）' }], forms: [{ label: '过去式', value: 'reflected' }, { label: '派生词', value: 'reflection n. 反射；反思' }, { label: '派生词', value: 'reflective adj. 沉思的' }], extraExamples: [['The mirror reflects your face.', '镜子照出你的脸。'], ['The data reflects a clear trend.', '数据反映出清晰趋势。']] }),
          w('s3u1-29', 'belief', '/bɪˈliːf/', 'n.', '信仰；信任；信念', 'She has a strong belief in God.', '情感与性格', '她有坚定的宗教信仰。', { phrases: [['beyond belief', '难以置信'], ['a firm belief', '坚定信念']],  extraExamples: [['He held a deep belief in justice.', '他坚信正义。'], ['Her belief in herself never failed.', '她的自信从未动摇。']] }),
          w('s3u1-30', 'faith', '/feɪθ/', 'n.', '信任；信仰；信心', 'I have faith in you.', '情感与性格', '我对你有信心。', { phrases: [['have faith in', '信任……'], ['lose faith', '失去信心']],  extraExamples: [['I have faith in your ability.', '我相信你的能力。'], ['Religious faith brought comfort.', '宗教信仰带来慰藉。']] }),
          w('s3u1-31', 'occasion', '/əˈkeɪʒn/', 'n.', '特别的事情；（适当的）机会；场合', 'It is a special occasion.', '社会与环境', '这是个特殊场合。', { phrases: [['on this occasion', '这次'], ['on occasion(s)', '偶尔']],  extraExamples: [['We dress up for special occasions.', '特殊场合我们盛装。'], ['On occasion, he works late.', '他偶尔加班。']] }),
          w('s3u1-32', 'atmosphere', '/ˈætməsfɪə(r)/', 'n.', '气氛；大气；大气层', 'The atmosphere was warm.', '品质与状态', '气氛很温馨。', { phrases: [['a friendly atmosphere', '友好气氛'], ['the Earth\'s atmosphere', '地球大气层']],  extraExamples: [['The party had a relaxed atmosphere.', '派对气氛轻松。'], ['The atmosphere protects us from the sun.', '大气层保护我们免受日晒。']] }),
          w('s3u1-33', 'lunar', '/ˈluːnə(r)/', 'adj.', '月球的；农历的', 'The lunar calendar is traditional.', '认知与学术', '农历是传统历法。', { phrases: [['lunar calendar', '农历'], ['lunar New Year', '农历新年']],  extraExamples: [['The festival falls on the lunar New Year.', '节日在农历新年。'], ['A lunar eclipse happens rarely.', '月食很少发生。']] }),
          w('s3u1-34', 'envelope', '/ˈenvələʊp/', 'n.', '信封；塑料封套', 'He opened the envelope.', '社会与环境', '他打开了信封。', { phrases: [['open an envelope', '拆开信封'], ['push the envelope', '挑战极限']],  extraExamples: [['She put the letter in an envelope.', '她把信装进信封。'], ['Seal the envelope before sending.', '寄出前封好信封。']] }),
          w('s3u1-35', 'merry', '/ˈmeri/', 'adj.', '愉快的；高兴的', 'Merry Christmas!', '情感与性格', '圣诞快乐！', { phrases: [['Merry Christmas', '圣诞快乐'], ['a merry laugh', '欢快的笑']],  extraExamples: [['We wished each other a merry Christmas.', '我们互祝圣诞快乐。'], ['The children were merry after the party.', '派对后孩子们兴高采烈。']] }),
          w('s3u1-36', 'pudding', '/ˈpʊdɪŋ/', 'n.', '布丁；（餐末的）甜食', 'I like Christmas pudding.', '社会与环境', '我喜欢圣诞布丁。', { phrases: [['Christmas pudding', '圣诞布丁'], ['have pudding', '吃甜点']],  extraExamples: [['What\'s for pudding?', '餐后吃什么甜食？'], ['She made a chocolate pudding.', '她做了巧克力布丁。']] }),
          w('s3u1-37', 'roast', '/rəʊst/', 'adj.', '烤的；焙的 v. 烤；烘焙', 'We had roast beef for dinner.', '社会与环境', '我们晚餐吃了烤牛肉。', { phrases: [['roast beef', '烤牛肉'], ['roast a chicken', '烤鸡']],  extraExamples: [['We roasted marshmallows over the fire.', '我们在火上烤棉花糖。'], ['The roast chicken smelled delicious.', '烤鸡闻起来很香。']] }),
          w('s3u1-38', 'turkey', '/ˈtɜːki/', 'n.', '火鸡；火鸡肉', 'We eat turkey on Thanksgiving.', '社会与环境', '我们感恩节吃火鸡。', { phrases: [['Thanksgiving turkey', '感恩节火鸡'], ['cold turkey', '突然戒除（俚语）']],  extraExamples: [['The turkey was stuffed with bread.', '火鸡肚子里塞了面包。'], ['She ordered roast turkey.', '她点了烤火鸡。']] }),
          w('s3u1-39', 'frank', '/fræŋk/', 'adj.', '坦率的；直言不讳的', 'To be frank, I disagree.', '情感与性格', '坦率说，我不同意。', { phrases: [['to be frank', '坦率地说'], ['a frank reply', '坦率的回答']],  extraExamples: [['To be frank, the plan won\'t work.', '说实话，这计划行不通。'], ['He gave a frank answer.', '他给出了坦诚的回答。']] }),
          w('s3u1-40', 'inner', '/ˈɪnə(r)/', 'adj.', '内部的；里面的；内心的', 'She has inner strength.', '品质与状态', '她有内在的力量。', { phrases: [['inner strength', '内在力量'], ['inner city', '市中心老城区']],  extraExamples: [['Her inner voice told her to stop.', '她内心的声音让她停下。'], ['The inner door was locked.', '里门锁着。']] }),
          w('s3u1-41', 'autonomous', '/ɔːˈtɒnəməs/', 'adj.', '自治的；有自治权的', 'The region is autonomous.', '社会与环境', '这个地区是自治的。', { phrases: [['autonomous region', '自治区'], ['autonomous decision', '自主决定']],  extraExamples: [['Xinjiang is an autonomous region.', '新疆是自治区。'], ['Students should be autonomous learners.', '学生应做自主学习者。']] }),
          w('s3u1-42', 'region', '/ˈriːdʒən/', 'n.', '地区；区域；地带', 'This region is famous for wine.', '社会与环境', '这个地区以葡萄酒闻名。', { phrases: [['in the region of', '大约'], ['a mountainous region', '山区']],  extraExamples: [['The region has a mild climate.', '这个地区气候温和。'], ['It costs in the region of 100 yuan.', '大约花一百元。']] }),
          w('s3u1-43', 'represent', '/ˌreprɪˈzent/', 'vt.', '象征；代表；相当于', 'The dove represents peace.', '行为与动作', '鸽子象征和平。', { phrases: [['represent...as...', '把……描绘成……'], ['represent one\'s country', '代表国家']],  extraExamples: [['Red represents danger.', '红色象征危险。'], ['She represents our school in the match.', '她代表学校参赛。']] }),
          w('s3u1-44', 'wrestle', '/ˈresl/', 'vi.&vt.', '摔跤；奋力对付', 'He wrestled with the problem.', '行为与动作', '他努力解决问题。', { phrases: [['wrestle with', '努力对付；摔跤'], ['wrestle a bear', '与熊搏斗']],  extraExamples: [['They wrestled on the mat.', '他们在垫子上摔跤。'], ['She wrestled with the essay all night.', '她苦熬一夜写文章。']] }),
          w('s3u1-45', 'fancy', '/ˈfænsi/', 'adj.', '花哨的；精致的 n. 爱好 v. 想要', 'That\'s a fancy car!', '品质与状态', '那辆车真花哨！', { phrases: [['fancy doing sth.', '想要做某事'], ['take a fancy to', '喜欢上']],  extraExamples: [['He wore a fancy suit.', '他穿了身讲究的西装。'], ['Fancy a cup of tea?', '想喝杯茶吗？']] }),
        ],
      },
      {
        id: 'senior-hk3-u2',
        title: 'Unit 2 · Morals and Virtues',
        words: [
          w('s3u2-1', 'moral', '/ˈmɒrəl/', 'adj.', '道德的 n. 品行；道德', 'He has high moral values.', '情感与性格', '他道德高尚。', { phrases: [['moral values', '道德观念'], ['moral support', '精神支持']],  extraExamples: [['It is a moral question.', '这是个道德问题。'], ['No one judges another\'s morals here.', '这里没人评判他人品行。']] }),
          w('s3u2-2', 'virtue', '/ˈvɜːtʃuː/', 'n.', '美德；优秀品质', 'Patience is a virtue.', '情感与性格', '耐心是美德。', { phrases: [['by virtue of', '凭借；由于'], ['virtue and vice', '美德与恶行']],  extraExamples: [['Honesty is a great virtue.', '诚实是一大美德。'], ['He got the job by virtue of experience.', '他凭经验得到这份工作。']] }),
          w('s3u2-3', 'dilemma', '/dɪˈlemə/', 'n.', '困境；进退两难', 'She faced a dilemma.', '认知与学术', '她面临困境。', { phrases: [['face a dilemma', '面临两难'], ['in a dilemma', '进退两难']],  extraExamples: [['She was caught in a dilemma.', '她陷入两难。'], ['The dilemma troubled him all night.', '这个难题困扰了他一整夜。']] }),
          w('s3u2-4', 'faint', '/feɪnt/', 'vi.', '昏倒 adj. 微弱的；隐约的', 'He fainted from hunger.', '行为与动作', '他饿昏了。', { phrases: [['faint from', '因……昏倒'], ['a faint voice', '微弱的声音']],  senses: [{ pos: 'vi.', zh: '晕倒；昏厥' }, { pos: 'adj.', zh: '微弱的；隐约的；虚弱的' }], forms: [{ label: '过去式', value: 'fainted' }, { label: '现在分词', value: 'fainting' }, { label: '派生词', value: 'faintly adv. 微弱地' }], extraExamples: [['She fainted at the sight of blood.', '她一见血就晕了。'], ['I caught a faint smell of coffee.', '我闻到一丝咖啡味。']] }),
          w('s3u2-5', 'precious', '/ˈpreʃəs/', 'adj.', '珍贵的；宝贵的', 'Time is precious.', '品质与状态', '时间宝贵。', { phrases: [['precious time', '宝贵时间'], ['precious stones', '宝石']],  extraExamples: [['Family time is precious.', '和家人相处的时间很宝贵。'], ['The ring has a precious stone.', '戒指上有颗宝石。']] }),
          w('s3u2-6', 'illustrate', '/ˈɪləstreɪt/', 'vt.', '说明；阐明；给……加插图', 'The example illustrates the point.', '行为与动作', '例子说明观点。', { phrases: [['illustrate a point', '阐明观点'], ['illustrated book', '插图本']],  extraExamples: [['The chart illustrates the trend.', '图表说明了这一趋势。'], ['The book is well illustrated.', '这本书插图丰富。']] }),
          w('s3u2-7', 'complain', '/kəmˈpleɪn/', 'v.', '抱怨；投诉', 'Don\u2019t complain too much.', '行为与动作', '别抱怨太多。', { phrases: [['complain about/of', '抱怨……'], ['complain to sb.', '向某人投诉']],  extraExamples: [['He complained about the food.', '他抱怨饭菜不好。'], ['She complained to the manager.', '她向经理投诉。']] }),
          w('s3u2-8', 'enroll', '/ɪnˈrəʊl/', 'v.', '注册；入学；招收', 'He enrolled in the course.', '行为与动作', '他注册了课程。', { phrases: [['enroll in', '注册/报名参加'], ['enroll students', '招收学生']],  extraExamples: [['She enrolled in evening classes.', '她报了夜校。'], ['The school enrolls 500 pupils.', '这所学校招收500名学生。']] }),
          w('s3u2-9', 'quit', '/kwɪt/', 'v.', '放弃；退出；辞职', 'He quit his job.', '行为与动作', '他辞了职。', { phrases: [['quit smoking', '戒烟'], ['quit school', '退学']],  extraExamples: [['She quit the team after the argument.', '争吵后她退出了队伍。'], ['I decided to quit for good.', '我决定彻底放弃。']] }),
          w('s3u2-10', 'rescue', '/ˈreskjuː/', 'v./n.', '营救；救援', 'They rescued the child.', '行为与动作', '他们救了孩子。', { phrases: [['rescue sb. from', '把某人从……救出'], ['rescue team', '救援队']],  extraExamples: [['Firefighters rescued the trapped cat.', '消防员救出被困的猫。'], ['The rescue took three hours.', '营救花了三小时。']] }),
          w('s3u2-11', 'sacrifice', '/ˈsækrɪfaɪs/', 'n./v.', '牺牲；奉献', 'He made a great sacrifice.', '情感与性格', '他做出巨大牺牲。', { phrases: [['make a sacrifice', '做出牺牲'], ['sacrifice...for...', '为……牺牲……']],  extraExamples: [['Parents sacrifice a lot for children.', '父母为孩子牺牲很多。'], ['She sacrificed her career for family.', '她为家庭牺牲了事业。']] }),
          w('s3u2-12', 'career', '/kəˈrɪə(r)/', 'n.', '职业；生涯', 'She has a good career.', '社会与环境', '她事业很好。', { phrases: [['career plan', '职业规划'], ['a career in...', '……方面的职业']],  extraExamples: [['He chose a career in medicine.', '他选择从医。'], ['Her career lasted thirty years.', '她的职业生涯持续了三十年。']] }),
          w('s3u2-13', 'charge', '/tʃɑːdʒ/', 'v.', '收费；指控；充电 n. 负责', 'He is in charge here.', '社会与环境', '他在这里负责。', { phrases: [['in charge of', '负责'], ['free of charge', '免费']],  senses: [{ pos: 'v.', zh: '（使）充电；收费；指控（犯罪）' }, { pos: 'n.', zh: '负责；掌管；控告；电荷' }], forms: [{ label: '过去式', value: 'charged' }, { label: '现在分词', value: 'charging' }, { label: '复数', value: 'charges' }], extraExamples: [['How much do you charge?', '你们收多少钱？'], ['The battery needs charging.', '电池要充电了。']] }),
          w('s3u2-14', 'principle', '/ˈprɪnsəpl/', 'n.', '原则；原理；准则', 'He sticks to his principles.', '认知与学术', '他坚持原则。', { phrases: [['stick to one\'s principles', '坚持原则'], ['in principle', '原则上']],  extraExamples: [['He refused on principle.', '他出于原则拒绝了。'], ['The machine works on the same principle.', '这台机器原理相同。']] }),
          w('s3u2-15', 'pity', '/ˈpɪti/', 'n.', '遗憾；同情', 'It is a pity.', '情感与性格', '真遗憾。', { phrases: [['It\'s a pity that...', '真遗憾……'], ['feel pity for', '同情……']],  extraExamples: [['It\'s a pity you can\'t come.', '你不能来真遗憾。'], ['She felt pity for the beggar.', '她同情乞丐。']] }),
          w('s3u2-16', 'marriage', '/ˈmærɪdʒ/', 'n.', '结婚；婚姻', 'Their marriage is happy.', '社会与环境', '他们婚姻幸福。', { phrases: [['a happy marriage', '美满婚姻'], ['marriage certificate', '结婚证']],  extraExamples: [['Their marriage lasted forty years.', '他们的婚姻持续了四十年。'], ['The couple celebrated their marriage.', '这对夫妇庆祝结婚。']] }),
          w('s3u2-17', 'reject', '/rɪˈdʒekt/', 'vt.', '拒绝；摒弃', 'She rejected the offer.', '行为与动作', '她拒绝了提议。', { phrases: [['reject an offer', '拒绝提议'], ['reject a proposal', '否决提案']],  extraExamples: [['The plan was rejected.', '计划被否决了。'], ['He felt rejected by his friends.', '他觉得被朋友排斥了。']] }),
          w('s3u2-18', 'appoint', '/əˈpɔɪnt/', 'vt.', '任命；约定', 'They appointed him manager.', '行为与动作', '他们任命他为经理。', { phrases: [['appoint sb. as/to be', '任命某人为'], ['appoint a time', '约定时间']],  senses: [{ pos: 'vt.', zh: '任命；委派' }, { pos: 'vt.', zh: '约定；指定（时间/地点）' }], forms: [{ label: '过去式', value: 'appointed' }, { label: '派生词', value: 'appointment n. 约会；任命' }], extraExamples: [['She was appointed director.', '她被任命为主任。'], ['We appointed a meeting for Friday.', '我们约周五开会。']] }),
          w('s3u2-19', 'eager', '/ˈiːɡə(r)/', 'adj.', '渴望的；热切的', 'He is eager to learn.', '情感与性格', '他渴望学习。', { phrases: [['be eager to do', '渴望做……'], ['be eager for', '渴望……']],  extraExamples: [['The kids are eager for the holiday.', '孩子们盼着放假。'], ['She is eager to please.', '她急于讨人喜欢。']] }),
          w('s3u2-20', 'gentle', '/ˈdʒentl/', 'adj.', '温柔的；温和的', 'She has a gentle voice.', '情感与性格', '她声音温柔。', { phrases: [['gentle wind', '微风'], ['be gentle with', '对……温柔']],  extraExamples: [['Be gentle with the baby.', '对宝宝温柔点。'], ['A gentle rain fell all night.', '下了一整夜细雨。']] }),
          w('s3u2-21', 'weary', '/ˈwɪəri/', 'adj.', '疲倦的；厌烦的', 'He looked weary.', '品质与状态', '他看起来很疲倦。', { phrases: [['weary of', '厌倦……'], ['grow weary', '变得疲倦']],  extraExamples: [['She was weary of the same routine.', '她厌倦了一成不变。'], ['The weary driver stopped to rest.', '疲惫的司机停车休息。']] }),
          w('s3u2-22', 'whisper', '/ˈwɪspə(r)/', 'v./n.', '低语；耳语', 'She whispered in my ear.', '行为与动作', '她在我耳边低语。', { phrases: [['whisper to sb.', '对某人耳语'], ['in a whisper', '低声地']],  extraExamples: [['He whispered the secret to me.', '他悄悄把秘密告诉我。'], ['The baby was asleep, so we spoke in whispers.', '宝宝睡了，我们低声说话。']] }),
          w('s3u2-23', 'meanwhile', '/ˈmiːnwaɪl/', 'adv.', '与此同时；在此期间', 'Meanwhile, I will prepare dinner.', '认知与学术', '与此同时，我来准备晚餐。', { phrases: [['meanwhile, ...', '与此同时……'], ['in the meanwhile', '在此期间']],  extraExamples: [['I\'ll cook; meanwhile, you clean.', '我做饭，你同时打扫。'], ['Meanwhile, the storm grew worse.', '与此同时，暴风雨更猛了。']] }),
          w('s3u2-24', 'tend', '/tend/', 'v.', '倾向；往往会；照顾', 'People tend to get fat as they age.', '行为与动作', '人随着年龄增长容易发胖。', { phrases: [['tend to do', '往往会做'], ['tend to', '照顾；照料']],  extraExamples: [['He tends to be late.', '他常常迟到。'], ['She tends to the sick.', '她照料病人。']] }),
          w('s3u2-25', 'sudden', '/ˈsʌdn/', 'adj.', '突然的；忽然的', 'There was a sudden change.', '品质与状态', '突然发生了变化。', { phrases: [['all of a sudden', '突然'], ['a sudden death', '猝死']],  extraExamples: [['All of a sudden, the lights went out.', '灯突然灭了。'], ['A sudden noise woke him.', '一声异响把他吵醒。']] }),
          w('s3u2-26', 'wise', '/waɪz/', 'adj.', '明智的；聪明的', 'That was a wise decision.', '认知与学术', '那是个明智的决定。', { phrases: [['a wise choice', '明智的选择'], ['be wise to', '识破……']],  extraExamples: [['It was wise to save money.', '存钱是明智的。'], ['A wise man learns from failure.', '智者从失败中学习。']] }),
          w('s3u2-27', 'scholar', '/ˈskɒlə(r)/', 'n.', '学者；奖学金获得者', 'He is a famous scholar.', '社会与环境', '他是位著名学者。', { phrases: [['a distinguished scholar', '杰出学者'], ['scholar\'s seat', '学者席位']],  extraExamples: [['The scholar wrote many books.', '这位学者著述颇丰。'], ['She won a scholarship to Oxford.', '她拿到牛津奖学金。']] }),
          w('s3u2-28', 'agency', '/ˈeɪdʒənsi/', 'n.', '代理处；机构；力量', 'He works at a travel agency.', '社会与环境', '他在旅行社工作。', { phrases: [['travel agency', '旅行社'], ['news agency', '通讯社']],  extraExamples: [['We booked through an agency.', '我们通过中介订的。'], ['The agency helped find her a job.', '机构帮她找了工作。']] }),
          w('s3u2-29', 'committee', '/kəˈmɪti/', 'n.', '委员会', 'The committee meets weekly.', '社会与环境', '委员会每周开会。', { phrases: [['stand on a committee', '任委员'], ['committee member', '委员']],  extraExamples: [['The committee voted to approve.', '委员会投票通过。'], ['She chairs the finance committee.', '她主持财务委员会。']] }),
          w('s3u2-30', 'staff', '/stɑːf/', 'n.', '员工；全体职员', 'The staff are very friendly.', '社会与环境', '员工都很友好。', { phrases: [['staff member', '职员'], ['be on the staff', '是员工之一']],  extraExamples: [['The hotel staff were helpful.', '酒店员工很热心。'], ['We need more nursing staff.', '我们需要更多护理人员。']] }),
          w('s3u2-31', 'dental', '/ˈdentl/', 'adj.', '牙齿的；牙科的', 'She made a dental appointment.', '社会与环境', '她预约了牙医。', { phrases: [['dental care', '牙齿护理'], ['dental clinic', '牙科诊所']],  extraExamples: [['Regular dental check-ups matter.', '定期看牙很重要。'], ['She has dental problems.', '她有牙齿问题。']] }),
          w('s3u2-32', 'clinician', '/klɪˈnɪʃn/', 'n.', '临床医生', 'The clinician examined the patient.', '社会与环境', '临床医生检查了病人。', { phrases: [['senior clinician', '高级临床医生'], ['clinician-led', '临床医生主导的']],  extraExamples: [['The clinician gave clear advice.', '医生给出明确建议。'], ['Clinicians record each visit.', '临床医生记录每次问诊。']] }),
          w('s3u2-33', 'tireless', '/ˈtaɪələs/', 'adj.', '不知疲倦的；坚持不懈的', 'She is a tireless worker.', '品质与状态', '她工作起来不知疲倦。', { phrases: [['tireless efforts', '不懈努力'], ['a tireless worker', '不知疲倦的人']],  extraExamples: [['Her tireless efforts paid off.', '她不懈的努力有了回报。'], ['He was a tireless campaigner.', '他是位坚持不懈的活动家。']] }),
          w('s3u2-34', 'drug', '/drʌɡ/', 'n.', '药物；毒品', 'The drug is effective.', '社会与环境', '这种药很有效。', { phrases: [['drug addiction', '毒瘾'], ['take drugs', '吸毒/服药']],  extraExamples: [['The drug reduces pain.', '这种药镇痛。'], ['Drug abuse harms health.', '滥用毒品损害健康。']] }),
          w('s3u2-35', 'leak', '/liːk/', 'v./n.', '漏；渗漏；泄露', 'The roof leaks.', '行为与动作', '屋顶漏了。', { phrases: [['leak out', '泄露出来'], ['gas leak', '煤气泄漏']],  extraExamples: [['The news leaked to the press.', '消息泄露给媒体。'], ['Check for leaks in the pipe.', '检查管子是否漏。']] }),
          w('s3u2-36', 'substantial', '/səbˈstænʃl/', 'adj.', '大量的；可观的；重大的', 'There is a substantial difference.', '认知与学术', '存在重大差异。', { phrases: [['a substantial amount', '大量'], ['substantial evidence', '充分证据']],  extraExamples: [['They made substantial progress.', '他们取得长足进步。'], ['The house underwent substantial repair.', '房子大修了一番。']] }),
          w('s3u2-37', 'foundation', '/faʊnˈdeɪʃn/', 'n.', '基础；地基；基金会', 'He laid a solid foundation.', '认知与学术', '他打下了坚实的基础。', { phrases: [['lay the foundation', '打基础'], ['foundation course', '基础课程']],  extraExamples: [['Reading builds a foundation for learning.', '阅读为学习打基础。'], ['The foundation supports research.', '基金会资助研究。']] }),
          w('s3u2-38', 'insist', '/ɪnˈsɪst/', 'v.', '坚持；坚决要求', 'He insisted on paying.', '行为与动作', '他坚持要付款。', { phrases: [['insist on (doing) sth.', '坚持（做）某事'], ['insist that...', '坚决主张……']],  extraExamples: [['She insisted on seeing the manager.', '她坚持要见经理。'], ['He insisted that he was right.', '他坚持自己是对的。']] }),
          w('s3u2-39', 'major', '/ˈmeɪdʒə(r)/', 'adj.', '主要的；重大的 n. 专业', 'Smoking is a major cause of cancer.', '认知与学术', '吸烟是癌症的主要原因。', { phrases: [['a major problem', '重大问题'], ['major in', '主修……']],  senses: [{ pos: 'adj.', zh: '主要的；重大的；较大的' }, { pos: 'n.', zh: '（大学）专业；少校' }, { pos: 'v.', zh: '主修（in）' }], forms: [{ label: '比较级', value: 'more major' }, { label: '派生词', value: 'majority n. 大多数' }], extraExamples: [['She majored in biology.', '她主修生物。'], ['That was a major mistake.', '那是个大错。']] }),
          w('s3u2-40', 'retire', '/rɪˈtaɪə(r)/', 'v.', '退休；退出', 'He retired at 60.', '行为与动作', '他60岁退休了。', { phrases: [['retire from', '从……退休'], ['retire to bed', '就寝']],  senses: [{ pos: 'v.', zh: '退休；退职；退役' }, { pos: 'v.', zh: '就寝；退到（僻静处）' }], forms: [{ label: '过去式', value: 'retired' }, { label: '派生词', value: 'retirement n. 退休' }, { label: '派生词', value: 'retired adj. 退休的' }], extraExamples: [['She retired early to travel.', '她提前退休去旅行。'], ['The player retired after injury.', '这位球员受伤后退役。']] }),
        ],
      },
      {
        id: 'senior-hk3-u3',
        title: 'Unit 3 · Diverse Cultures',
        words: [
          w('s3u3-1', 'diverse', '/daɪˈvɜːs/', 'adj.', '不同的；多种多样的', 'The city has diverse cultures.', '社会与环境', '这座城市有多元文化。'),
          w('s3u3-2', 'diversity', '/daɪˈvɜːsəti/', 'n.', '多样性；多样化', 'Cultural diversity is important.', '社会与环境', '文化多样性很重要。'),
          w('s3u3-3', 'fortune', '/ˈfɔːtʃuːn/', 'n.', '财富；运气；命运', 'He made a fortune in business.', '社会与环境', '他做生意发了财。'),
          w('s3u3-4', 'fortune cookie', '/ˈfɔːtʃuːn ˈkʊki/', 'n.', '幸运饼干', 'We ate fortune cookies.', '社会与环境', '我们吃了幸运饼干。'),
          w('s3u3-5', '-cheongsam', '/ˌtʃɒŋˈsæm/', 'n.', '旗袍', 'She wore a cheongsam.', '社会与环境', '她穿了旗袍。'),
          w('s3u3-6', 'gallery', '/ˈɡæləri/', 'n.', '美术馆；画廊；走廊', 'We visited the art gallery.', '社会与环境', '我们参观了美术馆。'),
          w('s3u3-7', 'architecture', '/ˈɑːkɪtektʃə(r)/', 'n.', '建筑；建筑学', 'The architecture is amazing.', '社会与环境', '建筑令人惊叹。'),
          w('s3u3-8', 'jungle', '/ˈdʒʌŋɡl/', 'n.', '丛林；密林', 'They went into the jungle.', '社会与环境', '他们走进丛林。'),
          w('s3u3-9', 'minority', '/maɪˈnɒrəti/', 'n.', '少数；少数民族；少数派', 'China has 55 ethnic minorities.', '社会与环境', '中国有55个少数民族。'),
          w('s3u3-10', 'chinatown', '/ˈtʃaɪnətaʊn/', 'n.', '唐人街；中国城', 'We ate in Chinatown.', '社会与环境', '我们在唐人街吃饭。'),
          w('s3u3-11', 'quarter', '/ˈkwɔːtə(r)/', 'n.', '地区；街区；四分之一', 'They live in the Chinese quarter.', '社会与环境', '他们住在华人区。'),
          w('s3u3-12', 'ethnic', '/ˈeθnɪk/', 'adj.', '民族的；种族的；具有民族特色的', 'There are many ethnic groups.', '社会与环境', '这里有很多民族。'),
          w('s3u3-13', 'gentle', '/ˈdʒentl/', 'adj.', '温和的；轻柔的', 'The wind was gentle.', '品质与状态', '风很轻柔。'),
          w('s3u3-14', 'bargain', '/ˈbɑːɡən/', 'n.', '便宜货；交易 v. 讨价还价', 'This shirt is a bargain.', '社会与环境', '这件衬衫真便宜。'),
          w('s3u3-15', 'baker', '/ˈbeɪkə(r)/', 'n.', '面包师；面包店', 'The baker makes fresh bread.', '社会与环境', '面包师做新鲜面包。'),
          w('s3u3-16', 'butcher', '/ˈbʊtʃə(r)/', 'n.', '肉贩；屠夫', 'We bought meat from the butcher.', '社会与环境', '我们从肉贩那里买了肉。'),
          w('s3u3-17', 'greengrocer', '/ˈɡriːnɡrəʊsə(r)/', 'n.', '蔬菜水果商；蔬菜水果店', 'She bought fruit at the greengrocer.', '社会与环境', '她在蔬果店买了水果。'),
          w('s3u3-18', 'later', '/ˈleɪtə(r)/', 'adv.', '后来；稍后', 'Later, he became a doctor.', '认知与学术', '后来他成了医生。'),
          w('s3u3-19', 'chap', '/tʃæp/', 'n.', '小伙子；家伙', 'He is a nice chap.', '社会与环境', '他是个好小伙。'),
          w('s3u3-20', 'mark', '/mɑːk/', 'v.', '做标记；标明 n. 痕迹；分数', 'He marked the important parts.', '行为与动作', '他标出了重点。'),
          w('s3u3-21', 'historic', '/hɪˈstɒrɪk/', 'adj.', '历史上著名的；有历史意义的', 'This is a historic building.', '社会与环境', '这是一座历史建筑。'),
          w('s3u3-22', 'site', '/saɪt/', 'n.', '地点；遗址；网站', 'The site is very old.', '社会与环境', '这个遗址很古老。'),
          w('s3u3-23', 'official', '/əˈfɪʃl/', 'adj.', '官方的；正式的 n. 官员', 'An official visit was made.', '社会与环境', '进行了正式访问。'),
          w('s3u3-24', 'period', '/ˈpɪəriəd/', 'n.', '时期；阶段；句号', 'The Victorian period is famous.', '认知与学术', '维多利亚时期很有名。'),
          w('s3u3-25', 'allow', '/əˈlaʊ/', 'v.', '允许；准许', 'Smoking is not allowed.', '行为与动作', '禁止吸烟。'),
          w('s3u3-26', 'join', '/dʒɔɪn/', 'v.', '参加；加入；连接', 'He joined the army.', '行为与动作', '他参了军。'),
          w('s3u3-27', 'root', '/ruːt/', 'n.', '根；根源；根基', 'Love of family is in her roots.', '品质与状态', '爱家是她的根。'),
          w('s3u3-28', 'native', '/ˈneɪtɪv/', 'adj.', '本地的；本国的；天生的 n. 本地人', 'She is a native Beijinger.', '社会与环境', '她是北京本地人。'),
          w('s3u3-29', 'fit in', '/fɪt ɪn/', 'phr.', '适应；融入', 'He quickly fit in at school.', '行为与动作', '他很快适应了学校。'),
          w('s3u3-30', 'moreover', '/mɔːrˈəʊvə(r)/', 'adv.', '此外；而且', 'Moreover, it is too expensive.', '认知与学术', '而且这太贵了。'),
          w('s3u3-31', 'struggle', '/ˈstrʌɡl/', 'v./n.', '奋斗；努力；挣扎', 'She struggled to pass the exam.', '行为与动作', '她努力通过考试。'),
          w('s3u3-32', 'despite', '/dɪˈspaɪt/', 'prep.', '尽管；不管', 'Despite the rain, we went out.', '认知与学术', '尽管下雨，我们还是出去了。'),
          w('s3u3-33', 'afterwards', '/ˈɑːftəwədz/', 'adv.', '后来；以后', 'We had dinner and went home afterwards.', '认知与学术', '我们吃了晚饭，之后回家了。'),
          w('s3u3-34', 'opportunity', '/ˌɒpəˈtjuːnəti/', 'n.', '机会；时机', 'This is a great opportunity.', '认知与学术', '这是个好机会。'),
          w('s3u3-35', 'escape', '/ɪˈskeɪp/', 'v./n.', '逃跑；逃脱；避开', 'He escaped from prison.', '行为与动作', '他越狱了。'),
          w('s3u3-36', 'addition', '/əˈdɪʃn/', 'n.', '增加；添加；加法', 'In addition, he speaks French.', '认知与学术', '此外他还会说法语。'),
          w('s3u3-37', 'emigrate', '/ˈemɪɡreɪt/', 'vi.', '移居国外；移民', 'They emigrated to Australia.', '行为与动作', '他们移民到澳大利亚。'),
          w('s3u3-38', 'select', '/sɪˈlekt/', 'v.', '选择；挑选 adj. 精选的', 'She selected a blue dress.', '行为与动作', '她选了一条蓝裙子。'),
          w('s3u3-39', 'claim', '/kleɪm/', 'v./n.', '声称；索要；索赔', 'He claimed to be innocent.', '行为与动作', '他声称自己无辜。'),
          w('s3u3-40', 'immigrant', '/ˈɪmɪɡrənt/', 'n.', '（外来）移民；侨民', 'The city has many immigrants.', '社会与环境', '这座城市有很多移民。'),
          w('s3u3-41', 'customs', '/ˈkʌstəmz/', 'n.', '海关；关税', 'We went through customs.', '社会与环境', '我们过了海关。'),
          w('s3u3-42', 'socialist', '/ˈsəʊʃəlɪst/', 'adj.', '社会主义的 n. 社会主义者', 'China is a socialist country.', '社会与环境', '中国是社会主义国家。'),
          w('s3u3-43', 'site', '/saɪt/', 'n.', '地点；场所', 'The construction site is busy.', '社会与环境', '建筑工地很忙。'),
          w('s3u3-44', 'neighbourhood', '/ˈneɪbəhʊd/', 'n.', '街区；邻近地区', 'Our neighbourhood is quiet.', '社会与环境', '我们街区很安静。'),
          w('s3u3-45', 'vote', '/vəʊt/', 'v./n.', '投票；选举；表决', 'They voted for the new law.', '行为与动作', '他们投票支持新法律。'),
        ],
      },
      {
        id: 'senior-hk3-u4',
        title: 'Unit 4 · Space Exploration',
        words: [
          w('s3u4-1', 'astronaut', '/ˈæstrənɔːt/', 'n.', '宇航员；航天员', 'He wants to be an astronaut.', '社会与环境', '他想当宇航员。'),
          w('s3u4-2', 'spacecraft', '/ˈspeɪskrɑːft/', 'n.', '航天器；宇宙飞船', 'The spacecraft launched successfully.', '社会与环境', '航天器发射成功。'),
          w('s3u4-3', 'space station', '/ˈspeɪs steɪʃn/', 'n.', '空间站', 'They live on the space station.', '社会与环境', '他们住在空间站。'),
          w('s3u4-4', 'universe', '/ˈjuːnɪvɜːs/', 'n.', '宇宙；天地万物', 'The universe is vast.', '认知与学术', '宇宙浩瀚无边。'),
          w('s3u4-5', 'galaxy', '/ˈɡæləksi/', 'n.', '星系；银河', 'There are many galaxies.', '认知与学术', '有很多星系。'),
          w('s3u4-6', 'planet', '/ˈplænɪt/', 'n.', '行星', 'Earth is our planet.', '认知与学术', '地球是我们的行星。'),
          w('s3u4-7', 'orbit', '/ˈɔːbɪt/', 'n.', '轨道 v. 绕轨道运行', 'The satellite is in orbit.', '认知与学术', '卫星在轨道上运行。'),
          w('s3u4-8', 'launch', '/lɔːntʃ/', 'v./n.', '发射；发起；推出', 'They launched a new satellite.', '行为与动作', '他们发射了新卫星。'),
          w('s3u4-9', 'astronomy', '/əˈstrɒnəmi/', 'n.', '天文学', 'He studies astronomy.', '认知与学术', '他学天文学。'),
          w('s3u4-10', 'astronomer', '/əˈstrɒnəmə(r)/', 'n.', '天文学家', 'The astronomer discovered a new star.', '社会与环境', '这位天文学家发现了一颗新星。'),
          w('s3u4-11', 'universe', '/ˈjuːnɪvɜːs/', 'n.', '宇宙', 'Scientists study the universe.', '认知与学术', '科学家研究宇宙。'),
          w('s3u4-12', 'document', '/ˈdɒkjumənt/', 'n.', '文件；文献 v. 记录', 'Please sign this document.', '社会与环境', '请签这份文件。'),
          w('s3u4-13', 'progress', '/ˈprəʊɡres/', 'n.', '进步；进展 v. 进展', 'She made great progress.', '认知与学术', '她取得了很大进步。'),
          w('s3u4-14', 'beyond', '/bɪˈjɒnd/', 'prep.', '超出；在……那边', 'The view is beyond description.', '认知与学术', '景色美得无法形容。'),
          w('s3u4-15', 'agreement', '/əˈɡriːmənt/', 'n.', '同意；协议；一致', 'They reached an agreement.', '社会与环境', '他们达成了协议。'),
          w('s3u4-16', 'craft', '/krɑːft/', 'n.', '工艺；手艺；航天器', 'The craft is handmade.', '社会与环境', '这件工艺品是手工做的。'),
          w('s3u4-17', 'docking station', '/ˈdɒkɪŋ steɪʃn/', 'n.', '对接站；停靠点', 'The spacecraft connected at the docking station.', '社会与环境', '航天器在对接站连接。'),
          w('s3u4-18', 'signal', '/ˈsɪɡnəl/', 'n.', '信号；暗号 v. 发信号', 'The signal is weak.', '认知与学术', '信号很弱。'),
          w('s3u4-19', 'vehicle', '/ˈviːəkl/', 'n.', '交通工具；车辆；运载工具', 'The vehicle landed on the moon.', '社会与环境', '运载工具在月球着陆。'),
          w('s3u4-20', 'impair', '/ɪmˈpeə(r)/', 'vt.', '削弱；损害', 'Lack of sleep impairs memory.', '行为与动作', '睡眠不足会损害记忆力。'),
          w('s3u4-21', 'giant', '/ˈdʒaɪənt/', 'adj.', '巨大的 n. 巨人；巨星', 'A giant step for mankind.', '品质与状态', '人类的一大步。'),
          w('s3u4-22', 'leap', '/liːp/', 'n./v.', '跳跃；飞跃', 'Take a leap of faith.', '行为与动作', '鼓起勇气跳一步。'),
          w('s3u4-23', 'humanity', '/hjuːˈmænəti/', 'n.', '人类；人性；人道', 'This is for the good of humanity.', '社会与环境', '这是为了人类的福祉。'),
          w('s3u4-24', 'telescope', '/ˈtelɪskəʊp/', 'n.', '望远镜', 'He looked through the telescope.', '社会与环境', '他用望远镜观看。'),
          w('s3u4-25', 'camera', '/ˈkæmərə/', 'n.', '照相机；摄像机', 'The camera captured the event.', '社会与环境', '摄像机拍下了这一幕。'),
          w('s3u4-26', 'durable', '/ˈdjʊərəbl/', 'adj.', '耐用的；持久的', 'The shoes are durable.', '品质与状态', '这鞋很耐穿。'),
          w('s3u4-27', 'set foot on', '/set fʊt ɒn/', 'phr.', '踏上；进入', 'Neil Armstrong set foot on the moon.', '行为与动作', '阿姆斯特朗登上了月球。'),
          w('s3u4-28', 'independent', '/ˌɪndɪˈpendənt/', 'adj.', '独立的；自主的', 'She is independent.', '品质与状态', '她很独立。'),
          w('s3u4-29', 'conduct', '/kənˈdʌkt/', 'v.', '实施；进行；指挥 n. 行为', 'They conducted a study.', '行为与动作', '他们进行了一项研究。'),
          w('s3u4-30', 'detection', '/dɪˈtekʃn/', 'n.', '探测；发现；侦察', 'The detection system works well.', '认知与学术', '探测系统运行良好。'),
          w('s3u4-31', 'resource', '/rɪˈsɔːs/', 'n.', '资源；财力；办法', 'Water is a precious resource.', '社会与环境', '水是宝贵资源。'),
          w('s3u4-32', 'limited', '/ˈlɪmɪtɪd/', 'adj.', '有限的；受限的', 'Time is limited.', '品质与状态', '时间有限。'),
          w('s3u4-33', 'providesb with sth', '/prəˈvaɪd/', 'phr.', '给某人提供某物', 'The company provides us with training.', '行为与动作', '公司给我们提供培训。'),
          w('s3u4-34', 'beyond', '/bɪˈjɒnd/', 'prep.', '超出', 'It is beyond my ability.', '认知与学术', '这超出了我的能力。'),
          w('s3u4-35', 'current', '/ˈkʌrənt/', 'adj.', '当前的；现在的 n. 电流；潮流', 'The current situation is stable.', '品质与状态', '当前局势稳定。'),
          w('s3u4-36', 'settlement', '/ˈsetlmənt/', 'n.', '定居；解决；殖民地', 'The settlement was founded in 1850.', '社会与环境', '这个定居点建于1850年。'),
          w('s3u4-37', 'on board', '/ɒn bɔːd/', 'phr.', '在船（飞机、火车）上', 'Welcome on board!', '行为与动作', '欢迎登机！'),
          w('s3u4-38', 'provide', '/prəˈvaɪd/', 'v.', '提供；供应', 'They provide free education.', '行为与动作', '他们提供免费教育。'),
          w('s3u4-39', 'signal', '/ˈsɪɡnəl/', 'n.', '信号', 'They sent a signal.', '认知与学术', '他们发出了信号。'),
          w('s3u4-40', 'solar system', '/ˈsəʊlə ˈsɪstəm/', 'n.', '太阳系', 'The Earth is in the solar system.', '认知与学术', '地球在太阳系中。'),
          w('s3u4-41', 'master', '/ˈmɑːstə(r)/', 'v.', '精通；掌握 n. 主人；大师', 'He mastered three languages.', '行为与动作', '他精通三门语言。'),
          w('s3u4-42', 'determine', '/dɪˈtɜːmɪn/', 'v.', '决定；确定；查明', 'Genes determine our height.', '行为与动作', '基因决定我们的身高。'),
          w('s3u4-43', 'device', '/dɪˈvaɪs/', 'n.', '设备；装置；仪器', 'The device is easy to use.', '社会与环境', '这个设备很容易使用。'),
          w('s3u4-44', 'progress', '/ˈprəʊɡres/', 'n.', '进步；进展', 'Space exploration has made great progress.', '认知与学术', '太空探索取得了巨大进步。'),
          w('s3u4-45', 'wish', '/wɪʃ/', 'v./n.', '希望；祝愿', 'I wish you success.', '情感与性格', '祝你成功。'),
        ],
      },
      {
        id: 'senior-hk3-u5',
        title: 'Unit 5 · The Value of Money',
        words: [
          w('s3u5-1', 'value', '/ˈvæljuː/', 'n.', '价值；价值观 v. 重视；估价', 'The value of money is clear.', '认知与学术', '钱的价值很清楚。'),
          w('s3u5-2', 'bank account', '/bæŋk əˈkaʊnt/', 'n.', '银行账户', 'He opened a bank account.', '社会与环境', '他开了个银行账户。'),
          w('s3u5-3', 'cart', '/kɑːt/', 'n.', '购物车；手推车', 'She pushed the shopping cart.', '社会与环境', '她推着购物车。'),
          w('s3u5-4', 'on the basis of', '/ɒn ðə ˈbeɪsɪs ɒv/', 'phr.', '在……基础上', 'We judged on the basis of evidence.', '认知与学术', '我们根据证据判断。'),
          w('s3u5-5', 'loan', '/ləʊn/', 'n.', '贷款；借款 v. 借出', 'He took out a loan.', '社会与环境', '他贷了款。'),
          w('s3u5-6', 'plastic', '/ˈplæstɪk/', 'adj.', '塑料的 n. 塑料；信用卡', 'He paid by plastic.', '社会与环境', '他用信用卡付款。'),
          w('s3u5-7', 'apologize', '/əˈpɒlədʒaɪz/', 'vi.', '道歉；认错', 'He apologized for being late.', '行为与动作', '他因迟到而道歉。'),
          w('s3u5-8', 'ignore', '/ɪɡˈnɔː(r)/', 'vt.', '忽视；不理睬', 'She ignored his advice.', '行为与动作', '她无视了他的建议。'),
          w('s3u5-9', 'judge', '/dʒʌdʒ/', 'v.', '判断；评判 n. 法官；裁判', 'Don\u2019t judge a book by its cover.', '行为与动作', '不要以貌取人。'),
          w('s3u5-10', 'scene', '/siːn/', 'n.', '场景；场面；景色', 'The scene is beautiful.', '社会与环境', '景色很美。'),
          w('s3u5-11', 'narrator', '/nəˈreɪtə(r)/', 'n.', '叙述者；讲述者', 'The narrator tells the story.', '社会与环境', '叙述者讲述故事。'),
          w('s3u5-12', 'narrate', '/nəˈreɪt/', 'v.', '叙述；讲述', 'He narrated the documentary.', '行为与动作', '他为纪录片旁白。'),
          w('s3u5-13', 'bet', '/bet/', 'v./n.', '打赌；敢说', 'I bet you are right.', '行为与动作', '我敢打赌你是对的。'),
          w('s3u5-14', 'servant', '/ˈsɜːvənt/', 'n.', '仆人；雇员', 'He worked as a servant.', '社会与环境', '他当仆人。'),
          w('s3u5-15', 'as for', '/æz fɔː(r)/', 'phr.', '至于；关于', 'As for me, I don\u2019t care.', '认知与学术', '至于我，我无所谓。'),
          w('s3u5-16', 'old-fashioned', '/ˌəʊld ˈfæʃnd/', 'adj.', '过时的；守旧的', 'That idea is old-fashioned.', '品质与状态', '那个想法过时了。'),
          w('s3u5-17', 'obey', '/əˈbeɪ/', 'v.', '服从；遵守', 'Soldiers must obey orders.', '行为与动作', '士兵必须服从命令。'),
          w('s3u5-18', 'attain', '/əˈteɪn/', 'vt.', '获得；达到；实现', 'He attained his goal.', '行为与动作', '他实现了目标。'),
          w('s3u5-19', 'status', '/ˈsteɪtəs/', 'n.', '地位；身份；状态', 'Social status matters to him.', '社会与环境', '社会地位对他很重要。'),
          w('s3u5-20', 'judgement', '/ˈdʒʌdʒmənt/', 'n.', '判断力；判决；评价', 'She showed good judgement.', '认知与学术', '她表现出良好的判断力。'),
          w('s3u5-21', 'sailor', '/ˈseɪlə(r)/', 'n.', '水手；海员', 'The sailor crossed the ocean.', '社会与环境', '水手横渡大洋。'),
          w('s3u5-22', 'lie', '/laɪ/', 'v.', '躺；位于；说谎 n. 谎言', 'He lied about his age.', '行为与动作', '他谎报了年龄。'),
          w('s3u5-23', 'madam', '/ˈmædəm/', 'n.', '夫人；女士', 'Can I help you, madam?', '社会与环境', '夫人，需要帮忙吗？'),
          w('s3u5-24', 'generous', '/ˈdʒenərəs/', 'adj.', '慷慨的；大方的；宽厚的', 'She is very generous.', '情感与性格', '她很慷慨。'),
          w('s3u5-25', 'tax', '/tæks/', 'n.', '税；税款 v. 征税', 'He pays high taxes.', '社会与环境', '他缴很高的税。'),
          w('s3u5-26', 'mansion', '/ˈmænʃn/', 'n.', '公馆；大厦；宅第', 'They live in a big mansion.', '社会与环境', '他们住在大宅里。'),
          w('s3u5-27', 'take out a loan', '/teɪk aʊt ə ləʊn/', 'phr.', '取得贷款', 'He took out a loan to buy a house.', '行为与动作', '他贷款买房。'),
          w('s3u5-28', 'patient', '/ˈpeɪʃnt/', 'adj.', '耐心的 n. 病人', 'Be patient with children.', '情感与性格', '对孩子要有耐心。'),
          w('s3u5-29', 'on a budget', '/ɒn ə ˈbʌdʒɪt/', 'phr.', '节省费用；收支平衡', 'We are on a tight budget.', '社会与环境', '我们预算很紧。'),
          w('s3u5-30', 'leather', '/ˈleðə(r)/', 'n.', '皮革；皮革制品', 'He wore a leather jacket.', '社会与环境', '他穿皮夹克。'),
          w('s3u5-31', 'immediately', '/ɪˈmiːdiətli/', 'adv.', '立即；马上', 'She left immediately.', '行为与动作', '她马上离开了。'),
          w('s3u5-32', 'emergency', '/iˈmɜːdʒənsi/', 'n.', '紧急情况；突发事件', 'Call 911 in an emergency.', '社会与环境', '紧急情况打911。'),
          w('s3u5-33', 'gentleman', '/ˈdʒentlmən/', 'n.', '绅士；先生', 'He is a real gentleman.', '社会与环境', '他是位真正的绅士。'),
          w('s3u5-34', 'bow', '/baʊ/', 'v.', '鞠躬；低头 n. 弓；蝴蝶结', 'He bowed to the audience.', '行为与动作', '他向观众鞠躬。'),
          w('s3u5-35', 'waiter', '/ˈweɪtə(r)/', 'n.', '（男）服务员；侍者', 'The waiter brought the menu.', '社会与环境', '服务员拿来了菜单。'),
          w('s3u5-36', 'naughty', '/ˈnɔːti/', 'adj.', '顽皮的；淘气的', 'The naughty boy broke the window.', '情感与性格', '淘气的男孩打破了窗户。'),
          w('s3u5-37', 'rotten', '/ˈrɒtn/', 'adj.', '腐烂的；腐朽的；糟糕的', 'The fruit went rotten.', '品质与状态', '水果烂了。'),
          w('s3u5-38', 'as a matter of fact', '/æz ə ə ˈmætə ɒv fækt/', 'phr.', '事实上；其实', 'As a matter of fact, I agree.', '认知与学术', '事实上，我同意。'),
          w('s3u5-39', 'judging by', '/ˈdʒʌdʒɪŋ baɪ/', 'phr.', '根据……判断', 'Judging by his accent, he is from London.', '认知与学术', '从口音判断，他是伦敦人。'),
          w('s3u5-40', 'fashion', '/ˈfæʃn/', 'n.', '时尚；方式；样子', 'Long hair is in fashion now.', '社会与环境', '现在流行长发。'),
          w('s3u5-41', 'relevance', '/ˈreləvəns/', 'n.', '相关；切题；意义', 'The relevance is clear.', '认知与学术', '相关性很清楚。'),
          w('s3u5-42', 'lie', '/laɪ/', 'v.', '说谎', 'Don\u2019t lie to me.', '行为与动作', '别对我撒谎。'),
          w('s3u5-43', 'willingness', '/ˈwɪlɪŋnəs/', 'n.', '愿意；乐意；心甘情愿', 'She showed willingness to help.', '情感与性格', '她表现出帮忙的意愿。'),
          w('s3u5-44', 'indeed', '/ɪnˈdiːd/', 'adv.', '确实；的确；实际上', 'It is indeed a great honour.', '认知与学术', '这确实是极大的荣幸。'),
          w('s3u5-45', 'rather than', '/ˈrɑːðə ðæn/', 'phr.', '而不是；与其……倒不如', 'I chose tea rather than coffee.', '认知与学术', '我选了茶而不是咖啡。'),
        ],
      },
    ],
  },
  {
    id: 'senior-xb1',
    name: '人教版高中英语选择性必修第一册（2019）',
    stage: '高中英语',
    wordCount: 310,
    builtin: true,
    desc: '人教社2019高中选必教材',
    units: [
      {
        id: 'senior-xb1-u1',
        title: 'Unit 1 · People of Achievement',
        words: [
          w('x1u1-1', 'physiology', '/ˌfɪziˈɒlədʒi/', 'n.', '生理学；生理机能', 'He studies physiology.', '认知与学术', '他学生理学。', {
            phrases: [
              { en: 'human physiology', zh: '人体生理学' },
              { en: 'plant physiology', zh: '植物生理学' },
            ],
            
            extraExamples: [
              { en: 'Physiology helps us understand how the body works.', zh: '生理学帮助我们了解身体如何运作。' },
              { en: 'She has a degree in animal physiology.', zh: '她有动物生理学学位。' },
            ],
          }),
          w('x1u1-2', 'artemisinin', '/ˌɑːtɪˈmiːsɪnɪn/', 'n.', '[药]青蒿素', 'Tu Youyou discovered artemisinin.', '认知与学术', '屠呦呦发现了青蒿素。', {
            phrases: [
              { en: 'extract artemisinin from...', zh: '从……中提取青蒿素' },
              { en: 'artemisinin-based therapy', zh: '青蒿素疗法' },
            ],
            
            extraExamples: [
              { en: 'Artemisinin is a gift to the world from traditional Chinese medicine.', zh: '青蒿素是中医药献给世界的礼物。' },
              { en: 'The team finally found artemisinin effective against malaria.', zh: '团队最终发现青蒿素对疟疾有效。' },
            ],
          }),
          w('x1u1-3', 'crucial', '/ˈkruːʃl/', 'adj.', '至关重要的；关键性的', 'This is a crucial moment.', '认知与学术', '这是关键时刻。', {
            phrases: [
              { en: 'be crucial to / for...', zh: '对……至关重要' },
              { en: 'a crucial factor / role / moment', zh: '关键因素/作用/时刻' },
            ],
            
            extraExamples: [
              { en: 'Good time management is crucial to success.', zh: '良好的时间管理对成功至关重要。' },
              { en: 'The next few days will be crucial.', zh: '接下来几天将是关键。' },
            ],
          }),
          w('x1u1-4', 'malaria', '/məˈleəriə/', 'n.', '疟疾', 'Malaria kills many people.', '社会与环境', '疟疾夺去许多人的生命。', {
            phrases: [
              { en: 'suffer from malaria', zh: '患疟疾' },
              { en: 'malaria parasite', zh: '疟原虫' },
            ],
            
            extraExamples: [
              { en: 'Malaria is spread by mosquitoes.', zh: '疟疾通过蚊子传播。' },
              { en: 'Thousands die of malaria every year.', zh: '每年有数千人死于疟疾。' },
            ],
          }),
          w('x1u1-5', 'vital', '/ˈvaɪtl/', 'adj.', '必不可少的；极其重要的；充满生机的', 'Sleep is vital to health.', '品质与状态', '睡眠对健康至关重要。', {
            phrases: [
              { en: 'be vital to / for...', zh: '对……至关重要' },
              { en: 'vital signs', zh: '生命体征（医学用语）' },
              { en: 'vital energy', zh: '生命力' },
            ],
            
            extraExamples: [
              { en: 'The heart is a vital organ.', zh: '心脏是重要器官。' },
              { en: 'It is vital that we act now.', zh: '我们必须现在行动。' },
            ],
          }),
          w('x1u1-6', 'committed', '/kəˈmɪtɪd/', 'adj.', '尽心尽力的；坚定的；坚信的', 'She is committed to her work.', '情感与性格', '她对工作尽心尽力。', {
            phrases: [{en:'be committed to (doing) sth.', zh:'致力于某事'}, {en:'a committed supporter', zh:'坚定支持者'}],
            
            extraExamples: [
              {en:'He is deeply committed to the project.', zh:'他全心投入这个项目。'},
              {en:'She remains committed to her principles.', zh:'她坚守自己的原则。'},
            ],
          }),
          w('x1u1-7', 'commit', '/kəˈmɪt/', 'v.', '承诺；保证；忠于；全心全意投入', 'He committed himself to helping others.', '行为与动作', '他全心投入帮助他人。', {
            phrases: [
              { en: 'commit oneself to (doing) sth.', zh: '致力于某事' },
              { en: 'commit a crime/mistake', zh: '犯罪/犯错' },
            ],
            
            extraExamples: [
              { en: 'They committed to finishing on time.', zh: '他们承诺按时完成。' },
              { en: 'Don’t commit more than you can deliver.', zh: '别承诺做不到的事。' },
            ]
          }),
          w('x1u1-8', 'academy', '/əˈkædəmi/', 'n.', '（艺术、文学、科学等的）研究院；学会；专科院校', 'She joined the Academy of Science.', '社会与环境', '她加入了科学院。', {
            phrases: [
              { en: 'the Academy of Sciences', zh: '科学院' },
              { en: 'a military academy', zh: '军事学院' },
            ],
            
            extraExamples: [
              { en: 'She studied at a police academy.', zh: '她在警察学院学习。' },
              { en: 'The academy awards are held in March.', zh: '颁奖典礼在三月举行。' },
            ]
          }),
          w('x1u1-9', 'academic', '/ˌækəˈdemɪk/', 'adj.', '学业的；学术的', 'Her academic performance is excellent.', '认知与学术', '她学业成绩优异。', {
            phrases: [
              { en: 'academic performance/year', zh: '学业表现/学年' },
              { en: 'academic research', zh: '学术研究' },
            ],
            
            extraExamples: [
              { en: 'Her academic record is outstanding.', zh: '她的学业成绩优异。' },
              { en: 'There are no easy academic answers.', zh: '学术上没有简单答案。' },
            ]
          }),
          w('x1u1-10', 'objective', '/əbˈdʒektɪv/', 'n.', '目标；目的 adj. 客观的', 'Our objective is to win.', '认知与学术', '我们的目标是获胜。', {
            phrases: [
              { en: 'achieve/set an objective', zh: '实现/设定目标' },
              { en: 'an objective analysis', zh: '客观分析' },
            ],
            
            extraExamples: [
              { en: 'Our main objective is profit.', zh: '我们的主要目标是盈利。' },
              { en: 'Try to be objective about it.', zh: '对此要尽量客观。' },
            ]
          }),
          w('x1u1-11', 'botanical', '/bəˈtænɪkl/', 'adj.', '植物学的', 'They went on a botanical trip.', '认知与学术', '他们进行了植物学考察。', {
            phrases: [
              { en: 'a botanical garden', zh: '植物园' },
              { en: 'botanical research', zh: '植物学研究' },
            ],
            
            extraExamples: [
              { en: 'We visited the botanical garden.', zh: '我们参观了植物园。' },
              { en: 'She has a botanical background.', zh: '她有植物学背景。' },
            ]
          }),
          w('x1u1-12', 'evaluate', '/ɪˈvæljueɪt/', 'vt.', '评价；评估', 'Teachers evaluate students\u2019 work.', '行为与动作', '老师评估学生的作业。', {
            phrases: [
              { en: 'evaluate the effect/performance', zh: '评估效果/表现' },
              { en: 'evaluate options', zh: '评估选项' },
            ],
            
            extraExamples: [
              { en: 'We need to evaluate the results.', zh: '我们需要评估结果。' },
              { en: 'The doctor evaluated his condition.', zh: '医生评估了他的病情。' },
            ]
          }),
          w('x1u1-13', 'property', '/ˈprɒpəti/', 'n.', '性质；特征；财产', 'Chef has special properties.', '认知与学术', '青蒿有特殊性质。', {
            phrases: [
              { en: 'chemical/physical properties', zh: '化学/物理性质' },
              { en: 'private property', zh: '私有财产' },
            ],
            
            extraExamples: [
              { en: 'The material has special properties.', zh: '这种材料有特殊性质。' },
              { en: 'That is private property.', zh: '那是私有财产。' },
            ]
          }),
          w('x1u1-14', 'distinct', '/dɪˈstɪŋkt/', 'adj.', '清晰的；清楚的；有区别的', 'There is a distinct difference.', '认知与学术', '有明显区别。', {
            phrases: [
              { en: 'be distinct from...', zh: '与……不同' },
              { en: 'a distinct advantage', zh: '明显优势' },
            ],
            
            extraExamples: [
              { en: 'There are two distinct types.', zh: '有两种截然不同的类型。' },
              { en: 'The two ideas are quite distinct.', zh: '这两个想法截然不同。' },
            ]
          }),
          w('x1u1-15', 'extract', '/ˈekstrækt/', 'n.', '提取物；摘录 vt. 提取；提炼；摘录', 'They extracted the useful substance.', '行为与动作', '他们提取了有用物质。', {
            phrases: [
              { en: 'extract sth. from sth.', zh: '从……中提取……' },
              { en: 'vanilla extract', zh: '香草精' },
            ],
            
            extraExamples: [
              { en: 'They extracted oil from the seeds.', zh: '他们从种子中榨油。' },
              { en: 'Read the extract on page 10.', zh: '读第10页的摘录。' },
            ]
          }),
          w('x1u1-16', 'wormwood', '/ˈwɜːmwʊd/', 'n.', '蒿；洋艾', 'Wormwood is used in medicine.', '社会与环境', '蒿草用于制药。', {
            phrases: [
              { en: 'sweet wormwood / Artemisia annua', zh: '黄花蒿（青蒿）' },
              { en: 'wormwood oil', zh: '蒿油' },
            ],
            
            extraExamples: [
              { en: 'Wormwood is the source of artemisinin.', zh: '黄花蒿是青蒿素的来源。' },
              { en: 'The tea tastes like wormwood.', zh: '这茶有蒿草味。' },
            ]
          }),
          w('x1u1-17', 'boil', '/bɔɪl/', 'v.', '（使）沸腾；煮开；烧开 n. 沸腾；沸点', 'Boil the water before drinking.', '行为与动作', '喝水前要烧开。', {
            phrases: [
              { en: 'boil the kettle', zh: '烧开水' },
              { en: 'bring to the boil', zh: '煮沸' },
            ],
            
            extraExamples: [
              { en: 'The water is boiling.', zh: '水开了。' },
              { en: 'She boiled an egg for breakfast.', zh: '她早餐煮了个鸡蛋。' },
            ]
          }),
          w('x1u1-18', 'liquid', '/ˈlɪkwɪd/', 'n.', '液体 adj. 液体的；液态的', 'Water is a liquid.', '认知与学术', '水是液体。', {
            phrases: [
              { en: 'liquid food/diet', zh: '流质食物' },
              { en: 'clear liquid', zh: '清流质' },
            ],
            
            extraExamples: [
              { en: 'The bottle contains a clear liquid.', zh: '瓶子里装着透明液体。' },
              { en: 'Wash with liquid soap.', zh: '用洗手液洗。' },
            ]
          }),
          w('x1u1-19', 'obtain', '/əbˈteɪn/', 'vt.', '（尤指经努力）获得；赢得', 'He obtained a degree.', '行为与动作', '他获得了学位。', {
            phrases: [
              { en: 'obtain permission/information', zh: '获得许可/信息' },
              { en: 'obtain a degree', zh: '获得学位' },
            ],
            
            extraExamples: [
              { en: 'Further information can be obtained online.', zh: '更多信息可在网上获取。' },
              { en: 'He obtained a scholarship.', zh: '他获得了奖学金。' },
            ]
          }),
          w('x1u1-20', 'acknowledge', '/əkˈnɒlɪdʒ/', 'vt.', '承认（属实、权威等）；（公开）感谢', 'She acknowledged her mistake.', '行为与动作', '她承认了错误。', {
            phrases: [
              { en: 'acknowledge sth. as...', zh: '承认……为……' },
              { en: 'acknowledge the applause', zh: '答谢掌声' },
            ],
            
            extraExamples: [
              { en: 'He acknowledged that he was wrong.', zh: '他承认自己错了。' },
              { en: 'She acknowledged the donation in her speech.', zh: '她在演讲中感谢了捐款。' },
            ]
          }),
          w('x1u1-21', 'defeat', '/dɪˈfiːt/', 'n.', '失败；挫败 vt. 击败；战胜', 'They celebrated their defeat.', '行为与动作', '他们庆祝击败了对手。', {
            phrases: [
              { en: 'defeat an opponent', zh: '击败对手' },
              { en: 'admit defeat', zh: '承认失败' },
            ],
            
            extraExamples: [
              { en: 'Our team defeated theirs 3-1.', zh: '我们队3比1击败了他们。' },
              { en: 'They refused to admit defeat.', zh: '他们拒绝认输。' },
            ]
          }),
          w('x1u1-22', 'analyse', '/ˈænəlaɪz/', 'vt.', '分析', 'Scientists analysed the data.', '行为与动作', '科学家分析了数据。', {
            phrases: [
              { en: 'analyse the data/results', zh: '分析数据/结果' },
              { en: 'carefully analyse', zh: '仔细分析' },
            ],
            
            extraExamples: [
              { en: 'We need to analyse the problem.', zh: '我们需要分析这个问题。' },
              { en: 'The samples were analysed in the lab.', zh: '样本在实验室分析。' },
            ]
          }),
          w('x1u1-23', 'apparently', '/əˈpærəntli/', 'adv.', '显而易见；看来；显然', 'Apparently, he is wrong.', '认知与学术', '显然他错了。', {
            phrases: [
              { en: 'apparently obvious', zh: '显然' },
              { en: 'Apparently not.', zh: '显然不是。' },
            ],
            
            extraExamples: [
              { en: 'He has apparently changed his mind.', zh: '他显然改变了主意。' },
              { en: 'Apparently, they do not care.', zh: '看来他们不在乎。' },
            ]
          }),
          w('x1u1-24', 'substance', '/ˈsʌbstəns/', 'n.', '物质；物品；事实根据', 'Carbon is a useful substance.', '认知与学术', '碳是有用的物质。', {
            phrases: [
              { en: 'a chemical/harmful substance', zh: '化学/有害物质' },
              { en: 'in substance', zh: '本质上' },
            ],
            
            extraExamples: [
              { en: 'Sugar is a natural substance.', zh: '糖是天然物质。' },
              { en: 'There is no substance to his claims.', zh: '他的说法毫无根据。' },
            ]
          }),
          w('x1u1-25', 'insist', '/ɪnˈsɪst/', 'v.', '坚持；坚决要求', 'He insisted on paying.', '行为与动作', '他坚持要付款。', {
            phrases: [
              { en: 'insist on (doing) sth.', zh: '坚持做某事' },
              { en: 'insist that...', zh: '坚决要求……' },
            ],
            
            extraExamples: [
              { en: 'She insisted on going alone.', zh: '她坚持独自去。' },
              { en: 'He insisted that I stay for dinner.', zh: '他一定要我留下吃饭。' },
            ]
          }),
          w('x1u1-26', 'scientific', '/ˌsaɪənˈtɪfɪk/', 'adj.', '科学（上）的；关于科学的', 'We need scientific evidence.', '认知与学术', '我们需要科学证据。', {
            phrases: [
              { en: 'scientific research/evidence', zh: '科学研究/证据' },
              { en: 'a scientific approach', zh: '科学方法' },
            ],
            
            extraExamples: [
              { en: 'There is no scientific proof.', zh: '没有科学证据。' },
              { en: 'They took a scientific approach.', zh: '他们采用了科学方法。' },
            ]
          }),
          w('x1u1-27', 'mostly', '/ˈməʊstli/', 'adv.', '主要地；一般地', 'The work is mostly done.', '认知与学术', '工作基本完成了。', {
            phrases: [
              { en: 'mostly about...', zh: '主要是关于……' },
              { en: 'mostly young people', zh: '大多是年轻人' },
            ],
            
            extraExamples: [
              { en: 'The audience was mostly women.', zh: '观众大多是女性。' },
              { en: 'She is mostly out on weekends.', zh: '她周末多半不在家。' },
            ]
          }),
          w('x1u1-28', 'conclusion', '/kənˈkluːʒn/', 'n.', '结论；推论', 'They reached a conclusion.', '认知与学术', '他们得出了结论。', {
            phrases: [
              { en: 'reach/draw a conclusion', zh: '得出结论' },
              { en: 'in conclusion', zh: '总之' },
            ],
            
            extraExamples: [
              { en: 'What conclusion did you reach?', zh: '你得出了什么结论？' },
              { en: 'In conclusion, I would like to thank you.', zh: '总之，我要感谢大家。' },
            ]
          }),
          w('x1u1-29', 'penicillin', '/ˌpenɪˈsɪlɪn/', 'n.', '青霉素；盘尼西林', 'Penicillin saves lives.', '社会与环境', '青霉素拯救生命。', {
            phrases: [
              { en: 'penicillin allergy', zh: '青霉素过敏' },
              { en: 'discover penicillin', zh: '发现青霉素' },
            ],
            
            extraExamples: [
              { en: 'Fleming discovered penicillin by accident.', zh: '弗莱明偶然发现了青霉素。' },
              { en: 'She is allergic to penicillin.', zh: '她对青霉素过敏。' },
            ]
          }),
          w('x1u1-30', 'flee', '/fliː/', 'v.', '（fled, fled）迅速离开；逃跑', 'He fled the country.', '行为与动作', '他逃离了这个国家。', {
            phrases: [
              { en: 'flee the country/city', zh: '逃离国家/城市' },
              { en: 'flee from sth.', zh: '从……逃走' },
            ],
            
            extraExamples: [
              { en: 'They fled from the burning house.', zh: '他们从着火的房子里逃出来。' },
              { en: 'He fled to France.', zh: '他逃到了法国。' },
            ]
          }),
          w('x1u1-31', 'circumstance', '/ˈsɜːkəmstəns/', 'n.', '条件；环境；状况', 'Under no circumstances should you give up.', '认知与学术', '任何情况下都不应放弃。', {
            phrases: [
              { en: 'under no circumstances', zh: '决不' },
              { en: 'under the circumstances', zh: '在这种情况下' },
            ],
            
            extraExamples: [
              { en: 'Due to circumstances beyond our control...', zh: '由于我们无法控制的情况……' },
              { en: 'Under no circumstances should you open this door.', zh: '任何情况下都不要打开这扇门。' },
            ]
          }),
          w('x1u1-32', 'novelist', '/ˈnɒvəlɪst/', 'n.', '小说家', 'She is a famous novelist.', '社会与环境', '她是位著名小说家。', {
            phrases: [
              { en: 'a famous/leading novelist', zh: '著名小说家' },
              { en: 'a historical novelist', zh: '历史小说家' },
            ],
            
            extraExamples: [
              { en: 'Dickens was a great novelist.', zh: '狄更斯是伟大的小说家。' },
              { en: 'She is a successful novelist.', zh: '她是成功的小说家。' },
            ]
          }),
          w('x1u1-33', 'novel', '/ˈnɒvl/', 'n.', '（长篇）小说 adj. 新颖的', 'I read a good novel.', '社会与环境', '我读了本好小说。', {
            phrases: [
              { en: 'a historical novel', zh: '历史小说' },
              { en: 'a novel idea/approach', zh: '新奇的想法/方法' },
            ],
            
            extraExamples: [
              { en: 'It’s a novel solution to an old problem.', zh: '这是老问题的新解法。' },
              { en: 'She spent a year writing her first novel.', zh: '她花了一年写第一部小说。' },
            ]
          }),
          w('x1u1-34', 'flow', '/fləʊ/', 'n.', '流；流动；流畅 v. 流；流动', 'The flow of water is steady.', '认知与学术', '水流稳定。', {
            phrases: [
              { en: 'the flow of...', zh: '……的流动' },
              { en: 'cash flow', zh: '现金流' },
            ],
            
            extraExamples: [
              { en: 'The river flows into the sea.', zh: '这条河流入大海。' },
              { en: 'She slowed the flow of traffic.', zh: '她让车流慢下来。' },
            ]
          }),
          w('x1u1-35', 'chart', '/tʃɑːt/', 'n.', '图表 vt. 记录；制订计划', 'The chart shows the trend.', '认知与学术', '图表显示了趋势。', {
            phrases: [
              { en: 'a bar/pie chart', zh: '柱状/饼状图' },
              { en: 'chart a course', zh: '规划路线' },
            ],
            
            extraExamples: [
              { en: 'The chart shows sales over time.', zh: '图表显示了销售随时间变化。' },
              { en: 'The song topped the charts.', zh: '这首歌登上排行榜榜首。' },
            ]
          }),
          w('x1u1-36', 'found', '/faʊnd/', 'vt.', '创建；建立；把……建立在', 'They founded a new school.', '行为与动作', '他们创办了一所新学校。', {
            phrases: [
              { en: 'found a company/school', zh: '创办公司/学校' },
              { en: 'be founded on...', zh: '建立在……基础上' },
            ],
            
            extraExamples: [
              { en: 'The city was founded in 1624.', zh: '这座城市建于1624年。' },
              { en: 'The story is founded on fact.', zh: '这个故事基于事实。' },
            ]
          }),
          w('x1u1-37', 'infer', '/ɪnˈfɜː(r)/', 'vt.', '推断；推定', 'What can we infer from the text?', '认知与学术', '我们能从文中推断出什么？', {
            phrases: [
              { en: 'infer sth. from sth.', zh: '从……推断……' },
              { en: 'it can be inferred that...', zh: '可以推断……' },
            ],
            
            extraExamples: [
              { en: 'What can we infer from his words?', zh: '从他的话中我们能推断出什么？' },
              { en: 'I inferred that she was unhappy.', zh: '我推测她不开心。' },
            ]
          }),
          w('x1u1-38', 'politician', '/ˌpɒləˈtɪʃn/', 'n.', '从政者；政治家；政客', 'The politician gave a speech.', '社会与环境', '这位政治家发表了演讲。', {
            phrases: [
              { en: 'a career politician', zh: '职业政客' },
              { en: 'a local politician', zh: '地方政客' },
            ],
            
            extraExamples: [
              { en: 'The politician refused to comment.', zh: '这位政客拒绝评论。' },
              { en: 'He was a shrewd politician.', zh: '他是个精明的政客。' },
            ]
          }),
          w('x1u1-39', 'numerous', '/ˈnjuːmərəs/', 'adj.', '众多的；许多的', 'Numerous people came.', '社会与环境', '许多人来了。', {
            phrases: [
              { en: 'numerous attempts/reasons', zh: '多次尝试/众多原因' },
              { en: 'on numerous occasions', zh: '多次' },
            ],
            
            extraExamples: [
              { en: 'She has written numerous books.', zh: '她写了很多书。' },
              { en: 'Numerous problems remain.', zh: '仍有许多问题。' },
            ]
          }),
          w('x1u1-40', 'theory', '/ˈθɪəri/', 'n.', '理论；学说', 'In theory, it works.', '认知与学术', '理论上可行。', {
            phrases: [
              { en: 'in theory', zh: '理论上' },
              { en: 'the theory of relativity', zh: '相对论' },
            ],
            
            extraExamples: [
              { en: 'In theory, the plan works.', zh: '理论上这计划可行。' },
              { en: 'Darwin’s theory changed biology.', zh: '达尔文的理论改变了生物学。' },
            ]
          }),
          w('x1u1-41', 'relativity', '/ˌreləˈtɪvəti/', 'n.', '相对论；相对性', 'Einstein developed the theory of relativity.', '认知与学术', '爱因斯坦提出了相对论。', {
            phrases: [
              { en: 'the theory of relativity', zh: '相对论' },
              { en: 'general/special relativity', zh: '广义/狭义相对论' },
            ],
            
            extraExamples: [
              { en: 'Einstein published relativity in 1905.', zh: '爱因斯坦1905年发表相对论。' },
              { en: 'Relativity changed physics.', zh: '相对论改变了物理学。' },
            ]
          }),
          w('x1u1-42', 'formula', '/ˈfɔːmjələ/', 'n.', '公式；方程式；配方', 'He wrote down the formula.', '认知与学术', '他写下了公式。', {
            phrases: [
              { en: 'a mathematical formula', zh: '数学公式' },
              { en: 'a winning formula', zh: '成功模式' },
            ],
            
            extraExamples: [
              { en: 'He wrote down the chemical formula.', zh: '他写下了化学式。' },
              { en: 'There is no magic formula for success.', zh: '成功没有魔法公式。' },
            ]
          }),
          w('x1u1-43', 'genius', '/ˈdʒiːniəs/', 'n.', '天才；天资；天赋', 'Einstein was a genius.', '认知与学术', '爱因斯坦是个天才。', {
            phrases: [
              { en: 'a stroke of genius', zh: '神来之笔' },
              { en: 'have a genius for sth.', zh: '有……天赋' },
            ],
            
            extraExamples: [
              { en: 'Einstein was a mathematical genius.', zh: '爱因斯坦是数学天才。' },
              { en: 'She has a genius for music.', zh: '她有音乐天赋。' },
            ]
          }),
          w('x1u1-44', 'gentle', '/ˈdʒentl/', 'adj.', '温柔的；文静的', 'She has a gentle manner.', '情感与性格', '她举止温柔。', {
            phrases: [
              { en: 'a gentle voice/touch', zh: '温柔的声音/抚摸' },
              { en: 'gentle wind/rain', zh: '和风/细雨' },
            ],
            
            extraExamples: [
              { en: 'Be gentle with the baby.', zh: '对宝宝温柔点。' },
              { en: 'The breeze was gentle.', zh: '微风轻轻。' },
            ]
          }),
          w('x1u1-45', 'patent', '/ˈpeɪtnt/', 'n.', '专利；专利证书 adj. 有专利的', 'He applied for a patent.', '社会与环境', '他申请了专利。', {
            phrases: [
              { en: 'apply for a patent', zh: '申请专利' },
              { en: 'patent protection', zh: '专利保护' },
            ],
            
            extraExamples: [
              { en: 'The company holds 50 patents.', zh: '这家公司拥有50项专利。' },
              { en: 'He patented the invention in 1990.', zh: '他1990年为这项发明申请了专利。' },
            ]
          }),
          w('x1u1-46', 'passion', '/ˈpæʃn/', 'n.', '酷爱；激情', 'She has a passion for music.', '情感与性格', '她酷爱音乐。', {
            phrases: [
              { en: 'have a passion for sth.', zh: '酷爱……' },
              { en: 'speak with passion', zh: '充满激情地说' },
            ],
            
            extraExamples: [
              { en: 'She has a passion for gardening.', zh: '她酷爱园艺。' },
              { en: 'He spoke with great passion.', zh: '他讲得充满激情。' },
            ]
          }),
          w('x1u1-47', 'doctorate', '/ˈdɒktərət/', 'n.', '博士学位', 'He got his doctorate.', '社会与环境', '他获得了博士学位。', {
            phrases: [
              { en: 'receive/obtain a doctorate', zh: '获得博士学位' },
              { en: 'a doctorate in physics', zh: '物理学博士学位' },
            ],
            
            extraExamples: [
              { en: 'She got her doctorate in 2010.', zh: '她2010年获得博士学位。' },
              { en: 'He is studying for a doctorate.', zh: '他在读博士。' },
            ]
          }),
          w('x1u1-48', 'extraordinary', '/ɪkˈstrɔːdnri/', 'adj.', '不一般的；非凡的；意想不到的', 'She has an extraordinary memory.', '品质与状态', '她记忆力非凡。', {
            phrases: [
              { en: 'an extraordinary achievement', zh: '非凡成就' },
              { en: 'extraordinary beauty', zh: '非凡的美' },
            ],
            
            extraExamples: [
              { en: 'She has an extraordinary voice.', zh: '她嗓音超凡。' },
              { en: 'An extraordinary thing happened.', zh: '发生了一件不寻常的事。' },
            ]
          }),
          w('x1u1-49', 'gradually', '/ˈɡrædʒuəli/', 'adv.', '逐渐地；逐步地', 'The weather gradually improved.', '认知与学术', '天气逐渐好转。', {
            phrases: [
              { en: 'gradually improve/change', zh: '逐渐改善/变化' },
              { en: 'get gradually worse', zh: '逐渐变差' },
            ],
            
            extraExamples: [
              { en: 'The pain gradually lessened.', zh: '疼痛逐渐减轻。' },
              { en: 'She gradually recovered.', zh: '她渐渐康复。' },
            ]
          }),
          w('x1u1-50', 'institution', '/ˌɪnstɪˈtjuːʃn/', 'n.', '社会公共机构；制度；习俗', 'Marriage is a social institution.', '社会与环境', '婚姻是一种社会制度。', {
            phrases: [
              { en: 'a financial/educational institution', zh: '金融/教育机构' },
              { en: 'the institution of marriage', zh: '婚姻制度' },
            ],
            
            extraExamples: [
              { en: 'A bank is a financial institution.', zh: '银行是金融机构。' },
              { en: 'The family is the oldest social institution.', zh: '家庭是最古老的社会制度。' },
            ]
          }),
          w('x1u1-51', 'consequence', '/ˈkɒnsɪkwəns/', 'n.', '结果；后果', 'He must face the consequences.', '认知与学术', '他必须承担后果。', {
            phrases: [
              { en: 'face the consequences', zh: '承担后果' },
              { en: 'as a consequence', zh: '因此' },
            ],
            
            extraExamples: [
              { en: 'He must take the consequences.', zh: '他必须承担后果。' },
              { en: 'As a consequence, he lost his job.', zh: '结果他丢了工作。' },
            ]
          }),
          w('x1u1-52', 'encounter', '/ɪnˈkaʊntə(r)/', 'vt.', '偶然碰到；遇到 n. 邂逅；遭遇', 'I met an old friend on the street.', '行为与动作', '我在街上遇到了老朋友。', {
            phrases: [
              { en: 'encounter difficulties/problems', zh: '遇到困难/问题' },
              { en: 'a chance encounter', zh: '偶遇' },
            ],
            
            extraExamples: [
              { en: 'I encountered an old friend today.', zh: '我今天偶遇一位老朋友。' },
              { en: 'She encountered many difficulties.', zh: '她遇到很多困难。' },
            ]
          }),
          w('x1u1-53', 'professor', '/prəˈfesə(r)/', 'n.', '教授', 'The professor taught us physics.', '社会与环境', '教授教我们物理。', {
            phrases: [
              { en: 'a professor of...', zh: '……教授' },
              { en: 'associate/assistant professor', zh: '副/助理教授' },
            ],
            
            extraExamples: [
              { en: 'She is a professor of law.', zh: '她是法学教授。' },
              { en: 'The professor arrived late.', zh: '教授来晚了。' },
            ]
          }),
          w('x1u1-54', 'mourn', '/mɔːn/', 'v.', '哀悼；忧伤', 'They mourned their dead leader.', '情感与性格', '他们哀悼已故的领袖。', {
            phrases: [
              { en: 'mourn for/over sb.', zh: '哀悼某人' },
              { en: 'mourn the loss of...', zh: '为失去……而哀伤' },
            ],
            
            extraExamples: [
              { en: 'The whole nation mourned her death.', zh: '全国哀悼她的逝世。' },
              { en: 'She mourned her lost youth.', zh: '她为逝去的青春哀伤。' },
            ]
          }),
          w('x1u1-55', 'remarkable', '/rɪˈmɑːkəbl/', 'adj.', '非凡的；显著的', 'She made remarkable progress.', '品质与状态', '她取得了显著进步。', {
            phrases: [
              { en: 'a remarkable achievement', zh: '非凡成就' },
              { en: 'be remarkable for...', zh: '因……而引人注目' },
            ],
            
            extraExamples: [
              { en: 'She made remarkable progress.', zh: '她取得了显著进步。' },
              { en: 'The view is remarkable.', zh: '景色非凡。' },
            ]
          }),
          w('x1u1-56', 'device', '/dɪˈvaɪs/', 'n.', '方法；技巧；装置；仪器', 'The device measures temperature.', '社会与环境', '这个装置测量温度。', {
            phrases: [
              { en: 'an electronic device', zh: '电子设备' },
              { en: 'a device for doing sth.', zh: '做某事的装置' },
            ],
            
            extraExamples: [
              { en: 'The device is easy to use.', zh: '这个装置很好用。' },
              { en: 'Turn off all electronic devices.', zh: '关掉所有电子设备。' },
            ]
          }),
          w('x1u1-57', 'sum', '/sʌm/', 'v.', '总结；概括 n. 金额；总数；总和', 'Please sum up the main points.', '行为与动作', '请总结要点。', {
            phrases: [
              { en: 'sum up', zh: '总结' },
              { en: 'a large sum of money', zh: '一大笔钱' },
            ],
            
            extraExamples: [
              { en: 'Let me sum up.', zh: '我来总结一下。' },
              { en: 'He paid a large sum for the car.', zh: '他花大价钱买了这辆车。' },
            ]
          }),
          w('x1u1-58', 'draft', '/drɑːft/', 'n.', '草稿；草案 vt. 起草；草拟', 'He wrote a first draft.', '认知与学术', '他写了初稿。', {
            phrases: [
              { en: 'a rough/first draft', zh: '初稿/草稿' },
              { en: 'draft a letter/plan', zh: '起草信件/计划' },
            ],
            
            extraExamples: [
              { en: 'She’s revising her first draft.', zh: '她在修改初稿。' },
              { en: 'He drafted a letter to the editor.', zh: '他给编辑写了封信草稿。' },
            ]
          }),
        ],
      },
      {
        id: 'senior-xb1-u2',
        title: 'Unit 2 · Looking into the Future',
        words: [
          w('x1u2-1', 'phrase', '/freɪz/', 'n.', '短语；词组', 'Learn the new phrases.', '认知与学术', '学习新短语。', {
            phrases: [{ en: 'a set phrase', zh: '固定短语' }, { en: 'phrase book', zh: '常用语手册' }],
            
            extraExamples: [
              { en: 'What does this phrase mean?', zh: '这个短语是什么意思？' },
              { en: 'He used a nice phrase in his speech.', zh: '他演讲中用了个好词。' },
            ],
          }),
          w('x1u2-2', 'persuade', '/pəˈsweɪd/', 'vt.', '劝说；说服', 'She persuaded me to go.', '行为与动作', '她说服我去。', {
            phrases: [{ en: 'persuade sb. to do sth.', zh: '说服某人做某事' }, { en: 'persuade sb. of sth.', zh: '使某人相信某事' }],
            
            extraExamples: [
              { en: 'I persuaded him to join us.', zh: '我说服他加入我们。' },
              { en: 'She is good at persuading people.', zh: '她很会说服人。' },
            ],
          }),
          w('x1u2-3', 'switch', '/swɪtʃ/', 'v.', '转换；交换；（使）改变 n. 开关；转换器', 'Switch off the light.', '行为与动作', '关灯。', {
            phrases: [{ en: 'switch on/off', zh: '打开/关掉' }, { en: 'switch to...', zh: '切换到……' }],
            
            extraExamples: [
              { en: 'Switch off your phone in class.', zh: '上课关掉手机。' },
              { en: 'He switched jobs last year.', zh: '他去年换了工作。' },
            ],
          }),
          w('x1u2-4', 'distant', '/ˈdɪstənt/', 'adj.', '遥远的；远处的；疏远的', 'The town is distant.', '品质与状态', '小镇很遥远。', {
            phrases: [{ en: 'distant from...', zh: '离……远' }, { en: 'a distant relative', zh: '远亲' }],
            
            extraExamples: [
              { en: 'The airport is 50 miles distant.', zh: '机场在50英里外。' },
              { en: 'She gave him a distant look.', zh: '她冷淡地看了他一眼。' },
            ],
          }),
          w('x1u2-5', 'secure', '/sɪˈkjʊə(r)/', 'adj.', '安全的；安心的；可靠的 vt. 获得；保护', 'The house is secure.', '品质与状态', '房子很安全。', {
            phrases: [{ en: 'secure from/against...', zh: '免受……' }, { en: 'secure a job/contract', zh: '获得工作/合同' }],
            
            extraExamples: [
              { en: 'We feel secure here.', zh: '我们在这里很安心。' },
              { en: 'He secured a place at university.', zh: '他考上了大学。' },
            ],
          }),
          w('x1u2-6', 'knob', '/nɒb/', 'n.', '旋钮；球形把手', 'Turn the knob to the right.', '行为与动作', '向右拧旋钮。', {
            phrases: [{ en: 'turn a knob', zh: '拧旋钮' }, { en: 'door knob', zh: '门把手' }],
            
            extraExamples: [
              { en: 'Turn the knob to adjust volume.', zh: '拧旋钮调音量。' },
              { en: 'The knob fell off.', zh: '旋钮掉了。' },
            ],
          }),
          w('x1u2-7', 'appliance', '/əˈplaɪəns/', 'n.', '电器；器具', 'Home appliances save time.', '社会与环境', '家用电器节省时间。', {
            phrases: [{ en: 'home/electrical appliances', zh: '家用电器' }, { en: 'kitchen appliance', zh: '厨房电器' }],
            
            extraExamples: [
              { en: 'This store sells appliances.', zh: '这家店卖电器。' },
              { en: 'The appliance comes with a warranty.', zh: '这电器有保修。' },
            ],
          }),
          w('x1u2-8', 'remote', '/rɪˈməʊt/', 'adj.', '远程的；偏远的', 'Remote work is common now.', '社会与环境', '远程办公现在很普遍。', {
            phrases: [{ en: 'remote control', zh: '遥控器' }, { en: 'remote area', zh: '偏远地区' }],
            
            extraExamples: [
              { en: 'He works from home remotely.', zh: '他远程在家办公。' },
              { en: 'The village is remote.', zh: '村子很偏远。' },
            ],
          }),
          w('x1u2-9', 'air conditioner', '/eə kənˈdɪʃənə(r)/', 'n.', '空调机；空调设备', 'Turn on the air conditioner.', '社会与环境', '开空调。', {
            phrases: [{ en: 'turn on/off the air conditioner', zh: '开/关空调' }, { en: 'central air conditioning', zh: '中央空调' }],
            
            extraExamples: [
              { en: 'The air conditioner is broken.', zh: '空调坏了。' },
              { en: 'It is hot—turn on the AC.', zh: '好热——开空调。' },
            ],
          }),
          w('x1u2-10', 'automatic', '/ˌɔːtəˈmætɪk/', 'adj.', '自动的', 'The doors are automatic.', '品质与状态', '门是自动的。', {
            phrases: [{ en: 'automatic door/weapon', zh: '自动门/自动武器' }, { en: 'fully automatic', zh: '全自动' }],
            
            extraExamples: [
              { en: 'The system has an automatic backup.', zh: '系统有自动备份。' },
              { en: 'This is an automatic transmission car.', zh: '这是自动挡车。' },
            ],
          }),
          w('x1u2-11', 'integrated', '/ˈɪntɪɡreɪtɪd/', 'adj.', '各部分密切协调的；综合的', 'It is an integrated system.', '认知与学术', '这是一个综合系统。', {
            phrases: [{ en: 'integrated circuit', zh: '集成电路' }, { en: 'an integrated approach', zh: '综合方法' }],
            
            extraExamples: [
              { en: 'We need an integrated plan.', zh: '我们需要一个综合计划。' },
              { en: 'The two systems are integrated.', zh: '两个系统已整合。' },
            ],
          }),
          w('x1u2-12', 'sensor', '/ˈsensə(r)/', 'n.', '传感器；敏感元件', 'The sensor detects movement.', '社会与环境', '传感器检测移动。', {
            phrases: [{ en: 'a heat/motion sensor', zh: '热/运动传感器' }, { en: 'sensor technology', zh: '传感器技术' }],
            
            extraExamples: [
              { en: 'The sensor triggers the alarm.', zh: '传感器触发警报。' },
              { en: 'Smoke sensors save lives.', zh: '烟雾传感器救命。' },
            ],
          }),
          w('x1u2-13', 'efficient', '/ɪˈfɪʃnt/', 'adj.', '效率高的；有功效的', 'The new engine is efficient.', '品质与状态', '新发动机效率高。', {
            phrases: [{ en: 'energy-efficient', zh: '节能的' }, { en: 'an efficient worker', zh: '高效率的工人' }],
            
            extraExamples: [
              { en: 'We need a more efficient way.', zh: '我们需要更高效的方法。' },
              { en: 'The new printer is fast and efficient.', zh: '新打印机又快又高效。' },
            ],
          }),
          w('x1u2-14', 'mode', '/məʊd/', 'n.', '模式；方式；风格', 'Change the mode to economy.', '认知与学术', '切换到经济模式。', {
            phrases: [{ en: 'in mode', zh: '处于……模式' }, { en: 'economy/sleep mode', zh: '经济/睡眠模式' }],
            
            extraExamples: [
              { en: 'Switch to manual mode.', zh: '切到手动模式。' },
              { en: 'The phone is in silent mode.', zh: '手机在静音模式。' },
            ],
          }),
          w('x1u2-15', 'routine', '/ruːˈtiːn/', 'n.', '常规；正常顺序 adj. 常规的；日常的', 'Make it a daily routine.', '行为与动作', '把它变成日常习惯。', {
            phrases: [{ en: 'daily routine', zh: '日常惯例' }, { en: 'a routine check', zh: '常规检查' }],
            
            extraExamples: [
              { en: 'Exercise is part of my routine.', zh: '锻炼是我的日常。' },
              { en: 'It was just a routine meeting.', zh: '只是个例行会议。' },
            ],
          }),
          w('x1u2-16', 'preference', '/ˈprefrəns/', 'n.', '爱好；偏爱', 'What is your preference?', '情感与性格', '你更喜欢哪个？', {
            phrases: [{ en: 'have a preference for...', zh: '偏爱……' }, { en: 'in preference to...', zh: '而不是……' }],
            
            extraExamples: [
              { en: 'My preference is tea over coffee.', zh: '我更喜欢茶而不是咖啡。' },
              { en: 'Customers can state their preferences.', zh: '顾客可以说明偏好。' },
            ],
          }),
          w('x1u2-17', 'instant', '/ˈɪnstənt/', 'n.', '瞬间；片刻 adj. 立即的；速食的；速溶的', 'The machine gives instant results.', '认知与学术', '机器立即出结果。', {
            phrases: [{ en: 'in an instant', zh: '立刻' }, { en: 'instant coffee/noodles', zh: '速溶咖啡/方便面' }],
            
            extraExamples: [
              { en: 'I recognized him in an instant.', zh: '我一眼就认出他。' },
              { en: 'The medicine gave instant relief.', zh: '药立刻见效。' },
            ],
          }),
          w('x1u2-18', 'command', '/kəˈmɑːnd/', 'n.', '指令；命令；控制 v. 命令；控制', 'Obey the command.', '行为与动作', '服从命令。', {
            phrases: [{ en: 'obey/issue a command', zh: '服从/发出命令' }, { en: 'in command of...', zh: '指挥……' }],
            
            extraExamples: [
              { en: 'The officer commanded silence.', zh: '军官命令安静。' },
              { en: 'He has 500 men under his command.', zh: '他指挥500人。' },
            ],
          }),
          w('x1u2-19', 'obey', '/əˈbeɪ/', 'v.', '服从；遵守', 'Soldiers must obey orders.', '行为与动作', '士兵必须服从命令。', {
            phrases: [{ en: 'obey orders/rules', zh: '服从命令/遵守规则' }, { en: 'obey the law', zh: '守法' }],
            
            extraExamples: [
              { en: 'Everyone must obey the law.', zh: '人人必须守法。' },
              { en: 'The dog obeys well.', zh: '这狗很听话。' },
            ],
          }),
          w('x1u2-20', 'warning', '/ˈwɔːnɪŋ/', 'n.', '警告；警示；先兆', 'The warning light is on.', '社会与环境', '警示灯亮了。', {
            phrases: [{ en: 'a warning about/of...', zh: '关于……的警告' }, { en: 'issue a warning', zh: '发出警告' }],
            
            extraExamples: [
              { en: 'He ignored the warning.', zh: '他无视警告。' },
              { en: 'The storm warning was issued.', zh: '发布了风暴预警。' },
            ],
          }),
          w('x1u2-21', 'constant', '/ˈkɒnstənt/', 'adj.', '不断的；重复的；不变的 n. 常数；常量', 'There is constant noise.', '品质与状态', '噪音不断。', {
            phrases: [{ en: 'constant change', zh: '不断变化' }, { en: 'at a constant speed', zh: '以恒定速度' }],
            
            extraExamples: [
              { en: 'The pain is constant.', zh: '疼痛一直持续。' },
              { en: 'She is constantly late.', zh: '她总迟到。' },
            ],
          }),
          w('x1u2-22', 'abnormal', '/æbˈnɔːml/', 'adj.', '不正常的；反常的', 'The weather is abnormal this year.', '品质与状态', '今年天气反常。', {
            phrases: [{ en: 'abnormal behavior/weather', zh: '反常行为/天气' }, { en: 'abnormal results', zh: '异常结果' }],
            
            extraExamples: [
              { en: 'His temperature is abnormal.', zh: '他体温不正常。' },
              { en: 'The test showed abnormal results.', zh: '检查结果异常。' },
            ],
          }),
          w('x1u2-23', 'critical', '/ˈkrɪtɪkl/', 'adj.', '严重的；关键的；批判性的', 'This is a critical moment.', '认知与学术', '这是关键时刻。', {
            phrases: [{ en: 'be critical to...', zh: '对……至关重要' }, { en: 'critical thinking', zh: '批判性思维' }],
            
            extraExamples: [
              { en: 'The patient is in critical condition.', zh: '病人情况危急。' },
              { en: 'We need critical analysis.', zh: '我们需要批判性分析。' },
            ],
          }),
          w('x1u2-24', 'cancer', '/ˈkænsə(r)/', 'n.', '癌；癌症；毒瘤', 'Smoking causes cancer.', '社会与环境', '吸烟致癌。', {
            phrases: [{ en: 'lung/breast cancer', zh: '肺/乳腺癌' }, { en: 'cancer research', zh: '癌症研究' }],
            
            extraExamples: [
              { en: 'He was diagnosed with cancer.', zh: '他被诊断出癌症。' },
              { en: 'Early cancer is treatable.', zh: '早期癌症可治。' },
            ],
          }),
          w('x1u2-25', 'potential', '/pəˈtenʃl/', 'adj.', '可能的；潜在的 n. 潜力；可能性', 'She has great potential.', '认知与学术', '她很有潜力。', {
            phrases: [{ en: 'potential danger/risk', zh: '潜在危险/风险' }, { en: 'have potential', zh: '有潜力' }],
            
            extraExamples: [
              { en: 'The potential benefits are huge.', zh: '潜在收益巨大。' },
              { en: 'He showed great potential.', zh: '他展现出巨大潜力。' },
            ],
          }),
          w('x1u2-26', 'leak', '/liːk/', 'v.', '漏；渗漏；透露 n. 漏洞；裂缝', 'The roof leaks.', '行为与动作', '屋顶漏了。', {
            phrases: [{ en: 'leak out', zh: '泄露' }, { en: 'a gas/water leak', zh: '煤气/漏水' }],
            
            extraExamples: [
              { en: 'The news leaked out.', zh: '消息泄露了。' },
              { en: 'There is a leak in the pipe.', zh: '管子上有个洞。' },
            ],
          }),
          w('x1u2-27', 'electrical', '/ɪˈlektrɪkl/', 'adj.', '电的；用电的', 'There is an electrical problem.', '社会与环境', '有电路问题。', {
            phrases: [{ en: 'electrical equipment/failure', zh: '电气设备/电路故障' }, { en: 'an electrical engineer', zh: '电气工程师' }],
            
            extraExamples: [
              { en: 'The electrical system is old.', zh: '电路系统老化。' },
              { en: 'Call an electrical engineer.', zh: '叫个电气工程师来。' },
            ],
          }),
          w('x1u2-28', 'wiring', '/ˈwaɪərɪŋ/', 'n.', '电线线路；线路系统', 'The wiring is old.', '社会与环境', '线路老化了。', {
            phrases: [{ en: 'old/faulty wiring', zh: '老化/故障线路' }, { en: 'wiring diagram', zh: '线路图' }],
            
            extraExamples: [
              { en: 'The wiring needs replacing.', zh: '线路需要更换。' },
              { en: 'Faulty wiring caused the fire.', zh: '线路故障引发火灾。' },
            ],
          }),
          w('x1u2-29', 'detect', '/dɪˈtekt/', 'vt.', '发现；查明', 'The smoke detector works.', '行为与动作', '烟雾探测器工作正常。', {
            phrases: [{ en: 'detect a problem/change', zh: '发现问题/变化' }, { en: 'detect a fault', zh: '查明故障' }],
            
            extraExamples: [
              { en: 'The test can detect cancer early.', zh: '这项检查能早期发现癌症。' },
              { en: 'They detected a gas leak.', zh: '他们发现煤气泄漏。' },
            ],
          }),
          w('x1u2-30', 'relevant', '/ˈreləvənt/', 'adj.', '有关的；有意义的', 'Is this relevant?', '认知与学术', '这有关吗？', {
            phrases: [{ en: 'relevant to...', zh: '与……相关' }, { en: 'relevant information', zh: '相关信息' }],
            
            extraExamples: [
              { en: 'This is not relevant to our discussion.', zh: '这和我们的讨论无关。' },
              { en: 'Please provide relevant documents.', zh: '请提供相关文件。' },
            ],
          }),
          w('x1u2-31', 'fantasy', '/ˈfæntəsi/', 'n.', '幻想；想象', 'Live in your fantasy.', '情感与性格', '活在幻想里。', {
            phrases: [{ en: 'a fantasy world', zh: '幻想世界' }, { en: 'live in a fantasy', zh: '活在幻想中' }],
            
            extraExamples: [
              { en: 'Stop living in a fantasy.', zh: '别再做白日梦了。' },
              { en: 'The book is a fantasy novel.', zh: '这本书是奇幻小说。' },
            ],
          }),
          w('x1u2-32', 'innovation', '/ˌɪnəˈveɪʃn/', 'n.', '创新；创造', 'Innovation drives progress.', '认知与学术', '创新推动进步。', {
            phrases: [{ en: 'technological innovation', zh: '技术创新' }, { en: 'an innovation in...', zh: '……方面的创新' }],
            
            extraExamples: [
              { en: 'The company is known for innovation.', zh: '这家公司以创新闻名。' },
              { en: 'Innovation is key to growth.', zh: '创新是增长的关键。' },
            ],
          }),
          w('x1u2-33', 'available', '/əˈveɪləbl/', 'adj.', '可获得的；可购得的；（人）有空的', 'Tickets are available online.', '社会与环境', '票可在线购买。', {
            phrases: [{ en: 'available for...', zh: '可用于……' }, { en: 'freely available', zh: '免费获取' }],
            
            extraExamples: [
              { en: 'Is this book available?', zh: '这本书有货吗？' },
              { en: 'I am available tomorrow.', zh: '我明天有空。' },
            ],
          }),
          w('x1u2-34', 'nevertheless', '/ˌnevəðəˈles/', 'adv.', '尽管如此；不过；然而', 'Nevertheless, he continued.', '认知与学术', '尽管如此，他继续了。', {
            phrases: [{ en: 'nevertheless, ...', zh: '尽管如此，……' }, { en: 'but nevertheless', zh: '但尽管如此' }],
            
            extraExamples: [
              { en: 'It was cold; nevertheless, we went out.', zh: '天很冷，尽管如此我们还是出门了。' },
              { en: 'The news was bad. Nevertheless, he stayed calm.', zh: '消息很糟，但他保持冷静。' },
            ],
          }),
          w('x1u2-35', 'structure', '/ˈstrʌktʃə(r)/', 'n.', '结构；体系 vt. 系统安排；精心组织', 'The structure is clear.', '认知与学术', '结构很清楚。', {
            phrases: [{ en: 'the structure of...', zh: '……的结构' }, { en: 'a sentence structure', zh: '句子结构' }],
            
            extraExamples: [
              { en: 'The company has a flat structure.', zh: '公司结构扁平。' },
              { en: 'Structure your essay well.', zh: '把文章结构组织好。' },
            ],
          }),
          w('x1u2-36', 'security', '/sɪˈkjʊərəti/', 'n.', '保护措施；安全工作', 'Security is important.', '社会与环境', '安全很重要。', {
            phrases: [{ en: 'national/security', zh: '国家安全' }, { en: 'security check', zh: '安检' }],
            
            extraExamples: [
              { en: 'Airport security is strict.', zh: '机场安检很严。' },
              { en: 'We need better security.', zh: '我们需要更好的安保。' },
            ],
          }),
          w('x1u2-37', 'crime', '/kraɪm/', 'n.', '犯罪活动；不法行为', 'Crime is a serious problem.', '社会与环境', '犯罪是严重问题。', {
            phrases: [{ en: 'commit a crime', zh: '犯罪' }, { en: 'fight crime', zh: '打击犯罪' }],
            
            extraExamples: [
              { en: 'Crime rates have fallen.', zh: '犯罪率下降了。' },
              { en: 'He was accused of a crime.', zh: '他被指控犯罪。' },
            ],
          }),
          w('x1u2-38', 'combine', '/kəmˈbaɪn/', 'v.', '（使）结合；混合', 'Combine the ingredients.', '行为与动作', '把原料混合。', {
            phrases: [{ en: 'combine A with B', zh: '把A和B结合' }, { en: 'combine to do sth.', zh: '联合做某事' }],
            
            extraExamples: [
              { en: 'Combine the eggs and flour.', zh: '把鸡蛋和面粉和在一起。' },
              { en: 'The two businesses combined forces.', zh: '两家公司联合了。' },
            ],
          }),
          w('x1u2-39', 'artificial', '/ˌɑːtɪˈfɪʃl/', 'adj.', '人工的；人造的；假的', 'Artificial flowers look real.', '品质与状态', '假花看起来真。', {
            phrases: [{ en: 'artificial intelligence (AI)', zh: '人工智能' }, { en: 'artificial light/limb', zh: '人造光/假肢' }],
            
            extraExamples: [
              { en: 'Artificial intelligence is changing the world.', zh: '人工智能正在改变世界。' },
              { en: 'She gave an artificial smile.', zh: '她假笑了一下。' },
            ],
          }),
          w('x1u2-40', 'clone', '/kləʊn/', 'vt.', '克隆；以无性繁殖技术复制 n. 克隆动物', 'Scientists cloned a sheep.', '行为与动作', '科学家克隆了一只羊。', {
            phrases: [{ en: 'clone an animal', zh: '克隆动物' }, { en: 'a clone of...', zh: '……的复制品' }],
            
            extraExamples: [
              { en: 'The first cloned sheep was Dolly.', zh: '第一只克隆羊叫多利。' },
              { en: 'He is a clone of his father.', zh: '他和他爸一模一样。' },
            ],
          }),
          w('x1u2-41', 'predict', '/prɪˈdɪkt/', 'vt.', '预测；预言；预料', 'No one can predict the future.', '行为与动作', '没人能预测未来。', {
            phrases: [{ en: 'predict the future/outcome', zh: '预测未来/结果' }, { en: 'it is predicted that...', zh: '据预测……' }],
            
            extraExamples: [
              { en: 'It is hard to predict the weather.', zh: '天气很难预测。' },
              { en: 'The results were better than predicted.', zh: '结果比预测的好。' },
            ],
          }),
          w('x1u2-42', 'forecast', '/ˈfɔːkɑːst/', 'v./n.', '预测；预报', 'The weather forecast says rain.', '认知与学术', '天气预报说有雨。', {
            phrases: [{ en: 'weather forecast', zh: '天气预报' }, { en: 'sales forecast', zh: '销售预测' }],
            
            extraExamples: [
              { en: 'The forecast predicts sunshine.', zh: '预报说晴。' },
              { en: 'They forecast a 10% growth.', zh: '他们预测增长10%。' },
            ],
          }),
          w('x1u2-43', 'occupation', '/ˌɒkjuˈpeɪʃn/', 'n.', '职业；占领', 'Please state your occupation.', '社会与环境', '请说明你的职业。', {
            phrases: [{ en: 'take up an occupation', zh: '就职' }, { en: 'military occupation', zh: '军事占领' }],
            
            extraExamples: [
              { en: 'Please fill in your occupation.', zh: '请填写职业。' },
              { en: 'Please state your name, age and occupation.', zh: '请说明姓名、年龄和职业。' },
            ],
          }),
          w('x1u2-44', 'oppose', '/əˈpəʊz/', 'vt.', '反对；抵制；阻挠', 'Many people opposed the plan.', '行为与动作', '很多人反对这个计划。', {
            phrases: [{ en: 'oppose a plan/view', zh: '反对计划/观点' }, { en: 'as opposed to...', zh: '与……相对' }],
            
            extraExamples: [
              { en: 'Many locals opposed the new road.', zh: '很多当地人反对修新路。' },
              { en: 'I am opposed to the idea.', zh: '我反对这个想法。' },
            ],
          }),
          w('x1u2-45', 'hence', '/hens/', 'adv.', '因此；由此', 'He was ill, hence the absence.', '认知与学术', '他病了，所以缺席。', {
            phrases: [{ en: 'hence the reason', zh: '这就是原因' }, { en: 'hence the name', zh: '因此得名' }],
            
            extraExamples: [
              { en: 'He was tired, hence he went to bed early.', zh: '他累了，所以早睡了。' },
              { en: 'The town is built on a hill, hence its name.', zh: '小镇在山上，因此得名。' },
            ],
          }),
          w('x1u2-46', 'cease', '/siːs/', 'v.', '（使）停止；终止', 'The noise ceased.', '行为与动作', '噪音停了。', {
            phrases: [{ en: 'cease fire', zh: '停火' }, { en: 'without cease', zh: '不停地' }],
            
            extraExamples: [
              { en: 'The company ceased trading.', zh: '公司停业了。' },
              { en: 'He never ceases to surprise me.', zh: '他总能让我惊喜。' },
            ],
          }),
          w('x1u2-47', 'absence', '/ˈæbsəns/', 'n.', '不存在；缺乏；缺席', 'His absence was noticed.', '品质与状态', '他的缺席被注意到了。', {
            phrases: [{ en: 'absence from...', zh: '缺席……' }, { en: 'in the absence of...', zh: '在缺乏……的情况下' }],
            
            extraExamples: [
              { en: 'His absence was felt by everyone.', zh: '大家都感到他不在。' },
              { en: 'In the absence of evidence, he was freed.', zh: '因证据不足他被释放。' },
            ],
          }),
          w('x1u2-48', 'rural', '/ˈrʊərəl/', 'adj.', '乡村的；农村的', 'Rural life is peaceful.', '社会与环境', '乡村生活很宁静。', {
            phrases: [{ en: 'rural areas/life', zh: '农村地区/生活' }, { en: 'rural development', zh: '农村发展' }],
            
            extraExamples: [
              { en: 'He comes from a rural area.', zh: '他来自农村。' },
              { en: 'Rural schools need more funding.', zh: '农村学校需要更多资金。' },
            ],
          }),
          w('x1u2-49', 'advocate', '/ˈædvəkeɪt/', 'v.', '提倡；支持；拥护 n. 提倡者；支持者', 'He advocates healthy eating.', '行为与动作', '他提倡健康饮食。', {
            phrases: [{ en: 'advocate doing sth.', zh: '提倡做某事' }, { en: 'an advocate for/of...', zh: '……的支持者' }],
            
            extraExamples: [
              { en: 'Many doctors advocate exercise.', zh: '很多医生提倡锻炼。' },
              { en: 'She is a advocate for human rights.', zh: '她是人权倡导者。' },
            ],
          }),
          w('x1u2-50', 'emphasis', '/ˈemfəsɪs/', 'n.', '强调；重视；重要性', 'The school puts emphasis on reading.', '认知与学术', '学校重视阅读。', {
            phrases: [{ en: 'put/lay emphasis on...', zh: '强调……' }, { en: 'with emphasis', zh: '强调地' }],
            
            extraExamples: [
              { en: 'The emphasis is on quality.', zh: '重点在质量。' },
              { en: 'He spoke with emphasis.', zh: '他加重语气说。' },
            ],
          }),
          w('x1u2-51', 'luxury', '/ˈlʌkʃəri/', 'n.', '奢华；奢侈品', 'They live in luxury.', '社会与环境', '他们生活奢华。', {
            phrases: [{ en: 'a luxury hotel/car', zh: '豪华酒店/豪车' }, { en: 'live in luxury', zh: '生活奢华' }],
            
            extraExamples: [
              { en: 'Time alone is a luxury.', zh: '独处是一种奢侈。' },
              { en: 'They stayed at a luxury hotel.', zh: '他们住了豪华酒店。' },
            ],
          }),
          w('x1u2-52', 'prospect', '/ˈprɒspekt/', 'n.', '可能性；前景', 'The prospect is exciting.', '认知与学术', '前景令人兴奋。', {
            phrases: [{ en: 'prospects for...', zh: '……的前景' }, { en: 'in prospect', zh: '展望中' }],
            
            extraExamples: [
              { en: 'Job prospects are good.', zh: '就业前景不错。' },
              { en: 'The prospect of failure scared him.', zh: '可能失败让他害怕。' },
            ],
          }),
          w('x1u2-53', 'resist', '/rɪˈzɪst/', 'v.', '抵制；反抗；抵挡', 'I couldn’t resist the cake.', '行为与动作', '我忍不住吃了蛋糕。', {
            phrases: [{ en: 'resist doing sth.', zh: '忍住不做某事' }, { en: 'can’t resist...', zh: '忍不住……' }],
            
            extraExamples: [
              { en: 'I couldn’t resist laughing.', zh: '我忍不住笑了。' },
              { en: 'The door resisted my push.', zh: '门推不动。' },
            ],
          }),
          w('x1u2-54', 'resistance', '/rɪˈzɪstəns/', 'n.', '抵制；反对；抗拒', 'There was strong resistance.', '社会与环境', '遭到强烈抵制。', {
            phrases: [{ en: 'resistance to...', zh: '对……的抵制' }, { en: 'meet with resistance', zh: '遇到阻力' }],
            
            extraExamples: [
              { en: 'The plan met with strong resistance.', zh: '计划遭到强烈抵制。' },
              { en: 'There is high resistance to change.', zh: '对变革阻力很大。' },
            ],
          }),
          w('x1u2-55', 'paragraph', '/ˈpærəɡrɑːf/', 'n.', '段；段落', 'Read the next paragraph.', '认知与学术', '读下一段。', {
            phrases: [{ en: 'the opening paragraph', zh: '开头段' }, { en: 'a paragraph on...', zh: '关于……的一段' }],
            
            extraExamples: [
              { en: 'Read paragraph 3.', zh: '读第三段。' },
              { en: 'Each paragraph deals with one idea.', zh: '每段讲一个意思。' },
            ],
          }),
          w('x1u2-56', 'essay', '/ˈeseɪ/', 'n.', '文章；散文', 'Write an essay on pollution.', '认知与学术', '写一篇关于污染的文章。', {
            phrases: [{ en: 'write an essay', zh: '写文章' }, { en: 'a argumentative essay', zh: '议论文' }],
            
            extraExamples: [
              { en: 'She wrote an essay on climate change.', zh: '她写了篇关于气候变化的文章。' },
              { en: 'The essay is due Friday.', zh: '文章周五交。' },
            ],
          }),
          w('x1u2-57', 'accurate', '/ˈækjərət/', 'adj.', '精确的；准确的', 'The clock is accurate.', '品质与状态', '钟很准。', {
            phrases: [{ en: 'accurate information/data', zh: '准确信息/数据' }, { en: 'be accurate in...', zh: '在……方面准确' }],
            
            extraExamples: [
              { en: 'The report is not entirely accurate.', zh: '报告不完全准确。' },
              { en: 'Give me an accurate number.', zh: '给我个准确数字。' },
            ],
          }),
          w('x1u2-58', 'librarian', '/laɪˈbreəriən/', 'n.', '图书管理员；图书馆馆长', 'The librarian helped me.', '社会与环境', '图书管理员帮了我。', {
            phrases: [{ en: 'a chief librarian', zh: '图书馆馆长' }, { en: 'ask the librarian', zh: '问图书管理员' }],
            
            extraExamples: [
              { en: 'The librarian found the book for me.', zh: '图书管理员帮我找到了书。' },
              { en: 'She works as a librarian.', zh: '她做图书管理员。' },
            ],
          }),
        ],
      },
      {
        id: 'senior-xb1-u3',
        title: 'Unit 3 · Fascinating Parks',
        words: [
          w('x1u3-1', 'buffet', '/ˈbʊfeɪ/', 'n.', '自助餐 v. 连续猛击', 'We ate at the buffet.', '社会与环境', '我们吃了自助餐。', {
            phrases: [{ en: 'a buffet lunch/dinner', zh: '自助午餐/晚餐' }, { en: 'breakfast buffet', zh: '自助早餐' }],
            
            extraExamples: [
              { en: 'The hotel offers a free buffet.', zh: '酒店提供免费自助餐。' },
              { en: 'The wind buffeted the boat.', zh: '狂风猛击小船。' },
            ],
          }),
          w('x1u3-2', 'cloth', '/klɒθ/', 'n.', '（一块）布；织物；布料', 'She wiped the table with a cloth.', '社会与环境', '她用布擦桌子。', {
            phrases: [{ en: 'a piece of cloth', zh: '一块布' }, { en: 'table cloth', zh: '桌布' }],
            
            extraExamples: [
              { en: 'She cleaned the mirror with a soft cloth.', zh: '她用软布擦镜子。' },
              { en: 'This cloth feels like silk.', zh: '这布料摸起来像丝绸。' },
            ],
          }),
          w('x1u3-3', 'edge', '/edʒ/', 'n.', '边；边缘；边线；刀刃 v. 徐徐移动；加边', 'The park is on the edge of the town.', '社会与环境', '公园在镇边。', {
            phrases: [{ en: 'on the edge of...', zh: '在……边缘' }, { en: 'edge towards...', zh: '慢慢移向……' }],
            
            extraExamples: [
              { en: 'Don’t stand too near the edge.', zh: '别站得太靠边。' },
              { en: 'He edged past the crowd.', zh: '他慢慢挤过人群。' },
            ],
          }),
          w('x1u3-4', 'valley', '/ˈvæli/', 'n.', '谷；山谷；溪谷', 'The valley is beautiful.', '社会与环境', '山谷很美。', {
            phrases: [{ en: 'a river valley', zh: '河谷' }, { en: 'the Yangtze valley', zh: '长江流域' }],
            
            extraExamples: [
              { en: 'A river winds through the valley.', zh: '一条河蜿蜒流过山谷。' },
              { en: 'The valley was covered in mist.', zh: '山谷笼罩在雾中。' },
            ],
          }),
          w('x1u3-5', 'vast', '/vɑːst/', 'adj.', '辽阔的；巨大的；庞大的', 'The vast forest stretches for miles.', '品质与状态', '辽阔的森林绵延数英里。', {
            phrases: [{ en: 'a vast area/extent', zh: '广袤的地区' }, { en: 'vast amounts of...', zh: '大量的……' }],
            
            extraExamples: [
              { en: 'The desert is vast and empty.', zh: '沙漠辽阔空旷。' },
              { en: 'It costs a vast amount of money.', zh: '这要花一大笔钱。' },
            ],
          }),
          w('x1u3-6', 'glacier', '/ˈɡlæsiə(r)/', 'n.', '冰川', 'The glacier is melting.', '社会与环境', '冰川在融化。', {
            phrases: [{ en: 'a melting glacier', zh: '正在融化的冰川' }, { en: 'glacier National Park', zh: '冰川国家公园' }],
            
            extraExamples: [
              { en: 'The glacier has retreated 2 km.', zh: '冰川后退了两公里。' },
              { en: 'We walked on the glacier.', zh: '我们在冰川上行走。' },
            ],
          }),
          w('x1u3-7', 'reindeer', '/ˈreɪndɪə(r)/', 'n.', '驯鹿', 'Reindeer live in the Arctic.', '社会与环境', '驯鹿生活在北极。', {
            phrases: [{ en: 'a herd of reindeer', zh: '一群驯鹿' }, { en: 'reindeer herding', zh: '驯鹿放牧' }],
            
            extraExamples: [
              { en: 'Reindeer pull Santa’s sleigh.', zh: '驯鹿拉圣诞老人的雪橇。' },
              { en: 'The Sami people herd reindeer.', zh: '萨米人放牧驯鹿。' },
            ],
          }),
          w('x1u3-8', 'territory', '/ˈterətri/', 'n.', '领土；版图；领域；地盘', 'The park is protected territory.', '社会与环境', '公园是受保护的领地。', {
            phrases: [{ en: 'protected territory', zh: '受保护领土' }, { en: 'on someone’s territory', zh: '在某人的地盘上' }],
            
            extraExamples: [
              { en: 'The birds defend their territory.', zh: '鸟保卫自己的地盘。' },
              { en: 'This is dangerous territory.', zh: '这是危险地带。' },
            ],
          }),
          w('x1u3-9', 'ban', '/bæn/', 'vt.', '明令禁止；取缔 n. 禁令', 'Smoking is banned in the park.', '行为与动作', '公园内禁止吸烟。', {
            phrases: [{ en: 'ban sb. from doing sth.', zh: '禁止某人做某事' }, { en: 'a ban on...', zh: '对……的禁令' }],
            
            extraExamples: [
              { en: 'The government banned single-use plastics.', zh: '政府禁止一次性塑料。' },
              { en: 'There is a ban on smoking here.', zh: '此处禁止吸烟。' },
            ],
          }),
          w('x1u3-10', 'boundary', '/ˈbaʊndri/', 'n.', '边界；界限；分界线', 'The boundary is marked.', '社会与环境', '边界有标记。', {
            phrases: [{ en: 'cross a boundary', zh: '越过边界' }, { en: 'the boundary between A and B', zh: 'A和B之间的界限' }],
            
            extraExamples: [
              { en: 'The river forms the boundary.', zh: '这条河构成边界。' },
              { en: 'Science pushes back the boundaries.', zh: '科学拓展着疆界。' },
            ],
          }),
          w('x1u3-11', 'cottage', '/ˈkɒtɪdʒ/', 'n.', '小屋；村舍；小别墅', 'They stayed in a cottage.', '社会与环境', '他们住在小屋里。', {
            phrases: [{ en: 'a country cottage', zh: '乡间小屋' }, { en: 'cottage industry', zh: '家庭手工业' }],
            
            extraExamples: [
              { en: 'They rented a cottage by the lake.', zh: '他们租了湖边小屋。' },
              { en: 'The cottage has a beautiful garden.', zh: '小屋有个漂亮的花园。' },
            ],
          }),
          w('x1u3-12', 'visible', '/ˈvɪzəbl/', 'adj.', '看得见的；可见的', 'The mountains are visible.', '品质与状态', '山看得见。', {
            phrases: [{ en: 'visible to the naked eye', zh: '肉眼可见' }, { en: 'clearly visible', zh: '清晰可见' }],
            
            extraExamples: [
              { en: 'The stars are visible tonight.', zh: '今晚能看见星星。' },
              { en: 'There is no visible difference.', zh: '看不出明显差别。' },
            ],
          }),
          w('x1u3-13', 'on the move', '/ɒn ðə muːv/', 'phr.', '在行进中；在移动中', 'The herd is always on the move.', '行为与动作', '兽群一直在移动。', {
            phrases: [{ en: 'be constantly on the move', zh: '一直在奔波' }, { en: 'get a move on', zh: '赶快' }],
            
            extraExamples: [
              { en: 'Sales are on the move.', zh: '销量在上涨。' },
              { en: 'We’ve been on the move all day.', zh: '我们一整天都在赶路。' },
            ],
          }),
          w('x1u3-14', 'accompany', '/əˈkʌmpəni/', 'vt.', '陪同；陪伴；伴随；伴奏', 'She accompanied me to the park.', '行为与动作', '她陪我去公园。', {
            phrases: [{ en: 'accompany sb. to...', zh: '陪某人去……' }, { en: 'accompany sb. on/at the piano', zh: '给某人钢琴伴奏' }],
            
            extraExamples: [
              { en: 'Lightning accompanies thunder.', zh: '闪电伴着雷声。' },
              { en: 'She accompanied the singer on guitar.', zh: '她用吉他为歌手伴奏。' },
            ],
          }),
          w('x1u3-15', 'adopt', '/əˈdɒpt/', 'vt.', '采用；采取；采纳；领养', 'They adopted a new approach.', '行为与动作', '他们采用了新方法。', {
            phrases: [{ en: 'adopt a child', zh: '领养孩子' }, { en: 'adopt an approach/policy', zh: '采取方法/政策' }],
            
            extraExamples: [
              { en: 'They adopted a baby girl.', zh: '他们领养了一个女婴。' },
              { en: 'The committee adopted the plan.', zh: '委员会通过了该计划。' },
            ],
          }),
          w('x1u3-16', 'sour', '/ˈsaʊə(r)/', 'adj.', '酸的；有酸味的', 'The milk has gone sour.', '品质与状态', '牛奶变酸了。', {
            phrases: [{ en: 'go sour', zh: '变酸；出问题' }, { en: 'a sour taste/smell', zh: '酸味/酸臭味' }],
            
            extraExamples: [
              { en: 'The grapes taste sour.', zh: '这葡萄很酸。' },
              { en: 'Their relationship turned sour.', zh: '他们的关系变僵了。' },
            ],
          }),
          w('x1u3-17', 'set out', '/set aʊt/', 'phr.', '出发；启程；开始工作', 'They set out at dawn.', '行为与动作', '他们黎明出发。', {
            phrases: [{ en: 'set out to do sth.', zh: '着手做某事' }, { en: 'set out on a journey', zh: '启程' }],
            
            extraExamples: [
              { en: 'She set out to break the record.', zh: '她着手打破纪录。' },
              { en: 'We set out early to avoid traffic.', zh: '我们早出发避开车流。' },
            ],
          }),
          w('x1u3-18', 'bless', '/bles/', 'vt.', '祝福', 'God bless you.', '情感与性格', '上帝保佑你。', {
            phrases: [{ en: 'God bless you', zh: '上帝保佑你（打喷嚏时说）' }, { en: 'be blessed with...', zh: '有幸享有……' }],
            
            extraExamples: [
              { en: 'She blessed the child.', zh: '她为孩子祝福。' },
              { en: 'He is blessed with good health.', zh: '他有幸身体健康。' },
            ],
          }),
          w('x1u3-19', 'live off', '/lɪv ɒf/', 'phr.', '依靠……生活；以吃……为生', 'They live off the land.', '行为与动作', '他们靠土地为生。', {
            phrases: [{ en: 'live off the land', zh: '靠土地为生' }, { en: 'live off my parents', zh: '靠父母养活' }],
            
            extraExamples: [
              { en: 'You can’t live off your parents forever.', zh: '你不能永远靠父母。' },
              { en: 'The pandas live off bamboo.', zh: '熊猫以竹子为食。' },
            ],
          }),
          w('x1u3-20', 'prohibition', '/ˌprəʊɪˈbɪʃn/', 'n.', '禁止；阻止；禁令', 'The prohibition is strict.', '社会与环境', '禁令很严格。', {
            phrases: [{ en: 'the Prohibition', zh: '（美国）禁酒令时期' }, { en: 'a prohibition on...', zh: '对……的禁令' }],
            
            extraExamples: [
              { en: 'The prohibition was widely ignored.', zh: '禁令被广泛漠视。' },
              { en: 'They protested the prohibition on alcohol.', zh: '他们抗议禁酒令。' },
            ],
          }),
          w('x1u3-21', 'prohibit', '/prəˈhɪbɪt/', 'vt.', '（尤指以法令）禁止；阻止', 'Fishing is prohibited here.', '行为与动作', '此处禁止钓鱼。', {
            phrases: [{ en: 'prohibit sb. from doing sth.', zh: '禁止某人做某事' }, { en: 'strictly prohibited', zh: '严禁' }],
            
            extraExamples: [
              { en: 'Parking is prohibited here.', zh: '此处禁止停车。' },
              { en: 'The law prohibits selling alcohol to minors.', zh: '法律禁止向未成年人售酒。' },
            ],
          }),
          w('x1u3-22', 'journalist', '/ˈdʒɜːnəlɪst/', 'n.', '新闻记者；新闻工作者', 'The journalist wrote about the park.', '社会与环境', '记者写了关于公园的报道。', {
            phrases: [{ en: 'an investigative journalist', zh: '调查记者' }, { en: 'a freelance journalist', zh: '自由记者' }],
            
            extraExamples: [
              { en: 'The journalist asked tough questions.', zh: '记者提了尖锐问题。' },
              { en: 'She works as a journalist for BBC.', zh: '她是BBC记者。' },
            ],
          }),
          w('x1u3-23', 'sneeze', '/sniːz/', 'vi.', '打喷嚏 n. 喷嚏', 'He sneezed loudly.', '行为与动作', '他大声打喷嚏。', {
            phrases: [{ en: 'sneeze at...', zh: '轻视……（口语）' }, { en: 'give a sneeze', zh: '打个喷嚏' }],
            
            extraExamples: [
              { en: 'The pepper made her sneeze.', zh: '胡椒呛得她打喷嚏。' },
              { en: 'Excuse me—I sneezed.', zh: '不好意思，我打喷嚏了。' },
            ],
          }),
          w('x1u3-24', 'teapot', '/ˈtiːpɒt/', 'n.', '茶壶', 'The teapot is old.', '社会与环境', '茶壶很旧。', {
            phrases: [{ en: 'a china teapot', zh: '瓷茶壶' }, { en: 'tea for two teapot', zh: '双人茶壶' }],
            
            extraExamples: [
              { en: 'The teapot whistles when it boils.', zh: '水开时茶壶会响。' },
              { en: 'She poured tea from the teapot.', zh: '她从茶壶倒茶。' },
            ],
          }),
          w('x1u3-25', 'label', '/ˈleɪbl/', 'vt.', '用标签标明；贴标签 n. 标签；标记', 'The label says organic.', '行为与动作', '标签上写着有机。', {
            phrases: [{ en: 'attach a label to...', zh: '给……贴标签' }, { en: 'a clothing label', zh: '服装标签' }],
            
            extraExamples: [
              { en: 'Read the label before use.', zh: '使用前看标签。' },
              { en: 'They labeled the boxes carefully.', zh: '他们仔细给箱子贴标签。' },
            ],
          }),
          w('x1u3-26', 'cream', '/kriːm/', 'n.', '奶油；乳脂；护肤霜 adj. 奶油色的', 'She added cream to the coffee.', '社会与环境', '她在咖啡里加了奶油。', {
            phrases: [{ en: 'hand cream', zh: '护手霜' }, { en: 'cream tea', zh: '奶油茶点' }],
            
            extraExamples: [
              { en: 'Do you take cream in your coffee?', zh: '咖啡里加奶油吗？' },
              { en: 'She put cream on her face.', zh: '她往脸上涂护肤霜。' },
            ],
          }),
          w('x1u3-27', 'leopard', '/ˈlepəd/', 'n.', '豹', 'The leopard ran away.', '社会与环境', '豹子跑了。', {
            phrases: [{ en: 'a snow leopard', zh: '雪豹' }, { en: 'a leopard can’t change its spots', zh: '豹改不了斑点（本性难移）' }],
            
            extraExamples: [
              { en: 'The leopard is a good climber.', zh: '豹很会爬树。' },
              { en: 'Leopards hunt at night.', zh: '豹夜间捕猎。' },
            ],
          }),
          w('x1u3-28', 'stretch', '/stretʃ/', 'v.', '延伸；延续；伸展；舒展', 'The park stretches for miles.', '行为与动作', '公园绵延数英里。', {
            phrases: [{ en: 'stretch out', zh: '伸展；延伸' }, { en: 'stretch one’s legs', zh: '起身活动活动' }],
            
            extraExamples: [
              { en: 'The forest stretches to the horizon.', zh: '森林延伸到天边。' },
              { en: 'Stretch before you run.', zh: '跑步前先拉伸。' },
            ],
          }),
          w('x1u3-29', 'rewarding', '/rɪˈwɔːdɪŋ/', 'adj.', '值得做的；有益的', 'Hiking is rewarding.', '品质与状态', '徒步很有意义。', {
            phrases: [{ en: 'a rewarding experience/job', zh: '有意义的经历/工作' }, { en: 'rewarding work', zh: '有回报的工作' }],
            
            extraExamples: [
              { en: 'Teaching can be very rewarding.', zh: '教书很有成就感。' },
              { en: 'It was a rewarding trip.', zh: '这趟旅行很值。' },
            ],
          }),
          w('x1u3-30', 'bush', '/bʊʃ/', 'n.', '灌木', 'A bird hid in the bush.', '社会与环境', '鸟藏在灌木丛里。', {
            phrases: [{ en: 'beat around the bush', zh: '绕弯子' }, { en: 'a rose bush', zh: '玫瑰丛' }],
            
            extraExamples: [
              { en: 'Don’t beat around the bush.', zh: '别绕弯子，直说吧。' },
              { en: 'A fox ran into the bushes.', zh: '一只狐狸跑进灌木丛。' },
            ],
          }),
          w('x1u3-31', 'lung', '/lʌŋ/', 'n.', '肺', 'Deep breathing is good for your lungs.', '社会与环境', '深呼吸对肺好。', {
            phrases: [{ en: 'lung cancer', zh: '肺癌' }, { en: 'at the top of your lungs', zh: '声嘶力竭地' }],
            
            extraExamples: [
              { en: 'Smoking damages your lungs.', zh: '吸烟伤肺。' },
              { en: 'She shouted at the top of her lungs.', zh: '她扯着嗓子喊。' },
            ],
          }),
          w('x1u3-32', 'cycle', '/ˈsaɪkl/', 'n.', '自行车；循环 v. 骑自行车', 'They cycled around the park.', '行为与动作', '他们骑车逛公园。', {
            phrases: [{ en: 'cycle to work', zh: '骑车上班' }, { en: 'the water cycle', zh: '水循环' }],
            
            extraExamples: [
              { en: 'I cycle to school every day.', zh: '我每天骑车上学。' },
              { en: 'The seasons cycle every year.', zh: '四季每年循环。' },
            ],
          }),
          w('x1u3-33', 'corridor', '/ˈkɒrɪdɔː(r)/', 'n.', '狭长地带；走廊；过道', 'The corridor leads to the garden.', '社会与环境', '走廊通向花园。', {
            phrases: [{ en: 'a long corridor', zh: '长廊' }, { en: 'the corridor of power', zh: '权力走廊' }],
            
            extraExamples: [
              { en: 'His room is at the end of the corridor.', zh: '他房间在走廊尽头。' },
              { en: 'The corridor was dark.', zh: '走廊很黑。' },
            ],
          }),
          w('x1u3-34', 'pedal', '/ˈpedl/', 'n.', '脚镫子；踏板 v. 骑自行车；踩踏板', 'He pedaled up the hill.', '行为与动作', '他骑车爬坡。', {
            phrases: [{ en: 'pedal a bike', zh: '骑自行车' }, { en: 'the brake pedal', zh: '刹车踏板' }],
            
            extraExamples: [
              { en: 'He pedaled hard up the hill.', zh: '他用力蹬车上坡。' },
              { en: 'The pedals fell off the bike.', zh: '自行车脚踏掉了。' },
            ],
          }),
          w('x1u3-35', 'fountain', '/ˈfaʊntən/', 'n.', '喷泉；人工喷泉；喷水池', 'The fountain is beautiful.', '社会与环境', '喷泉很美。', {
            phrases: [{ en: 'a drinking fountain', zh: '饮水处' }, { en: 'fountain of youth', zh: '青春之泉' }],
            
            extraExamples: [
              { en: 'Kids love playing by the fountain.', zh: '孩子爱在喷泉边玩。' },
              { en: 'The fountain shoots water 10m high.', zh: '喷泉喷10米高。' },
            ],
          }),
          w('x1u3-36', 'route', '/ruːt/', 'n.', '路线；路途；途径', 'We took the scenic route.', '认知与学术', '我们走了风景路线。', {
            phrases: [{ en: 'take a different route', zh: '走另一条路' }, { en: 'the main route', zh: '主路线' }],
            
            extraExamples: [
              { en: 'What’s the best route to the airport?', zh: '去机场走哪条路最好？' },
              { en: 'We got lost—this route is closed.', zh: '我们迷路了——这条路封了。' },
            ],
          }),
          w('x1u3-37', 'ahead', '/əˈhed/', 'adv.', '向前；在前面；提前', 'The path ahead is clear.', '认知与学术', '前面的路很清楚。', {
            phrases: [{ en: 'go ahead', zh: '前进；请便' }, { en: 'ahead of time/schedule', zh: '提前' }],
            
            extraExamples: [
              { en: 'The road ahead is closed.', zh: '前方道路封闭。' },
              { en: 'We finished ahead of schedule.', zh: '我们提前完成了。' },
            ],
          }),
          w('x1u3-38', 'theme', '/θiːm/', 'n.', '主题；主题思想 adj. 有特定主题的', 'The theme is nature.', '认知与学术', '主题是自然。', {
            phrases: [{ en: 'the main theme', zh: '主题' }, { en: 'theme music/song', zh: '主题曲' }],
            
            extraExamples: [
              { en: 'The theme of the party is “space”.', zh: '派对主题是"太空"。' },
              { en: 'Love is a common theme in poetry.', zh: '爱情是诗歌常见主题。' },
            ],
          }),
          w('x1u3-39', 'theme park', '/θiːm pɑːk/', 'n.', '主题公园；主题乐园', 'We visited a theme park.', '社会与环境', '我们去了主题公园。', {
            phrases: [{ en: 'a Disney theme park', zh: '迪士尼主题公园' }, { en: 'theme park ticket', zh: '主题公园门票' }],
            
            extraExamples: [
              { en: 'Universal Studios is a famous theme park.', zh: '环球影城是著名主题公园。' },
              { en: 'The theme park opens at 9 am.', zh: '主题公园早9点开门。' },
            ],
          }),
          w('x1u3-40', 'roller coaster', '/ˈrəʊlə ˈkəʊstə(r)/', 'n.', '过山车', 'The roller coaster is thrilling.', '社会与环境', '过山车很刺激。', {
            phrases: [{ en: 'a roller coaster ride', zh: '过山车般的经历' }, { en: 'go on a roller coaster', zh: '坐过山车' }],
            
            extraExamples: [
              { en: 'The roller coaster goes upside down.', zh: '过山车会翻转。' },
              { en: 'Life has been a roller coaster lately.', zh: '最近生活大起大落。' },
            ],
          }),
          w('x1u3-41', 'incredible', '/ɪnˈkredəbl/', 'adj.', '极好的；极大的；难以置信的', 'The view is incredible.', '品质与状态', '景色令人难以置信。', {
            phrases: [{ en: 'incredible story', zh: '难以置信的故事' }, { en: 'incredible speed', zh: '惊人的速度' }],
            
            extraExamples: [
              { en: 'The story sounds incredible.', zh: '这故事听着不可思议。' },
              { en: 'She showed incredible courage.', zh: '她展现出惊人的勇气。' },
            ],
          }),
          w('x1u3-42', 'appeal', '/əˈpiːl/', 'vi.', '有吸引力；呼吁；恳求 n. 吸引力；呼吁', 'The park appeals to children.', '行为与动作', '公园吸引孩子。', {
            phrases: [{ en: 'appeal to sb.', zh: '吸引某人；向某人呼吁' }, { en: 'an appeal for...', zh: '对……的呼吁' }],
            
            extraExamples: [
              { en: 'The design appeals to young people.', zh: '这设计吸引年轻人。' },
              { en: 'They made an appeal for help.', zh: '他们恳求援助。' },
            ],
          }),
          w('x1u3-43', 'pirate', '/ˈpaɪərət/', 'n.', '海盗；盗版者 vt. 盗印；窃用', 'The pirate ship was a ride.', '社会与环境', '海盗船是个游乐设施。', {
            phrases: [{ en: 'a pirate ship', zh: '海盗船' }, { en: 'pirate a DVD', zh: '盗版DVD' }],
            
            extraExamples: [
              { en: 'The pirates buried their treasure.', zh: '海盗埋了宝藏。' },
              { en: 'The software was pirated.', zh: '这软件是盗版。' },
            ],
          }),
          w('x1u3-44', 'adorable', '/əˈdɔːrəbl/', 'adj.', '可爱的；讨人喜爱的', 'The panda is adorable.', '情感与性格', '熊猫很可爱。', {
            phrases: [{ en: 'an adorable child/puppy', zh: '可爱的孩子/小狗' }, { en: 'absolutely adorable', zh: '超级可爱' }],
            
            extraExamples: [
              { en: 'What an adorable baby!', zh: '多可爱的宝宝！' },
              { en: 'The kitten looks adorable.', zh: '这小猫太萌了。' },
            ],
          }),
          w('x1u3-45', 'wander', '/ˈwɒndə(r)/', 'v.', '游荡；闲逛；流浪；走神', 'We wandered around the park.', '行为与动作', '我们在公园闲逛。', {
            phrases: [{ en: 'wander around/through...', zh: '在……闲逛' }, { en: 'wander off', zh: '走散；偏离正道' }],
            
            extraExamples: [
              { en: 'We wandered through the old town.', zh: '我们在老城闲逛。' },
              { en: 'Don’t wander off in the woods.', zh: '别在林子里走丢了。' },
            ],
          }),
          w('x1u3-46', 'amusement', '/əˈmjuːzmənt/', 'n.', '娱乐（活动）；愉悦', 'To our amusement, the dog danced.', '情感与性格', '让我们好笑的是狗跳舞了。', {
            phrases: [{ en: 'to one’s amusement', zh: '让某人觉得好笑的是' }, { en: 'an amusement park', zh: '游乐园' }],
            
            extraExamples: [
              { en: 'To everyone’s amusement, he fell asleep.', zh: '大家觉得好笑的是他睡着了。' },
              { en: 'The city has many amusement centers.', zh: '这城市有很多娱乐中心。' },
            ],
          }),
          w('x1u3-47', 'amuse', '/əˈmjuːz/', 'vt.', '（提供）消遣；（使）娱乐', 'The clown amused the children.', '行为与动作', '小丑逗乐了孩子。', {
            phrases: [{ en: 'amuse oneself', zh: '自娱自乐' }, { en: 'be amused at/by...', zh: '被……逗乐' }],
            
            extraExamples: [
              { en: 'The joke amused everyone.', zh: '这笑话把大家逗乐了。' },
              { en: 'She amused herself with a book.', zh: '她看书打发时间。' },
            ],
          }),
          w('x1u3-48', 'enormous', '/ɪˈnɔːməs/', 'adj.', '巨大的；极大的', 'The park is enormous.', '品质与状态', '公园很大。', {
            phrases: [{ en: 'an enormous amount/number', zh: '巨大的数量' }, { en: 'enormous pressure', zh: '巨大压力' }],
            
            extraExamples: [
              { en: 'An enormous crowd gathered.', zh: '聚集了庞大的人群。' },
              { en: 'The project cost an enormous sum.', zh: '这个项目耗资巨大。' },
            ],
          }),
          w('x1u3-49', 'swing', '/swɪŋ/', 'v.', '（swung, swung）（使）摆动；摇摆；转弯 n. 秋千', 'The kids played on the swing.', '行为与动作', '孩子们荡秋千。', {
            phrases: [{ en: 'swing by', zh: '顺道拜访' }, { en: 'in full swing', zh: '正在热烈进行' }],
            
            extraExamples: [
              { en: 'The pendulum swings slowly.', zh: '钟摆慢慢摆动。' },
              { en: 'The party was in full swing.', zh: '派对正嗨。' },
            ],
          }),
          w('x1u3-50', 'iron', '/ˈaɪən/', 'n.', '铁；铁器；熨斗 v. 熨；烫平', 'The gate is made of iron.', '社会与环境', '大门是铁做的。', {
            phrases: [{ en: 'iron clothes', zh: '熨衣服' }, { en: 'an iron will', zh: '钢铁意志' }],
            
            extraExamples: [
              { en: 'She ironed her shirt.', zh: '她熨了衬衫。' },
              { en: 'The pipe is made of iron.', zh: '这管子是铁的。' },
            ],
          }),
          w('x1u3-51', 'fashion', '/ˈfæʃn/', 'n.', '时尚；时兴；流行款式', 'Long hair is in fashion.', '社会与环境', '长发流行。', {
            phrases: [{ en: 'in fashion', zh: '流行' }, { en: 'fashion show/industry', zh: '时装秀/时尚业' }],
            
            extraExamples: [
              { en: 'Short skirts are back in fashion.', zh: '短裙又流行了。' },
              { en: 'She works in the fashion industry.', zh: '她在时尚业工作。' },
            ],
          }),
          w('x1u3-52', 'rare', '/reə(r)/', 'adj.', '稀少的；珍贵的；（肉）半熟的', 'Pandas are rare animals.', '品质与状态', '熊猫是稀有动物。', {
            phrases: [{ en: 'a rare disease/animal', zh: '罕见病/珍稀动物' }, { en: 'rare steak', zh: '三分熟牛排' }],
            
            extraExamples: [
              { en: 'This coin is very rare.', zh: '这枚硬币很稀有。' },
              { en: 'It is rare to see snow in winter here.', zh: '这儿冬天很少下雪。' },
            ],
          }),
          w('x1u3-53', 'steam', '/stiːm/', 'n.', '蒸汽；水蒸气 v. 蒸发；冒水汽', 'The steam rose from the hot spring.', '社会与环境', '蒸汽从温泉升起。', {
            phrases: [{ en: 'steam engine', zh: '蒸汽机' }, { en: 'get steamed up', zh: '激动/生气' }],
            
            extraExamples: [
              { en: 'The kettle is steaming.', zh: '水壶冒气了。' },
              { en: 'Steam rose from the coffee.', zh: '咖啡冒着热气。' },
            ],
          }),
          w('x1u3-54', 'superb', '/suːˈpɜːb/', 'adj.', '极佳的；卓越的', 'The view is superb.', '品质与状态', '景色极佳。', {
            phrases: [{ en: 'a superb performance/view', zh: '精彩演出/绝美景色' }, { en: 'superb quality', zh: '上乘品质' }],
            
            extraExamples: [
              { en: 'The food was superb.', zh: '饭菜好极了。' },
              { en: 'She speaks superb English.', zh: '她英语说得极好。' },
            ],
          }),
          w('x1u3-55', 'aquarium', '/əˈkweəriəm/', 'n.', '水族馆；水族玻璃槽；养鱼缸', 'We visited the aquarium.', '社会与环境', '我们参观了水族馆。', {
            phrases: [{ en: 'a marine aquarium', zh: '海洋水族馆' }, { en: 'an aquarium fish', zh: '观赏鱼' }],
            
            extraExamples: [
              { en: 'The aquarium has sharks.', zh: '水族馆里有鲨鱼。' },
              { en: 'We watched the dolphin show at the aquarium.', zh: '我们在水族馆看了海豚表演。' },
            ],
          }),
          w('x1u3-56', 'up to', '/ʌp tuː/', 'phr.', '达到（某数量）；直到；能胜任', 'The park is up to 1000 hectares.', '认知与学术', '公园达1000公顷。', {
            phrases: [{ en: 'up to date', zh: '最新的' }, { en: 'be up to sth.', zh: '忙于/密谋某事；能胜任' }],
            
            extraExamples: [
              { en: 'I can take up to 6 people.', zh: '我最多载6人。' },
              { en: 'What are you up to?', zh: '你在搞什么鬼？' },
            ],
          }),
          w('x1u3-57', 'polar', '/ˈpəʊlə(r)/', 'adj.', '（近）极地的；南极（或北极）的', 'Polar bears live in the Arctic.', '社会与环境', '北极熊生活在北极。', {
            phrases: [{ en: 'polar bear', zh: '北极熊' }, { en: 'polar regions', zh: '极地地区' }],
            
            extraExamples: [
              { en: 'Polar ice is melting.', zh: '极地冰川在融化。' },
              { en: 'Their views are polar opposites.', zh: '他们的观点截然相反。' },
            ],
          }),
          w('x1u3-58', 'upside down', '/ˌʌpsaɪd ˈdaʊn/', 'phr.', '颠倒；倒转；翻转', 'The picture is upside down.', '品质与状态', '图片倒了。', {
            phrases: [{ en: 'turn sth. upside down', zh: '把某物翻过来；彻底打乱' }, { en: 'upside-down cake', zh: '翻转蛋糕' }],
            
            extraExamples: [
              { en: 'The map is upside down.', zh: '地图拿倒了。' },
              { en: 'They turned the room upside down looking for the keys.', zh: '他们翻箱倒柜找钥匙。' },
            ],
          }),
          w('x1u3-59', 'splendid', '/ˈsplendɪd/', 'adj.', '壮丽的；雄伟的；极佳的', 'The view is splendid.', '品质与状态', '景色壮丽。', {
            phrases: [{ en: 'a splendid view/idea', zh: '壮丽景色/好主意' }, { en: 'splendid isolation', zh: '光荣孤立' }],
            
            extraExamples: [
              { en: 'We had a splendid time.', zh: '我们玩得极开心。' },
              { en: 'The view from the tower is splendid.', zh: '塔上的景色壮丽。' },
            ],
          }),
          w('x1u3-60', 'display', '/dɪˈspleɪ/', 'n.', '展览；陈列；展览品 vt. 显示；陈列', 'The animals are on display.', '社会与环境', '动物在展出。', {
            phrases: [{ en: 'on display', zh: '展出中' }, { en: 'display board/screen', zh: '展示板/显示屏' }],
            
            extraExamples: [
              { en: 'The photos are on display in the hall.', zh: '照片在大厅展出。' },
              { en: 'The screen displays a map.', zh: '屏幕显示地图。' },
            ],
          }),
          w('x1u3-61', 'appetite', '/ˈæpɪtaɪt/', 'n.', '食欲；胃口；强烈欲望', 'Hiking gave me an appetite.', '认知与学术', '徒步让我胃口大开。', {
            phrases: [{ en: 'have a good/poor appetite', zh: '胃口好/差' }, { en: 'an appetite for...', zh: '对……的欲望' }],
            
            extraExamples: [
              { en: 'Exercise gives you an appetite.', zh: '运动让人胃口好。' },
              { en: 'He has an enormous appetite for life.', zh: '他对生活充满热情。' },
            ],
          }),
          w('x1u3-62', 'entertainment', '/ˌentəˈteɪnmənt/', 'n.', '娱乐；招待；娱乐活动；文娱节目', 'The park offers entertainment.', '社会与环境', '公园提供娱乐活动。', {
            phrases: [{ en: 'entertainment industry', zh: '娱乐业' }, { en: 'live entertainment', zh: '现场娱乐表演' }],
            
            extraExamples: [
              { en: 'The city has plenty of entertainment.', zh: '这城市娱乐丰富。' },
              { en: 'There will be live entertainment tonight.', zh: '今晚有现场演出。' },
            ],
          }),
          w('x1u3-63', 'column', '/ˈkɒləm/', 'n.', '（书、报纸的）栏；专栏；柱（形物）', 'There is a column about nature.', '认知与学术', '有个自然专栏。', {
            phrases: [{ en: 'a newspaper column', zh: '报纸专栏' }, { en: 'a column of water/smoke', zh: '水柱/烟柱' }],
            
            extraExamples: [
              { en: 'She writes a weekly column.', zh: '她每周写专栏。' },
              { en: 'A column of soldiers marched by.', zh: '一队士兵走过。' },
            ],
          }),
        ],
      },
      {
        id: 'senior-xb1-u4',
        title: 'Unit 4 · Adversity and Courage',
        words: [
          w('x1u4-1', 'interaction', '/ˌɪntərˈækʃn/', 'n.', '交流；相互影响', 'Social interaction is important.', '社会与环境', '社交互动很重要。', {
            phrases: [{ en: 'social interaction', zh: '社交互动' }, { en: 'interaction between...', zh: '……之间的互动' }],
            
            extraExamples: [
              { en: 'There is little interaction between the teams.', zh: '两队之间几乎没有互动。' },
              { en: 'The app encourages user interaction.', zh: '这个应用鼓励用户互动。' },
            ],
          }),
          w('x1u4-2', 'vary', '/ˈveəri/', 'vi.', '（根据情况）变化；改变', 'Prices vary by season.', '行为与动作', '价格随季节变化。', {
            phrases: [{ en: 'vary from... to...', zh: '从……到……不等' }, { en: 'vary in size', zh: '大小不一' }],
            
            extraExamples: [
              { en: 'The rooms vary in size.', zh: '房间大小不一。' },
              { en: 'Attendance varies from day to day.', zh: '每天出勤人数不同。' },
            ],
          }),
          w('x1u4-3', 'appropriate', '/əˈprəʊpriət/', 'adj.', '合适的；恰当的', 'Wear appropriate clothes.', '品质与状态', '穿合适的衣服。', {
            phrases: [{ en: 'appropriate for/to...', zh: '适合……' }, { en: 'an appropriate response', zh: '恰当的回应' }],
            
            extraExamples: [
              { en: 'Wear clothes appropriate for the occasion.', zh: '穿适合场合的衣服。' },
              { en: 'Is now an appropriate time?', zh: '现在是合适的时机吗？' },
            ],
          }),
          w('x1u4-4', 'by contrast', '/baɪ ˈkɒntrɑːst/', 'phr.', '相比之下', 'By contrast, he was calm.', '认知与学术', '相比之下，他很冷静。', {
            phrases: [{ en: 'by contrast with...', zh: '与……形成对比' }, { en: 'in contrast', zh: '相反' }],
            
            extraExamples: [
              { en: 'By contrast, his brother is very outgoing.', zh: '相比之下，他弟弟很外向。' },
              { en: 'The economy is growing; by contrast, last year was bad.', zh: '经济在增长；相比之下去年很差。' },
            ],
          }),
          w('x1u4-5', 'approve', '/əˈpruːv/', 'vi.', '赞成；同意 vt. 批准；通过', 'I approve of the plan.', '行为与动作', '我赞成这个计划。', {
            phrases: [{ en: 'approve of...', zh: '赞成……' }, { en: 'approve a plan/bill', zh: '批准计划/法案' }],
            
            extraExamples: [
              { en: 'Her parents don’t approve of her decision.', zh: '她父母不赞成她的决定。' },
              { en: 'The committee approved the budget.', zh: '委员会批准了预算。' },
            ],
          }),
          w('x1u4-6', 'demonstrate', '/ˈdemənstreɪt/', 'vt.', '表现；表达；说明；证明', 'He demonstrated courage.', '行为与动作', '他表现出勇气。', {
            phrases: [{ en: 'demonstrate how to do...', zh: '演示如何做……' }, { en: 'demonstrate that...', zh: '证明……' }],
            
            extraExamples: [
              { en: 'Let me demonstrate the software.', zh: '我来演示一下软件。' },
              { en: 'The study demonstrates a clear link.', zh: '研究证明了明确的关联。' },
            ],
          }),
          w('x1u4-7', 'gesture', '/ˈdʒestʃə(r)/', 'n.', '手势；姿势；姿态', 'He made a gesture of thanks.', '行为与动作', '他做了感谢的手势。', {
            phrases: [{ en: 'make a gesture', zh: '做手势' }, { en: 'a friendly gesture', zh: '友好姿态' }],
            
            extraExamples: [
              { en: 'She made a gesture of apology.', zh: '她做了个道歉的手势。' },
              { en: 'His gesture showed goodwill.', zh: '他的姿态表明了善意。' },
            ],
          }),
          w('x1u4-8', 'witness', '/ˈwɪtnəs/', 'vt.', '当场看到；目击；见证 n. 目击者；证人', 'She witnessed the accident.', '行为与动作', '她目击了事故。', {
            phrases: [{ en: 'a witness to...', zh: '……的目击者' }, { en: 'bear witness to...', zh: '为……作证' }],
            
            extraExamples: [
              { en: 'He witnessed the robbery.', zh: '他目击了抢劫。' },
              { en: 'There were no witnesses.', zh: '没有目击者。' },
            ],
          }),
          w('x1u4-9', 'employ', '/ɪmˈplɔɪ/', 'vt.', '使用；应用；雇用', 'They employ new methods.', '行为与动作', '他们采用新方法。', {
            phrases: [{ en: 'employ sb. as...', zh: '雇某人为……' }, { en: 'employ a method/technique', zh: '使用方法/技术' }],
            
            extraExamples: [
              { en: 'The factory employs 200 workers.', zh: '工厂雇了200名工人。' },
              { en: 'She employs a new technique.', zh: '她使用了新技术。' },
            ],
          }),
          w('x1u4-10', 'identical', '/aɪˈdentɪkl/', 'adj.', '相同的', 'The two twins are identical.', '品质与状态', '这对双胞胎一模一样。', {
            phrases: [{ en: 'identical to...', zh: '与……完全相同' }, { en: 'identical twins', zh: '同卵双胞胎' }],
            
            extraExamples: [
              { en: 'The two pictures are identical.', zh: '两张照片一模一样。' },
              { en: 'Her dress is identical to mine.', zh: '她的裙子和我的完全一样。' },
            ],
          }),
          w('x1u4-11', 'interpret', '/ɪnˈtɜːprɪt/', 'v.', '把……理解（解释）为；口译', 'How do you interpret this?', '认知与学术', '你怎么理解这个？', {
            phrases: [{ en: 'interpret sth. as...', zh: '把某事理解为……' }, { en: 'interpret for sb.', zh: '为某人口译' }],
            
            extraExamples: [
              { en: 'How do you interpret his silence?', zh: '你怎么理解他的沉默？' },
              { en: 'She interpreted for the president.', zh: '她给总统做翻译。' },
            ],
          }),
          w('x1u4-12', 'differ', '/ˈdɪfə(r)/', 'vi.', '相异；不同于', 'Their opinions differ.', '认知与学术', '他们的意见不同。', {
            phrases: [{ en: 'differ from...', zh: '与……不同' }, { en: 'differ in...', zh: '在……方面不同' }],
            
            extraExamples: [
              { en: 'People differ in their tastes.', zh: '人们品味不同。' },
              { en: 'The two breeds differ greatly.', zh: '这两个品种差别很大。' },
            ],
          }),
          w('x1u4-13', 'by comparison', '/baɪ kəmˈpærɪsn/', 'phr.', '（与……）相比较', 'By comparison, this is better.', '认知与学术', '相比之下这个更好。', {
            phrases: [{ en: 'by comparison with...', zh: '与……相比' }, { en: 'in comparison', zh: '相比之下' }],
            
            extraExamples: [
              { en: 'By comparison, this car is cheaper.', zh: '相比之下这辆车更便宜。' },
              { en: 'By comparison with last year, sales are up.', zh: '和去年相比销量上升了。' },
            ],
          }),
          w('x1u4-14', 'cheek', '/tʃiːk/', 'n.', '面颊；脸颊', 'She kissed his cheek.', '社会与环境', '她吻了他的脸颊。', {
            phrases: [{ en: 'rosy cheeks', zh: '红润的脸颊' }, { en: 'cheek by jowl', zh: '紧紧挨着' }],
            
            extraExamples: [
              { en: 'Tears ran down her cheeks.', zh: '泪水顺着她的脸颊流下。' },
              { en: 'He turned red in the cheeks.', zh: '他脸红了。' },
            ],
          }),
          w('x1u4-15', 'favour', '/ˈfeɪvə(r)/', 'vt.', '较喜欢；选择；有利于 n. 帮助；恩惠；赞同', 'I favour the first option.', '行为与动作', '我更喜欢第一个选择。', {
            phrases: [{ en: 'in favour of...', zh: '支持……' }, { en: 'do sb. a favour', zh: '帮某人一个忙' }],
            
            extraExamples: [
              { en: 'Could you do me a favour?', zh: '能帮我个忙吗？' },
              { en: 'I am in favour of the proposal.', zh: '我支持这个提议。' },
            ],
          }),
          w('x1u4-16', 'bow', '/baʊ/', 'vi.', '鞠躬；点头 n. 弓；蝴蝶结', 'He bowed to the judge.', '行为与动作', '他向裁判鞠躬。', {
            phrases: [{ en: 'bow to sb.', zh: '向某人鞠躬' }, { en: 'take a bow', zh: '鞠躬谢幕' }],
            
            extraExamples: [
              { en: 'The actors bowed at the end.', zh: '演员们谢幕鞠躬。' },
              { en: 'She tied a bow in her hair.', zh: '她在头上系了个蝴蝶结。' },
            ],
          }),
          w('x1u4-17', 'waist', '/weɪst/', 'n.', '腰；腰部', 'He put his hands on his waist.', '社会与环境', '他双手叉腰。', {
            phrases: [{ en: 'around the waist', zh: '在腰部' }, { en: 'waist deep', zh: '齐腰深' }],
            
            extraExamples: [
              { en: 'She has a slim waist.', zh: '她腰很细。' },
              { en: 'The water came up to my waist.', zh: '水齐我腰深。' },
            ],
          }),
          w('x1u4-18', 'make inferences', '/meɪk ˈɪnfərənsɪz/', 'phr.', '推理；推断', 'We make inferences from data.', '认知与学术', '我们从数据中推断。', {
            phrases: [{ en: 'make inferences from...', zh: '从……推断' }, { en: 'draw an inference', zh: '得出推论' }],
            
            extraExamples: [
              { en: 'We make inferences from the evidence.', zh: '我们从证据推断。' },
              { en: 'Readers must make inferences themselves.', zh: '读者需要自己推断。' },
            ],
          }),
          w('x1u4-19', 'break down', '/breɪk daʊn/', 'phr.', '消除；分解；打破', 'They broke down barriers.', '行为与动作', '他们打破了隔阂。', {
            phrases: [{ en: 'break down barriers', zh: '打破障碍' }, { en: 'break down in tears', zh: '放声大哭' }],
            
            extraExamples: [
              { en: 'Our car broke down on the highway.', zh: '我们车在高速上抛锚了。' },
              { en: 'She broke down and cried.', zh: '她崩溃大哭。' },
            ],
          }),
          w('x1u4-20', 'barrier', '/ˈbæriə(r)/', 'n.', '隔阂；障碍', 'Language is a barrier.', '社会与环境', '语言是障碍。', {
            phrases: [{ en: 'language barrier', zh: '语言障碍' }, { en: 'break down barriers', zh: '打破障碍' }],
            
            extraExamples: [
              { en: 'Poor health is a barrier to success.', zh: '健康差是成功的障碍。' },
              { en: 'The barrier blocks the road.', zh: '路障挡住了路。' },
            ],
          }),
          w('x1u4-21', 'fake', '/feɪk/', 'adj.', '假装的；假的；冒充的', 'He gave a fake smile.', '品质与状态', '他假笑。', {
            phrases: [{ en: 'a fake passport', zh: '假护照' }, { en: 'fake an illness', zh: '装病' }],
            
            extraExamples: [
              { en: 'The painting is a fake.', zh: '这幅画是赝品。' },
              { en: 'He faked his signature.', zh: '他伪造了签名。' },
            ],
          }),
          w('x1u4-22', 'anger', '/ˈæŋɡə(r)/', 'n.', '愤怒；怒气 vt. 使生气；激怒', 'He could not control his anger.', '情感与性格', '他无法控制愤怒。', {
            phrases: [{ en: 'in anger', zh: '愤怒地' }, { en: 'anger management', zh: '情绪管理' }],
            
            extraExamples: [
              { en: 'She shouted in anger.', zh: '她愤怒地大喊。' },
              { en: 'His rudeness angered everyone.', zh: '他的无礼激怒了大家。' },
            ],
          }),
          w('x1u4-23', 'reliable', '/rɪˈlaɪəbl/', 'adj.', '可靠的；可信赖的', 'He is a reliable friend.', '品质与状态', '他是可靠的朋友。', {
            phrases: [{ en: 'a reliable source/witness', zh: '可靠来源/证人' }, { en: 'reliable information', zh: '可靠信息' }],
            
            extraExamples: [
              { en: 'The bus service is reliable.', zh: '公交很准点可靠。' },
              { en: 'She is a reliable worker.', zh: '她是个可靠的员工。' },
            ],
          }),
          w('x1u4-24', 'incident', '/ˈɪnsɪdənt/', 'n.', '发生的事情；严重事件；冲突', 'The incident was reported.', '社会与环境', '事件被报道了。', {
            phrases: [{ en: 'a serious incident', zh: '严重事件' }, { en: 'without incident', zh: '平安无事' }],
            
            extraExamples: [
              { en: 'The incident happened at midnight.', zh: '事件发生在午夜。' },
              { en: 'There were no further incidents.', zh: '没有再发生其他事件。' },
            ],
          }),
          w('x1u4-25', 'trial', '/ˈtraɪəl/', 'n.', '审讯；审判；试验；试用', 'The trial lasted a week.', '社会与环境', '审判持续了一周。', {
            phrases: [{ en: 'on trial', zh: '在受审；在试用' }, { en: 'a clinical trial', zh: '临床试验' }],
            
            extraExamples: [
              { en: 'The trial begins next month.', zh: '审判下月开始。' },
              { en: 'The new drug is on trial.', zh: '新药在试验中。' },
            ],
          }),
          w('x1u4-26', 'slight', '/slaɪt/', 'adj.', '轻微的；略微的；细小的', 'There is a slight difference.', '品质与状态', '有细微差别。', {
            phrases: [{ en: 'a slight headache', zh: '轻微头痛' }, { en: 'not in the slightest', zh: '一点也不' }],
            
            extraExamples: [
              { en: 'There is a slight delay.', zh: '稍有延误。' },
              { en: 'She has a slight accent.', zh: '她口音很轻。' },
            ],
          }),
          w('x1u4-27', 'slightly', '/ˈslaɪtli/', 'adv.', '略微；稍微', 'He is slightly taller.', '认知与学术', '他稍微高一点。', {
            phrases: [{ en: 'slightly better', zh: '稍微好一点' }, { en: 'slightly different', zh: '略有不同' }],
            
            extraExamples: [
              { en: 'I am slightly tired.', zh: '我有点累。' },
              { en: 'The price is slightly higher.', zh: '价格略高。' },
            ],
          }),
          w('x1u4-28', 'twin', '/twɪn/', 'n.', '孪生之一；双胞胎之一 adj. 双胞胎之一的', 'She has a twin sister.', '社会与环境', '她有个双胞胎姐姐。', {
            phrases: [{ en: 'twin brother/sister', zh: '双胞胎兄弟/姐妹' }, { en: 'identical twins', zh: '同卵双胞胎' }],
            
            extraExamples: [
              { en: 'The twins look identical.', zh: '这对双胞胎长得一模一样。' },
              { en: 'They have twin beds.', zh: '他们有两张单人床。' },
            ],
          }),
          w('x1u4-29', 'nonverbal', '/ˌnɒnˈvɜːbl/', 'adj.', '不涉及言语的；非言语的', 'Nonverbal communication matters.', '认知与学术', '非言语交流很重要。', {
            phrases: [{ en: 'nonverbal communication', zh: '非言语交流' }, { en: 'nonverbal signals', zh: '非语言信号' }],
            
            extraExamples: [
              { en: 'Body language is nonverbal.', zh: '肢体语言是非言语的。' },
              { en: 'Nonverbal cues matter in interviews.', zh: '面试中非语言信号很重要。' },
            ],
          }),
          w('x1u4-30', 'assessment', '/əˈsesmənt/', 'n.', '评价；评定', 'The assessment is fair.', '认知与学术', '评估是公平的。', {
            phrases: [{ en: 'a fair assessment', zh: '公正评估' }, { en: 'risk assessment', zh: '风险评估' }],
            
            extraExamples: [
              { en: 'The assessment takes two hours.', zh: '评估要两小时。' },
              { en: 'We need a realistic assessment.', zh: '我们需要实事求是的评估。' },
            ],
          }),
          w('x1u4-31', 'assess', '/əˈses/', 'vt.', '评估；评价', 'Teachers assess students.', '行为与动作', '老师评估学生。', {
            phrases: [{ en: 'assess the situation', zh: '评估局势' }, { en: 'assess the impact', zh: '评估影响' }],
            
            extraExamples: [
              { en: 'Doctors assess the patient.', zh: '医生评估病人。' },
              { en: 'It is hard to assess the damage.', zh: '损失难以评估。' },
            ],
          }),
          w('x1u4-32', 'internal', '/ɪnˈtɜːnl/', 'adj.', '内部的；里面的', 'The internal structure is complex.', '认知与学术', '内部结构复杂。', {
            phrases: [{ en: 'internal affairs', zh: '内部事务' }, { en: 'internal medicine', zh: '内科' }],
            
            extraExamples: [
              { en: 'The internal walls are white.', zh: '内墙是白色的。' },
              { en: 'It is an internal problem.', zh: '这是内部问题。' },
            ],
          }),
          w('x1u4-33', 'straighten up', '/ˈstreɪtn ʌp/', 'phr.', '直起来；整理；收拾整齐', 'Straighten up your room.', '行为与动作', '整理你的房间。', {
            phrases: [{ en: 'straighten up the room', zh: '收拾房间' }, { en: 'straighten up your posture', zh: '挺直腰板' }],
            
            extraExamples: [
              { en: 'Straighten up—don’t slouch.', zh: '坐直，别佝偻着。' },
              { en: 'He straightened up the desk.', zh: '他整理了桌子。' },
            ],
          }),
          w('x1u4-34', 'slump', '/slʌmp/', 'v.', '垂头弯腰地走（或坐等）', 'He slumped into the chair.', '行为与动作', '他瘫坐在椅子上。', {
            phrases: [{ en: 'slump into a chair', zh: '瘫坐在椅子上' }, { en: 'a slump in sales', zh: '销量暴跌' }],
            
            extraExamples: [
              { en: 'She slumped on the sofa.', zh: '她瘫倒在沙发上。' },
              { en: 'Sales slumped last quarter.', zh: '上季度销量暴跌。' },
            ],
          }),
          w('x1u4-35', 'pose', '/pəʊz/', 'v.', '摆好姿势；造成（威胁、问题等）n. 姿势', 'She posed for a photo.', '行为与动作', '她摆好姿势拍照。', {
            phrases: [{ en: 'pose for a photo', zh: '摆姿势拍照' }, { en: 'pose a threat/problem', zh: '构成威胁/问题' }],
            
            extraExamples: [
              { en: 'The pollution poses a health risk.', zh: '污染构成健康风险。' },
              { en: 'She posed elegantly.', zh: '她优雅地摆姿势。' },
            ],
          }),
          w('x1u4-36', 'bend', '/bend/', 'v.', '（bent, bent）（使）弯曲；倾斜；偏向', 'He bent down to tie his shoes.', '行为与动作', '他弯腰系鞋带。', {
            phrases: [{ en: 'bend down', zh: '弯腰' }, { en: 'bend over backwards', zh: '竭尽全力' }],
            
            extraExamples: [
              { en: 'The road bends to the left.', zh: '路向左拐。' },
              { en: 'She bent the wire.', zh: '她把铁丝弯了。' },
            ],
          }),
          w('x1u4-37', 'reveal', '/rɪˈviːl/', 'vt.', '揭示；显示；露出', 'The study reveals new facts.', '行为与动作', '研究揭示了新事实。', {
            phrases: [{ en: 'reveal a secret', zh: '揭露秘密' }, { en: 'reveal that...', zh: '显示……' }],
            
            extraExamples: [
              { en: 'The report reveals a rise in crime.', zh: '报告显示犯罪率上升。' },
              { en: 'She revealed her plan.', zh: '她透露了计划。' },
            ],
          }),
          w('x1u4-38', 'clarify', '/ˈklærɪfaɪ/', 'vt.', '使更清晰易懂；阐明；澄清', 'Could you clarify that?', '行为与动作', '你能澄清一下吗？', {
            phrases: [{ en: 'clarify a point', zh: '澄清一点' }, { en: 'to clarify', zh: '需要说明的是' }],
            
            extraExamples: [
              { en: 'Could you clarify your question?', zh: '你能把问题说清楚吗？' },
              { en: 'The report clarifies the confusion.', zh: '报告澄清了误解。' },
            ],
          }),
          w('x1u4-39', 'in other words', '/ɪn ˈʌðə wɜːdz/', 'phr.', '换句话说；也就是说', 'In other words, he failed.', '认知与学术', '换句话说，他失败了。', {
            phrases: [{ en: 'in other words,...', zh: '换句话说……' }, { en: 'put in other words', zh: '换言之' }],
            
            extraExamples: [
              { en: 'He is lazy—in other words, he won’t work.', zh: '他懒——换句话说，他不想干活。' },
              { en: 'In other words, we are broke.', zh: '也就是说，我们没钱了。' },
            ],
          }),
          w('x1u4-40', 'educator', '/ˈedʒukeɪtə(r)/', 'n.', '教师；教育工作者；教育家', 'She is a respected educator.', '社会与环境', '她是受尊敬的教育家。', {
            phrases: [{ en: 'a respected educator', zh: '受尊敬的教育家' }, { en: 'early childhood educator', zh: '幼儿教育工作者' }],
            
            extraExamples: [
              { en: 'He is a well-known educator.', zh: '他是著名教育家。' },
              { en: 'Good educators inspire students.', zh: '好老师激励学生。' },
            ],
          }),
          w('x1u4-41', 'tick', '/tɪk/', 'vt.', '给（试卷等）打钩号 vi. （钟表）发出嘀嗒声', 'Tick the correct answer.', '行为与动作', '勾出正确答案。', {
            phrases: [{ en: 'tick the box', zh: '在方框打钩' }, { en: 'what makes sb. tick', zh: '某人的动机' }],
            
            extraExamples: [
              { en: 'The clock ticked loudly.', zh: '钟表嘀嗒响。' },
              { en: 'Tick the right answer.', zh: '勾出正确答案。' },
            ],
          }),
          w('x1u4-42', 'tendency', '/ˈtendənsi/', 'n.', '趋势；倾向', 'He has a tendency to be late.', '认知与学术', '他有迟到的倾向。', {
            phrases: [{ en: 'have a tendency to do sth.', zh: '有做某事的倾向' }, { en: 'an upward tendency', zh: '上升趋势' }],
            
            extraExamples: [
              { en: 'There is a tendency towards inflation.', zh: '有通胀趋势。' },
              { en: 'He has a tendency to talk too much.', zh: '他话太多。' },
            ],
          }),
          w('x1u4-43', 'lower', '/ˈləʊə(r)/', 'vt.', '把……放低；降低；减少 adj. 下面的', 'Lower your voice.', '行为与动作', '放低声音。', {
            phrases: [{ en: 'lower the price', zh: '降价' }, { en: 'lower your voice', zh: '放低声音' }],
            
            extraExamples: [
              { en: 'They lowered the price.', zh: '他们降了价。' },
              { en: 'Speak lower—children are asleep.', zh: '小声点——孩子睡了。' },
            ],
          }),
          w('x1u4-44', 'imply', '/ɪmˈplaɪ/', 'vt.', '意味着；暗示', 'His words implied agreement.', '认知与学术', '他的话暗示同意。', {
            phrases: [{ en: 'imply that...', zh: '暗示……' }, { en: 'as implied above', zh: '如上所述' }],
            
            extraExamples: [
              { en: 'His silence implied agreement.', zh: '他的沉默意味着同意。' },
              { en: 'What do you imply?', zh: '你话里有话？' },
            ],
          }),
          w('x1u4-45', 'barely', '/ˈbeəli/', 'adv.', '几乎不；勉强才能；刚刚', 'He could barely walk.', '认知与学术', '他几乎走不动。', {
            phrases: [{ en: 'barely enough', zh: '刚刚够' }, { en: 'can barely do sth.', zh: '几乎做不了某事' }],
            
            extraExamples: [
              { en: 'I barely know him.', zh: '我跟他不熟。' },
              { en: 'She had barely enough money.', zh: '她钱刚够。' },
            ],
          }),
          w('x1u4-46', 'chin', '/tʃɪn/', 'n.', '下巴', 'He rested his chin on his hand.', '社会与环境', '他手托下巴。', {
            phrases: [{ en: 'rest one’s chin on one’s hand', zh: '手托下巴' }, { en: 'keep one’s chin up', zh: '不气馁' }],
            
            extraExamples: [
              { en: 'He lifted his chin.', zh: '他扬起下巴。' },
              { en: 'Keep your chin up!', zh: '别灰心！' },
            ],
          }),
          w('x1u4-47', 'occupy', '/ˈɒkjupaɪ/', 'vt.', '占据；占用', 'The meeting occupied the whole day.', '行为与动作', '会议占了一整天。', {
            phrases: [{ en: 'occupy time/space', zh: '占用时间/空间' }, { en: 'be occupied with...', zh: '忙于……' }],
            
            extraExamples: [
              { en: 'The bed occupies half the room.', zh: '床占了房间一半。' },
              { en: 'She is occupied with work.', zh: '她忙于工作。' },
            ],
          }),
          w('x1u4-48', 'stare', '/steə(r)/', 'vi.', '盯着看；凝视 n. 凝视', 'Don\u2019t stare at people.', '行为与动作', '不要盯着人看。', {
            phrases: [{ en: 'stare at...', zh: '盯着……看' }, { en: 'stare into space', zh: '发呆' }],
            
            extraExamples: [
              { en: 'Don’t stare at strangers.', zh: '别盯着陌生人看。' },
              { en: 'She stared at the letter in shock.', zh: '她震惊地盯着信。' },
            ],
          }),
          w('x1u4-49', 'ceiling', '/ˈsiːlɪŋ/', 'n.', '天花板；上限', 'The ceiling is high.', '社会与环境', '天花板很高。', {
            phrases: [{ en: 'glass ceiling', zh: '玻璃天花板' }, { en: 'a price ceiling', zh: '价格上限' }],
            
            extraExamples: [
              { en: 'The ceiling is painted white.', zh: '天花板刷成白色。' },
              { en: 'There is no ceiling on the budget.', zh: '预算没有上限。' },
            ],
          }),
          w('x1u4-50', 'distract', '/dɪˈstrækt/', 'vt.', '分散（注意力）；使分心', 'Noise distracts me.', '行为与动作', '噪音让我分心。', {
            phrases: [{ en: 'distract sb. from...', zh: '使某人从……分心' }, { en: 'easily distracted', zh: '容易分心' }],
            
            extraExamples: [
              { en: 'Don’t distract me while I work.', zh: '我工作时别打扰我。' },
              { en: 'The noise distracted her from her reading.', zh: '噪音让她读书分心。' },
            ],
          }),
          w('x1u4-51', 'perceive', '/pəˈsiːv/', 'vt.', '察觉；看待；理解', 'He perceived a change.', '认知与学术', '他察觉到变化。', {
            phrases: [{ en: 'perceive sth. as...', zh: '把某事视为……' }, { en: 'perceive a difference', zh: '察觉差别' }],
            
            extraExamples: [
              { en: 'I perceived a slight change.', zh: '我察觉到一点变化。' },
              { en: 'How do you perceive your role?', zh: '你怎么看待自己的角色？' },
            ],
          }),
          w('x1u4-52', 'distinguish', '/dɪˈstɪŋɡwɪʃ/', 'v.', '区分；辨别', 'Can you distinguish the twins?', '行为与动作', '你能区分这对双胞胎吗？', {
            phrases: [{ en: 'distinguish A from B', zh: '区分A和B' }, { en: 'distinguish between...', zh: '辨别……' }],
            
            extraExamples: [
              { en: 'Can you distinguish the twins?', zh: '你分得清这对双胞胎吗？' },
              { en: 'It is hard to distinguish them.', zh: '他们很难区分。' },
            ],
          }),
          w('x1u4-53', 'anxiety', '/æŋˈzaɪəti/', 'n.', '焦虑；担心；害怕', 'She suffered from anxiety.', '情感与性格', '她饱受焦虑之苦。', {
            phrases: [{ en: 'suffer from anxiety', zh: '患焦虑症' }, { en: 'anxiety about...', zh: '对……的焦虑' }],
            
            extraExamples: [
              { en: 'He suffers from anxiety.', zh: '他有焦虑症。' },
              { en: 'She felt anxiety about the exam.', zh: '她为考试焦虑。' },
            ],
          }),
          w('x1u4-54', 'chest', '/tʃest/', 'n.', '胸部；胸膛', 'He held his chest.', '社会与环境', '他捂着胸口。', {
            phrases: [{ en: 'chest pain', zh: '胸痛' }, { en: 'hold sth. to one’s chest', zh: '把某物抱在胸前' }],
            
            extraExamples: [
              { en: 'He has chest pain.', zh: '他胸口疼。' },
              { en: 'She wore a medal on her chest.', zh: '她胸前挂着勋章。' },
            ],
          }),
          w('x1u4-55', 'embarrassed', '/ɪmˈbærəst/', 'adj.', '难堪的；尴尬的', 'He felt embarrassed.', '情感与性格', '他感到尴尬。', {
            phrases: [{ en: 'feel embarrassed about...', zh: '为……感到尴尬' }, { en: 'an embarrassed silence', zh: '尴尬的沉默' }],
            
            extraExamples: [
              { en: 'I felt embarrassed about my mistake.', zh: '我为错误感到尴尬。' },
              { en: 'He looked embarrassed.', zh: '他看上去很尴尬。' },
            ],
          }),
          w('x1u4-56', 'ashamed', '/əˈʃeɪmd/', 'adj.', '羞愧；惭愧', 'He was ashamed of his mistake.', '情感与性格', '他为自己的错误感到羞愧。', {
            phrases: [{ en: 'be ashamed of...', zh: '为……感到羞愧' }, { en: 'ashamed to do sth.', zh: '羞于做某事' }],
            
            extraExamples: [
              { en: 'He was ashamed of himself.', zh: '他为自己感到羞愧。' },
              { en: 'You should be ashamed.', zh: '你该感到惭愧。' },
            ],
          }),
          w('x1u4-57', 'merely', '/ˈmɪəli/', 'adv.', '只是；仅仅；只不过', 'It is merely a suggestion.', '认知与学术', '这只是个建议。', {
            phrases: [{ en: 'not merely... but...', zh: '不仅……而且……' }, { en: 'merely a matter of...', zh: '只是……的问题' }],
            
            extraExamples: [
              { en: 'It is merely a start.', zh: '这只是个开始。' },
              { en: 'He is merely a child.', zh: '他不过是个孩子。' },
            ],
          }),
          w('x1u4-58', 'call on', '/kɔːl ɒn/', 'phr.', '（短暂地）访问；要求（某人讲话等）；正式邀请', 'The teacher called on me.', '行为与动作', '老师叫我回答。', {
            phrases: [{ en: 'call on sb. to do sth.', zh: '叫某人做某事' }, { en: 'call on a friend', zh: '拜访朋友' }],
            
            extraExamples: [
              { en: 'The teacher called on me to answer.', zh: '老师叫我回答。' },
              { en: 'We called on our neighbors.', zh: '我们拜访了邻居。' },
            ],
          }),
          w('x1u4-59', 'bother', '/ˈbɒðə(r)/', 'v.', '费心；麻烦；因……操心 n. 麻烦；不便', 'Don\u2019t bother me now.', '行为与动作', '现在别烦我。', {
            phrases: [{ en: 'don’t bother', zh: '不用麻烦' }, { en: 'bother to do sth.', zh: '费心做某事' }],
            
            extraExamples: [
              { en: 'Don’t bother me—I’m busy.', zh: '别烦我——我忙着。' },
              { en: 'Sorry to bother you.', zh: '抱歉打扰了。' },
            ],
          }),
          w('x1u4-60', 'weep', '/wiːp/', 'v.', '哭泣；流泪', 'She wept with joy.', '行为与动作', '她喜极而泣。', {
            phrases: [{ en: 'weep with joy', zh: '喜极而泣' }, { en: 'weep for...', zh: '为……哭泣' }],
            
            extraExamples: [
              { en: 'She wept over her lost dog.', zh: '她为丢失的狗哭泣。' },
              { en: 'The girl wept quietly.', zh: '女孩默默流泪。' },
            ],
          }),
          w('x1u4-61', 'at work', '/æt wɜːk/', 'phr.', '有某种影响；在工作', 'Several factors are at work.', '认知与学术', '有几个因素在起作用。', {
            phrases: [{ en: 'factors at work', zh: '起作用的因素' }, { en: 'be at work', zh: '在上班；在起作用' }],
            
            extraExamples: [
              { en: 'There are many factors at work.', zh: '有很多因素在起作用。' },
              { en: 'My father is at work.', zh: '我爸爸在上班。' },
            ],
          }),
          w('x1u4-62', 'conflict', '/ˈkɒnflɪkt/', 'n.', '矛盾；冲突 vi. 冲突；抵触', 'There is a conflict of opinions.', '社会与环境', '意见有冲突。', {
            phrases: [{ en: 'in conflict with...', zh: '与……冲突' }, { en: 'a conflict of interest', zh: '利益冲突' }],
            
            extraExamples: [
              { en: 'There is a conflict between their schedules.', zh: '他们的日程有冲突。' },
              { en: 'My opinion conflicts with yours.', zh: '我的看法和你的不一样。' },
            ],
          }),
          w('x1u4-63', 'inquire', '/ɪnˈkwaɪə(r)/', 'v.', '询问；打听', 'She inquired about the time.', '行为与动作', '她询问了时间。', {
            phrases: [{ en: 'inquire about...', zh: '询问……' }, { en: 'inquire after sb.', zh: '问候某人' }],
            
            extraExamples: [
              { en: 'She inquired about flights.', zh: '她打听了航班。' },
              { en: 'I inquired at the front desk.', zh: '我在前台问了一下。' },
            ],
          }),
          w('x1u4-64', 'ultimately', '/ˈʌltɪmətli/', 'adv.', '最终；最后', 'Ultimately, he succeeded.', '认知与学术', '最终他成功了。', {
            phrases: [{ en: 'ultimately responsible', zh: '最终负责' }, { en: 'ultimately, ...', zh: '最终，……' }],
            
            extraExamples: [
              { en: 'Ultimately, it is your decision.', zh: '最终由你决定。' },
              { en: 'Ultimately, he agreed.', zh: '他最终同意了。' },
            ],
          }),
          w('x1u4-65', 'adjust', '/əˈdʒʌst/', 'v.', '调整；调节；适应；（使）习惯', 'Adjust to the new environment.', '行为与动作', '适应新环境。', {
            phrases: [{ en: 'adjust to...', zh: '适应……' }, { en: 'adjust the volume', zh: '调音量' }],
            
            extraExamples: [
              { en: 'It takes time to adjust.', zh: '适应需要时间。' },
              { en: 'Adjust the mirror before driving.', zh: '开车前调后视镜。' },
            ],
          }),
          w('x1u4-66', 'intervene', '/ˌɪntəˈviːn/', 'vi.', '干预；介入', 'The government intervened.', '行为与动作', '政府介入了。', {
            phrases: [{ en: 'intervene in...', zh: '干预……' }, { en: 'intervene to stop...', zh: '介入阻止……' }],
            
            extraExamples: [
              { en: 'The government intervened in the market.', zh: '政府干预了市场。' },
              { en: 'She intervened to break up the fight.', zh: '她介入劝架。' },
            ],
          }),
          w('x1u4-67', 'react', '/riˈækt/', 'vi.', '（对……）起反应；回应；有不良反应', 'How did he react?', '行为与动作', '他反应如何？', {
            phrases: [{ en: 'react to...', zh: '对……反应' }, { en: 'react by doing...', zh: '以做……回应' }],
            
            extraExamples: [
              { en: 'How did she react to the news?', zh: '她对这消息反应如何？' },
              { en: 'The dog reacted to the noise.', zh: '狗对声响有反应。' },
            ],
          }),
          w('x1u4-68', 'component', '/kəmˈpəʊnənt/', 'n.', '组成部分；零件', 'Each component is important.', '认知与学术', '每个组成部分都重要。', {
            phrases: [{ en: 'a key component', zh: '关键部件' }, { en: 'electrical components', zh: '电子元件' }],
            
            extraExamples: [
              { en: 'Each component works together.', zh: '每个部件协同工作。' },
              { en: 'The computer has many components.', zh: '电脑有很多部件。' },
            ],
          }),
          w('x1u4-69', 'tone', '/təʊn/', 'n.', '语气；腔调；口吻', 'Her tone was angry.', '情感与性格', '她的语气很生气。', {
            phrases: [{ en: 'in a... tone', zh: '以……的语气' }, { en: 'tone of voice', zh: '语调' }],
            
            extraExamples: [
              { en: 'Speak in a friendly tone.', zh: '用友好的语气说。' },
              { en: 'Her tone surprised me.', zh: '她的语气让我吃惊。' },
            ],
          }),
        ],
      },
      {
        id: 'senior-xb1-u5',
        title: 'Unit 5 · Working the Land',
        words: [
          w('x1u5-1', 'hybrid', '/ˈhaɪbrɪd/', 'n.', '杂交植（动）物；合成物；混合动力车', 'This is a hybrid rice plant.', '社会与环境', '这是一株杂交水稻。', {
            phrases: [{ en: 'hybrid rice / hybrid car', zh: '杂交水稻/混合动力车' }, { en: 'a hybrid of...', zh: '……的混合体' }],
            
            extraExamples: [
              { en: 'Hybrid cars use both electricity and petrol.', zh: '混合动力车用电和汽油。' },
              { en: 'The hybrid tree grows faster.', zh: '这种杂交树长得更快。' },
            ],
          }),
          w('x1u5-2', 'devote', '/dɪˈvəʊt/', 'vt.', '把……献（给）；把……专用于；专心于', 'He devoted his life to farming.', '行为与动作', '他毕生致力于农业。', {
            phrases: [{ en: 'devote oneself to...', zh: '致力于……' }, { en: 'devote time/money to...', zh: '把时间/金钱投入……' }],
            
            extraExamples: [
              { en: 'She devotes herself to teaching.', zh: '她投身于教学。' },
              { en: "Don't devote all your time to study.", zh: '别把所有时间都花在学习上。' },
            ],
          }),
          w('x1u5-3', 'shortage', '/ˈʃɔːtɪdʒ/', 'n.', '不足；缺少；短缺', 'There is a food shortage.', '社会与环境', '出现了粮食短缺。', {
            phrases: [{ en: 'a shortage of...', zh: '缺少……' }, { en: 'food/housing/water shortage', zh: '粮食/住房/水资源短缺' }],
            
            extraExamples: [
              { en: 'There is a shortage of clean water.', zh: '清洁水资源短缺。' },
              { en: 'The shortage led to higher prices.', zh: '短缺导致价格上涨。' },
            ],
          }),
          w('x1u5-4', 'tackle', '/ˈtækl/', 'vt.', '解决（难题）；应付（局面）；处理', 'We must tackle the food problem.', '行为与动作', '我们必须解决粮食问题。', {
            phrases: [{ en: 'tackle a problem/issue', zh: '解决问题' }, { en: 'tackle a task', zh: '着手处理任务' }],
            
            extraExamples: [
              { en: 'We must tackle this issue together.', zh: '我们必须一起解决这个问题。' },
              { en: 'The government is tackling crime.', zh: '政府正在打击犯罪。' },
            ],
          }),
          w('x1u5-5', 'crisis', '/ˈkraɪsɪs/', 'n.', '（pl. crises）危机；危急关头', 'The food crisis is serious.', '社会与环境', '粮食危机很严重。', {
            phrases: [{ en: 'in crisis', zh: '处于危机中' }, { en: 'an economic/financial crisis', zh: '经济/金融危机' }],
            
            extraExamples: [
              { en: 'The company is in crisis.', zh: '公司正处于危机中。' },
              { en: 'Oil prices rose during the crisis.', zh: '危机期间油价上涨。' },
            ],
          }),
          w('x1u5-6', 'boost', '/buːst/', 'vt.', '使增长；使兴旺 n. 增长；提高；激励', 'New methods boost yields.', '行为与动作', '新方法提高产量。', {
            phrases: [{ en: 'boost production/confidence', zh: '提高产量/信心' }, { en: 'a boost to...', zh: '对……的推动' }],
            
            extraExamples: [
              { en: 'The win boosted team morale.', zh: '胜利提升了团队士气。' },
              { en: 'Tax cuts boost the economy.', zh: '减税刺激经济。' },
            ],
          }),
          w('x1u5-7', 'yield', '/jiːld/', 'n.', '产量；产出 v. 出产；产生；屈服', 'The yield has doubled.', '社会与环境', '产量翻了一番。', {
            phrases: [{ en: 'high yield / crop yield', zh: '高产/作物产量' }, { en: 'yield to...', zh: '向……屈服' }],
            
            extraExamples: [
              { en: 'This variety yields more grain.', zh: '这个品种产量更高。' },
              { en: 'The army refused to yield.', zh: '军队拒绝投降。' },
            ],
          }),
          w('x1u5-8', 'convince', '/kənˈvɪns/', 'vt.', '使相信；使确信；说服', 'He convinced farmers.', '行为与动作', '他说服了农民。', {
            phrases: [{ en: 'convince sb. of sth.', zh: '使某人相信某事' }, { en: 'convince sb. to do sth.', zh: '说服某人做某事' }],
            
            extraExamples: [
              { en: 'I convinced him to join us.', zh: '我说服他加入我们。' },
              { en: 'She convinced me of her honesty.', zh: '她让我相信她是诚实的。' },
            ],
          }),
          w('x1u5-9', 'characteristic', '/ˌkærəktəˈrɪstɪk/', 'n.', '特征；特点；品质 adj. 典型的；独特的', 'One characteristic is high yield.', '品质与状态', '一个特点是高产。', {
            phrases: [{ en: 'a characteristic of...', zh: '……的特征' }, { en: 'be characteristic of...', zh: '为……所特有' }],
            
            extraExamples: [
              { en: 'Generosity is his best characteristic.', zh: '慷慨是他最大的特点。' },
              { en: 'These are the characteristic features of the species.', zh: '这些是该物种的典型特征。' },
            ],
          }),
          w('x1u5-10', 'attain', '/əˈteɪn/', 'vt.', '（通常经过努力）获得；得到', 'He attained his goal.', '行为与动作', '他实现了目标。', {
            phrases: [{ en: 'attain a goal / attain success', zh: '达到目标/取得成功' }, { en: 'attain to...', zh: '达到（某一状态）' }],
            
            extraExamples: [
              { en: 'She attained the highest score.', zh: '她取得了最高分。' },
              { en: 'He attained his ambition.', zh: '他实现了抱负。' },
            ],
          }),
          w('x1u5-11', 'conventional', '/kənˈvenʃənl/', 'adj.', '传统的；习惯的', 'Conventional farming uses chemicals.', '社会与环境', '传统农业使用化学品。', {
            phrases: [{ en: 'conventional methods/wisdom', zh: '传统方法/世俗观念' }, { en: 'conventional medicine', zh: '传统医学' }],
            
            extraExamples: [
              { en: 'Conventional cars are less efficient.', zh: '传统汽车效率较低。' },
              { en: 'He rejected conventional wisdom.', zh: '他摒弃了传统观念。' },
            ],
          }),
          w('x1u5-12', 'pollinate', '/ˈpɒləneɪt/', 'vt.', '授粉；传粉', 'Bees pollinate the flowers.', '行为与动作', '蜜蜂给花授粉。', {
            phrases: [{ en: 'be pollinated by...', zh: '由……授粉' }, { en: 'cross-pollinate', zh: '异花授粉' }],
            
            extraExamples: [
              { en: 'Bees pollinate fruit trees.', zh: '蜜蜂给果树授粉。' },
              { en: 'Flowers are pollinated by insects.', zh: '花由昆虫授粉。' },
            ],
          }),
          w('x1u5-13', 'assumption', '/əˈsʌmpʃn/', 'n.', '假定；设定；（责任的）承担；（权利的）获得', 'The assumption is wrong.', '认知与学术', '这个假设是错的。', {
            phrases: [{ en: 'on the assumption that...', zh: '假设……' }, { en: 'make an assumption', zh: '做假设' }],
            
            extraExamples: [
              { en: 'Your assumption proved correct.', zh: '你的假设被证明是对的。' },
              { en: 'We acted on the assumption that he would come.', zh: '我们以为他会来就行动了。' },
            ],
          }),
          w('x1u5-14', 'intense', '/ɪnˈtens/', 'adj.', '热切的；十分强烈的；激烈的', 'There is intense competition.', '品质与状态', '竞争激烈。', {
            phrases: [{ en: 'intense heat/pain/competition', zh: '酷热/剧痛/激烈竞争' }, { en: 'intense interest', zh: '浓厚的兴趣' }],
            
            extraExamples: [
              { en: 'The heat was intense.', zh: '酷热难耐。' },
              { en: 'She felt intense sadness.', zh: '她感到极度悲伤。' },
            ],
          }),
          w('x1u5-15', 'overcome', '/ˌəʊvəˈkʌm/', 'vt.', '（overcame, overcome）克服；解决；战胜', 'We overcame many difficulties.', '行为与动作', '我们克服了许多困难。', {
            phrases: [{ en: 'overcome difficulties/fears', zh: '克服困难/恐惧' }, { en: 'be overcome with...', zh: '被……所压倒' }],
            
            extraExamples: [
              { en: 'He overcame his fear of public speaking.', zh: '他克服了公开演讲的恐惧。' },
              { en: 'She was overcome with joy.', zh: '她喜不自胜。' },
            ],
          }),
          w('x1u5-16', 'expand', '/ɪkˈspænd/', 'v.', '扩大；增加；扩展；发展（业务）', 'They expand rice production.', '行为与动作', '他们扩大水稻生产。', {
            phrases: [{ en: 'expand into...', zh: '扩展到……' }, { en: "expand one's knowledge", zh: '拓展知识面' }],
            
            extraExamples: [
              { en: 'The business expanded rapidly.', zh: '业务迅速扩张。' },
              { en: 'Reading expands your mind.', zh: '阅读拓展思维。' },
            ],
          }),
          w('x1u5-17', 'output', '/ˈaʊtpʊt/', 'n.', '产量；输出；输出量', 'The output has increased.', '社会与环境', '产量增加了。', {
            phrases: [{ en: 'industrial output', zh: '工业产量' }, { en: 'output and input', zh: '产出与投入' }],
            
            extraExamples: [
              { en: 'The factory increased its output.', zh: '工厂提高了产量。' },
              { en: 'The device has two audio outputs.', zh: '这个设备有两个音频输出口。' },
            ],
          }),
          w('x1u5-18', 'estimate', '/ˈestɪmeɪt/', 'vt.', '估计；估价；估算 n. 估计；估算', 'He estimated the yield.', '认知与学术', '他估算了产量。', {
            phrases: [{ en: 'estimate sth. at...', zh: '估计某物为……' }, { en: 'a rough estimate', zh: '粗略估计' }],
            
            extraExamples: [
              { en: 'I estimate the cost at $500.', zh: '我估计成本是500美元。' },
              { en: 'My estimate was wrong.', zh: '我的估计错了。' },
            ],
          }),
          w('x1u5-19', 'domestic', '/dəˈmestɪk/', 'adj.', '本国的；国内的；家用的；家庭的', 'Domestic rice meets demand.', '社会与环境', '国产水稻满足需求。', {
            phrases: [{ en: 'domestic market / domestic flight', zh: '国内市场/国内航班' }, { en: 'domestic violence', zh: '家庭暴力' }],
            
            extraExamples: [
              { en: 'The domestic economy is growing.', zh: '国内经济在增长。' },
              { en: 'She enjoys domestic life.', zh: '她喜欢家庭生活。' },
            ],
          }),
          w('x1u5-20', 'consumption', '/kənˈsʌmpʃn/', 'n.', '消耗；消耗量；消费', 'Rice consumption is high.', '社会与环境', '大米消费量很高。', {
            phrases: [{ en: 'fuel consumption', zh: '燃料消耗' }, { en: 'consumption of energy', zh: '能源消耗' }],
            
            extraExamples: [
              { en: 'Energy consumption rose sharply.', zh: '能源消耗大幅上升。' },
              { en: 'The car has low fuel consumption.', zh: '这辆车油耗很低。' },
            ],
          }),
          w('x1u5-21', 'comprise', '/kəmˈpraɪz/', 'v.', '包括；包含；由……组成', 'The team comprises five experts.', '认知与学术', '团队由五位专家组成。', {
            phrases: [{ en: 'be comprised of...', zh: '由……组成' }, { en: 'comprise sth.', zh: '包含某事物' }],
            
            extraExamples: [
              { en: 'The committee comprises 12 members.', zh: '委员会由12名成员组成。' },
              { en: 'The project comprises three parts.', zh: '这个项目包括三部分。' },
            ],
          }),
          w('x1u5-22', 'generate', '/ˈdʒenəreɪt/', 'vt.', '产生；引起', 'The new strain generates more grain.', '行为与动作', '新品种产出更多粮食。', {
            phrases: [{ en: 'generate electricity/income', zh: '发电/产生收入' }, { en: 'generate interest', zh: '引起兴趣' }],
            
            extraExamples: [
              { en: 'The power station generates electricity.', zh: '这个电站发电。' },
              { en: 'The job generates good income.', zh: '这份工作收入不错。' },
            ],
          }),
          w('x1u5-23', 'strain', '/streɪn/', 'n.', '（动、植物的）系；品种；拉伤；压力', 'This is a new strain of rice.', '社会与环境', '这是水稻新品种。', {
            phrases: [{ en: 'a new strain of virus/rice', zh: '新病毒株/水稻新品种' }, { en: 'under strain', zh: '处于压力下' }],
            
            extraExamples: [
              { en: 'A new flu strain is spreading.', zh: '一种新流感毒株正在传播。' },
              { en: 'She is under a lot of strain.', zh: '她压力很大。' },
            ],
          }),
          w('x1u5-24', 'ensure', '/ɪnˈʃʊə(r)/', 'vt.', '保证；确保', 'We ensure food safety.', '行为与动作', '我们确保食品安全。', {
            phrases: [{ en: 'ensure that...', zh: '确保……' }, { en: 'ensure sb. sth.', zh: '确保某人得到某物' }],
            
            extraExamples: [
              { en: 'Please ensure the door is locked.', zh: '请确保门已锁好。' },
              { en: 'This ensures a better result.', zh: '这能保证更好的结果。' },
            ],
          }),
          w('x1u5-25', 'deep down', '/diːp daʊn/', 'phr.', '在内心深处；本质上；实际上', 'Deep down, he loves farming.', '认知与学术', '内心深处他热爱农业。', {
            phrases: [{ en: 'deep down inside', zh: '内心深处' }, { en: 'know deep down', zh: '内心明白' }],
            
            extraExamples: [
              { en: 'Deep down, she knew he was right.', zh: '她心里明白他是对的。' },
              { en: 'He is deep down a kind man.', zh: '他本质上是个好人。' },
            ],
          }),
          w('x1u5-26', 'soil', '/sɔɪl/', 'n.', '泥土；土壤；国土；领土', 'The soil is rich.', '社会与环境', '土壤肥沃。', {
            phrases: [{ en: 'rich/poor soil', zh: '肥沃/贫瘠的土壤' }, { en: 'soil erosion', zh: '水土流失' }],
            
            extraExamples: [
              { en: 'Plants grow well in this soil.', zh: '植物在这种土壤里长得好。' },
              { en: 'The soil here is very sandy.', zh: '这里的土壤多沙。' },
            ],
          }),
          w('x1u5-27', 'celebrity', '/səˈlebrəti/', 'n.', '名望；名誉；名人；名流', 'He became a celebrity scientist.', '社会与环境', '他成了知名科学家。', {
            phrases: [{ en: 'a celebrity chef/scientist', zh: '名厨/知名科学家' }, { en: 'instant celebrity', zh: '一夜成名' }],
            
            extraExamples: [
              { en: 'She became a national celebrity.', zh: '她成了全国名人。' },
              { en: 'Celebrities attended the event.', zh: '名流们出席了活动。' },
            ],
          }),
          w('x1u5-28', 'envision', '/ɪnˈvɪʒn/', 'vt.', '展望；想象', 'He envisions a hunger-free world.', '认知与学术', '他设想一个没有饥饿的世界。', {
            phrases: [{ en: 'envision a future/world', zh: '展望未来/世界' }, { en: 'envision doing sth.', zh: '设想做某事' }],
            
            extraExamples: [
              { en: 'He envisions a bright future.', zh: '他展望光明的未来。' },
              { en: "I can't envision living abroad.", zh: '我无法想象在国外生活。' },
            ],
          }),
          w('x1u5-29', 'sorghum', '/ˈsɔːɡəm/', 'n.', '高粱；高粱米', 'Sorghum grows in dry areas.', '社会与环境', '高粱生长在干旱地区。', {
            phrases: [{ en: 'sorghum field / sorghum flour', zh: '高粱地/高粱粉' }, { en: 'sweet sorghum', zh: '甜高粱' }],
            
            extraExamples: [
              { en: 'Sorghum is an important crop in Africa.', zh: '高粱是非洲重要作物。' },
              { en: 'The sorghum harvest was good this year.', zh: '今年高粱收成不错。' },
            ],
          }),
          w('x1u5-30', 'broom', '/bruːm/', 'n.', '扫把；扫帚；金雀花', 'He swept with a broom.', '社会与环境', '他用扫帚扫地。', {
            phrases: [{ en: 'a new broom', zh: '新上任者（革新者）' }, { en: 'broom and dustpan', zh: '扫帚和簸箕' }],
            
            extraExamples: [
              { en: 'She swept the floor with a broom.', zh: '她用扫帚扫地。' },
              { en: 'He bought a new broom.', zh: '他买了一把新扫帚。' },
            ],
          }),
          w('x1u5-31', 'grain', '/ɡreɪn/', 'n.', '谷物；谷粒；颗粒', 'Grain is stored well.', '社会与环境', '谷物储存良好。', {
            phrases: [{ en: 'a grain of sand/truth', zh: '一粒沙/一丝真理' }, { en: 'go against the grain', zh: '违背意愿' }],
            
            extraExamples: [
              { en: 'The farmers sold their grain.', zh: '农民们卖了谷物。' },
              { en: "There isn't a grain of truth in it.", zh: '那里面一点儿真话都没有。' },
            ],
          }),
          w('x1u5-32', 'vision', '/ˈvɪʒn/', 'n.', '想象；视力；视野；影像', 'His vision inspires farmers.', '认知与学术', '他的设想激励农民。', {
            phrases: [{ en: 'a vision of the future', zh: '对未来的设想' }, { en: 'have poor/good vision', zh: '视力差/好' }],
            
            extraExamples: [
              { en: 'She has a clear vision for the company.', zh: '她对公司有清晰的愿景。' },
              { en: 'He wears glasses because of poor vision.', zh: '他视力不好所以戴眼镜。' },
            ],
          }),
          w('x1u5-33', 'reality', '/riˈæləti/', 'n.', '现实；实际情况；事实', 'The reality is different.', '认知与学术', '现实不同。', {
            phrases: [{ en: 'in reality', zh: '实际上' }, { en: 'become a reality', zh: '成为现实' }],
            
            extraExamples: [
              { en: 'His dream became a reality.', zh: '他的梦想成了现实。' },
              { en: 'In reality, things are harder.', zh: '实际上事情更难。' },
            ],
          }),
          w('x1u5-34', 'salty', '/ˈsɔːlti/', 'adj.', '含盐的；咸的', 'The soil is too salty.', '品质与状态', '土壤太咸。', {
            phrases: [{ en: 'salty water / salty taste', zh: '咸水/咸味' }, { en: 'salty food', zh: '咸的食物' }],
            
            extraExamples: [
              { en: 'The soup is too salty.', zh: '汤太咸了。' },
              { en: 'Salty soil is bad for crops.', zh: '盐碱地对庄稼不好。' },
            ],
          }),
          w('x1u5-35', 'urban', '/ˈɜːbən/', 'adj.', '城市的；都市的；城镇的', 'Urban areas import grain.', '社会与环境', '城市地区进口粮食。', {
            phrases: [{ en: 'urban areas / urban life', zh: '城市地区/都市生活' }, { en: 'urban and rural', zh: '城乡' }],
            
            extraExamples: [
              { en: 'Urban populations are growing.', zh: '城市人口在增长。' },
              { en: 'He prefers urban life to rural life.', zh: '他喜欢城市生活胜过乡村。' },
            ],
          }),
          w('x1u5-36', 'bomb', '/bɒm/', 'n.', '炸弹 v. 轰炸；对……投炸弹', 'The bomb destroyed fields.', '社会与环境', '炸弹摧毁了农田。', {
            phrases: [{ en: 'drop a bomb', zh: '投炸弹' }, { en: 'go like a bomb', zh: '非常成功' }],
            
            extraExamples: [
              { en: 'The bomb exploded.', zh: '炸弹爆炸了。' },
              { en: 'The movie bombed at the box office.', zh: '这部电影票房惨败。' },
            ],
          }),
          w('x1u5-37', 'tunnel', '/ˈtʌnl/', 'n.', '地下通道；地道；隧道', 'They built a tunnel.', '社会与环境', '他们建了一条隧道。', {
            phrases: [{ en: 'a railway/road tunnel', zh: '铁路/公路隧道' }, { en: 'tunnel vision', zh: '隧道视野；一孔之见' }],
            
            extraExamples: [
              { en: 'The train went through a tunnel.', zh: '火车穿过隧道。' },
              { en: 'They dug a tunnel under the river.', zh: '他们在河底挖了隧道。' },
            ],
          }),
          w('x1u5-38', 'extension', '/ɪkˈstenʃn/', 'n.', '扩建部分；扩大；电话分机', 'The extension of the farm doubled its size.', '社会与环境', '农场扩建后面积翻倍。', {
            phrases: [{ en: 'the extension of...', zh: '……的延伸/扩建' }, { en: 'extension number', zh: '分机号码' }],
            
            extraExamples: [
              { en: 'We built an extension to the house.', zh: '我们给房子加了扩建部分。' },
              { en: 'Ask for extension 201.', zh: '请拨分机201。' },
            ],
          }),
          w('x1u5-39', 'chemical', '/ˈkemɪkl/', 'adj.', '与化学有关的；化学的 n. 化学制品；化学品', 'Farmers use chemical fertilizers.', '社会与环境', '农民使用化肥。', {
            phrases: [{ en: 'chemical industry / chemical reaction', zh: '化学工业/化学反应' }, { en: 'harmful chemicals', zh: '有害化学品' }],
            
            extraExamples: [
              { en: 'The factory dumps chemicals into the river.', zh: '工厂把化学品倒进河里。' },
              { en: 'He has a chemical degree.', zh: '他有化学学位。' },
            ],
          }),
          w('x1u5-40', 'wheat', '/wiːt/', 'n.', '小麦；小麦籽', 'Wheat is grown in the north.', '社会与环境', '北方种小麦。', {
            phrases: [{ en: 'a field of wheat', zh: '麦田' }, { en: 'wheat flour', zh: '小麦面粉' }],
            
            extraExamples: [
              { en: 'Bread is made from wheat.', zh: '面包是小麦做的。' },
              { en: 'The wheat is ready for harvest.', zh: '小麦可以收割了。' },
            ],
          }),
          w('x1u5-41', 'flavor', '/ˈfleɪvə(r)/', 'n.', '味道；特点；特色', 'The rice has a rich flavor.', '品质与状态', '大米味道浓郁。', {
            phrases: [{ en: 'a rich/strong flavor', zh: '浓郁的味道' }, { en: 'flavor of...', zh: '……的味道/特色' }],
            
            extraExamples: [
              { en: 'The food has a strange flavor.', zh: '这食物味道很怪。' },
              { en: 'The story has a romantic flavor.', zh: '这个故事带浪漫色彩。' },
            ],
          }),
          w('x1u5-42', 'fertilizer', '/ˈfɜːtɪlaɪzə(r)/', 'n.', '肥料', 'They use natural fertilizer.', '社会与环境', '他们使用天然肥料。', {
            phrases: [{ en: 'chemical/organic fertilizer', zh: '化肥/有机肥' }, { en: 'spread fertilizer', zh: '撒肥料' }],
            
            extraExamples: [
              { en: 'Farmers spread fertilizer on the fields.', zh: '农民在田里施肥。' },
              { en: 'Too much fertilizer harms the soil.', zh: '肥料过多会损害土壤。' },
            ],
          }),
          w('x1u5-43', 'nutritional', '/njuˈtrɪʃənl/', 'adj.', '营养（物）的', 'Rice has high nutritional value.', '品质与状态', '大米营养价值高。', {
            phrases: [{ en: 'nutritional value', zh: '营养价值' }, { en: 'nutritional needs', zh: '营养需求' }],
            
            extraExamples: [
              { en: 'Read the nutritional information.', zh: '看一下营养成分表。' },
              { en: 'The drink has no nutritional value.', zh: '这饮料没有营养价值。' },
            ],
          }),
          w('x1u5-44', 'nutritious', '/njuˈtrɪʃəs/', 'adj.', '有营养的；营养丰富的', 'A nutritious diet is important.', '品质与状态', '营养丰富的饮食很重要。', {
            phrases: [{ en: 'nutritious food/diet', zh: '有营养的食物/饮食' }, { en: 'highly nutritious', zh: '营养丰富' }],
            
            extraExamples: [
              { en: 'Breakfast should be nutritious.', zh: '早餐要有营养。' },
              { en: 'Spinach is very nutritious.', zh: '菠菜很有营养。' },
            ],
          }),
          w('x1u5-45', 'nutrition', '/njuˈtrɪʃn/', 'n.', '营养；滋养', 'Good nutrition keeps you healthy.', '社会与环境', '良好营养让人健康。', {
            phrases: [{ en: 'good/bad nutrition', zh: '良好/不良营养' }, { en: 'nutrition facts', zh: '营养成分表' }],
            
            extraExamples: [
              { en: 'Children need good nutrition.', zh: '儿童需要良好营养。' },
              { en: 'The book is about nutrition.', zh: '这本书讲营养。' },
            ],
          }),
          w('x1u5-46', 'alleviate', '/əˈliːvieɪt/', 'vt.', '减轻；缓解', 'New rice alleviates hunger.', '行为与动作', '新水稻缓解了饥饿。', {
            phrases: [{ en: 'alleviate pain/suffering', zh: '减轻痛苦' }, { en: 'alleviate poverty', zh: '缓解贫困' }],
            
            extraExamples: [
              { en: 'The medicine alleviated the pain.', zh: '药缓解了疼痛。' },
              { en: 'We need to alleviate the problem.', zh: '我们需要缓解这个问题。' },
            ],
          }),
          w('x1u5-47', 'poverty', '/ˈpɒvəti/', 'n.', '贫穷；贫困', 'Farming helps reduce poverty.', '社会与环境', '农业有助于减少贫困。', {
            phrases: [{ en: 'live in poverty', zh: '生活贫困' }, { en: 'fight/end poverty', zh: '消除贫困' }],
            
            extraExamples: [
              { en: 'Many families live in poverty.', zh: '很多家庭生活贫困。' },
              { en: 'The program aims to reduce poverty.', zh: '这个项目旨在减贫。' },
            ],
          }),
          w('x1u5-48', 'organic', '/ɔːˈɡænɪk/', 'adj.', '有机的；不使用化肥的；有机物的', 'Organic food is popular.', '社会与环境', '有机食品很受欢迎。', {
            phrases: [{ en: 'organic food/farming', zh: '有机食品/有机农业' }, { en: 'organic chemistry', zh: '有机化学' }],
            
            extraExamples: [
              { en: 'She only buys organic vegetables.', zh: '她只买有机蔬菜。' },
              { en: 'Organic farming avoids chemicals.', zh: '有机农业不用化学品。' },
            ],
          }),
          w('x1u5-49', 'pesticide', '/ˈpestɪsaɪd/', 'n.', '杀虫剂；除害药物', 'Pesticide use is controlled.', '社会与环境', '杀虫剂使用受控制。', {
            phrases: [{ en: 'spray pesticides', zh: '喷杀虫剂' }, { en: 'pesticide residue', zh: '农药残留' }],
            
            extraExamples: [
              { en: 'Farmers spray pesticide on crops.', zh: '农民给庄稼喷农药。' },
              { en: 'Pesticides can harm bees.', zh: '农药会伤害蜜蜂。' },
            ],
          }),
          w('x1u5-50', 'widespread', '/ˈwaɪdspred/', 'adj.', '分布广的；普遍的；广泛的', 'The method became widespread.', '品质与状态', '这个方法广泛传播。', {
            phrases: [{ en: 'widespread use/concern', zh: '广泛使用/普遍担忧' }, { en: 'widespread damage', zh: '大面积破坏' }],
            
            extraExamples: [
              { en: 'The disease is widespread in Africa.', zh: '这种病在非洲很普遍。' },
              { en: 'There is widespread support for the plan.', zh: '这个计划获得广泛支持。' },
            ],
          }),
          w('x1u5-51', 'bacterium', '/bækˈtɪəriəm/', 'n.', '细菌', 'Some bacteria help the soil.', '社会与环境', '有些细菌对土壤有益。', {
            phrases: [{ en: 'harmful/beneficial bacteria', zh: '有害/有益细菌' }, { en: 'bacteria grow', zh: '细菌生长' }],
            
            extraExamples: [
              { en: 'Bacteria can cause disease.', zh: '细菌会引起疾病。' },
              { en: 'Some bacteria are good for you.', zh: '有些细菌对你有益。' },
            ],
          }),
          w('x1u5-52', 'in turn', '/ɪn tɜːn/', 'phr.', '相应地；转而；依次；轮流', 'This in turn improves the soil.', '认知与学术', '这反过来改善土壤。', {
            phrases: [{ en: 'in turn, ...', zh: '反过来/继而……' }, { en: 'take turns (to do)', zh: '轮流做' }],
            
            extraExamples: [
              { en: 'Stress causes illness, which in turn lowers work.', zh: '压力导致疾病，继而降低工作效率。' },
              { en: 'We looked after the baby in turn.', zh: '我们轮流照看宝宝。' },
            ],
          }),
          w('x1u5-53', 'digest', '/daɪˈdʒest/', 'v.', '消化；领会；领悟 n. 摘要；文摘', 'Plants digest nutrients.', '行为与动作', '植物吸收养分。', {
            phrases: [{ en: 'digest food', zh: '消化食物' }, { en: 'digest sth. well', zh: '很好地理解某事' }],
            
            extraExamples: [
              { en: 'Chew your food well to digest it.', zh: '细嚼慢咽好消化。' },
              { en: 'It took me a while to digest the news.', zh: '我过了一会儿才消化这个消息。' },
            ],
          }),
          w('x1u5-54', 'essential', '/ɪˈsenʃl/', 'adj.', '完全必要的；极其重要的', 'Water is essential for crops.', '品质与状态', '水对庄稼必不可少。', {
            phrases: [{ en: 'be essential for/to...', zh: '对……必不可少' }, { en: 'essential oils', zh: '精油' }],
            
            extraExamples: [
              { en: 'Sleep is essential for health.', zh: '睡眠对健康必不可少。' },
              { en: 'Experience is essential for this job.', zh: '这个工作需要经验。' },
            ],
          }),
          w('x1u5-55', 'mineral', '/ˈmɪnərəl/', 'n.', '矿物；矿物质', 'Soil contains minerals.', '社会与环境', '土壤含矿物质。', {
            phrases: [{ en: 'mineral water', zh: '矿泉水' }, { en: 'minerals and vitamins', zh: '矿物质和维生素' }],
            
            extraExamples: [
              { en: 'Milk is rich in minerals.', zh: '牛奶富含矿物质。' },
              { en: 'The country exports minerals.', zh: '这个国家出口矿物。' },
            ],
          }),
          w('x1u5-56', 'alternative', '/ɔːlˈtɜːnətɪv/', 'n.', '可供选择的事物 adj. 可供替代的；非传统的', 'Organic farming is an alternative.', '认知与学术', '有机农业是一种替代方案。', {
            phrases: [{ en: 'an alternative to...', zh: '……的替代品' }, { en: 'alternative energy', zh: '替代能源' }],
            
            extraExamples: [
              { en: 'Is there an alternative to this plan?', zh: '这个计划有别的选择吗？' },
              { en: 'We need alternative energy sources.', zh: '我们需要替代能源。' },
            ],
          }),
          w('x1u5-57', 'grocery', '/ˈɡrəʊsəri/', 'n.', '食品杂货店；食品杂货', 'Rice is sold at the grocery.', '社会与环境', '杂货店卖大米。', {
            phrases: [{ en: 'a grocery store', zh: '杂货店' }, { en: 'grocery shopping', zh: '买食品杂货' }],
            
            extraExamples: [
              { en: "I'm going to the grocery store.", zh: '我要去杂货店。' },
              { en: 'We buy groceries once a week.', zh: '我们每周买一次食品杂货。' },
            ],
          }),
          w('x1u5-58', 'instance', '/ˈɪnstəns/', 'n.', '例子；实例；事例', 'This is a good instance.', '认知与学术', '这是个好例子。', {
            phrases: [{ en: 'for instance', zh: '例如' }, { en: 'in this instance', zh: '在这种情况下' }],
            
            extraExamples: [
              { en: 'For instance, take water.', zh: '例如，拿水来说。' },
              { en: 'There are many instances of success.', zh: '成功的例子有很多。' },
            ],
          }),
          w('x1u5-59', 'depth', '/depθ/', 'n.', '向下（或向里）的距离；深（度）', 'The depth of the soil matters.', '认知与学术', '土壤深度很重要。', {
            phrases: [{ en: 'the depth of...', zh: '……的深度' }, { en: 'in depth', zh: '深入地' }],
            
            extraExamples: [
              { en: 'The depth of the lake is 20 meters.', zh: '湖深20米。' },
              { en: 'We discussed the problem in depth.', zh: '我们深入讨论了这个问题。' },
            ],
          }),
          w('x1u5-60', 'root', '/ruːt/', 'n.', '根；根茎；根部；根源', 'Plant roots go deep.', '社会与环境', '植物根扎得深。', {
            phrases: [{ en: 'the root cause', zh: '根本原因' }, { en: 'take root', zh: '生根；扎根' }],
            
            extraExamples: [
              { en: 'The roots of the tree go deep.', zh: '树根扎得很深。' },
              { en: 'We must get to the root of the problem.', zh: '我们必须找到问题的根源。' },
            ],
          }),
          w('x1u5-61', 'entirely', '/ɪnˈtaɪəli/', 'adv.', '全部地；完整地；完全地', 'The field is entirely planted.', '认知与学术', '田地全部种上了。', {
            phrases: [{ en: 'entirely new/different', zh: '全新的/完全不同的' }, { en: 'not entirely', zh: '不完全是' }],
            
            extraExamples: [
              { en: 'I entirely agree with you.', zh: '我完全同意你。' },
              { en: 'The plan is entirely new.', zh: '这个计划是全新的。' },
            ],
          }),
          w('x1u5-62', 'aspect', '/ˈæspekt/', 'n.', '方面；层面', 'Every aspect matters.', '认知与学术', '每个方面都重要。', {
            phrases: [{ en: 'every aspect of...', zh: '……的每个方面' }, { en: 'in this aspect', zh: '在这方面' }],
            
            extraExamples: [
              { en: 'We studied every aspect of the problem.', zh: '我们研究了问题的各个方面。' },
              { en: 'The plan is good in all aspects.', zh: '这个计划各方面都好。' },
            ],
          }),
        ],
      },
    ],
  },
  // 大学
  {
    id: 'cet4',
    name: '大学四级 CET-4',
    stage: '大学英语',
    wordCount: CET4_WORDS.length,
    builtin: true,
    desc: '已内置 24 个四级高频词',
    units: [
      { id: 'cet4-u1', title: 'Unit 1 · 四级高频词', words: CET4_WORDS.slice(0, 12) },
      { id: 'cet4-u2', title: 'Unit 2 · 四级高频词', words: CET4_WORDS.slice(12) },
    ],
  },
  {
    id: 'cet6',
    name: '大学六级 CET-6',
    stage: '大学英语',
    wordCount: VOCAB_WORDS.length,
    builtin: true,
    desc: '已内置 150 个六级核心高频词',
    units: CET6_UNITS,
  },
  // 考研
  {
    id: 'kaoyan',
    name: '考研英语（大纲词汇）',
    stage: '考研英语',
    wordCount: KAOYAN_WORDS.length,
    builtin: true,
    desc: '已内置 22 个考研核心词',
    units: [
      { id: 'kaoyan-u1', title: 'Unit 1 · 考研核心词汇', words: KAOYAN_WORDS.slice(0, 11) },
      { id: 'kaoyan-u2', title: 'Unit 2 · 考研核心词汇', words: KAOYAN_WORDS.slice(11) },
    ],
  },
  // 成人
  {
    id: 'adult',
    name: '成人高等教育本科英语',
    stage: '成人本科',
    wordCount: ADULT_WORDS.length,
    builtin: true,
    desc: '已内置 16 个成人本科词',
    units: [{ id: 'adult-u1', title: 'Unit 1 · 成人本科词汇', words: ADULT_WORDS }],
  },
  // 英语专业
  {
    id: 'tem4',
    name: '英语专业四级 TEM-4',
    stage: '大学英语',
    wordCount: 6,
    builtin: true,
    desc: '专四核心词汇（真实教材词表由定时任务逐步导入）',
    units: [{
      id: 'tem4-u1', title: 'Unit 1 · 专四核心词汇', words: [
        w('t4-1', 'abandon', '/əˈbændən/', 'v.', '放弃；抛弃', 'He never abandons his dream.', '行为与动作', '他从不放弃梦想。'),
        w('t4-2', 'accommodate', '/əˈkɒmədeɪt/', 'v.', '容纳；使适应', 'The hall can accommodate 500 people.', '行为与动作', '这个大厅可容纳五百人。'),
        w('t4-3', 'accumulate', '/əˈkjuːmjəleɪt/', 'v.', '积累；积聚', 'Knowledge accumulates over time.', '行为与动作', '知识随时间积累。'),
        w('t4-4', 'ambiguous', '/æmˈbɪɡjuəs/', 'adj.', '模棱两可的；含糊的', 'His answer was ambiguous.', '品质与状态', '他的回答模棱两可。'),
        w('t4-5', 'anonymous', '/əˈnɒnɪməs/', 'adj.', '匿名的', 'The letter was anonymous.', '品质与状态', '这封信是匿名的。'),
        w('t4-6', 'vulnerable', '/ˈvʌlnərəbl/', 'adj.', '易受伤害的；脆弱的', 'Children are vulnerable to diseases.', '品质与状态', '儿童易受疾病侵害。'),
      ],
    }],
  },
  {
    id: 'tem8',
    name: '英语专业八级 TEM-8',
    stage: '大学英语',
    wordCount: 6,
    builtin: true,
    desc: '专八核心词汇（真实教材词表由定时任务逐步导入）',
    units: [{
      id: 'tem8-u1', title: 'Unit 1 · 专八核心词汇', words: [
        w('t8-1', 'bureaucracy', '/bjʊəˈrɒkrəsi/', 'n.', '官僚机构；官僚主义', 'The bureaucracy slowed the project.', '社会与环境', '官僚体制拖慢了项目。'),
        w('t8-2', 'consensus', '/kənˈsensəs/', 'n.', '共识；一致同意', 'They reached a consensus.', '认知与学术', '他们达成了共识。'),
        w('t8-3', 'deteriorate', '/dɪˈtɪəriəreɪt/', 'v.', '恶化；变坏', 'His health deteriorated rapidly.', '品质与状态', '他的健康迅速恶化。'),
        w('t8-4', 'phenomenon', '/fəˈnɒmɪnən/', 'n.', '现象', 'It is a natural phenomenon.', '认知与学术', '这是一种自然现象。'),
        w('t8-5', 'sophisticated', '/səˈfɪstɪkeɪtɪd/', 'adj.', '复杂的；精致的', 'This is a sophisticated system.', '品质与状态', '这是一个复杂的系统。'),
        w('t8-6', 'unprecedented', '/ʌnˈpresɪdentɪd/', 'adj.', '前所未有的', 'It was an unprecedented event.', '品质与状态', '这是一次前所未有的活动。'),
      ],
    }],
  },
  // 新概念
  {
    id: 'nc1',
    name: '新概念英语第一册',
    stage: '新概念英语',
    wordCount: NC1_WORDS.length,
    builtin: true,
    desc: '已内置 16 个基础词',
    units: [{ id: 'nc1-u1', title: 'Unit 1 · 新概念基础词汇', words: NC1_WORDS }],
  },
  {
    id: 'nc2',
    name: '新概念英语第二册',
    stage: '新概念英语',
    wordCount: NC2_WORDS.length,
    builtin: true,
    desc: '已内置 20 个核心词',
    units: [{ id: 'nc2-u1', title: 'Unit 1 · 新概念核心词汇', words: NC2_WORDS }],
  },
  // 云词库
  { id: 'cloud', name: '云词库', stage: '云词库', wordCount: 3, builtin: false },
];

// 按阶段分组（保留展示顺序）
export function groupBooksByStage(
  books: VocabBook[] = VOCAB_BOOKS,
  stages: string[] = BOOK_STAGES,
): Array<{ stage: string; books: VocabBook[] }> {
  return stages.map((stage) => ({
    stage,
    books: books.filter((b) => b.stage === stage),
  })).filter((g) => g.books.length > 0);
}

// 取某本书的全部词（内置书），供学习/列表页使用
export function bookWords(book: VocabBook): IVocabWord[] {
  return book.units ? book.units.flatMap((u) => u.words) : [];
}

export const DEFAULT_BOOK_ID = 'cet6';
