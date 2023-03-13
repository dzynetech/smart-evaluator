import { useState } from "react";
import { Switch } from "@headlessui/react";
import { classNames } from "../utils/classNames";
import useSettingsStore from "../store/settings";

export default function Settings() {
  const autoplayVideos = useSettingsStore((s) => s.videoAutoplay);
  const toggleAutoplayVideos = useSettingsStore((s) => s.toggleVideoAutoplay);

  return (
    <>
      <hr />
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
      {process.env.REACT_APP_COMMIT_HASH && <p className="text-sm mt-4 text-right text-gray-500 font-mono">Build {process.env.REACT_APP_COMMIT_HASH?.substring(0,8)}</p>}
    </>
  );
}
