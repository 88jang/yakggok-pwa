import { Link, useNavigate } from "react-router-dom"
import { useAlarmStore } from "../store/alarms"

function repeatSummary(repeatMode: "weekday" | "weekend" | "custom", days: number[]) {
  if (repeatMode === "weekday") return "평일"
  if (repeatMode === "weekend") return "주말"
  if (!days || days.length === 0) return "반복 없음"
  const map = ["일","월","화","수","목","금","토"]
  return [...days].sort((a,b)=>a-b).map(d => map[d]).join(", ")
}

export default function AlarmList() {
  const navigate = useNavigate()
  const { alarms, toggle, remove } = useAlarmStore()

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>알람 목록</h1>

      {alarms.length === 0 && (
        <div style={{ opacity: 0.8 }}>아직 저장된 알람이 없습니다.</div>
      )}

      <div style={{ display: "grid", gap: 8 }}>
        {alarms.map(a => (
          <div key={a.id}
               style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: 12, border: "1px solid #1f2937", borderRadius: 12, background: "#111827" }}>
            <div onClick={() => navigate(`/edit/${a.id}`)} style={{ cursor: "pointer" }}>
              <div style={{ fontSize: 24, fontWeight: 800 }}>{a.time}</div>
              <div style={{ fontSize: 12, opacity: 0.8 }}>
                {a.label || "라벨 없음"} · {repeatSummary(a.repeatMode, a.days)}
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <label style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                <input type="checkbox" checked={a.enabled} onChange={() => toggle(a.id)} />
                <span>ON/OFF</span>
              </label>
              <button onClick={() => navigate(`/edit/${a.id}`)}
                      style={{ background: "#38bdf8", color: "black", padding: "6px 10px", borderRadius: 8 }}>
                수정
              </button>
              <button onClick={() => remove(a.id)}
                      style={{ background: "#7f1d1d", color: "white", padding: "6px 10px", borderRadius: 8 }}>
                삭제
              </button>
            </div>
          </div>
        ))}
      </div>

      <div>
        <Link to="/edit"
              style={{ background: "#16a34a", color: "white", padding: "8px 12px",
                       borderRadius: 8, textDecoration: "none" }}>
          알람 추가
        </Link>
        <Link to="/preview"
              style={{ marginLeft: 8, background: "#111827", color: "white",
                       padding: "8px 12px", borderRadius: 8, textDecoration: "none" }}>
          팝업 미리보기
        </Link>
      </div>
    </div>
  )
}
