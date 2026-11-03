"""
fetch_full_transcript.py
从 lazynote 抓取每篇文章的完整 transcript 文本。
"""
import urllib.request, re, json, html

url = 'https://english-exam.lazynote.cn/cet6/sections/listening/2025-12-1/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
raw = urllib.request.urlopen(req, timeout=15).read().decode('utf-8')

# 找所有 <p> 标签
paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', raw, re.DOTALL)

# 提取纯文本
def clean(p):
    t = re.sub(r'<[^>]+>', '', p)
    t = html.unescape(t)
    return t.strip()

texts = [clean(p) for p in paragraphs]
texts = [t for t in texts if len(t) > 10]

# 找文章边界（Conversation One / Two, Passage One / Two, Recording One / Two / Three）
article_starts = []
for i, t in enumerate(texts):
    if re.match(r'^(Conversation|Passage|Recording)\s+(One|Two|Three)', t, re.IGNORECASE):
        article_starts.append((i, t))
    elif re.match(r'^(Conversation|Passage|Recording)\s*[一二三四五六七八九十]', t, re.IGNORECASE):
        article_starts.append((i, t))

print("Article starts:")
for idx, t in article_starts:
    print(f"  [{idx}] {t[:80]}")

# 输出每篇文章的完整文本
print("\n\n=== FULL TRANSCRIPTS ===\n")
for j, (start_idx, title) in enumerate(article_starts):
    end_idx = article_starts[j+1][0] if j+1 < len(article_starts) else len(texts)
    # 收集这篇文章的所有段落
    article_text = []
    for k in range(start_idx, end_idx):
        t = texts[k]
        # 跳过题目相关的段落
        if re.match(r'^\d+[.\)]', t): continue  # 题号
        if 'What do we learn' in t or 'What is' in t and '?' in t: continue
        if 'Questions' in t: continue
        if 'Section' in t and len(t) < 100: continue
        article_text.append(t)
    full = ' '.join(article_text)
    print(f"\n--- Article {j+1}: {title[:60]} ---")
    print(f"Length: {len(full)} chars, ~{len(full.split())} words")
    print(full[:300])
    print("...")
    print(full[-200:])
