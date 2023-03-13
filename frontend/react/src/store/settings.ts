import create from 'zustand'
import {persist } from 'zustand/middleware'

interface SettingsStore {
	videoAutoplay: boolean,
	hideVideos: boolean,
	setVideoAutoplay: (autoplay: boolean) => void
  toggleVideoAutoplay: () => void
	toggleHideVideos: () => void
}

const useSettingsStore= create<SettingsStore>()(
    persist((set) => ({
		videoAutoplay: true,
		hideVideos: false,
		setVideoAutoplay: (v) => set({ videoAutoplay: v }),
		toggleVideoAutoplay: () => set((state) => ({ videoAutoplay: !state.videoAutoplay})),
		toggleHideVideos: () => set((state) => ({ hideVideos: !state.hideVideos})),
    }))
)

export default useSettingsStore