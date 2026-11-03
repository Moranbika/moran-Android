# -*- coding: utf-8 -*-
"""把浅灰背景透明化，保留莫字和四角图标（纯 PIL，不依赖 numpy）。"""
from PIL import Image, ImageFilter
from collections import deque

SRC = r"C:\Users\Moranbika\Doubao\chats\2026-10-07\new-chat-2\cet6-practice\icons\莫兰图标-去水印.png"
OUT = r"C:\Users\Moranbika\Doubao\chats\2026-10-07\new-chat-2\cet6-practice\icons\莫兰图标-透明.png"

img = Image.open(SRC).convert("RGBA")
w, h = img.size
px = img.load()

# 四角背景参考色
bg = [0.0, 0.0, 0.0]
for (r, c) in ((2, 2), (2, w - 3), (h - 3, 2), (h - 3, w - 3)):
    p = px[c, r]
    for i in range(3):
        bg[i] += p[i]
for i in range(3):
    bg[i] /= 4.0

THR = 36  # 单通道容差
LIMIT = THR * 3  # 曼哈顿距离上限

def is_bg(r, c):
    p = px[c, r]
    return abs(p[0] - bg[0]) + abs(p[1] - bg[1]) + abs(p[2] - bg[2]) < LIMIT

visited = [[False] * w for _ in range(h)]
q = deque()
for (r, c) in ((0, 0), (0, w - 1), (h - 1, 0), (h - 1, w - 1)):
    visited[r][c] = True
    q.append((r, c))

while q:
    r, c = q.popleft()
    for dr, dc in ((1, 0), (-1, 0), (0, 1), (0, -1)):
        nr, nc = r + dr, c + dc
        if 0 <= nr < h and 0 <= nc < w and not visited[nr][nc] and is_bg(nr, nc):
            visited[nr][nc] = True
            q.append((nr, nc))

alpha = Image.new("L", (w, h), 255)
ap = alpha.load()
for r in range(h):
    row = visited[r]
    for c in range(w):
        if row[c]:
            ap[c, r] = 0

alpha = alpha.filter(ImageFilter.GaussianBlur(0.9))

r_ch = img.split()[0]; g_ch = img.split()[1]; b_ch = img.split()[2]
final = Image.merge("RGBA", (r_ch, g_ch, b_ch, alpha))

bbox = final.getbbox()
if bbox:
    pad = 8
    x0 = max(0, bbox[0] - pad); y0 = max(0, bbox[1] - pad)
    x1 = min(w, bbox[2] + pad); y1 = min(h, bbox[3] + pad)
    final = final.crop((x0, y0, x1, y1))

final.save(OUT)
print("OK", OUT, final.size)
