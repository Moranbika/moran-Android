import { ArrowLeft, Mail, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { cloudAccountsEnabled } from '@/lib/cloud-sync';
import { useI18n } from '@/context/i18n-context';

const CONTACT_EMAIL = '2218145697@qq.com';
const UPDATED_AT = '2026 年 11 月 2 日';
const UPDATED_AT_EN = 'November 2, 2026';

interface Section {
  title: string;
  paragraphs?: string[];
  items?: string[];
}

function LegalDocument({
  eyebrow,
  title,
  intro,
  sections,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  sections: Section[];
}) {
  const { t, language } = useI18n();
  return (
    <main className="min-h-screen px-4 py-8 text-foreground sm:px-6 sm:py-12">
      <article className="mx-auto max-w-3xl">
        <Link
          to="/login"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/80 bg-white/80 px-4 text-sm font-medium text-foreground shadow-sm backdrop-blur-xl hover:bg-white/95"
        >
          <ArrowLeft className="size-4" />
          {t('返回登录')}
        </Link>

        <Card className="app-glass app-glass-strong mt-5 rounded-[28px] border-white/70 shadow-none">
          <CardContent className="p-6 sm:p-9">
            <div className="flex items-center gap-3 text-primary">
              <span className="grid size-11 place-items-center rounded-2xl bg-primary/10">
                <ShieldCheck className="size-5" />
              </span>
              <span className="text-xs font-semibold tracking-[0.16em]">{eyebrow}</span>
            </div>
            <h1 className="mt-5 font-serif text-3xl font-normal leading-tight sm:text-4xl">{title}</h1>
            <p className="mt-3 text-sm leading-7 text-muted-foreground">{intro}</p>
            <p className="mt-2 text-xs text-muted-foreground">{language === 'en' ? `Last updated: ${UPDATED_AT_EN}` : `更新日期：${UPDATED_AT}`}</p>

            <div className="mt-8 space-y-8">
              {sections.map((section, index) => (
                <section key={section.title}>
                  <h2 className="text-lg font-semibold leading-7">
                    {index + 1}. {section.title}
                  </h2>
                  {section.paragraphs?.map((paragraph) => (
                    <p key={paragraph} className="mt-3 text-sm leading-7 text-muted-foreground">
                      {paragraph}
                    </p>
                  ))}
                  {section.items && (
                    <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-muted-foreground">
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-9 rounded-2xl border border-primary/15 bg-primary/5 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Mail className="size-4 text-primary" />
                {t('联系开发者')}
              </p>
              <p className="mt-2 text-sm leading-7 text-muted-foreground">
                {t('如对本政策、账号或数据有疑问，请发送邮件至')}{' '}
                <a className="inline-flex min-h-11 items-center font-medium text-primary underline underline-offset-4" href={`mailto:${CONTACT_EMAIL}`}>
                  {CONTACT_EMAIL}
                </a>
                {t('，我们会在核实身份后处理。')}
              </p>
              <p className="mt-2 text-xs leading-6 text-muted-foreground">
                {t('APP 备案号')}：
                <a
                  className="font-medium text-primary underline underline-offset-4"
                  href="https://beian.miit.gov.cn"
                  target="_blank"
                  rel="noreferrer"
                >
                  晋ICP备2026017079号-1A
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </article>
    </main>
  );
}

const PRIVACY_SECTIONS: Section[] = [
  {
    title: '同意方式与拒绝选择',
    paragraphs: [
      '莫兰不会通过默认勾选、默认同意或使用行为推定同意等方式取得你的同意。首次使用以及注册或登录前，应用会展示本政策和《用户协议》，并要求你主动勾选同意框后点击“同意并继续”。未勾选或点击“不同意”时，应用不会创建账号，也不会收集或上传你输入的手机号等个人信息。',
      '你可以随时停止使用，并在“设置 - 隐私与账号 - 删除账号与数据”中删除账号与数据。撤回同意不影响撤回前基于同意已进行的处理；撤回后如需继续使用，需要重新阅读并同意本政策。仅阅读隐私政策、用户协议或使用不涉及个人信息的离线内容，不需要同意本政策。',
    ],
  },
  {
    title: '功能与数据处理说明',
    paragraphs: [
      '莫兰当前版本提供通用英语词汇学习和学习记录功能。学习数据优先保存在设备本地。',
      '商店页面、应用内介绍和本政策应保持一致。若未来增加需要联网或自动化处理的新功能，莫兰会在启用前更新本政策、应用内说明和商店介绍，并按适用法律重新取得必要同意。',
    ],
  },
  {
    title: '适用范围',
    paragraphs: [
      '本政策适用于莫兰英语词汇学习应用（以下简称“莫兰”）。莫兰提供词汇学习与学习记录功能。正式发布主体、应用商店页面所列运营者和联系方式以上架信息为准。',
      cloudAccountsEnabled
        ? '用户注册和登录时，莫兰会把手机号和密码摘要发送到莫兰账号服务，用于阻止重复注册、验证登录和管理员协助重置密码。服务器不保存明文密码，也无法展示用户原密码。'
        : '公开商店版本使用本机账号：手机号和不可逆密码摘要只保存在当前设备，不会发送到莫兰账号服务器，也不会跨设备同步。',
      '当前公开商店版本随安装包提供内置词书，并会向 moranenglish.cn 请求内容版本与更新包；请求只包含内容版本号和防缓存参数，不包含手机号、账号或学习进度。',
    ],
  },
  {
    title: '处理的数据',
    items: [
      cloudAccountsEnabled
        ? '账号数据：用户输入的手机号、本机与服务器分别保存的不可逆密码摘要、注册时间和登录状态。莫兰不会保存明文密码。'
        : '账号数据：用户输入的手机号、本机保存的不可逆密码摘要、注册时间和登录状态；这些数据只保存在当前设备。莫兰不会保存明文密码。',
      '学习数据：所学单词、收藏、复习记录、学习时长、打卡日期和偏好设置。',
      '设备与技术数据：为保障应用运行而产生的崩溃和诊断信息、应用版本、操作系统类型。设备授权默认关闭；只有明确启用授权的私有构建会使用经过不可逆摘要处理的设备码进行校验。公开商店版不会启用设备授权校验。',
      cloudAccountsEnabled
        ? '网络数据：账号服务会记录账号、同步内容、请求时间、必要的网络日志和用于防止滥用的 IP 地址。'
        : '网络数据：内容更新服务会收到访问所必需的 IP 地址、请求时间和内容版本号；第三方发音服务会收到访问所必需的 IP 地址与技术信息。本机账号不会上传手机号或学习进度。',
    ],
  },
  {
    title: '数据用途与保存位置',
    paragraphs: [
      '莫兰使用上述数据提供学习功能、保存进度、恢复登录状态、排查故障、保障服务安全和履行法律义务，不将数据用于个性化广告或出售。',
      cloudAccountsEnabled
        ? '学习记录默认保存在当前设备的应用数据目录，账号与必要的同步数据保存在莫兰服务器。卸载应用或清除应用数据可能导致本地记录不可恢复。'
        : '账号与学习记录都保存在当前设备的应用数据目录，不使用云端账号或同步服务。卸载应用或清除应用数据会导致本地账号与记录不可恢复。',
    ],
  },
  {
    title: '第三方服务',
    paragraphs: [
      '单词发音在联网时可能请求有道词典的公开发音服务。请求时，对方可能收到访问所必需的 IP 地址、设备或浏览器技术信息，并按其自身隐私政策处理数据。',
      '内容更新由 moranenglish.cn 提供。应用只发送内容版本号和防缓存参数，不发送手机号、账号或学习进度；服务器可能收到访问所必需的 IP 地址和请求时间。',
      cloudAccountsEnabled
        ? '账号找回通过电子邮件联系开发者完成。用户无需发送原密码，开发者核验注册手机号和最近登录平台后，可在后台设置临时密码。'
        : '本机账号无法远程找回密码。忘记密码时，可在系统设置中清除应用数据后重新注册；本机学习记录会一并删除。',
    ],
  },
  {
    title: '保存期限',
    paragraphs: [
      cloudAccountsEnabled
        ? '本地数据保存在用户设备上，直至用户在设置中删除账号与数据、清除应用数据或卸载应用。云端账号在启用后保存至用户主动删除账号；为安全、审计或法律义务确需保留的最小日志，将在法定期限届满后删除或匿名化。'
        : '账号与学习数据保存在当前设备，直至用户在设置中删除账号与数据、清除应用数据或卸载应用。公开商店版本不使用云端账号，因此服务器不保存账号数据。',
    ],
  },
  {
    title: '账号与数据删除',
    paragraphs: [
      cloudAccountsEnabled
        ? '登录莫兰后，可在“设置 - 隐私与账号 - 删除账号与数据”中输入当前密码完成删除。该操作会清除本机账号、学习进度、错题、收藏和设置，并请求删除对应云端账号与同步进度。'
        : '登录莫兰后，可在“设置 - 隐私与账号 - 删除账号与数据”中输入当前密码完成删除。该操作只清除当前设备的本机账号、学习进度、错题、收藏和设置，不涉及云端账号。',
      cloudAccountsEnabled
        ? '如果云端请求因断网而未能完成，请恢复网络后重试，或通过下方邮箱提出删除请求。为防止冒名删除，开发者可能要求进行必要的身份核验。'
        : '删除后无法恢复。公开商店版本不使用云端账号，因此不存在需要额外删除的云端副本。',
    ],
  },
  {
    title: '权限与用户选择',
    paragraphs: [
      cloudAccountsEnabled
        ? '莫兰不申请通讯录、精确位置、相机、麦克风或广告标识权限。网络权限用于播放第三方发音以及用户主动触发的账号服务。用户可在系统设置中限制网络或清除应用数据。'
        : '莫兰不申请通讯录、精确位置、相机、麦克风或广告标识权限。网络权限用于第三方发音；本机账号不需要账号服务器。用户可在系统设置中限制网络或清除应用数据。',
      '学习提醒需要日历权限：设置学习计划后，莫兰会在每天 18:00 写入一条日历提醒，并在完成当天学习后删除；不读取其他日历事件。当前平台不支持日历写入时，会改为申请通知权限。拒绝这些权限不影响其他学习功能。',
      '日历读取与写入是可选权限：仅在用户启用学习提醒并单独授权后，用于创建和删除莫兰自己的提醒事件，不读取或修改其他日历事件。',
    ],
  },
  {
    title: '未成年人保护',
    paragraphs: [
      '莫兰面向具备相应英语学习需求的用户。未满 18 周岁的未成年人应在监护人指导下使用账号和网络功能；未满 14 周岁的未成年人，应由监护人阅读本政策并代为同意后再使用。若发现未经监护人同意收集了未成年人个人信息，请联系开发者核实并删除。',
    ],
  },
  {
    title: '安全与政策更新',
    paragraphs: [
      '莫兰采用合理的技术与管理措施保护数据，但任何存储或传输方式都无法保证绝对安全。若本政策发生重大变化，应用会在更新说明或应用内显著位置提示；如法律要求重新同意，应用会再次展示同意界面，在用户主动同意前不会继续收集或使用个人信息。',
    ],
  },
];

const TERMS_SECTIONS: Section[] = [
  {
    title: '服务内容',
    paragraphs: [
      '莫兰提供英语词汇学习和学习记录等辅助学习功能。学习结果和记忆状态仅供参考。',
      '应用计划支持 Windows、iOS 和 HarmonyOS。不同平台的具体功能以实际发布版本和商店页面说明为准。',
    ],
  },
  {
    title: '账号与安全',
    items: [
      '用户应提供本人有权使用的手机号，并妥善保管密码和设备。',
      '不得利用莫兰攻击服务、绕过访问控制、批量抓取内容、干扰其他用户或从事违法活动。',
      '发现账号异常时，应及时修改密码、退出登录或联系开发者。',
    ],
  },
  {
    title: '内容与知识产权',
    paragraphs: [
      '应用界面、品牌元素、自有文字与软件代码受适用法律保护。词书内容仅包含英文单词与中文释义；后续加入其他内容时，开发者应确保已取得所需授权。',
      '用户不得复制、出售、批量传播或用于商业培训，除非取得相应权利人书面许可。若权利人认为内容侵权，可通过下方邮箱提交权属证明和具体位置，开发者将依法处理。',
    ],
  },
  {
    title: '第三方链接与服务',
    paragraphs: [
      '在线发音功能可能访问第三方网站或服务。第三方服务的可用性、内容和隐私规则由相应提供方负责。',
    ],
  },
  {
    title: '服务变更与中断',
    paragraphs: [
      '莫兰可能因升级、维护、安全风险、法律要求或第三方服务变化而调整功能。离线功能应尽可能保持可用；对于计划停机或重大变化，应用会通过更新说明或其他合理方式告知。',
    ],
  },
  {
    title: '责任边界',
    paragraphs: [
      '莫兰将尽合理努力提供准确、稳定的学习工具，但不保证内容绝对无误或服务永不中断。因用户设备故障、清除数据、网络环境、第三方服务或不可抗力造成的损失，将在法律允许范围内按适用规则处理。',
    ],
  },
  {
    title: '协议更新与终止',
    paragraphs: [
      '开发者可因功能或法律变化更新本协议。重大变化会以合理方式提示。用户不同意更新后的协议时，可停止使用并删除账号与数据；违反本协议或危害服务安全时，开发者可依法限制或终止相关服务。',
    ],
  },
  {
    title: '适用法律与争议',
    paragraphs: [
      '本协议适用中华人民共和国法律。争议应先由双方友好协商；协商不成时，依法律规定向有管辖权的人民法院提起诉讼。正式运营主体信息以应用商店上架页面为准。',
    ],
  },
];

const PRIVACY_SECTIONS_EN: Section[] = [
  {
    title: 'How consent is obtained and how to decline',
    paragraphs: [
      'Moran does not rely on pre-ticked boxes, implied consent or treating continued use as acceptance. Before first use and before registration or sign-in, the app shows this policy and the Terms of Service and asks you to actively tick the consent box and choose “Agree and continue”. If you do not tick the box or choose “Decline”, the app will not create an account and will not collect or upload the phone number or other personal information you entered.',
      'You may stop using the app at any time and delete your account and data in Settings – Privacy and account – Delete account and data. Withdrawing consent does not affect processing already carried out on the basis of consent. If you withdraw consent and later want to continue using the app, you will need to read and agree again. Reading the privacy policy or terms, or using offline content that does not involve personal information, does not require consent to this policy.',
    ],
  },
  {
    title: 'Features and data processing',
    paragraphs: [
      'The current version of Moran provides general English vocabulary learning and study records. Learning data is stored on the device by default.',
      'The store listing, in-app description and this policy should remain consistent. If a future version adds features that require network access or automated processing, Moran will update this policy, the in-app notice and the store listing before enabling them, and will obtain any necessary consent again under applicable law.',
    ],
  },
  {
    title: 'Scope',
    paragraphs: [
      'This policy applies to the Moran English vocabulary app (“Moran”), which provides vocabulary learning and study records. The operator, contact details and store listing information published in the app store prevail over this summary.',
      cloudAccountsEnabled
        ? 'When you register or sign in, Moran sends your phone number and a password digest to the Moran account service to prevent duplicate registrations, verify sign-in and help an administrator reset a password. The server never stores or displays your plaintext password.'
        : 'The public store build uses a local account. Your phone number and an irreversible password digest stay on this device and are not sent to the Moran account server or synced across devices.',
      'The current public store build includes built-in wordbooks and requests content versions and update packages from moranenglish.cn. Those requests contain only the content version and a cache-busting value, not your phone number, account or learning progress.',
    ],
  },
  {
    title: 'Data we process',
    items: [
      cloudAccountsEnabled
        ? 'Account data: your phone number, irreversible password digests stored locally and on the server, registration time and sign-in state. Moran does not store plaintext passwords.'
        : 'Account data: your phone number, a locally stored irreversible password digest, registration time and sign-in state. This data stays on this device. Moran does not store plaintext passwords.',
      'Learning data: studied words, saved words, review history, study time, check-in dates and preferences.',
      'Device and technical data: crash and diagnostic information, app version and operating-system type needed to operate the app. Device licensing is off by default; only private builds that explicitly enable it use an irreversible device-code digest for licensing. The public store build does not enable device licensing.',
      cloudAccountsEnabled
        ? 'Network data: the account service processes the account, synced content, request time, necessary network logs and IP address for abuse prevention.'
        : 'Network data: the content update service receives the IP address, request time and content version necessary to serve the request. Third-party pronunciation services receive the IP address and technical information necessary to serve the request. Local accounts do not upload your phone number or progress.',
    ],
  },
  {
    title: 'Purpose and storage location',
    paragraphs: [
      'Moran uses this data to provide learning features, save progress, restore sign-in state, diagnose faults, protect service security and meet legal obligations. It is not used for personalised advertising or sold.',
      cloudAccountsEnabled
        ? 'Learning records are stored by default in the app data directory on this device, while account and necessary sync data are stored on the Moran server. Uninstalling the app or clearing app data may make local records unrecoverable.'
        : 'Account and learning records are stored in the app data directory on this device. No cloud account or sync service is used. Uninstalling the app or clearing app data will make the local account and records unrecoverable.',
    ],
  },
  {
    title: 'Third-party services',
    paragraphs: [
      'When online, word pronunciation may request Youdao Dictionary’s public pronunciation service. The provider may receive the IP address and device or browser information necessary to serve the request and process it under its own privacy policy.',
      'Content updates are provided by moranenglish.cn. The app sends only the content version and a cache-busting value, not your phone number, account or learning progress. The server may receive the IP address and request time necessary to serve the request.',
      cloudAccountsEnabled
        ? 'Password recovery is handled by email. You never need to send your current password. After verifying your registered phone number and recent platform, the developer can set a temporary password in the administration system.'
        : 'A local account cannot be recovered remotely. If you forget the password, clear app data in system settings and register again; local learning records will also be deleted.',
    ],
  },
  {
    title: 'Retention',
    paragraphs: [
      cloudAccountsEnabled
        ? 'Local data remains on your device until you delete the account and data, clear app data or uninstall the app. A cloud account remains until you delete it; minimal logs required for security, audit or legal obligations are deleted or anonymised after the statutory period.'
        : 'Account and learning data remain on this device until you delete the account and data, clear app data or uninstall the app. The public store build does not use cloud accounts, so the server stores no account data.',
    ],
  },
  {
    title: 'Account and data deletion',
    paragraphs: [
      cloudAccountsEnabled
        ? 'After signing in, open Settings – Privacy and account – Delete account and data and enter your current password. This clears the local account, progress, mistakes, saved words and settings, and requests deletion of the linked cloud account and synced progress.'
        : 'After signing in, open Settings – Privacy and account – Delete account and data and enter your current password. This clears the local account, progress, mistakes, saved words and settings on this device only.',
      cloudAccountsEnabled
        ? 'If a cloud deletion request cannot complete offline, retry when connected or use the email below. The developer may require identity verification to prevent impersonation.'
        : 'Deletion cannot be undone. The public store build has no cloud account, so there is no cloud copy to delete separately.',
    ],
  },
  {
    title: 'Permissions and choices',
    paragraphs: [
      cloudAccountsEnabled
        ? 'Moran does not request contacts, precise location, camera, microphone or advertising-ID permissions. Network access is used for third-party pronunciation and account services you trigger. You can restrict network access or clear app data in system settings.'
        : 'Moran does not request contacts, precise location, camera, microphone or advertising-ID permissions. Network access is used for third-party pronunciation; local accounts do not need an account server. You can restrict network access or clear app data in system settings.',
      'Notification permission is used only for study reminders you enable. You choose after first sign-in, and declining does not affect local learning.',
    ],
  },
  {
    title: 'Minors',
    paragraphs: [
      'Moran is intended for users with a relevant English-learning need. Users under 18 should use accounts and network features under guardian guidance. For users under 14, a guardian should read this policy and consent on their behalf before use. If personal information from a minor was collected without guardian consent, contact the developer for verification and deletion.',
    ],
  },
  {
    title: 'Security and policy updates',
    paragraphs: [
      'Moran uses reasonable technical and organisational safeguards, but no storage or transmission method is absolutely secure. Material changes will be announced in release notes or prominently in the app. If the law requires fresh consent, the app will show the consent screen again and will not continue collecting or using personal information until the user actively agrees.',
    ],
  },
];

const TERMS_SECTIONS_EN: Section[] = [
  {
    title: 'Service',
    paragraphs: [
      'Moran provides English vocabulary learning and study records. Results and memory states are for reference only.',
      'The app is planned for Windows, iOS and HarmonyOS. Features vary by released build and store listing.',
    ],
  },
  {
    title: 'Accounts and security',
    items: [
      'Use a phone number you are entitled to use and protect your password and device.',
      'Do not attack the service, bypass access controls, scrape content in bulk, disrupt other users or engage in unlawful activity.',
      'If you notice unusual account activity, change your password, sign out or contact the developer promptly.',
    ],
  },
  {
    title: 'Content and intellectual property',
    paragraphs: [
      'The interface, brand elements, original text and software code are protected by applicable law. Wordbook content consists only of English words and Chinese definitions; any additional content must be properly licensed before distribution.',
      'You may not copy, sell, redistribute in bulk or use the content for commercial training without written permission from the relevant rights holder. Rights holders may submit ownership evidence and specific locations to the email below for review.',
    ],
  },
  {
    title: 'Third-party links and services',
    paragraphs: [
      'Online pronunciation may access third-party sites or services. Their availability, content and privacy rules are controlled by those providers.',
    ],
  },
  {
    title: 'Changes and interruptions',
    paragraphs: [
      'Moran may adjust features for upgrades, maintenance, security, legal requirements or third-party changes. Offline features should remain available where possible, and planned downtime or material changes will be communicated through release notes or other reasonable means.',
    ],
  },
  {
    title: 'Limits of responsibility',
    paragraphs: [
      'Moran will make reasonable efforts to provide accurate and stable learning tools, but does not guarantee that all content is error-free or that the service will never be interrupted. Loss caused by device failure, data clearing, network conditions, third-party services or force majeure will be handled within the limits permitted by law.',
    ],
  },
  {
    title: 'Updates and termination',
    paragraphs: [
      'The developer may update these terms for functional or legal changes and will give reasonable notice of material changes. If you do not agree, stop using the app and delete your account and data. The developer may lawfully restrict or terminate service for breach or harm to service security.',
    ],
  },
  {
    title: 'Governing law and disputes',
    paragraphs: [
      'These terms are governed by the laws of the People’s Republic of China. Disputes should first be resolved through good-faith negotiation; if negotiation fails, either party may bring proceedings before a competent people’s court. Operator details in the app store listing prevail.',
    ],
  },
];

export function PrivacyPage() {
  const { language } = useI18n();
  return (
    <LegalDocument
      eyebrow="PRIVACY POLICY"
      title={language === 'en' ? 'Moran Privacy Policy' : '莫兰隐私政策'}
      intro={language === 'en'
        ? 'Moran respects your personal information and learning data. This policy explains how data is stored, used, shared and deleted.'
        : '莫兰重视你的个人信息与学习数据。本政策说明数据如何被保存、使用、共享和删除。'}
      sections={language === 'en' ? PRIVACY_SECTIONS_EN : PRIVACY_SECTIONS}
    />
  );
}

export function TermsPage() {
  const { language } = useI18n();
  return (
    <LegalDocument
      eyebrow="TERMS OF SERVICE"
      title={language === 'en' ? 'Moran Terms of Service' : '莫兰用户协议'}
      intro={language === 'en'
        ? 'Please read these terms before using Moran. They explain the service, account responsibilities, content rights and dispute handling.'
        : '使用莫兰前，请阅读并理解本协议。它说明服务范围、账号责任、内容权利与争议处理方式。'}
      sections={language === 'en' ? TERMS_SECTIONS_EN : TERMS_SECTIONS}
    />
  );
}
