import { Html } from '@react-three/drei';

export { LoadingScreen };

function LoadingScreen() {
  return (
    <Html
      as="div"
      fullscreen
      className="fixed inset-0 bg-black z-50 flex items-center justify-center"
    >
      <div className="text-center">
        <div className="inline-block animate-spin rounded-full h-16 w-16 border-b-2 border-white mb-4"></div>
        <h2 className="text-white text-xl font-semibold mb-2">
          Loading Game Assets
        </h2>
        <p className="text-gray-400">Loading models and textures...</p>
      </div>
    </Html>
  );
}
