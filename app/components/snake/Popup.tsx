export type { PopupProps };
export { Popup };

interface PopupProps {
  name: string;
  isOpaque: boolean;
  text: string;
  textColor: string;
}

function Popup({ name, isOpaque, text, textColor }: PopupProps) {
  return (
    <div
      id={name}
      className={`absolute top-1/2 left-1/2 ${textColor} font-mono text-2xl sm:text-5xl`}
      style={{
        opacity: isOpaque ? 1 : 0,
        transform: 'translate(-50%, -80%)',
      }}
    >
      {text}
    </div>
  );
}
