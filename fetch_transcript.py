"""
fetch_transcript.py
从 lazynote 抓取完整的听力原文（transcript）文本。
"""
import urllib.request, re, json

url = 'https://english-exam.lazynote.cn/cet6/sections/listening/2025-12-1/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8')

# 找 transcript 段落 - 通常在 class 含 transcript 或原文 的标签里
# 找所有包含完整句子的 <p> 或 <div>
# 先找 section 结构
sections = re.findall(r'<h[23][^>]*>([^<]*(?:Conversation|Passage|Recording|Section)[^<]*)</h[23]>', html, re.IGNORECASE)
print("Sections found:")
for s in sections:
    print(f"  {s.strip()}")

# 找 transcript 文本块
# lazynote 可能用 <div class="lqp-transcript"> 或类似
transcript_blocks = re.findall(r'<div[^>]*class="[^"]*transcript[^"]*"[^>]*>(.*?)</div>', html, re.DOTALL)
print(f"\nTranscript blocks: {len(transcript_blocks)}")

# 找所有 <p> 标签里的英文句子
paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', html, re.DOTALL)
en_paragraphs = []
for p in paragraphs:
    # 去掉 HTML 标签
    text = re.sub(r'<[^>]+>', '', p).strip()
    # 只保留含英文单词的段落
    if len(text) > 50 and re.search(r'[a-zA-Z]{3,}\s+[a-zA-Z]{3,}', text):
        en_paragraphs.append(text)

print(f"\nEnglish paragraphs (>50 chars): {len(en_paragraphs)}")
for i, p in enumerate(en_paragraphs[:10]):
    print(f"\n--- Para {i} (len={len(p)}) ---")
    print(p[:200])
