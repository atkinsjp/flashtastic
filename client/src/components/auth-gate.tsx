import AuthModal from './auth-modal';

interface AuthGateProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthGate({ isOpen, onClose }: AuthGateProps) {
  return <AuthModal isOpen={isOpen} onClose={onClose} />;
}