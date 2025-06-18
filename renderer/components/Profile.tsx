import { MinecraftProfile } from "../types"
import Avatar from "./Avatar";
import Button from "./Button";

interface ProfileProps {
    profile: MinecraftProfile
}

const Profile = ({
    profile
}:ProfileProps) => {

    const handleLogout = () => {
        console.log("logout")
    }

    return (
        <div className="flex flew-row items-center justify-center gap-2 p-4 w-64 rounded fixed right-10 bottom-10 inset z-[49]">
            <Avatar uuid={profile.uuid} size={64} className="rounded shadow-md"/>
            <div className="flex flex-col items-center">
                <span>{profile.name}</span>
                <Button onClick={handleLogout}>Logout</Button>
            </div>
        </div>
    )

}

export default Profile;