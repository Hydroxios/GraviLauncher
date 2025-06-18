"use client";

import { useEffect, useState, useCallback } from "react";
import WindowControls from "../components/WindowControls";
import Loader from "../components/Loader";

import { Instance, MinecraftProfile } from "../types";
import Profile from "../components/Profile";
import InstanceList from "../components/InstanceList";
import CreationModal from "../components/CreationModal";
import Controls from "../components/Controls";
import SettingsModal from "../components/SettingsModal";
import LaunchingInfoWidget from "../components/LaunchingInfoWidget";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MinecraftProfile | undefined>();
  const [modalOpen, setModalOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [instances, setInstances] = useState<Instance[]>([])
  const [launching, setLaunching] = useState(false);
  const [launchInstance, setLaunchInstance] = useState<Instance | undefined>();
  const [launchState, setLaunchState] = useState<{ type: string, value?: any } | null>(null);

  useEffect(() => {
    window.ipc.on("instances", (instances: Instance[]) => {
      setInstances(instances)
      setLoading(false);
    })
    window.ipc.on("user", (user: MinecraftProfile) => {
      setProfile(user);
      window.ipc.send("instances", null)
    });
    window.ipc.send("login", null);

    const handler = (data: any) => {
      if (data.type === 'start') {
        setLaunching(true);
        setLaunchInstance(data.instance);
        setLaunchState({ type: 'start' });
      } else if (data.type === 'close') {
        setLaunchState(data);
        setTimeout(() => {
          setLaunching(false);
          setLaunchInstance(undefined);
          setLaunchState(null);
        }, 2000);
      } else if (data.type === 'error') {
        setLaunchState(data);
      } else if(data.type === "playing") {
        setLaunchState({type: "playing"})
      } else if (launching) {
        setLaunchState(data);
      }
    };
    window.ipc.on('launch-progress', (data) => handler(data));
  }, [launching]);

  const handleLaunch = useCallback(() => {
    setLaunching(true);
    setLaunchState(null);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <WindowControls />
      {loading ? <Loader /> : profile && 
        <div className="flex flex-row">
          <Profile profile={profile} />
          <Controls onCreate={() => setModalOpen(true)} onSettings={() => setSettingsOpen(true)}/>
          <div className="flex-1">
            <div className="w-full h-full">
                <InstanceList instances={instances} openModal={() => setModalOpen(true)} onLaunch={handleLaunch}/>
                <CreationModal open={modalOpen} onClose={() => setModalOpen(false)}/>
                <SettingsModal open={settingsOpen} onClose={() => setSettingsOpen(false)}/>
                <LaunchingInfoWidget open={launching} instance={launchInstance} state={launchState} onClose={() => { setLaunching(false); setLaunchInstance(undefined); setLaunchState(null); }} />
            </div>
          </div>
        </div>
      }
    </div>
  );
}
