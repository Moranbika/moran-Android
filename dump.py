import urllib.request, re, html

url = 'https://english-exam.lazynote.cn/cet6/sections/listening/2025-12-1/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
raw = urllib.request.urlopen(req, timeout=15).read().decode('utf-8')

# 找所有 <p> 标签
paragraphs = re.findall(r'<p[^>]*>(.*?)</p>', raw, re.DOTALL)

def clean(p):
    t = re.sub(r'<[^>]+>', '', p)
    t = html.unescape(t)
    return t.strip()

texts = [clean(p) for p in paragraphs]
texts = [t for t in texts if len(t) > 20]

# 输出所有英文段落（含说话人标记的）
for i, t in enumerate(texts):
    if re.search(r'[a-zA-Z]{4,}\s+[a-zA-Z]{4,}', t):
        print(f"[{i}] {t[:150]}")
