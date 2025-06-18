import { useState, useEffect } from "react";

interface VersionSelectorProps {
  instanceType: string;
  title: string;
  vanillaVersion?: string;
  onChange?: (version: string) => void;
}

export default function VersionSelector({
  instanceType,
  title,
  vanillaVersion,
  onChange,
}: VersionSelectorProps) {
  const [versions, setVersions] = useState<string[]>([]);
  const [selected, setSelected] = useState<string>("");

  async function fetchNeoForgeVersions(): Promise<string[]> {
    const url = 'https://maven.neoforged.net/releases/net/neoforged/neoforge/maven-metadata.xml';
  
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`Erreur HTTP ${res.status}`);
  
      const xmlText = await res.text();
  
      // Parser le XML
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
  
      const versions = Array.from(
        xmlDoc.querySelectorAll('versions > version')
      ).map((el) => el.textContent || '');


      return versions.filter(v => v); // filtre les vides
    } catch (error) {
      console.error('Erreur fetch NeoForge versions:', error);
      return [];
    }
  }
  

  useEffect(() => {
    const fetchVersions = async () => {
      let url: string;

      switch (instanceType) {
        case "vanilla": {
            try {
                const res = await fetch("https://piston-meta.mojang.com/mc/game/version_manifest.json");
                const data = await res.json();
        
                let list: string[] = [];
        
                if (instanceType === "vanilla") {
                    list = data.versions
                        .filter((v: { type: string }) => v.type === 'release')
                        .map((v: { id: string }) => v.id);
                } else {
                  list = data.versions; // doit déjà être un string[]
                }
        
                setVersions(list);
                setSelected(list[0]);
                onChange?.(list[0]);
            } catch {}
        } break;
        case "neoforge":
          let list = await fetchNeoForgeVersions()
          list = list.filter((v) => v.startsWith(vanillaVersion.substring(2)))
          setVersions(list)
          setSelected(list[0])
          onChange?.(list[0]);
          break;
        default:
          setVersions([]);
          return;
      }
    };

    fetchVersions();
  }, [instanceType, vanillaVersion]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(e.target.value);
    onChange?.(e.target.value);
  };

  if (!versions.length) return null;

  return (
    <div className="flex flex-col gap-2 pb-2">
      <label className="font-semibold">{title} :</label>
      <select
        className="bg-white/10 backdrop-blur-md border border-white/30 rounded text-white p-2 focus:outline-none focus:ring-2 focus:ring-white/40 shadow-md"
        value={selected}
        onChange={handleChange}
      >
        {versions.map((ver) => (
          <option key={ver} value={ver} className="bg-black text-white">
            {ver}
          </option>
        ))}
      </select>
    </div>
  );
}
