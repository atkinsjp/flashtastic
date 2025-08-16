import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface AvatarCustomizerProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onAvatarChange: (avatar: string) => void;
}

const avatarOptions = [
  {
    id: "1",
    name: "Friendly Girl",
    url: "https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    id: "2", 
    name: "Happy Boy",
    url: "https://images.unsplash.com/photo-1607746882042-944635dfe10e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    id: "3",
    name: "Studious Girl", 
    url: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    id: "4",
    name: "Creative Boy",
    url: "https://images.unsplash.com/photo-1569466896818-335b1bedfcce?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    id: "5",
    name: "Smart Girl",
    url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  },
  {
    id: "6",
    name: "Cheerful Girl",
    url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"
  }
];

export default function AvatarCustomizer({ 
  isOpen, 
  onClose, 
  currentAvatar, 
  onAvatarChange 
}: AvatarCustomizerProps) {
  const [selectedAvatar, setSelectedAvatar] = useState(currentAvatar);

  const handleSave = () => {
    onAvatarChange(selectedAvatar);
  };

  const currentAvatarData = avatarOptions.find(a => a.id === selectedAvatar) || avatarOptions[0];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-gray-800">
            Customize Avatar
          </DialogTitle>
          <DialogDescription>
            Choose your avatar style from the available options
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Current Avatar Preview */}
          <div className="text-center">
            <img 
              src={currentAvatarData.url}
              alt={currentAvatarData.name}
              className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-coral shadow-lg"
            />
            <p className="text-gray-600">Choose your avatar style</p>
          </div>
          
          {/* Avatar Options Grid */}
          <div className="grid grid-cols-3 gap-3">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar.id}
                className={`avatar-option p-2 rounded-xl border-2 transition-all duration-200 ${
                  selectedAvatar === avatar.id 
                    ? 'border-coral shadow-lg transform scale-105' 
                    : 'border-gray-200 hover:border-coral hover:shadow-md'
                }`}
                onClick={() => setSelectedAvatar(avatar.id)}
              >
                <img 
                  src={avatar.url}
                  alt={avatar.name}
                  className="w-16 h-16 rounded-full mx-auto object-cover"
                />
                <p className="text-xs text-gray-600 mt-1 text-center truncate">
                  {avatar.name}
                </p>
              </button>
            ))}
          </div>
          
          {/* Save Button */}
          <Button 
            onClick={handleSave}
            className="w-full bg-coral hover:bg-coral/90 text-white py-3 font-semibold rounded-xl"
          >
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
