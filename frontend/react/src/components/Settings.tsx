import { Switch } from "@headlessui/react";
import useSettingsStore from "../store/settings";

export default function Settings() {
  const autoplayVideos = useSettingsStore((s) => s.videoAutoplay);
  const hideVideos = useSettingsStore((s) => s.hideVideos);
  const toggleAutoplayVideos = useSettingsStore((s) => s.toggleVideoAutoplay);
  const toggleHideVideos = useSettingsStore((s) => s.toggleHideVideos);

  return (
    <>
      <hr />
      <Switch.Group as="div" className="flex items-center justify-between">
        <span className="flex mb-4 flex-grow flex-col">
          <Switch.Label as="h5" className="font-medium text-gray-900" passive>
           Hide Videos 
          </Switch.Label>
          <Switch.Description as="span" className="text-sm text-gray-500">
            If enabled, videos will not be displayed
          </Switch.Description>
        </span>
        <div className="w-8 h-8 custom-control custom-switch">
          <input
            type="checkbox"
            className="w-8 h-8 custom-control-input"
            id="hide-videos"
            checked={hideVideos}
            onChange={(e) => toggleHideVideos()}
          />
          <label className="custom-control-label" htmlFor="hide-videos"></label>
        </div>
      </Switch.Group>
      <Switch.Group as="div" className="flex items-center justify-between">
        <span className="flex flex-grow flex-col">
          <Switch.Label as="h5" className="font-medium text-gray-900" passive>
            Autoplay Videos
          </Switch.Label>
          <Switch.Description as="span" className="text-sm text-gray-500">
            If enabled, videos will play immediately on loading
          </Switch.Description>
        </span>
        <div className="w-8 h-8 custom-control custom-switch">
          <input
            type="checkbox"
            className="w-8 h-8 custom-control-input"
            id="autoplay"
            checked={autoplayVideos}
            onChange={(e) => toggleAutoplayVideos()}
          />
          <label className="custom-control-label" htmlFor="autoplay"></label>
        </div>
      </Switch.Group>
    </>
  );
}
