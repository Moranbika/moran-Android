import urllib.request, re, json

url = 'https://english-exam.lazynote.cn/cet6/sections/listening/2025-12-1/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
html = urllib.request.urlopen(req, timeout=15).read().decode('utf-8')

# 找所有 script src
scripts = re.findall(r'<script[^>]*src="([^"]+)"', html)
print(f'Scripts: {len(scripts)}')
for s in scripts:
    print(f'  {s}')

# 找页面内联 script 里的 JSON 数据
inline = re.findall(r'<script[^>]*>(.*?)</script>', html, re.DOTALL)
print(f'\nInline scripts: {len(inline)}')
for i, s in enumerate(inline):
    if len(s.strip()) > 50:
        # 找含时间戳或 transcript 的
        if 'transcript' in s.lower() or 'start' in s.lower() or 'piece' in s.lower() or 'audio' in s.lower():
            print(f'\n--- Inline script {i} (len={len(s)}) ---')
            print(s[:500])
            print('...')
