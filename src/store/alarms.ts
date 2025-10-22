import { create } from "zustand"

export type RepeatMode = "weekday" | "weekend" | "custom"

export type Alarm = {
  id: string
  time: string      // "HH:mm"
  label: string
  repeatMode: RepeatMode
  days: number[]    // 0=일 ~ 6=토
  enabled: boolean
}

type AlarmStore = {
  alarms: Alarm[]
  add: (a: Omit<Alarm, "id">) => string
  update: (id: string, patch: Partial<Omit<Alarm, "id">>) => void
  remove: (id: string) => void
  toggle: (id: string) => void
  getById: (id: string) => Alarm | undefined
}

const STORAGE_KEY = "yakggok_alarms_v1"

function load(): Alarm[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function save(alarms: Alarm[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(alarms)) } catch {}
}

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

export const useAlarmStore = create<AlarmStore>((set, get) => ({
  alarms: load(),
  add: (a) => {
    const id = uid()
    const next = [...get().alarms, { ...a, id }]
    set({ alarms: next }); save(next)
    return id
  },
  update: (id, patch) => {
    const next = get().alarms.map(x => x.id === id ? { ...x, ...patch } : x)
    set({ alarms: next }); save(next)
  },
  remove: (id) => {
    const next = get().alarms.filter(x => x.id !== id)
    set({ alarms: next }); save(next)
  },
  toggle: (id) => {
    const next = get().alarms.map(x => x.id === id ? { ...x, enabled: !x.enabled } : x)
    set({ alarms: next }); save(next)
  },
  getById: (id) => get().alarms.find(x => x.id === id)
}))
