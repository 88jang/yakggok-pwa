import { useEffect, useMemo, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAlarmStore, type RepeatMode } from "../store/alarms"

const DAY_LABELS = ["일","월","화","수","목","금","토"]

export default function AlarmEdit() {
  const navigate = useNavigate()
  const { id } = useParams()
  const store = useAlarmStore()

  const existing = useMemo(() => (id ? store.getById(id) : undefined), [id, store.alarms])

  const [time, setTime] = useState(existing?.time ?? "07:30")
  const [label, setLabel] = useState(existing?.label ?? "")
  const [repeatMode, setRepeatMode] = useState<RepeatMode>(existing?.repeatMode ?? "weekday")
  const [days, setDays] = useState<number[]>(existing?.days ?? [1,2,3,4,5])
  const [enabled, setEnabled] = useState(existing?.enabled ?? true)

  useEffect(() => {
    if (existing) {
      setTime(existing.time)
      setLabel(existing.label)
      setRepeatMode(existing.repeatMode)
      setDays(existing.days)
      setEnabled(existing.enabled)
    }
  }, [existing?.id])

  const toggleDay = (d: number) => {
    setDays(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])
  }

  const onSave = (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      time,
      label: label.trim(),
      repeatMode,
      days: repeatMode === "custom" ? [...days].sort((a,b)=>a-b) : (repeatMode === "weekday" ? [1,2,3,4,5] : [0,6]),
      enabled
    }
    if (id && existing) store.update(id, payload)
    else store.add(payload)

    navigate("/")
  }

  return (
    <form onSubmit={onSave} style={{ display: "grid", gap: 12, maxWidth: 480 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700 }}>{id ? "알람 수정" : "알람 추가"}</h1>

      <label style={{ display: "grid", gap: 6 }}>
        <span>시간 (24시간)</span>
        <input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
      </label>

      <label style={{ display: "grid", gap: 6 }}>
        <span>라벨</span>
        <input type="text" placeholder="예: 아침 약" value={label} onChange={(e) => setLabel(e.target.value)} />
      </label>

      <fieldset style={{ display: "grid", gap: 6 }}>
        <legend>반복</legend>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <label><input type="radio" checked={repeatMode === "weekday"} onChange={() => setRepeatMode("weekday")} /> 평일</label>
          <label><input type="radio" checked={repeatMode === "weekend"} onChange={() => setRepeatMode("weekend")} /> 주말</label>
          <label><input type="radio" checked={repeatMode === "custom"} onChange={() => setRepeatMode("custom")} /> 요일별</label>
        </div>
      </fieldset>

      {repeatMode === "custom" && (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {DAY_LABELS.map((d, i) => (
            <label key={i} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
              <input type="checkbox" checked={days.includes(i)} onChange={() => toggleDay(i)} /> {d}
            </label>
          ))}
        </div>
      )}

      <label style={{ display: "inline-flex", alignItems: "center", gap: 8 }}>
        <input type="checkbox" checked={enabled} onChange={() => setEnabled(v => !v)} />
        사용
      </label>

      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit" style={{ background: "#16a34a", color: "white", padding: "8px 12px", borderRadius: 8 }}>
          저장
        </button>
        <button type="button" onClick={() => navigate(-1)}
                style={{ background: "#111827", color: "white", padding: "8px 12px", borderRadius: 8 }}>
          취소
        </button>
      </div>
    </form>
  )
}
