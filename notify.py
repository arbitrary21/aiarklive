"""
사용법:
  python notify.py "메시지"
  python notify.py "배포 완료" "AIARKLIVE Ops"
"""
import sys
import requests

def notify(msg="✅ 작업 완료!", title="Cursor Task"):
    requests.post(
        "https://ntfy.sh/aiarklive",
        data=msg.encode("utf-8"),
        headers={"Title": title.encode("utf-8").decode("latin-1", errors="replace")},
    )

if __name__ == "__main__":
    msg = sys.argv[1] if len(sys.argv) > 1 else "✅ 작업 완료!"
    title = sys.argv[2] if len(sys.argv) > 2 else "Cursor 작업"
    notify(msg, title)
    print(f"[ntfy] {title}: {msg}")
