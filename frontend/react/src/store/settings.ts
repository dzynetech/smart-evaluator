import create from 'zustand'
import {persist } from 'zustand/middleware'

interface SettingsStore {
	videoAutoplay: boolean,
	setVideoAutoplay: (autoplay: boolean) => void
  toggleVideoAutoplay: () => void
}

const useSettingsStore= create<SettingsStore>()(
    persist((set) => ({
		videoAutoplay: true,
		setVideoAutoplay: (v) => set({ videoAutoplay: v }),
		toggleVideoAutoplay: () => set((state) => ({ videoAutoplay: !state.videoAutoplay})),
    }))
)

export default useSettingsStore