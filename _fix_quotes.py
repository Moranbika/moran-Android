# -*- coding: utf-8 -*-
import io, re
p = r"C:\Users\Moranbika\Doubao\chats\2026-10-07\new-chat-2\cet6-practice\_patch_x1u1.py"
s = io.open(p, encoding="utf-8").read()
# 逐行处理：mnemonic 字段里如果夹了英文双引号，替换成「」
out = []
for line in s.split("\n"):
    if '"mnemonic"' in line:
        # 形如  "mnemonic":"....",
        m = re.match(r'^(\s*"mnemonic"\s*:\s*")(.*)(",?\s*)$', line)
        if m:
            head, body, tail = m.group(1), m.group(2), m.group(3)
            # 把 body 里成对出现的 " 换成 「」
            res = []
            open_q = True
            for ch in body:
                if ch == '"':
                    res.append("「" if open_q else "」")
                    open_q = not open_q
                else:
                    res.append(ch)
            line = head + "".join(res) + tail
    out.append(line)
io.open(p, "w", encoding="utf-8").write("\n".join(out))
print("fixed")
