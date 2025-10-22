import { useEffect, useRef, useState } from "react"

export default function PopupPreview() {
  const [audioReady, setAudioReady] = useState(false)
  const [show, setShow] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)

  const enableAudio = async () => {
    if (!audioCtxRef.current) {
      const Ctx: any = (window as any).AudioContext || (window as any).webkitAudioContext
      const ctx = new Ctx()
      const buffer = ctx.createBuffer(1, 1, 22050)
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.start(0)
      audioCtxRef.current = ctx
    }
    setAudioReady(true)
  }

  const playTone = () => {
    const ctx = audioCtxRef.current
    if (!ctx) return
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = "sine"
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.0)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 1.0)
  }

  useEffect(() => {
    if (show && audioReady) playTone()
  }, [show, audioReady])

  return (
    <div>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12 }}>팝업 미리보기</h1>

      {!audioReady && (
        <button onClick={enableAudio}
                style={{ background: "#16a34a", color: "white", padding: "8px 12px", borderRadius: 8 }}>
          사운드 활성화
        </button>
      )}

      <div style={{ marginTop: 12, display: "flex", gap: 8 }}>
        <button onClick={() => setShow(true)}
                style={{ background: "#38bdf8", color: "black", padding: "8px 12px", borderRadius: 8 }}>
          팝업 열기
        </button>
        <button onClick={() => setShow(false)}
                style={{ background: "#111827", color: "white", padding: "8px 12px", borderRadius: 8 }}>
          닫기
        </button>
      </div>

      {show && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)",
          display: "grid", placeItems: "center", zIndex: 50
        }}>
          <div style={{
            width: "min(92vw, 420px)", background: "#111827",
            borderRadius: 12, padding: 16, border: "1px solid #1f2937"
          }}>
            <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>알람</div>
            <div style={{ fontSize: 32, fontWeight: 800, marginBottom: 8 }}>07:30</div>
            <div style={{ opacity: 0.85, marginBottom: 16 }}>라벨 예시: 아침 약</div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShow(false)}
                      style={{ background: "#16a34a", color: "white", padding: "8px 12px", borderRadius: 8 }}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      <p style={{ marginTop: 12, opacity: 0.8 }}>
        웹 브라우저 제한으로 백그라운드/화면 꺼짐 상태에서는 알람이 자동으로 실행되지 않습니다.
      </p>
    </div>
  )
}
