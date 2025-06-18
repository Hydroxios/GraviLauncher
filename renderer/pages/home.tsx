"use client";

import { useEffect, useState } from "react";
import WindowControls from "../components/WindowControls";
import Loader from "../components/Loader";

import { Instance, MinecraftProfile } from "../types";
import Profile from "../components/Profile";
import InstanceList from "../components/InstanceList";
import CreationModal from "../components/CreationModal";
import Controls from "../components/Controls";

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<MinecraftProfile | undefined>();
  const [modalOpen, setModalOpen] = useState(false)
  const [instances, setInstances] = useState<Instance[]>([])

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
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <WindowControls />
      {loading ? <Loader /> : profile && 
        <div className="flex flex-row">
          <Profile profile={profile} />
          <Controls onCreate={() => setModalOpen(true)}/>
          <div className="flex-1">
            <div className="w-full h-full">
                <InstanceList instances={instances} openModal={() => setModalOpen(true)}/>
                <CreationModal open={modalOpen} onClose={() => setModalOpen(false)}/>
            </div>
          </div>
        </div>
      }
    </div>
  );
}
