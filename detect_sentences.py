"""
detect_sentence_boundaries.py
用 ffmpeg silencedetect 检测 cettong mp3 中每篇文章内的静音段，
输出每句话的起止时间，用于精确高亮。
"""
import subprocess, re, json, sys, os
import imageio_ffmpeg

FFMPEG = imageio_ffmpeg.get_ffmpeg_exe()
print(f"ffmpeg: {FFMPEG}", file=sys.stderr)

# 下载 cettong mp3 到临时文件
import urllib.request
mp3_url = "https://www.cettong.cn/library/cet6/2025_12_1/listening.mp3"
mp3_path = os.path.join(os.path.dirname(__file__), "cet6_2025_12_1.mp3")

if not os.path.exists(mp3_path):
    print(f"Downloading {mp3_url} ...", file=sys.stderr)
    urllib.request.urlretrieve(mp3_url, mp3_path)
    print(f"Downloaded: {os.path.getsize(mp3_path)} bytes", file=sys.stderr)

# 检测静音段（-40dB, 最短0.8秒）
cmd = [
    FFMPEG, "-hide_banner", "-i", mp3_path,
    "-af", "silencedetect=noise=-40dB:d=0.8",
    "-f", "null", "-"
]
proc = subprocess.run(cmd, capture_output=True, text=True)
log = proc.stderr

silences = []
starts = [float(m) for m in re.findall(r"silence_start: ([\d.]+)", log)]
ends = [float(m) for m in re.findall(r"silence_end: ([\d.]+)", log)]
for s, e in zip(starts, ends):
    if e > s:
        silences.append((s, e))

# 文章时间范围（已知）
articles = [
    {"part": "A", "title": "Conversation One", "start": 37.9, "end": 221.724},
    {"part": "A", "title": "Conversation Two", "start": 237.468, "end": 407.564},
    {"part": "B", "title": "Passage One", "start": 452.156, "end": 598.428},
    {"part": "B", "title": "Passage Two", "start": 614.044, "end": 796.364},
    {"part": "C", "title": "Recording One", "start": 836.62, "end": 1040.3},
    {"part": "C", "title": "Recording Two", "start": 1056.204, "end": 1282.924},
    {"part": "C", "title": "Recording Three", "start": 1298.396, "end": 1526.412},
]

# 对每篇文章，找出文章内的静音段，作为句子边界
result = []
for art in articles:
    art_silences = [(s, e) for s, e in silences if s > art["start"] and e < art["end"]]
    # 句子边界 = 静音段的中点
    boundaries = [art["start"]]
    for s, e in art_silences:
        mid = (s + e) / 2.0
        boundaries.append(mid)
    boundaries.append(art["end"])
    
    # 每句话的起止时间
    segments = []
    for i in range(len(boundaries) - 1):
        segments.append({
            "start": round(boundaries[i], 2),
            "end": round(boundaries[i+1], 2),
        })
    
    result.append({
        "part": art["part"],
        "title": art["title"],
        "start": art["start"],
        "end": art["end"],
        "silence_count": len(art_silences),
        "segments": segments,
    })
    print(f"{art['title']}: {len(art_silences)} silences, {len(segments)} segments", file=sys.stderr)

print(json.dumps(result, ensure_ascii=False, indent=2))
