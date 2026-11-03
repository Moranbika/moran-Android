# -*- coding: utf-8 -*-
"""一次性给 senior-xb1 U1 的 x1u1-7 ~ x1u1-58 注入 extra 数据。"""
import re, io, sys, os

path = r"C:\Users\Moranbika\Doubao\chats\2026-10-07\new-chat-2\cet6-practice\src\data\books.ts"

extra = {
"x1u1-7": {
  "phrases":[("commit oneself to (doing) sth.","致力于某事"),("commit a crime/mistake","犯罪/犯错")],
  "mnemonic":"com-（一起）+ mit（送，同 mission）→ 把自己送出去 → 承诺、投入。",
  "ex":[("They committed to finishing on time.","他们承诺按时完成。"),("Don’t commit more than you can deliver.","别承诺做不到的事。")],
},
"x1u1-8": {
  "phrases":[("the Academy of Sciences","科学院"),("a military academy","军事学院")],
  "mnemonic":"源自希腊哲学家 Plato 在 Akademia 花园讲学 → 学院、研究院。",
  "ex":[("She studied at a police academy.","她在警察学院学习。"),("The academy awards are held in March.","颁奖典礼在三月举行。")],
},
"x1u1-9": {
  "phrases":[("academic performance/year","学业表现/学年"),("academic research","学术研究")],
  "mnemonic":"academy（学院）+ -ic → 学院的 → 学术的。",
  "ex":[("Her academic record is outstanding.","她的学业成绩优异。"),("There are no easy academic answers.","学术上没有简单答案。")],
},
"x1u1-10": {
  "phrases":[("achieve/set an objective","实现/设定目标"),("an objective analysis","客观分析")],
  "mnemonic":"object（物体）+ -ive → 摆在面前的东西 → 目标；反义 subjective（主观的）。",
  "ex":[("Our main objective is profit.","我们的主要目标是盈利。"),("Try to be objective about it.","对此要尽量客观。")],
},
"x1u1-11": {
  "phrases":[("a botanical garden","植物园"),("botanical research","植物学研究")],
  "mnemonic":"botan（草，希腊语 botane）+ -ical → 草的 → 植物学的。名词 botany。",
  "ex":[("We visited the botanical garden.","我们参观了植物园。"),("She has a botanical background.","她有植物学背景。")],
},
"x1u1-12": {
  "phrases":[("evaluate the effect/performance","评估效果/表现"),("evaluate options","评估选项")],
  "mnemonic":"e-（出）+ valu（价值，同 value）+ -ate → 估出价值 → 评估。名词 evaluation。",
  "ex":[("We need to evaluate the results.","我们需要评估结果。"),("The doctor evaluated his condition.","医生评估了他的病情。")],
},
"x1u1-13": {
  "phrases":[("chemical/physical properties","化学/物理性质"),("private property","私有财产")],
  "mnemonic":"proper（自己的）+ -ty → 自己的东西 → 财产；引申为「性质」。",
  "ex":[("The material has special properties.","这种材料有特殊性质。"),("That is private property.","那是私有财产。")],
},
"x1u1-14": {
  "phrases":[("be distinct from...","与……不同"),("a distinct advantage","明显优势")],
  "mnemonic":"di-（分开）+ stinct（刺，同 sting）→ 刺出标记 → 有区别的。动词 distinguish。",
  "ex":[("There are two distinct types.","有两种截然不同的类型。"),("The two ideas are quite distinct.","这两个想法截然不同。")],
},
"x1u1-15": {
  "phrases":[("extract sth. from sth.","从……中提取……"),("vanilla extract","香草精")],
  "mnemonic":"ex-（出）+ tract（拉，同 tractor）→ 拉出来 → 提取。",
  "ex":[("They extracted oil from the seeds.","他们从种子中榨油。"),("Read the extract on page 10.","读第10页的摘录。")],
},
"x1u1-16": {
  "phrases":[("sweet wormwood / Artemisia annua","黄花蒿（青蒿）"),("wormwood oil","蒿油")],
  "mnemonic":"worm（虫）+ wood（木）→ 传说这种草能驱蛔虫 → 蒿草。屠呦呦从黄花蒿中提取青蒿素。",
  "ex":[("Wormwood is the source of artemisinin.","黄花蒿是青蒿素的来源。"),("The tea tastes like wormwood.","这茶有蒿草味。")],
},
"x1u1-17": {
  "phrases":[("boil the kettle","烧开水"),("bring to the boil","煮沸")],
  "mnemonic":"拟声词，水咕嘟咕嘟开了。",
  "ex":[("The water is boiling.","水开了。"),("She boiled an egg for breakfast.","她早餐煮了个鸡蛋。")],
},
"x1u1-18": {
  "phrases":[("liquid food/diet","流质食物"),("clear liquid","清流质")],
  "mnemonic":"liqu（湿，同 liquor）+ -id → 液态的。",
  "ex":[("The bottle contains a clear liquid.","瓶子里装着透明液体。"),("Wash with liquid soap.","用洗手液洗。")],
},
"x1u1-19": {
  "phrases":[("obtain permission/information","获得许可/信息"),("obtain a degree","获得学位")],
  "mnemonic":"ob-（加强）+ tain（握，同 maintain）→ 握住 → 获得。",
  "ex":[("Further information can be obtained online.","更多信息可在网上获取。"),("He obtained a scholarship.","他获得了奖学金。")],
},
"x1u1-20": {
  "phrases":[("acknowledge sth. as...","承认……为……"),("acknowledge the applause","答谢掌声")],
  "mnemonic":"ac-（去）+ knowledge（知识）→ 让人知道 → 承认、致谢。",
  "ex":[("He acknowledged that he was wrong.","他承认自己错了。"),("She acknowledged the donation in her speech.","她在演讲中感谢了捐款。")],
},
"x1u1-21": {
  "phrases":[("defeat an opponent","击败对手"),("admit defeat","承认失败")],
  "mnemonic":"de-（向下）+ feat（做，同 effect）→ 打下去 → 击败。",
  "ex":[("Our team defeated theirs 3-1.","我们队3比1击败了他们。"),("They refused to admit defeat.","他们拒绝认输。")],
},
"x1u1-22": {
  "phrases":[("analyse the data/results","分析数据/结果"),("carefully analyse","仔细分析")],
  "mnemonic":"ana-（分开）+ lyse（松开，同 loose）→ 拆开 → 分析。名词 analysis。",
  "ex":[("We need to analyse the problem.","我们需要分析这个问题。"),("The samples were analysed in the lab.","样本在实验室分析。")],
},
"x1u1-23": {
  "phrases":[("apparently obvious","显然"),("Apparently not.","显然不是。")],
  "mnemonic":"appear（出现）+ -ent + -ly → 一眼能看出来 → 显然。",
  "ex":[("He has apparently changed his mind.","他显然改变了主意。"),("Apparently, they do not care.","看来他们不在乎。")],
},
"x1u1-24": {
  "phrases":[("a chemical/harmful substance","化学/有害物质"),("in substance","本质上")],
  "mnemonic":"sub-（下面）+ st（站）+ -ance → 站在下面的东西 → 实体、物质。",
  "ex":[("Sugar is a natural substance.","糖是天然物质。"),("There is no substance to his claims.","他的说法毫无根据。")],
},
"x1u1-25": {
  "phrases":[("insist on (doing) sth.","坚持做某事"),("insist that...","坚决要求……")],
  "mnemonic":"in-（加强）+ sist（站，同 stand）→ 站着不动 → 坚持。",
  "ex":[("She insisted on going alone.","她坚持独自去。"),("He insisted that I stay for dinner.","他一定要我留下吃饭。")],
},
"x1u1-26": {
  "phrases":[("scientific research/evidence","科学研究/证据"),("a scientific approach","科学方法")],
  "mnemonic":"science（科学）的形容词形式。",
  "ex":[("There is no scientific proof.","没有科学证据。"),("They took a scientific approach.","他们采用了科学方法。")],
},
"x1u1-27": {
  "phrases":[("mostly about...","主要是关于……"),("mostly young people","大多是年轻人")],
  "mnemonic":"most（大部分）+ -ly → 主要地。",
  "ex":[("The audience was mostly women.","观众大多是女性。"),("She is mostly out on weekends.","她周末多半不在家。")],
},
"x1u1-28": {
  "phrases":[("reach/draw a conclusion","得出结论"),("in conclusion","总之")],
  "mnemonic":"con-（一起）+ clus（关，同 close）+ -ion → 关到一起 → 结论。动词 conclude。",
  "ex":[("What conclusion did you reach?","你得出了什么结论？"),("In conclusion, I would like to thank you.","总之，我要感谢大家。")],
},
"x1u1-29": {
  "phrases":[("penicillin allergy","青霉素过敏"),("discover penicillin","发现青霉素")],
  "mnemonic":"由 Fleming 从青霉（penicillium）中发现 → -in（素）。",
  "ex":[("Fleming discovered penicillin by accident.","弗莱明偶然发现了青霉素。"),("She is allergic to penicillin.","她对青霉素过敏。")],
},
"x1u1-30": {
  "phrases":[("flee the country/city","逃离国家/城市"),("flee from sth.","从……逃走")],
  "mnemonic":"flee = fly（飞）变体 → 飞走 = 逃跑。过去式 fled。",
  "ex":[("They fled from the burning house.","他们从着火的房子里逃出来。"),("He fled to France.","他逃到了法国。")],
},
"x1u1-31": {
  "phrases":[("under no circumstances","决不"),("under the circumstances","在这种情况下")],
  "mnemonic":"circum-（周围）+ st（站）+ -ance → 周围站着的东西 → 环境、状况。",
  "ex":[("Due to circumstances beyond our control...","由于我们无法控制的情况……"),("Under no circumstances should you open this door.","任何情况下都不要打开这扇门。")],
},
"x1u1-32": {
  "phrases":[("a famous/leading novelist","著名小说家"),("a historical novelist","历史小说家")],
  "mnemonic":"novel（小说）+ -ist（人）→ 写小说的人。",
  "ex":[("Dickens was a great novelist.","狄更斯是伟大的小说家。"),("She is a successful novelist.","她是成功的小说家。")],
},
"x1u1-33": {
  "phrases":[("a historical novel","历史小说"),("a novel idea/approach","新奇的想法/方法")],
  "mnemonic":"nov（新，同 novice 新手）+ -el → 新奇的；名词「小说」即「新奇的故事」。",
  "ex":[("It’s a novel solution to an old problem.","这是老问题的新解法。"),("She spent a year writing her first novel.","她花了一年写第一部小说。")],
},
"x1u1-34": {
  "phrases":[("the flow of...","……的流动"),("cash flow","现金流")],
  "mnemonic":"拟声，水流声。",
  "ex":[("The river flows into the sea.","这条河流入大海。"),("She slowed the flow of traffic.","她让车流慢下来。")],
},
"x1u1-35": {
  "phrases":[("a bar/pie chart","柱状/饼状图"),("chart a course","规划路线")],
  "mnemonic":"chart 原指航海图，引申为图表。",
  "ex":[("The chart shows sales over time.","图表显示了销售随时间变化。"),("The song topped the charts.","这首歌登上排行榜榜首。")],
},
"x1u1-36": {
  "phrases":[("found a company/school","创办公司/学校"),("be founded on...","建立在……基础上")],
  "mnemonic":"found 既是 find 的过去式，也是独立动词「建立」。名词 foundation。",
  "ex":[("The city was founded in 1624.","这座城市建于1624年。"),("The story is founded on fact.","这个故事基于事实。")],
},
"x1u1-37": {
  "phrases":[("infer sth. from sth.","从……推断……"),("it can be inferred that...","可以推断……")],
  "mnemonic":"in-（进入）+ fer（带，同 transfer）→ 带进来 → 推断。名词 inference。",
  "ex":[("What can we infer from his words?","从他的话中我们能推断出什么？"),("I inferred that she was unhappy.","我推测她不开心。")],
},
"x1u1-38": {
  "phrases":[("a career politician","职业政客"),("a local politician","地方政客")],
  "mnemonic":"politic（政治的）+ -ian（人）→ 从政者。",
  "ex":[("The politician refused to comment.","这位政客拒绝评论。"),("He was a shrewd politician.","他是个精明的政客。")],
},
"x1u1-39": {
  "phrases":[("numerous attempts/reasons","多次尝试/众多原因"),("on numerous occasions","多次")],
  "mnemonic":"numer（数，同 number）+ -ous → 数不过来的 → 众多的。",
  "ex":[("She has written numerous books.","她写了很多书。"),("Numerous problems remain.","仍有许多问题。")],
},
"x1u1-40": {
  "phrases":[("in theory","理论上"),("the theory of relativity","相对论")],
  "mnemonic":"theor（看，同 theatre）+ -y → 看法 → 理论。形容词 theoretical。",
  "ex":[("In theory, the plan works.","理论上这计划可行。"),("Darwin’s theory changed biology.","达尔文的理论改变了生物学。")],
},
"x1u1-41": {
  "phrases":[("the theory of relativity","相对论"),("general/special relativity","广义/狭义相对论")],
  "mnemonic":"relative（相对的）+ -ity → 相对性。",
  "ex":[("Einstein published relativity in 1905.","爱因斯坦1905年发表相对论。"),("Relativity changed physics.","相对论改变了物理学。")],
},
"x1u1-42": {
  "phrases":[("a mathematical formula","数学公式"),("a winning formula","成功模式")],
  "mnemonic":"form（形式）+ -ula（小）→ 小形式 → 公式。复数 formulae/formulas。",
  "ex":[("He wrote down the chemical formula.","他写下了化学式。"),("There is no magic formula for success.","成功没有魔法公式。")],
},
"x1u1-43": {
  "phrases":[("a stroke of genius","神来之笔"),("have a genius for sth.","有……天赋")],
  "mnemonic":"源自罗马神话守护神 Genii → 天赋 → 天才。",
  "ex":[("Einstein was a mathematical genius.","爱因斯坦是数学天才。"),("She has a genius for music.","她有音乐天赋。")],
},
"x1u1-44": {
  "phrases":[("a gentle voice/touch","温柔的声音/抚摸"),("gentle wind/rain","和风/细雨")],
  "mnemonic":"gent（出身好，同 gentleman）+ -le → 出身高贵的人举止优雅 → 温柔的。",
  "ex":[("Be gentle with the baby.","对宝宝温柔点。"),("The breeze was gentle.","微风轻轻。")],
},
"x1u1-45": {
  "phrases":[("apply for a patent","申请专利"),("patent protection","专利保护")],
  "mnemonic":"pat（公开，同 open）+ -ent → 公开独占的权利 → 专利。",
  "ex":[("The company holds 50 patents.","这家公司拥有50项专利。"),("He patented the invention in 1990.","他1990年为这项发明申请了专利。")],
},
"x1u1-46": {
  "phrases":[("have a passion for sth.","酷爱……"),("speak with passion","充满激情地说")],
  "mnemonic":"pass（感受，同 passive）+ -ion → 强烈的感受 → 激情。形容词 passionate。",
  "ex":[("She has a passion for gardening.","她酷爱园艺。"),("He spoke with great passion.","他讲得充满激情。")],
},
"x1u1-47": {
  "phrases":[("receive/obtain a doctorate","获得博士学位"),("a doctorate in physics","物理学博士学位")],
  "mnemonic":"doctor（博士）+ -ate（学位）→ 博士学位。",
  "ex":[("She got her doctorate in 2010.","她2010年获得博士学位。"),("He is studying for a doctorate.","他在读博士。")],
},
"x1u1-48": {
  "phrases":[("an extraordinary achievement","非凡成就"),("extraordinary beauty","非凡的美")],
  "mnemonic":"extra-（超出）+ ordinary（普通的）→ 超出普通的 → 非凡的。",
  "ex":[("She has an extraordinary voice.","她嗓音超凡。"),("An extraordinary thing happened.","发生了一件不寻常的事。")],
},
"x1u1-49": {
  "phrases":[("gradually improve/change","逐渐改善/变化"),("get gradually worse","逐渐变差")],
  "mnemonic":"grade（步/级）+ -ual + -ly → 一步一步地 → 逐渐地。",
  "ex":[("The pain gradually lessened.","疼痛逐渐减轻。"),("She gradually recovered.","她渐渐康复。")],
},
"x1u1-50": {
  "phrases":[("a financial/educational institution","金融/教育机构"),("the institution of marriage","婚姻制度")],
  "mnemonic":"in-（进入）+ stitute（站，同 stand）+ -ion → 建立起来的机构 → 机构。",
  "ex":[("A bank is a financial institution.","银行是金融机构。"),("The family is the oldest social institution.","家庭是最古老的社会制度。")],
},
"x1u1-51": {
  "phrases":[("face the consequences","承担后果"),("as a consequence","因此")],
  "mnemonic":"con-（一起）+ sequ（跟随，同 sequence）+ -ence → 跟随着来的东西 → 后果。",
  "ex":[("He must take the consequences.","他必须承担后果。"),("As a consequence, he lost his job.","结果他丢了工作。")],
},
"x1u1-52": {
  "phrases":[("encounter difficulties/problems","遇到困难/问题"),("a chance encounter","偶遇")],
  "mnemonic":"en-（进入）+ counter（对面）→ 面对面 → 邂逅。",
  "ex":[("I encountered an old friend today.","我今天偶遇一位老朋友。"),("She encountered many difficulties.","她遇到很多困难。")],
},
"x1u1-53": {
  "phrases":[("a professor of...","……教授"),("associate/assistant professor","副/助理教授")],
  "mnemonic":"pro-（公开）+ fess（说，同 confess）+ -or → 公开讲学的人 → 教授。",
  "ex":[("She is a professor of law.","她是法学教授。"),("The professor arrived late.","教授来晚了。")],
},
"x1u1-54": {
  "phrases":[("mourn for/over sb.","哀悼某人"),("mourn the loss of...","为失去……而哀伤")],
  "mnemonic":"mourn 发音像「默哀」。",
  "ex":[("The whole nation mourned her death.","全国哀悼她的逝世。"),("She mourned her lost youth.","她为逝去的青春哀伤。")],
},
"x1u1-55": {
  "phrases":[("a remarkable achievement","非凡成就"),("be remarkable for...","因……而引人注目")],
  "mnemonic":"remark（注意）+ -able → 值得注意的 → 非凡的。",
  "ex":[("She made remarkable progress.","她取得了显著进步。"),("The view is remarkable.","景色非凡。")],
},
"x1u1-56": {
  "phrases":[("an electronic device","电子设备"),("a device for doing sth.","做某事的装置")],
  "mnemonic":"de-（分开）+ vis（分，同 divide）+ -e → 分出的东西 → 装置。注意与 devise（设计，动词）区分。",
  "ex":[("The device is easy to use.","这个装置很好用。"),("Turn off all electronic devices.","关掉所有电子设备。")],
},
"x1u1-57": {
  "phrases":[("sum up","总结"),("a large sum of money","一大笔钱")],
  "mnemonic":"sum（总数）→ 引申为总结。",
  "ex":[("Let me sum up.","我来总结一下。"),("He paid a large sum for the car.","他花大价钱买了这辆车。")],
},
"x1u1-58": {
  "phrases":[("a rough/first draft","初稿/草稿"),("draft a letter/plan","起草信件/计划")],
  "mnemonic":"draft 原义「牵引」，引申为「牵引出稿子」→ 草稿。",
  "ex":[("She’s revising her first draft.","她在修改初稿。"),("He drafted a letter to the editor.","他给编辑写了封信草稿。")],
},
}

with io.open(path, "r", encoding="utf-8") as f:
    text = f.read()

def render_extra(e):
    parts = []
    parts.append("phrases: [")
    for en, zh in e["phrases"]:
        parts.append("              { en: '%s', zh: '%s' }," % (en.replace("'", "\\'"), zh))
    parts.append("            ],")
    parts.append("mnemonic: '%s'," % e["mnemonic"].replace("'", "\\'"))
    parts.append("extraExamples: [")
    for en, zh in e["ex"]:
        parts.append("              { en: '%s', zh: '%s' }," % (en.replace("'", "\\'"), zh))
    parts.append("            ],")
    return "          },\n".join(parts)

count = 0
for wid, e in extra.items():
    # 匹配以 w('<wid>', ...), 结尾的一行（尚未带 extra 的）
    # 行尾形如 '...中文释义。"),'
    pattern = re.compile(
        r"(          w\('%s',.*?\))(,\n)" % re.escape(wid),
        re.DOTALL,
    )
    m = pattern.search(text)
    if not m:
        print("NOT FOUND:", wid)
        continue
    # 已带 extra 的行后面会是 ', {' 而非 '),\n'，这里只替换 ",\n" 结尾
    old_tail = m.group(0)
    new_block = m.group(1) + ", {\n            " + "\n            ".join(render_extra(e).split("\n")) + "\n          }),\n"
    # render_extra 末尾已经以 "},\n" 结束；上面再包一层会重复，简单点：
    # 重新生成：
    body = "phrases: [\n"
    for en, zh in e["phrases"]:
        body += "              { en: '%s', zh: '%s' },\n" % (en.replace("'", "\\'"), zh)
    body += "            ],\n"
    body += "            mnemonic: '%s',\n" % e["mnemonic"].replace("'", "\\'")
    body += "            extraExamples: [\n"
    for en, zh in e["ex"]:
        body += "              { en: '%s', zh: '%s' },\n" % (en.replace("'", "\\'"), zh)
    body += "            ]"
    new_block = m.group(1) + ", {\n            " + body + "\n          }),\n"
    text = text[:m.start()] + new_block + text[m.end():]
    count += 1

with io.open(path, "w", encoding="utf-8") as f:
    f.write(text)

print("DONE:", count)
