import urllib.request, re, sys

url = 'https://english-exam.lazynote.cn/cet6/sections/listening/2025-12-1/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8')

# 找时间戳相关 pattern
patterns = [
    r'data-start="([\d.]+)"',
    r'data-time="([\d.]+)"',
    r'data-t="([\d.]+)"',
    r'data-sec="([\d.]+)"',
    r'start="([\d.]+)"',
]
for p in patterns:
    matches = re.findall(p, html)
    if matches:
        print(f'{p}: {len(matches)} matches, first 5: {matches[:5]}')

# 找含时间戳的 HTML 标签
# 找所有带 data- 属性的标签
data_tags = re.findall(r'<[^>]*data-[a-z]+="[\d.]+"[^>]*>', html)
print(f'\nTags with data-time attributes: {len(data_tags)}')
if data_tags:
    for t in data_tags[:8]:
        print(t[:250])

# 找 transcript 相关 class
tr = re.findall(r'class="[^"]*"', html)
from collections import Counter
classes = Counter(tr)
print('\nTop classes:')
for c, n in classes.most_common(20):
    print(f'  {n}: {c[:120]}')
