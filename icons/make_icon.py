# -*- coding: utf-8 -*-
"""把透明图标转成多尺寸 .ico 与 PNG（窗口/安装程序/托盘用）。"""
from PIL import Image

SRC = r"C:\Users\Moranbika\Doubao\chats\2026-10-07\new-chat-2\cet6-practice\icons\莫兰图标-透明.png"
BASE = r"C:\Users\Moranbika\Doubao\chats\2026-10-07\new-chat-2\cet6-practice\icons"

img = Image.open(SRC).convert("RGBA")

# 以 256 为基准，保持比例缩到 256 内，贴正方形画布居中
def fit(sz):
    target = Image.new("RGBA", (sz, sz), (0, 0, 0, 0))
    ratio = min(sz / img.width, sz / img.height)
    nw = max(1, round(img.width * ratio))
    nh = max(1, round(img.height * ratio))
    resized = img.resize((nw, nh), Image.LANCZOS)
    target.paste(resized, ((sz - nw) // 2, (sz - nh) // 2), resized)
    return target

# 生成各尺寸 PNG
for sz in (256, 128, 64, 48, 32, 16):
    fit(sz).save(f"{BASE}\\莫兰图标-{sz}.png")
    print("png", sz)

# 生成多尺寸 ICO
ico256 = fit(256)
ico256.save(f"{BASE}\\莫兰.ico", sizes=[(16, 16), (24, 24), (32, 32), (48, 48), (64, 64), (128, 128), (256, 256)])
print("ico ok")
